<template>
    <div>
        <!-- 添加公共服务的弹框 -->
        <template v-if="tempAddPublicVisible">
            <Modal v-model="tempPublic"  width='400' 
                    title="添加公共服务信息" style="text-align:center;"
                    @on-ok='addSuccess'
                    @on-cancel='cancelAdd'
            >
                <Form ref="formAddValid" :model="tempAddPublic" :rules='ruleValidate' :label-width='115'>
                    <FormItem label='校区名称:' prop='campusName'>
                        <Select v-model="tempAddPublic.id">
                            <Option v-for="item in tempCampusList" :key="item.id" :label="item.campusName" :value="item.id"></Option>
                        </Select>
                    </FormItem>

                    <FormItem label='公共服务名称:' prop='serviceName'>
                        <Input v-model="tempAddPublic.serviceName" placeholder="公共服务名称" clearable></Input>
                    </FormItem>

                    <FormItem label='公共服务分类:' prop='publicSort'>
                        <Select v-model="tempAddPublic.serviceTypeId" clearable>
                            <Option v-for="item in tempPublicSortList" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label='公共服务描述:'>
                        <Input v-model="tempAddPublic.describe" placeholder="公共服务描述" clearable></Input>
                    </FormItem>
                    <FormItem label='公共服务简介:'>
                        <Input v-model="tempAddPublic.shortDes" placeholder="公共服务简介" clearable></Input>
                    </FormItem>

                    <FormItem label='图标:'>
                        <Input v-model="tempAddPublic.file" placeholder="公共服务图标" clearable></Input>
                    </FormItem>
                </Form>
            </Modal>
        </template>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name:'public-dialog',
    props:{
        addVisible:Boolean,
        addRow:Object,
        publicSortList:Array,
        campusList:Array,
        addPublic:Boolean,
    },
    data() {
        return {
            tempAddPublicVisible:this.addVisible,
            tempAddPublic:this.addRow,
            tempPublic:this.addPublic,
            tempCampusList:this.campusList,
            tempPublicSortList:this.publicSortList,
            ruleValidate:{
                serviceName: [
                    { required: true, message: '公共服务名称不能为空', trigger: 'blur' }
                ],
                campusName:[
                    {required: true, message: '校区不能为空', trigger: 'blur'}
                ],
                publicSort:[
                    {required: true, message: '服务分类不能为空', trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        
    },
    methods: {
        //确认按钮
        addSuccess(){
            this.$emit('addSuccess',this.tempAddPublic)
            // console.log(this.$refs['formAddValid'].validate);
            // this.$refs['formAddValid'].validate((valid)=>{
            //     console.log(valid);
            //     if (valid) {
            //         this.$emit('addSuccess',this.tempAddBuild)
            //     }else{
            //         this.$Message['error']({
            //             background: true,
            //             content:'错误提示！'
            //         })
            //     }
            // })
        },
        //取消按钮
        cancelAdd(){
            this.$emit('cancelAdd');
        },
    },
}
</script>
<style scoped>

</style>