<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon  type="ios-apps" size='22'/>
            <span class="pageTitle">建筑分类列表</span>
        </div>
        <!-- 搜索框 -->
        <div class='searchInput'>
            <div class="search-top">
                <span class="search-box-text">模糊查询:</span>
                <Input style="width:auto" 
                    v-model="search"
                    placeholder="建筑分类名称关键字"
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
            <!-- 创建时间 -->
            <template slot-scope="{row}" slot="createTime">
                <font v-if="row.createTime==null || row.createTime==undefined">-</font>
                <font v-else>{{row.createTime}}</font>
            </template>

            <!-- 更新时间 -->
            <template slot-scope="{row}" slot="updateTime">
                <font v-if="row.updateTime==null || row.updateTime==undefined">{{row.createTime}}</font>
                <font v-else>{{row.updateTime}}</font>
            </template>

            <!-- 操作 -->
            <template slot-scope="{row,index}" slot="action">
                <Button type="info" size='small' style="marginRight:5px" @click="updateInfo(row,index)">修改</Button>
                <!-- <Button type="error" size='small' style="marginRight:5px" @click="deleteInfo(row,index)">删除</Button> -->
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

        <!-- 添加分类信息的弹框 -->
        <template v-if="addDialog">
            <v-dialog
                :addVisible='addVisible'
                :addRow='form'
                :addDialog='addDialog'
                @addSuccess='addSuccess'
                @cancelAdd='cancelAdd'
            >

            </v-dialog>
        </template>

        <!-- 编辑分类信息的弹框 -->
        <template v-if="updDialog">
            <v-dialog
                :updDialog='updDialog'
                :updVisible='updVisible'
                :updRow='form'
                @updSuccess='updSuccess'
                @updCancal='updCancal'
            >

            </v-dialog>
        </template>
    </div>
</template>
<script>
import axios from 'axios';
import vDialog from '../../dialog/buildingSort-dialog.vue'
export default {
    name:'building-sort',
    components:{
        vDialog
    },
    data() {
        return {
            currentPage:'1',
            pageSize:'10',
            totalCount:0,
            search:'',
            dataList:[],
            columns:[
                {
                    title:'id',
                    key: 'typeId',
                    width:'60px',
                    align:'center'
                },{
                    title:'建筑分类名称',
                    key: 'typeName',
                    width:'150px',
                    align:'center'
                },{
                    title:'创建时间',
                    slot: 'createTime',
                    minWidth:100,
                    align:'center'
                },{
                    title:'最后更新时间',
                    slot: 'updateTime',
                    minWidth:100,
                    align:'center'
                },{
                    title:'图标',
                    key: 'picture',
                    minWidth:130,
                    align:'center'
                },{
                    title:'操作',
                    width:'160px',
                    slot:'action',
                    align:'center'
                }
            ],
            form:{
                typeId:'',
                typeName:'',
                picture:''
            },
            msg:'',
            addDialog:false,
            addVisible:false,
            updDialog:false,
            updVisible:false
        }
    },
    created() {
        this.getBuildingList();
    },
    mounted() {
        
    },
    methods: {
        /**
         * 回车操作
         */
        clickSub(){
            this.getBuildingList();
        },
        getBuildingList(){
            this.dataList=[];
            axios({
                url:this.$store.state.UrlIP+'/building/getTypeData',
                method:'get',
                params:{
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    key:this.search,
                    token:'886a'
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    res.data.data.forEach(item=>{
                        this.dataList.push({
                            typeId:item.buildTypeId,
                            typeName:item.buildTypeName,
                            createTime:item.createTime,
                            updateTime:item.updateTime,
                            picture:item.iconUrl
                        })
                    })
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        addInfo(){
            this.form={
                typeName:'',
                picture:''
            };
            this.addDialog=true;
            this.addVisible=true;
        },
        changePage(){},
        changePagesize(){},
        /**
         * 添加信息的接口
         */
        addSuccess(data){
            axios({
                url:this.$store.state.UrlIP+'/building/insertTypeData',
                method:'post',
                params:{
                    buildTypeName:data.typeName,
                    file:data.picture,
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
                    });
                    this.getBuildingList();
                    this.addVisible=false;
                    this.addDialog=false;
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        /**
         * 取消添加信息方法
         */
        cancelAdd(){
            this.addDialog=false;
            this.addVisible=false;
        },

        /**
         * 修改分类信息
         */
        updateInfo(row,index){
            this.form={
                typeId:row.typeId,
                typeName:row.typeName,
                picture:row.picture 
            };
            this.updDialog=true;
            this.updVisible=true;
        },

        /**
         * 修改信息成功的接口
         */
        updSuccess(data){
            axios({
                url:this.$store.state.UrlIP+'/building/updateTypeData',
                method:'post',
                params:{
                    buildTypeId:data.typeId,
                    buildTypeName:data.typeName,
                    file:data.picture,
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
                    });
                    this.getBuildingList();
                    this.updVisible=false;
                    this.updDialog=false;
                }
            }).catch(err=>{
                console.log(err);
            })
        },

        /**
         * 取消信息的接口
         */
        updCancal(){
            this.updDialog=false;
            this.updVisible=false;
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