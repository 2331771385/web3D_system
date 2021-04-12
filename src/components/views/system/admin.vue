<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon type="ios-apps" size='22'/>
            <span class="pageTitle">管理员列表</span>
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
                <!-- <font v-else color='red'>删除</font> -->
            </template>

            

            <template slot-scope="{row,index}" slot="action">
                <Button type="info" size='small' style="marginRight:5px" @click="updateInfo(row,index)">修改</Button>
                <font v-if="row.State==0">
                    <Button type="warning" size='small' style="marginRight:5px" @click="endInfo(row,index)">停用</Button>
                </font>
                <font v-else-if="row.State==1">
                    <Button type="success" size='small' style="marginRight:5px" @click="startInfo(row,index)">启用</Button>
                </font>
                <!-- <Button type="error" size='small' @click="deleteRow(row,index)">删除</Button> -->
            </template>
        </Table>

        <!-- 分页操作 -->
        <template>
            <Page class="pageIndex" :total='totalCount' size='small' 
                show-elevator show-sizer show-total>
            </Page>
        </template>


        <!-- 新增登录用户 -->
        <el-dialog  title="添加管理员信息" :visible.sync="addVisible" width="480px">
            <el-form :model="form" ref="form" label-width="115px" :rules="rules2" class="demo-ruleForm">
                <el-form-item label="登录账号:" prop="loginName">
                    <el-input
                        v-model="form.loginName"
                        placeholder="请输入登录名称"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

                <el-form-item label="昵称:" prop="nickName">
                    <el-input
                        v-model="form.nickName"
                        placeholder="请输入管理员姓名"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="设置密码:" prop="passwordMD5">
                    <el-input
                        v-model="form.passwordMD5"
                        :type="showPass ? 'text':'password'"
                        placeholder="请输入密码"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                    
                </el-form-item>
                <el-form-item label="角色:" prop="roleName">
                    <el-select v-model="form.roleName" style="width:300px;margin-bottom:20px">
                        <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="tableBtn" @click="addVisible = false">取 消</el-button>
                <el-button class="tableBtn" type="primary" @click="saveAdd('form')">确定</el-button>
            </span>
        </el-dialog>

        <!--    启用管理员操作-->
        <el-dialog title="提示" :visible.sync="startVisible" width="350px" center>
            <div class="del-dialog-cnt">是否确定启用该用户？</div>
            <span slot="footer" class="dialog-footer">
                <el-button class="tableBtn" @click="startVisible = false">取 消</el-button>
                <el-button class="tableBtn" type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!--    停用管理员操作-->
        <el-dialog title="提示" :visible.sync="deleteVisible" width="350px" center>
            <div class="del-dialog-cnt">是否确定停用该用户？</div>
            <span slot="footer" class="dialog-footer">
                <el-button class="tableBtn" @click="deleteVisible = false">取 消</el-button>
                <el-button class="tableBtn" type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        
        <!-- 修改管理员信息 -->
        <el-dialog title="修改管理员信息" :visible.sync="updateVisible" width="480px">
            <el-form :model="form" ref="form" label-width="115px" :rules="rules2">
                <el-form-item label="登录账号:" prop="loginName">
                    <el-input
                        v-model="form.loginName"
                        placeholder="请输入登录名称"
                        disabled
                        style="width:300px;margin-left:-15px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                <el-form-item label="昵称:" prop="nickName">
                    <el-input
                        v-model="form.nickName"
                        placeholder="请输入管理员姓名"
                        style="width:300px;margin-left:-15px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

                <el-form-item label="设置密码:">
                    <el-input
                        type="password"
                        v-model="form.updpasswordMD5"
                        placeholder="保留原密码"
                        style="width:300px;margin-left:-15px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                <el-form-item label="角色名称:" prop="roleName">
                    <el-select
                        v-model="form.roleName"
                        style="width:300px;margin-left:-15px;margin-bottom:5px"
                    >
                        <el-option
                        v-for="item in this.roleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button class="tableBtn" @click="updateVisible = false">取 消</el-button>
                <el-button class="tableBtn" type="primary" @click="saveUpdateName('form')">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>
<script>
import axios from 'axios';
// import vDialog from '../../dialog/admin-dialog.vue'
export default {
    name:'admin',
    
    data() {
        return {
          columns:[
              {
                 title:'id',
                 key: 'AdminID',
                //  minWidth:'90px',
                 width:'60px',
                 align:'center'
              },
              {
                  title:'登陆账号',
                  key:'LoginName',
                  width:'110px',
                  align:'center'
              },{
                  title:'昵称',
                  key:'NickName',
                  minWidth:100,
                  align:'center'
              },{
                  title:'角色',
                  key:'RoleName',
                  width:'130px',
                  align:'center'
              },{
                  title:'IP地址',
                  key:'LastIPAddress',
                  width:'110px',
                  align:'center'
              },{
                  title:'创建时间',
                  tooltip:'true',
                  key:'CreateTime',
                  width:'120px',
                  align:'center'
              },{
                  title:'最近登录时间',
                  tooltip:'true',
                  key:'LastLoginTime',
                  width:'130px',
                  align:'center'
              },{
                  title:'状态',
                  slot:'State',
                  width:'90px',
                  align:'center', 
              },{
                  title:'操作',
                  slot:'action',
                  width:'140px',
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
          roleList:[],
          mes:'',
          index:'',
          showPass:false,

          /**
           * 添加操作
           */
          addVisible:false,
          startVisible:false,
          deleteVisible:false,
          updateVisible:false,

          form: {
            adminID: null,
            roleID: null,
            loginName: "",
            nickName: "",
            passwordMD5: "",
            oldpasswordMD5: "",
            newpasswordMD5: "",
            secNewpasswordMD5: "",
            updpasswordMD5:'',
            roleName: "",
            dataName: "",
        },
          /**
           * 验证规则
           */
          rules2: {
                loginName: [
                    { required: true, message: "登录账号不能为空", trigger: "blur" },
                ],
                nickName: [
                    { required: true, message: "昵称不能为空", trigger: "blur" },
                ],
                passwordMD5: [
                    { required: true, message: "密码不能为空", trigger: "blur" },
                ],
                
                roleName: [
                    { required: true, message: "角色名称不能为空", trigger: "blur" },
                ],
            },
        }
    },
    created() {
        this.getAdminList();
        //获得角色信息
        this.getRoleList();
    },
    watch: {
        
        msg:{
            deep:true,
            handler:function(newVal,old){
                this.msg=newVal
            }
        }
    },
    methods: {

        /**
         * 获得角色列表
         */
        getRoleList(){
            axios({
                url:this.$store.state.UrlIP+'/authority/getRoles',
                method:'get',
                params:{
                    pageIndex:'1',
                    pageSize:'1000',
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    res.data.data.forEach(item=>{
                        this.roleList.push({
                            id:item.roleID,
                            name:item.roleName
                        })
                    })
                }
            }).catch(err=>{
                console.log(err);
            })
        },


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
            this.form={
                adminID: row.AdminID,
                roleID: row.RoleID,
                loginName: row.LoginName,
                nickName: row.NickName,
                passwordMD5: '',
                oldpasswordMD5: '',
                newpasswordMD5: '',
                secNewpasswordMD5: '',
                updpasswordMD5:'',
                roleName: '',
            };
            this.mes=row;
            this.updateVisible=true;
        },

        /**
         * 修改按钮操作
         */
        saveUpdateName(name){
            this.$refs[name].validate(valid=>{
                if (valid) {
                    axios({
                        url:this.$store.state.UrlIP+'/admin/updateAdmin',
                        method:'get',
                        params:{
                            nickName:this.form.nickName,
                            passwordMD5:this.$md5(this.form.newpasswordMD5),
                            adminID:this.form.adminID
                        },
                        headers:{
                            'Content-type':'application/x-www-form-urlencoded'
                        }
                    }).then(res=>{
                        if (res.data.code==0) {
                            // this.updateVisible=false;
                            // this.getAdminList();
                        }else{
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message:
                                    "<span style='font-size: 20px;margin-left: 20px'>错误代码" +
                                    res.data.code +
                                    " 错误信息：" +
                                    res.data.msg +
                                    "</span>",
                                type: "error",
                                customClass: "zZindex",
                            });
                        }
                    }).catch(err=>{
                        this.$message({
                            dangerouslyUseHTMLString: true,
                            message:
                            "<span style='font-size: 20px;margin-left: 20px'>系统错误！</span>",
                            type: "error",
                            customClass: "zZindex",
                        });
                    })

                    //分配角色
                    axios({
                        url:this.$store.state.UrlIP+'/admin/setRole',
                        method:'get',
                        params:{
                            adminID:this.form.adminID,
                            roleId:this.form.roleName
                        },
                        headers:{
                            'Content-type':'application/x-www-form-urlencoded'
                        }
                    }).then(res=>{
                        if (res.data.code==0) {
                            this.$Message['success']({
                                background: true,
                                content:'修改成功！'
                            })
                            this.updateVisible=false;
                            this.getAdminList();

                        }
                    }).catch(err=>{
                        console.log(err);
                    })
                    
                }else{
                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message:
                        "<span style='font-size: 20px;margin-left: 20px'>请输入有效信息！</span>",
                        type: "warning",
                        customClass: "zZindex",
                    });
                }
            })
        },




        //停用/启用按钮
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
        /**
         * 停用/启用确定操作
         */
        deleteRow() {
            var index = this.dataList[this.index].State;
            index = index == 0 ? 1 : 0;

            axios({
                url: this.$store.state.UrlIP + "/admin/updateAdminState",
                method: "get",
                params: {
                    // token: localStorage.getItem("Authorization"),
                    adminId: this.mes.AdminID,
                    state: index,
                },
                headers: {
                    "Content-type": "application/x-www-form-urlencoded",
                }
            })
                .then((res) => {
                    if (res.data.code == 0) {
                        this.$message({
                            dangerouslyUseHTMLString: true,
                            message:
                                "<span style='font-size: 20px;margin-left: 20px'>操作成功！</span>",
                            type: "success",
                            customClass: "zZindex",
                        });
                        // this.$message.success("操作成功！");
                        this.getAdminList();
                    } else {
                        this.$message({
                            dangerouslyUseHTMLString: true,
                            message:
                                "<span style='font-size: 20px;margin-left: 20px'>错误代码" +
                                res.data.code +
                                " 错误信息：" +
                                res.data.msg +
                                "</span>",
                            type: "error",
                            customClass: "zZindex",
                        });
                    
                    }
                })
                .catch((error) => {
                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message:
                        "<span style='font-size: 20px;margin-left: 20px'>系统错误！</span>",
                        type: "error",
                        customClass: "zZindex",
                    });
                // this.$message.error('系统错误！');
                });
                if (this.startVisible) {
                    this.startVisible = false;
                } else {
                    this.deleteVisible = false;
                }
            },


        /**
         * 添加操作
         */
        addInfo(){
            this.form={
                adminID: null,
                roleID: null,
                loginName: "",
                nickName: "",
                passwordMD5: "",
                oldpasswordMD5: "",
                newpasswordMD5: "",
                secNewpasswordMD5: "",
                updpasswordMD5:'',
                roleName: "",
                dataName: "",
            }
            this.addVisible=true;
        },

        saveAdd(name){
            this.$refs[name].validate(valid=>{
                if (valid) {
                    
                    axios({
                        url:this.$store.state.UrlIP+'/admin/insertAdmin',
                        method:'get',
                        params:{
                            loginName:this.form.loginName,
                            nickName:this.form.nickName,
                            passwordMD5:this.$md5(this.form.passwordMD5),
                            roleID:this.form.roleName,
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
                            this.getAdminList();
                        }else{
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message:
                                    "<span style='font-size: 20px;margin-left: 20px'>错误代码" +
                                    res.data.code +
                                    " 错误信息：" +
                                    res.data.msg +
                                    "</span>",
                                type: "error",
                                customClass: "zZindex",
                            });
                        }
                    }).catch(err=>{
                       this.$message({
                            dangerouslyUseHTMLString: true,
                            message:
                            "<span style='font-size: 20px;margin-left: 20px'>系统错误！</span>",
                            type: "error",
                            customClass: "zZindex",
                        });
                    })
                }else{
                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message:
                        "<span style='font-size: 20px;margin-left: 20px'>请输入有效信息！</span>",
                        type: "warning",
                        customClass: "zZindex",
                    });
                }
            })
            
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
  .ivu-icon-ios-apps{
    float: left !important;
    margin-top: 2px !important;
}
</style>
<style>

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