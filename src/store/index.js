import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        UrlIP: "http://202.194.14.204:8082",//接口地址前缀

        Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',  // 存储token
        UserName: localStorage.getItem('UserName') ? localStorage.getItem('UserName') : '',                      // 用户名
        PassWord: localStorage.getItem('PassWord') ? localStorage.getItem('PassWord') : '',
        UserID: localStorage.getItem('roleID') ? localStorage.getItem('roleID') : null,
        PermissionList: [],
        btnPermissionList: [],  //所有按钮权限的列表
    },
    mutations: {
        changeLogin(state, user) {
            if (user.Authorization) {
                state.Authorization = user.Authorization;
                // 放在缓存中是为了防止页面刷新vuex中的值消失
                localStorage.setItem('Authorization', user.Authorization);
            }
            if (user.UserID) {
                state.UserID = user.UserID;
                //将登陆的用户id存储在sessionStorage中，方便在动态菜单中使用
                localStorage.setItem('roleID', user.UserID)
            }
            if (user.UserName) {
                state.UserName = user.UserName;
                localStorage.setItem('UserName', user.UserName);
            }
            if (user.PassWord) {
                state.PassWord = user.PassWord;
                localStorage.setItem('PassWord', user.PassWord);
            }
        },
        setList(state, data) {
            state.PermissionList = data;
        },
        saveRouter(state, data) {
            state.PermissionList = data;
        },
        setBtnList(state, data) {
            state.btnPermissionList = data;
        },
    },
    actions: {
        //请求后台接口，拿到用户的权限
        //调用权限接口，获取该用户的权限列表
        getPermission({ commit }) {
            return new Promise((resolve, reject) => {
                var roleID = localStorage.getItem('roleID');
                axios({
                    url: '',//获取权限接口
                    method: 'get',
                    params: {
                        roleID: roleID
                    },
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    data: []
                }).then(res => {
                    //存储权限列表
                    var auth = res.data.data;
                    var btnList = [];//存放菜单中的按钮
                    var arr = [];//存放动态菜单的部分
                    //遍历权限列表中的对象属性
                    for (let key in auth) {
                        if (arr.indexOf(auth[key]) == -1) {
                            arr.push(auth[key])
                        }
                        for (let keyName in auth[key]) {
                            for (var i = 0; i < auth[key][keyName].length; i++) {
                                if (auth[key][keyName][i].URI) {
                                    var len = auth[key][keyName][i].URI.split(';').length;
                                    if (len > 1) {
                                        for (var k = 0; k < len; k++) {
                                            btnList.push(auth[key][keyName][i].URI.split(';')[k])
                                        }
                                    } else {
                                        btnList.push(auth[key][keyName][i].URI)
                                    }
                                }
                            }
                        }
                    }
                    // commit('setBtnList', btnList);
                    commit('setList', arr);
                    resolve(arr);
                }).catch(() => {
                    reject()
                })
            })
        }
    }

})
export default store