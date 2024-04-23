import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Manage from '@/views/Manage.vue'
import Song from '@/views/Song.vue'
import Error from '@/views/Error.vue'
import useUserStore from '@/stores/user'

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'manage',
    path: '/manage-music',
    component: Manage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/manage',
    redirect: { name: 'manage' }
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song
  },
  {
    name: '404',
    path: '/404',
    component: Error
  },
  {
    path: '/:catch(.*)*',
    redirect: { name: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

// 全局守卫，检测用户是否登录
router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const store = useUserStore()

  if (store.userLoggedIn) {
    next()
  } else {
    next({ name: 'home' })
  }
})

export default router
