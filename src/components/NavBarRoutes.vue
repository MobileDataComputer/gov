<template>
	<div class="routes-container">
		<router-link to="/" exact class="route-item" active-class="active-route">
			<span class="mdi mdi-card-bulleted-outline"></span> <!-- Dashboard icon -->
			Dashboard
		</router-link>

		<div v-for="(category, index) in categories" :key="index" class="category">
			<h2>{{ category.name }}</h2>
			<router-link
				v-for="(route, subIndex) in category.routes"
				:key="subIndex"
				:to="route.path"
				class="route-item"
				active-class="active-route"
			>
				<span class="mdi" :class="route.icon"></span>
				{{ route.name }}
			</router-link>
		</div>
	</div>
</template>


<script setup lang="ts">
import { ref } from 'vue';

const categories = ref([
	{
		name: 'Functionaliti',
		routes: [
			{ name: 'Cautare persoane', path: '/search-person', icon: 'mdi-magnify' },
			{ name: 'Cautare Masini', path: '/search-car', icon: 'mdi-car-search-outline' },
			{ name: 'Harti', path: '/map', icon: 'mdi-map-search-outline' },
		],
	},
	{
		name: 'Devlopment',
		routes: [
			{ name: 'Changelog', path: '/changelog', icon: 'mdi-history' },
			{ name: 'Sugestii & Bug Report', path: '/bug-report', icon: 'mdi-bug-check-outline' },
		],
	},
]);

</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@200;300;400;500&display=swap');
.active-route {
	font-weight: bold;
	color: #e1e1e1 !important;
}

.routes-container {
	margin-top: 3rem;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;

	padding: 2rem;
}

.category {
	margin-top: 1rem;
	h2 {
		font-family: 'Barlow', sans-serif;
		font-size: 15px;
		letter-spacing: 3px;
		color: #495672;
		margin-bottom: 0.6rem;
	}
	.route-item {
		margin-left: 0.5rem;
	}
}

.route-item {
	display: flex;
	align-items: center;
	text-decoration: none;
	margin-bottom: 0.5rem;
	color: #696c7a;
	.mdi {
		margin-right: 0.5rem;
		font-size: 1.2rem;
	}
}
</style>
