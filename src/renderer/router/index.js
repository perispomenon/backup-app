import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/create-task',
      name: 'create-task',
      component: require('@/components/CreateTask').default
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/components/Settings').default
    },
    {
      path: '/restore',
      name: 'restore',
      component: require('@/components/Restore').default
    },
    {
      path: '/point-backup',
      name: 'point-backup',
      component: require('@/components/PointBackup').default
    }
  ]
})
