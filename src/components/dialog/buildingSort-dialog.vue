<template>
    <div>
        <!-- 添加建筑分类信息 -->
        <template v-if="tempAddDialog">
            <Modal v-model="tempAdd" 
                    width='400' 
                    title="添加建筑分类信息" style="text-align:center;"
                    @on-ok='addSuccess'
                    @on-cancel='cancelAdd'
            >
                <Form ref="formAddValid" :model="tempAddRow" :rules='ruleValidate' :label-width='115'>
                    <FormItem label='建筑分类名称:' prop='typeName'>
                        <Input v-model="tempAddRow.typeName" placeholder="请输入建筑分类名称"></Input>
                    </FormItem>

                    <FormItem label='图标:'>
                        <Upload style="float:left" action="">
                            <Button icon="ios-cloud-upload-outline">上传图标</Button>
                        </Upload>
                        <!-- <Input type="file" v-model="tempAddRow.picture" placeholder="请输入建筑分类图标" clearable></Input> -->
                    </FormItem>
                </Form>
            </Modal>
        </template>

    <!-- 修改建筑分类信息 -->
        <template v-if="tempUdpDialog">
            <Modal v-model="tempUpd" 
                    width='400' 
                    title="修改建筑分类信息" style="text-align:center;"
                    @on-ok='updSuccess'
                    @on-cancel='updCancal'
            >
                <Form ref="formUpdValid" :model="tempUpdRow" :rules='ruleValidate' :label-width='115'>
                    <FormItem label='建筑分类ID:' prop='typeName'>
                        <Input v-model="tempUpdRow.typeId" disabled></Input>
                    </FormItem>

                    <FormItem label='建筑分类名称:' prop='typeName'>
                        <Input v-model="tempUpdRow.typeName" clearable></Input>
                    </FormItem>

                    <FormItem label='图标:'>
                        <Upload style="float:left" action="">
                            <Button icon="ios-cloud-upload-outline">上传图标</Button>
                        </Upload>
                        <!-- <Input type="file" v-model="tempUpdRow.picture" clearable></Input> -->
                    </FormItem>
                </Form>
            </Modal>
        </template>
    </div>
</template>
<script>
export default {
    name:'buildingSort-dialog',
    props:{
        addDialog:Boolean,
        addVisible:Boolean,
        addRow:Object,
        updDialog:Boolean,
        updVisible:Boolean,
        updRow:Object
    },
    data() {
        return {
            tempAdd:this.addVisible,
            tempAddDialog:this.addDialog,
            tempAddRow:this.addRow,
            tempUpd:this.updVisible,
            tempUdpDialog:this.updDialog,
            tempUpdRow:this.updRow,
            ruleValidate:{
                typeName: [
                    { required: true, message: '建筑分类名称不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        
    },
    mounted() {
        
    },
    methods: {
        addSuccess(){
            this.$refs['formAddValid'].validate((valid)=>{
                if (valid) {
                    this.$emit('addSuccess',this.tempAddRow);
                }else{

                }
            })
        },
        cancelAdd(){
            this.$emit('cancelAdd')
        },
        updSuccess(){
            this.$refs['formUpdValid'].validate((valid)=>{
                if (valid) {
                    this.$emit('updSuccess',this.tempUpdRow);
                }else{

                }
            })
        },
        updCancal(){
            this.$emit('updCancal');
        },
    },
}
</script>
<style scoped>

</style>