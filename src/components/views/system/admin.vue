<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon type="ios-apps" size='22'/>
            <p class="pageTitle">管理员列表</p>
        </div>
        <!-- 搜索框 -->
        <div class='searchInput'>
            <div class="search-top">
                <span class="search-box-text">模糊查询：</span>
                <Input style="width:auto" 
                    v-model="search"
                    placeholder="登陆账号、昵称关键字"
                    clearable
                    @on-enter="clickSub"
                    @on-clear='getAdminList'
                    @on-change='getAdminList'
                />
                <Button type="primary" @click="getAdminList" icon="ios-search">查找</Button>
                <Button type="success" @click="addInfo" icon='ios-add'>新增</Button>
            </div>
        </div>


        <!-- 列表展示的数据 -->
        <Table border :columns='columns' :data='dataList'>
            <template slot-scope="{row}" slot="State">
                <font v-if="row.State==0" color='green'>正常</font>
                <font v-else-if="row.State==1" color='orange'>暂停</font>
                <font v-else color='red'>删除</font>
            </template>

            <template slot-scope="{row,index}" slot="action">
                <Button type="info" size='small' style="marginRight:5px" @click="updateInfo(row,index)">修改</Button>
                <font v-if="row.State==0">
                    <Button type="warning" size='small' style="marginRight:5px" @click="deleteInfo(row,index)">停用</Button>
                </font>
                <font v-else-if="row.State==1">
                    <Button type="success" size='small' style="marginRight:5px" @click="startInfo(row,index)">启用</Button>
                </font>
                <Button type="error" size='small' @click="deleteRow(row,index)">删除</Button>
            </template>
        </Table>

        <!-- 分页操作 -->
        <template>
            <Page class="pageIndex" :total='totalCount' size='small' 
                show-elevator show-sizer show-total>
            </Page>
        </template>

        <!-- 停用/启用操作 -->
        <template v-if="flagDel">
            <v-dialog   
                :updateVisible='updateVisible'
                @deleteOne='deleteOne(msg)'
                @cancleDelete='cancleDelete'
            >
            </v-dialog>
        </template>
        
        <!-- 启用操作 -->
        <template v-if="flagStr"> 
            <v-dialog
                :startVisible='startVisible'
                @deleteOne='deleteOne(msg)'
                @cancleStart='cancleStart'
            >
            </v-dialog>
        </template>

        <!-- 删除弹框 -->
        <template v-if="flagDelete">
            <v-dialog
                :deleteVisible='deleteVisible'
                @deleteAdmin='deleteAdmin'
                @deleteRowOne='deleteRowOne'
            >

            </v-dialog>
        </template>
        
        <!-- 修改操作 -->
        <template v-if="flagUpd">
            <v-dialog
                :flagUpd='flagUpd'
                :updateAdminVisible='updateAdminVisible'
                :row='form'
                @updCancal='updCancal'
                @updSuccess='updSuccess'
            >
            </v-dialog>
        </template>

        <!-- 添加操作 -->
        <template v-if="flagAdd">
            <v-dialog
                :flagAdd='flagAdd'
                :addVisible='addVisible'
                :addRow='form'
                @addSuccess='addSuccess'
                @cancelAdd='cancelAdd'
            >

            </v-dialog>
        </template>
        
    </div>
</template>
<script>
import axios from 'axios';
import vDialog from '../../dialog/admin-dialog.vue'
export default {
    name:'admin',
    components:{
        vDialog
    },  
    data() {
        return {
          columns:[
              {
                 title:'id',
                 key: 'AdminID',
                //  minWidth:'90px',
                 width:'100px',
                 align:'center'
              },
              {
                  title:'登陆账号',
                  key:'LoginName',
                  width:'160px',
                  align:'center'
              },{
                  title:'昵称',
                  key:'NickName',
                  width:'160px',
                  align:'center'
              },{
                  title:'角色',
                  key:'RoleID',
                  width:'160px',
                  align:'center'
              },{
                  title:'IP地址',
                  key:'LastIPAddress',
                  width:'190px',
                  align:'center'
              },{
                  title:'创建时间',
                  key:'CreateTime',
                  width:'190px',
                  align:'center'
              },{
                  title:'最近登录时间',
                  key:'LastLoginTime',
                  width:'190px',
                  align:'center'
              },{
                  title:'状态',
                  slot:'State',
                  width:'160px',
                  align:'center', 
              },{
                  title:'操作',
                  slot:'action',
                //   minWidth:'200px',
                  align:'center',
              }

          ],
          dataList:[],
          currentPage:'1',
          pageSize:'10',
          totalCount:0,
          index:0,
          msg:'',
          search:'',
          updateVisible:false,
          startVisible:false,
          flagDel:false,
          flagStr:false,
          updateAdminVisible:false,
          flagUpd:false,
          flagAdd:false,
          addVisible:false,
          deleteVisible:false,
          flagDelete:false,
          form:{
              AdminID:'',
              LoginName:'',
              NickName:'',
              password:'',
              RoleID:''
          }
        }
    },
    created() {
        this.getAdminList();
    },
    watch: {
        updateVisible:function(newVal,old){
            this.updateVisible=newVal
        },
        msg:{
            deep:true,
            handler:function(newVal,old){
                this.msg=newVal
            }
        }
    },
    methods: {
        /**
         * 回车操作
         */
        clickSub(){
            this.getAdminList();
        },
        getAdminList(){
            axios({
                url:this.$store.state.UrlIP+'/admin/getAdmins',
                method:'get',
                params:{
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    key:this.search
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    this.dataList=res.data.data;
                    this.totalCount=res.data.respPage.totalCount;
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        /**
         * 修改操作
         */
        updateInfo(row,index){
            this.msg=row;
            this.form={
                AdminID:this.msg.AdminID,
                LoginName:this.msg.LoginName,
                NickName:this.msg.NickName,
                password:'',
                RoleID:this.msg.RoleID
            };
            this.updateAdminVisible=true;
            this.flagUpd=true;
        },
        updCancal(){
            this.updateAdminVisible=false;
            this.flagUpd=false;
        },
        updSuccess(data){
            axios({
                url:this.$store.state.UrlIP+'/admin/updateAdmin',
                method:'get',
                params:{
                    adminID:data.AdminID,
                    nickName:data.NickName,
                    token:'886a'
                }, 
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    console.log(res.data.data);
                    this.updateAdminVisible=false; 
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        /**
         * 停用/启用操作
         */
        deleteInfo(row,index){
            this.msg=row;
            this.updateVisible=true;
            this.flagDel=true;
        },
        deleteAdmin(index){
            axios({
                url:this.$store.state.UrlIP+'/admin/updateAdminState',
                method:'get',
                params:{
                   adminId:this.msg.AdminID,
                   state:index,
                   token:'886a'
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    this.$Message['success']({
                        background: true,
                        content:'操作成功！'
                    })
                    this.getAdminList();
                    this.flagDelete=false;
                    this.deleteVisible=false;
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        /**
         * 由停用状态转换为正常态
         */
        deleteOne(row){
            let index;
            if (row.State=='0') {
                index='1'
            }else if (row.State=='1') {
                index='0'
            }else{
                index='-1'
            }
            
            axios({
                url:this.$store.state.UrlIP+'/admin/updateAdminState',
                method:'get',
                params:{
                   adminId:row.AdminID,
                   state:index,
                   token:'886a'
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    this.$Message['success']({
                        background: true,
                        content:'操作成功！'
                    })
                    this.getAdminList();
                    if (this.updateVisible) {
                        this.updateVisible=false;
                        this.flagDel=false;
                    }else if (this.startVisible) {
                        this.startVisible=false;
                        this.flagStr=false;
                    }
                    
                }
            }).catch(err=>{
                console.log(err);
            })
        },


        cancleDelete(){
            this.updateVisible=false;
            this.flagDel=false;
        },
        deleteRowOne(){
            this.flagDelete=false;
            this.deleteVisible=false;
       },
        /**
         * 启用操作
         */
        startInfo(row,index){
            this.startVisible=true;
            this.msg=row;
            this.flagStr=true;
        },
        cancleStart(){
            this.startVisible=false;
            this.flagStr=false;
        },
        //添加操作
        addInfo(){
            this.form={
                LoginName:'',
                NickName:'',
                password:'',
                RoleID:'' 
            }
            this.flagAdd=true;
            this.addVisible=true;
        },
        addSuccess(data){
            axios({
                url:this.$store.state.UrlIP+'/admin/insertAdmin',
                method:'get',
                params:{
                    loginName:data.LoginName,
                    nickName:data.NickName,
                    passwordMD5:data.password,
                    roleID:data.RoleID,
                    token:'886a'
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    this.$Message['success']({
                        background: true,
                        content:'操作成功！'
                    })
                    this.addVisible=false;
                    this.flagAdd=false;
                    this.getAdminList();
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        //取消添加操作
        cancelAdd(){
            this.addVisible=false;
            this.flagAdd=false;
        },

        // 删除某一行操作
        deleteRow(row,index){
            this.msg=row;
            this.flagDelete=true;
            this.deleteVisible=true;
        }
    },
}
</script>
<style scoped>
.ivu-icon-ios-apps{
    float: left;
    margin-top: 2px;
}
</style>