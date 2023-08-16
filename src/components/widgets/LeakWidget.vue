<template>
  <div class="basic-container">
    <div class="basic-container-header">
      <h3 class="basic-container-title">Scurgeri</h3>
      <v-btn density="comfortable" icon="mdi-dots-vertical" color="#1F2940"></v-btn>
    </div>
    <div class="basic-container-body">
      <v-btn class="mr-2" color="#2F384D">Anual</v-btn>
      <v-btn class="ml-2" color="#2F384D">Lunar</v-btn>
      <highcharts :options="chartOptions" class="chart"></highcharts>
    </div>
  </div>
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
      text: '',
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
    pointFormat: '{series.name} <b>{point.y:,.0f}</b><br/>',
    shared: true,
  },
  plotOptions: {
    area: {
      pointStart: 2020,
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
  colors: ['#F7EA0A', '#A31414'],
  legend: {
    itemStyle: { color: '#ffffff' }
  },
  series: [
    {
      name: 'Alarme',
      data: [
        4, 8, 12, 14
      ]
    },
    {
      name: 'Atentionari',
      data: [
        1,
        5,
        25,
        15,
      ]
    }
  ]
}
</script>

<style scoped lang="scss">
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
