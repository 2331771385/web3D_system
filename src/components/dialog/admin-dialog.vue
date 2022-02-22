<template>
    <div>
        <!-- 停用 -->
        <Modal v-model="tempDel" 
                draggable width='360' height='360' 
                @on-cancel='cancleDelete'         
        >
            <p slot="header" style="color:#FF9900;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>暂停警告</span>
            </p>
            <div style="text-align:center;margin-top:10px">
                <p style="font-size:18px">是否确定停用该用户？</p>
            </div>
            <div slot="footer">
                <Button type="warning" size="large" long @click="deleteOne">停用</Button>
            </div>
        </Modal>

    <!-- 启用 -->
        <Modal v-model="tempStart" 
                draggable width='360' height='360' 
                @on-cancel='cancleStart'     
        >
            <p slot="header" style="color:#19BE6B;text-align:center">
                <Icon type="ios-success-circle"></Icon>
                <span>启用警告</span>
            </p>
            <div style="text-align:center;margin-top:10px">
                <p style="font-size:18px">是否确定启用该用户？</p>
            </div>
            <div slot="footer">
                <Button type="success" size="large" long @click="deleteOne">启用</Button>
            </div>
        </Modal>

        <!-- 删除 -->
        <Modal v-model="tempDelete" 
                draggable width='360' height='360' 
                @on-cancel='deleteRowOne'         
        >
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>删除警告</span>
            </p>
            <div style="text-align:center;margin-top:10px">
                <p style="font-size:18px">是否确定删除该用户？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="deleteAdmin('-1')">删除</Button>
            </div>
        </Modal>


    <!-- 修改管理员信息 -->
        <template v-if="tempShow">
            <Modal v-model="tempUdp" draggable width='400' 
                    title="编辑管理员信息" style="text-align:center;"
                    @on-ok='updSuccess'
                    @on-cancel='updCancal'
            >
                <Form ref="formValid" :model="tempObj" :rules='ruleValidate' :label-width='105'>
                    <FormItem label='登录帐号:' prop='LoginName'>
                        <Input v-model="tempObj.LoginName" disabled></Input>
                    </FormItem>
                    <FormItem label='昵称:' prop='NickName'>
                        <Input v-model="tempObj.NickName" clearable></Input>
                    </FormItem>
                    <FormItem label='设置密码:'>
                        <Input  placeholder="保留原密码" clearable></Input>
                    </FormItem>
                    <FormItem label='角色名称:' prop='RoleID'>
                        <Input v-model="tempObj.RoleID" clearable></Input>
                    </FormItem>
                </Form>
            </Modal>
        </template>


        <!-- 添加管理员操作 -->
        <template v-if="tempFlagAdd">
            <Modal v-model="tempAdd" draggable width='400' 
                    title="添加管理员信息" style="text-align:center;"
                    @on-ok='addSuccess'
                    @on-cancel='cancelAdd'
            >
                <Form ref="formAddValid" :model="tempAddRow" :rules='ruleValidate' :label-width='105'>
                    <FormItem label='登录帐号:' prop='LoginName'>
                        <Input v-model="tempAddRow.LoginName" placeholder="请输入登录帐号"></Input>
                    </FormItem>
                    <FormItem label='昵称:' prop='NickName'>
                        <Input v-model="tempAddRow.NickName" placeholder="请输入昵称" clearable></Input>
                    </FormItem>
                    <FormItem label='设置密码:'>
                        <Input v-model="tempAddRow.password"  type="password" placeholder="请输入密码" clearable></Input>
                    </FormItem>
                    <FormItem label='角色名称:' prop='RoleID'>
                        <Input v-model="tempAddRow.RoleID" placeholder="请输入角色名称" clearable></Input>
                    </FormItem>
                </Form>
            </Modal>
        </template>
        
        
    </div>
</template>
<script>
export default {
    props:{
        updateVisible:Boolean,
        startVisible:Boolean,
        deleteVisible:Boolean,
        updateAdminVisible:Boolean,
        flagUpd:Boolean,
        row:Object,
        flagAdd:Boolean,
        addVisible:Boolean,
        addRow:Object
    },
    data() {
        return {
            tempDel:this.updateVisible,
            tempStart:this.startVisible,
            tempDelete:this.deleteVisible,
            tempShow:this.flagUpd,
            tempUdp:this.updateAdminVisible,
            tempObj:this.row,
            tempFlagAdd:this.flagAdd,
            tempAdd:this.addVisible,
            tempAddRow:this.addRow,
            ruleValidate:{
                LoginName: [
                    { required: true, message: '登陆账号不能为空', trigger: 'blur' }
                ],
                NickName: [
                    { required: true, message: '昵称不能为空', trigger: 'blur' }
                ],
                RoleID: [
                    { required: true, message: '角色名称不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        
    },
    watch: {
       tempDel:function(newVal,old){
           this.tempDel=newVal;
       },
       tempStart:function(newVal,old){
           this.tempStart=newVal
       },
       tempUdp:function(newVal,old){
           this.tempUdp=newVal
       },
       tempObj:function(newVal,old){
           this.tempObj=newVal
       },
       tempShow:function(newVal,old){
           this.tempShow=newVal;
       },

    },
    mounted() {
    },
    methods: {
        deleteAdmin(index){
            this.$emit('deleteAdmin',index)
        },
        deleteOne(){
            this.$emit('deleteOne');
        },
        cancleDelete(){
            this.$emit('cancleDelete');
        },
        cancleStart(){
            this.$emit('cancleStart')
        },
        deleteRowOne(){
            this.$emit('deleteRowOne')
        },
        updSuccess(){
            this.$refs['formValid'].validate((valid)=>{
                if (valid) {
                    this.$emit('updSuccess',this.tempObj)
                }else{
                    //console.log(this.tempShow);
                    this.$Message.console.error(('ERROR'));
                }
            })
            
        },
        updCancal(){
            this.$emit('updCancal')
        },
        addSuccess(){
            this.$refs['formAddValid'].validate((valid)=>{
                if (valid) {
                    this.$emit('addSuccess',this.tempAddRow)
                }
            })
        },
        cancelAdd(){
            this.$emit('cancelAdd')
        }


    },
}
</script>
<style scoped>

</style>