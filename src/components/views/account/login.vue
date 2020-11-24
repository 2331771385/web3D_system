<template>
  <div class="login-vue" :style="bg">
    <div class="header">
      <img src="../../../../static/img/logo.png" />
      <span class="line"></span>
      <span class="header-title">数字孪生管理系统</span>
    </div>
    <div class="container">
      <!-- <p class="title">欢迎使用山东大学数字孪生管理系统</p> -->
      <Form class="formBox" ref="form" :model="form" :rules="ruleLogin">
        <FormItem prop="user">
          <div class="input-c">
            <Input
              prefix="ios-contact"
              clearable
              type="text"
              v-model="form.loginName"
              placeholder="用户名"
            >
            </Input>
          </div>
        </FormItem>
        <FormItem prop="password">
          <div class="input-c">
            <Input
              prefix="md-lock"
              clearable
              type="password"
              v-model="form.loginPassword"
              placeholder="密码"
            >
            </Input>
          </div>
        </FormItem>
        <FormItem prop="validateCode">
          <div class="input-c">
            <div style="width: 140px; margin-left: 2px">
              <Input
                prefix="md-lock"
                clearable
                v-model="form.validateCode"
                placeholder="验证码"
              ></Input>
            </div>
            <img
              :src="vcode"
              title="点击刷新"
              alt="点击刷新"
              class="code"
              @click="getValidateCode"
            />
          </div>
        </FormItem>
        <div class="opeBox">
          <div class="opeBox-checkBox">
            <Checkbox v-model="form.checked">记住密码</Checkbox>
          </div>
          <span @click="forgetPwd">忘记密码</span>
        </div>
        <FormItem>
          <Button
            :loading="isShowLoading"
            class="submit"
            type="error"
            @click="handleSubmit('form')"
            >账号登录</Button
          >
        </FormItem>
      </Form>
      <!-- <p class="account"></p> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
export default {
  name: "login",
  data() {
    return {
      isShowLoading: false,
      bg: {},
      /**
       * 登录表单
       */
      form: {
        loginName: "",
        loginPassword: "",
        validateCode: "",
        checked: false,
      },
      /**
       * 用户名与密码验证
       */
      ruleLogin: {
        loginName: [
          {
            required: true,
            message: "请填写用户名",
            trigger: "blur",
          },
        ],
        loginPassword: [
          {
            required: true,
            message: "请填写密码",
            trigger: "blur",
          },
        ],
        validateCode: [
          {
            required: true,
            message: "请填写验证码",
            trigger: "blur",
          },
        ],
      },
      /**
       * 验证码图片
       */
      vcode: "",
      /**
       * 注册弹窗
       */
      registerVisible: false,
      loading: true,
      userToken: "",
      userId: "",
      permissionList: [],
    };
  },
  created() {
    this.bg.backgroundImage =
      //   "url(" +
      //   require("@/assets/loginPic/bg0" + new Date().getDay() + ".jpg") +
      //   ")";
      "url(" + require("@/assets/loginPic/bg01.jpg") + ")";
    this.bg.backgroundRepeat = "no-repeat";
    this.bg.backgroundSize = "100%";
    this.getValidateCode();
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations(["changeLogin"]),
    register() {
      console.log("注册账号");
      this.registerVisible = true;
    },
    forgetPwd() {
      console.log("忘记密码");
    },
    /**
     * 清除cookie
     */
    clearCookie() {
      this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
    },
    /**
     * 设置cookie
     */
    setCookie(userName, userPass, day) {
      var time = new Date(); //获取当前时间
      time.setTime(time.getTime() + 60 * 60 * 24 * 1000 * day); //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "userPwd" + "=" + userPass + ";path=/;expires=" + time.toGMTString();
      window.document.cookie =
        "userName" + "=" + userName + ";path=/;expires=" + time.toGMTString();
    },
    /**
     * 登录
     */
    handleSubmit(name) {
      this.isShowLoading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          //验证登录
          axios({
            url: this.$store.state.UrlIP + "/admin/login",
            method: "get",
            params: {
              loginName: this.form.loginName,
              password: this.$md5(this.form.loginPassword),
              code: this.form.validateCode,
            },
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
          })
            .then((res) => {
              this.isShowLoading = false;
              if (res.data.code == 0) {
                console.log(res.data.data);
                if (this.form.checked) {
                  //如果勾选了记住密码选项，就调用设置cookie的方法,第三个参数是记住密码时长
                  this.setCookie(
                    this.form.loginName,
                    this.form.loginPassword,
                    7
                  );
                } else {
                  this.clearCookie();
                }
                this.userToken = res.data.data.token; //将后台返回的token记录在用户token列表中
                // this.userId = res.data.data.roleID;
                // let authorization = res.data.data.authority;
                // let arr = [];
                // for (let key in authorization) {
                //   if (arr.indexOf(authorization[key]) == -1) {
                //     arr.push(authorization[key]);
                //   }
                // }
                // this.permissionList = arr;
                // this.changeLogin({
                //   Authorization: this.userToken,
                //   UserID: this.userId,
                //   PassWord: this.form.loginPassword,
                //   UserName: this.form.loginName,
                //   // PermissionList:this.permissionList
                // });
                if (this.userToken) {
                  console.log('要跳转的页面');
                  this.$router.push("/home");
                } else {
                  this.$router.replace("/login");
                }
              } else {
                this.$Message.error(res.data.msg);
                this.getValidateCode();
              }
            })
            .catch((error) => {
              console.log("ERROR:" + error);
            });
        } else {
          this.$Message.error("请检查用户名及密码!");
        }
      });
    },
    /**
     * 获取验证码
     */
    getValidateCode() {
      this.vcode =
        this.$store.state.UrlIP +
        "/admin/getValidateCode?d=" +
        new Date().getTime(); //如果成功就显示当前的验证码
    },
  },
};
</script>
<style scoped>
.header {
  position: absolute;
  width: 100%;
  height: 15%;
  top: 0;
}
.header img {
  float: left;
  margin-left: 10%;
  margin-top: 1%;
}
.header .line {
  height: 58px;
  border-left: 1px solid #fff;
  float: left;
  width: 20px;
  margin: 2% 0 0 10px;
}
.header .header-title {
  float: left;
  font-size: 28px;
  color: #fff;
  margin-top: 45px;
}
.login-vue {
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: black;
}
.login-vue .container {
  background: rgba(228, 228, 228, 0.8);
  width: 400px;
  text-align: center;
  border-radius: 5px;
  padding: 30px;
  margin-right: 15%;
}
.login-vue .ivu-input {
  background-color: transparent;
  color: black;
  outline: #fff;
  border-color: rgb(168, 0, 1);
}
.login-vue ::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: rgba(168, 0, 1, 0.6);
}
.login-vue :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(168, 0, 1, 0.6);
}
.login-vue ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(168, 0, 1, 0.6);
}
.login-vue :-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: rgba(168, 0, 1, 0.6);
}
.login-vue .title {
  font-size: 16px;
  margin-bottom: 20px;
}
.login-vue .formBox {
  width: 250px;
  margin: auto;
  margin-top: 20px;
}
.login-vue .input-c {
  margin: auto;
  width: 250px;
}
.opeBox {
  height: 30px;
  width: 250px;
}
.opeBox-checkBox {
  width: 190px;
  float: left;
  text-align: left;
}

.ivu-form-item-error-tip {
  text-align: left;
  margin: auto;
  font-size: 12px;
  padding-left: 30px;
  height: 20px;
}
.login-vue .submit {
  width: 250px;
}
.login-vue .opeBox span {
  cursor: pointer;
  margin-right: 0px;
  /* float: right; */
}
.login-vue .ivu-icon {
  color: rgb(168, 0, 1);
}
.login-vue .ivu-icon-ios-close-circle {
  color: rgb(161, 0, 0);
}
.code {
  height: 35px;
  width: 90px;
  /* line-height: 90px; */
  /* position: relative; */
  margin-top: -33px;
  /* margin-right: 20px; */
  float: right;
  z-index: 999;
  /*z-index属性设置元素的堆叠顺序，拥有更高堆叠顺序的元素总是会处于堆叠顺序较低的元素的前面
     该属性可以设置一个元素在另一个元素里面 */
}
</style>


