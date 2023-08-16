<template>
  <v-card
    elevation="6"
    color="#1f2940"
    class="main-card"
  >
    <v-card-title>
      <h3 class="basic-container-title">Metrologie apa</h3>
    </v-card-title>
    <highcharts :options="chartOptions" class="chart"></highcharts>
  </v-card>
</template>
<script setup>
const chartOptions = {
  chart: {
    type: 'area',
    style: {
      color: '#ffffff'
    }
  },
  title: {
    text: 'Grafic comparativ',
    style: {
      color: '#ffffff'
    }
  },
  xAxis: {
    allowDecimals: false,
    lineColor: '#fff',
    tickColor: '#fff',
    labels: {
      style: {
        color: '#fff'
      }
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
      text: 'Mii de ㎥',
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
  tooltip: {
    pointFormat: '{series.name} <b>{point.y:,.0f} ㎥</b><br/>',
    shared: true,
  },
  plotOptions: {
    area: {
      pointStart: 2019,
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
    }
  },
  colors: ['#0066FF', '#8cff66'],
  legend: {
    itemStyle: { color: '#ffffff' }
  },
  series: [
    {
      name: 'Vol. apa produsa',
      data: [
          73, 12, 18, 22, 25
      ]
    },
    {
      name: 'Vol apa inregistrata',
      data: [
        1,
        5,
        25,
        50,
        12,
      ]
    }
  ]
}
</script>

<style scoped lang="scss">
.main-card {
  min-width: 700px;
}

.volume-outer-container {
  display: flex;
  justify-content: space-around;
  margin-top: 2.5rem;
  flex-wrap: wrap;
  gap: 2rem;
}

.volume-inner-container {
  background-color: #384052;
  padding: 1rem 2rem;
  border-radius: 5px;
  min-width: 15rem;
}

h4 {
  font-size: 1.2rem;
  color: #0066ff;
  margin: 0.6rem 0;
}

.volume2 {
  color: #8cff66;
}

.chart {
  width: 90%;
  height: 17rem;
  margin: 2rem auto 0 auto;
}

:deep(.highcharts-background) {
  fill: none;
}

:deep(.highcharts-credits) {
  display: none;
}
</style>
