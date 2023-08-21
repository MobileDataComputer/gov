<template>
  	<div id="navBar">
    	<div>
			<div class="seal-container">
				<div class="seal-border">
					<div id="seal"></div>
				</div>
			</div>
			<NavBarRoutes></NavBarRoutes>
		</div>
  	</div>
</template>

<script setup lang="ts">

import NavBarRoutes from "@/components/NavBarRoutes.vue";
</script>

<style scoped lang="scss">
#navBar {
  	display: flex;
  	min-width: 20rem;
	max-width: 25%;
  	height: 83%;
	padding: 2.3rem 1.5rem 2.3rem 1.5rem;
	div {
		background-color: #1E1E2D;
		height: 100%;
		width: 100%;
		border-radius: 25px;
		.seal-container {
			width: 100%;
			display: flex;
			justify-content: center;
			align-content: center;
			height: 6rem;
			.seal-border {
				margin-top: -0.7rem;
				width: 6rem;
				height: 6rem;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: transparent; /* Change this to your desired background color */
				border-radius: 100%;
				border: 0px solid #000; /* Adjust the border color and size as needed */
				box-sizing: border-box;
			}

			#seal {
				width: calc(100% + 10px); /* Add 2px to the width for the 1px border on each side */
				height: calc(100% + 10px); /* Add 2px to the height for the 1px border on each side */
				background-size: contain; /* Use contain to make sure the image fits within the container */
				background-repeat: no-repeat;
				background-position: center;
				background-image: url("../assets/icons/seal_high_resolution.png");
				border-radius: 100%;
				margin: -8px; /* Counteract the extra width and height for perfect alignment */
			}
		}
	}

}
</style>