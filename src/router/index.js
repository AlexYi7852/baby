import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: r => require(['@/views/homePage'], r)
    },
    {
      path: '/share',
      name: 'share',
      component: r => require(['@/views/share'], r)
    },
    {
      path: '/myGarden',
      name: 'myGarden',
      component: r => require(['@/views/myGarden'], r)
    },
    {
      path: '/echars-demo',
      name: 'echarsDemo',
      component: r => require(['@/views/download/echars'], r)
    },
    {
      path: '/download',
      name: 'download',
      component: r => require(['@/views/download'], r)
    },
    {
      path: '/invatation',
      name: 'invatation',
      component: r => require(['@/views/invatation'], r)
    },
    {
      path: '/beInvited',
      name: 'beInvited',
      component: r => require(['@/views/invatation/beInvited'], r)
    }
  ]
})
