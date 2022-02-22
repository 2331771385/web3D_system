<template>
  <div class="tableContainer">
    <div class="table-label">
      <Icon type="ios-apps" size="22" />
      <el-tooltip content="点击跳转，获取更流程的访问体验" placement="top">
        <span class="pageTitle" @click="clickToVrWalk">虚拟漫游</span>
      </el-tooltip>
    </div>

    <div>
      <iframe
        src="http://202.194.14.204:8080/#/p_index"
        id="mobsf"
        scrolling="no"
        frameborder="0"
      ></iframe>
    </div>
  </div>
</template>

 
 
<script>
export default {
  data() {
    return {};
  },
  mounted() {
    /**
     * iframe-宽高自适应显示
     */
    function changeMobsfIframe() {
      const mobsf = document.getElementById("mobsf");
      const deviceWidth = document.body.clientWidth;
      const deviceHeight = document.body.clientHeight;
      mobsf.style.width = Number(deviceWidth) - 260 + "px"; //数字是页面布局宽度差值
      mobsf.style.height = Number(deviceHeight) + "px"; //数字是页面布局高度差
    }

    changeMobsfIframe();

    window.onresize = function () {
      changeMobsfIframe();
    };
  },
  methods: {
    clickToVrWalk() {
      window.open("http://202.194.14.204:8080/");    
    },
  },
};
</script>

<style scoped>
.ivu-icon-ios-apps {
  float: left !important;
  margin-top: 2px !important;
}
.update-dialog-table {
  height: 300px;
  overflow: scroll;
  overflow-x: hidden;
}
</style>
<style>
.el-message {
  height: 100px;
  width: 600px;
  font-size: 35px !important;
  font-weight: bold;
}
.zZindex {
  z-index: 3000 !important;
  font-size: 35px !important;
  font-weight: bold;
}
.ivu-input {
  display: inline-block;
  width: 100%;
  height: 40px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 14px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border 0.2s ease-in-out, backgrou;
}
.path-node-table {
  height: 400px;
  overflow: scroll;
  overflow-x: hidden;
}
.item-imgs {
  width: 60px;
  height: 60px;
}
</style>