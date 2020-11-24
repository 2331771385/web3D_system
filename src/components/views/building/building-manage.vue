<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon  type="ios-apps" size='22'/>
            <p class="pageTitle">建筑数据列表</p>
        </div>
        <!-- 搜索框 -->
        <div class='searchInput'>
            <div class="search-top">
                <span class="search-box-text">建筑分类:</span>
                <Select v-model="bsortVal" style="width:200px">
                    <Option v-for="item in buildingSortList" :key="item.id" :label="item.name" :value="item.id"></Option>
                </Select>
                <span class="search-box-text">模糊查询:</span>
                <Input style="width:auto" 
                    v-model="search"
                    placeholder="建筑名称、类型名称关键字"
                    clearable
                    @on-enter="clickSub"
                    @on-clear='getBuildingList'
                    @on-change='getBuildingList'
                />
                <Button type="primary" @click="getBuildingList" icon="ios-search">查找</Button>
                <Button type="success" @click="addInfo" icon='ios-add'>新增</Button>
            </div>
        </div>

        <!-- 列表数据展示 -->
        <Table border :columns='columns' :data='dataList'>
            <template slot-scope="{row}" slot="buildTypeName">
                [{{row.buildTypeId}}] {{row.buildTypeName}}
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
import axios from 'axios';
import vDialog from '../../dialog/building-dialog.vue'
export default {
    name:'building-manage',
    components:{
        vDialog
    },
    data() {
        return {
            bsortVal:'',
            buildingSortList:[],
            dataList:[],
            columns:[
                {
                    title:'id',
                    key: 'buildId',
                    //  minWidth:'90px',
                    width:'100px',
                    align:'center'
                },{
                    title:'建筑名称',
                    key: 'buildName',
                    //  minWidth:'90px',
                    width:'150px',
                    align:'center'
                },{
                    title:'建筑分类',
                    slot: 'buildTypeName',
                    //  minWidth:'90px',
                    width:'150px',
                    align:'center'
                },{
                    title:'建筑简介',
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
                    title:'修改时间',
                    key: 'updateTime',
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
    created() {
        this.getBuildingList();
    },
    methods: {
        clickSub(){
            this.getBuildingList();
        },
        /**
         * 获取建筑物的列表数据
         */
        getBuildingList(){
            this.buildingSortList=[];
            axios({
                url:this.$store.state.UrlIP+'/building/getData',
                method:'get',
                params:{
                    campusId:'6',
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    key:this.search,
                    buildTypeId:this.bsortVal
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    this.dataList=res.data.data;
                    this.totalCount=res.data.respPage.totalCount
                    res.data.data.forEach(item => {
                        if (this.buildingSortList.length==0) {
                            this.buildingSortList.push({
                                id:item.buildTypeId,
                                name:item.buildTypeName
                            })
                        }else{
                            for(var i=0;i<this.buildingSortList.length;i++){
                                if (this.buildingSortList[i].id===item.buildTypeId) {
                                    break;
                                }
                            }
                            if (i==this.buildingSortList.length) {
                                this.buildingSortList.push({
                                    id:item.buildTypeId,
                                    name:item.buildTypeName
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
        /**
         * 改变页码
         */
        changePage(val){
            this.currentPage=val;
            this.getBuildingList();
        },
        /**
         * 改变页数
         */
        changePagesize(val){
            this.pageSize=val;
            this.getBuildingList();
        }

    },
}
</script>
<style scoped>
.ivu-icon-ios-apps{
    float: left;
    margin-top: 2px;
}
</style>