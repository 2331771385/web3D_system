<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon  type="ios-apps" size='22'/>
            <p class="pageTitle">学院数据列表</p>
        </div>

        <!-- 搜索框 -->
        <div class='searchInput'>
            <div class="search-top">

                <span class="search-box-text">校区:</span>
                <el-select v-model="campus" style="width:200px" clearable>
                    <el-option v-for="item in campusList" :key="item.id" :label="item.campusName" :value="item.id"></el-option>
                </el-select>

                <!-- <span class="search-box-text">设备分类:</span>
                <Select v-model="psortVal" style="width:200px">
                    <Option v-for="item in videoSortList" :key="item.id" :label="item.name" :value="item.id"></Option>
                </Select>--> 
                <!-- <span class="search-box-text">模糊查询:</span> -->
                <Input style="width:auto" 
                    v-model="search"
                    placeholder="学院名称关键字"
                    clearable
                    @on-enter="clickSub"
                    @on-clear='getColleagueList'
                    @on-change='getColleagueList'
                />
                <Button type="primary" @click="getColleagueList" icon="ios-search">查找</Button>
                <Button type="success" @click="addInfo" icon='ios-add'>新增</Button> 
            </div>
        </div>

        <Table border :columns='columns' :data='collegeList'>
            <template slot-scope="{row}" slot="updateTime">
                <font v-if="row.updateTime==null || row.updateTime=='' || row.updateTime==undefined">-</font>
                <font v-else>{{row.updateTime}}</font>
            </template>

            <!-- 给表格中的某一列添加超链接 -->
            <template slot-scope="{row}" slot="webUrl">
                <font v-if="row.webUrl"><a :href='row.webUrl'>{{row.webUrl}}</a></font>
            </template>

            <!-- 显示图片信息 -->
            <template slot-scope="{ row }" slot="picUrl">
                <font>
                    <img class="item-imgs" :src="row.picUrl" />
                </font>
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

    <!-- 添加数据 -->
        <el-dialog  title="新增学院信息" :visible.sync="addVisible" width="480px">
            <el-form :model="form" ref="form" label-width="115px" :rules = 'rules'      class="demo-ruleForm">
                <el-form-item label="校区名称:" >
                    <el-select v-model="form.campusId" style="width:300px;margin-bottom:5px">
                        <el-option
                            v-for="item in campusList"
                            :key="item.id"
                            :label="'['+item.id+']'+item.campusName"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="学院名称:" prop="collegeName">
                    <el-input
                        v-model="form.collegeName"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                <el-form-item label="学院描述:" >
                    <el-input
                        v-model="form.descripe"
                        placeholder="学院描述"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

                <el-form-item label="学院简介:">
                    <el-input
                        v-model="form.shortDes"
                        placeholder="学院简介"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

                <el-form-item label="学院链接:">
                    <el-input
                        v-model="form.webUrl"
                        placeholder="学院链接"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

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
        <el-dialog  title="修改学院信息" :visible.sync="updateVisible" width="480px">
            <el-form :model="form" ref="form" label-width="115px" class="demo-ruleForm">
                <el-form-item label="校区名称:" >
                    <el-select disabled v-model="form.campusId" style="width:300px;margin-bottom:5px">
                        <el-option
                            v-for="item in campusList"
                            :key="item.id"
                            :label="'['+item.id+']'+item.campusName"
                            :value="item.id"
                            disabled
                        ></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="学院名称:">
                    <el-input
                        v-model="form.collegeName"
                        style="width:300px;margin-bottom:5px"
                        disabled
                    ></el-input>
                </el-form-item>

                <el-form-item label="学院描述:" >
                    <el-input
                        v-model="form.descripe"
                        placeholder="学院描述"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

                <el-form-item label="学院简介:">
                    <el-input
                        v-model="form.shortDes"
                        placeholder="学院简介"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

                <el-form-item label="学院链接:">
                    <el-input
                        v-model="form.webUrl"
                        placeholder="学院链接"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>
                
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
export default {
    name:'colleague-manage',
    data() {
        return {
            fileList:[],
            search:'',
            campus:'',
            campusList:[],
            currentPage:'1',
            pageSize:'10',
            totalCount:0,
            collegeList:[],
            columns:[
                {
                    title:'id',
                    key: 'collegeId',
                    width:'60px',
                    align:'center'
                },{
                    title:'学院名称',
                    key: 'collegeName',
                    //  minWidth:'90px',
                    minWidth:230,
                    align:'center'
                },{
                    title:'学院描述',
                    key: 'describe',
                    tooltip:'true',
                    //  minWidth:'90px',
                    minWidth:130,
                    align:'center',
                },{
                    title:'学院简介',
                    key: 'shortDes',
                    //  minWidth:'90px',
                    tooltip:'true',//开启后，文本将不换行
                    minWidth:130,
                    align:'center',
                },
                {
                    title:'学院图片',
                    slot: 'picUrl',
                    //  minWidth:'90px',
                    tooltip:'true',
                    minWidth:120,
                    align:'center',
                },
                {
                    title:'学院链接',
                    slot: 'webUrl',
                    tooltip:'true',
                    minWidth: 90,
                    align:'center',
                },{
                    title:'修改时间',
                    tooltip:'true',
                    slot: 'updateTime',
                    //  minWidth:'90px',
                    width:'110px',
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
            updateVisible:false,
            msg:'',
            index:'',
            form:{
                campusId:'',
                collegeName:'',
                descripe:'',
                shortDes:'',
                webUrl:'',//学院连接
                file:'',//图片上传
                videoUrl:''
            },
            addVisible: false,
            rules:{
                collegeName: [
                    { required: true, message: '学院名称不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getCampusList();
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

        addInfo() {
            this.addVisible = true;
            this.form = {
                campusId:'',
                collegeName:'',
                descripe:'',
                shortDes:'',
                webUrl:'',//学院连接
                file:'',//图片上传
                videoUrl:''
            };
        },
        
        saveAdd() {
            this.$refs['form'].validate((valid)=>{
                if (valid) {
                    let formData = new FormData();
                    formData.append('campusId', this.form.campusId);
                    formData.append('collegeName', this.form.collegeName);
                    formData.append('shortDes', this.form.shortDes);
                    formData.append('webUrl', this.form.webUrl);
                    formData.append('file',this.$refs.fileType.files[0]);
                    formData.append('token', window.localStorage.getItem('Authorization'));
                    axios({
                        url: this.$store.state.UrlIP + '/college/insertData',
                        method: "post",
                        data: formData,
                        headers: {
                            "Content-type": "multipart/form-data",
                        },
                    }).then(res => {
                       if (res.data.code==0) {
                            this.$Message['success']({
                                background: true,
                                content:'操作成功！'
                            })
                            this.getColleagueList();
                            this.addVisible=false;
                        }
                    }).catch(err => {
                        this.addVisible=false;
                    })
                }
            })
        },

        /**
         * 修改学院数据
         */
        updateInfo(row,index){
            this.index = index;
            this.msg=row;
            this.updateVisible=true;
            this.form={
                campusId:this.msg.campusId,
                collegeName:this.msg.collegeName,
                descripe:this.msg.describe,
                shortDes:this.msg.shortDes,
                webUrl:this.msg.webUrl,//学院连接
                file:this.msg.picUrl,//图片上传
            }
        },

        /**
         * 修改操作
         */
        saveUpd(){
            this.$refs['form'].validate((valid)=>{
                if (valid) {
                    let formData = new FormData();
                    formData.append('collegeId', this.msg.collegeId);
                    formData.append('campusId', this.form.campusId);
                    formData.append('collegeName', this.form.collegeName);
                    formData.append('shortDes', this.form.shortDes);
                    formData.append('webUrl', this.form.webUrl);
                    formData.append('file',this.$refs.fileType.files[0]);
                    formData.append('token', window.localStorage.getItem('Authorization'));
                    axios({
                        url: this.$store.state.UrlIP + '/college/updateData',
                        method: "post",
                        data: formData,
                        headers: {
                            "Content-type": "multipart/form-data",
                        },
                    }).then(res => {
                       if (res.data.code==0) {
                            this.$Message['success']({
                                background: true,
                                content:'操作成功！'
                            })
                            this.getColleagueList();
                            this.updateVisible=false;
                        }
                    }).catch(err => {
                        this.updateVisible=false;
                    })
                }
            })
        },
        
        /**
         * 改变页码
         */
        changePage(val){
            this.currentPage=val;
            this.getColleagueList();
        },
        /**
         * 改变页数
         */
        changePagesize(val){
            this.pageSize=val;
            this.getColleagueList();
        },

        clickSub(){
            this.getColleagueList();
        },
        //获得校区的数据列表
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
                    this.getColleagueList();//获取学院信息
                }
            }).catch(err=>{
                console.log(err);
            })
        },

        //获得学院信息
        getColleagueList(){
            axios({
                url:this.$store.state.UrlIP+'/college/getData',
                method:'get',
                params:{
                    campusId:this.campus,
                    pageSize:this.pageSize,
                    pageIndex:this.currentPage,
                    key:this.search
                },
                headers:{
                    'Content-type':'application-x-www-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    this.collegeList=res.data.data;
                    this.collegeList.forEach(item => {
                        item.picUrl = `http://211.87.231.41:8089${item.picUrl}`;
                    })
                    this.totalCount=res.data.respPage.totalCount
                }
            }).catch(error=>{

            })
        },
    },
}
</script>
<style scoped>
.ivu-icon-ios-apps{
    float: left !important;
    margin-top: 2px !important;
}
a{
    color: #000000a8;
}
.upload-demo{
    text-align: left;
    margin-left: 10px;
}
.item-imgs{
    width: 20px;
    height: 20px;
}
</style>