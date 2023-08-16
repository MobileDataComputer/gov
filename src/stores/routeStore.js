import { defineStore } from 'pinia'

export const useRouteStore = defineStore('routeStore', {
  state: () => ({
    routes: [{ test: 'nar' }]
  }),
  actions: {
    setRoutes(routes) {
      this.routes = routes
    }
  }
})
