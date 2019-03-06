<template>
  <div class="login-container pull-height" @keyup.enter.native="handleLogin">
    <div class="login-info text-white animated fadeInLeft">
      <div class="logo">
          <img src="../../assets/images/home/logo.png" width="160px" height="160px" alt="logo" style="vertical-align: middle;" />
      </div>
      <h2 class="login-info-title">{{website.info.title}}</h2>
      <ul class="login-info-list">
        <li class="login-info-item" v-for="item in website.info.list">
          <i class="el-icon-check"></i>&nbsp;{{item}}
        </li>
      </ul>
    </div>
    <div class="login-border  animated fadeInRight">
      <div class="login-main">
        <h4 class="login-title">登录{{website.title}}
        </h4>
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户登录" name="user">
            <userLogin></userLogin>
          </el-tab-pane>
          <el-tab-pane label="立即注册" name="register">
            <register></register>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

  </div>
</template>
<script>
import userLogin from './userlogin'
import register from './register'
import { mapGetters } from 'vuex'
export default {
  name: 'login',
  components: {
    userLogin,
    register
  },
  data() {
    return {
      activeName: 'user'
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(['website'])
  },
  props: [],
  methods: {}
}
</script>

<style lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.2);
  position: relative;
  height: 100%;
  flex-wrap: wrap;
}
.login-container::before {
  z-index: -999;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/top_images/login2.png");
  background-size: cover;
}
.login-info {
  padding-left: 10px;
  margin-top: -240px;
}
.login-info-title {
  line-height: 90px;
}
.login-info-item {
  font-size: 14px;
  margin-top: 5px;
}
.login-border {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 30px 50px 25px 50px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 1px 1px 2px #eee;
}
.login-main {
  border-radius: 3px;
  box-sizing: border-box;
  background-color: #fff;
}
.login-main > h3 {
  margin-bottom: 20px;
}
.login-main > p {
  color: #76838f;
}
.login-title {
  margin: 0 0 20px;
  text-align: center;
  color: #52bab5;
  letter-spacing: 3px;
  font-size: 18px;
}
.login-submit {
  margin-top: 10px;
  width: 100%;
  background-color: #52bab5;
  border-color: #52bab5;
}
.login-submit:focus, .login-submit:hover{
  background-color: #52dad3;
  border-color: #52dad3;
}
.login-form {
  margin: 10px 0;
  .el-form-item__content {
    width: 270px;
    display: flex;

    .svgIcon{
      color: #fff;
      background: #52bab5;
      height: 40px;
      width: 50px;
      text-align: center;
      line-height: 46px;
      border-radius: 3px 0 0 3px;

      .svg-icon{
        width: 1.4em;
        height: 1.3em;
      }
    }

    .el-input__inner{
      border-radius: 0 3px 3px 0;
      border-left: 0;
      padding-left: 10px;
      font-size: 14px;
    }
    .el-form-item__error{
      line-height: 1.6em;
    }
  }
  .el-input--small .el-input__inner{
    height: 40px;
    line-height: 40px;
  }
  .el-input {
    input {
      text-indent: 5px;
      border-color: #dcdcdc;
      border-radius: 3px;
    }
    .el-input__prefix {
      i {
        padding: 0 5px;
        font-size: 16px !important;
      }
    }
  }
}
.login-code {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 0 0 10px;
}
.login-code-img {
  margin-top: 2px;
  width: 100px;
  height: 32px;
  background-color: #fdfdfd;
  border: 1px solid #f0f0f0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 5px;
  line-height: 32px;
  text-indent: 5px;
  text-align: center;
}

.el-tabs__item:hover,.el-tabs__item.is-active
{
  color: #52bab5;
}
.el-tabs__active-bar{
  background-color:#52bab5;
}
/*登录*/
.login-form{
  .el-form-item__error{
    padding-top: 0px;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label
  {
    color: #52dad3;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner
  {
    background-color: #52dad3;
    border-color: #52dad3;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner,.el-checkbox__inner:hover,.el-checkbox__inner:focus{
    border-color: #52dad3;
  }
}

@media (max-width: 768px)
{
  .logo img{
    width: 120px;
    height: 120px;
  }
  .login-border{
    padding: 20px 28px 10px;
  }
  .login-title{
    margin-bottom: 5px;
  }
}
</style>
