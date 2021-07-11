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
                <el-select v-model="campus" style="width:200px" clearable>
                    <el-option v-for="item in campusList" :key="item.id" :label="item.campusName" :value="item.id"></el-option>
                </el-select>

                <span class="search-box-text">设备分类:</span>
                <el-select v-model="psortVal" style="width:200px">
                    <el-option v-for="item in videoSortList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <span class="search-box-text">模糊查询:</span>
                <Input style="width:260px" 
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
            <!-- <template slot-scope="{row}" slot="updateTime">
                <font v-if="row.updateTime==null || row.updateTime=='' || row.updateTime==undefined">{{row.createTime}}</font>
                <font v-else>{{row.updateTime}}</font>
            </template> -->

            <template slot-scope="{row}" slot="picUrl">
                <font>
                    <img :src="row.picUrl" class="item-imgs"/>
                </font>
            </template>

            <template slot-scope="{row}" slot="videoUrl">
                <font v-if="row.videoUrl==null || row.videoUrl==undefined">-</font>
                <font v-else>
                    <a class="item-a" :href="row.videoUrl" target="_blank">
                        {{row.videoUrl}}
                    </a>
                </font>
            </template>

            <template slot-scope="{row}" slot="state">
                <font v-if="row.state==0" color='green'>正常</font>
                <font v-else-if="row.state==1" color='orange'>暂停</font>
                <font v-else color='red'>删除</font>
            </template>

            <template slot-scope="{row,index}" slot="action">
                <Button type="info" size='small' style="marginRight:5px" @click="updateInfo(row,index)">修改</Button>
                <Button type="error" size='small' style="marginRight:5px" @click="deleteInfo(row,index)">删除</Button>
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

                <el-form-item label="设备类型:" prop="deviceTypeId">
                    <el-select v-model="form.deviceTypeId" style="width:300px;margin-bottom:5px">
                        <el-option
                            v-for="item in videoSortList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <!-- 视频 -->
                <el-form-item label="视频资源:" >
                    <el-input
                        v-model="form.videoUrl"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                <!-- 添加的数据 -->
                <el-form-item label="设备数据:" >
                    <el-input
                        v-model="form.data"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                <!-- 跳转的角度 -->
                <el-form-item label="跳转角度:" >
                    <el-input
                        v-model="form.cameraView"
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
                
                <!-- 视频 -->
                <el-form-item label="视频资源:" >
                    <el-input
                        v-model="form.videoUrl"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                <!-- 添加的数据 -->
                <el-form-item label="设备数据:" >
                    <el-input
                        v-model="form.data"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                <!-- 跳转的角度 -->
                <el-form-item label="跳转角度:" >
                    <el-input
                        v-model="form.cameraView"
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
            msg: '',
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
                    slot: 'picUrl',
                    //  minWidth:'90px',
                    width: 90,
                    align:'center'
                },{
                    title:'位置',
                    key: 'position',
                    tooltip:'true',
                    width: 130,
                    align:'center'
                },{
                    title:'视频链接',
                    key: 'videoUrl',
                    tooltip:'true',
                    minWidth: 150,
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
                ],
                deviceTypeId:[
                    {required: true, message: '设备类型不能为空', trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        this.getCampusList();
        // this.getVideoList();
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
        //获得校区的数据列表
        getCampusList(){
            axios({
                url:this.$store.state.UrlIP+'/campus/getData',
                method:'get',
                params:{
                    pageIndex:'1',
                    pageSize:'10',
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
                    deviceTypeId:this.psortVal,
                    token: window.localStorage.getItem('Authorization')
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    console.log(res.data.data);
                    this.dataList=res.data.data;
                    this.dataList.forEach(item => {
                        item.picUrl = `http://211.87.231.41:8089${item.picUrl}`;
                    })
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
                    let formData = new FormData();
                    formData.append('campusId', this.form.campusId);
                    formData.append('deviceName', this.form.deviceName);
                    formData.append('deviceTypeId', this.form.deviceTypeId);
                    formData.append('videoUrl', this.form.videoUrl);
                    formData.append('cameraView', this.form.cameraView);
                    formData.append('file',this.$refs.fileType.files[0]);
                    formData.append('data', this.form.data);
                    formData.append('token', window.localStorage.getItem('Authorization'));
                    axios({
                        url:this.$store.state.UrlIP+'/device/insertData',
                        method:'post',
                        data: formData,
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
            this.msg = row;
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
        // 修改
        saveUpdate(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let formData = new FormData();
                    formData.append('campusId', this.form.campusId);
                    formData.append('deviceName', this.form.deviceName);
                    formData.append('deviceTypeId', this.form.deviceTypeId);
                    formData.append('videoUrl', this.form.videoUrl);
                    formData.append('cameraView', this.form.cameraView);
                    formData.append('data', this.form.data);
                    formData.append('file',this.$refs.fileType.files[0]);
                    formData.append('token', window.localStorage.getItem('Authorization'));
                    formData.append('deviceId', this.msg.deviceId)
                    axios({
                        url: this.$store.state.UrlIP + '/device/updateData',
                        method: 'post',
                        data: formData,
                        headers:{
                            'Content-type':'multipart/form-data'
                        }
                    }).then(res => {
                        if (res.data.code == 0) {
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message:
                                    "<span style='font-size: 20px;margin-left: 20px'>操作成功！</span>",
                                type: "success",
                                customClass: "zZindex",
                            });
                            this.updateVisible = false;
                            this.getVideoList();
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
                    }).catch(err => {
                        this.$message({
                            dangerouslyUseHTMLString: true,
                            message:
                            "<span style='font-size: 20px;margin-left: 20px'>系统错误！</span>",
                            type: "error",
                            customClass: "zZindex",
                        });
                    })
                } else {
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

        // 删除操作
        deleteInfo(row, index) {
            this.$Modal.confirm({
                title: '注意',
                content: '是否删除该设备及其相关信息？',
                onOk: () => {
                    this.handleDelete(row.deviceId);
                },
                onCancel: () => {
                    this.$Message.info('取消删除');
                }
            });
        },
        handleDelete(deviceId) {
            this.$axios({
                url: this.$store.state.UrlIP + '/device/updateData',
                method: 'post',
                params: {
                    deviceId,
                    state: 1,
                    token: window.localStorage.getItem('Authorization')
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
                    this.getVideoList();
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
.item-imgs {
    width: 20px;
    height: 20px;
}
.item-a {
    width: 100px;
}
</style>
<style>
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