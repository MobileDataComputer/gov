<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :sort-by="[{ key: 'id', order: 'asc' }]"
      :search="search"
      color="#1E80E6"
      class="table"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Utilizatori</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Cautare"
            single-line
            hide-details
          ></v-text-field>
          <v-dialog v-model="dialog" max-width="500px" scrim>
            <template v-slot:activator="{ props }">
              <v-btn
                color="#1E80E6"
                dark
                v-bind="props"
                icon="mdi-plus-box"
                @click="resetAll"
              ></v-btn>
            </template>
            <v-card class="main-card">
              <v-card-title>
                <span class="text-h5">{{ formTitle() }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form v-model="validForm">
                    <v-text-field
                      v-model="editedItem.lastname"
                      label="Nume"
                      required
                      :counter="50"
                      class="mb-7"
                      :rules="rules.name"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.firstname"
                      label="Prenume"
                      required
                      :counter="50"
                      class="mb-7"
                      :rules="rules.name"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.email"
                      label="Email"
                      required
                      :counter="50"
                      class="mb-7"
                      :rules="rules.email"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.phone"
                      label="Telefon"
                      required
                      :counter="10"
                      class="mb-7"
                      :rules="rules.phone"
                    ></v-text-field>
                    <v-text-field v-model="editedItem.role" label="Functie" required></v-text-field>
                    <!--                      todo add vselect above-->
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#1E80E6" variant="text" @click="close"> Anulare </v-btn>
                <v-btn color="#1E80E6" variant="text" @click="save"> Salvare </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px" scrim>
            <v-card class="delete-card">
              <h4>Sunteti sigur ca doriti sa stergeti acest utilizator ?</h4>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#1E80E6" variant="text" @click="close()">Nu, anulare</v-btn>
                <v-btn color="#1E80E6" variant="text" @click="deleteConfirm()"
                  >Da, sunt sigur</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="editItem(item.raw)"> mdi-pencil </v-icon>
        <v-icon size="small" @click="deleteItem(item.raw)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const headers = ref([
  { title: 'Id', align: 'start', key: 'id' },
  { title: 'Email', key: 'email' },
  { title: 'Nume', key: 'lastName' },
  { title: 'Prenume', key: 'firstName' },
  { title: 'Numar de telefon', key: 'phoneNumber' },
  { title: 'Functie', key: 'roleId' },
  { title: 'Actions', key: 'actions', sortable: false }
])

const emailTest = /[^\s@]+@[^\s@]+\.[^\s@]+/
const intTest = /^\d+$/
const strTest = /^[a-zA-Z]+$/

const rules = {
  name: [
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
      if (value?.match(strTest)) return true
      return 'Acest camp nu poate contine altceva in afara de litere.'
    }
  ],

  email: [
    (value) => {
      if (value) return true
      return 'Acest camp este obligatoriu.'
    },
    (value) => {
      if (value?.length <= 50) return true
      return 'Acest camp nu poate fi mai lung de 50 de caractere.'
    },
    (value) => {
      if (value?.length >= 5) return true
      return 'Acest camp nu poate fi mai scurt de 5 caractere.'
    },
    (value) => {
      if (value?.match(emailTest)) return true
      return 'Introduceti o adresa de email valida.'
    }
  ],

  phone: [
    (value) => {
      if (value) return true
      return 'Acest camp este obligatoriu.'
    },
    (value) => {
      if (value?.length <= 10) return true
      return 'Acest camp nu poate fi mai lung de 10 de caractere.'
    },
    (value) => {
      if (value?.length >= 10) return true
      return 'Acest camp nu poate fi mai scurt de 10 caractere.'
    },
    (value) => {
      if (value?.match(intTest)) return true
      return 'Acest camp poate contine doar cifre.'
    }
  ]
}

const items = ref([])

const validForm = ref(false)

const search = ref('')

const dialog = ref(false)
const dialogDelete = ref(false)

const editedIndex = ref(-1)
const editedItem = ref({ id: 0, email: '', lastname: '', firstname: '', phone: '', role: '' })
const defaultItem = ref({ id: 0, email: '', lastname: '', firstname: '', phone: '', role: '' })

const formTitle = () => {
  return editedIndex.value === -1 ? 'Utilizator nou' : 'Editare utilizator'
}

const close = () => {
  dialog.value ? (dialog.value = false) : (dialogDelete.value = false)
  editedItem.value = defaultItem.value
  editedIndex.value = -1
}

const editItem = (item) => {
  editedIndex.value = items.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value = true
}

const resetAll = () => {
  editedIndex.value = -1
  editedItem.value = defaultItem.value
}

const save = () => {
  if (editedIndex.value > -1) {
    Object.assign(items.value[editedIndex.value], editedItem.value)
    editedIndex.value = -1
    // todo ADD API CALL FOR EDITING HERE
  } else items.value.push(editedItem.value) // todo ADD API CALL FOR SAVING HERE
  editedItem.value = defaultItem.value
  close()
}

const deleteItem = (item) => {
  editedIndex.value = items.value.indexOf(item)
  editedIndex.value = Object.assign({}, item)
  dialogDelete.value = true
}

const deleteConfirm = () => {
  items.value.splice(editedIndex.value, 1)
  close()
}

onMounted(() => {
  const options = {
    method: 'GET',
    url: `${import.meta.env.VITE_BASEURL}/accounts`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('JWT')}`
    }
  }

  axios
    .request(options)
    .then(function (response) {
      items.value = response.data
      items.value.map((item) => {
        // console.log(item.role)
      })
    })
    .catch(function (error) {
      console.error(error)
    })
})
</script>

<style lang="scss" scoped>
.delete-card {
  padding: 2rem;
  text-align: center;
  background-color: #101624;
  h4 {
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
  }
}
//
//:deep(.v-table) {
//  :deep(.v-tooblar) {
//    background: #141b2d !important;
//  }
//  background-color: #101624 !important;
//}

.table {
  background-color: #101624;
  .v-toolbar {
    background-color: #1f2940;
  }
  :deep(.v-data-table__td) {
    background-color: #101624 !important;
  }
}

.main-card {
  background-color: #101624;
}
</style>
