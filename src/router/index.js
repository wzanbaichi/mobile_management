import Vue from 'vue'
import Router from 'vue-router'
import AdviceList from '@/pages/advice-list'
import AdviceInfo from '@/pages/advice-info'
import AdviceSuccess from '@/pages/advice-success'
import AdviceContent from '@/pages/advice-content'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'AdviceInfo',
    //   component: AdviceInfo
    // },
    {
      path: '/',
      name: 'AdviceContent',
      component: AdviceContent
    },
    {
      path: '/AdviceList',
      name: 'AdviceList',
      component: AdviceList
    },
    {
      path: '/AdviceSuccess',
      name: 'AdviceSuccess',
      component: AdviceSuccess
    }
  ]
})
