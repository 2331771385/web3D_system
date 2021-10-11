<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon  type="ios-apps" size='22'/>
            <span class="pageTitle">校区数据列表</span>
        </div>

        <!-- 搜索框 -->
        <div class='searchInput'>
            <div class="search-top">
                <!-- <span class="search-box-text">校区:</span>
                <Select v-model="search" 
                        style="width:200px" 
                        clearable
                        @on-clear='getCampusList'
                >
                    <Option v-for="item in publicSortList" :key="item.id" :value="item.id">{{item.name}}</Option>
                </Select> -->

                <span class="search-box-text">模糊查询:</span>
                <Input style="width:260px" 
                    v-model="search"
                    placeholder="校区名称，校区简称关键字"
                    clearable
                    @on-enter="clickSub"
                    @on-clear='getCampusList'
                    @on-change='getCampusList'
                />
                <Button type="primary" @click="getCampusList" icon="ios-search">查找</Button>
                <!-- <Button type="success" @click="addInfo" icon='ios-add'>新增</Button> -->
            </div>
        </div>


        <!-- 列表数据 -->
        <Table border :columns='columns' :data='campusList'>
            <template slot-scope="{row}" slot="city">
                [{{row.cityId}}] {{row.city}}
            </template>

            <!-- <template slot-scope="{row}" slot="updateTime">
                <font v-if="row.updateTime==null || row.updateTime=='' || row.updateTime==undefined">-</font>
                <font v-else>{{row.updateTime}}</font>
            </template> -->

            <template slot-scope="{row}" slot="campusShortName">
                <font v-if="row.campusShortName==null || row.campusShortName==undefined">-</font>
                <font v-else>{{row.campusShortName}}</font>
            </template>

            <!-- 显示图片信息 -->
            <template slot-scope="{ row }" slot="picUrl">
                <font>
                    <img class="item-imgs" :src="row.picUrl" />
                </font>
            </template>

            <!-- <template slot-scope="{row}" slot="shortDes">
                <font v-if="row.shortDes==null || row.shortDes==undefined">-</font>
                <font v-else>{{row.shortDes}}</font>
            </template>  -->

            <template slot-scope="{row}" slot="state">
                <font v-if="row.state==0" color='green'>正常</font>
                <font v-else-if="row.state==1" color='orange'>暂停</font>
                <font v-else color='red'>删除</font>
            </template>

            <template slot-scope="{row,index}" slot="action">
                <Button type="info" size='small' style="marginRight:5px" @click="updateInfo(row,index)">修改</Button>
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



        <!-- 修改操作 -->
        <el-dialog  title="修改校区信息" :visible.sync="updateVisible" width="480px">
            <el-form :model="form" ref="form" label-width="115px" class="demo-ruleForm">
                <el-form-item label="校区名称:" >
                    <el-select disabled v-model="form.campusId" style="width:300px;margin-bottom:5px">
                        <el-option
                            v-for="item in campusListAll"
                            :key="item.id"
                            :label="'['+item.id+']'+item.campusName"
                            :value="item.id"
                            disabled
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="所在城市:">
                    <el-input
                        v-model="form.cityName"
                        style="width:300px;margin-bottom:5px"
                        clearable
                        disabled
                    ></el-input>
                </el-form-item>

                <el-form-item label="校区简称:">
                    <el-input
                        v-model="form.campusShortName"
                        style="width:300px;margin-bottom:5px"
                        clearable
                    ></el-input>
                </el-form-item>

                <el-form-item label="校区描述:" >
                    <el-input
                        v-model="form.describe"
                        placeholder="校区描述"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                <el-form-item label="校区简介:">
                    <el-input
                        v-model="form.shortDes"
                        placeholder="校区简介"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
                </el-form-item>

                <el-form-item label="校区数据:">
                    <el-input
                        v-model="form.data"
                        placeholder="校区数据"
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
                <el-button class="tableBtn" type="primary" @click="saveAdd('form')">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:'campus-manage',
    data() {
        return {
            fileList:[],
            currentPage:'1',
            pageSize:'10',
            totalCount:0,
            search:'',
            campusId:'',
            dataType:'',
            campusList:[],//校园数据的列表
            campusListAll:[],
            updateVisible:false,
            //数据列表的形式
            columns:[
                {
                    title:'id',
                    key: 'campusId',
                    //  minWidth:'90px',
                    width:'60px',
                    align:'center'
                },{
                    title:'校区名称',
                    key: 'campusName',
                    //  minWidth:'90px',
                    width:'200px',
                    align:'center'
                },{
                    title:'名称简称',
                    slot: 'campusShortName',
                    //  minWidth:'90px',
                    width:100,
                    align:'center'
                },{
                    title:'所在城市',
                    slot: 'city',
                    //  minWidth:'90px',
                    minWidth:110,
                    align:'center'
                },{
                    title:'校区描述',
                    key: 'describe',
                    //  minWidth:'90px',
                    tooltip:'true',//开启后，文本将不换行
                    minWidth:180,
                    align:'center'
                },{
                    title:'校区简介',
                    key: 'shortDes',
                    //  minWidth:'90px',
                    tooltip:'true',//开启后，文本将不换行
                    minWidth:180,
                    align:'center'
                },
                // {
                //     title:'图标',
                //     key: 'iconUrl',
                //     tooltip:'true',
                //     minWidth:130,
                //     align:'center'
                // },
                {
                    title:'图片',
                    slot: 'picUrl',
                    minWidth:130,
                    tooltip:'true',
                    align:'center'
                },
                {
                    title:'校园链接',
                    key: 'webUrl',
                    tooltip:'true',
                    //  minWidth:'90px',
                    minWidth:140,
                    align:'center'
                },{
                    title:'状态',
                    slot: 'state',
                    //  minWidth:'90px',
                    width:'90px',
                    align:'center'
                },{
                    title:'操作',
                    width:'100px',
                    slot:'action',
                    align:'center'
                }
            ],

            //表单数据的修改
            form:{
                campusId:'',//校园id
                campusShortName:'',//校园简称
                data:'',//json数据的加载
                describe:"",//校区描述
                shortDes:'',//校区简介
                file:'',
                cityId:'',
                campusName:'',
                cityName:'',
                
            }
        }
    },
    created() {
        this.getCampusList();//获得校区数据
        this.getCampus();
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

        handleChange(file, fileList) {
            this.fileList = fileList.slice(-2);
        },
        /**
         * 获取校区信息
         */
        getCampus(){
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
                        this.campusListAll.push({
                            id:item.campusId,
                            campusName:item.campusName
                        })
                    });
                }
            }).catch(err=>{
                console.log(err);
            })
        },

        getCampusList(){
            axios({
                url:this.$store.state.UrlIP+'/campus/getData',
                method:'get',
                params:{
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    key:this.search,
                    campusId:this.campusId,
                    token: window.localStorage.getItem('Authorization')
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    this.campusList=res.data.data;
                    this.campusList.forEach(item => {
                        console.log(item);
                        item.picUrl = `http://202.194.14.204:8082${item.picUrl}`
                    })
                    this.totalCount=res.data.respPage.totalCount
                }
            }).catch(error=>{
                console.log(error);
            })
        },
        clickSub(){
            this.getCampusList();
        },

        //修改操作
        updateInfo(row,index){
            this.updateVisible=true;
            this.form={
                campusId:row.campusId,//校园id
                campusShortName:row.campusShortName,//校园简称
                data:row.data,//json数据的加载
                describe:row.describe,//校区描述
                shortDes:row.shortDes,//校区简介
                file:row.picUrl,
                cityId:row.cityId,
                campusName:row.campusName,
                cityName:row.city
            }
        },

        //修改的确认操作
        saveAdd(){
            let formData = new FormData();
            formData.append('campusId', this.form.campusId);
            formData.append('shortDes', this.form.shortDes);
            formData.append('describe', this.form.describe);
            formData.append('campusShortName', this.form.campusShortName);
            formData.append('file',this.$refs.fileType.files[0]);
            formData.append('token', window.localStorage.getItem('Authorization'));
            formData.append('data', this.form.data);

            axios({
                url: this.$store.state.UrlIP+'/campus/updateData',
                method: 'post',
                data: formData,
                headers: {
                    'Content-type':'multipart/form-data'
                }
            }).then(res => {
                if (res.data.code==0) {
                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message:
                            "<span style='font-size: 20px;margin-left: 20px'>操作成功！</span>",
                        type: "success",
                        customClass: "zZindex",
                    });
                    this.updateVisible = false;
                    this.getCampusList();
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
        },

        changePage(val){
            this.currentPage=val;
            this.getCampusList();
        },
        changePagesize(val){
            this.pageSize=val;
            this.getCampusList();
        },
       
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
.item-imgs{
    width: 20px;
    height: 20px;
}
.page-footer{
    margin-top: 25px;
    right: 0px;
    position: absolute;
}
</style>
