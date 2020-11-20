import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        UrlIP: "http://211.87.231.41:8089",//接口地址前缀
        
    }

})
export default store