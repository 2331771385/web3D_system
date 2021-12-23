import Vue from 'vue'
import Router from 'vue-router'
import store from "../store";

Vue.use(Router)
const whiteList = [
  '/login'
];
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
    path: '/home',
    name: 'home',
    component: resolve => require(['../components/common/home.vue'], resolve),
    children: [
      {
        path: '/headIndex',
        name: "headIndex",
        component: resolve => require(['../components/views/headerIndex/headIndex.vue'], resolve),
        meta: {
          title: '首页',
          // icon:'el-icon-setting'
        }
      },
      {
        path: '/campus-manage',
        name: "campus-manage",
        component: resolve => require(['../components/views/campus/campus-manage.vue'], resolve),
        meta: {
          title: '校区数据管理',
          // icon:'el-icon-setting'
        }
      },
      {
        path: '/colleague-manage',
        name: "colleague-manage",
        component: resolve => require(['../components/views/colleague/colleague-manage.vue'], resolve),
        meta: {
          title: '学院数据管理',
          // icon:'el-icon-setting'
        }
      },
      {
        path: '/colleague-sort',
        name: "colleague-sort",
        component: resolve => require(['../components/views/colleague/colleague-sort.vue'], resolve),
        meta: {
          title: '学院类型管理',
          // icon:'el-icon-setting'
        }
      },
      {
        path: '/building-manage',
        name: "building-manage",
        component: resolve => require(['../components/views/building/building-manage.vue'], resolve),
        meta: {
          title: '建筑数据管理',
          // icon:'el-icon-setting'
        }
      }, {
        path: '/building-sort',
        name: "building-sort",
        component: resolve => require(['../components/views/building/building-sort.vue'], resolve),
        meta: {
          title: '建筑分类管理',
          // icon:'el-icon-setting'
        }
      },
      {
        path: '/public-manage',
        name: "public-manage",
        component: resolve => require(['../components/views/public/public-manage.vue'], resolve),
        meta: {
          title: '公共服务数据管理',
          // icon:'el-icon-setting'
        }
      },
      {
        path: '/public-sort',
        name: "public-sort",
        component: resolve => require(['../components/views/public/public-sort.vue'], resolve),
        meta: {
          title: '公共服务分类管理',
          // icon:'el-icon-setting'
        }
      },
      {
        path: '/path-manage',
        name: "path-manage",
        component: resolve => require(['../components/views/path/path-manage.vue'], resolve),
        meta: {
          title: '路径数据管理',
          // icon:'el-icon-setting'
        }
      },
      {
        path: '/model-manage',
        name: "model-manage",
        component: resolve => require(['../components/views/path/model-manage.vue'], resolve),
        meta: {
          title: '模型数据管理',
          // icon:'el-icon-setting'
        }
      },
      {
        path: '/video-manage',
        name: "video-manage",
        component: resolve => require(['../components/views/video/video-manage.vue'], resolve),
        meta: {
          title: '监控设备数据管理',
          // icon:'el-icon-setting'
        }
      },
      {
        path: '/role',
        name: "role",
        component: resolve => require(['../components/views/system/role.vue'], resolve),
        meta: {
          title: '角色管理',
          // icon:'el-icon-setting'
        }
      },
      {
        path: '/admin',
        name: "admin",
        component: resolve => require(['../components/views/system/admin.vue'], resolve),
        meta: {
          title: '管理员设置',
          // icon:'el-icon-setting'
        }
      }, {
        path: '/logMessage',
        name: "logMessage",
        component: resolve => require(['../components/views/system/logMessage.vue'], resolve),
        meta: {
          title: '日志管理',
          // icon:'el-icon-setting'
        }
      }, {
        path: '/loginHistory',
        name: "loginHistory",
        component: resolve => require(['../components/views/system/loginHistory.vue'], resolve),
        meta: {
          title: '登录历史',
          // icon:'el-icon-setting'
        }
      }
    ]
  }
]
// 异步路由对象
export const asyncRouter = []
const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: freeRoute
})

// 创建路由
function createRouter(permission, asyncRouter) {
  const routers = [];
  const freeRouter = [];
  let pathRouter;
  let saveValue = [];
  //根据路径匹配到的router对象添加到routers中
  permission.forEach((item) => {
    //输出后台传过来的权限列表
    if (item.children && item.children.length) {
      createRouter(item.children)
    }
    let path = item.Path;
    //循环异步路由，将符合权限的路由添加到routers中
    asyncRouter.filter((s) => {
      //为每一个父级元素创建路由
      if (s.path === '') {
        if (freeRouter.indexOf(s.meta.title) == -1) {
          freeRouter.push(s.meta.title)
          pathRouter = {
            path: s.path,
            redirect: s.redirect,
            index: s.index,
            meta: s.meta,
            children: []
          }
          saveValue.push(pathRouter)
        }
        //下面有子路由,就查找其下面的子路由
        s.children.filter((y) => {
          if (y.path === path) {
            var pathName = freeRouter.indexOf(s.meta.title)
            y.meta.permission = item.permission;
            saveValue[pathName].children.push({
              index: y.index,
              path: y.path,
              name: y.name,
              component: y.component,
              meta: y.meta
            })
            //routers.push(y);
          }
        });
      }
      if (s.path === path) {
        s.meta.permission = item.permission;
        routers.push(s)
      }
    })

  })
  for (var i = 0; i < saveValue.length; i++) {
    if (saveValue[i].children != 0) {
      routers.push(saveValue[i])
    }
  }
  return routers;
}
/*异步加载路由，根据权限加载动态路由
*其中permission是权限列表
*asyncRouter异步路由对象
*/
function routerMatch(permission, asyncRouter) {
  return new Promise((resolve) => {
    const crouters = createRouter(permission, asyncRouter);
    resolve(crouters);
  })
}
// 解决router.replace()路由重复报错的问题
const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}



// 路由守卫
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('Authorization');
  if (token) {
    next();
    // Vue.prototype.$Notice.open({
    //   title: '欢迎您!  ' + localStorage.getItem("UserName"),
    //   desc: '登录成功'
    // });
    // //如果存在token的时候
    // if (to.path === '/login') {
    //   //如果是登录页面,就直接对他放行
    //   next();
    // } else {
    //   //不是登陆页面，只是正常页面之间的跳转
    //   if (store.state.PermissionList.length == 0) {
    //     //没有获取用户的列表的时候，重新向后台发送请求，获取权限列表
    //     store.dispatch('getPermission').then(res => {
    //       routerMatch(res, asyncRouter).then(res => {
    //         var arr = [];
    //         arr.push({
    //           index: 'home',
    //           path: 'home',
    //           redirect: res[0].path,
    //           // name:'首页',
    //           component: res[0].component,
    //           meta: {
    //             title: '首页',
    //             icon: "el-icon-monitor"
    //           },
    //         })

    //         res.forEach(element => {
    //           if (element.children) {
    //             element.children.forEach(item => {
    //               arr.push(item)
    //             })
    //           } else {
    //             arr.push(element)
    //           }
    //         })
    //         //将匹配出来的权限进行addRouter,此时会将静态路径与动态路径结合起来一起显示
    //         router.addRoutes([
    //           {
    //             path: '/',
    //             component: resolve => require(['../components/common/home.vue'], resolve),
    //             children: arr
    //           }
    //         ])
    //         //将得到的路由保存在vuex中
    //         store.commit('saveRouter', res);
    //         router.options.routes = res;
    //         next(to.path);
    //       })
    //     }).catch(() => {
    //       router.replace('/login')
    //     })
    //   } else {
    //     if (to.matched.length) {
    //       //匹配到路由的路径， 直接放行
    //       next()
    //     } else {
    //       router.replace('/login')
    //     }
    //   }
    // }
  } else {
    next()
    // router.replace('/login')
    //如果在白名单里面，就直接放行
    // if (whiteList.indexOf(to.path) >= 0) {
    //   console.log('放行');
    //   next()
    // } else {
    //   console.log('拦截');
    //   //如果不在登录页里面，就返回到登录页
    //   router.replace('/login')
    // }
  }
})

export default router;
