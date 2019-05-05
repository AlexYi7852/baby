// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { post } from './api'
import './utils/setFontSize'
import mixin from './mixins'
import router from './router'

import {
  Popup,
  Swipe,
  NavBar,
  Loading,
  SwipeItem
} from 'vant'

Vue.use(Popup)
Vue.use(NavBar)
Vue.use(Loading)
Vue.use(Swipe).use(SwipeItem)

Vue.mixin(mixin)
// 手机上打印log
import Vconsole from 'vconsole'
let vConsole = new Vconsole()
export default vConsole

window.Promise = require('promise')
Vue.prototype.$post = post
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
