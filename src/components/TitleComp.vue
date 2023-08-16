<template>
  <div class="title-container">
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup>
const props = defineProps(['title'])
</script>

<style scoped lang="scss">
h1 {
  font-size: 1.75rem;
  width: fit-content;
  border-bottom: 2px solid #0066ff;
}

* {
  margin-bottom: 2rem;
}
</style>
