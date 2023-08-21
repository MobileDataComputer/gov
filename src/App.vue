<template>
  <v-app class="main">
		 <div class="wrapper">
			 <NavbarComp v-if="$route.path !== '/signin'" app />
			 <v-main>
				 <RouterView class="router-view" />
			 </v-main>
		 </div>
  </v-app>
</template>

<script setup>
import NavbarComp from './components/NavbarComp.vue'
import { RouterView } from 'vue-router'
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Multani&display=swap');

.main {
  background-color: #151521 !important;
}

.wrapper {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: row;
}

.router-view {
  padding: 1.5rem 3rem 1.5rem 3rem !important;
}
</style>
