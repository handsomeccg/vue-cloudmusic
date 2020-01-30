import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/discover'
  },
  {
    path: '/discover',
    name: 'discover',
    component: () => import('../components/discover/discover'),
    children: [
      {
        path: '/search',
        name: 'searchList',
        component: () => import('../components/discover/discover')
      }
    ]
  },
  {
    path: '/mv',
    name: 'mvList',
    component: () => import('../components/video/mvList')
  },
  {
    path: '/my',
    name: 'my',
    component: () => import('../components/my/my')
  },
  {
    path: '/songList',
    name: 'songList',
    component: () => import('../components/songList/songList'),
    children: [
    ]
  },
  {
    path: '/college',
    name: 'college',
    component: () => import('../components/college/college')
  },
  {
    path: '/songList/detail',
    name: 'songListDetail',
    component: () => import('../components/songList/songListDetail')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
