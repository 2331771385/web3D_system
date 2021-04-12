<template>
   <div class="tableContainer">
        <div class="table-label">
            <Icon type="ios-apps" size='22'/>
            <span class="pageTitle">角色信息列表</span>
        </div>

        <!-- 搜索框以及数据的新增 -->
        <div class='searchInput'>
            <div class="search-top">
                <span class="search-box-text">模糊查询：</span>
                <Input style="width:auto" 
                    v-model="search"
                    placeholder="角色名称、描述关键字"
                    clearable
                    @on-enter="clickSub"
                    @on-clear='getRoleList'
                    @on-change='getRoleList'
                />
                <Button type="primary" @click="getRoleList" icon="ios-search">查找</Button>
                <Button type="success" @click="addInfo" icon='ios-add'>新增</Button>
            </div>
        </div>


        <!-- 列表展示的数据 -->
        <Table border :columns='columns' :data='roleList'>
            <template slot-scope="{row}" slot="state">
                <font v-if="row.state==0" color='green'>正常</font>
                <font v-else-if="row.state==1" color='orange'>暂停</font>
                <font v-else color='red'>删除</font>
            </template>

            <template slot-scope="{row,index}" slot="action">
                <Button type="info" size='small' style="marginRight:5px" @click="updateInfo(row,index)">修改</Button>
                <font v-if="row.state==0">
                    <Button type="warning" size='small' style="marginRight:5px" @click="endInfo(row,index)">停用</Button>
                </font>
                <font v-else-if="row.state==1">
                    <Button type="success" size='small' style="marginRight:5px" @click="startInfo(row,index)">启用</Button>
                </font>
                <!-- <Button type="error" size='small' @click="deleteRow(row,index)">删除</Button> -->
            </template>
        </Table>
         <!-- 分页操作 -->
        <template>
            <Page class="pageIndex" :total='totalCount' size='small' 
                show-elevator show-sizer show-total
                @on-change='changePage'
                @on-page-size-change='changePagesize'
            >
            </Page>
        </template>

        <!-- 新增弹框操作 -->
        <el-dialog  title="添加角色信息" :visible.sync="addVisiable" width="480px">
            <el-form :model="form" ref="form" label-width="115px" :rules="rules2" class="demo-ruleForm">
                
                <!-- 角色名称 -->
                <el-form-item label="角色名称:" prop='roleName'>
                    <el-input
                        v-model="form.roleName"
                        placeholder="请输入角色名称"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

                <!-- 角色描述 -->
                <el-form-item label="角色描述:" prop="roleDescription">
                    <el-input
                        type="textarea"
                        cols="10"
                        rows="4"
                        placeholder="请输入角色描述"
                        v-model="form.roleDescription"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button class="tableBtn" @click="addVisiable = false">取 消</el-button>
                <el-button class="tableBtn" type="primary" @click="saveAdd('form')">确定</el-button>
            </span>
        </el-dialog>


        <!-- 修改角色信息 -->
        <el-dialog  title="修改角色信息" :visible.sync="updateVisible" width="480px">
            <el-form :model="form" ref="form" label-width="115px" :rules="rules2" class="demo-ruleForm">
                
                <!-- 角色名称 -->
                <el-form-item label="角色名称:" prop='roleName'>
                    <el-input
                        v-model="form.roleName"
                        style="width:300px;margin-bottom:5px"
                        disabled
                    ></el-input>
                </el-form-item>

                <!-- 角色描述 -->
                <el-form-item label="角色描述:" prop="roleDescription">
                    <el-input
                        type="textarea"
                        cols="10"
                        rows="4"
                        placeholder="请输入角色描述"
                        v-model="form.roleDescription"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button class="tableBtn" @click="updateVisible = false">取 消</el-button>
                <el-button class="tableBtn" type="primary" @click="saveUpdate('form')">确定</el-button>
            </span>
        </el-dialog>

        <!--启用角色弹框-->
        <el-dialog title="提示" :visible.sync="startVisible" width="350px" center>
        <div class="del-dialog-cnt" style="font-size: 20px;text-align: center">是否确定启用该角色？</div>
        <span slot="footer" class="dialog-footer">
            <el-button class="tableBtn" @click="startVisible = false">取 消</el-button>
            <el-button class="tableBtn" type="primary" @click="deleteRow">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 停用角色按钮-->
        <el-dialog  title="提示" :visible.sync="deleteVisible" width="350px" center>
        <div class="del-dialog-cnt">是否确定停用该角色？</div>
        <span slot="footer" class="dialog-footer">
            <el-button class="tableBtn" @click="deleteVisible = false">取 消</el-button>
            <el-button class="tableBtn" type="primary" @click="deleteRow">确 定</el-button>
        </span>
        </el-dialog>

   </div>
</template>
<script>
import axios from 'axios'
export default {
    name:'role',
    data() {
        return {
            search:'',
            currentPage:'1',
            pageSize:'10',
            totalCount:0,
            roleList:[],
            /**
             * 列表中的数据展示
             */
            columns:[
              {
                 title:'id',
                 key: 'roleID',
                //  minWidth:'90px',
                 width:'60px',
                 align:'center'
              },
              {
                  title:'角色名称',
                  key:'roleName',
                  width:'130px',
                  align:'center'
              },{
                  title:'角色描述',
                  key:'roleDescription',
                  minWidth:100,
                  align:'center'
              },{
                  title:'创建时间',
                  tooltip:'true',
                  key:'createTime',
                  width:'130px',
                  align:'center'
              },{
                  title:'最近登录时间',
                  tooltip:'true',
                  key:'updateTime',
                  width:'150px',
                  align:'center'
              },{
                  title:'状态',
                  slot:'state',
                  width:'90px',
                  align:'center', 
              },{
                  title:'操作',
                  slot:'action',
                  width:'160px',
                  align:'center',
              }

          ],

          /**
           * 新增操作
           */
          addVisiable:false,
          form:{
              roleId:'',
              roleName:'',//角色名称
              roleDescription:'',//角色描述
          },

          /**
           * 修改角色信息
           */
          updateVisible:false,

          /**
           * 停用/启用
           */
          deleteVisible:false,
          startVisible:false,
          mes:'',
          index:'',

          /**
           * 校验规则
           */
          rules2:{
              roleName:[
                  {required: true, message: '角色名称不能为空', trigger: 'blur'}
              ],
              roleDescription:[
                  {required: true, message: '角色描述不能为空', trigger: 'blur'}
              ],

          }
        }
    },
    created() {
        this.getRoleList();
    },
    methods: {
        clickSub(){},
        //获得角色数据的列表
        getRoleList(){
            axios({
                url:this.$store.state.UrlIP+'/authority/getRoles',
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
                    console.log(res.data.data);
                    this.roleList=res.data.data;
                    this.totalCount=res.data.respPage.totalCount;
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        //新增数据
        addInfo(){
            this.addVisiable=true;
            this.form={
                roleName:'',//角色名称
                roleDescription:'',//角色描述
            }
        },


        /**
         * 新增角色的具体信息
         */
        saveAdd(name){
            this.$refs[name].validate(valid=>{
                if (valid) {
                    axios({
                        url:this.$store.state.UrlIP+'/authority/insertRole',
                        method:'get',
                        params:{
                            roleName:this.form.roleName,
                            roleDescription:this.form.roleDescription
                        },
                        headers:{
                            'Content-type':'application/x-www-form-urlencoded'
                        }
                    }).then(res=>{
                        if (res.data.code==0) {
                            console.log(res.data.data);
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message: "<span style='font-size: 20px;margin-left: 20px'>添加成功！</span>",
                                type: "success",
                                customClass:'zZindex',
                            });
                            this.getRoleList();
                        }else{
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message: "<span style='font-size: 20px;margin-left: 20px'>错误代码"+ res.data.code+ " 错误信息：" + res.data.msg+"</span>",
                                type: "error",
                                customClass:'zZindex',
                            });
                        }
                    }).catch(err=>{
                        this.$message({
                            dangerouslyUseHTMLString: true,
                            message: "<span style='font-size: 20px;margin-left: 20px'>系统错误</span>",
                            type: "error",
                            customClass:'zZindex',
                        });
                    })
                    this.addVisiable = false;
                }else{
                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message: "<span style='font-size: 20px;margin-left: 20px'>系统错误</span>",
                        type: "error",
                        customClass:'zZindex',
                    });
                }
            })
        },


        /**
         * 修改操作
         */
        updateInfo(row,index){
            this.updateVisible=true;
            this.form={
                roleId:row.roleID,
                roleName:row.roleName,//角色名称
                roleDescription:row.roleDescription,//角色描述
            }
        },

        /**
         * 修改角色信息
         */
        saveUpdate(name){
            this.$refs[name].validate(valid=>{
                if (valid) {
                    axios({
                        url:this.$store.state.UrlIP+'/authority/updateRole',
                        method:'get',
                        params:{
                            roleID:this.form.roleId,
                            roleName:this.form.roleName,
                            roleDescription:this.form.roleDescription
                        },
                        headers:{
                            'Content-type':'application/x-www-form-urlencoded'
                        }
                    }).then(res=>{
                        if (res.data.code==0) {
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message: "<span style='font-size: 20px;margin-left: 20px'>修改成功！</span>",
                                type: "success",
                                customClass:'zZindex',
                            });
                            this.getRoleList();
                        }else{
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message: "<span style='font-size: 20px;margin-left: 20px'>错误代码"+ res.data.code+ " 错误信息：" + res.data.msg+"</span>",
                                type: "error",
                                customClass:'zZindex',
                            });
                        }
                    }).catch(err=>{
                        this.$message({
                            dangerouslyUseHTMLString: true,
                            message: "<span style='font-size: 20px;margin-left: 20px'>系统错误</span>",
                            type: "error",
                            customClass:'zZindex',
                        });
                    })
                    this.updateVisible = false;
                    
                }else{
                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message: "<span style='font-size: 20px;margin-left: 20px'>系统错误</span>",
                        type: "error",
                        customClass:'zZindex',
                    });
                }
            })
        },


        /**
         * 停用/启用操作
         */
        startInfo(row,index) {
            this.index = index;
            this.mes = row;
            this.startVisible = true;
        },
        endInfo(row,index) {
            this.index = index;
            this.mes = row;
            this.deleteVisible = true;
        },

        //0是启用，1是停用
            deleteRow() {
                var index = this.roleList[this.index].state;
                if (index == 0) {
                    index = 1;
                } else {
                    index = 0;
                }
                axios({
                    url: this.$store.state.UrlIP + "/authority/updateRoleState",
                    method: "get",
                    params: {
                        roleId: this.mes.roleID,
                        state: index
                    },
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded"
                    },
                })
                    .then(res => {
                        if (res.data.code == 0) {
                            this.getRoleList();
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message: "<span style='font-size: 20px;margin-left: 20px'>操作成功！</span>",
                                type: "success",
                                customClass:'zZindex',
                            });
                            // this.$message.success("操作成功！");
                        } else {
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message: "<span style='font-size: 20px;margin-left: 20px'>错误代码"+ res.data.code+ " 错误信息：" + res.data.msg+"</span>",
                                type: "error",
                                customClass:'zZindex',
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.$message({
                            dangerouslyUseHTMLString: true,
                            message: "<span style='font-size: 20px;margin-left: 20px'>系统错误！</span>",
                            type: "error",
                            customClass:'zZindex',
                        });
                    });
                if (this.startVisible) {
                    this.startVisible = false;
                } else {
                    this.deleteVisible = false;
                }
            },


         /**
         * 改变页码
         */
        changePage(val){
            this.currentPage=val;
            this.getRoleList();
        },
        /**
         * 改变页数
         */
        changePagesize(val){
            this.pageSize=val;
            this.getRoleList();
        },
    },
}
</script>
<style scoped>
/*删除弹框*/
  .del-dialog-cnt{
    font-size: 16px;
    text-align: center
  }
</style>
<style>
.ivu-icon-ios-apps{
    float: left !important;
    margin-top: 2px !important;
}
.el-message{
    height: 100px;
    width: 600px;
    font-size: 35px !important;
    font-weight: bold;
  }
  .zZindex {
    z-index:3000 !important;
    font-size: 35px !important;
    font-weight: bold;
  }
</style>