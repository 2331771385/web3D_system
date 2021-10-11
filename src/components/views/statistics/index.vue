<template>
  <div class="container">
    <el-card class="box-card">
      <!-- <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div> -->
      <div>
          <line-chart></line-chart>
      </div>
    </el-card>

    <el-card class="box-card">
      <!-- <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div> -->
      <div>我是echarts图表</div>
    </el-card>

    <el-card class="box-card">
      <!-- <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div> -->
      <div>我是echarts图表</div>
    </el-card>

    <el-card class="box-card">
      <!-- <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div> -->
      <div>我是echarts图表</div>
    </el-card>
  </div>
</template>
<script>
import LineChart from "../../charts/line-chart.vue";
// import BarChart from "../../charts/bar-chart.vue";
export default {
  name: "statistics",
  components: {
      LineChart,
    //   BarChart
  },
  data() {
    return {};
  },
  watch: {},
  created() {},
  methods: {},
};
</script>
<style scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.box-card {
  width: 45%;
  height: 45%;
  margin: 5px 10px 0 10px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>