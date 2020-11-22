<template>
    <div :class=" sfShow ? 'el-header-fixed':'el-header'" id='el-header'>
        <div class="el-left">
            <div class='el-icon'>
                <template>
                    <font v-if="showIcon">
                        <el-button
                            style="font-size:20px"
                            icon='el-icon-s-fold'
                            @click="changeWidth"
                        >
                        </el-button>
                    </font>
                    <font v-else>
                        <el-button
                            style="font-size:20px"
                            icon='el-icon-s-unfold'
                            @click="changeWidth"
                        >
                        </el-button>
                    </font>
                </template>
                
            </div>

            <div class='breadcrumb'>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item class="breadcrumb-text" :to="{ path: '/' }">首页</el-breadcrumb-item> 
                    <el-breadcrumb-item class="breadcrumb-text"
                        v-for="(item,index)  in levelList"
                        :key="index"
                        >
                        {{item.title}}
                        <!-- <router-link :to="item.redirect||item.index">{{item.title}}</router-link> -->
                    </el-breadcrumb-item>
               </el-breadcrumb>
            </div>
            
            
        </div>
        <div class="el-right">
            <div class="el-right-icon">
                <!-- 搜索按钮 -->
                <el-button 
                    icon="el-icon-search"
                    @click="searchVal"
                    class="btn"
                >
                </el-button>

                <!-- 点击搜索按钮，出现输入框 -->
                

                <!-- 全屏 -->
                <template>
                    <el-button 
                        v-if="!fullScreenShow"
                        @click="fullScreen" 
                    >
                        <i class="fa fa-expand" aria-hidden="true"></i>
                    </el-button>
                    
                    <!-- 退出全屏 -->
                    <el-button v-else @click="fullScreen" >
                        <i class="fa fa-compress" aria-hidden="true"></i>
                    </el-button>
                
                </template>
                
                <!-- 当前页面刷新 -->
                <el-button>
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </el-button>
                
                <!-- https://zz.bdstatic.com/linksubmit/push.js -->
                <!-- 中英文切换 -->
            </div>
            <div class="el-right-drop">
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                        {{recentLoginName}}
                        <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="getMsg">
                            <i class="el-icon-edit"><a >&nbsp;&nbsp;修改信息</a></i>
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="getPassWord">
                            <i class="el-icon-message">
                                <a >&nbsp;&nbsp;修改密码</a>
                            </i>
                        </el-dropdown-item>

                        <el-dropdown-item @click.native="loginOut">
                            <i class="el-icon-switch-button" > &nbsp;退&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;出</i>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            
        </div>
    </div>
</template>
<script>
import vueEvent from './vueEvent.js';
import "font-awesome/css/font-awesome.min.css"
export default {
   name:'header',
   data() {
       return {
           flag:false,
           fullscreen:false,
          fullScreenShow:false,
          sfShow:false,
          recentLoginName:'admin',
          showIcon:true,
          indexBreadcrumbs:[],//用于接受面包屑的列表
          levelList:[],//获取到的菜单对象
       }
   }, 
   created() {
   },
   watch: {
       showIcon:function(newVal,oldVal){
           this.showIcon=newVal;
       },
   },
   mounted() {
       vueEvent.$on('getBread',(value1,value2)=>{
           this.breadcrumbList(value1,value2);
       })
       
   },
   methods: {
       getMsg(){},
       getPassWord(){},
       loginOut(){},
       changeWidth(){
           this.showIcon=!this.showIcon;
           this.sfShow=!this.sfShow;
           vueEvent.$emit('to-changeWidth',this.showIcon);
           vueEvent.$emit('to-changeSider',this.sfShow);

       },

       /**
        * 获取面包屑,点击左侧菜单栏的数据，进行非父子组件的数据传递
        */
       breadcrumbList (menuList,indexBreadcrumbs) {
            let breadcrumbs = []
            indexBreadcrumbs.map(item => {
                for (let i = 0; i < menuList.length; i++) {
                    if (item === menuList[i].index) {
                        breadcrumbs.push(menuList[i])
                        if (menuList[i].children) {
                            menuList = menuList[i].children
                        }
                        break;
                    }
                }
            })
            this.levelList=breadcrumbs;
        },

        searchVal(){

        },
        
        //全屏操作
        fullScreen(){
            this.fullScreenShow=!this.fullScreenShow;
            let element = document.documentElement; //放大的元素,直接作用于id=all-show上，如果整个系统都需要放大，直接赋值document.documentElement。
            if (this.fullscreen) {
                //退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                //进入全屏
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
   },
   beforeDestroy() {
      
   },
}
</script>
<style scoped>
.el-header-fixed{
    top: 0;
    left: 60px;
    width: calc(100% - 60px);
    height: 60px;
    
    overflow: hidden;
    position: relative;
    background: #fff;
    -webkit-box-shadow: 0 1px 4px rgba(0,21,41,.08);
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.el-header{
    top: 0;
    left: 250px;
    width: calc(100% - 250px);
    height: 60px;
    
    overflow: hidden;
    position: relative;
    background: #fff;
    -webkit-box-shadow: 0 1px 4px rgba(0,21,41,.08);
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.el-left{
    height: 100%;
    width: 70%;
    float: left;
}
.el-right{
    height: 100%;
    width: 30%;
    float: right;
}
.el-right-drop{
    
    width: 20%;
    height: 50px;
    margin-top: 5px;
    float: left;
}
.el-right-icon{
    float: left;
    width: 80%;
    height: 50px;
    margin-top: 5px;
}
.el-icon{
    height: 60px;
    width: 60px ;
    float: left;
}
.el-dropdown-link {
    display: block;
    margin-top: 5px;
    font-size: 20px;
    
}
.btn{
    margin-left: 50%;
}
.el-dropdown-menu{
      margin-top: 15px;
      float: left;
}
.el-dropdown{
    margin-top: 5px;
    margin-right: 5px;
}
.breadcrumb{
    float: left;
    margin-top: 15px;
    margin-left: 40px;
    height: 50px;
    line-height: 50px;
}
.breadcrumb-text{
    font-size: 18px;
}
.el-button{
    border: 1px solid #fff;
}
.el-button+.el-button {
    margin-left: 0 !important;
}
</style>