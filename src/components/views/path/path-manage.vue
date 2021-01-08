<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon  type="ios-apps" size='22'/>
            <span class="pageTitle">路径数据列表</span>
        </div>
        <!-- 搜索框 -->
        <div class='searchInput'>
            <div class="search-top">
                <!-- <span class="search-box-text">公共服务分类:</span>
                <Select v-model="psortVal" style="width:200px">
                    <Option v-for="item in pathSortList" :key="item.id" :label="item.name" :value="item.id"></Option>
                </Select> -->
                <span class="search-box-text">模糊查询:</span>
                <Input style="width:auto" 
                    v-model="search"
                    placeholder="公共服务名称、类型名称关键字"
                    clearable
                    @on-enter="clickSub"
                    @on-clear='getPathList'
                    @on-change='getPathList'
                />
                <Button type="primary" @click="getPathList" icon="ios-search">查找</Button>
                <Button type="success" @click="addInfo" icon='ios-add'>新增</Button>
            </div>
        </div>
        <!-- 列表数据 -->
        <Table border :columns='columns' :data='dataList'>
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
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:'path-manage',
    data() {
        return {
            dataList:[],
            columns:[
                {
                    title:'id',
                    key: 'pathId',
                    //  minWidth:'90px',
                    width:'100px',
                    align:'center'
                },{
                    title:'路径名称',
                    key: 'pathName',
                    //  minWidth:'90px',
                    width:'150px',
                    align:'center'
                },{
                    title:'修改时间',
                    key: 'updateTime',
                     minWidth:100,
                    // width:'160px',
                    align:'center'
                },{
                    title:'状态',
                    slot: 'state',
                    //  minWidth:'90px',
                    width:'100px',
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
            search:''
        
        }
    },
    created() {
        this.getPathList();
    },
    methods: {
        clickSub(){
            this.getPathList();
        },
        /**
         * 获取路径信息
         */
        getPathList(){
            axios({
                url:this.$store.state.UrlIP+'/path/getData',
                method:'get',
                params:{
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    campusId:'6',
                    key:this.search,
                    pathId:''
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    console.log(res.data.data);
                    this.dataList=res.data.data;
                    this.totalCount=res.data.respPage.totalCount
                }
            }).catch(err=>{
                console.log(err);
            })
        },

        addInfo(){},
        changePage(val){
            this.currentPage=val;
            this.getPathList();
        },
        changePagesize(val){
            this.pageSize=val;
            this.getPathList();
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