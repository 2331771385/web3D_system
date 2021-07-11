<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon  type="ios-apps" size='22'/>
            <span class="pageTitle">公共服务列表</span>
        </div>
        <!-- 搜索框 -->
        <div class='searchInput'>
            <div class="search-top">
                <span class="search-box-text">校区:</span>
                <el-select v-model="campus" style="width:200px" clearable>
                    <el-option v-for="item in campusList" :key="item.id" :label="item.campusName" :value="item.id"></el-option>
                </el-select>

                <span class="search-box-text">公共服务分类:</span>
                <el-select v-model="psortVal" 
                        style="width:200px" 
                        clearable
                        @on-clear='getPublicList'
                >
                    <el-option 
                        v-for="item in publicSortList" 
                        :key="item.id" 
                        :value="item.id"
                        :label = "item.name"
                    >
                    </el-option>
                </el-select>
                <span class="search-box-text">模糊查询:</span>
                <Input style="width:260px" 
                    v-model="search"
                    placeholder="公共服务名称、类型名称关键字"
                    clearable
                    @on-enter="clickSub"
                    @on-clear='getPublicList'
                    @on-change='getPublicList'
                />
                <Button type="primary" @click="getPublicList" icon="ios-search">查找</Button>
                <Button type="success" @click="addInfo" icon='ios-add'>新增</Button>
            </div>
        </div>

        <!-- 列表操作 -->
        <Table border :columns='columns' :data='dataList'>
            <template slot-scope="{row}" slot="serviceTypeName">
                [{{row.serviceTypeId}}] {{row.serviceTypeName}}
            </template>

            <template slot-scope="{row}" slot="updateTime">
                <font v-if="row.updateTime==null || row.updateTime=='' || row.updateTime==undefined">{{row.createTime || '-'}}</font>
                <font v-else>{{row.updateTime}}</font>
            </template>

            <!-- 显示图片信息 -->
            <template slot-scope="{ row }" slot="picUrl">
                <font>
                    <img class="item-imgs" :src="row.picUrl" />
                </font>
            </template>

            <!-- 显示图标信息 -->
            <template slot-scope="{ row }" slot="iconUrl">
                <font>
                    <img class="item-imgs" :src="row.iconUrl" />
                </font>
            </template>

            <template slot-scope="{row}" slot="state">
                <font v-if="row.state==0" color='green'>正常</font>
                <font v-else-if="row.state==1" color='orange'>暂停</font>
                <font v-else color='red'>删除</font>
            </template>

            <template slot-scope="{row,index}" slot="action">
                <Button type="info" size='small' style="marginRight:5px" @click="updateInfo(row,index)">修改</Button>
                <Button type="error" size='small' style="marginRight:5px" @click="deleteInfo(row,index)">停用</Button>
            </template>
        </Table>
        <!-- 分页操作 -->
        <template>
            <Page class="page-footer" :total='totalCount' size='small' 
                show-elevator show-sizer show-total
                @on-change='changePage'
                @on-page-size-change='changePagesize'
            >
            </Page>
        </template>

        <!-- 新增数据项 -->
        <el-dialog  title="新增公共服务信息" :visible.sync="addVisible" width="480px">
            <el-form :model="form" ref="form" label-width="115px" :rules="rules2" class="demo-ruleForm">
                <el-form-item label="校区名称:" prop="campusId">
                    <el-select v-model="form.campusId" style="width:300px;margin-bottom:5px">
                        <el-option
                            v-for="item in campusList"
                            :key="item.id"
                            :label="'['+item.id+']'+item.campusName"
                            :value="item.id"
                            
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="公共服务名称:" prop="serviceName">
                    <el-input
                        v-model="form.serviceName"
                        placeholder="公共服务名称"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

                <el-form-item label="公共服务类型:" prop="serviceTypeId">
                    <el-select 
                        v-model="form.serviceTypeId"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    >
                        <el-option 
                            v-for="item in publicSortList" 
                            :key="item.id" 
                            :value="item.id"
                            :label="item.name"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="简介:">
                    <el-input
                        v-model="form.shortDes"
                        placeholder="公共服务简介"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>
                    
                <el-form-item label="描述:" >
                    <el-input
                        v-model="form.describe"
                        placeholder="公共服务描述"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                <el-form-item label="服务数据:" >
                    <el-input
                        v-model="form.data"
                        placeholder="公共服务描述"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                <!-- 图片 -->
                <el-form-item label="图片:" >
                    <input type="file" name="avatar" ref="fileType" @change="changeImage($event)"/>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button class="tableBtn" @click="addVisible = false">取 消</el-button>
                <el-button class="tableBtn" type="primary" @click="saveAdd('form')">确定</el-button>
            </span>
        </el-dialog>

        <!-- 修改数据项 -->
        <el-dialog  title="修改公共服务信息" :visible.sync="updateVisible" width="480px">
            <el-form :model="form" ref="form" label-width="115px" :rules="rules2" class="demo-ruleForm">
                <el-form-item label="校区名称:" >
                    <el-select disabled v-model="form.campusId" style="width:300px;margin-bottom:5px">
                        <el-option
                            v-for="item in campusList"
                            :key="item.id"
                            :label="'['+item.id+']'+item.campusName"
                            :value="item.id"
                            
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="公共服务名称:" prop="serviceName">
                    <el-input
                        v-model="form.serviceName"
                        placeholder="公共服务名称"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

                <el-form-item label="公共服务类型:" prop="serviceTypeId">
                    <el-select v-model="form.serviceTypeId" style="width:300px;margin-bottom:5px">
                        <el-option
                            v-for="item in publicSortList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="简介:">
                    <el-input
                        v-model="form.shortDes"
                        placeholder="公共服务简介"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>
                    
                <el-form-item label="描述:" >
                    <el-input
                        v-model="form.describe"
                        placeholder="公共服务描述"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                <el-form-item label="服务数据:" >
                    <el-input
                        v-model="form.data"
                        placeholder="公共服务描述"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                <!-- 图片 -->
                <el-form-item label="图片:" >
                    <input type="file" name="avatar" ref="fileType" @change="changeImage($event)"/>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button class="tableBtn" @click="updateVisible = false">取 消</el-button>
                <el-button class="tableBtn" type="primary" @click="saveUpd('form')">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import axios from 'axios';
import vDialog from '../../dialog/public-dialog'
export default {
    name:'public-manage',
    components:{
        vDialog
    },
    data() {
        return {
            campus:'',
            psortVal:'',
            publicSortList:[],
            dataList:[],
            campusList:[],
            columns:[
                {
                    title:'id',
                    key: 'serviceId',
                    //  minWidth:'90px',
                    width:'60px',
                    align:'center'
                },{
                    title:'公共服务名称',
                    key: 'serviceName',
                    //  minWidth:'90px',
                    width:'150px',
                    align:'center'
                },{
                    title:'公共服务分类',
                    key: 'serviceTypeName',
                    //  minWidth:'90px',
                    minWidth:120,
                    align:'center'
                },{
                    title:'描述',
                    key: 'describe',
                    //  minWidth:'90px',
                    tooltip:'true',//开启后，文本将不换行
                    width:'150px',
                    align:'center'
                },{
                    title:'简介',
                    key: 'shortDes',
                    //  minWidth:'90px',
                    tooltip:'true',//开启后，文本将不换行
                    width:'150px',
                    align:'center'
                },{
                    title:'图标',
                    slot: 'iconUrl',
                    tooltip:'true',
                    width:90,
                    align:'center'
                },{
                    title:'图片',
                    slot: 'picUrl',
                    width:90,
                    tooltip:'true',
                    align:'center'
                },{
                    title:'修改时间',
                    slot: 'updateTime',
                    tooltip:'true',
                    //  minWidth:'90px',
                    minWidth:120,
                    align:'center'
                },{
                    title:'状态',
                    slot: 'state',
                    //  minWidth:'90px',
                    width:'90px',
                    align:'center'
                },{
                    title:'操作',
                    width:'160px',
                    slot:'action',
                    align:'center'
                }
            ],
            currentPage:'1',
            pageSize:'10',
            totalCount:0,
            search:'',
            // addPublic:false,//新增公共服务项
            addVisible:false,//控制新增的数据项
            form:{
                serviceName:'',
                serviceTypeId:'',
                campusId:'',//校园名称
                shortDes:'',//简介
                describe:'',//描述
                data:'',//json数据
                file:'',//上传的公共服务的图片
                label:'',//图标
                serviceId:'',
            },
            updateVisible:false,
            rules2:{
                serviceName:[
                    {required: true, message: '公共服务名称不能为空', trigger: 'blur'}
                ],
                serviceTypeId:[
                    {required: true, message: '公共服务类型不能为空', trigger: 'blur'}
                ],
                campusId:[
                    {required: true, message: '校区名称不能为空', trigger: 'blur'}
                ]
            },
            msg: '',
        }
    },
    watch: {
        psortVal:function(newVal,old){
            this.psortVal=newVal;
        }
    },
    created() {
         this.getCampusList();
         this.getPublicSortList();
    },
    methods: {
        changeImage(e) {
            var file = e.target.files[0];
            var reader = new FileReader()
            var that = this
            reader.readAsDataURL(file)
            reader.onload = function(e) {
                that.avatar = this.result
            }
        },
        
         /**
         * 获取校区信息
         */
        getCampusList(){
            axios({
                url:this.$store.state.UrlIP+'/campus/getData',
                method:'get',
                params:{
                    pageIndex:'1',
                    pageSize:'100',
                    token: window.localStorage.getItem('Authorization')
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    res.data.data.forEach(item=>{
                        this.campusList.push({
                            id:item.campusId,
                            campusName:item.campusName
                        })
                    });
                    this.campus=6;
                    this.getPublicList();//获取公共服务的数据
                }
            }).catch(err=>{
                console.log(err);
            })
        },

        // 获取公共服务分类的列表
        getPublicSortList() {
            axios({
                url: this.$store.state.UrlIP + '/publicService/getTypeData',
                method: 'get',
                params: {
                    pageIndex: '1',
                    pageSize: '100',
                    token: window.localStorage.getItem('Authorization'),
                },
                headers: {
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res => {
                if (res.data.code === 0) {
                    res.data.data.forEach(item => {
                        this.publicSortList.push({
                            id: item.serviceTypeId,
                            name: item.serviceTypeName
                        })
                    })

                }
            }).catch(err => {
                console.log(err);
            })
        },

        /**
         * 获取公共服务列表
         */
        getPublicList(){
            axios({
                url:this.$store.state.UrlIP+'/publicService/getData',
                method:'get',
                params:{
                    campusId:this.campus,
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    key:this.search,
                    serviceTypeId:this.psortVal,
                    token: window.localStorage.getItem('Authorization')
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    this.dataList=res.data.data;
                    this.dataList.forEach(item => {
                        item.picUrl = `http://211.87.231.41:8089${item.picUrl}`;
                        item.iconUrl = `http://211.87.231.41:8089${item.iconUrl}`
                    })
                    this.totalCount=res.data.respPage.totalCount
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        //新增公共服务项
        addInfo(){
            // this.addPublic=true;
            this.addVisible=true;
            this.form={
                serviceName:'',
                serviceTypeId:'',
                campusId:'',//校园名称
                shortDes:'',//简介
                describe:'',//描述
                data:'',//json数据
                file:'',//上传的公共服务的图片
            }
        },
        //新增确定按钮的提交
        saveAdd(name){
            this.$refs[name].validate(valid=>{
                if (valid) {
                    console.log(this.form);
                    let formData = new FormData();
                    formData.append('serviceName', this.form.serviceName);
                    formData.append('serviceTypeId', this.form.serviceTypeId);
                    formData.append('campusId', this.form.campusId);
                    formData.append('shortDes', this.form.shortDes);
                    formData.append('describe', this.form.describe);
                    formData.append('file',this.$refs.fileType.files[0]);
                    formData.append('data', this.form.data);
                    formData.append('token', window.localStorage.getItem('Authorization'));
                    axios({
                        url: this.$store.state.UrlIP+'/publicService/insertData',
                        method: 'post',
                        data: formData,
                        headers:{
                            'Content-type':'multipart/form-data'
                        }
                    }).then(res=>{
                        if (res.data.code==0) {
                            this.$Message['success']({
                                background: true,
                                content:'操作成功！'
                            })
                            this.addVisible=false;
                            this.getPublicList();
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

        clickSub(){},
        /**
         * 分页
         */
        changePage(val){
            this.currentPage=val;
            this.getPublicList();
        },
        /**
         * 改变每页数量的操作
         */
        changePagesize(val){
            this.pageSize=val;
            this.getPublicList();
        },


        //修改操作
        updateInfo(row,index){
            this.msg = row;
            console.log(row);
            this.form={
                serviceName:row.serviceName,
                serviceTypeId:row.serviceTypeId,
                campusId:row.campusId,//校园名称
                shortDes:row.shortDes,//简介
                describe:row.describe,//描述
                data:row.data,//json数据
                label:row.iconUrl,//上传的公共服务的图片
                file:row.picUrl,
                serviceId:row.serviceId
            }
            this.updateVisible=true;
        },

        //修改成功的提交
        saveUpd(name){
            this.$refs[name].validate((valid)=>{
                if (valid) {
                    let formData = new FormData();
                    formData.append('serviceId', this.msg.serviceId);
                    formData.append('serviceName', this.form.serviceName);
                    formData.append('serviceTypeId', this.form.serviceTypeId);
                    formData.append('campusId', this.form.campusId);
                    formData.append('shortDes', this.form.shortDes);
                    formData.append('describe', this.form.describe);
                    formData.append('data', this.form.data);
                    formData.append('file',this.$refs.fileType.files[0]);
                    formData.append('token', window.localStorage.getItem('Authorization'));
                    axios({
                        url:this.$store.state.UrlIP+'/publicService/updateData',
                        method:'post',
                        data: formData  ,
                        headers:{
                            'Content-type':'multipart/form-data'
                        }
                    }).then(res=>{
                        if (res.data.code==0) {
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message:
                                    "<span style='font-size: 20px;margin-left: 20px'>操作成功！</span>",
                                type: "success",
                                customClass: "zZindex",
                            });
                            this.updateVisible = false;
                            this.getPublicList();
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
                        "<span style='font-size: 20px;margin-left: 20px'>请输入有效数据！</span>",
                        type: "error",
                        customClass: "zZindex",
                    });
                    // this.$message.error('系统错误！');
        
                }
            })
        },
        // 
        deleteInfo(row, index) {
            this.$Modal.confirm({
                title: '注意',
                content: '是否删除公共服务及其相关信息？',
                onOk: () => {
                    this.handleDelete(row.serviceId);
                },
                onCancel: () => {
                    this.$Message.info('取消删除');
                }
            });
        },
        handleDelete(serviceId) {
            this.$axios({
                url: this.$store.state.UrlIP + '/publicService/updateData',
                method: 'post',
                params: {
                    serviceId: serviceId,
                    state: 1,
                    token: '886a'
                },
                headers:{
                    'Content-type':'multipart/form-data'
                }
            }).then(res => {
                if(res.data.code == 0) {
                    this.$Message['success']({
                        background: true,
                        content:'操作成功！'
                    });
                    this.getPublicList();
                }
            }).catch(err => {
                console.log(err);
            })
        }

    },
}
</script>
<style scoped>
.ivu-icon-ios-apps{
    float: left !important;
    margin-top: 2px !important;
}
.upload-demo{
    text-align: left;
    margin-left: 10px;
}
.item-imgs {
    width: 20px;
    height: 20px;
}
.page-footer{
    margin-top: 25px;
    float: right;
}
</style>
<style>
.el-message {
  height: 100px;
  width: 600px;
  font-size: 35px !important;
  font-weight: bold;
}
.zZindex {
  z-index: 3000 !important;
  font-size: 35px !important;
  font-weight: bold;
}
.ivu-input {
    display: inline-block;
    width: 100%;
    height: 40px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 14px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #515a6e;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out,backgrou
}
</style>