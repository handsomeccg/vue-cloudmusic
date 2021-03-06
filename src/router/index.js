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
    meta: { keepAlive: true },
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
    meta: { keepAlive: true },
    component: () => import('../components/video/mvList')
  },
  {
    path: '/rank',
    name: 'rank',
    redirect: '/rank/list',
    component: () => import('../components/rank/rank'),
    children: [
      {
        path: '/rank/list',
        name: 'rankList',
        meta: { keepAlive: true },
        component: () => import('../components/rank/rankList')
      },
      {
        path: '/rank/detail',
        name: 'rankDetail',
        component: () => import('../components/rank/rankDetail')
      }
    ]
  },
  {
    path: '/songList',
    name: 'songList',
    meta: { keepAlive: true },
    component: () => import('../components/songList/songList'),
    children: [
    ]
  },
  {
    path: '/college',
    name: 'college',
    meta: { keepAlive: true },
    component: () => import('../components/college/college')
  },
  {
    path: '/list/detail',
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
