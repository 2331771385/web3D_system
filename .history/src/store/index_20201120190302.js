import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        UrlIP: "http://211.87.231.41:8089",//接口地址前缀
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
            if (user.UserDataRange) {
                state.UserDataRange = user.UserDataRange;
                localStorage.setItem('UserDataRange', user.UserDataRange);
            }
        },
    }

})
export default store