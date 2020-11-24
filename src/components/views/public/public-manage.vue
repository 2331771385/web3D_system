<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon  type="ios-apps" size='22'/>
            <p class="pageTitle">公共服务数据列表</p>
        </div>
        <!-- 搜索框 -->
        <div class='searchInput'>
            <div class="search-top">
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
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:'public-manage',
    data() {
        return {
            psortVal:'',
            publicSortList:[],
            dataList:[],
            columns:[
                {
                    title:'id',
                    key: 'serviceId',
                    //  minWidth:'90px',
                    width:'100px',
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
                    width:'150px',
                    align:'center'
                },{
                    title:'简介',
                    key: 'shortDes',
                    //  minWidth:'90px',
                    tooltip:'true',//开启后，文本将不换行
                    width:'300px',
                    align:'center'
                },{
                    title:'图标',
                    key: 'iconUrl',
                    width:'200px',
                    align:'center'
                },{
                    title:'图片',
                    key: 'picUrl',
                    width:'200px',
                    align:'center'
                },{
                    title:'修改时间',
                    slot: 'updateTime',
                    //  minWidth:'90px',
                    width:'160px',
                    align:'center'
                },{
                    title:'状态',
                    slot: 'state',
                    //  minWidth:'90px',
                    width:'100px',
                    align:'center'
                },{
                    title:'操作',
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
    watch: {
        psortVal:function(newVal,old){
            this.psortVal=newVal;
        }
    },
    created() {
        this.getPublicList();
    },
    methods: {
        getPublicList(){
            this.publicSortList=[];
            axios({
                url:this.$store.state.UrlIP+'/publicService/getData',
                method:'get',
                params:{
                    campusId:'6',
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
        addInfo(){},
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
        
    },
}
</script>
<style scoped>
.ivu-icon-ios-apps{
    float: left;
    margin-top: 2px;
}
</style>