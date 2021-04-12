<template>
    <div class="tableContainer">
        <div class="table-label">
            <Icon type="ios-apps" size='22'/>
            <span class="pageTitle">日志信息列表</span>
        </div>

        <!-- 搜索框 -->
        <div class='searchInput'>
            <div class="search-top">
                <span class="search-box-text">日期范围：</span>
                <el-date-picker
                    style="font-size: 15px;"
                    v-model="timeDate"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                ></el-date-picker>

                <!-- <span class="search-box-text">模糊查询：</span> -->
                <Input style="width:auto" 
                    v-model="search"
                    placeholder="角色名称、描述关键字"
                    clearable
                    @on-enter="clickSub"
                    @on-clear='logData'
                    @on-change='logData'
                />
                <Button type="primary" @click="logData" icon="ios-search">查找</Button>
            </div>
        </div>

        <!-- 信息列表 -->
        <Table border :columns='columns' :data='logList'>
            <template slot-scope="{row}" slot="AdminID">
                [{{row.AdminID}}] {{row.LoginName}}
            </template>
            
            <template slot-scope="{row}" slot="RoleTypeName">
                <font v-if="row.RoleTypeName==null">-</font>
                <font v-else>{{row.RoleTypeName}}</font>
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

    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:'loginHistory',
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                return time.getTime() > Date.now();
                },
            },
            timeDate:'',
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            logList:[],
            columns:[
              {
                 title:'id',
                 key: 'LogID',
                //  minWidth:'90px',
                 width:'60px',
                 align:'center'
              },
              {
                  title:'用户名',
                  slot:'AdminID',
                  width:'130px',
                  align:'center'
              },{
                  title:'类型',
                  slot:'RoleTypeName',
                  width:'140px',
                  align:'center'
              },{
                  title:'昵称',
                  key:'NickName',
                  width:'160px',
                  align:'center',
              },{
                  title:'详情',
                  tooltip:'true',
                  key:'Detail',
                  minWidth:100,
                  align:'center'
              },{
                  title:'操作时间',
                  tooltip:'true',
                  key:'CreateTime',
                  width:'150px',
                  align:'center'
              },

          ],
            sels: "",
            form: {
                oper: "",
                opeTime: "",
                opeType: "",
                opeInner: "",
            },
            search:'',
        }
    },
    created() {
        this.defaultDate();
        this.logData();
    },
    methods: {
        changePage(val){
            this.currentPage=val;
            this.logData();
        },
        /**
         * 改变页数
         */
        changePagesize(val){
            this.pageSize=val;
            this.logData();
        },

        //获取登录历史数据
        logData(){
            axios({
                url: this.$store.state.UrlIP + "/admin/getLogs",
                method: "get",
                params: {
                    key: this.search,
                    startTime: this.timeDate[0],
                    endTime: this.timeDate[1],
                    pageIndex: this.currentPage,
                    pageSize: this.pageSize,
                },
                headers: {
                 "Content-type": "application/x-www-form-urlencoded",
                },
            })
                .then((res) => {
                if (res.data.code == 0) {
                    console.log(res.data.data);
                    this.logList = res.data.data;
                    this.totalCount = res.data.respPage.totalCount;
                } else {
                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message:
                            "<span style='font-size: 20px;margin-left: 20px'>错误代码" +
                            res.data.code +
                            " 错误信息：" +
                            res.data.msg +
                            "</span>",
                        type: "error",
                        customClass: "zZindex",
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                this.$message({
                    dangerouslyUseHTMLString: true,
                    message:
                    "<span style='font-size: 20px;margin-left: 20px'>系统错误！</span>",
                    type: "error",
                    customClass: "zZindex",
                });
            });
        },


        //设置默认时间
        defaultDate() {
            //获取新的时间(2019.4.12）
            let date = new Date();
            //获取当前时间的年份转为字符串
            let year = date.getFullYear().toString(); //'2019'
            //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
            let month =
                date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1).toString()
                : (date.getMonth() + 1).toString(); //'04'
            //获取天，判断是否小于10，如果是在字符串前面拼接'0'
            let da =
                date.getDate() < 10
                ? "0" + date.getDate().toString()
                : date.getDate().toString(); //'12'
            //字符串拼接，开始时间，结束时间
            let end = year + "-" + month + "-" + da; //当天'2019-04-12'
            let beg = year + "-" + month + "-01"; //当月第一天'2019-04-01'

            let beg3 = new Date(new Date().getTime() - 3600 * 1000 * 24 * 1);
            let begYear = beg3.getFullYear().toString();
            let begMonth =
                beg3.getMonth() + 1 < 10
                ? "0" + (beg3.getMonth() + 1).toString()
                : (beg3.getMonth() + 1).toString();
            let begDay =
                beg3.getDate() < 10
                ? "0" + beg3.getDate().toString()
                : beg3.getDate().toString();

            let begTime = begYear + "-" + begMonth + "-" + begDay;

            this.timeDate = [begTime, end]; //将值设置给插件绑定的数据
        },

        //将标准日期转换为年月日
        setTime(time) {
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            var d = time.getDate();
            d = d < 10 ? "0" + d : d;
            // var h = time.getHours();
            // var minute = time.getMinutes();
            // minute = minute < 10 ? ('0' + minute) : minute;
            return y + "-" + m + "-" + d;
        },
        //搜索
        clickSub(){
            this.logData();
        },
    },
}
</script>>
<style scoped>
/*删除弹框*/
  .del-dialog-cnt{
    font-size: 16px;
    text-align: center
  }
  .ivu-icon-ios-apps{
    float: left !important;
    margin-top: 2px !important;
}
</style>

<style>
.el-message{
    height: 100px;
    width: 600px;
    font-size: 35px !important;
    font-weight: bold;
  }
  .zZindex {
    z-index:3000 !important;
    font-size: 35px !important;
    font-weight: bold;
  }
</style>