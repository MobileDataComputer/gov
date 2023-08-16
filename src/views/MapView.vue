<template>
  <div>
    <TitleComp :title="title" />
    <div class="outer-container">
      <div class="inner-container">
          <div class="map-menu">
              <v-select
                label="Optiuni"
                :items="options"
                class="map-menu-option"
                v-model="selectedOptions"
                multiple
                chips
              >
              </v-select>
              <v-select
                label="Tip harta"
                :items="types"
                class="map-menu-option"
                v-model="selectedType"
              >
              </v-select>
              <v-text-field
                clearable
                label="Cautare"
                prepend-inner-icon="mdi-magnify"
                class="map-menu-option"
              ></v-text-field>
          </div>
          <div class="map-container">
              <map-fill-comp v-if="edit == false" :options="selectedOptions" />
              <MapEditComp v-if="edit == true" />
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleComp from '@/components/TitleComp.vue'
import MapFillComp from '@/components/MapFillComp.vue'
import MapEditComp from '@/components/MapEditComp.vue'
import { ref, onMounted } from 'vue'

const edit = ref(false)

const options = ["Camine", "Conducte", "Conducte Tureni", "Hidrofoare", "Rezervoare", "Contoare", "Numere Case"]
const types = ["Zone", "ISU", "Etc"]

const selectedOptions = ref([])
const selectedType = ref("Zone")

const location = ref("Turda")
const title = ref("Harta inteligenta")

onMounted(() => {
  location.value = localStorage.getItem('GLOBAL_LOCATION')
  title.value += " (" + location.value + ")"
})

</script>

<style lang="scss" scoped>
.outer-container {
  height: 80vh;
  display: flex;
  justify-content: left;
  gap: 1rem;
  flex-wrap: wrap;
}

.basic-container {
  width: 30rem !important;
  height: 85vh !important;
  max-height: 130rem;
}

.basic-container-body {
  overflow-y: scroll;
  height: 85% !important;
  padding: 1rem;
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
  justify-content: space-between;
  margin-bottom: 1rem;
  background-color: #2f384d;
  padding: 0.1rem 0.5rem;
  border-radius: 5px;
}

.map-container {
  display: flex;
  background-color: #1f2940;
  //flex: 1 1 60%;
  //min-width: 50rem;
  //max-width: 130rem;
  flex: 1;
  height: 100%;
  //max-height: 130rem;
  text-align: center;
  //padding: 1.5rem;
  flex-direction: row !important;
  justify-content: center;
  gap: 1.5rem;
  border: 1px solid #101624;
}

.inner-container {
  flex: 1;
}

.map-menu {
  background-color: #1f2940;
  display: flex;
  justify-content: center;
  align-items: center ;
}

.map-menu-option {
  width: 200px !important;
  height: 3.4rem !important;
  background-color: #1F2940;
  border: 1px solid #101624;
  border-radius: 0 !important;
}

@media only screen and (max-width: 1750px) {
  .map-container {
    flex: 1 1 100%;
  }
  .outer-container {
    justify-content: center;
    max-height: unset;
  }
}
</style>
