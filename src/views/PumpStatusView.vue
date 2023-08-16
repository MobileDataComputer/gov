<template>
  <div>
    <TitleComp title="Status Pompe" />
    <div class="outer-container">
      <div class="basic-container">
        <div class="basic-container-header">
          <h3 class="basic-container-title">Lista pompe</h3>
          <v-btn density="comfortable" icon="mdi-dots-vertical" color="#1F2940"></v-btn>
        </div>
        <div class="basic-container-body overflow-scroll">
          <div class="first-option list-option" @click="dialog = true">
            <v-icon color="white" size="40">mdi-plus-circle-outline</v-icon>
            <p>Adaugare pompa</p>
          </div>
          <v-dialog v-model="dialog" width="400px" scrim>
            <v-card>
              <v-card-title>
                <span class="text-h5">Adaugare pompa</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form v-model="validForm">
                    <v-text-field
                      label="Nume pompa"
                      required
                      :counter="50"
                      class="mb-7"
                      :rules="rules.basic"
                    ></v-text-field>
                    <v-text-field
                      label="Volum (l/s)"
                      required
                      :counter="50"
                      class="mb-7"
                      :rules="rules.number"
                    ></v-text-field>
                    <v-text-field
                      label="Localizare (lat.)"
                      required
                      :counter="50"
                      class="mb-7"
                      :rules="rules.number"
                    ></v-text-field>
                    <v-text-field
                      label="Localizare (long.)"
                      required
                      :counter="50"
                      class="mb-7"
                      :rules="rules.number"
                    ></v-text-field>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#0066FF" @click="dialog = false">Anulare</v-btn>
                <v-btn color="#0066FF" @click="dialog = false">Salvare</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <li v-for="item in items" class="list-option" @click="selectPump(item)">
            <v-icon size="40" :color="item.status === 'on' ? '#8CFF66' : '#C00000'"
              >mdi-circle</v-icon
            >
            <p class="mx-4">{{ item.id }}</p>
            <div class="option-inner-container">
              <p>{{ item.name }}</p>
              <p>{{ item.volume }} l/s</p>
              <div class="option-icon-btn-container">
                <v-icon size="40" color="white">mdi-map-marker-radius</v-icon>
                <v-icon size="40" color="white">mdi-square-edit-outline</v-icon>
              </div>
            </div>
          </li>
        </div>
      </div>
      <div class="mid-inner-container">
        <div class="basic-container">
          <div class="basic-container-header">
            <h3 class="basic-container-title">Informatii</h3>
            <v-btn density="comfortable" icon="mdi-dots-vertical" color="#1F2940"></v-btn>
          </div>
          <div class="basic-container-body">
            <div class="information-top-container">
              <div class="information-top-inner-container">
                <p class="information-title">Presiune descarcare</p>
                <div class="information-value-separation">
                  <p>{{ shownItem.pressure }}</p>
                  <p>PSI</p>
                </div>
              </div>
              <div class="information-top-inner-container">
                <p class="information-title">Flux total</p>
                <div class="information-value-separation">
                  <p>{{ shownItem.flux }}</p>
                  <p>l/m</p>
                </div>
              </div>
            </div>
            <v-icon size="85" :color="shownItem.status === 'on' ? '#8CFF66' : '#C00000'"
              >mdi-pump</v-icon
            >
            <div class="information-top-container">
              <div class="information-top-inner-container">
                <p class="information-title">Timp functionare</p>
                <div class="information-value-separation">
                  <p>{{ shownItem.hours }}</p>
                  <p>ore</p>
                </div>
              </div>
              <div class="information-top-inner-container">
                <p class="information-title">Total pierderi</p>
                <div class="information-value-separation">
                  <p>{{ shownItem.leaks }}</p>
                  <p>㎥</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="basic-container">
          <div class="basic-container-header">
            <h3 class="basic-container-title">Nivel rezervor</h3>
            <v-btn density="comfortable" icon="mdi-dots-vertical" color="#1F2940"></v-btn>
          </div>
          <div class="basic-container-body">
            <v-btn class="mr-2" color="#2F384D">Anual</v-btn>
            <v-btn class="ml-2" color="#2F384D">Lunar</v-btn>
            <highcharts :options="chartOptions" class="chart"></highcharts>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleComp from '@/components/TitleComp.vue'
import { ref } from 'vue'

const shownItem = ref({
  id: 0,
  name: '',
  volume: 0,
  status: '',
  pressure: 0,
  flux: 0,
  hours: 0,
  leaks: 0
})

const intTest = /^\d+$/

const dialog = ref(false)

const rules = {
  basic: [
    (value) => {
      if (value) return true
      return 'Acest camp este obligatoriu.'
    },
    (value) => {
      if (value?.length <= 50) return true
      return 'Acest camp nu poate fi mai lung de 50 de caractere.'
    },
    (value) => {
      if (value?.length >= 3) return true
      return 'Acest camp nu poate fi mai scurt de 3 caractere.'
    }
  ],

  number: [
    (value) => {
      if (value) return true
      return 'Acest camp este obligatoriu.'
    },
    (value) => {
      if (value?.length <= 50) return true
      return 'Acest camp nu poate fi mai lung de 50 de caractere.'
    },
    (value) => {
      if (value?.length >= 3) return true
      return 'Acest camp nu poate fi mai scurt de 3 caractere.'
    },
    (value) => {
      if (value?.match(intTest)) return true
      return 'Acest camp poate contine doar cifre.'
    }
  ]
}

const chartOptions = {
  chart: {
    type: 'area',
    style: {
      color: '#ffffff'
    }
  },
  title: {
    text: 'Grafic nivel',
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
    pointFormat: '{series.name} <b>{point.y:,.0f} ㎥</b><br/>'
  },
  plotOptions: {
    area: {
      pointStart: 1940,
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
  colors: ['#0066FF'],
  legend: {
    itemStyle: { color: '#ffffff' }
  },
  series: [
    {
      name: 'Vol. apa',
      data: [
        4, 8, 12, 14, 12, 2, 9, 13, 50, 170, 299, 438, 841, 1169, 1703, 2422, 3692, 5543, 7345,
        12298, 18638, 22229, 25540, 28133, 29463, 31139, 31175, 31255, 29561, 27552, 26008, 25830,
        26516, 27835, 28537, 27519, 25914, 25542, 24418, 24138, 24104, 23208, 22886, 23305, 23459,
        23368, 23317, 23575, 23205, 22217, 21392, 19008, 13708, 11511, 10979, 10904, 11011, 10903,
        10732, 10685, 10577, 10526, 10457, 10027, 8570, 8360, 7853, 5709, 5273, 5113, 5066, 4897,
        4881, 4804, 4717, 4571, 4018, 3822, 3785, 3805, 3750, 3708, 3708
      ]
    }
  ]
}

const items = [
  {
    id: 0,
    name: 'Nume pompa',
    volume: 16,
    status: 'on',
    pressure: 32.44,
    flux: 6221,
    hours: 71.2,
    leaks: 21.4
  },
  {
    id: 1,
    name: 'Nume pompa',
    volume: 16,
    status: 'on',
    pressure: 21.44,
    flux: 4178,
    hours: 71.2,
    leaks: 21.4
  },
  {
    id: 2,
    name: 'Nume pompa',
    volume: 16,
    status: 'on',
    pressure: 61.24,
    flux: 6221,
    hours: 71.2,
    leaks: 21.4
  },
  {
    id: 3,
    name: 'Nume pompa',
    volume: 16,
    status: 'off',
    pressure: 22.9,
    flux: 4178,
    hours: 71.2,
    leaks: 21.4
  },
  {
    id: 4,
    name: 'Nume pompa',
    volume: 16,
    status: 'on',
    pressure: 21.44,
    flux: 6221,
    hours: 71.2,
    leaks: 21.4
  },
  {
    id: 5,
    name: 'Nume pompa',
    volume: 16,
    status: 'off',
    pressure: 32.44,
    flux: 4178,
    hours: 71.2,
    leaks: 21.4
  },
  {
    id: 6,
    name: 'Nume pompa',
    volume: 16,
    status: 'off',
    pressure: 32.44,
    flux: 6221,
    hours: 71.2,
    leaks: 21.4
  },
  {
    id: 7,
    name: 'Nume pompa',
    volume: 16,
    status: 'on',
    pressure: 21.86,
    flux: 4178,
    hours: 71.2,
    leaks: 21.4
  },
  {
    id: 8,
    name: 'Nume pompa',
    volume: 16,
    status: 'on',
    pressure: 32.44,
    flux: 6221,
    hours: 71.2,
    leaks: 21.4
  },
  {
    id: 9,
    name: 'Nume pompa',
    volume: 16,
    status: 'on',
    pressure: 44.12,
    flux: 4178,
    hours: 71.2,
    leaks: 21.4
  },
  {
    id: 10,
    name: 'Nume pompa',
    volume: 16,
    status: 'on',
    pressure: 12.34,
    flux: 6221,
    hours: 71.2,
    leaks: 21.4
  }
]

const selectPump = (item) => {
  shownItem.value = item
}
</script>

<style lang="scss" scoped>
.outer-container {
  height: auto;
  max-height: 85vh !important;
  display: flex;
  justify-content: left;
  gap: 3rem;
  flex-wrap: wrap;
}

.basic-container {
  width: 30rem;
  //height: 85vh !important;
  max-height: 100rem;
}

.basic-container-body {
  height: 92% !important;
  padding: 1rem 0;
  -ms-overflow-style: none !important; /* IE and Edge */
  scrollbar-width: none !important; /* Firefox */
}

.overflow-scroll {
  overflow-y: scroll;
}

.basic-container-body::-webkit-scrollbar {
  /* Chrome & others */
  display: none;
}

.inner-flex {
  display: flex;
  width: 100% !important;
  justify-content: space-between;
  padding: 1rem;
}

.list-option {
  display: flex;
  align-items: center;
  //justify-content: space-between;
  margin-bottom: 1rem;
  background-color: #2f384d;
  padding: 0.1rem 0.5rem;
}

.list-option:hover {
  background-color: #1f2940;
  cursor: pointer;
}

.first-option {
  justify-content: left;
  p {
    margin-left: 1.5rem;
  }
}

.first-option:hover {
  cursor: pointer;
  background-color: #1f2940;
}

.option-inner-container {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.mid-inner-container {
  //height: 85vh !important;
  width: auto !important;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  .basic-container {
    height: auto !important;
    //max-height: 50%;
    width: auto !important;
  }
}

.information-top-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 5rem;
  gap: 20rem;
}

.information-top-inner-container {
  background-color: #384052;
  min-width: 15rem;
  padding: 0.75rem;
  border-radius: 5px;
  margin: 2.5rem 0;
}

.information-value-separation {
  display: flex;
  align-items: center;
  justify-content: space-around;
  p {
    color: #0066ff;
    font-weight: bold;
    font-size: 1.2rem;
  }
}

.information-title {
  font-size: 1.4rem;
  margin-bottom: 0.7rem;
}

.chart {
  width: 90%;
  height: 15rem;
  margin: 2rem auto 0 auto;
}

:deep(.highcharts-background) {
  fill: none;
}

:deep(.highcharts-credits) {
  display: none;
}

@media only screen and (max-width: 1880px) {
  .outer-container {
    justify-content: center;
  }
}
</style>
