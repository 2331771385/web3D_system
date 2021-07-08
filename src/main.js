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

import cookies from 'vue-cookies'
import '../src/assets/common/css/common.css'
import md5 from 'js-md5'

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


Vue.prototype.$md5 = md5;

//添加全局拦截器
// axios.defaults.timeout = 60000;
// axios.defaults.baseURL = 'http://211.87.231.41:8091/';
// axios.interceptors.request.use(function (config) {
//   //存在token
//   if (window.localStorage.getItem('Authorization')) {
//     config.params['token'] = window.localStorage.getItem('Authorization')
//   }
//   return config;
// },
//   function (error) {
//     return Promise.reject(error)
//   })


// axios.interceptors.response.use(function (response) {
//   let time = new Date().getTime()
//   let outTime = axios.defaults.timeout;
//   let lengthTime = time - outTime;
//   return response;
// },
//   function (error) {
//     if (error.response.status == 101) {
//       // 101 说明 token 验证失败
//       // 可以直接跳转到登录页面，重新登录获取 token
//       window.location.href = '/login'
//       window.location.reload()

//     } else if (error.response.status == 500) {
//       // 服务器错误
//       // do something
//       return Promise.reject(error.response.data)
//     }
//     return Promise.reject(error.response.data)

//   })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
