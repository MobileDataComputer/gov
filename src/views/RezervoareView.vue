<template>
    <div>
        <!--        <TitleComp :title="title" />-->
        <TitleComp title="DMA Tureni" />
        <h2 style="text-align: center; margin-bottom: 1rem">Total înregistrat pe contoare în luna Iunie 2023: <span>{{ totalContoare.toFixed(2) }} m³ </span></h2>
        <div class="basic-container-body">
            <v-btn class="mr-2" color="#2F384D">Anual</v-btn>
            <v-btn class="ml-2" color="#2F384D">Lunar</v-btn>
            <div class="double-chart-container">
                <div>
                    <highcharts :options="detailChartOptions" class="chart"></highcharts>
                    <highcharts :options="masterChartOptions" class="chart" :style="masterChartStyle"></highcharts>
                </div>
            </div>
            <h3>Total debit apa - {{debitSum}} ㎥</h3>
            <div class="double-chart-container">
                <div>
                    <highcharts :options="detailChartOptions2" class="chart"></highcharts>
                    <highcharts :options="masterChartOptions2" class="chart" :style="masterChartStyle"></highcharts>
                </div>
            </div>
            <div class="double-chart-container">
                <div>
                    <highcharts :options="detailChartOptions3" class="chart"></highcharts>
                    <highcharts :options="masterChartOptions3" class="chart" :style="masterChartStyle"></highcharts>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import TitleComp from '@/components/TitleComp.vue'
import { onMounted, ref } from 'vue';

const title = ref("Rezervor")
const newSeriesData = ref();
const newSeriesData2 = ref();
const newSeriesData3 = ref();
const debitSum = ref(0)

const totalContoare = ref(0);

const getTotal = () => {
    contoare.map(item => {
        totalContoare.value += item.volume.value;
    })
}

const setTitle = () => {
    const storedTitle = localStorage.getItem("rezervor");

    if(storedTitle) {
        title.value = storedTitle;
    }
}

const setChartData = () => {
    newSeriesData.value = nivelRezevoare.rows.map(item => [item.t_stamp, item.floatvalue]).sort((a, b) => a[0]-b[0]);
}

const setChartData2 = () => {
    newSeriesData2.value = debitRezervoare.rows.map(item => [item.t_stamp, item.floatvalue]).sort((a, b) => a[0]-b[0]);
    debitSum.value = debitRezervoare.rows.reduce((accumulator, currentValue) => accumulator + currentValue.floatvalue, 0).toFixed(4)
}

const setChartData3 = () => {
    newSeriesData3.value = debitContor.rows.map(item => [item.t_stamp, item.intvalue]).sort((a, b) => a[0]-b[0]);
}

setChartData();
setChartData2();
setChartData3();

getTotal();
onMounted(() => {
    setTitle();
})

const chartOptions2 = {
    chart: {
        type: 'area',
        style: {
            color: '#ffffff'
        }
    },
    title: {
        text: 'Grafic debit rezervor',
        style: {
            color: '#ffffff'
        }
    },
    xAxis: {
        type: 'datetime',
        allowDecimals: false,
        lineColor: '#fff',
        tickColor: '#fff',
        labels: {
            style: {
                color: '#fff'
            },
        },
        title: {
            style: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        lineColor: '#fff',
        tickColor: '#fff',
        title: {
            text: '㎥',
            style: {
                color: '#fff'
            }
        },
        labels: {
            style: {
                color: '#fff'
            }
        }
    },
    boost: { enabled: true },
    tooltip: {
        pointFormat: '{series.name} <b>{point.y:.4f} ㎥</b><br/>',
        shared: true
    },
    plotOptions: {
        area: {
            pointStart: 2023,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        },

        series: {
            marker: {
                enabled: false,
            },
        }
    },
    colors: ['#8cff66'],
    legend: {
        itemStyle: { color: '#ffffff' }
    },
    series: [
        {
            name: 'Debit apa',
            data: newSeriesData2.value,
            boostThreshold: 1,
            turboThreshold: 0,
        }
    ]
}

const chartOptions3 = {
    chart: {
        type: 'area',
        style: {
            color: '#ffffff'
        }
    },
    title: {
        text: 'Grafic debit contor',
        style: {
            color: '#ffffff'
        }
    },
    xAxis: {
        type: 'datetime',
        allowDecimals: false,
        lineColor: '#fff',
        tickColor: '#fff',
        labels: {
            style: {
                color: '#fff'
            },
        },
        title: {
            style: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        lineColor: '#fff',
        tickColor: '#fff',
        title: {
            text: '㎥',
            style: {
                color: '#fff'
            }
        },
        labels: {
            style: {
                color: '#fff'
            }
        }
    },
    boost: { enabled: true },
    tooltip: {
        pointFormat: '{series.name} <b>{point.y:.4f} ㎥</b><br/>',
        shared: true
    },
    plotOptions: {
        area: {
            pointStart: 2023,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        },

        series: {
            marker: {
                enabled: false,
            },
        }
    },
    colors: ['#f9b42d'],
    legend: {
        itemStyle: { color: '#ffffff' }
    },
    series: [
        {
            name: 'Debit contor',
            data: newSeriesData3.value,
            boostThreshold: 1,
            turboThreshold: 0,
        }
    ]
}

const masterChartStyle = {
    position: 'relative',
    height: 150 + 'px',
    width: '100%',
    top: -40 + 'px',
}


const masterInfo = {
    xAxis: {
        type: 'datetime',
        showLastTickLabel: true,
        maxZoom: 14 * 24 * 3600000, // fourteen days
        plotBands: [{
            id: 'mask-before',
            from: newSeriesData.value[0][0],
            to: newSeriesData.value[newSeriesData.value.length - 1][0],
            color: 'rgba(0, 0, 0, 0.2)'
        }],
        title: {
            text: null
        }
    },

    series: [{
        type: 'area',
        name: 'CHANGE THIS',
        pointInterval: 24 * 3600 * 1000,
        pointStart: newSeriesData.value[0][0],
        data: newSeriesData.value
    }],
}

const masterChartOptions = {
        chart: {
            reflow: true,
            borderWidth: 0,
            backgroundColor: null,
            zoomType: 'x',
            events: {
                selection: function(event) {

                    var max = event.xAxis[0].max
                    var min = event.xAxis[0].min

                    var xAxis = masterInfo.xAxis

                    var tempArr = []


                    masterInfo.series[0].data.forEach(point => {
                        if (point[0] > min && point[0] < max) {
                            tempArr.push([point[0], point[1]]);
                        }
                    });


                    xAxis.plotBands[0] = {
                        id: 'mask-before',
                        from: newSeriesData.value[0][0],
                        to: min,
                        color: 'rgba(0, 0, 0, 0.2)'
                    }
                    detailChartOptions.value.series[0].data = tempArr;

                    return false;
                }.bind(this)
            }
        },
        title: {
            text: null
        },
        boost: { enabled: true},
        xAxis: {
            type: 'datetime',
            showLastTickLabel: true,
            maxZoom: 14 * 24 * 3600000,
            plotBands: [{
                id: 'mask-before',
                from: newSeriesData.value[0][0],
                to: newSeriesData.value[newSeriesData.value.length - 1][0],
                color: 'rgba(0, 0, 0, 0.2)'
            }],
            lineColor: '#fff',
            tickColor: '#fff',
            labels: {
                style: {
                    color: '#fff'
                },
            },
            title: {
                text: null,
                style: {
                    color: '#fff'
                }
            }
        },
        yAxis: {
            gridLineWidth: 0,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            min: 0.6,
            showFirstLabel: false
        },
        tooltip: {
            formatter: function() {
                return false;
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                fillColor: {
                    linearGradient: [0, 0, 0, 70],
                    stops: [
                        [0, '#0066FF66'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                lineWidth: 1,
                marker: {
                    enabled: false
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                enableMouseTracking: false
            }
        },

        series: [{
            type: 'area',
            name: 'Nivel',
            pointInterval: 24 * 3600 * 1000,
            pointStart: newSeriesData.value[0][0],
            data: newSeriesData.value,
            boostThreshold: 1,
            turboThreshold: 0,
        }],

        exporting: {
            enabled: false
        }
}

const detailChartOptions = ref({
    chart: {
        // type: 'area',
        marginBottom: 120,
        reflow: true,
        marginLeft: 50,
        marginRight: 20,
        style: {
            position: 'absolute'
        }
    },
    credits: {
        enabled: false
    },
    title: {
        text: 'Nivel Rezervor (Tureni)',
        style: {
            color: '#ffffff'
        }
    },
    subtitle: {
        text: 'Selectati un interval folosind graficul de mai jos',
        style: {
            color: '#ffffff'
        }
    },
    xAxis: {
        type: 'datetime',
        lineColor: '#fff',
        tickColor: '#fff',
        labels: {
            style: {
                color: '#fff'
            },
        },
        title: {
            style: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        lineColor: '#fff',
        tickColor: '#fff',
        labels: {
            style: {
                color: '#fff'
            },
        },
        title: {
            text: null,
            style: {
                color: '#fff'
            }
        },
        maxZoom: 0.1
    },
    boost: { enabled: true},
    tooltip: {
        pointFormat: '{series.name} <b>{point.y:.4f} ㎥</b><br/>',
        shared: true
    },
    legend: {
        enabled: false,
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true,
                        radius: 3
                    }
                }
            }
        }
    },
    series: [{
        name: 'Vol. apa',
        pointStart: newSeriesData.value[0][0],
        pointInterval: 24 * 3600 * 1000,
        data: newSeriesData.value,
        boostThreshold: 1,
        turboThreshold: 0,
    }],

    exporting: {
        enabled: false
    }
})


const masterInfo2 = {
    xAxis: {
        type: 'datetime',
        showLastTickLabel: true,
        maxZoom: 14 * 24 * 3600000, // fourteen days
        plotBands: [{
            id: 'mask-before',
            from: newSeriesData2.value[0][0],
            to: newSeriesData2.value[newSeriesData2.value.length - 1][0],
            color: 'rgba(0, 0, 0, 0.2)'
        }],
        title: {
            text: null
        }
    },

    series: [{
        type: 'area',
        name: 'CHANGE THIS',
        pointInterval: 24 * 3600 * 1000,
        pointStart: newSeriesData2.value[0][0],
        data: newSeriesData2.value
    }],
}

const masterChartOptions2 = {
    chart: {
        reflow: true,
        borderWidth: 0,
        backgroundColor: null,
        zoomType: 'x',
        events: {
            selection: function(event) {

                var max = event.xAxis[0].max
                var min = event.xAxis[0].min

                var xAxis = masterInfo2.xAxis

                var tempArr = []


                masterInfo2.series[0].data.forEach(point => {
                    if (point[0] > min && point[0] < max) {
                        tempArr.push([point[0], point[1]]);
                    }
                });


                xAxis.plotBands[0] = {
                    id: 'mask-before',
                    from: newSeriesData2.value[0][0],
                    to: min,
                    color: 'rgba(0, 0, 0, 0.2)'
                }
                detailChartOptions2.value.series[0].data = tempArr;

                return false;
            }.bind(this)
        }
    },
    title: {
        text: null
    },
    boost: { enabled: true},
    xAxis: {
        type: 'datetime',
        showLastTickLabel: true,
        maxZoom: 14 * 24 * 3600000,
        plotBands: [{
            id: 'mask-before',
            from: newSeriesData2.value[0][0],
            to: newSeriesData2.value[newSeriesData2.value.length - 1][0],
            color: 'rgba(0, 0, 0, 0.2)'
        }],
        lineColor: '#fff',
        tickColor: '#fff',
        labels: {
            style: {
                color: '#fff'
            },
        },
        title: {
            text: null,
            style: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        gridLineWidth: 0,
        labels: {
            enabled: false
        },
        title: {
            text: null
        },
        min: 0.6,
        showFirstLabel: false
    },
    tooltip: {
        formatter: function() {
            return false;
        }
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        series: {
            lineWidth: 1,
            marker: {
                enabled: false
            },
            shadow: false,
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            enableMouseTracking: false
        }
    },

    colors: [
      '#8cff66'
    ],

    series: [{
        type: 'area',
        name: 'Nivel',
        pointInterval: 24 * 3600 * 1000,
        pointStart: newSeriesData2.value[0][0],
        data: newSeriesData2.value,
        boostThreshold: 1,
        turboThreshold: 0,
    }],

    exporting: {
        enabled: false
    }
}

const detailChartOptions2 = ref({
    chart: {
        // type: 'area',
        marginBottom: 120,
        reflow: true,
        marginLeft: 50,
        marginRight: 20,
        style: {
            position: 'absolute'
        }
    },
    credits: {
        enabled: false
    },
    title: {
        text: 'Debit Rezervor (Tureni)',
        style: {
            color: '#ffffff'
        }
    },
    subtitle: {
        text: 'Selectati un interval folosind graficul de mai jos',
        style: {
            color: '#ffffff'
        }
    },
    xAxis: {
        type: 'datetime',
        lineColor: '#fff',
        tickColor: '#fff',
        labels: {
            style: {
                color: '#fff'
            },
        },
        title: {
            style: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        lineColor: '#fff',
        tickColor: '#fff',
        labels: {
            style: {
                color: '#fff'
            },
        },
        title: {
            text: null,
            style: {
                color: '#fff'
            }
        },
        maxZoom: 0.1
    },
    boost: { enabled: true},
    tooltip: {
        pointFormat: '{series.name} <b>{point.y:.4f} ㎥</b><br/>',
        shared: true
    },
    legend: {
        enabled: false,
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true,
                        radius: 3
                    }
                }
            }
        }
    },

    colors: [
        '#8cff66'
    ],

    series: [{
        name: 'Vol. apa',
        pointStart: newSeriesData2.value[0][0],
        pointInterval: 24 * 3600 * 1000,
        data: newSeriesData2.value,
        boostThreshold: 1,
        turboThreshold: 0,
    }],

    exporting: {
        enabled: false
    }
})

const masterInfo3 = {
    xAxis: {
        type: 'datetime',
        showLastTickLabel: true,
        maxZoom: 14 * 24 * 3600000, // fourteen days
        plotBands: [{
            id: 'mask-before',
            from: newSeriesData3.value[0][0],
            to: newSeriesData3.value[newSeriesData3.value.length - 1][0],
            color: 'rgba(0, 0, 0, 0.2)'
        }],
        title: {
            text: null
        }
    },

    series: [{
        type: 'area',
        name: 'CHANGE THIS',
        pointInterval: 24 * 3600 * 1000,
        pointStart: newSeriesData3.value[0][0],
        data: newSeriesData3.value
    }],
}

const masterChartOptions3 = {
    chart: {
        reflow: true,
        borderWidth: 0,
        backgroundColor: null,
        zoomType: 'x',
        events: {
            selection: function(event) {

                var max = event.xAxis[0].max
                var min = event.xAxis[0].min

                var xAxis = masterInfo3.xAxis

                var tempArr = []


                masterInfo3.series[0].data.forEach(point => {
                    if (point[0] > min && point[0] < max) {
                        tempArr.push([point[0], point[1]]);
                    }
                });


                xAxis.plotBands[0] = {
                    id: 'mask-before',
                    from: newSeriesData3.value[0][0],
                    to: min,
                    color: 'rgba(0, 0, 0, 0.2)'
                }
                detailChartOptions3.value.series[0].data = tempArr;

                return false;
            }.bind(this)
        }
    },
    title: {
        text: null
    },
    boost: { enabled: true},
    xAxis: {
        type: 'datetime',
        showLastTickLabel: true,
        maxZoom: 14 * 24 * 3600000,
        plotBands: [{
            id: 'mask-before',
            from: newSeriesData3.value[0][0],
            to: newSeriesData3.value[newSeriesData3.value.length - 1][0],
            color: 'rgba(0, 0, 0, 0.2)'
        }],
        lineColor: '#fff',
        tickColor: '#fff',
        labels: {
            style: {
                color: '#fff'
            },
        },
        title: {
            text: null,
            style: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        gridLineWidth: 0,
        labels: {
            enabled: false
        },
        title: {
            text: null
        },
        min: 0.6,
        showFirstLabel: false
    },
    tooltip: {
        formatter: function() {
            return false;
        }
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        series: {
            lineWidth: 1,
            marker: {
                enabled: false
            },
            shadow: false,
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            enableMouseTracking: false
        }
    },

    colors: [
        '#f9b42d'
    ],

    series: [{
        type: 'area',
        name: 'Nivel',
        pointInterval: 24 * 3600 * 1000,
        pointStart: newSeriesData3.value[0][0],
        data: newSeriesData3.value,
        boostThreshold: 1,
        turboThreshold: 0,
    }],

    exporting: {
        enabled: false
    }
}

const detailChartOptions3 = ref({
    chart: {
        // type: 'area',
        marginBottom: 120,
        reflow: true,
        marginLeft: 50,
        marginRight: 20,
        style: {
            position: 'absolute'
        }
    },
    credits: {
        enabled: false
    },
    title: {
        text: 'Debit contor (Tureni)',
        style: {
            color: '#ffffff'
        }
    },
    subtitle: {
        text: 'Selectati un interval folosind graficul de mai jos',
        style: {
            color: '#ffffff'
        }
    },
    xAxis: {
        type: 'datetime',
        lineColor: '#fff',
        tickColor: '#fff',
        labels: {
            style: {
                color: '#fff'
            },
        },
        title: {
            style: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        lineColor: '#fff',
        tickColor: '#fff',
        labels: {
            style: {
                color: '#fff'
            },
        },
        title: {
            text: null,
            style: {
                color: '#fff'
            }
        },
        maxZoom: 0.1
    },
    boost: { enabled: true},
    tooltip: {
        pointFormat: '{series.name} <b>{point.y:.4f} ㎥</b><br/>',
        shared: true
    },
    legend: {
        enabled: false,
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true,
                        radius: 3
                    }
                }
            }
        }
    },

    colors: [
        '#f9b42d'
    ],

    series: [{
        name: 'Vol. apa',
        pointStart: newSeriesData3.value[0][0],
        pointInterval: 24 * 3600 * 1000,
        data: newSeriesData3.value,
        boostThreshold: 1,
        turboThreshold: 0,
    }],

    exporting: {
        enabled: false
    }
})

</script>

<style lang="scss" scoped>
.basic-container-body {
  overflow-y: hidden;
  height: 92% !important;
  padding: 1rem 0;
  -ms-overflow-style: none !important; /* IE and Edge */
  scrollbar-width: none !important; /* Firefox */
}

.chart {
  width: 90%;
  height: 25rem;
  margin: 2rem auto 5rem auto;
}

:deep(.highcharts-background) {
  fill: none;
}

:deep(.highcharts-credits) {
  display: none;
}

h2 {
    span {
        color: rgb(216, 216, 216) !important;
        text-decoration: underline rgb(216, 216, 216);
    }
}

.double-chart-container {
    position: relative;
    margin: 2rem auto 5rem auto !important;
    background-color: #1F2940;
    padding: 1.5rem;
    text-align: center;
    max-width: 140rem;

    div {
        margin: 0 auto !important;
    }

    .chart {
        margin-bottom: 0 !important;
        margin-top: 0 !important;
    }
}
</style>