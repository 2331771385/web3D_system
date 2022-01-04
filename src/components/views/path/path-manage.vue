<template>
  <div class="tableContainer">
    <div class="table-label">
      <Icon type="ios-apps" size="22" />
      <span class="pageTitle">路径数据列表</span>
    </div>
    <!-- 搜索框 -->
    <div class="searchInput">
      <div class="search-top">
        <span class="search-box-text">校区:</span>
        <el-select v-model="campus" style="width: 200px" clearable>
          <el-option
            v-for="item in campusList"
            :key="item.id"
            :label="item.campusName"
            :value="item.id"
          ></el-option>
        </el-select>
        <!-- <span class="search-box-text">公共服务分类:</span>
                <Select v-model="psortVal" style="width:200px">
                    <Option v-for="item in pathSortList" :key="item.id" :label="item.name" :value="item.id"></Option>
                </Select> -->
        <span class="search-box-text">模糊查询:</span>
        <Input
          style="width: 260px"
          v-model="search"
          placeholder="路径名称关键字"
          clearable
          @on-enter="clickSub"
          @on-clear="getPathList"
          @on-change="getPathList"
        />
        <Button type="primary" @click="getPathList" icon="ios-search"
          >查找</Button
        >
        <Button type="success" @click="addInfo" icon="ios-add">新增</Button>
      </div>
    </div>

    <!-- 列表数据 -->
    <Table border :columns="columns" :data="dataList">
      <template slot-scope="{ row }" slot="state">
        <font v-if="row.data != ''" color="green">正常</font>
        <font v-else color="orange">未标注</font>
      </template>

      <template slot-scope="{ row }" slot="createTime">
        <font v-if="row.createTime == null || row.createTime == undefined"
          >-</font
        >
        <font v-else>{{ row.createTime }}</font>
      </template>

      <template slot-scope="{ row }" slot="updateTime">
        <font v-if="row.updateTime == null || row.updateTime == undefined">{{
          row.createTime
        }}</font>
        <font v-else>{{ row.updateTime }}</font>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <Button
          type="primary"
          @click="handleOpen(row, index)"
          size="small"
          style="marginright: 5px"
          >标注</Button
        >
        <Button
          type="info"
          size="small"
          style="marginright: 5px"
          @click="updateInfo(row, index)"
          >修改</Button
        >
        <Button
          type="error"
          size="small"
          style="marginright: 5px"
          @click="deleteInfo(row, index)"
          >删除</Button
        >
      </template>
    </Table>

    <!-- 分页操作 -->
    <template>
      <Page
        class="pageIndex"
        :total="totalCount"
        size="small"
        show-elevator
        show-sizer
        show-total
        @on-change="changePage"
        @on-page-size-change="changePagesize"
      >
      </Page>
    </template>

    <!-- 新增路径信息 -->
    <el-dialog title="添加路径信息" :visible.sync="addVisible" width="800px">
      <el-form
        :model="form"
        ref="form"
        label-width="115px"
        :rules="rules2"
        class="demo-ruleForm"
      >
        <el-form-item label="校区名称:" prop="campusId">
          <el-select
            v-model="form.campusId"
            style="width: 300px; margin-bottom: 5px"
          >
            <el-option
              v-for="item in campusList"
              :key="item.id"
              :label="'[' + item.id + ']' + item.campusName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="路径名称:" prop="pathName">
          <el-input
            v-model="form.pathName"
            placeholder="路径名称"
            style="width: 300px; margin-bottom: 5px"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="路径信息:">
          <el-input
            v-model="form.pathMsg"
            placeholder="可稍后可视化标注，也可直接输入json"
            style="width: 300px; margin-bottom: 5px"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="tableBtn" @click="addVisible = false"
          >取 消</el-button
        >
        <el-button class="tableBtn" type="primary" @click="saveAdd('form')"
          >确定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改路径 -->
    <el-dialog title="修改路径信息" :visible.sync="updateVisible" width="500px">
      <el-form
        :model="form"
        ref="form"
        label-width="115px"
        :rules="rules2"
        class="demo-ruleForm"
      >
        <el-form-item label="校区名称:" prop="campusId">
          <el-select
            disabled
            v-model="form.campusId"
            style="width: 250px; margin-bottom: 5px"
          >
            <el-option
              v-for="item in campusList"
              :key="item.id"
              :label="'[' + item.id + ']' + item.campusName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="路径名称:" prop="pathName">
          <el-input
            v-model="form.pathName"
            placeholder="路径名称"
            style="width: 250px; margin-bottom: 5px"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="路径信息:">
          <el-input
            v-model="form.pathMsg"
            placeholder="路径信息"
            style="width: 250px; margin-bottom: 5px"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 列表数据 -->
      <div class="update-dialog-table">
        <Table border :columns="updateColumns" :data="pathNodesArr">
          <template slot-scope="{ row }" slot="createTime">
            <font v-if="row.createTime == null || row.createTime == undefined"
              >-</font
            >
            <font v-else>{{ row.createTime }}</font>
          </template>

          <template slot-scope="{ row }" slot="updateTime">
            <font
              v-if="row.updateTime == null || row.updateTime == undefined"
              >{{ row.createTime }}</font
            >
            <font v-else>{{ row.updateTime }}</font>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="error"
              size="small"
              style="marginright: 5px"
              @click="deleteNode(row, index)"
              >删除</Button
            >
          </template>
        </Table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="tableBtn" type="success" @click="addNodes()"
          >添加节点</el-button
        >
        <el-button class="tableBtn" type="primary" @click="saveUpdate('form')"
          >确定</el-button
        >
        <el-button class="tableBtn" @click="updateVisible = false"
          >取消</el-button
        >
      </span>
    </el-dialog>

    <!-- :before-close="handleClose" -->
    <el-dialog title="添加节点" :visible.sync="addNodeShow" width="400px">
      <template>
        <el-select
          style="width: 300px"
          v-model="nodeSearchKey"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in pathNodeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="insertNode()">确定</el-button>
        <el-button @click="addNodeShow = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import VModelManage from "./path-edit.vue";
export default {
  name: "path-manage",
  components: { VModelManage },
  data() {
    return {
      dataList: [],
      columns: [
        {
          title: "id",
          key: "pathId",
          //  minWidth:'90px',
          width: "100px",
          align: "center",
        },
        {
          title: "路径名称",
          key: "pathName",
          //  minWidth:'90px',
          width: "150px",
          align: "center",
        },
        {
          title: "途经节点",
          key: "pathNodesStr",
          minWidth: 250,
          align: "center",
        },
        {
          title: "创建时间",
          slot: "createTime",
          minWidth: 80,
          // width:'160px',
          align: "center",
        },
        {
          title: "修改时间",
          slot: "updateTime",
          minWidth: 80,
          // width:'160px',
          align: "center",
        },
        {
          title: "状态",
          slot: "state",
          //  minWidth:'90px',
          width: "100px",
          align: "center",
        },
        {
          title: "操作",
          width: "250px",
          slot: "action",
          align: "center",
        },
      ],
      updateColumns: [
        {
          title: "id",
          key: "id",
          //  minWidth: 90,
          width: "60px",
          align: "center",
        },
        {
          title: "节点名称",
          key: "name",
          //  minWidth: 90,
          width: "120px",
          align: "center",
        },
        {
          title: "创建时间",
          key: "createTime",
          //  minWidth: 90,
          width: "170px",
          align: "center",
        },
        // {
        //   title: "修改时间",
        //   key: "updateTime",
        //   //  minWidth: 90,
        //   width: "180px",
        //   align: "center",
        // },
        // {
        //   title: "节点信息",
        //   key: "data",
        //   minWidth: 90,
        //   // width: "200px",
        //   align: "center",
        //   ellipsis: true,
        // },
        {
          title: "操作",
          width: "90px",
          slot: "action",
          align: "center",
        },
      ],
      pathNodesArr: [],
      updatePathId: "",
      currentPage: "1",
      pageSize: "10",
      totalCount: 0,
      search: "",
      campus: "",
      campusUrl: "",
      campusList: [],
      form: {
        pathName: "",
        campusId: "", //校区名称
        psthMsg: "", //校区信息
      },
      addVisible: false,
      rules2: {
        campusId: [
          { required: true, message: "校区名称不能为空", trigger: "blur" },
        ],
        pathName: [
          { required: true, message: "路径名称不能为空", trigger: "blur" },
        ],
      },
      updateVisible: false,
      index: "",
      msg: "",
      addNodeShow: false,
      pathNodeList: [],
      nodeSearchKey: "",
    };
  },
  created() {
    this.getCampusList(); //获取校区信息
    // this.getPathList();
  },
  methods: {
    clickSub() {
      this.getPathList();
    },
    getCampusList() {
      axios({
        url: this.$store.state.UrlIP + "/campus/getData",
        method: "get",
        params: {
          pageIndex: "1",
          pageSize: "10",
          token: window.localStorage.getItem("Authorization"),
        },
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      })
        .then((res) => {
          if (res.data.code == 0) {
            res.data.data.forEach((item) => {
              this.campusList.push({
                id: item.campusId,
                campusName: item.campusName,
              });
            });

            this.campus = 1;
            this.getPathList(); //获取监控列表的信息
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 获取路径信息
     */
    getPathList() {
      return new Promise((resolve, reject) => {
        axios({
          url: this.$store.state.UrlIP + "/vr/path/getData",
          method: "get",
          params: {
            pageIndex: this.currentPage,
            pageSize: this.pageSize,
            campusId: this.campus,
            key: this.search,
            pathId: "",
            token: window.localStorage.getItem("Authorization"),
          },
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
        })
          .then((res) => {
            if (res.data.code == 0) {
              this.dataList = res.data.data;
              for (let data of this.dataList) {
                if (data.pathNodes == null || data.pathNodes.length == 0) {
                  data.pathNodesStr = "-";
                  continue;
                }
                let pathNodes = [];
                for (let node of data.pathNodes) {
                  pathNodes.push(node.name);
                }
                data.pathNodesStr = pathNodes.join(",");
              }
              this.totalCount = res.data.respPage.totalCount;
              resolve();
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },

    /**
     * 新增路径节点
     */
    addNodes() {
      this.addNodeShow = true;
      // 获取节点列表
      this.getBuildingList();
    },

    /**
     * 获取节点列表
     */
    getBuildingList() {
      this.pathNodeList = [];
      axios({
        url: this.$store.state.UrlIP + "/building/getData",
        method: "get",
        params: {
          campusId: this.campus,
          token: window.localStorage.getItem("Authorization"),
        },
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      })
        .then((res) => {
          for (let data of res.data.data) {
            this.pathNodeList.push({
              id: data.buildId,
              name: data.buildName,
            });
          }
          this.addNodeShow = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 刷新路径列表及节点列表
     */
    async refreshTable() {
      await this.getPathList(); // 保证同步

      // 重新请求修改dialog中的table数据
      this.dataList.forEach((ele) => {
        if (ele.pathId == this.updatePathId) {
          this.pathNodesArr = ele.pathNodes;
        }
      });
    },

    /**
     * 保存新增节点
     */
    insertNode() {
      axios({
        url: this.$store.state.UrlIP + "/vr/pathNode/insert",
        method: "post",
        params: {
          pathID: this.msg.pathId,
          objId: this.nodeSearchKey,
          typeId: 1,
          token: window.localStorage.getItem("Authorization"),
        },
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      })
        .then((res) => {
          if (res.data.code == 0) {
            this.refreshTable();
            this.$Message["success"]({
              background: true,
              content: "操作成功！",
            });
            this.addNodeShow = false;
          } else {
            alert("插入重复节点");
            throw new Error(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //新增路径信息
    addInfo() {
      this.addVisible = true;
      this.form = {
        pathName: "",
        campusId: "",
        pathMsg: "",
      };
    },

    // 进入标注
    handleOpen(row, index) {
      this.openCesiumLabShow = false;
      axios({
        url: this.$store.state.UrlIP + "/campus/getData",
        method: "get",
        params: {
          pageIndex: "1",
          pageSize: "10",
          campusId: this.campus,
          token: window.localStorage.getItem("Authorization"),
        },
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      })
        .then((res) => {
          if (res.data.code == 0) {
            this.campusUrl = JSON.parse(res.data.data[0].data).czmObject.url;
            this.$router.push({
              name: "path-edit",
              params: {
                pathId: row.pathId,
                data: row.data,
                campusUrl: this.campusUrl,
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //添加路径信息的确定按钮
    saveAdd(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let formData = new FormData();
          formData.append("pathName", this.form.pathName);
          formData.append("campusId", this.form.campusId);
          formData.append("data", this.form.pathMsg);
          formData.append(
            "token",
            window.localStorage.getItem("Authorization")
          );

          axios({
            url: this.$store.state.UrlIP + "/vr/path/insert",
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
                this.addVisible = false;
                this.getPathList();
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
        } else {
          this.$message({
            dangerouslyUseHTMLString: true,
            message:
              "<span style='font-size: 20px;margin-left: 20px'>请输入有效信息！</span>",
            type: "warning",
            customClass: "zZindex",
          });
        }
      });
    },

    // 修改路径信息
    updateInfo(row, index) {
      this.msg = row;
      this.updatePathId = row.pathId;
      this.form = {
        pathName: row.pathName,
        campusId: row.campusId,
        pathMsg: row.data,
      };
      this.pathNodesArr = row.pathNodes;
      this.updateVisible = true;
    },

    saveUpdate(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let formData = new FormData();
          formData.append("pathId", this.msg.pathId);
          formData.append("pathName", this.form.pathName);
          formData.append("campusId", this.form.campusId);
          formData.append("data", this.form.pathMsg);
          formData.append(
            "token",
            window.localStorage.getItem("Authorization")
          );
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
                this.updateVisible = false;
                this.getPathList();
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
        } else {
          this.$message({
            dangerouslyUseHTMLString: true,
            message:
              "<span style='font-size: 20px;margin-left: 20px'>请输入有效信息！</span>",
            type: "warning",
            customClass: "zZindex",
          });
        }
      });
    },

    changePage(val) {
      this.currentPage = val;
      this.getPathList();
    },
    changePagesize(val) {
      this.pageSize = val;
      this.getPathList();
    },

    // 删除操作
    deleteInfo(row, index) {
      console.log(row);
      this.$Modal.confirm({
        title: "注意",
        content: "是否删除路径及其相关信息？",
        onOk: () => {
          this.handleDelete(row.pathId);
        },
        onCancel: () => {
          this.$Message.info("取消删除");
        },
      });
    },
    /**
     * 删除路径节点
     */
    deleteNode(row, index) {
      this.$confirm("是否删除节点及其相关信息？", "注意", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.handleDeletePathNode(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * 删除虚拟漫游路径中的节点
     */
    handleDeletePathNode(id) {
      this.$axios({
        url: this.$store.state.UrlIP + "/vr/pathNode/delData",
        method: "post",
        params: {
          id: id,
          token: window.localStorage.getItem("Authorization"),
        },
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (res.data.code == 0) {
            this.refreshTable();
            this.$Message["success"]({
              background: true,
              content: "操作成功！",
            });
          }
        })
        .catch((err) => {
          this.$Message["error"]({
            background: true,
            content: err,
          });
        });
    },
    handleDelete(pathId) {
      this.$axios({
        url: this.$store.state.UrlIP + "/vr/path/updateData",
        method: "post",
        params: {
          pathId,
          state: 1,
          token: window.localStorage.getItem("Authorization"),
        },
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (res.data.code == 0) {
            this.$Message["success"]({
              background: true,
              content: "操作成功！",
            });
            this.getPathList();
          }
        })
        .catch((err) => {
          console.log(err);
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
</style>