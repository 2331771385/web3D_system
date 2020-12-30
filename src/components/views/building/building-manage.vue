<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon  type="ios-apps" size='22'/>
            <p class="pageTitle">建筑数据列表</p>
        </div>
        <!-- 搜索框 -->
        <div class='searchInput'>
            <div class="search-top">
                <span class="search-box-text">校区:</span>
                <Select v-model="campus" style="width:200px" clearable>
                    <Option v-for="item in campusList" :key="item.id" :label="item.campusName" :value="item.id"></Option>
                </Select>

                <span class="search-box-text">建筑分类:</span>
                <Select v-model="bsortVal" style="width:200px" clearable>
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
            <template slot-scope="{row}" slot="updateTime">
                <font v-if="row.updateTime==null || row.updateTime==undefined">-</font>
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
                    <Button type="error" size='small' style="marginRight:5px" @click="deleteInfo(row,index)">删除</Button>
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
        <template v-if="updBuilding">
            <v-dialog
                :updVisible='updVisible'
                :updRow='form'
                :updBuilding='updBuilding'
                :buildingSort='buildingSortList'
                :campusListArr='campusList'
                @cancelUpd='cancelUpd'
                @updSuccess='updSuccess'
            >

            </v-dialog>
        </template>
        

        <!-- 添加操作 -->
        <template v-if="addBuilding">
            <v-dialog
                :addVisible='addVisible'
                :addRow='form'
                :addBuilding='addBuilding'
                :addBuildingSort="buildingSortList"
                :campusList='campusList'
                @addSuccess='addSuccess'
                @cancelAdd='cancelAdd'
            >

            </v-dialog>
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
            campus:'',
            bsortVal:'',
            buildingSortList:[],
            dataList:[],
            campusList:[],
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
                    title:'校区名称',
                    key: 'campusName',
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
                    title:'建筑描述',
                    key: 'describe',
                    tooltip:'true',
                    //  minWidth:'90px',
                    width:'300px',
                    align:'center'
                },{
                    title:'建筑简介',
                    key: 'shortDes',
                    //  minWidth:'90px',
                    tooltip:'true',//开启后，文本将不换行
                    width:'150px',
                    align:'center'
                },{
                    title:'图标',
                    key: 'iconUrl',
                    width:'200px',
                    align:'center'
                },{
                    title:'修改时间',
                    slot: 'updateTime',
                    //  minWidth:'90px',
                    
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
            search:'',
            msg:'',
            updVisible:false,
            addBuilding:false,
            addVisible:false,
            updBuilding:false,
            form:{
                des:'',
                buildName:'',
                file:'',
                buildType:'',
                buildId:'',
                shortDes:'',
                campusId:'',
                buildTypeId:''
            }
        }
    },
    created() {
        // this.getBuildingSort();
        this.getCampusList();
    },
    methods: {
        clickSub(){
            this.getBuildingList();
        },
        /**
         * 获取建筑物的列表数据
         */
        getBuildingList(){
            if (this.campus==undefined || this.campus==null || this.campus=='') {
                this.$Message['warning']({
                        background: true,
                        content:'请先选择校区！'
                    });
                    this.dataList=[];
                return;
            }
            axios({
                url:this.$store.state.UrlIP+'/building/getData',
                method:'get',
                params:{
                    campusId:this.campus,
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
                    this.totalCount=res.data.respPage.totalCount;
                    res.data.data.forEach(item=>{
                        this.campusList.forEach(ele=>{
                            if (ele.id==item.campusId) {
                                item.campusName=ele.campusName;
                            }
                        })
                    });
                    this.dataList=res.data.data;
                }
            }).catch(err=>{
                console.log(err);
            })
        },

        /**
         * 获取校区信息
         */
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
                    this.getBuildingList();
                    this.getBuildingSort();
                }
            }).catch(err=>{
                console.log(err);
            })
        },

        addInfo(){
            this.addBuilding=true;
            this.form={
                des:'',
                buildName:'',
                file:'',
                buildType:'',
                shortDes:'',    
                buildId:'',
                campusId:'',
                buildTypeId:''
            };
            this.addVisible=true;
        },
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
        },
        updateInfo(row,index){
            this.msg=row;
            this.index=index;
            this.form={
                des:this.msg.describe,
                buildName:this.msg.buildName,
                buildId:this.msg.buildId,
                file:'',
                buildType:this.msg.buildTypeName,
                shortDes:this.msg.shortDes,
                campusId:this.msg.campusId,
                buildTypeId:this.msg.buildTypeId
            };
            this.updVisible=true;
            this.updBuilding=true;
        },

        //获取建筑分类
        getBuildingSort(){
            axios({
                url:this.$store.state.UrlIP+'/building/getTypeData',
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
                        this.buildingSortList.push({
                            id:item.buildTypeId,
                            name:item.buildTypeName
                        })
                    })
                    
                }
            }).catch(error=>{
                console.log(error);
            })
        },
        /**
         * 添加建筑信息
         */
        addSuccess(data){
            axios({
                url:this.$store.state.UrlIP+'/building/insertData',
                method:'post',
                params:{
                    buildTypeId:data.buildTypeId,
                    campusId:data.campusId,
                    buildName:data.buildName,
                    shortDes:data.shortDes,
                    describe:data.des,
                    file:'',
                    token:'886a'
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    this.$Message['success']({
                        background: true,
                        content:'操作成功！'
                    })
                    this.getBuildingList();
                    this.addVisible=false;
                    this.addBuilding=false;
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        cancelAdd(){
            this.addVisible=false;
            this.addBuilding=false;
        },
        cancelUpd(){
            this.updVisible=false;
            this.updBuilding=false;
        },
        updSuccess(data,index){
            axios({
                url:this.$store.state.UrlIP+'/building/updateData',
                method:'post',
                params:{
                    buildTypeId:data.buildTypeId,
                    campusId:data.campusId,
                    buildName:data.buildName,
                    shortDes:data.shortDes,
                    describe:data.des,
                    buildId:data.buildId,
                    file:'',
                    token:'886a'
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    this.$Message['success']({
                        background: true,
                        content:'操作成功！'
                    })
                    this.getBuildingList();
                    this.updVisible=false;
                    this.updBuilding=false;
                }
            }).catch(err=>{
                console.log(err);
            })
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