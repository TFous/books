import Vue from 'vue'
import Router from 'vue-router'
import home from '../pages/home'
import chapter from '../pages/chapter'
import chapterList from '../pages/chapterList'
import classify from '../pages/classify'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/classify/:code',
      name: 'classify',
      component: classify
    },
    {
      path: '/chapterList/:code',
      name: 'chapterList',
      component: chapterList
    },
    {
      path: '/chapter/:code/:index',
      name: 'chapter',
      component: chapter
    }
  ]
})
