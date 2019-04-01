<template>
  <el-form class="login-form" status-icon :rules="loginRules" ref="loginForm" :model="loginForm" label-width="0">
    <el-form-item prop="username">
      <div class="svgIcon">
        <nx-svg-icon class-name='international-icon' icon-class="me" />
      </div>
      <el-input size="small" @keyup.enter.native="handleLogin" v-model="loginForm.username" auto-complete="off" placeholder="用户号/手机号">
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <div class="svgIcon">
        <nx-svg-icon class-name='international-icon' icon-class="lock" />
      </div>
      <el-input size="small" @keyup.enter.native="handleLogin" :type="passwordType" v-model="loginForm.password" auto-complete="off" placeholder="密码">
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code" class="item-vcode">
      <el-input class="input-vcode" size="small" @keyup.enter.native="handleLogin" v-model="loginForm.code" auto-complete="off" placeholder="验证码"></el-input>
      <img :src="this.Vcode.pic" @click="getCode" alt="未取到验证码" title="看不清？">
    </el-form-item>
    <el-checkbox v-model="checked">记住账号</el-checkbox>
    <el-form-item>
      <el-button type="primary" size="medium" @click.native.prevent="handleLogin" class="login-submit" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'
import {
  getVCode
} from '@/api/toget'

export default {
  name: 'userlogin',
  components: { nxSvgIcon },
  data() {
    const validateCode = (rule, value, callback) => {
      if (this.Vcode.code && value !== this.Vcode.code) {
        callback(new Error('验证码不正确'))
      } else {
        callback()
      }
    }
    return {
      fullscreenLoading: false,
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      checked: false,
      Vcode: {
        code: '12345'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户号/手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        code: [
          // { required: true, message: '请输入验证码', trigger: 'blur' },
          // { min: 4, message: '验证码长度最少为4位', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validateCode }
        ]
      },
      passwordType: 'password'
    }
  },
  created() {
    this.getCode()
  },
  mounted() {},
  computed: {
  },
  props: [],
  methods: {
    getCode() {
      getVCode().then(res => {
        this.Vcode = res.data.data
        this.Vcode.pic = 'data:image/jpeg;base64,' + res.data.data.pic
      }).catch(() => {
        console.log('获取验证码失败！')
      })
    },
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.fullscreenLoading = true
          this.$store.dispatch('Login', this.loginForm).then(res => {
            this.fullscreenLoading = false
            if (res.data.code === 0) {
              this.$router.push({ path: '/' })
              // 为了重置路由
              location.reload()
            } else {
              this.$message.warning('用户号或密码错误')
            }
          }).catch(() => {
            this.fullscreenLoading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.item-vcode  {
  .el-input__inner{
    border-radius: 3px!important;
  }
  img{
    position: absolute;
    right: 1px;
    height: 90%;
    top: 5%;
    cursor: pointer;
    width: 40%;
    font-size: 9px;
    color: #666;
  }
}
</style>
