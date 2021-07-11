<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon  type="ios-apps" size='22'/>
            <span class="pageTitle">学院分类列表</span>
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
                    @on-clear='getColleagueSortList'
                    @on-change='getColleagueSortList'
                />
                <Button type="primary" @click="getColleagueSortList" icon="ios-search">查找</Button>
                <Button type="success" @click="addInfo" icon='ios-add'>新增</Button>
            </div>
        </div>

        <!-- 列表数据展示 -->
        <Table border :columns='columns' :data='colleagueList'>
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

        <!-- 新增数据 -->
        <el-dialog  title="添加分类数据" :visible.sync="addVisible" width="480px">
            <el-form :model="form" ref="form" label-width="115px" :rules='ruleValidate' class="demo-ruleForm">
                <el-form-item label="学院类型名称:" prop="collegeTypeName">
                    <el-input 
                        v-model="form.collegeTypeName"  
                        placeholder="请输入分类类型" style="width:300px;margin-bottom:5px" clearable
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="排序序号:" prop="sortIndex">
                    <el-input 
                        v-model="form.sortIndex"  
                        type="number"
                        placeholder="请输入排序序号" 
                        style="width:300px;margin-bottom:5px" 
                        clearable
                    >
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="tableBtn" @click="addVisible = false">取 消</el-button>
                <el-button class="tableBtn" type="primary" @click="addSuccess('form')">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog  title="修改分类数据" :visible.sync="updateVisible" width="480px">
            <el-form :model="form" ref="form" label-width="115px" class="demo-ruleForm">
                <el-form-item label="学院类型名称:">
                    <el-input 
                        v-model="form.collegeTypeName"  
                        placeholder="请输入分类类型" style="width:300px;margin-bottom:5px" clearable
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="排序序号:">
                    <el-input 
                        v-model="form.sortIndex"  
                        type="number"
                        placeholder="请输入排序序号" 
                        style="width:300px;margin-bottom:5px" 
                        clearable
                    >
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="tableBtn" @click="updateVisible = false">取 消</el-button>
                <el-button class="tableBtn" type="primary" @click="updateSuccess('form')">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import axios from 'axios';
import vDialog from '../../dialog/buildingSort-dialog.vue'
export default {
    components:{
        vDialog
    },
    data() {
        return {
            search: '',
            currentPage:'1',
            pageSize:'10',
            totalCount:0,
            colleagueList: [],
            columns:[
                {
                    title:'id',
                    key: 'collegeTypeId',
                    width:'80px',
                    align:'center',
                    className: 'test-name'
                },{
                    title:'学院分类',
                    key: 'collegeTypeName',
                    minWidth:120,
                    align:'center',
                    className: 'test-name'
                },
                {
                    title:'排序ID',
                    key: 'sortIndex',
                    width:90,
                    align:'center',
                    className: 'test-name'
                },
                {
                    title:'创建时间',
                    slot: 'createTime',
                    //  minWidth:'90px',
                    minWidth:100,
                    align:'center',
                    className: 'test-name'
                },
                {
                    title:'修改时间',
                    slot: 'updateTime',
                    minWidth:100,
                    tooltip:'true',
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
            form: {
                collegeTypeName: '',
                sortIndex: ''
            },
            addVisible: false,
            updateVisible: false,
            ruleValidate: {
                collegeTypeName:[
                    { required: true, message: '分类名称不能为空', trigger: 'blur' }
                ],
                sortIndex: [
                    { required: true, message: '排序序号不能为空', trigger: 'blur' }
                ]
            },
            msg: '',
            index: ''
        }
    },
    created() {
        this.getColleagueSortList();
    },
    methods: {
        clickSub() {
            this.getColleagueSortList();
        },
        getColleagueSortList() {
            axios({
                url: this.$store.state.UrlIP + '/college/getTypeData',
                method: 'get',
                params: {
                    pageIndex: this.currentPage,
                    pageSize: this.pageSize,
                    key: this.search,
                    token: window.localStorage.getItem('Authorization')
                },
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                }
            }).then(res => {
                if (res.data.code === 0) {
                    this.colleagueList = res.data.data;
                    this.totalCount=res.data.respPage.totalCount;
                }
            }).catch(err => {
                console.log(err);
            })
        },
        addInfo() {
            this.addVisible = true;
            this.form = {
                collegeTypeName: '',
                sortIndex: ''
            }
        },
        changePage(val) {
            this.currentPage = val;
            this.getColleagueSortList();
        },
        changePagesize(val) {
            this.pageSize = val;
            this.getColleagueSortList();
        },
        addSuccess(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    let formData = new FormData();
                    formData.append('collegeTypeName', this.form.collegeTypeName);
                    formData.append('sortIndex', this.form.sortIndex);
                    formData.append('token', window.localStorage.getItem('Authorization'));
                    axios({
                        url: this.$store.state.UrlIP + '/college/insertTypeData',
                        method: 'post',
                        data: formData,
                        headers: {
                            'Content-type':'multipart/form-data'
                        }
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.$Message['success']({
                                background: true,
                                content:'操作成功！'
                            })
                            this.getColleagueSortList();
                            this.addVisible = false;
                        } else {
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message: "<span style='font-size: 20px;margin-left: 20px'>错误代码"+ res.data.code+ " 错误信息：" + res.data.msg+"</span>",
                                type: "error",
                                customClass:'zZindex',
                            });
                        }
                    }).catch(err => {
                        this.$message({
                            dangerouslyUseHTMLString: true,
                            message: "<span style='font-size: 20px;margin-left: 20px'>系统错误！</span>",
                            type: "error",
                            customClass:'zZindex',
                        });
                    })
                } else {
                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message: "请输入有效数据",
                        type: "error",
                        customClass:'zZindex',
                    });
                }
            })
        },
        updateInfo(row, index) {
            this.msg = row;
            this.form = {
                collegeTypeName: row.collegeTypeName,
                sortIndex: row.sortIndex
            };
            this.updateVisible = true;
        },
        updateSuccess(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    let formData = new FormData();
                    formData.append('collegeTypeName', this.form.collegeTypeName);
                    formData.append('sortIndex', this.form.sortIndex);
                    formData.append('token', window.localStorage.getItem('Authorization'));
                    formData.append('collegeTypeId', this.msg.collegeTypeId);
                    axios({
                        url: this.$store.state.UrlIP + '/college/updateTypeData',
                        method: 'post',
                        data: formData,
                        headers: {
                            'Content-type':'multipart/form-data'
                        }
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.$Message['success']({
                                background: true,
                                content:'操作成功！'
                            })
                            this.getColleagueSortList();
                            this.updateVisible = false;
                        } else {
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message: "<span style='font-size: 20px;margin-left: 20px'>错误代码"+ res.data.code+ " 错误信息：" + res.data.msg+"</span>",
                                type: "error",
                                customClass:'zZindex',
                            });
                        }
                    }).catch(err => {
                        this.$message({
                            dangerouslyUseHTMLString: true,
                            message: "<span style='font-size: 20px;margin-left: 20px'>系统错误！</span>",
                            type: "error",
                            customClass:'zZindex',
                        });
                    })
                } else {
                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message: "请输入有效数据",
                        type: "error",
                        customClass:'zZindex',
                    });
                }
            })
        },
        deleteInfo(row, index) {
            this.$Modal.confirm({
                title: '注意',
                content: '是否删除该分类及其相关信息？',
                onOk: () => {
                    this.handleDelete(row.collegeTypeId);
                },
                onCancel: () => {
                    this.$Message.info('取消删除');
                }
            });
        },
        handleDelete(collegeTypeId) {
            axios({
                url: this.$store.state.UrlIP + '/college/updateTypeData',
                method: 'post',
                params: {
                    collegeTypeId,
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
                    this.getColleagueSortList();
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