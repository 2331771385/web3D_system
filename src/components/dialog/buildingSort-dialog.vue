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
                        <input type="file" name="avatar" ref="fileType" @change="changeImage($event)"/>
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
                        <Input v-model="tempUpdRow.typeId" disabled />
                    </FormItem>

                    <FormItem label='建筑分类名称:' prop='typeName'>
                        <Input v-model="tempUpdRow.typeName" clearable />
                    </FormItem>

                    <FormItem label='图标:'>
                        <input type="file" name="avatar" ref="fileType" @change="changeImage($event)"/>
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
        updRow:Object,
        row: Object
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
        changeImage(e) {
            var file = e.target.files[0];
            var reader = new FileReader()
            var that = this
            reader.readAsDataURL(file)
            reader.onload = function(e) {
                that.avatar = this.result
            }
        },

        addSuccess(){
            this.$refs['formAddValid'].validate((valid)=>{
                if (valid) {
                    let formData = new FormData();
                    formData.append("buildTypeName", this.tempAddRow.typeName);
                    formData.append("token", window.localStorage.getItem('Authorization'));
                    formData.append("file", this.$refs.fileType.files[0]);
                    this.$emit('addSuccess',formData);
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
                    let formData = new FormData();
                    formData.append("buildTypeId", this.row.typeId);
                    formData.append("buildTypeName", this.tempUpdRow.typeName);
                    formData.append("token", window.localStorage.getItem('Authorization'));
                    formData.append("file", this.$refs.fileType.files[0]);
                    this.$emit('updSuccess', formData);
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