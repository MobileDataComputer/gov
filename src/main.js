import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import vuetify from './plugins/vueitfy'
import Highcharts from 'highcharts'
import HighChartsVue from 'highcharts-vue'
import boost from "highcharts/modules/boost";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(HighChartsVue)
boost(Highcharts)
app.mount('#app')
