<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon  type="ios-apps" size='22'/>
            <p class="pageTitle">设备数据列表</p>
        </div>
        <!-- 搜索框 -->
        <div class='searchInput'>
            <div class="search-top">

                <span class="search-box-text">校区:</span>
                <Select v-model="campus" style="width:200px" clearable>
                    <Option v-for="item in campusList" :key="item.id" :label="item.campusName" :value="item.id"></Option>
                </Select>

                <span class="search-box-text">设备分类:</span>
                <Select v-model="psortVal" style="width:200px">
                    <Option v-for="item in videoSortList" :key="item.id" :label="item.name" :value="item.id"></Option>
                </Select>
                <span class="search-box-text">模糊查询:</span>
                <Input style="width:auto" 
                    v-model="search"
                    placeholder="设备名称、类型名称关键字"
                    clearable
                    @on-enter="clickSub"
                    @on-clear='getVideoList'
                    @on-change='getVideoList'
                />
                <Button type="primary" @click="getVideoList" icon="ios-search">查找</Button>
                <Button type="success" @click="addInfo" icon='ios-add'>新增</Button>
            </div>
        </div>
        <!-- 列表数据 -->
        <Table border :columns='columns' :data='dataList'>
            <template slot-scope="{row}" slot="deviceTypeName">
                [{{row.deviceTypeId}}] {{row.deviceTypeName}}
            </template>

            <!-- updateTime -->
            <template slot-scope="{row}" slot="updateTime">
                <font v-if="row.updateTime==null || row.updateTime=='' || row.updateTime==undefined">{{row.createTime}}</font>
                <font v-else>{{row.updateTime}}</font>
            </template>

            <!-- <template slot-scope="{row}" slot="videoUrl">
                <font v-if="row.videoUrl==null || row.videoUrl==undefined">-</font>
                <font v-else>{{row.videoUrl}}</font>
            </template> -->

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

        <!-- 添加设备 -->
        <el-dialog  title="添加设备信息" :visible.sync="addVisible" width="480px">
            <el-form :model="form" ref="form" label-width="115px" :rules="rules2" class="demo-ruleForm">
                <el-form-item label="校区名称:" prop='campusId'>
                    <el-select v-model="form.campusId" style="width:300px;margin-bottom:5px">
                        <el-option
                            v-for="item in campusList"
                            :key="item.id"
                            :label="'['+item.id+']'+item.campusName"
                            :value="item.id"
                            
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="设备名称:" prop="deviceName">
                    <el-input
                        v-model="form.deviceName"
                        placeholder="设备名称"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

                <el-form-item label="设备类型:">
                    <el-select v-model="form.deviceTypeId" style="width:300px;margin-bottom:5px">
                        <el-option
                            v-for="item in videoSortList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <!-- 图片 -->
                <el-form-item label="图片:" >
                    <el-input
                        v-model="form.file"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                
                <!-- 视频 -->
                <el-form-item label="视频资源:" >
                    <el-input
                        v-model="form.videoUrl"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button class="tableBtn" @click="addVisible = false">取 消</el-button>
                <el-button class="tableBtn" type="primary" @click="saveAdd('form')">确定</el-button>
            </span>
        </el-dialog>


        <!-- 修改数据 -->
        <el-dialog  title="修改设备信息" :visible.sync="updateVisible" width="480px">
            <el-form :model="form" ref="form" label-width="115px" :rules="rules2" class="demo-ruleForm">
                <el-form-item label="校区名称:" prop='campusId'>
                    <el-select v-model="form.campusId" disabled style="width:300px;margin-bottom:5px">
                        <el-option
                            v-for="item in campusList"
                            :key="item.id"
                            :label="item.campusName"
                            :value="item.id"
                            
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="设备名称:" prop="deviceName">
                    <el-input
                        v-model="form.deviceName"
                        placeholder="设备名称"
                        style="width:300px;margin-bottom:5px"
                        disabled
                    ></el-input>
                </el-form-item>

                <el-form-item label="设备类型:">
                    <el-select v-model="form.deviceTypeId" style="width:300px;margin-bottom:5px">
                        <el-option
                            v-for="item in videoSortList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <!-- 图片 -->
                <el-form-item label="图片:" >
                    <el-input
                        v-model="form.file"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                
                <!-- 视频 -->
                <el-form-item label="视频资源:" >
                    <el-input
                        v-model="form.videoUrl"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button class="tableBtn" @click="updateVisible = false">取 消</el-button>
                <el-button class="tableBtn" type="primary" @click="saveUpdate('form')">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:'video-manage',
    data() {
        return {
            psortVal:'',
            videoSortList:[],
            dataList:[],
            columns:[
                {
                    title:'id',
                    key: 'deviceId',
                    width:'60px',
                    align:'center'
                },{
                    title:'设备名称',
                    key: 'deviceName',
                    //  minWidth:'90px',
                    minWidth:120,
                    align:'center'
                },{
                    title:'设备分类',
                    slot: 'deviceTypeName',
                    //  minWidth:'90px',
                    minWidth:120,
                    align:'center'
                },{
                    title:'图片',
                    key: 'picUrl',
                    //  minWidth:'90px',
                    minWidth:150,
                    align:'center'
                },{
                    title:'视频',
                    key: 'videoUrl',
                    tooltip:'true',
                    minWidth:150,
                    align:'center'
                },{
                    title:'修改时间',
                    tooltip:'true',
                    slot: 'updateTime',
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
            campusList:[],//获取校区的数据列表
            campus:'',
            addVisible:false,
            updateVisible:false,
            form:{
                deviceId:'',
                deviceName:'',
                deviceTypeId:'',
                campusId:'',
                videoUrl:'',
                file:'',
                data:'',
                cameraView:'',
            },
            rules2:{
                deviceName:[
                    {required: true, message: '设备名称不能为空', trigger: 'blur'}
                ],
                campusId:[
                    {required: true, message: '校区名称不能为空', trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        this.getCampusList();
        // this.getVideoList();
    },
    methods: {
        //获得校区的数据列表
        getCampusList(){
            axios({
                url:this.$store.state.UrlIP+'/campus/getData',
                method:'get',
                params:{
                    pageIndex:'1',
                    pageSize:'10'
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
                    this.getVideoList();//获取监控列表的信息
                }
            }).catch(err=>{
                console.log(err);
            })
        },

        clickSub(){
            this.getVideoList();
        },
        getVideoList(){
            this.videoSortList=[];
            axios({
                url:this.$store.state.UrlIP+'/device/getData',
                method:'get',
                params:{
                    campusId:this.campus,
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    key:this.search,
                    deviceTypeId:this.psortVal
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
                        if (this.videoSortList.length==0) {
                            this.videoSortList.push({
                                id:item.deviceTypeId,
                                name:item.deviceTypeName
                            })
                        }else{
                            for(var i=0;i<this.videoSortList.length;i++){
                                if (this.videoSortList[i].id===item.deviceTypeId) {
                                    break;
                                }
                            }
                            if (i==this.videoSortList.length) {
                                this.videoSortList.push({
                                    id:item.deviceTypeId,
                                    name:item.deviceTypeName
                                })
                            }   
                        }
                    });
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        addInfo(){
            this.addVisible=true;
            this.form={
                deviceId:'',
                deviceName:'',
                deviceTypeId:'',
                campusId:'',
                videoUrl:'',
                file:'',
                data:'',
                cameraView:'',
            }
        },

        //添加监控数据
        saveAdd(name){
            this.$refs[name].validate((valid)=>{
                if (valid) {
                    axios({
                        url:this.$store.state.UrlIP+'/device/insertData',
                        method:'post',
                        params:{
                            deviceName:this.form.deviceName,
                            deviceTypeId:this.form.deviceTypeId,
                            campusId:this.form.campusId,
                            videoUrl:this.form.videoUrl,
                            file:this.form.file,
                            data:this.form.data,
                            // cameraView:this.form
                        },
                        headers:{
                            'Content-type':'application/x-www-form-urlencoded'
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
                            this.addVisible=false
                            this.getVideoList();
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
                    }).catch(error=>{
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
                }
            })
        },


        changePage(val){
            this.currentPage=val;
            this.getVideoList();
        },
        changePagesize(val){
            this.pageSize=val;
            this.getVideoList();
        },

        //修改设备信息
        updateInfo(row,index){
            console.log(row);
            this.updateVisible=true;
            this.form={
                deviceId:row.deviceId,
                deviceName:row.deviceName,
                deviceTypeId:row.deviceTypeId,
                campusId:row.campusId,
                videoUrl:row.videoUrl,
                file:row.file,
                data:row.data,
                cameraView:row.cameraView,
            }
        },
    },
}
</script>
<style scoped>
.ivu-icon-ios-apps{
    float: left !important;
    margin-top: 2px !important;
}
</style>