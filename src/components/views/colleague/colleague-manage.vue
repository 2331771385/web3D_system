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
                <Select v-model="campus" style="width:200px" clearable>
                    <Option v-for="item in campusList" :key="item.id" :label="item.campusName" :value="item.id"></Option>
                </Select>

                <!-- <span class="search-box-text">设备分类:</span>
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
                />-->
                <Button type="primary" @click="getColleagueList" icon="ios-search">查找</Button>
                <!-- <Button type="success" @click="addInfo" icon='ios-add'>新增</Button>  -->
            </div>
        </div>

        <Table border :columns='columns' :data='collegeList'>
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

    </div>
</template>
<script>
import axios from 'axios';
export default {
    name:'colleague-manage',
    data() {
        return {
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
                    width:'140px',
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
                },{
                    title:'学院图片',
                    key: 'picUrl',
                    //  minWidth:'90px',
                    tooltip:'true',
                    minWidth:120,
                    align:'center',
                },{
                    title:'宣传链接',
                    key: 'videoUrl',
                    tooltip:'true',
                    //  minWidth:'90px',
                    minWidth:120,
                    align:'center',
                },{
                    title:'学院链接',
                    key: 'webUrl',
                    tooltip:'true',
                    //  minWidth:'90px',
                    minWidth:120,
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
        }
    },
    created() {
        this.getCampusList();
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
                },
                headers:{
                    'Content-type':'application-x-www-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    console.log(res.data.data);
                    this.collegeList=res.data.data;
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
</style>