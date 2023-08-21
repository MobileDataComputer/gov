import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components_ from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import * as labs from 'vuetify/labs/components'

export default function install(Vue) {
  const CustomThemeDark = {
    dark: true,
    colors: {}
  }
  const vuetify = createVuetify({
    components: {
      ...labs,
      ...components_
    },
    directives,
    icons: {
      iconfont: 'mdi'
    },
    theme: {
      defaultTheme: 'CustomThemeDark',
      themes: {
        CustomThemeDark
      }
    }
  })

  Vue.use(vuetify)
}
