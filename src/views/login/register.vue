<template>
  <el-form class="login-form" status-icon :rules="loginRules" ref="loginForm" :model="loginForm" label-width="0">
    <el-form-item prop="username">
      <div class="svgIcon">
        <nx-svg-icon class-name='international-icon' icon-class="me" />
      </div>
      <el-input size="small" @keyup.enter.native="handleLogin" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名">
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <div class="svgIcon">
        <nx-svg-icon class-name='international-icon' icon-class="lock" />
      </div>
      <el-input size="small" @keyup.enter.native="handleLogin" :type="passwordType" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码">
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="phone">
      <div class="svgIcon">
        <nx-svg-icon class-name='international-icon' icon-class="mobile" />
      </div>
      <el-input size="small" @keyup.enter.native="handleLogin" v-model="loginForm.phone" auto-complete="off" placeholder="手机号码">
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="medium" @click.native.prevent="handleRegister" class="login-submit" v-loading.fullscreen.lock="fullscreenLoading">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'

export default {
  name: 'register',
  components: { nxSvgIcon },
  data() {
    return {
      fullscreenLoading: false,
      loginForm: {
        username: '',
        password: '',
        phone: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '手机号码为11位', trigger: 'blur' }
        ]
      },
      passwordType: 'password'
    }
  },
  created() {
  },
  mounted() {},
  computed: {
  },
  props: [],
  methods: {
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleRegister() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.fullscreenLoading = true
          this.$store.dispatch('Login', this.loginForm).then(res => {
            this.fullscreenLoading = false
            if (res.data.code === 0) {
              this.$router.push({ path: '/user/index' })
            } else {
              this.$message.warning(res.data.msg)
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
<style>
</style>
