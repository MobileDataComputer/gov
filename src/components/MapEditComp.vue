<template>
  <div id="map"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import * as turf from '@turf/turf'
export default {
  name: 'MapEditComp',
  data() {
    return {
      popup: null,
      draw: null,
      isDrawingModeActive: false
    }
  },
  methods: {
    initializeMapboxDraw(map) {
      this.draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        }
      })
      map.addControl(this.draw)

      map.on('draw.create', (event) => {
        const polygon = event.features[0].geometry
        // Do something with the drawn polygon
      })

      map.on('draw.delete', () => {
        // Handle polygon deletion
      })
    }
  },
  mounted() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoicGF1bGRldi0iLCJhIjoiY2xpb2U1dHI0MDB1NzNlcmYwMDc3bWRqMSJ9.Txcg2BBZAhsTYqUADy8qKQ' // Replace with your actual Mapbox access token

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [23.819375735972201, 46.560570004788701], // Default center coordinates
      zoom: 12, // Default zoom level
      doubleClickZoom: false
    })

    map.on('dragstart', () => {
      map.getCanvas().classList.add('grabbing')
    })

    map.on('dragend', () => {
      map.getCanvas().classList.remove('grabbing')
    })

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#ffff00'] // Define an array of colors

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    })
    map.addControl(draw)

    map.on('load', () => {
      // this.initializeMapboxDraw(map)

      zones.features.forEach((feature, index) => {
        const polygon = feature.geometry

        map.addSource(`polygon-${index}`, {
          type: 'geojson',
          data: turf.feature(polygon)
        })

        map.addLayer({
          id: `fill-layer-${index}`,
          name: feature.properties['Name'],
          type: 'fill',
          source: `polygon-${index}`,
          layout: {},
          paint: {
            'fill-color': colors[index % colors.length], // Assign color based on index ID
            'fill-opacity': 0.5
          }
        })

        map.addLayer({
          id: `outline-layer-${index}`,
          type: 'line',
          source: `polygon-${index}`,
          layout: {},
          paint: {
            'line-color': 'blue',
            'line-width': 3
          }
        })

        // // Enable edit mode for the polygon when clicked
        // map.on('click', `fill-layer-${index}`, (e) => {
        //   const features = map.queryRenderedFeatures(e.point, { layers: [`fill-layer-${index}`] })
        //   if (features.length) {
        //     const feature = features[0]
        //     const coordinates = feature.geometry.coordinates;
        //     const id = feature.layer.id
        //     const number = id.split('-')[2];

        //     map.removeLayer(`fill-layer-${number}`)
        //     map.removeLayer(`outline-layer-${number}`)

        //     this.draw.set({
        //       type: 'FeatureCollection',
        //       features: [
        //         {
        //           type: 'Feature',
        //           properties: {},
        //           geometry: {
        //             type: 'Polygon',
        //             coordinates,
        //           },
        //         },
        //       ],
        //     });
        //   }
        // })
      })
    })

    this.zoomToPolygon = (polygonId, map) => {
      const clickedPolygon = zones.features[polygonId]

      if (clickedPolygon) {
        const bbox = turf.bbox(clickedPolygon)
        map.fitBounds(bbox, { padding: 20 })
      }
    }

    this.showPopup = (lngLat, name, map) => {
      if (this.popup) {
        this.popup.remove()
      }

      this.popup = new mapboxgl.Popup({ closeOnClick: true, closeButton: false })
        .setLngLat(lngLat)
        .setHTML(
          `
                <div class="popup">
                    <p class="title">${name}</p>
                    <hr />
                    <p class="info">Nr. Contoare - TBA</p>
                    <a href="/">Vezi interventii</a>
                    <a href="/">Vezi scurgeri</a>
                </div>
            `
        )
        .addTo(map)
    }
  }
}
</script>

<style lang="scss">
#map {
  flex: 1; /* Adjust the height as needed */
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
  }

  a:hover {
    color: lightgray;
  }
}
</style>

<style scoped lang="scss">
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
