import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const freeRoute=[
  {
    path: '/',
    name: 'home',
    component: resolve => require(['../components/common/home.vue'], resolve),
    children:[
      {
        path:'/headIndex',
        name:"headIndex",
        component:resolve => require(['../components/views/headerIndex/headIndex.vue'], resolve),
        meta: {
          title: '首页',
          // icon:'el-icon-setting'
        }
      },
      {
        path:'/role',
        name:"role",
        component:resolve => require(['../components/views/system/role.vue'], resolve),
        meta: {
          title: '角色管理',
          // icon:'el-icon-setting'
        }
      },
      {
        path:'/admin',
        name:"admin",
        component:resolve => require(['../components/views/system/admin.vue'], resolve),
        meta: {
          title: '管理员设置',
          // icon:'el-icon-setting'
        }
      },
    ]
  }
];

const router=new Router({
  mode:'hash',
  base: process.env.BASE_URL,
  routes:freeRoute
})

export default router;
