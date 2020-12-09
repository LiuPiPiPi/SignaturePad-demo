import Vue from 'vue'
import Router from 'vue-router'
// import SignaturePad from '@/components/SignaturePad'
import Keke from '@/components/SignaturePad'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Keke',
      component: Keke
    }
  ]
})
