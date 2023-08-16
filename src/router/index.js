import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Signin from '../views/SigninView.vue'
import jwtDecode from 'jwt-decode'
import MapView from '@/views/MapView.vue'
import PumpStatusView from '@/views/PumpStatusView.vue'
import UserManagementView from '@/views/UserManagementView.vue'
import InterventionsView from '@/views/InterventionsView.vue'
import RezervoareView from '@/views/RezervoareView.vue'
import NrwView from "@/views/NrwView.vue"
import CountersView from "@/views/CountersView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/pump-status',
      name: 'pump-status',
      component: PumpStatusView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/interventions',
      name: 'interventions',
      component: InterventionsView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/users',
      name: 'users',
      component: UserManagementView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/rezervoare',
      name: 'rezervoare',
      component: RezervoareView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/nrw',
      name: 'nrw',
      component: NrwView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/counters',
      name: 'counters',
      component: CountersView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signin',
      component: Signin,
      meta: {
        onlyIfNotLoggedIn: true
      }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const jwt = localStorage.getItem('JWT')
    if (jwt) {
      const decoded = jwtDecode(jwt)
      const { exp } = jwtDecode(jwt)
      if (Date.now() < exp * 1000) {
        // Token is valid, allow navigation
        next()
      } else {
        // Token has expired, redirect to login or handle accordingly
        // For example:
        // next('/login');
        // Or you can clear the token and redirect:
        localStorage.removeItem('JWT')
        next('/signin')
      }
    } else {
      // No token found, redirect to login or handle accordingly
      next('/signin')
    }
  } else if (to.matched.some((record) => record.meta.onlyIfNotLoggedIn)) {
    const jwt = localStorage.getItem('JWT')
    if (jwt) {
      // User is already signed in, redirect to home or handle accordingly
      next('/')
    } else {
      // User is not signed in, allow navigation
      next()
    }
  } else {
    // Route doesn't require authentication, allow navigation
    next()
  }
})

export default router
