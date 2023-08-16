<template>
  <div>
    <TitleComp title="Tablou de bord" />

    <div class="responsive-grid">
      <v-card
        class="menu-card"
        color="#1f2940"
        width="275"
        height="350"
        elevation="6"
        @click="() => router.push('/nrw')"
      >
          <img src="../assets/menu-icons/nrw.png" />
          <h2>Apa fara venituri (NRW)</h2>
      </v-card>
      <v-card
              class="menu-card"
              color="#1f2940"
              width="275"
              height="350"
              elevation="6"
              @click="() => router.push('/counters')"
      >
          <img src="../assets/menu-icons/counter.png" />
          <h2>Contoare</h2>
      </v-card>
      <v-card
              class="menu-card"
              color="#1f2940"
              width="275"
              height="350"
              elevation="6"
      >
          <img src="../assets/menu-icons/water-flow.png" />
          <h2>Fluxul apei</h2>
      </v-card>
      <v-card
              class="menu-card"
              color="#1f2940"
              width="275"
              height="350"
              elevation="6"
      >
          <img src="../assets/menu-icons/cost-control.png" />
          <h2>Control al costurilor</h2>
      </v-card>
      <v-card
              class="menu-card"
              color="#1f2940"
              width="275"
              height="350"
              elevation="6"
      >
          <img src="../assets/menu-icons/billing.png" />
          <h2>Facturare</h2>
      </v-card>
      <v-card
              class="menu-card"
              color="#1f2940"
              width="275"
              height="350"
              elevation="6"
      >
          <img src="../assets/menu-icons/interventions.png" />
          <h2>Interventii</h2>
      </v-card>
      <v-card
              class="menu-card"
              color="#1f2940"
              width="275"
              height="350"
              elevation="6"
      >
          <img src="../assets/menu-icons/maps.png" />
          <h2>Harti</h2>
      </v-card>
      <v-card
              class="menu-card"
              color="#1f2940"
              width="275"
              height="350"
              elevation="6"
      >
          <img src="../assets/menu-icons/reporting.png" />
          <h2>Raportare</h2>
      </v-card>
      <v-card
              class="menu-card"
              color="#1f2940"
              width="275"
              height="350"
              elevation="6"
      >
          <img src="../assets/menu-icons/accounts.png" />
          <h2>Administrare conturi</h2>
      </v-card>
      <v-card
              class="menu-card"
              color="#1f2940"
              width="275"
              height="350"
              elevation="6"
      >
          <img src="../assets/menu-icons/waste.png" />
          <h2>Deseuri</h2>
      </v-card>
      <v-card
              class="menu-card"
              color="#1f2940"
              width="275"
              height="350"
              elevation="6"
      >
          <img src="../assets/menu-icons/sewer.png" />
          <h2>Canalizare</h2>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import TitleComp from '@/components/TitleComp.vue'
import {useRouter} from "vue-router";

const router = useRouter()

</script>

<style lang="scss" scoped>
.responsive-grid {
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  flex: 0 1 40%;
  //> * {
  //  flex: 0 1 40%;
  //}
  gap: 2rem;
}

.menu-card {
  text-align: center;
  padding: 32px 16px 0px 16px !important;
  img {
    width: 140px;
    margin-bottom: 64px;
  }
  h2 {
    font-size: 27px;
  }
  cursor: pointer;
}

@media only screen and (max-width: 1106px) {
  .responsive-grid {
    //> * {
    //  flex: 1 1 100%;
    //}
  }
}

@media only screen and (max-width: 1725px) {
  .responsive-grid {
    //> * {
    //  flex: 1 1 40%;
    //}
  }
}
</style>
