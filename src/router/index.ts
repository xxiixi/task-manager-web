import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/star-drawer',
      name: 'star-drawer',
      component: () => import('../views/StarDrawer.vue'),
    },
    {
      path: '/point-cloud',
      name: 'point-cloud',
      component: () => import('../views/PointCloud.vue'),
    },
  ],
})

export default router
