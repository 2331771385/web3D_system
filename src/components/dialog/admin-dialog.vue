<template>
    <div>
        <!-- 停用 -->
        <Modal v-model="tempDel" 
                draggable width='360' height='360' 
                @on-cancel='cancleDelete'         
        >
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>暂停警告</span>
            </p>
            <div style="text-align:center;margin-top:10px">
                <p style="font-size:18px">是否确定停用该用户？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="deleteOne">停用</Button>
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


    <!-- 修改管理员信息 -->
        <Modal v-model="tempUdp" draggable width='400' 
                title="编辑管理员信息" style="text-align:center;"
                @on-ok='updSuccess'
                @on-cancel='updCancal'
        >
            <Form v-model="tempObj" :rules='ruleValidate' :label-width='105'>
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
        
    </div>
</template>
<script>
export default {
    props:{
        updateVisible:Boolean,
        startVisible:Boolean,
        updateAdminVisible:Boolean,
        row:Object

    },
    data() {
        return {
            tempDel:this.updateVisible,
            tempStart:this.startVisible,
            tempUdp:this.updateAdminVisible,
            tempObj:this.row,
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
       }
    },
    mounted() {
        console.log(this.tempObj);
    },
    methods: {
        deleteOne(){
            this.$emit('deleteOne');
        },
        cancleDelete(){
            this.$emit('cancleDelete');
        },
        cancleStart(){
            this.$emit('cancleStart')
        },
        updSuccess(){
            this.$emit('updSuccess',this.tempObj)
        },
        updCancal(){
            this.$emit('updCancal')
        },

    },
}
</script>
<style scoped>

</style>