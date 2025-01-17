<template>
  <div id="background_panel">
    <div class="loginPanel">
      <div
          id="large_panel"
          :class="{ large_panel_right: isLogin, large_panel_left: !isLogin }"
      >
        <div
            class="main_panel"
            v-show="isLogin"
            @keyup.enter="submitForm('loginForm')"
        >
          <span class="panel_title">用 户 登 录</span>
          <div class="form_panel">
            <el-form :model="loginForm" :rules="rules" ref="loginForm">
              <el-form-item prop="account" class="form_item">
                <el-input
                    v-model="loginForm.account"
                    placeholder="用户名"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password" class="form_item">
                <el-input
                    v-model="loginForm.password"
                    placeholder="密码"
                    show-password
                ></el-input>
              </el-form-item>

              <el-button
                  round
                  style="width: 150px; margin: 0 75px; font-size: 15px;"
                  type="primary"
                  @click="submitForm('loginForm')"
              >登 录
              </el-button
              >
            </el-form>
          </div>
        </div>
        <div
            class="main_panel"
            v-show="!isLogin"
            @keyup.enter="submitForm('adminLoginForm')"
        >
          <span class="panel_title">管 理 员 登 录</span>
          <el-form
              :model="adminLoginForm"
              :rules="adminRules"
              ref="adminLoginForm"
          >
            <el-form-item prop="account" class="form_item">
              <el-input
                  v-model="adminLoginForm.account"
                  placeholder="用户名"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password" class="form_item">
              <el-input
                  v-model="adminLoginForm.password"
                  placeholder="密码"
                  show-password
              ></el-input>
            </el-form-item>
            <el-button
                round
                style="width: 150px; margin: 0 75px; font-size: 15px;"
                type="primary"
                @click="submitForm('adminLoginForm')"
            >登 录
            </el-button
            >
          </el-form>
        </div>
      </div>
      <div
          id="small_panel"
          :class="{ small_panel_right: isLogin, small_panel_left: !isLogin }"
      >
        <div class="change_panel" v-show="!isLogin">
          <span class="change_title">数据管理平台</span>
          <div class="change_text">直接管理用户、模型等后台数据</div>
          <button class="change_button" @click="isLogin = !isLogin" plain>
            <i class="iconfont icon-left" style="margin-right: 5px;"></i>
            普通用户登录
          </button>
        </div>

        <div class="change_panel" v-show="isLogin">
          <span class="change_title">智慧社区综合治理系统</span>
          <div class="change_text">借助数字孪生高效治理社区</div>
          <!--          <button class="change_button" @click="isLogin = !isLogin" plain>-->
          <!--            管理员登录-->
          <!--            <i class="iconfont icon-right" style="margin-left: 5px;"></i>-->
          <!--          </button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import * as _ from "lodash"

export default {
  name: "LoginPage",
  data() {
    return {
      isLogin: true,

      loginForm: {
        account: "",
        password: "",
      },
      rules: {
        account: [
          {required: true, message: "请输入用户名", trigger: "blur"},
          // {min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {
            min: 3,
            max: 30,
            message: "长度在 3 到 30 个字符",
            trigger: "blur",
          },
        ],
      },

      adminLoginForm: {
        account: "",
        password: "",
      },

      adminRules: {
        account: [
          {required: true, message: "请输入用户名", trigger: "blur"},
          // {min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {
            min: 3,
            max: 30,
            message: "长度在 3 到 30 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  computed: {
    ...mapState("userAbout", {userInfo: "userInfo"}),
  },
  methods: {
    ...mapActions("userAbout", {setUserValue: "setValue"}),
    clearUserInfo() {
      localStorage.setItem("community_token", "");
      this.setUserValue({
        prop: "userInfo",
        val: {
          username: "",
          account: "",
          createTime: "",
          profile: "",
          token: "",
        },
      });
    },

    submitForm(formName) {
      switch (formName) {
          //普通用户登录
        case "loginForm":
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              let param = {
                username: this.loginForm.account,
                password: this.$md5(this.loginForm.password),
              };
              let {data: token} = await this.$axios.post(
                  "/user/getTokenByUser",
                  this.$common.packagingAxiosParam(param)
              );

              if (!_.isNil(token) && token !== "") {
                localStorage.setItem("community_token", token);
                this.$router.replace({
                  path: "/index",
                });
              } else {
                this.loginForm.password = "";
                this.$message({
                  message: "用 户 名 或 密 码 错 误 ! !",
                  center: true,
                  type: "error",
                });
              }
            }
          });
          break;
          //管理员登录
        case "adminLoginForm":
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              let param = {
                username: this.adminLoginForm.account,
                password: this.$md5(this.adminLoginForm.password),
              };
              let {data: token} = await this.$axios.post(
                  "/user/getTokenByAdminUser",
                  this.$common.packagingAxiosParam(param)
              );

              if (!_.isNil(token) && token !== "") {
                localStorage.setItem("community_token", token);
                this.$router.replace({
                  path: "/admin",
                });
              } else {
                this.adminLoginForm.password = "";
                this.$message({
                  message: "用 户 名 或 密 码 错 误 ! !",
                  center: true,
                  type: "error",
                });
              }
            }
          });
          break;
        default:
          return false;
      }
    },
  },
  mounted() {
    this.clearUserInfo();
  },
};
</script>

<style scoped>
#background_panel {
  width: 100%;
  height: 100%;
  background-color: #f1f4f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loginPanel {
  background-color: white;
  width: 800px;
  height: 500px;
  padding: 0;
  border-radius: 20px;
  box-shadow: 0 0 3px #f0f0f0, 0 0 6px #f0f0f0;
  position: relative;
}

#small_panel {
  position: absolute;
  width: 250px;
  height: 100%;
  background: linear-gradient(135deg, #1f6db0, #29ace2);
  transition: all 0.5s ease-out;
  z-index: 2;
  box-sizing: border-box;
  padding: 100px 20px;
}

.small_panel_left {
  border-radius: 20px 0px 0px 20px;
  left: 0;
}

.small_panel_right {
  border-radius: 0px 20px 20px 0px;
  left: 550px;
}

#large_panel {
  position: absolute;
  width: 550px;
  height: 100%;
  background-color: white;
  transition: all 0.5s ease-out;
  z-index: 1;
  box-sizing: border-box;
  padding: 70px 120px;
}

.large_panel_left {
  border-radius: 0px 20px 20px 0px;
  right: 0;
}

.large_panel_right {
  border-radius: 20px 0px 0px 20px;
  right: 250px;
}

.main_panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /*background-color: yellow;*/
}

.panel_title {
  flex: 1;
  color: #29ace2;
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 50px;
}

.form_panel {
  flex: 4;
  width: 100%;
  /*background-color: pink;*/
}

.form_item {
  margin-bottom: 50px;
}

.change_panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.change_title {
  color: white;
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
}

.change_text {
  color: white;
  font-size: 15px;
}

.change_button {
  width: 80%;
  height: 40px;
  border-radius: 24px;
  border: 1px solid #fff;
  outline: none;
  background-color: transparent;
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
  margin-top: 30px;
}
</style>
