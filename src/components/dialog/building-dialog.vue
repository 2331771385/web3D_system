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
                    
                    <FormItem label='校区名称:' prop='campusId'>
                        <Select disabled v-model="tempUpdBuilding.campusId" filterable clearable>
                            <Option v-for="item in tempCampusListArr" :key="item.id" :label="item.campusName" :value="item.id"></Option>
                        </Select>
                    </FormItem>

                    <FormItem label='建筑名称:' prop='buildName'>
                        <Input v-model="tempUpdBuilding.buildName" clearable />
                    </FormItem>

                    <FormItem label='建筑分类:'>
                        <Select v-model="tempUpdBuilding.buildTypeId" filterable clearable>
                            <Option v-for="item in buildingSortList" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label='建筑描述:'>
                        <Input v-model="tempUpdBuilding.des" clearable />
                    </FormItem>
                    <FormItem label='建筑简介:'>
                        <Input v-model="tempUpdBuilding.shortDes" clearable />
                    </FormItem>

                    <FormItem label='建筑数据:'>
                        <Input v-model="tempUpdBuilding.data" clearable />
                    </FormItem>
                    
                    <FormItem label='图片:'>
                         <input type="file" name="avatar" ref="fileType" @change="changeImage($event)"/>
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
                ],
                campusId: [
                    {required: true, message: '校区名称不能为空', trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        
    },
    watch: {
        
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
        
        updSuccess(){
            this.$refs['formUpdValid'].validate((valid)=>{
                let formData = new FormData();
                formData.append("buildTypeId", this.tempUpdBuilding.buildTypeId);
                formData.append("campusId", this.tempUpdBuilding.campusId);
                formData.append("buildName", this.tempUpdBuilding.buildName);
                formData.append("shortDes", this.tempUpdBuilding.shortDes);
                formData.append("describe", this.tempUpdBuilding.des);
                formData.append("buildId", this.tempUpdBuilding.buildId);
                formData.append("token", window.localStorage.getItem('Authorization'));
                formData.append("file", this.$refs.fileType.files[0]);
                formData.append("data", this.tempUpdBuilding.data);
                this.$emit('updSuccess', formData)
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