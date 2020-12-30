<template>
    <div>
        <!-- 添加操作 -->
        <template v-if="tempBuild">
            <Modal v-model="tempAdd"  width='400' 
                    title="添加建筑信息" style="text-align:center;"
                    @on-ok='addSuccess'
                    @on-cancel='cancelAdd'
            >
                <Form ref="formAddValid" :model="tempAddBuild" :rules='ruleValidate' :label-width='105'>
                    <FormItem label='校区名称:'>
                        <Select v-model="tempAddBuild.campusId" clearable>
                            <Option v-for="item in tempCampusList" :key="item.id" :label="item.campusName" :value="item.id"></Option>
                        </Select>
                    </FormItem>

                    <FormItem label='建筑分类:'>
                        <Select v-model="tempAddBuild.buildTypeId" clearable>
                            <Option v-for="item in addBuildingSortList" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label='建筑描述:'>
                        <Input v-model="tempAddBuild.des" placeholder="建筑描述" clearable></Input>
                    </FormItem>
                    <FormItem label='建筑简介:'>
                        <Input v-model="tempAddBuild.shortDes" placeholder="建筑简介" clearable></Input>
                    </FormItem>
                    <FormItem label='建筑名称:' prop='buildName'>
                        <Input v-model="tempAddBuild.buildName"  placeholder="请输入建筑名称" clearable></Input>
                    </FormItem>
                    <FormItem label='图标:'>
                        <Input v-model="tempAddBuild.file" placeholder="请输入建筑图标" clearable></Input>
                    </FormItem>
                </Form>
            </Modal>
        </template>

        <!-- 修改操作 -->
        <template v-if="tempUpdBuild">
            <Modal v-model="tempUdp" width='400' 
                    title="修改建筑信息" style="text-align:center;"
                    @on-ok='updSuccess'
                    @on-cancel='cancelUpd'
            >
                <Form ref="formUpdValid" :model="tempUpdBuilding" :rules='ruleValidate' :label-width='105'>
                    
                    <FormItem label='校区名称:'>
                        <Select v-model="tempUpdBuilding.campusId" filterable clearable>
                            <Option v-for="item in tempCampusListArr" :key="item.id" :label="item.campusName" :value="item.id"></Option>
                        </Select>
                    </FormItem>

                    <FormItem label='建筑分类:'>
                        <Select v-model="tempUpdBuilding.buildTypeId" filterable clearable>
                            <Option v-for="item in buildingSortList" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label='建筑描述:'>
                        <Input v-model="tempUpdBuilding.des" clearable></Input>
                    </FormItem>
                    <FormItem label='建筑简介:'>
                        <Input v-model="tempUpdBuilding.shortDes" clearable></Input>
                    </FormItem>
                    <FormItem label='建筑名称:' prop='buildName'>
                        <Input v-model="tempUpdBuilding.buildName" clearable></Input>
                    </FormItem>
                    <FormItem label='图标:'>
                        <Input v-model="tempUpdBuilding.file" clearable></Input>
                    </FormItem>
                </Form>
            </Modal>
        </template>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:'building-dialog',
    props:{
        addVisible:Boolean,
        addRow:Object,
        addBuilding:Boolean,
        updVisible:Boolean,
        updBuilding:Boolean,
        updRow:Object,
        buildingSort:Array,
        addBuildingSort:Array,
        campusList:Array,
        campusListArr:Array,
    },
    data() {
        return {
            tempAdd:this.addVisible,
            tempAddBuild:this.addRow,
            tempBuild:this.addBuilding,
            tempUdp:this.updVisible,
            tempUpdBuilding:this.updRow,
            tempUpdBuild:this.updBuilding,
            buildingSortList:this.buildingSort,
            addBuildingSortList:this.addBuildingSort,
            tempCampusList:this.campusList,
            tempCampusListArr:this.campusListArr,
            ruleValidate:{
                buildName: [
                    { required: true, message: '建筑名称不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        
    },
    watch: {
        
    },
    methods: {
        addSuccess(){
            this.$refs['formAddValid'].validate((valid)=>{
                if (valid) {
                    this.$emit('addSuccess',this.tempAddBuild)
                }else{
                    this.$Message['error']({
                        background: true,
                        content:'错误提示！'
                    })
                }
            })
        },
        cancelAdd(){
            this.$emit('cancelAdd');
        },
        updSuccess(){
            this.$refs['formUpdValid'].validate((valid)=>{
                console.log(this.tempUpdBuilding);
                if (valid) {
                    this.$emit('updSuccess',this.tempUpdBuilding)
                }else{
                    console.log('出错了');
                }
            })
        },
        cancelUpd(){
            this.$emit('cancelUpd');
        },
        
    },
}
</script>
<style scoped>

</style>