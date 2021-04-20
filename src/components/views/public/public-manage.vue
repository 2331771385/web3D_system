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
                <Select v-model="campus" style="width:200px" clearable>
                    <Option v-for="item in campusList" :key="item.id" :label="item.campusName" :value="item.id"></Option>
                </Select>

                <span class="search-box-text">公共服务分类:</span>
                <Select v-model="psortVal" 
                        style="width:200px" 
                        clearable
                        @on-clear='getPublicList'
                >
                    <Option v-for="item in publicSortList" :key="item.id" :value="item.id">{{item.name}}</Option>
                </Select>
                <span class="search-box-text">模糊查询:</span>
                <Input style="width:auto" 
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
                <font v-if="row.updateTime==null || row.updateTime=='' || row.updateTime==undefined">{{row.createTime}}</font>
                <font v-else>{{row.updateTime}}</font>
            </template>

            <template slot-scope="{row}" slot="state">
                <font v-if="row.state==0" color='green'>正常</font>
                <font v-else-if="row.state==1" color='orange'>暂停</font>
                <font v-else color='red'>删除</font>
            </template>

            <template slot-scope="{row,index}" slot="action">
                <Button type="info" size='small' style="marginRight:5px" @click="updateInfo(row,index)">修改</Button>
                <font v-if="row.state==0">
                    <Button type="warning" size='small' style="marginRight:5px" @click="deleteInfo(row,index)">停用</Button>
                </font>
                <font v-else-if="row.state==1">
                    <Button type="success" size='small' style="marginRight:5px" @click="startInfo(row,index)">启用</Button>
                </font>
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


        <!-- 新增公共服务项 -->
        <!-- <template v-if="addPublic">
            <v-dialog
                :addVisible='addVisible'
                :addRow='form'
                :addPublic='addPublic'
                :publicSortList="publicSortList"
                :campusList='campusList'
                @addSuccess='addSuccess'
                @cancelAdd='cancelAdd'
            >

            </v-dialog>
        </template> -->

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
                    <el-input
                        v-model="form.serviceTypeId"
                        placeholder="公共服务类型"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
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

                <!-- 图标 -->
                <el-form-item label="图标:" >
                    <!-- <el-input
                        v-model="form.label"
                        style="width:300px;margin-bottom:5px"
                    ></el-input> -->
                    <el-upload
                        class="upload-demo"
                        action="http://211.87.231.41:8089"
                        :on-change="handleChange"
                        :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                </el-form-item>

                <!-- 图片 -->
                <el-form-item label="图片:" >
                    <!-- <el-input
                        v-model="form.file"
                        style="width:300px;margin-bottom:5px"
                    ></el-input> -->
                    <el-upload
                        class="upload-demo"
                        action="http://211.87.231.41:8089"
                        :on-change="handleChange1"
                        :file-list="fileList1">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
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

                <el-form-item label="公共服务类型:">
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

                <!-- 图标 -->
                <el-form-item label="图标:" >
                    <!-- <el-input
                        v-model="form.label"
                        style="width:300px;margin-bottom:5px"
                    ></el-input> -->
                    <el-upload
                        class="upload-demo"
                        action="http://211.87.231.41:8089"
                        :on-change="handleChange"
                        :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                </el-form-item>

                <!-- 图片 -->
                <el-form-item label="图片:" >
                    <!-- <el-input
                        v-model="form.file"
                        style="width:300px;margin-bottom:5px"
                    ></el-input> -->
                    <el-upload
                        class="upload-demo"
                        action="http://211.87.231.41:8089"
                        :on-change="handleChange1"
                        :file-list="fileList1">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
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
                    slot: 'serviceTypeName',
                    //  minWidth:'90px',
                    minWidth:110,
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
                    key: 'iconUrl',
                    tooltip:'true',
                    minWidth:130,
                    align:'center'
                },{
                    title:'图片',
                    key: 'picUrl',
                    minWidth:130,
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
            fileList:[],
            fileList1:[],
        }
    },
    watch: {
        psortVal:function(newVal,old){
            this.psortVal=newVal;
        }
    },
    created() {
        
         this.getCampusList();
    },
    methods: {
        handleChange(file, fileList) {
            this.fileList = fileList.slice(-2);
        },
        handleChange1(file, fileList) {
            this.fileList1 = fileList.slice(-2);
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
                    pageSize:'100'
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
        /**
         * 获取公共服务列表
         */
        getPublicList(){
            this.publicSortList=[];
            axios({
                url:this.$store.state.UrlIP+'/publicService/getData',
                method:'get',
                params:{
                    campusId:this.campus,
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    key:this.search,
                    serviceTypeId:this.psortVal,
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    console.log(res.data.data);
                    this.dataList=res.data.data;
                    this.totalCount=res.data.respPage.totalCount
                    res.data.data.forEach(item => {
                        if (this.publicSortList.length==0) {
                            this.publicSortList.push({
                                id:item.serviceTypeId,
                                name:item.serviceTypeName
                            })
                        }else{
                            for(var i=0;i<this.publicSortList.length;i++){
                                if (this.publicSortList[i].id===item.serviceTypeId) {
                                    break;
                                }
                            }
                            if (i==this.publicSortList.length) {
                                this.publicSortList.push({
                                    id:item.serviceTypeId,
                                    name:item.serviceTypeName
                                })
                            }   
                        }
                    });
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
                    axios({
                        url:this.$store.state.UrlIP+'/publicService/insertData',
                        method:'post',
                        params:{
                            serviceName:this.form.serviceName,
                            serviceTypeId:this.form.serviceTypeId,
                            campusId:this.form.campusId,
                            shortDes:this.form.shortDes,
                            describe:this.form.describe,
                            data:this.form.data,
                            file:this.form.file
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
            this.form={
                serviceName:row.serviceName,
                serviceTypeId:row.serviceId,
                campusId:row.campusId,//校园名称
                shortDes:row.shortDes,//简介
                describe:row.describe,//描述
                data:'',//json数据
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
                    axios({
                        url:this.$store.state.UrlIP+'/publicService/updateData',
                        method:'post',
                        params:{
                            serviceId:this.form.serviceId,
                            campusId:this.form.campusId,
                            serviceName:this.form.serviceName,
                            serviceTypeId:this.form.serviceTypeId,
                            shortDes:this.form.shortDes,
                            describe:this.form.describe,
                            file:this.form.file,
                        },
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

</style>