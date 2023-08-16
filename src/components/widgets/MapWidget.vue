<template>
  <div class="basic-container">
    <div class="basic-container-header">
      <h3 class="basic-container-title">Harta</h3>
      <v-btn density="comfortable" icon="mdi-dots-vertical" color="#1F2940"></v-btn>
    </div>
    <div class="basic-container-body">
      <MapFillComp :options="selectedOptions" />
    </div>
  </div>
</template>
<script setup>
import MapFillComp from '@/components/MapFillComp.vue'
import { ref } from 'vue';

const selectedOptions = ref([])
</script>

<style scoped lang="scss"></style>
