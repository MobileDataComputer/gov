<template>
  <div class="userContainer" @click="toggleMenu">
    <div class="user-icon-container">
      <v-avatar color="#5C6BC0" size="60" class="avatar">
        <img v-if="userData.imageUrl" :src="userData.imageUrl" alt="" />
        <v-icon v-else>mdi-account-circle</v-icon>
      </v-avatar>
      <div class="user-icon-inner">
        <h2>{{ userData.firstname }} {{ userData.lastname }}</h2>
        <h4>{{ userData.role }}</h4>
      </div>
      <div class="icon-container">
        <v-icon icon="mdi-triangle-down" class="arrow"></v-icon>
      </div>
    </div>
  </div>
  <div class="dropdown-menu" v-if="menuOpen">
    <a href="/">Contul meu</a>
    <a href="/" @click="logout()">Deconectare</a>
  </div>
  <v-divider color="#000000" thickness="2"></v-divider>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  firstname: String,
  lastname: String,
  role: String
})

const userData = ref({
  firstname: props.firstname || 'Nume',
  lastname: props.lastname || 'Prenume',
  role: props.role || 'Functie'
})

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  //todo Don't forget about animations and turning the arrow
}

const logout = () => {
  localStorage.removeItem('JWT')
  localStorage.removeItem('routes')
  localStorage.removeItem('state')
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Rubik:wght@400;500&display=swap');

* {
  font-family: 'Rubik', sans-serif;
  font-weight: 100;
}
.v-avatar {
  z-index: 100;
}

.userContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 6.5rem;
}

.dropdown-menu {
  background-color: #141b2d;
  padding: 1rem 0;
  a {
    text-decoration: none;
    color: white;
    //margin: 1rem 1.5rem;
    padding: 0.5rem 1.5rem;
    font-size: 1.02rem;
    display: block;
  }
}

a:hover {
  background-color: #1f2940;
}

.userContainer:hover {
  cursor: pointer;
  background-color: #141b2d;
}

.user-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;

  h2 {
    font-size: 1.1rem;
  }

  h4 {
    color: rgba(255, 255, 255, 0.61);
  }
}

.arrow {
  font-size: 1rem;
  margin-top: -1.5rem;
}
</style>
