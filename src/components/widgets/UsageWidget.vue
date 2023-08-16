<template>
  <div class="basic-container">
    <div class="basic-container-header">
      <h3 class="basic-container-title">Utilizare retea</h3>
      <v-btn density="comfortable" icon="mdi-dots-vertical" color="#1F2940"></v-btn>
    </div>
    <div class="basic-container-body">
      <v-btn class="mx-2" color="#2F384D">Ani</v-btn>
      <v-btn class="mx-2" color="#2F384D">Luni</v-btn>
      <v-btn class="mx-2" color="#2F384D">Zile</v-btn>
      <v-btn class="mx-2" color="#2F384D">Ore</v-btn>
      <div class="flex-container">
        <div class="volume-outer-container">
          <div class="volume-inner-container">
            <v-icon size="50">mdi-pin</v-icon>
            <h4>29.118</h4>
            <h3 class="volume-subtitle">Puncte de furnizare</h3>
          </div>
          <div class="volume-inner-container">
            <v-icon size="50">mdi-counter</v-icon>
            <h4>7.520</h4>
            <h3 class="volume-subtitle">Total contoare</h3>
          </div>
        </div>
        <highcharts :options="chartOptions" class="chart"></highcharts>
      </div>
    </div>
  </div>
</template>
<script setup>
const chartOptions = {
  chart: {
    type: 'column',
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
    },
    categories: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    crosshair: true
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
    pointFormat: '{series.name} <b>{point.y:,.0f}</b><br/>'
  },
  // plotOptions: {
  //     area: {
  //         pointStart: 1940,
  //         marker: {
  //             enabled: false,
  //             symbol: 'circle',
  //             radius: 2,
  //             states: {
  //                 hover: {
  //                     enabled: true
  //                 }
  //             }
  //         }
  //     }
  // },
  colors: ['#0066FF', '#8cff66'],
  legend: {
    itemStyle: { color: '#ffffff' }
  },
  series: [
    {
      name: 'Utilizare retea',
      data: [3, 5, 6, 12, 8, 4, 1]
    }
  ]
}
</script>

<style scoped lang="scss">
.volume-outer-container {
  display: flex;
  flex-direction: column;
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
  max-width: 15rem;
}

h4 {
  font-size: 1.2rem;
  color: #0066ff;
  margin: 0.6rem 0;
}

.chart {
  //width: 90%;
  height: 20rem;
  margin: 2rem auto 0 auto;
  min-width: 20rem;
  flex: 1 1 50%;
}

:deep(.highcharts-background) {
  fill: none;
}

:deep(.highcharts-credits) {
  display: none;
}

.flex-container {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
}

@media only screen and (max-width: 1965px) {
  .flex-container {
    justify-content: center !important;
  }

  .volume-outer-container {
    flex-direction: row;
  }
}
</style>
