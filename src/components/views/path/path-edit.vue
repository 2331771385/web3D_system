<template>
  <div style="height: 100%; width: 100%">
    <div class="table-label">
      <Icon type="ios-apps" size="22" />
      <span class="pageTitle">路径编辑</span>
    </div>
    <!-- 搜索框 -->
    <div class="searchInput">
      <div class="search-top">
        <Button type="error" icon="ios-add" @click="addVisible = !addVisible"
          >创建</Button
        >
        <Button type="primary" @click="editing = !editing">修改</Button>
        <Button type="success" @click="saveVisible = !saveVisible">保存</Button>
      </div>
    </div>
    <div ref="earthContainer" style="width: 100%; height: 120%"></div>

    <el-dialog title="创建警告" :visible.sync="addVisible" width="400px">
      进入创建状态后，会清空已有标注，请谨慎选择！
      <span slot="footer" class="dialog-footer">
        <el-button
          class="tableBtn"
          @click="
            creating = true;
            addVisible = false;
          "
          >确定</el-button
        >
        <el-button class="tableBtn" type="primary" @click="addVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="saveVisible" width="400px">
      点击确定将保存
      <span slot="footer" class="dialog-footer">
        <el-button
          class="tableBtn"
          type="primary"
          @click="
            saveVisible = false;
            saveData();
          "
          >确定</el-button
        >
        <el-button class="tableBtn" @click="saveVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>


<script>
import axios from "axios";
export default {
  name: "path-edit",
  props: {},
  data() {
    return {
      _earth: undefined,
      // 是否处于创建状态
      // 设置为true以后，将进入重新创建的状态；此时可以使用鼠标左键在三维窗口中点击来创建路径的关键点，当点击鼠标右键，则表示创建完成。此时该属性会自动变成false。
      creating: false,
      // 是否处于编辑状态
      // 设置为true以后，将进入重新创建的状态；此时可以使用鼠标左键在三维窗口中选取需要修改路径的关键点，当点击鼠标右键，则表示编辑完成。此时该属性会自动变成false。
      editing: false,
      pathId: this.$route.params.pathId,
      data: {
        ref: "path1",
        czmObject: {
          xbsjType: "Path",
          positions: [],
          rotations: [],
          show: true, // 显示路径
          loop: false, // 是否为环线
          showDirection: true, // 显示方向(默认为true)
          // 是否处于播放状态
          // 如果属性值为true，则所有'current'开头的相关属性会动态发生变化。 可以通过手动设置为false，来结束播放状态。 当loopPlay属性为false时，playing属性会在路径播放到最后一个关键点的位置时，自动变为false。
          playing: false,
          // 是否循环播放
          // 如果为false，则playing设置为true时，会从当前位置播放到最后一个关键点，并停止播放，此时playing属性会自动变成false。 若此属性为true时，播放到最后一个关键点以后，将自动重第一个关键点继续播放。
          loopPlay: false,
          alwaysAlongThePath: true, // 始终沿着路径方向运动(默认值为false)
        },
      },
      addVisible: false,
      saveVisible: false,
    };
  },
  created() {},
  mounted() {
    XE.ready().then(() => {
      this.startUp();
    });
  },
  methods: {
    startUp() {
      try {
        if (
          this.$route.params.data != "" ||
          this.$route.params.data != undefined
        ) {
          let positions = JSON.parse(this.$route.params.data).czmObject
            .positions;
          this.data.czmObject.positions = positions;
        }
      } catch (error) {
        console.error();
      }
      var earth = new XE.Earth(this.$refs.earthContainer);
      earth.xbsjFromJSON({
        sceneTree: {
          root: {
            children: [
              {
                ref: "tileset",
                czmObject: {
                  xbsjType: "Tileset",
                  name: "1",
                  xbsjPosition: [
                    2.0429864728534763, 0.6400937703936144,
                    -2.7939677238464355e-9,
                  ],
                  xbsjClippingPlanes: {},
                  xbsjGuid: "50613ef8-4189-46e8-9874-75663ca0fadc",
                  url: this.$route.params.campusUrl,
                  xbsjCustomShader: {},
                },
              },
              this.data,
            ],
          },
        },
      });

      var tileset = earth.sceneTree.$refs.tileset.czmObject;
      var path1 = earth.sceneTree.$refs.path1.czmObject;
      tileset.flyTo();
      this._creatingUnbind = XE.MVVM.bind(this, "creating", path1, "creating");
      this._editingUnbind = XE.MVVM.bind(this, "editing", path1, "editing");
      this._earth = earth;
    },

    saveData() {
      var path1 = this._earth.sceneTree.$refs.path1;
      let formData = new FormData();
      formData.append("pathId", this.pathId);
      formData.append("data", JSON.stringify(path1));
      formData.append("token", window.localStorage.getItem("Authorization"));
      axios({
        url: this.$store.state.UrlIP + "/vr/path/updateData",
        method: "post",
        data: formData,
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      })
        .then((res) => {
          if (res.data.code == 0) {
            this.$Message["success"]({
              background: true,
              content: "操作成功！",
            });
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
        .catch((err) => {
          this.$message({
            dangerouslyUseHTMLString: true,
            message:
              "<span style='font-size: 20px;margin-left: 20px'>系统错误！</span>",
            type: "error",
            customClass: "zZindex",
          });
        });
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