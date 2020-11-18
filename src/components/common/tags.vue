<template>
    <div :class="tagShow ? 'tagsFixed' : 'tags'" v-if="showTag">
        <ul>
            <li
                class="tags-li"
                v-for="(item,index) in tagsList"
                :key='index'
                :class="{'active': isActive(item.path)}"
            >
                <router-link :to="item.path" class="tags-li-title">{{item.title}}</router-link>
                <span class="tags-li-icon" @click="closeTag(index)">
                    <i class="el-icon-close"></i>
                </span>
            </li>
        </ul>
    </div>
</template>
<script>
import bus from './bus'
import vueEvent from './vueEvent.js'
export default {
   name:'tags',
   data() {
       return {
            tagShow:false,
            fullscreen: false,
            tagsList: [], //声明一个空的数组，存放路由的路径  
       }
   }, 
   created() {
       this.setTags(this.$route);
   },
   watch: {
    $route(newValue, oldValue) {
      this.setTags(newValue);
    },
    tagShow:function (newVal,oldVal) {
        this.tagShow=newVal;
    }
  },
  mounted() {
      vueEvent.$on('to-changeSider',value=>{
          this.changeWidth(value);
      })
  },
   computed: {
       showTag(){
           return this.tagsList.length > 0
       },

   },
   methods: {
       isActive(path){
           return path===this.$route.fullPath;
       },
       closeTag (index){
           const delItem=this.tagsList.splice(index,1)[0];
           const item=this.tagsList[index]?
                        this.tagsList[index]:
                        this.tagsList[index-1];
           if (item) {
               delItem.path===this.$route.fullPath && this.$router.push(item.path);
           }else{
               this.$router.push('/')
           }
       } ,
       setTags(route){
           const isExist=this.tagsList.some(item=>{
               return item.path===route.fullPath;
           });
            /**
             * 不存在这个标签，就需要在列表中展示出来
             */
           if (!isExist) {
               if (this.tagsList.length>=8) {
                   this.tagsList.shift();//每个列表只能展示7个标签
               }
               //将标签存放在数组中
               this.tagsList.push({
                   title:route.meta.title,
                   path:route.fullPath,
                   name:route.name
               });   
           }
           bus.$emit('tags',this.tagsList);
       },
       handleTags(command){
           command==='other'?this.closeOther():this.closeAll();
       }, 
       
       /**
        * 关闭其他标签
        */
       closeOther(){
           const curItem = this.tagsList.filter((item) => {
                return item.path === this.$route.fullPath;
           });
           this.tagsList = curItem;
       },

        changeWidth(tagsShow){
            this.tagShow=tagsShow;
        },

       closeAll(){
           this.tagsList=[];
           this.$router.push('/');
       
       
       },
   },
}
</script>
<style scoped>
.tagsFixed {
  margin-top: 5px;
  position: relative;
  width: calc(100% - 60px);
  height: 40px;
  left: 60px;
  overflow: hidden;

  background: #fff;
  border-bottom: 1px solid #d8dce5;
  -webkit-box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
}
.tags {
  margin-top: 5px;
  position: relative;
  width: calc(100% - 250px);
  height: 40px;
  left: 250px;
  overflow: hidden;

  background: #fff;
  border-bottom: 1px solid #d8dce5;
  -webkit-box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
}
.tags ul {
  margin-top: 8px;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  line-height: 40px;
}

.tags-li {
  float: left;
  margin: 0 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
  background: #409eff;

}

.tags-li-title {
  float: left;
  max-width: 130px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
  text-decoration: none;
}

.tags-li.active .tags-li-title {
  color: #fff;
  text-decoration: none;
}

</style>