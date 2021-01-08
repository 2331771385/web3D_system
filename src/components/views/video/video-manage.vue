<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon  type="ios-apps" size='22'/>
            <p class="pageTitle">公共服务数据列表</p>
        </div>
        <!-- 搜索框 -->
        <div class='searchInput'>
            <div class="search-top">
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
                    width:'100px',
                    align:'center'
                },{
                    title:'设备名称',
                    key: 'deviceName',
                    //  minWidth:'90px',
                    width:'150px',
                    align:'center'
                },{
                    title:'设备分类',
                    slot: 'deviceTypeName',
                    //  minWidth:'90px',
                    width:'150px',
                    align:'center'
                },{
                    title:'图片',
                    key: 'picUrl',
                    //  minWidth:'90px',
                    width:'200px',
                    align:'center'
                },{
                    title:'视频',
                    key: 'videoUrl',
                    tooltip:'true',
                    width:'250px',
                    align:'center'
                },{
                    title:'修改时间',
                    slot: 'updateTime',
                    //  minWidth:'90px',
                    width:'180px',
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
        this.getVideoList();
    },
    methods: {
        clickSub(){
            this.getVideoList();
        },
        getVideoList(){
            this.videoSortList=[];
            axios({
                url:this.$store.state.UrlIP+'/device/getData',
                method:'get',
                params:{
                    campusId:'6',
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
        addInfo(){},
        changePage(val){
            this.currentPage=val;
            this.getVideoList();
        },
        changePagesize(val){
            this.pageSize=val;
            this.getVideoList();
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