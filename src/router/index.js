import Vue from 'vue'
import Router from 'vue-router'
import AdviceList from '@/pages/advice-list'
import AdviceInfo from '@/pages/advice-info'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AdviceInfo',
      component: AdviceInfo
    },
    {
      path: '/AdviceList',
      name: 'AdviceList',
      component: AdviceList
    }
  ]
})
