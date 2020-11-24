// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from "axios"
import Vuex from "vuex"
import store from "./store/index"
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import md5 from 'js-md5'
import cookies from 'vue-cookies'
import '../src/assets/common/css/common.css'

Vue.use(cookies)
Vue.prototype.$md5 = md5
Vue.config.productionTip = false

Vue.use(Vuex);
Vue.use(Element);
Vue.use(iView);

Vue.prototype.$axios = axios;

// 使用view组件
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
Vue.use(ViewUI)

// import axios from 'axios'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
