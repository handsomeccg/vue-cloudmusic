import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import Vant from 'vant'
import 'vant/lib/index.css'
import VueLazyLoad from 'vue-lazyload'

fastclick.attach(document.body)
Vue.config.productionTip = false
// at.alicdn.com/t/font_1622152_lre1i7ky7o.js
Vue.use(Vant)
Vue.use(VueLazyLoad)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
