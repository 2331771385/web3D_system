<template>
    <!-- 菜单栏 -->
    <div class="sidebar" id="sideBar">
        <div class="logo">
            <img src="../../../static/img/logo.png"/>
            <h1 class="logo_text">数字孪生管理系统</h1>
        </div>
        <div class="menuSide">
            <div class="menuSide_wrap">
                <div class="el-scroll">
                    <!-- 菜单 -->
                    <el-menu
                        class="sidebar-el-menu"
                        :default-active="onRoutes"
                        :collapse="collapse"
                        background-color="#304156"
                        text-color="#FFFFFF"
                        active-text-color="#CCFF66"
                        unique-opened
                        router
                        :collapse-transition="false"
                        @select="handleSelect"
                    >
                        <template v-for="item in menuList"> 
                            <template v-if="item.children">
                                <el-submenu :index="item.index" :key="item.index">
                                    <template slot="title">
                                        <i :class="item.icon"></i>
                                        <span class="firstMenu" >{{ item.title }}</span>
                                    </template>
                                    <!-- 是否有三级目录 -->
                                    <template v-for="subItem in item.children">
                                        <el-submenu v-if="subItem.children" :index="subItem.index" :key="subItem.index">
                                            <span class="subMenu" slot="title">{{ subItem.title }}</span>
                                            <el-menu-item
                                                v-for="(threeItem,i) in subItem.children"
                                                :key="i"
                                                :index="threeItem.index"
                                                >
                                            <span class="threeMenu">{{ threeItem.title }}</span>
                                            </el-menu-item>
                                        </el-submenu>
                                        <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
                                    </template>
                                </el-submenu>
                            </template>
                            <template v-else>
                                <el-menu-item :index="item.index" :key="item.index">
                                    <i :class="item.icon"></i>
                                    <span class="firstMenu" slot="title" >{{ item.title }}</span>
                                </el-menu-item>
                            </template>
                        </template>
                    </el-menu>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import vueEvent from './vueEvent.js'
export default {
    name:'sider',
    data() {
        return {
           show:true,
           collapse: false,
           indexBreadcrumbs:[],//用于存放面包屑
           menuList:[
                {
                    icon: 'el-icon-news',
                    // index: 'home',
                    title: '首页'
                },
                {
                    icon: 'el-icon-news',
                    index: 'building',
                    title: '建筑数据',
                    children:[
                        {
                            index:'building-manage',
                            title:'建筑数据管理'
                        },{
                            index:'building-sort',
                            title:'建筑分类管理'
                        }
                    ]
                },
                
                {
                    icon: 'el-icon-news',
                    index: 'public',
                    title: '公共服务数据',
                    children:[
                        {
                            index:'public-manage',
                            title:'公共服务数据管理'
                        }
                    ]
                },
                {
                    icon: 'el-icon-news',
                    index: 'path',
                    title: '路径数据',
                    children:[
                        {
                            index:'path-manage',
                            title:'路径数据管理'
                        }
                    ]
                },
                {
                    icon: 'el-icon-news',
                    index: 'video',
                    title: '监控设备数据',
                    children:[
                        {
                            index:'video-manage',
                            title:'监控设备数据管理'
                        }
                    ]
                },
                {
                    icon:'el-icon-setting',
                    index:'system',
                    title:'系统设置',
                    children:[
                        {
                            index:'role',
                            title:'角色管理',
                        },{
                            index:'admin',
                            title:'管理员设置'
                        }
                    ]
                }
           ],

        }
    },
    created() {
        this.handChange();
    },
    mounted() {
        /**
         * 接受传过来的值
         */
        vueEvent.$on('to-changeWidth',showIcon=>{
            this.changeIcon(showIcon)
        })
    },
    watch: {
        collapse:{
            handler:function(newVal,oldVal){
                this.collapse=newVal;
            },
            deep:true
        },
        $route(to,from){
            this.handChange();
        }
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace("/", "");
        },
        
    },
    methods: {
        changeIcon(icon){
            this.collapse=icon?false:true;
            var sideBar=document.getElementById('sideBar');
            sideBar.style.width=(this.collapse?60:250)+'px'
        },

        /**
         * 非兄弟组件间的数据传递
         */
        handChange(){
            vueEvent.$emit('getBread',this.menuList,this.indexBreadcrumbs);
        },
        handleSelect(index,item){
            this.indexBreadcrumbs=item;
        },
        
    },
}
</script>
<style scoped>
.sidebar{
    display: block;
    position: absolute;
    background: #304156;
    left: 0;
    top: 0;
    bottom:0;
    overflow-y: scroll;
    width: 250px;
    height: 100%;
  }
  .sidebar::-webkit-scrollbar{
    width: 0;
  }
  .logo{
      height: 60px;
      line-height: 60px;
      overflow: hidden;
      width: 100%;
      background: #2b2f3a;
      position: relative;
  }
  .logo_text{
      display: inline-block;
      color: whitesmoke;
      font-size: 16px;
      text-align: center;
      height: 50px;
      line-height: 50px;
      vertical-align: center;
      margin-top: 5px;
  }
  .menuSide{
      position: relative;
      overflow: hidden;
      height: calc(100% - 60px);
  }
  .menuSide_wrap{
     height: 100%;   
  }
  .sidebar-el-menu {
    text-align: left;
    /* font-weight: bold; */
  }
  .sidebar-el-menu:not(.el-menu--collapse){
    width: 100%;
  }
  .sidebar > ul {
    height:100%;
  }
  .sidebar > ul > li{
      margin-top: 5px;
  }
  .el-submenu__title i {
    color: white;
  }
  .firstMenu{
      font-size: 18px;
      color: whitesmoke;
      margin-left: 5px;
  }
  .logo img{
      height: 30px;
      width: 80px;
      line-height: 30px;
      /* margin-top: 15px; */
  }
</style>