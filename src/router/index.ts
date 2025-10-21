import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/layouts/default.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        redirect: { name: 'task' }
      },
      {
        path: 'task',
        name: 'task',
        component: () => import('@/pages/TaskPage.vue')
      },
      {
        path: 'map/:markerId?',
        name: 'map',
        component: () => import('@/pages/MapPage.vue')
      }
    ]
  }
]

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})
