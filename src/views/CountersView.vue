<template>
  <div>
      <TitleComp title="Contoare" />
      <v-data-table
              :headers="headers"
              :items="items"
              :sort-by="[{ key: 'assigned', order: 'asc' }]"
              :search="search"
              color="#1E80E6"
              class="table"
              show-select
              v-model="selectedItems"
              :loading="loading"
              loading-text="Se incarca datele.."
              no-data-text="Nu exista date."
      >
          <template v-slot:top>
              <v-toolbar flat>
                  <v-toolbar-title>Lista contoare</v-toolbar-title>
                  <v-btn
                    variant="outlined"
                    :disabled="selectedItems.length === 0"
                    @click="assignDmaDialog = true"
                  >
                      Atribuire DMA
                  </v-btn>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-text-field
                          v-model="search"
                          prepend-inner-icon="mdi-magnify"
                          label="Cautare"
                          single-line
                          hide-details
                  ></v-text-field>
                  <v-dialog v-model="assignDmaDialog" max-width="500px" scrim>
                      <v-card class="delete-card">
                          <v-card-title>Atribuire DMA</v-card-title>
                          <div class="card-inner">
                              <v-alert
                                color="#0066ff"
                                theme="dark"
                                icon="mdi-information-outline"
                                border
                                variant="outlined"
                                style="text-align: left"
                                class="mb-6"
                              >
                                  Atentie - Orice contor poate fi atribuit unui singur DMA.
                              </v-alert>
                              <v-alert
                                theme="dark"
                                border
                                variant="outlined"
                                type="warning"
                                class="mb-6"
                                style="text-align: left"
                                v-if="!selectedItems.every(element => items.filter(el => el.id === element)[0].assigned !== true)"
                              >
                                  Atentie - Unul sau mai multe dintre contoarele selectate au deja un DMA atribuit.

                              </v-alert>
                              <v-autocomplete
                                :items="dmaList"
                                item-title="name"
                                label="Alegere DMA"
                                v-model="selectedDma"
                              >
                              </v-autocomplete>
                          </div>

                          <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="#1E80E6" variant="text" @click="assignDmaDialog = false">Anulare</v-btn>
                              <v-btn color="#1E80E6" variant="text" @click="save">Salvare</v-btn>
                              <v-spacer></v-spacer>
                          </v-card-actions>
                      </v-card>
                  </v-dialog>
              </v-toolbar>
          </template>
          <template v-slot:item.assigned="{ item }">
              <v-chip :color="item.columns.assigned ? 'success' : 'error'">
                  {{ item.columns.assigned ? 'Atribuit' : 'Neatribuit' }}
              </v-chip>
          </template>
      </v-data-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TitleComp from '@/components/TitleComp.vue'
import axios from "axios";

const headers = [
    { title: 'Id', align: 'start', key: 'id' },
    { title: 'Client', key: 'client' },
    { title: 'Adresa', key: 'address' },
    { title: 'Status atribuire', key: 'assigned' },
]

const items = ref([])
const dmaList = ref([])
const search = ref('')
const assignDmaDialog = ref(false)
const loading = ref(false)
const selectedDma = ref(null)
const selectedItems = ref([])

const save = () => {
    if (selectedDma.value) {
        for (let el of selectedItems.value) {
            items.value[items.value.indexOf(items.value.filter(item => item.id === el)[0])].assigned = true
        }
        const options = {
            method: 'POST',
            url: `${import.meta.env.VITE_BASEURL}/contoare/assign_dma`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('JWT')}`
            },
            data: {
                id_array: selectedItems.value,
                dma_id: dmaList.value.filter(element => element.name === selectedDma.value)[0].id
            }
        }

        axios.request(options).then((res) => {
            if (res.status !== 201) {
                console.log('err')
            }
            selectedItems.value = []
            //todo HANDLE SUCCESS AND ERRORS WITH A TEMP NOTIFICATION SYSTEM
        }).catch((err) => console.log(err))
        assignDmaDialog.value = false
    }
}

onMounted(() => {
    loading.value = true
    const options = {
        method: 'GET',
        url: `${import.meta.env.VITE_BASEURL}/contoare/get`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
    }

    const options2 = {
        method: 'GET',
        url: `${import.meta.env.VITE_BASEURL}/dma/get`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('JWT')}`
        }
    }

    axios.request(options).then((res) => {
        items.value = res.data.map(item => {
            return {...item, assigned: !!item.dma_id}
        })
        loading.value = false
    }).catch((err) => {
        loading.value = false
        console.log(err)
    })

    axios.request(options2).then((res) => {
        dmaList.value = res.data
        loading.value = false
    }).catch((err) => {
        loading.value = false
        console.log(err)
    })

})

</script>

<style lang="scss" scoped>
.delete-card {
    padding: 2rem;
    background-color: #101624;
    h4 {
        margin-bottom: 1.5rem;
        font-size: 1.2rem;
    }
}

.card-inner {
    text-align: center;
    margin-top: 16px;
}

.table {
    background-color: #101624;
    .v-toolbar {
        background-color: #1f2940;
    }
    :deep(.v-data-table__td) {
        background-color: #101624 !important;
    }
}
</style>