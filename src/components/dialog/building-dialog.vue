<template>
    <div>

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
                        <Input v-model="tempUpdBuilding.buildName" clearable ></Input>
                    </FormItem>
                    
                    <FormItem label='图片:'>
                         <Input type="file" v-model="tempUpdBuilding.file" @on-click="aa"></Input>
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
        updVisible:Boolean,
        updBuilding:Boolean,
        updRow:Object,
        buildingSort:Array,
        campusList:Array,
        campusListArr:Array,
    },
    data() {
        return {
            fileListOther: [],
            fileList: [],
            tempUdp:this.updVisible,
            tempUpdBuilding:this.updRow,
            tempUpdBuild:this.updBuilding,
            buildingSortList:this.buildingSort,
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
        handleChange(file, fileList) {
            console.log(file,"==========")
            this.fileList = fileList.slice(-2);
        },
        handleChangeOther(file, fileList) {
            this.fileListOther = fileList.slice(-2);
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
.upload-demo{
    text-align: left;
    margin-left: 10px;
}
</style>