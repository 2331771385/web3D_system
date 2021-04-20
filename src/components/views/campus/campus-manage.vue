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
                <Input style="width:auto" 
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

            <template slot-scope="{row}" slot="updateTime">
                <font v-if="row.updateTime==null || row.updateTime=='' || row.updateTime==undefined">-</font>
                <font v-else>{{row.updateTime}}</font>
            </template>

            <template slot-scope="{row}" slot="campusShortName">
                <font v-if="row.campusShortName==null || row.campusShortName==undefined">-</font>
                <font v-else>{{row.campusShortName}}</font>
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


                <el-form-item label="校区简称:">
                    <el-input
                        v-model="form.campusShortName"
                        style="width:300px;margin-bottom:5px"
                        clearable
                        disabled
                    ></el-input>
                </el-form-item>

                <el-form-item label="所在城市:">
                    <el-input
                        v-model="form.cityName"
                        style="width:300px;margin-bottom:5px"
                        clearable
                        disabled
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


                <!-- 图片 -->
                <el-form-item label="图片:" >
                    <el-input
                        v-model="form.file"
                        style="width:300px;margin-bottom:5px"
                    ></el-input>
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
                    title:'校区名称简称',
                    slot: 'campusShortName',
                    //  minWidth:'90px',
                    minWidth:150,
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
        /**
         * 获取校区信息
         */
        getCampus(){
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
                        this.campusListAll.push({
                            id:item.campusId,
                            campusName:item.campusName
                        })
                    });
                    // this.campus=6;
                    // this.getPublicList();//获取公共服务的数据
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
                    campusId:this.campusId
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                console.log(res.data.data);
                if (res.data.code==0) {
                    this.campusList=res.data.data;
                    this.totalCount=res.data.respPage.totalCount
                }
            }).catch(error=>{
                console.log(error);
            })
        },
        clickSub(){

        },

        //修改操作
        updateInfo(row,index){
            this.updateVisible=true;
            console.log(row);
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
            axios({
                url:this.$store.state.UrlIP+'/campus/updateData',
                method:'post',
                params:{
                    campusId:this.form.campusId,
                    shortDes:this.form.shortDes,
                    describe:this.form.describe,
                    campusShortName:this.form.campusShortName,
                    file:this.form.file,
                    data:this.form.data
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

        //停用操作
        deleteInfo(){},
        //启用操作
        startInfo(){},
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

</style>