<template>
    <div>
        <!-- 添加操作 -->
        <template v-if="tempBuild">
            <Modal v-model="tempAdd" draggable width='400' 
                    title="添加建筑信息" style="text-align:center;"
                    @on-ok='addSuccess'
                    @on-cancel='cancelAdd'
            >
                <Form ref="formAddValid" :model="tempAddBuild" :rules='ruleValidate' :label-width='105'>
                    <FormItem label='建筑分类:' prop='buildType'>
                        <Input v-model="tempAddBuild.buildType" placeholder="请输入建筑分类"></Input>
                        <!-- <Select v-model="tempUpdBuilding.buildType">
                            <Option v-for="item in buildingSortList" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select> -->
                    </FormItem>
                    <FormItem label='建筑简介:'>
                        <Input v-model="tempAddBuild.des" placeholder="建筑简介" clearable></Input>
                    </FormItem>
                    <FormItem label='建筑名称:' prop='buildName'>
                        <Input v-model="tempAddBuild.buildName"  placeholder="请输入建筑名称" clearable></Input>
                    </FormItem>
                    <FormItem label='图标:' prop='file'>
                        <Input v-model="tempAddBuild.file" placeholder="请输入建筑图标" clearable></Input>
                    </FormItem>
                </Form>
            </Modal>
        </template>

        <!-- 修改操作 -->
        <template v-if="tempUpdBuild">
            <Modal v-model="tempUdp" draggable width='400' 
                    title="修改建筑信息" style="text-align:center;"
                    @on-ok='addSuccess'
                    @on-cancel='cancelAdd'
            >
                <Form ref="formUpdValid" :model="tempUpdBuilding" :rules='ruleValidate' :label-width='105'>
                    <FormItem label='建筑分类:' prop='buildType'>
                        <!-- <Input v-model="tempUpdBuilding.buildType" ></Input> -->
                        <Select v-model="tempUpdBuilding.buildType">
                            <Option v-for="item in buildingSortList" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label='建筑描述:'>
                        <Input v-model="tempUpdBuilding.des"  clearable></Input>
                    </FormItem>
                    <FormItem label='建筑简介:'>
                        <Input v-model="tempUpdBuilding.shortDes"  clearable></Input>
                    </FormItem>
                    <FormItem label='建筑名称:' prop='buildName'>
                        <Input v-model="tempUpdBuilding.buildName" clearable></Input>
                    </FormItem>
                    <FormItem label='图标:' prop='file'>
                        <Input v-model="tempUpdBuilding.file" clearable></Input>
                    </FormItem>
                </Form>
            </Modal>
        </template>
    </div>
</template>
<script>
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
            ruleValidate:{
                buildType: [
                    { required: true, message: '建筑分类不能为空', trigger: 'blur' }
                ],
                buildName: [
                    { required: true, message: '建筑名称不能为空', trigger: 'blur' }
                ],
                file: [
                    { required: true, message: '建筑图标不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        
    },
    watch: {
        
    },
    methods: {
        addSuccess(){},
        cancelAdd(){},
    },
}
</script>
<style scoped>

</style>