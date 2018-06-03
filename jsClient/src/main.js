// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);
import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

Vue.config.productionTip = false

let api = localStorage.getItem('api')
let imgUrl = localStorage.getItem('imgUrl')

let classifys = [
  {name:'玄幻魔法',code:0},
  {name:'武侠修真',code:1},
  {name:'都市言情',code:2},
  {name:'历史军事',code:3},
  {name:'侦探推理',code:4},
  {name:'游戏竞技',code:5},
  {name:'科幻小说',code:6},
  {name:'恐怖灵异',code:7}
]

Vue.prototype.$api={
  imgUrl,
  api,
  classifys
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
