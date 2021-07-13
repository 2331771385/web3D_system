<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon type="ios-apps" size='22'/>
            <span class="pageTitle">建筑数据列表</span>
        </div>
        <!-- 搜索框 -->
        <div class='searchInput'>
            <div class="search-top">
                <span class="search-box-text">校区:</span>
                <el-select v-model="campus" style="width:200px" clearable>
                    <el-option v-for="item in campusList" :key="item.id" :label="item.campusName" :value="item.id"></el-option>
                </el-select>

                <span class="search-box-text">建筑分类:</span>
                <el-select v-model="bsortVal" style="width:200px" clearable>
                    <el-option v-for="item in buildingSortList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>

                <span class="search-box-text">模糊查询:</span>
                <Input style="width:260px" 
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

            <!-- 显示图片信息 -->
            <template slot-scope="{ row }" slot="picUrl">
                <font>
                    <img class="item-imgs" :src="row.picUrl" />
                </font>
            </template>

            <template slot-scope="{ row }" slot="iconUrl">
                <font>
                    <img class="item-imgs" :src="row.iconUrl" />
                </font>
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
            
         <el-dialog  title="添加建筑信息" :visible.sync="addVisible" width="480px">
            <el-form :model="form" ref="form" label-width="115px" :rules='ruleValidate' class="demo-ruleForm">
                <el-form-item label="校区名称:" prop="campusId">
                    <el-select  v-model="form.campusId" style="width:300px;margin-bottom:5px">
                        <el-option
                            v-for="item in campusList" 
                            :key="item.id" 
                            :label="item.campusName" 
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label='建筑分类:' prop="buildTypeId">
                    <el-select v-model="form.buildTypeId" style="width:300px;margin-bottom:5px" clearable>
                        <el-option 
                            v-for="item in buildingSortList" 
                            :key="item.id" :label="item.name" 
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='建筑名称:' prop='buildName'>
                    <el-input v-model="form.buildName"  placeholder="请输入建筑名称" style="width:300px;margin-bottom:5px" clearable></el-input>
                </el-form-item>
            
               <el-form-item label='建筑描述:'>
                    <el-input v-model="form.des" placeholder="建筑描述" style="width:300px;margin-bottom:5px" clearable></el-input>
                </el-form-item>
                <el-form-item label='建筑简介:'>
                    <el-input v-model="form.shortDes" placeholder="建筑简介" style="width:300px;margin-bottom:5px" clearable></el-input>
                </el-form-item>
                
                <el-form-item label="建筑数据:" >
                     <el-input 
                        v-model="form.data" 
                        placeholder="建筑数据" 
                        style="width:300px;margin-bottom:5px" 
                        clearable
                    >
                    </el-input>
                </el-form-item>

                <el-form-item label="建筑图标:" >
                     <el-input 
                        v-model="form.pinData" 
                        placeholder="建筑图标" 
                        style="width:300px;margin-bottom:5px" 
                        clearable
                    >
                    </el-input>
                </el-form-item>

                <!-- 图片 -->
                <el-form-item label="图片:" >
                    <input type="file" name="avatar" ref="fileType" @change="changeImage($event)"/>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button class="tableBtn" @click="addVisible = false">取 消</el-button>
                <el-button class="tableBtn" type="primary" @click="addSuccess('form')">确定</el-button>
            </span>
        </el-dialog>

        
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
                    width:'60px',
                    align:'center',
                    className: 'test-name'
                },{
                    title:'建筑名称',
                    key: 'buildName',
                    //  minWidth:'90px',
                    minWidth:120,
                    align:'center',
                    className: 'test-name'
                },{
                    title:'校区名称',
                    key: 'campusName',
                    //  minWidth:'90px',
                    width:'140px',
                    align:'center',
                    className: 'test-name'
                },{
                    title:'建筑分类',
                    slot: 'buildTypeName',
                    //  minWidth:'90px',
                    width:'120px',
                    align:'center',
                    className: 'test-name'
                },{
                    title:'建筑描述',
                    key: 'describe',
                    tooltip:'true',
                    //  minWidth:'90px',
                    width:'140px',
                    align:'center',
                    className: 'test-name'
                },{
                    title:'建筑简介',
                    key: 'shortDes',
                    //  minWidth:'90px',
                    tooltip:'true',//开启后，文本将不换行
                    width:'150px',
                    align:'center',
                    className: 'test-name'
                },
                {
                    title:'图片 ',
                    slot: 'picUrl',
                    width:90,
                    tooltip:'true',
                    align:'center',
                },
                {
                    title:'图标 ',
                    slot: 'iconUrl',
                    width:90,
                    tooltip:'true',
                    align:'center',
                },
                // {
                //     title:'修改时间',
                //     key: 'updateTime',
                //     minWidth:100,
                //     tooltip:'true',
                //     align:'center',
                //     className: 'test-name'
                // },
                {
                    title:'状态',
                    slot: 'state',
                    //  minWidth:'90px',
                    width:'90px',
                    align:'center',
                    className: 'test-name'
                },{
                    title:'操作',
                    width:'160px',
                    slot:'action',
                    align:'center',
                    className: 'test-name'
                }
            ],
            currentPage:'1',
            pageSize:'10',
            totalCount:0,
            search:'',
            msg:'',
            updVisible:false,
            addVisible:false,
            updBuilding:false,
            form:{
                data: '',
                des:'',
                buildName:'',
                file:'',
                buildType:'',
                buildId:'',
                shortDes:'',
                campusId:'',
                buildTypeId:'',
                pinData: ''
            },
            ruleValidate:{
                buildName: [
                    { required: true, message: '建筑名称不能为空', trigger: 'blur' }
                ],
                campusId: [
                    { required: true, message: '校区名称不能为空', trigger: 'blur' }
                ],
                buildTypeId: [
                    { required: true, message: '分类名称不能为空', trigger: 'blur' }
                ],
            }
        }
    },
    created() {
        // this.getBuildingSort();
        this.getCampusList();
    },
    watch: {
        campus:function(newVal,oldVal){
            if (newVal !== oldVal) {
                this.campus = newVal;
            }
        }
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
                    buildTypeId:this.bsortVal,
                    token: window.localStorage.getItem('Authorization')
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
                    this.dataList.forEach(item => {
                        item.iconUrl = `http://211.87.231.41:8089${item.iconUrl}`;
                        item.picUrl = `http://211.87.231.41:8089${item.picUrl}`;
                    })
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
                    pageSize:'10',
                    token: window.localStorage.getItem('Authorization')
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
            this.form={
                data: '',
                des:'',
                buildName:'',
                file:'',
                buildType:'',
                shortDes:'',    
                buildId:'',
                campusId:'',
                buildTypeId:'',
                pinData: ''
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
            console.log(row);
            this.form={
                data: this.msg.data,
                des:this.msg.describe,
                buildName:this.msg.buildName,
                buildId:this.msg.buildId,
                file: '',
                buildType:this.msg.buildTypeName,
                shortDes:this.msg.shortDes,
                campusId:this.msg.campusId,
                buildTypeId:this.msg.buildTypeId,
                pinData: this.msg.pinData
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
                    pageSize:'10',
                    token: window.localStorage.getItem('Authorization')
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
        addSuccess(){
            this.$refs['form'].validate(valid => {
                if (valid) {
                    let formData = new FormData();
                    formData.append('buildTypeId', this.form.buildTypeId);
                    formData.append('campusId', this.form.campusId);
                    formData.append('buildName', this.form.buildName);
                    formData.append('file',this.$refs.fileType.files[0]);
                    formData.append('data',this.form.data);
                    formData.append('describe',this.form.des);
                    formData.append('shortDes',this.form.shortDes);
                    formData.append('pinData', this.form.pinData);
                    formData.append('token', window.localStorage.getItem('Authorization'));
                    axios({
                        url: this.$store.state.UrlIP+'/building/insertData',
                        method: 'post',
                        data: formData,
                        headers: {
                            'Content-type': 'multipart/form-data'
                        }
                    }).then(res=>{
                        if (res.data.code==0) {
                            this.$Message['success']({
                                background: true,
                                content:'操作成功！'
                            })
                            this.getBuildingList();
                            this.addVisible=false;
                        }
                    }).catch(err=>{
                        console.log(err);
                    })
                }
            })
        },

        cancelUpd(){
            this.updVisible=false;
            this.updBuilding=false;
        },

        updSuccess(data){
            console.log(data);
            axios({
                url: this.$store.state.UrlIP+'/building/updateData',
                method: 'post',
                data,
                headers: {
                    'Content-type':'multipart/form-data'
                }
            }).then(res => {
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
        },
        deleteInfo(row, index) {
            this.$Modal.confirm({
                title: '注意',
                content: '是否删除建筑及其相关信息？',
                onOk: () => {
                    this.handleDelete(row.buildId);
                },
                onCancel: () => {
                    this.$Message.info('取消删除');
                }
            });
        },

        handleDelete(buildId) {
            this.$axios({
                url: this.$store.state.UrlIP + '/building/updateData',
                method: 'post',
                params: {
                    buildId: buildId,
                    state: 1,
                    token: window.localStorage.getItem('Authorization')
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
.ivu-table th.test-name {
    height: 30px !important;
}
.item-imgs{
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

</style>