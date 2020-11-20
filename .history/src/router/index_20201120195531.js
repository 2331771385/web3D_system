import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const freeRoute = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    // component: resolve => require(['../components/views/account/login.vue'], resolve)
    component: () => import("../components/views/account/login.vue")
  },
  {
    path: '/',
    name: 'home',
    component: resolve => require(['../components/common/home.vue'], resolve),
    children: [
      {
        path: 'headIndex',
        name: "headIndex",
        components: resolve => require(['../components/views/headerIndex/headIndex.vue'], resolve),
        meta: {
          title: '首页',
          // icon:'el-icon-setting'
        }
      },
      {
        path: 'role',
        name: "role",
        components: resolve => require(['../components/views/system/role.vue'], resolve),
        meta: {
          title: '角色管理',
          // icon:'el-icon-setting'
        }
      },
    ]
  }
];
// 解决router.replace()路由重复报错的问题
const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}
const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: freeRoute
})

export default router;
