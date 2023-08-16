<template>
  <div>
    <!--      <h1 class="version">{{version}}</h1>-->
    <v-app-bar color="rgb(31,41,64)" prominent elevation="1">
      <template v-slot:append>
        <v-dialog v-model="dialog" width=500 scrim>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">
              <v-icon size="30" class="mr-3">mdi-map-marker-radius</v-icon>
              Selectare locatie
            </v-btn>
          </template>

          <v-card>
            <v-card-title>Selectare locatie globala</v-card-title>
            <v-card-text>
              <v-autocomplete label="Locatie" :items="locations" v-model="selectedLocation"></v-autocomplete>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#1E80E6" variant="text" @click="dialog = false"> Anulare </v-btn>
              <v-btn color="#1E80E6" variant="text" @click="save()"> Salvare </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>
      <v-toolbar-title>Compania de apă Arieș</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer theme="dark" disable-resize-watcher v-model="drawer" :rail="!drawer" color="#1f2940"
      disable-route-watcher>
      <NavBarUserComp v-if="userData.role" :role="userData.role" :lastname="userData.lastname"
        :firstname="userData.firstname">
      </NavBarUserComp>

      <v-tabs v-model="tab" direction="vertical" hide-slider class="mt-5" v-if="routes.length > 0">
        <v-tab v-for="route in routes" :key="route.id" :value="route.name" color="white" :to="route.route">
          <v-icon class="tab-icon" size="25" selected-class="tab-selected">{{ route.icon }}</v-icon>
          {{ route.name }}
        </v-tab>
      </v-tabs>
      <template v-slot:append>
        <div class="help-tab-container">
          <v-tab value="home" color="white" to="/" class="help-tab mb-5">
            <v-icon class="tab-icon" size="25" selected-class="tab-selected">mdi-help-circle-outline</v-icon>
            Ajutor
          </v-tab>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import NavBarUserComp from '../components/NavBarUserComp.vue'
import axios from 'axios'

const drawer = ref(true)
const tab = ref('home')

const dialog = ref(false)

const routes = ref([])
const userData = ref({})

const locations = ref(['Turda', 'Tureni', 'Etc'])
const selectedLocation = ref('')


const save = () => {
  localStorage.setItem("GLOBAL_LOCATION", selectedLocation.value)
  dialog.value = false
}

const options = {
  method: 'GET',
  url: `${import.meta.env.VITE_BASEURL}/user`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('JWT')}`
  }
}

async function getData() {
  await axios.request(options)
    .then((response) => {
      userData.value = response.data.user
      routes.value = response.data.routes
    })
    .catch((error) => console.error(error))
}



onMounted(() => {
  getData()
})

</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Rubik:wght@400;500&display=swap');

* {
  font-family: 'Rubik', sans-serif;
  font-weight: 100;
}

$primary-color: #42a5f5;
$secondary-color: #1f2940;
$background-color: #141b2d;
$text-color: #ffffff;

.dropdown {
  transform: scaleY(1);
}

.v-tabs {
  div {
    padding-left: 0.3rem;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}

.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0 !important;
  height: 0 !important;
}

.dropdown-selected {
  background-color: transparent !important;
}

.first-selected::before {
  content: '';
  height: 88%;
  width: 94%;
  background-color: rgba(0, 140, 255, 0.058) !important;
  z-index: 100;
  position: absolute;
  margin-left: 0.5rem;
  border-radius: 5px;
}

.new-icon {
  position: absolute;
  right: 1rem;
  color: #29b6f6 !important;
}

.v-avatar {
  z-index: 100;
}

.module-border {
  height: 5.5rem;
  width: 5.5rem;
  background: rgb(0, 206, 255);
  background: linear-gradient(56deg, rgba(0, 206, 255, 1) 0%, rgba(120, 0, 135, 1) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 90px;
  margin-bottom: 1.3rem;

  .v-avatar {
    img {
      width: 5rem;
      height: 5rem;
      border-radius: 180px;
      object-fit: cover;
    }
  }
}

.v-main {
  background-color: $background-color;
}

.drawer {
  background-color: blue !important;
}

//.userContainer {
//  display: flex;
//  justify-content: center;
//  align-items: center;
//  height: 18rem;
//  flex-direction: column;
//  h2 {
//    font-size: 1.3rem;
//  }
//  h3 {
//    font-size: 1rem;
//    color:rgba(255, 255, 255, 0.61);
//  }
//  h4 {
//    color:rgba(255, 255, 255, 0.61);
//    margin-bottom: 1rem;
//  }
//}
.menu {
  height: 3rem;
}

.v-toolbar-title {
  color: white;
}

.tab-icon {
  margin-right: 2rem;
}

.v-tab--selected::before {
  content: '';
  height: 88%;
  width: 100%;
  background-color: rgba(0, 140, 255, 0.116) !important;
  z-index: 100;
  position: absolute;
  border-left: 2px solid #0066ff;
}

.v-tab {
  text-transform: none !important;
  font-size: 1rem;
}

.version {
  font-size: 1rem;
  position: absolute;
  z-index: 1000;
  bottom: 1rem;
  right: 1rem;
}

.help-tab-container {
  display: block !important;
}

.help-tab {
  display: flex;
  justify-content: left;
  height: 3rem !important;
}

@media (min-width: 1280px) {
  .menu {
    display: none;
  }
}

@keyframes scale-in-ver-top {
  0% {
    transform: scaleY(0);
    transform-origin: 100% 0;
    opacity: 1;
  }

  100% {
    transform: scaleY(1);
    transform-origin: 100% 0;
    opacity: 1;
  }
}
</style>
