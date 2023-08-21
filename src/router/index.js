import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Signin from '../views/SigninView.vue'
import jwtDecode from 'jwt-decode'
import UserManagementView from '@/views/UserManagementView.vue'

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
      path: '/users',
      name: 'users',
      component: UserManagementView,
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
