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
                <Input style="width:260px" 
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
                <Button type="error" size='small' style="marginRight:5px" @click="deleteInfo(row,index)">删除</Button>
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
                :row ='msg'
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
                    minWidth:150,
                    align:'center'
                },{
                    title:'排序ID',
                    key: 'sortIndex',
                    width:90,
                    align:'center',
                    className: 'test-name'
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
                    title:'操作',
                    width:'160px',
                    slot:'action',
                    align:'center'
                }
            ],
            form:{
                typeId:'',
                typeName:'',
                picture:'',
                sortIndex: ''
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
                    pageIndex: this.currentPage,
                    pageSize: this.pageSize,
                    key: this.search,
                    token: window.localStorage.getItem('Authorization')
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res=>{
                if (res.data.code==0) {
                    res.data.data.forEach(item => {
                        this.dataList.push({
                            typeId:item.buildTypeId,
                            typeName:item.buildTypeName,
                            createTime:item.createTime,
                            updateTime:item.updateTime,
                            picture: `http://202.194.14.204:8082${item.iconUrl}`,
                            sortIndex: item.sortIndex
                        })
                    })
                }
                this.totalCount=res.data.respPage.totalCount;
            }).catch(err=>{
                console.log(err);
            })
        },
        addInfo(){
            this.form={
                typeName:'',
                picture:'',
                sortIndex: ''
            };
            this.addDialog=true;
            this.addVisible=true;
        },
        changePage(val){
            this.currentPage = val;
            this.getBuildingList();
        },
        changePagesize(val){
            this.pageSize = val;
            this.getBuildingList();
        },
        /**
         * 添加信息的接口
         */
        addSuccess(data){
            axios({
                url: this.$store.state.UrlIP+'/building/insertTypeData',
                method: 'post',
                data,
                headers: {
                    'Content-type': 'multipart/form-data'
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
            this.msg = row;
            this.form={
                typeId:row.typeId,
                typeName:row.typeName,
                sortIndex: row.sortIndex
            };
            this.updDialog=true;
            this.updVisible=true;
        },

        /**
         * 修改信息成功的接口
         */
        updSuccess(data){
            axios({
                url: this.$store.state.UrlIP+'/building/updateTypeData',
                method: 'post',
                data,
                headers: {
                    'Content-type': 'multipart/form-data'
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

        deleteInfo(row, index) {
            console.log(row);
            this.$Modal.confirm({
                title: '注意',
                content: '是否删除该分类及其相关信息？',
                onOk: () => {
                    this.handleDelete(row.typeId);
                },
                onCancel: () => {
                    this.$Message.info('取消删除');
                }
            });
        },
        handleDelete(typeId) {
            axios({
                url: this.$store.state.UrlIP + '/building/updateTypeData',
                method: 'post',
                params: {
                    buildTypeId: typeId,
                    state: 1,
                    token: window.localStorage.getItem('Authorization'),
                    sortIndex: ''
                },
                headers:{
                    'Content-type':'multipart/form-data'
                }
            }).then(res => {
                if(res.data.code == 0) {
                    this.$Message['success']({
                        background: true,
                        content:'操作成功！'
                    });
                    this.getBuildingList();
                } else {
                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message: "<span style='font-size: 20px;margin-left: 20px'>错误代码"+ res.data.code+ " 错误信息：" + res.data.msg+"</span>",
                        type: "error",
                        customClass:'zZindex',
                    });
                }
            }).catch(err => {
                console.log(err);
            })
        }

    },
}
</script>
<style scoped>
.ivu-icon-ios-apps{
    float: left !important;
    margin-top: 2px !important;
}
.item-img {
    width: 20px;
    height: 20px;
}
</style>
<style>
.ivu-input {
    display: inline-block;
    width: 100%;
    height: 40px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 14px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #515a6e;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out,backgrou
}
.el-message{
    height: 100px;
    width: 600px;
    font-size: 35px !important;
    font-weight: bold;
  }
  .zZindex {
    z-index:3000 !important;
    font-size: 35px !important;
    font-weight: bold;
  }
</style>