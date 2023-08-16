<template>
    <div>
        <TitleComp title="Apa fara venituri" />
        <div id="top-container">
            <v-card
              class="info-card"
              elevation="6"
              color="#1f2940"
            >
                <h3>Totalul volumului de apa furnizat in sistem: <span>33 ㎥</span></h3>
            </v-card>
            <v-card
              class="info-card"
              elevation="6"
              color="#1f2940"
            >
                <h3>Totalul  volumului de apa furnizat in sistem pe dma-uri: <span>33 ㎥</span></h3>
            </v-card>
            <v-card
              class="info-card"
              elevation="6"
              color="#1f2940"
            >
                <h3>Total inregistrat: <span>33 ㎥</span></h3>
            </v-card>
            <v-card
              class="info-card"
              elevation="6"
              color="#1f2940"
            >
                <h3>Total inregistrat pe dma-uri: <span>33 ㎥</span></h3>
            </v-card>
        </div>
        <div id="alert-container">
            <v-alert
              color="#0066ff"
              theme="dark"
              icon="mdi-information-outline"
              border
              variant="outlined"
              class="info-alert"
            >
                In perioada 10.08.2023 - 14.08.2023 au fost inregistrate pierderi de 21.5 ㎥
            </v-alert>
            <v-alert
              color="#0066ff"
              theme="dark"
              icon="mdi-information-outline"
              border
              variant="outlined"
              class="info-alert"
            >
                In perioada 10.08.2023 - 14.08.2023 au fost inregistrate posibile furturi de 21.5 ㎥
            </v-alert>
            <v-alert
              theme="dark"
              border
              variant="outlined"
              class="info-alert"
              type="warning"
            >
                Atentie - In perioada 10.08.2023 - 14.08.2023 a fost inregistrat un volum de apa fara venituri de: 21.5 ㎥
            </v-alert>
        </div>
        <div id="chart-container">
            <WaterVolumeWidget />
            <WaterVolumeWidget />
        </div>
    </div>
</template>

<script setup>
import TitleComp from '@/components/TitleComp.vue'
import WaterVolumeWidget from "@/components/widgets/WaterVolumeWidget.vue";
</script>

<style lang="scss" scoped>
#top-container {
    display: flex;
    gap: 3rem;
    flex-wrap: wrap;
    //justify-content: space-between;
    margin-bottom: 3rem;
}

#alert-container {
    display: flex;
    gap: 3rem;
    flex-wrap: wrap;
    margin-bottom: 3rem;
}

#chart-container {
    display: flex;
    flex-wrap: wrap;
    gap: 3rem;
    //justify-content: space-between;
}

.info-card {
    flex: 0 1 550px;
    padding: 16px;
    span {
        color: #0066ff;
        margin-left: 5px;
    }
}

.info-alert {
    flex: 0 1 550px;
    min-width: 550px;
}
</style>
