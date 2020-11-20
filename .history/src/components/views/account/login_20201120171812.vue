<template>
  <div class="login-vue" :style="bg">
    <div class="header">
      <img src="../../../../static/img/logo.png" />
      <span class="line"></span>
    </div>
    <div class="container">
      <p class="title">欢迎使用山东大学数字孪生管理系统</p>
      <Form class="formBox" ref="form" :model="form" :rules="ruleLogin">
        <FormItem prop="user">
          <div class="input-c">
            <Input
              prefix="ios-contact"
              clearable
              type="text"
              v-model="form.user"
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
              v-model="form.password"
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
                type="password"
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
        user: "",
        password: "",
        validateCode: "",
        checked: false,
      },
      /**
       * 用户名与密码验证
       */
      ruleLogin: {
        user: [
          {
            required: true,
            message: "请填写用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请填写密码",
            trigger: "blur",
          },
          {
            type: "string",
            min: 6,
            message: "密码不得少于6位",
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
    register() {
      console.log("注册账号");
      this.registerVisible = true;
    },
    forgetPwd() {
      console.log("忘记密码");
    },
    handleSubmit(name) {
      this.isShowLoading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          //   this.$Message.success("Success!");
          //验证登录
          axios({
            url: this.$store.state.UrlIP + "/admin/login",
            method: "get",
            params: {
              loginName: this.form.loginName,
              password: this.$md5(this.form.password),
              code: this.form.validateCode,
            },
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
          })
            .then((res) => {
              this.isShowLoading = false;
              if (res.data.code != 0) {
                if (res.data.code === 200) {
                  this.$Message.error("用户名不存在或停用，请检查！");
                } else if (res.data.code === 201) {
                  this.$Message.error("用户名或密码错误，请重新输入！");
                } else if (res.data.code === 203) {
                  this.$Message.error("验证码错误");
                  this.getValidateCode();
                } else if (res.data.code === 204) {
                  this.$Message.error("验证码已过期，请重新刷新！");
                }
              }
              /** 判断是否勾选了记住密码
               * 如果勾住了这一个选项，就代表下次再登陆的时候，不必需要重新输入用户名和密码
               * 再登陆成功之后，会将用户名和密码存储在cookie中
               */
              if (this.form.checked) {
                //如果勾选了记住密码选项，就调用设置cookie的方法,第三个参数是记住密码时长
                this.setCookie(this.form.loginName, this.form.loginPassword, 7);
              } else {
                this.clearCookie();
              }
              this.userToken = res.data.data.token; //将后台返回的token记录在用户token列表中
              this.userDataRange = JSON.stringify(res.data.data.dataRange);
              this.userId = res.data.data.roleID;
              let authorization = res.data.data.authority;
              let arr = [];
              for (let key in authorization) {
                if (arr.indexOf(authorization[key]) == -1) {
                  arr.push(authorization[key]);
                }
              }
              this.permissionList = arr;
              this.changeLogin({
                Authorization: this.userToken,
                UserID: this.userId,
                UserDataRange: this.userDataRange,
                PassWord: this.form.loginPassword,
                UserName: this.form.loginName,
                // PermissionList:this.permissionList
              });
              if (this.userToken) {
                this.$router.push("/home");
              } else {
                this.$router.replace("/login");
              }
            })
            .catch((error) => {
              console.log("ERROR:" + error);
            });
        } else {
          this.$Message.error("Fail!");
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
    // submit() {
    //   if (this.account === "admin" && this.pwd === "admin") {
    //     this.isShowLoading = true;
    //     // 登陆成功 设置用户信息
    //     localStorage.setItem(
    //       "userImg",
    //       "https://avatars3.githubusercontent.com/u/22117876?s=460&v=4"
    //     );
    //     // localStorage.setItem("userName", "小明");
    //     // // 登陆成功 假设这里是后台返回的 token
    //     // localStorage.setItem("token", "i_am_token");
    //     this.$router.push({ path: this.redirect || "/" });
    //   } else {
    //     if (this.account !== "admin") {
    //       this.accountError = "账号为admin";
    //     }

    //     if (this.pwd !== "admin") {
    //       this.pwdError = "密码为admin";
    //     }
    //   }
    // },
  },
};
</script>

<style>
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
.header {
  background: rosybrown;
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
  margin: 45px 0 0 0px;
}
.login-vue {
  height: 100%;
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
  color: rgba(255, 255, 255, 0.8);
}
.login-vue :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(255, 255, 255, 0.8);
}
.login-vue ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(255, 255, 255, 0.8);
}
.login-vue :-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: rgba(255, 255, 255, 0.8);
}
.login-vue .title {
  font-size: 16px;
  margin-bottom: 20px;
}
.login-vue .formBox {
  width: 250px;
  margin: auto;
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


