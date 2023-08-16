<template>
  <div>
    <TitleComp title="Intervenții" />
    <div class="outer-container">
      <div class="basic-container">
        <div class="basic-container-header">
          <h3 class="basic-container-title">Lista interventii</h3>
          <v-btn density="comfortable" icon="mdi-dots-vertical" color="#1F2940"></v-btn>
        </div>
        <div class="basic-container-body">
          <div class="first-option list-option" @click="dialog = true">
            <v-icon color="white" size="40">mdi-plus-circle-outline</v-icon>
            <p>Înregistrare intervenție nouă</p>
          </div>
          <v-dialog v-model="dialog" width="400px" scrim>
            <v-card>
              <v-card-title>
                <span class="text-h5">Înregistrare intervenție</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form v-model="validForm">
                    <v-text-field
                      label="Titlu Intervenție"
                      required
                      :counter="50"
                      class="mb-7"
                      :rules="rules.basic"
                    ></v-text-field>
                    <v-text-field
                      label="Descriere"
                      required
                      :counter="50"
                      class="mb-7"
                      :rules="rules.basic"
                    ></v-text-field>
                    <v-text-field
                      label="Durată Intervenție"
                      required
                      :counter="50"
                      class="mb-7"
                      :rules="rules.number"
                    ></v-text-field>
                    <v-text-field
                      label="Zonă"
                      required
                      :counter="50"
                      class="mb-7"
                      :rules="rules.basic"
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
          <li v-for="item in interventions" class="list-option" @click="selectPump(item)">
            <v-icon size="40" :color="getStatusColor(item.type)"> mdi-circle </v-icon>
            <p class="mx-4">{{ item.id }}</p>
            <div class="option-inner-container">
              <p>{{ item.title }}</p>
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
            <h2>{{ shownItem.title }}</h2>
            <h3>
              Tip intervenție: <span>{{ shownItem.type }}</span>
            </h3>
            <div class="description-container">
              <h3>{{ shownItem.description }}</h3>
            </div>
            <h2>Durată: {{ shownItem.duration }}</h2>
            <v-divider :thickness="3"></v-divider>
            <h2>Locație: {{ shownItem.location }}</h2>
            <v-divider :thickness="3"></v-divider>
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
  id: 1,
  title: 'Întreținerea Infrastructurii',
  description:
    'Întreținerea infrastructurii de apă și reparațiile periodice asigură buna funcționare și siguranța sistemului de distribuție a apei. Echipa de întreținere efectuează inspecții regulate, monitorizează parametrii de calitate a apei și înlocuiește componente uzate. Aceste activități contribuie la prevenirea avariei și menținerea calității serviciului de alimentare cu apă.',
  duration: '3 zile',
  location: 'Orașul A',
  type: 'Întreținere'
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

const interventions = [
  {
    id: 1,
    title: 'Întreținerea Infrastructurii',
    description:
      'Întreținerea infrastructurii de apă și reparațiile periodice asigură buna funcționare și siguranța sistemului de distribuție a apei. Echipa de întreținere efectuează inspecții regulate, monitorizează parametrii de calitate a apei și înlocuiește componente uzate. Aceste activități contribuie la prevenirea avariei și menținerea calității serviciului de alimentare cu apă.',
    duration: '3 zile',
    location: 'Orașul A',
    type: 'Întreținere'
  },
  {
    id: 2,
    title: 'Depistarea și Repararea Pierderilor',
    description:
      'Depistarea și remedierea scurgerilor de apă sunt prioritare pentru asigurarea eficienței și conservării resurselor. Echipele de intervenție utilizează tehnologii avansate pentru a identifica și repara pierderile în rețeaua de distribuție. Aceste măsuri contribuie la reducerea risipei de apă și la asigurarea unui sistem de distribuție durabil și fiabil.',
    duration: '1 săptămână',
    location: 'Orașul B',
    type: 'Reparare'
  },
  {
    id: 3,
    title: 'Monitorizarea Calității Apei',
    description:
      'Monitorizarea continuă a parametrilor calității apei este esențială pentru asigurarea potabilității și siguranței apei furnizate. Echipele de monitorizare prelevează probe și analizează compoziția apei, verificând parametrii fizici, chimici și bacteriologici. Aceste activități asigură respectarea standardelor de calitate și identificarea rapidă a oricăror anomalii.',
    duration: 'Continuu',
    location: 'Orașul C',
    type: 'Monitorizare'
  },
  {
    id: 4,
    title: 'Extinderea Aprovizionării cu Apă',
    description:
      'Extinderea rețelei de aprovizionare cu apă este necesară pentru a răspunde cererii în creștere și pentru a asigura accesul la apă potabilă în zonele noi. Proiectele de extindere implică planificare, proiectare și construcție de noi conducte și infrastructură de distribuție. Aceste intervenții îmbunătățesc acoperirea și eficiența sistemului de alimentare cu apă.',
    duration: '1 lună',
    location: 'Orașul D',
    type: 'Extindere'
  },
  {
    id: 5,
    title: 'Modernizarea Infrastructurii',
    description:
      'Modernizarea infrastructurii de apă implică înlocuirea și îmbunătățirea componentelor uzate sau depășite ale sistemului de distribuție. Aceste intervenții includ modernizarea stațiilor de tratare a apei, reabilitarea conductelor și înlocuirea echipamentelor vechi cu tehnologii mai avansate. Modernizările optimizează funcționarea sistemului și contribuie la eficiență și durabilitate.',
    duration: '2 săptămâni',
    location: 'Orașul E',
    type: 'Modernizare'
  },
  {
    id: 6,
    title: 'Răspuns de Urgență',
    description:
      'Intervenția de urgență este esențială în cazurile de avarii majore, scurgeri periculoase sau probleme care pot afecta alimentarea cu apă a comunității. Echipele de urgență sunt mobilizate pentru a acționa rapid, identifica și repara avaria, minimizând timpul de întrerupere a serviciului și reducând impactul asupra utilizatorilor.',
    duration: 'În derulare',
    location: 'Orașul F',
    type: 'Urgență'
  },
  {
    id: 7,
    title: 'Promovarea Conservării Apei',
    description:
      'Implementarea inițiativelor pentru promovarea conservării apei are scopul de a informa și educa comunitatea cu privire la utilizarea responsabilă a apei. Aceste intervenții includ campanii de conștientizare, distribuirea de resurse și instruirea utilizatorilor în practici eficiente de economisire a apei. Promovarea conservării apei susține utilizarea durabilă a resurselor și protejarea mediului înconjurător.',
    duration: 'Ongoing',
    location: 'Orașul G',
    type: 'Conservare'
  }
]

const selectPump = (item) => {
  shownItem.value = item
}

const getStatusColor = (type) => {
  if (type === 'Întreținere') {
    return '#8CFF66' // Light gray for Infrastructure Maintenance
  } else if (type === 'Reparare') {
    return '#0000FF' // Blue for Leak Detection and Repair
  } else if (type === 'Monitorizare') {
    return '#00FF00' // Green for Water Quality Monitoring
  } else if (type === 'Extindere') {
    return '#FFA500' // Orange for Water Supply Expansion
  } else if (type === 'Modernizare') {
    return '#800080' // Purple for Infrastructure Upgrades
  } else if (type === 'Urgență') {
    return '#FF0000' // Red for Emergency Response
  } else {
    return '' // Default color (if none of the above types match)
  }
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
  height: 85vh !important;
  max-height: 130rem;
}

.basic-container-body {
  overflow-y: scroll;
  height: 92% !important;
  padding: 1rem 0;
  -ms-overflow-style: none !important; /* IE and Edge */
  scrollbar-width: none !important; /* Firefox */
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
  height: 85vh !important;
  width: auto !important;
  display: flex;
  gap: 3rem;
  flex: 1;
  .basic-container {
    flex: 1 1 100%;
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

.v-divider {
  margin: 1rem;
}

.description-container {
  padding: 2rem;
  border: 1px solid #2f384d;
  border-radius: 8px;
  margin: 1rem;
  background-color: #1a2336;
}

h3 {
  font-weight: 500;
  
  span {
    font-weight: normal;
    color: rgb(211, 211, 211);
    text-decoration: underline rgb(211, 211, 211);;
  }
}

@media only screen and (max-width: 1880px) {
  .outer-container {
    justify-content: center;
  }
}
</style>
