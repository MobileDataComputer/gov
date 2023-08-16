<template>
	<div id="map">
		<div class="menu">
			<v-btn color="white">
				EDIT
			</v-btn>
		</div>
		<div id="mapStyleChangerContainer">
			<div class="dark" v-if="mapstyle === 'satelite'" @click="toggleMapStyle()">
				<div class="text">
					<v-icon icon="mdi-layers-triple"></v-icon>
					<h4>Straturi</h4>
				</div>
			</div>
			<div class="satelite" v-if="mapstyle === 'dark'" @click="toggleMapStyle()">
				<div class="text">
					<v-icon icon="mdi-layers-triple"></v-icon>
					<h4>Straturi</h4>
				</div>
			</div>
		</div>
		<v-dialog v-model="dialogCamine" width="1000" prepend-icon="mdi-home" class="mx-auto" scrim>
			<v-card class="pa-4">
				<v-card-title>
					Camin Nr.{{modalData.entity_list_id}}
				</v-card-title>
				<v-card-subtitle>Detalii</v-card-subtitle>

				<v-carousel show-arrows="hover" hide-delimiters>
					<v-carousel-item v-for="(imageData, index) in imageResponses" :key="index" cover>
						<img :src="imageData" alt="Image" />
					</v-carousel-item>
				</v-carousel>

				<v-file-input
					class="pa-4"
					v-model="selectedImages"
					accept="image/*"
					label="Incarca imagini"
					prepend-icon="mdi-camera"
					chips
					multiple
					show-size
					counter
				></v-file-input>
				<v-btn color="blue" variant="flat" @click="optimizeAndUpload" :disabled="!selectedImages || selectedImages.length === 0" :loading="modalImageUploadLoading">Incarca poze</v-btn>

				<v-card-actions>
					<v-btn color="red" variant="outlined" @click="dialogCamine = false" class="">Anulare</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="dialogRezervor" width="auto" scrim>
			<v-card>
				<v-card-text>
					Rezervoare
				</v-card-text>
				<v-card-actions>
					<v-btn color="secondary" block="" @click="dialogRezervor = false">Close Dialog</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="dialogHidrofoare" width="auto" scrim>
			<v-card>
				<v-card-text>
					Hidrofoare
				</v-card-text>
				<v-card-actions>
					<v-btn color="secondary" block="" @click="dialogHidrofoare = false">Close Dialog</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="dialogContoare" width="auto" scrim>
			<v-card>
				<v-card-text>
					Contoare
				</v-card-text>
				<v-card-actions>
					<v-btn color="secondary" block="" @click="dialogContoare = false">Close Dialog</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import {onMounted, onUpdated, ref, watch} from 'vue'
import stringToColor from '../helpers/stringToColor.js'
import axios from 'axios';
import {helpers} from "@turf/turf";

const props = defineProps(['options'])

const popup = ref(null);
const popupCluster = ref(null);

const pointsDimenstions = {
	"camine_radius": 5,
	"conducte_width": 2,
	"hidrofoare_radius": 4,
	"rezervoare_radius": 8,
	"contoare_radius": 5,
}

const pointsDisplayStatus = {
	camine: ref(false),
	conducte: ref(false),
  conducteTureni: ref(false),
	hidrofoare: ref(false),
	rezervoare: ref(false),
	contoare: ref(false),
	zones: ref(true),
	nrCase: ref(false)
}

const markers = ref([]);

const clusterMaxZoom = 14;
const clusterRadius = 50;

const mapstyle = ref('dark')

let map;

const dialogCamine = ref(false);
const dialogRezervor = ref(false);
const dialogHidrofoare = ref(false);
const dialogContoare = ref(false);
const clickedElement = ref();
const modalData = ref({});
const selectedImages = ref(null);
const modalImageUploadLoading = ref(false);
const imageResponses = ref([]);

function resizeImageToMaxDimensions(imageWidth, imageHeight, maxWidth, maxHeight) {
	// Calculate scaling factors for width and height
	const scaleFactorWidth = maxWidth / imageWidth;
	const scaleFactorHeight = maxHeight / imageHeight;

	// Choose the smaller of the two scaling factors
	const finalScaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);

	// Calculate new dimensions
	const newWidth = imageWidth * finalScaleFactor;
	const newHeight = imageHeight * finalScaleFactor;

	return { newWidth, newHeight };
}

const getBase64 = async file => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			resolve(reader.result);
		};
		reader.onerror = error => {
			reject(error);
		};
	});
};


const optimizeAndUpload = async () => {
	modalImageUploadLoading.value = true;
	const base64s = [];
	for (const selectedFile of selectedImages.value) {
		if (!selectedFile) {
			continue;
		}

		const originalFile = selectedFile;
		const fileName = originalFile.name.split('.')[0];
		const img = new Image();
		img.src = URL.createObjectURL(originalFile);

		await new Promise(resolve => {
			img.onload = resolve;
		});

		const canvas = document.createElement('canvas');
		const { newWidth, newHeight } = resizeImageToMaxDimensions(img.width, img.height, 1920, 1080);
		canvas.width = newWidth;
		canvas.height = newHeight;

		const ctx = canvas.getContext('2d');
		const scale = Math.min(canvas.width / newWidth, canvas.height / newHeight);
		const origin = {
			x: (canvas.width - newWidth * scale) / 2,
			y: (canvas.height - newHeight * scale) / 2
		};

		ctx.setTransform(scale, 0, 0, scale, origin.x, origin.y);
		ctx.drawImage(img, 0, 0, newWidth, newHeight);

		const blobPromise = new Promise(resolve => {
			canvas.toBlob(resolve, 'image/jpeg', 0.8);
		});

		const blob = await blobPromise;
		const compressedFile = new File([blob], fileName + ".jpeg");

		const base64 = await getBase64(compressedFile);
		base64s.push(base64);
	}
	const options = {
		method: 'POST',
		url: `${import.meta.env.VITE_BASEURL}/images/upload_images_entities`,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('JWT')}`
		},
		data: {
			id: modalData.value.id,
			entity_type: modalData.value.type_id,
			base64: base64s
		}
	}

	axios.request(options).then(function (response) {
		modalImageUploadLoading.value = false;
		console.log(response.data);
	}).catch(function (error) {
		console.error(error);
	});
};


watch(dialogCamine, (newVal) => {
	if (newVal === true) {
		const optionsProperties = {
			method: 'POST',
			url: `${import.meta.env.VITE_BASEURL}/map/camine_properties`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('JWT')}`
			},
			data: { "id": clickedElement.value.id }
		};
		axios.request(optionsProperties).then(function (response) {
			modalData.value = response.data[0];
			modalData.value.type_id = clickedElement.value.type_id;
			const options = {
				method: 'POST',
				url: `${import.meta.env.VITE_BASEURL}/images/retrive_images_entities`,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('JWT')}`
				},
				data: { "id": modalData.value.id }
			};

			axios.request(options).then(function (response) {
				imageResponses.value = response.data;
				console.log(imageResponses.value)
			}).catch(function (error) {
				console.error(error);
			});
		}).catch(function (error) {
			console.error(error);
		});
	}
})

const addMapContols = (map) => {
	map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right')
}

onUpdated(() => {
	if (props.options.includes("Camine") && !pointsDisplayStatus.camine.value) {
		pointsDisplayStatus.camine.value = true;
		loadCamine();
	}
	else if (pointsDisplayStatus.camine.value === true && !props.options.includes("Camine")) {
		map.removeLayer('clusters_camine');
		map.removeLayer('cluster_count_camine')
		map.removeLayer('camine')
		if(map.getSource('camine')) map.removeSource('camine');
		pointsDisplayStatus.camine.value = false;
		if (popup.value) {
			popup.value.remove();
		}
	}

	if(props.options.includes("Numere Case") && !pointsDisplayStatus.nrCase.value) {
		pointsDisplayStatus.nrCase.value = true;
		loadNrCase();
	}
	else if(pointsDisplayStatus.nrCase.value === true && !props.options.includes("Numere Case")) {
		if(map.getLayer('nr_case_text')) map.removeLayer('nr_case_text');
		if(map.getLayer('nr_case')) map.removeLayer('nr_case');
		if(map.getSource('nr_case')) map.removeSource('nr_case');
		pointsDisplayStatus.nrCase.value = false;
	}

	if (props.options.includes("Conducte") && !pointsDisplayStatus.conducte.value) {
		pointsDisplayStatus.conducte.value = true;
		loadConducte();
	}
	else if (pointsDisplayStatus.conducte.value === true && !props.options.includes("Conducte")) {
		map.removeLayer('conducte')
		if(map.getSource('conducte')) map.removeSource('conducte');
		pointsDisplayStatus.conducte.value = false;
		if (popup.value) {
			popup.value.remove();
		}
	}

  if (props.options.includes("Conducte Tureni") && !pointsDisplayStatus.conducteTureni.value) {
    pointsDisplayStatus.conducteTureni.value = true;
    loadConducteTureni();
  }
  else if (pointsDisplayStatus.conducte.value === true && !props.options.includes("Conducte")) {
    map.removeLayer('conducte-tureni')
    map.removeSource('conducte-tureni')
    pointsDisplayStatus.conducteTureni.value = false;
    if (popup.value) {
      popup.value.remove();
    }
  }

	if (props.options.includes("Hidrofoare") && !pointsDisplayStatus.hidrofoare.value) {
		pointsDisplayStatus.hidrofoare.value = true;
		loadHidrofoare();
	}
	else if (pointsDisplayStatus.hidrofoare.value === true && !props.options.includes("Hidrofoare")) {
		map.removeLayer('hidrofoare')
		if(map.getSource('hidrofoare')) map.removeSource('hidrofoare');
		pointsDisplayStatus.hidrofoare.value = false;
		if (popup.value) {
			popup.value.remove();
		}
	}

	if (props.options.includes("Rezervoare") && !pointsDisplayStatus.rezervoare.value) {
		pointsDisplayStatus.rezervoare.value = true;
		loadRezervoare();
	}
	else if (pointsDisplayStatus.rezervoare.value === true && !props.options.includes("Rezervoare")) {
		// Remove each marker from the map
		markers.value.forEach(marker => marker.remove());

		// Clear the markers array
		markers.value = [];
		if(map.getSource('rezervoare')) map.removeSource('rezervoare');
		pointsDisplayStatus.rezervoare.value = false;
		if (popup.value) {
			popup.value.remove();
		}
	}

	if (props.options.includes("Contoare") && !pointsDisplayStatus.contoare.value) {
		pointsDisplayStatus.contoare.value = true;
		loadContoare();
	}
	else if (pointsDisplayStatus.contoare.value === true && !props.options.includes("Contoare")) {
		map.removeLayer('clusters_contoare');
		map.removeLayer('cluster_count_contoare');
		map.removeLayer('contoare');
		if(map.getSource('contoare')) map.removeSource('contoare');
		pointsDisplayStatus.contoare.value = false;
		if (popup.value) {
			popup.value.remove();
		}
	}
})

const geojsonFeaturesNrCase = ref();
const geojsonFeaturesCollectionNrCase = ref();
const optionsNrCase = {
	method: 'GET',
	url: `${import.meta.env.VITE_BASEURL}/map/nr_case`,
	headers: {
		Authorization: `Bearer ${localStorage.getItem('JWT')}`
	}
};

async function getDataNrCase() {
	try {
		const response = await axios.request(optionsNrCase);
		geojsonFeaturesNrCase.value = response.data.map(item => {
			return {
				type: "Feature",
				properties: {
					id: item.id,
					number: item.number,
				},
				geometry: {
					type: "Point",
					coordinates: JSON.parse(item.coordinates)
				}
			};
		})
		geojsonFeaturesCollectionNrCase.value = {
			type: "FeatureCollection",
			features: geojsonFeaturesNrCase.value
		};
	} catch (e) {
	console.log(e);
	}
}

const loadNrCase = () => {
	if (!geojsonFeaturesNrCase.value) {
		getDataNrCase();
	}

	const zoomThreshold = 17; // Adjust this threshold value as needed
	const currentZoom = map.getZoom();
	let isZoomedInEnough = currentZoom >= zoomThreshold;

	if (pointsDisplayStatus.nrCase.value === true && isZoomedInEnough) {
		if (!map.getSource("nr_case")) {
			map.addSource("nr_case", {
				type: "geojson",
				data: geojsonFeaturesCollectionNrCase.value,
			});

			map.addLayer({
				id: "nr_case",
				type: "circle",
				source: "nr_case",
				paint: {
					"circle-color": "#ffffff",
					"circle-radius": [
						"case",
						["has", "number"],
						10, // Increase the circle radius for features with a "number" property
						6, // Default circle radius
					],
					"circle-stroke-width": 1,
					"circle-stroke-color": "#1f1f1f",
				},
			});

			map.addLayer({
				id: "nr_case_text",
				type: "symbol",
				source: "nr_case",
				layout: {
					"text-field": ["get", "number"], // Display the "number" property on each circle
					"text-size": 12, // Text size
					"text-offset": [0, 0], // Text offset
				},
				paint: {
					"text-color": "#000000", // Text color
					"text-halo-color": "#ffffff", // Text halo color
					"text-halo-width": 1, // Text halo width
				},
			});
		}
	} else {
		// Zoomed out or pointsDisplayStatus.nrCase.value is false, remove the source and layers
		if (map.getSource("nr_case")) {
			map.removeLayer("nr_case");
			map.removeLayer("nr_case_text");
			map.removeSource("nr_case");
		}
	}

	// Add a listener for the "zoom" event
	map.on("zoom", () => {
		const newZoom = map.getZoom();
		const isNewZoomedInEnough = newZoom >= zoomThreshold;

		if (pointsDisplayStatus.nrCase.value === true && isNewZoomedInEnough !== isZoomedInEnough) {
			if (isNewZoomedInEnough) {
				// Zoomed in, load points
				if (!map.getSource("nr_case")) {
					map.addSource("nr_case", {
						type: "geojson",
						data: geojsonFeaturesCollectionNrCase.value,
					});

					map.addLayer({
						id: "nr_case",
						type: "circle",
						source: "nr_case",
						paint: {
							"circle-color": "#ffffff",
							"circle-radius": [
								"case",
								["has", "number"],
								10, // Increase the circle radius for features with a "number" property
								6, // Default circle radius
							],
							"circle-stroke-width": 1,
							"circle-stroke-color": "#1f1f1f",
						},
					});

					map.addLayer({
						id: "nr_case_text",
						type: "symbol",
						source: "nr_case",
						layout: {
							"text-field": ["get", "number"], // Display the "number" property on each circle
							"text-size": 12, // Text size
							"text-offset": [0, 0], // Text offset
						},
						paint: {
							"text-color": "#000000", // Text color
							"text-halo-color": "#ffffff", // Text halo color
							"text-halo-width": 1, // Text halo width
						},
					});
				}
			} else {
				// Zoomed out, remove the source and layers
				if (map.getSource("nr_case")) {
					map.removeLayer("nr_case");
					map.removeLayer("nr_case_text");
					map.removeSource("nr_case");
				}
			}

			isZoomedInEnough = isNewZoomedInEnough;
		}
	});
};



const geojsonFeaturesCamine = ref();
const geojsonFeaturesCollectionCamine = ref();
const optionsCamine = {
	method: 'GET',
	url: `${import.meta.env.VITE_BASEURL}/map/camine`,
	headers: {
		Authorization: `Bearer ${localStorage.getItem('JWT')}`
	}
};

async function getDataCamine() {
	try {
		const response = await axios.request(optionsCamine);
		geojsonFeaturesCamine.value = response.data.map(item => {
			return {
				type: "Feature",
				properties: {
					id: item.id,
					identifier: item.identifier,
					type_id: item.type_id
				},
				geometry: {
					type: "Point",
					coordinates: [item.coordinates[0], item.coordinates[1]]
				}
			};
		});

		geojsonFeaturesCollectionCamine.value = {
			type: "FeatureCollection",
			features: geojsonFeaturesCamine.value
		};
	} catch (error) {
		console.error(error);
	}
}

const loadCamine = () => {
	if (!geojsonFeaturesCollectionCamine.value) {
		getDataCamine();
	}
	if (pointsDisplayStatus.camine.value === true) {
		map.addSource('camine', {
			type: 'geojson',
			data: geojsonFeaturesCollectionCamine.value,
			cluster: true,
			clusterMaxZoom: clusterMaxZoom,
			clusterRadius: clusterRadius
		});

		map.addLayer({
			id: 'clusters_camine',
			type: 'circle',
			source: 'camine',
			filter: ['has', 'point_count'],
			paint: {
				'circle-color': [
					'step',
					['get', 'point_count'],
					'#0ad2ff',
					100,
					'#00b3ff',
					750,
					'#0082e6'
				],
				'circle-radius': [
					'step',
					['get', 'point_count'],
					20,
					100,
					30,
					750,
					40
				]
			}
		});

		map.addLayer({
			id: 'cluster_count_camine',
			type: 'symbol',
			source: 'camine',
			filter: ['has', 'point_count'],
			layout: {
				'text-field': ['get', 'point_count_abbreviated'],
				'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
				'text-size': 12
			}
		});

		map.addLayer({
			id: 'camine',
			type: 'circle',
			source: 'camine',
			filter: ['!', ['has', 'point_count']],
			paint: {
				'circle-color': '#2ed9ff',
				'circle-radius': 4,
				'circle-stroke-width': 1,
				'circle-stroke-color': '#fff'
			}
		});

		map.on('click', 'clusters_camine', (e) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: ['clusters_camine']
			});
			const clusterId = features[0].properties.cluster_id;
			map.getSource('camine').getClusterExpansionZoom(
				clusterId,
				(err, zoom) => {
					if (err) return;

					map.easeTo({
						center: features[0].geometry.coordinates,
						zoom: zoom
					});
				}
			);
		});

		map.on('click', 'camine', (e) => {
			const properties = e.features[0].properties;
			const coordinates = e.features[0].geometry.coordinates.slice();
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}

			const content = `
			<div class="popup">
				<p class="title">Camin nr. ${properties.id}</p>
				<hr/>
				<a id="veziDetaliiCamine">Vezi Detalii</a>
			</div>
			`
			showPopup(e.lngLat, content);

			clickedElement.value = properties;

			document.getElementById("veziDetaliiCamine").addEventListener("click", () => {
				// eventBus.config.globalProperties.$emit("openModal", properties.id);
				dialogCamine.value = true;
			});
		});

		map.on('mouseenter', 'clusters_camine', () => {
			map.getCanvas().style.cursor = 'pointer';
		});
		map.on('mouseleave', 'clusters_camine', () => {
			map.getCanvas().style.cursor = '';
		});

	}
};

const geojsonFeaturesConducte = ref();
const geojsonFeaturesCollectionConducte = ref();
const optionsConducte = {
	method: 'GET',
	url: `${import.meta.env.VITE_BASEURL}/map/conducte`,
	headers: {
		Authorization: `Bearer ${localStorage.getItem('JWT')}`
	}
};

async function getDataConducte() {
	try {
		const response = await axios.request(optionsConducte);
		geojsonFeaturesConducte.value = response.data.map(item => {
			return {
				type: "Feature",
				properties: {
					id: item.id,
					identifier: item.identifier,
					type_id: item.type_id
				},
				geometry: {
					type: "LineString",
					coordinates: item.coordinates.map(coords => [coords[0], coords[1]])
				}
			};
		});

		geojsonFeaturesCollectionConducte.value = {
			type: "FeatureCollection",
			features: geojsonFeaturesConducte.value
		};
	} catch (error) {
		console.error(error);
	}
}

const loadConducte = () => {
	if (!geojsonFeaturesCollectionConducte.value) {
		getDataConducte();
	}

	if (pointsDisplayStatus.conducte.value) {
		map.addSource('conducte', {
			type: 'geojson',
			data: geojsonFeaturesCollectionConducte.value,
		})

		map.addLayer({
			id: 'conducte',
			type: 'line',
			source: 'conducte',
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: {
				'line-color': 'lightblue',
				'line-width': pointsDimenstions.conducte_width
			}
		})
	}
}



const geojsonFeaturesConducteTureni = ref();
const geojsonFeaturesCollectionConducteTureni = ref();
const optionsConducteTureni = {
  method: 'GET',
  url: `${import.meta.env.VITE_BASEURL}/map/conducte-tureni`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('JWT')}`
  }
};

async function getDataConducteTureni() {
  try {
    const response = await axios.request(optionsConducteTureni);
    geojsonFeaturesConducteTureni.value = response.data.map(item => {
      return {
        type: "Feature",
        properties: {
          id: item.id,
          diameter: item.diametru,
          length: item.lungime
        },
        geometry: {
          type: "LineString",
          coordinates: item.coordinates.map(coords => [coords[0], coords[1]])
        }
      };
    });

    geojsonFeaturesCollectionConducteTureni.value = {
      type: "FeatureCollection",
      features: geojsonFeaturesConducteTureni.value
    };
  } catch (error) {
    console.error(error);
  }
}

const loadConducteTureni = () => {
  if (!geojsonFeaturesCollectionConducteTureni.value) {
    getDataConducteTureni();
  }

  if (pointsDisplayStatus.conducteTureni.value) {
    map.addSource('conducte-tureni', {
      type: 'geojson',
      data: geojsonFeaturesCollectionConducteTureni.value,
    })

    // map.addLayer({
    //   id: 'conducte-tureni-outline',
    //   type: 'line',
    //   source: 'conducte-tureni',
    //   layout: {
    //     'line-join': 'round',
    //     'line-cap': 'round'
    //   },
    //   paint: {
    //     'line-color': 'white',
    //     'line-width': 4.0,
		// 		'line-opacity': 0.8
    //   }
    // })


		// console.log("I NEED TO ADD A LAYER HERE:", geojsonFeaturesCollectionConducteTureni.value)


		// TODO Tried to show a string on hover of each feature of the conducte tureni feature collection to highlight the hovered sector (feature) individually
		// map.on('mousemove', (e) => {
		// 	console.log('LA E', map.queryRenderedFeatures(e.point))
// 			const features = map.queryRenderedFeatures(e.point);
// 			// Limit the number of properties we're displaying for
// 			// legibility and performance
// 			const displayProperties = [
// 				'type',
// 				'properties',
// 				'id',
// 				'layer',
// 				'source',
// 				'sourceLayer',
// 				'state'
// 			];
//
// 			const displayFeatures = features.map((feat) => {
// 				const displayFeat = {};
// 				displayProperties.forEach((prop) => {
// 					displayFeat[prop] = feat[prop];
// 				});
// 				return displayFeat;
// 			});
//
// // Write object as string with an indent of two spaces.
// 			document.getElementById('features').innerHTML = JSON.stringify(
// 					displayFeatures,
// 					null,
// 					2
// 			);
// 		});




		geojsonFeaturesCollectionConducteTureni.value.features.map((pipe, index) => {
			map.addSource(`conducte-tureni-${index}`, {
				type: 'geojson',
				data: geojsonFeaturesCollectionConducteTureni.value.features[index],
			})
						// console.log("Sa vedem aici:", geojsonFeaturesCollectionConducteTureni.value.features[index])
			map.addLayer({
				id: `conducta-tureni-${index}`,
				type: 'line',
				source: `conducte-tureni-${index}`,
				layout: {
					'line-join': 'round',
					'line-cap': 'round'
				},
				paint: {
					'line-color': ['blue', 'white', 'red', 'lightblue', 'green', 'black', 'pink', 'purple', 'lime', 'yellow'][index % 10],
					'line-width': pointsDimenstions.conducte_width
				}
			})


			// map.on('mousemove', (e) => {
			// 	console.log('LA E', map.queryRenderedFeatures(e.point)[0])
			// const features = map.queryRenderedFeatures(e.point);
			// // Limit the number of properties we're displaying for
			// // legibility and performance
			// const displayProperties = [
			// 	// 'type',
			// 	// 'properties',
			// 	// 'id',
			// 	// 'layer',
			// 	// 'source',
			// 	// 'sourceLayer',
			// 	// 'state'
			// ];
			//
			// const displayFeatures = features.map((feat) => {
			// 	const displayFeat = {};
			// 	displayProperties.forEach((prop) => {
			// 		displayFeat[prop] = feat[prop];
			// 	});
			// 	return displayFeat;
			// });

// Write object as string with an indent of two spaces.
// 			document.getElementById('features').innerHTML = JSON.stringify(
// 					displayFeatures,
// 					null,
// 					2
// 			);
// 		});


		})


    // map.addLayer({
    //   id: 'conducte-tureni',
    //   type: 'line',
    //   source: 'conducte-tureni',
    //   layout: {
    //     'line-join': 'round',
    //     'line-cap': 'round'
    //   },
    //   paint: {
    //     'line-color': 'blue',
    //     'line-width': pointsDimenstions.conducte_width
    //   }
    // })

  }
}

const geojsonFeaturesHidrofoare = ref();
const geojsonFeaturesCollectionHidrofoare = ref();
const optionsHidrofoare = {
	method: 'GET',
	url: `${import.meta.env.VITE_BASEURL}/map/hidrofoare`,
	headers: {
		Authorization: `Bearer ${localStorage.getItem('JWT')}`
	}
};

async function getDataHidrofoare() {
	try {
		const response = await axios.request(optionsHidrofoare);
		geojsonFeaturesHidrofoare.value = response.data.map(item => {
			return {
				type: "Feature",
				properties: {
					id: item.id,
					identifier: item.identifier,
					type_id: item.type_id,
					name: item.name,
				},
				geometry: {
					type: "Point",
					coordinates: [item.coordinates[0], item.coordinates[1]]
				}
			};
		});

		geojsonFeaturesCollectionHidrofoare.value = {
			type: "FeatureCollection",
			features: geojsonFeaturesHidrofoare.value
		};
	} catch (error) {
		console.error(error);
	}
}

const loadHidrofoare = () => {
	if (!geojsonFeaturesCollectionHidrofoare.value) {
		getDataHidrofoare()
	}

	if (pointsDisplayStatus.hidrofoare.value) {
		map.addSource('hidrofoare', {
			type: 'geojson',
			data: geojsonFeaturesCollectionHidrofoare.value,
		})

		map.addLayer({
			id: 'hidrofoare',
			type: 'circle',
			source: 'hidrofoare',
			paint: {
				'circle-color': 'green',
				'circle-radius': pointsDimenstions.hidrofoare_radius
			},
			filter: ['==', '$type', 'Point']
		})
	}
}

const geojsonFeaturesRezervoare = ref();
const geojsonFeaturesCollectionRezervoare = ref();
const optionsRezervoare = {
	method: 'GET',
	url: `${import.meta.env.VITE_BASEURL}/map/rezervoare`,
	headers: {
		Authorization: `Bearer ${localStorage.getItem('JWT')}`
	}
};

async function getDataRezervoare() {
	try {
		const response = await axios.request(optionsRezervoare);
		geojsonFeaturesRezervoare.value = response.data.map(item => {
			return {
				type: "Feature",
				properties: {
					id: item.id,
					identifier: item.identifier,
					type_id: item.type_id,
					name: item.name,
				},
				geometry: {
					type: "Point",
					coordinates: [item.coordinates[0], item.coordinates[1]]
				}
			};
		});

		geojsonFeaturesCollectionRezervoare.value = {
			type: "FeatureCollection",
			features: geojsonFeaturesRezervoare.value
		};
	} catch (error) {
		console.error(error);
	}
}

const loadRezervoare = () => {
	if (!geojsonFeaturesCollectionRezervoare.value) {
		getDataRezervoare();
	}

	if (pointsDisplayStatus.rezervoare.value) {
		map.addSource('rezervoare', {
			type: 'geojson',
			data: geojsonFeaturesCollectionRezervoare.value
		});

		for (let i = 0; i < geojsonFeaturesCollectionRezervoare.value.features.length; i++) {
			const feature = geojsonFeaturesCollectionRezervoare.value.features[i];
			const el = document.createElement('div');
			el.className = 'marker';

			const marker = new mapboxgl.Marker(el)
				.setLngLat(feature.geometry.coordinates)
				.setPopup(
					new mapboxgl.Popup({ closeOnClick: true, closeButton: false })
						.setHTML(
							`
							<div class="popup">
								<p class="title">Rezervor nr. ${feature.properties.name}</p>
								<hr/>
								<a id="veziDetaliiRezervoare">Vezi Detalii</a>
							</div>
							`
						)
				)
				.addTo(map);

			marker.getPopup().on('open', () => {
				const veziDetaliiLink = document.getElementById('veziDetaliiRezervoare');
				if (veziDetaliiLink) {
					veziDetaliiLink.addEventListener('click', () => {
						dialogRezervor.value = true;
					});
				}
			});

			markers.value.push(marker);
		}
	}
};

const geojsonFeaturesContoare = ref();
const geojsonFeaturesCollectionContoare = ref();
const optionsContoare = {
	method: 'GET',
	url: `${import.meta.env.VITE_BASEURL}/map/contoare`,
	headers: {
		Authorization: `Bearer ${localStorage.getItem('JWT')}`
	}
};

const getDataContoare = async () => {
	try {
		const response = await axios.request(optionsContoare);
		geojsonFeaturesContoare.value = response.data.map(item => {
			return {
				type: "Feature",
				properties: {
					id: item.id,
					identifier: item.identifier,
					type_id: item.type_id,
					client: item.client,
				},
				geometry: {
					type: "Point",
					coordinates: [item.coordinates[0], item.coordinates[1]]
				}
			};
		});

		geojsonFeaturesCollectionContoare.value = {
			type: "FeatureCollection",
			features: geojsonFeaturesContoare.value
		};
	} catch (error) {
		console.error(error);
	}
};

const loadContoare = () => {
	if (!geojsonFeaturesCollectionContoare.value) {
		getDataContoare();
	}

	if (pointsDisplayStatus.contoare.value) {
		map.addSource('contoare', {
			type: 'geojson',
			data: geojsonFeaturesCollectionContoare.value,
			cluster: true,
			clusterMaxZoom: clusterMaxZoom,
			clusterRadius: clusterRadius
		})

		map.addLayer({
			id: 'clusters_contoare',
			type: 'circle',
			source: 'contoare',
			filter: ['has', 'point_count'],
			paint: {
				'circle-color': [
					'step',
					['get', 'point_count'],
					'#0ad2ff',
					100,
					'#00b3ff',
					750,
					'#0082e6'
				],
				'circle-radius': [
					'step',
					['get', 'point_count'],
					20,
					100,
					30,
					750,
					40
				]
			}
		});

		map.addLayer({
			id: 'cluster_count_contoare',
			type: 'symbol',
			source: 'contoare',
			filter: ['has', 'point_count'],
			layout: {
				'text-field': ['get', 'point_count_abbreviated'],
				'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
				'text-size': 12
			}
		});

		map.addLayer({
			id: 'contoare',
			type: 'circle',
			source: 'contoare',
			filter: ['!', ['has', 'point_count']],
			paint: {
				'circle-color': 'cyan',
				'circle-radius': pointsDimenstions.contoare_radius,
				'circle-stroke-width': 1,
				'circle-stroke-color': '#fff'
			}
		});

		map.on('click', 'clusters_contoare', (e) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: ['clusters_contoare']
			});
			const clusterId = features[0].properties.cluster_id;
			map.getSource('contoare').getClusterExpansionZoom(
				clusterId,
				(err, zoom) => {
					if (err) return;

					map.easeTo({
						center: features[0].geometry.coordinates,
						zoom: zoom
					});
				}
			);
		});

		map.on('click', 'contoare', (e) => {
			const properties = e.features[0].properties;
			const coordinates = e.features[0].geometry.coordinates.slice();
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}

			const content = `
			<div class="popup">
				<p class="title">Contor nr. ${properties.id}</p>
				<hr/>
				<a href="#interventii">Vezi Detalii</a>
				<p class="title">Client: ${properties.client}</p>
				<br/>
				<hr/>
				<a class="info" id="veziDetaliiContoare">Vezi Detalii</a>
			</div>
			`
			showPopup(e.lngLat, content);

			document.getElementById("veziDetaliiContoare").addEventListener("click", () => {
				dialogContoare.value = true;
			});
		});

		map.on('mouseenter', 'clusters_contoare', () => {
			map.getCanvas().style.cursor = 'pointer';
		});
		map.on('mouseleave', 'clusters_contoare', () => {
			map.getCanvas().style.cursor = '';
		});
	}
}

const geojsonFeaturesZones = ref();
const geojsonFeaturesCollectionZones = ref();
const optionsZones = {
	method: 'GET',
	url: `${import.meta.env.VITE_BASEURL}/map/zones`,
	headers: {
		Authorization: `Bearer ${localStorage.getItem('JWT')}`
	}
};

async function getDataZones() {
	try {
		const response = await axios.request(optionsZones);
		geojsonFeaturesZones.value = response.data.map(item => {
			return {
				type: "Feature",
				properties: {
					id: item.id,
					identifier: item.identifier,
					type_id: item.type_id,
					name: item.name
				},
				geometry: {
					type: "Polygon",
					coordinates: [item.coordinates]
				}
			};
		});

		geojsonFeaturesCollectionZones.value = {
			type: "FeatureCollection",
			features: geojsonFeaturesZones.value
		};
	} catch (error) {
		console.error(error);
	}
}

const loadZones = async () => {
	if (!geojsonFeaturesCollectionZones.value) {
		await getDataZones();
	}
	if (pointsDisplayStatus.zones.value === true) {
		geojsonFeaturesCollectionZones.value.features.forEach((feature, index) => {
			const polygon = feature.geometry;

			map.addSource(`polygon-${index}`, {
				type: 'geojson',
				data: turf.feature(polygon)
			});

			map.addLayer({
				id: `fill-layer-${index}`,
				type: 'fill',
				source: `polygon-${index}`,
				layout: {},
				paint: {
					'fill-color': stringToColor(`${feature.properties['identifier']}`),
					'fill-opacity': 0.3
				}
			});

			map.addLayer({
				id: `outline-layer-${index}`,
				type: 'line',
				source: `polygon-${index}`,
				layout: {},
				paint: {
					'line-color': 'black',
					'line-width': 1
				}
			})
		});
	}
};

const zoomToPolygon = (polygonId, map) => {
	const clickedPolygon = geojsonFeaturesCollectionZones.value.features[polygonId]
	if (clickedPolygon) {
		const bbox = turf.bbox(clickedPolygon)
		map.fitBounds(bbox, { padding: 20 })
	}
}

const showPopup = (pos, content) => {
	if (popup.value) {
		popup.value.remove();
	}
	if (!popupCluster.value) {
		popup.value = new mapboxgl.Popup({ closeOnClick: true, closeButton: false })
			.setLngLat(pos)
			.setHTML(content)
			.addTo(map)
	}
}

const removeAllLayersTemporary = () => {
	if (pointsDisplayStatus.camine.value) {
		map.removeLayer('clusters_camine');
		map.removeLayer('cluster_count_camine')
		map.removeLayer('camine')
		map.removeSource('camine')
	}
	if (pointsDisplayStatus.conducte.value) {
		map.removeLayer('conducte')
		map.removeSource('conducte')
	}

  if (pointsDisplayStatus.conducte.value) {
    map.removeLayer('conducte-tureni')
    map.removeSource('conducte-tureni')
  }

	if (pointsDisplayStatus.contoare.value) {
		map.removeLayer('clusters_contoare');
		map.removeLayer('cluster_count_contoare');
		map.removeLayer('contoare');
		map.removeSource('contoare');
	}
	if (pointsDisplayStatus.hidrofoare.value) {
		map.removeLayer('hidrofoare')
		map.removeSource('hidrofoare')
	}
	if (pointsDisplayStatus.zones.value) {
		geojsonFeaturesCollectionZones.value.features.forEach((feature, index) => {

			// Removing the 'fill-layer-${index}' layer
			map.removeLayer(`fill-layer-${index}`);

			// Removing the 'outline-layer-${index}' layer
			map.removeLayer(`outline-layer-${index}`);
		});
	}
}

const loadAllAvailableLayers = () => {
	if (pointsDisplayStatus.zones.value) {
		loadZones();
	}
	if (pointsDisplayStatus.camine.value) {
		loadCamine();
	}
	if (pointsDisplayStatus.conducte.value) {
		loadConducte();
	}
  if (pointsDisplayStatus.conducteTureni.value) {
    loadConducteTureni();
  }
	if (pointsDisplayStatus.contoare.value) {
		loadContoare();
	}
	if (pointsDisplayStatus.hidrofoare.value) {
		loadHidrofoare();
	}
	if(pointsDisplayStatus.nrCase.value) {
		loadNrCase();
	}
}

let lastCallTime = 0;

const toggleMapStyle = () => {
	const currentTime = Date.now();

	// Check if the time difference is at least 1 second (1000 milliseconds)
	if (currentTime - lastCallTime >= 1000) {
		// Update the lastCallTime to the current time
		lastCallTime = currentTime;

		if (mapstyle.value === 'dark') {
			mapstyle.value = 'satelite';
			map.setStyle('mapbox://styles/mapbox/satellite-streets-v12');
		} else {
			mapstyle.value = 'dark';
			map.setStyle('mapbox://styles/mapbox/dark-v11');
		}
		removeAllLayersTemporary();
		setTimeout(() => {
			loadAllAvailableLayers();
		}, 100);
	}
};

onMounted(() => {
	mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

	map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/dark-v11',
		center: [23.819375735972201, 46.560570004788701],
		zoom: 13,
		doubleClickZoom: false
	})

	map.on('style.load', () => {
		map.addSource('mapbox-dem', {
			'type': 'raster-dem',
			'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
			'tileSize': 512,
			'maxzoom': 14
		});
// add the DEM source as a terrain layer with exaggerated height
		map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1 });
	});

	map.on('load', () => {
		addMapContols(map);
		loadZones();
		loadCamine();
		loadConducte();
    loadConducteTureni();
		loadHidrofoare();
		loadRezervoare();
		loadContoare();
		loadNrCase();
	})

	map.on('dblclick', (e) => {
		const features = map.queryRenderedFeatures(e.point)
		const clickedPolygons = features.filter((feature) =>
			feature.layer.id.startsWith('fill-layer')
		)

		if (clickedPolygons.length > 0) {
			clickedPolygons.forEach((polygon) => {
				const polygonId = polygon.layer.id.split('-')[2]
				zoomToPolygon(polygonId, map)
			})
		}
	})

	// map.on('click', (e) => {
	// 	const features = map.queryRenderedFeatures(e.point)
	// 	const clickedPolygons = features.filter((feature) =>
	// 		feature.layer.id.startsWith('fill-layer')
	// 	)
	//
	// 	if (clickedPolygons.length > 0) {
	// 		clickedPolygons.forEach((polygon) => {
	// 			const polygonId = polygon.layer.id.split('-')[2]
	// 			const name = geojsonFeaturesCollectionZones.value.features[polygonId].properties['name']
	//
	// 			const content = `
	// 			<div class="popup">
	// 				<p class="title">DMA ${name}</p>
	// 				<hr />
	// 				<p class="info">Nr. Contoare - TBA</p>
	// 			</div>
	// 			`
	// 			showPopup(e.lngLat, content)
	// 		})
	// 	}
	// })

	map.on('click', 'hidrofoare', (e) => {
		const properties = e.features[0].properties;
		const content = `
		<div class="popup">
			<p class="title">Hidrofor</p>
			<p class="title">${properties.name}</p>
			<p class="title">Hidrofor ${properties.name}</p>
			<hr />
			<ul>
				<li>Descriere: ${properties.description ? properties.description : '-'}</li>
			</ul>
			<a class="info" id="veziDetaliiHidrofoare">Mai multe detalii</a>
		</div>
		`
		showPopup(e.lngLat, content)
	})
})

</script>

<style lang="scss">
#map {
	flex: 1;
	min-height: 350px;
	height: 100%;
}

canvas {
	cursor: default;
	min-width: 100% !important;
}

.popup {
	padding: 10px;
	border-radius: 8px;
	color: white !important;
	text-align: left;

	.title {
		font-size: 1.25rem;
		text-align: center;
	}

	.info {
		font-size: 1rem;
		margin-bottom: 0.25rem;
	}

	hr {
		margin-bottom: 0.75rem;
	}

	a {
		display: block;
		text-decoration: none;
		color: white;
		font-size: 1rem;
		margin-bottom: 0.25rem;
		text-align: center;
	}

	a:hover {
		color: lightgray;
		cursor: pointer;
	}

	p {
		text-align: center;
	}
}

.v-card {
	padding-right: 10px !important;
}

.marker {
	background-image: url('../assets/icons/marker-blue.png');
	width: 50px;
	height: 50px;
	cursor: pointer;
}
.v-overlay--active .v-overlay__scrim {
	background-color: transparent;
}
</style>

<style scoped lang="scss">
#mapStyleChangerContainer {
	z-index: 1000;
	position: absolute;
	bottom: 1rem;
	left: 1rem;
	padding: 0.2rem;
	background-color: white;
	border-radius: 10px;

	div {
		height: 6rem;
		width: 6rem;
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: end;
		padding-bottom: 0.2rem;

		h4 {
			font-size: 0.8rem;
			user-select: none;
			pointer-events: none;
		}
	}

	.dark {
		background-image: url(../assets/darkmap.png);
		background-size: cover;
	}

	.satelite {
		background-image: url(../assets/satelite.png);
		background-size: cover;
	}
}

.menu {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	z-index: 1000;
	position: absolute;
	left: 1.2rem;
	top: 1.2rem;
}

#map {
	:deep(.mapboxgl-ctrl-bottom-right) {
		display: none;
	}

	:deep(.mapboxgl-ctrl-bottom-left) {
		display: none;
	}

	:deep(.mapboxgl-popup-content) {
		background: rgba(31, 41, 64, 0.85);
	}

	:deep(.mapboxgl-popup-tip) {
		border-top-color: rgba(31, 41, 64, 0.85);
	}
}
</style>
