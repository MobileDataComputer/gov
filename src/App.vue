<template>
  <v-app class="main">
<!--    <NavbarComp v-if="$route.path !== '/signin'" app />-->
    <v-main>
      <RouterView class="router-view" />
    </v-main>
  </v-app>
</template>

<script setup>
// import NavbarComp from './components/NavbarComp.vue'
import { RouterView } from 'vue-router'
</script>

<style lang="scss" scoped>
.main {
  background-color: #141b2d !important;
}

.router-view {
  padding: 1.5rem 3rem 1.5rem 3rem !important;
}
</style>
