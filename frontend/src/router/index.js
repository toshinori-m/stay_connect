import { createRouter, createWebHistory } from 'vue-router'
import Open from '../views/OpenPage'

const routes = [
  {
    path: '/',
    name: 'OpenPage',
    component: Open
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
