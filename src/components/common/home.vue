<template>
    <div class="wrapper">
        <div class='sideBar'>
            <v-sidebar></v-sidebar>
        </div>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-header></v-header>
            <v-tag></v-tag>
            <div :class=" contentShow ? 'contentFixed': 'content'">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view :key="$route.fullPath"></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>
<script>
import vSidebar from './sider.vue';
import vHeader from './header.vue';
import vTag from './tags.vue';
import bus from './bus';
import vueEvent from './vueEvent.js'
export default {
    name:'home',
    components:{
        vSidebar,
        vHeader,
        vTag
    },
    data() {
        return {
            contentShow:false,
            collapse:false,
            tagsList:[],
        }
    },
    watch: {
        contentShow:function(newVal,oldVal){
            this.contentShow=newVal;
        }
    },
    created() {
        //非父子组件的传值
       bus.$on('collapse', msg => {
                this.collapse = msg;
        })

        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {     
            let arr = [];
            for(let i = 0, len = msg.length; i < len; i ++){
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        }) 
    },
    mounted() {
        vueEvent.$on('to-changeSider',value=>{
            this.changeWidth(value);
        })
    },
    methods: {
        changeWidth(widthDiv){
            this.contentShow=widthDiv
        }
    },
    beforeDestroy() {
        
    },
}
</script>
<style scoped>
.wrapper{
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    width: 100%;
}
.sideBar{
    height: 100%;
    width: 250px;
}
.content-box{
  left: 250px;
  /* width: calc(100%-250px); */
  height: 820px;
  -webkit-transition: left .3s ease-in-out;
  transition: left .3s ease-in-out;
  background: #f0f0f0;
}
.contentFixed{
    margin-left: 60px;
    /* margin-top: 5px; */
    height: 700px;
    
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    -webkit-box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
}
.content{
    margin-left: 250px;
    /* margin-top: 5px; */
    height: 700px;
    
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    -webkit-box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
}
</style>