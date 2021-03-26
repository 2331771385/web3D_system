<template>
  <div class="login-vue" :style="bg">
    <div class="container">
      <p class="title">欢迎使用山东大学数字孪生管理系统</p>
      <!-- <div class="input-c">
        <Input
          prefix="ios-contact"
          v-model="account"
          placeholder="用户名"
          clearable
          @on-blur="verifyAccount"
        />
        <p class="error">{{ accountError }}</p>
      </div>
      <div class="input-c">
        <Input
          type="password"
          v-model="pwd"
          prefix="md-lock"
          placeholder="密码"
          clearable
          @on-blur="verifyPwd"
        />
        <p class="error">{{ pwdError }}</p>
      </div>
      <Button
        :loading="isShowLoading"
        class="submit"
        type="error"
        @click="submit"
        >登陆</Button
      > -->
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
          <Input style="width: 100px" v-model="form.validateCode"></Input>
        </FormItem>
        <FormItem>
          <Button
            :loading="isShowLoading"
            class="submit"
            type="error"
            @click="handleSubmit('form')"
            >登陆</Button
          >
        </FormItem>
      </Form>
      <p class="account">
        <span @click="register">注册账号</span> |
        <span @click="forgetPwd">忘记密码</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      account: "admin",
      pwd: "admin",
      accountError: "",
      pwdError: "",
      isShowLoading: false,
      bg: {},
      /**
       * 登录表单
       */
      form: {
        user: "",
        password: "",
        validateCode: "",
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
    };
  },
  created() {
    this.bg.backgroundImage =
      //   "url(" +
      //   require("@/assets/loginPic/bg0" + new Date().getDay() + ".jpg") +
      //   ")";
      "url(" + require("@/assets/loginPic/bg09.jpg") + ")";
    this.bg.backgroundRepeat = "no-repeat";
    this.bg.backgroundSize = "100%";
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
    verifyAccount(e) {
      if (this.account !== "admin") {
        this.accountError = "账号为admin";
      } else {
        this.accountError = "";
      }
    },
    verifyPwd(e) {
      if (this.pwd !== "admin") {
        this.pwdError = "密码为admin";
      } else {
        this.pwdError = "";
      }
    },
    register() {
      console.log("注册账号");
    },
    forgetPwd() {
      console.log("忘记密码");
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    submit() {
      if (this.account === "admin" && this.pwd === "admin") {
        this.isShowLoading = true;
        // 登陆成功 设置用户信息
        localStorage.setItem(
          "userImg",
          "https://avatars3.githubusercontent.com/u/22117876?s=460&v=4"
        );
        // localStorage.setItem("userName", "小明");
        // // 登陆成功 假设这里是后台返回的 token
        // localStorage.setItem("token", "i_am_token");
        this.$router.push({ path: this.redirect || "/" });
      } else {
        if (this.account !== "admin") {
          this.accountError = "账号为admin";
        }

        if (this.pwd !== "admin") {
          this.pwdError = "密码为admin";
        }
      }
    },
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
.formBox {
  width: 210px;
  margin: auto;
}
.login-vue .input-c {
  margin: auto;
  width: 200px;
}
.ivu-form-item-error-tip {
  text-align: left;
  margin: auto;
  font-size: 12px;
  padding-left: 30px;
  height: 20px;
}
.login-vue .submit {
  width: 200px;
}
.login-vue .account {
  margin-top: 30px;
}
.login-vue .account span {
  cursor: pointer;
}
.login-vue .ivu-icon {
  color: rgb(168, 0, 1);
}
.login-vue .ivu-icon-ios-close-circle {
  color: rgb(161, 0, 0);
}
</style>


