<template>
	<div id="account">
		<v-avatar color="grey">
			<v-icon icon="mdi-account-circle"></v-icon>
		</v-avatar>
		<div class="user-data">
			<h3>Paul Decker</h3>
			<h4>Police Officer III + 1</h4>
		</div>
		<div class="settings">
			<v-icon size="22" color="#4A4D64">mdi-cog-outline</v-icon>
		</div>
	</div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
#account {
	position: absolute;
	bottom: 4rem;
	left: 3rem;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
	.user-data {
		margin-left: 0.5rem;
		h3 {
			font-size: 15px;
			color: #C5C8DC;
			font-weight: 1000;
		}
		h4 {
			margin-top: -0.2rem;
			font-size: 12px;
			color: #4A4D64;
		}
	}
	.settings {
		flex-wrap: wrap !important;
		margin-left: 3rem;
		display: flex;
		justify-content: center;
		align-content: center;
	}
}
</style>