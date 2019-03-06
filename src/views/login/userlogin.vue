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
    <el-checkbox v-model="checked">记住账号</el-checkbox>
    <el-form-item>
      <el-button type="primary" size="medium" @click.native.prevent="handleLogin" class="login-submit">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'
export default {
  name: 'userlogin',
  components: { nxSvgIcon },
  data() {
    return {
      loginForm: {
        username: 'mangyu',
        password: '123456'
      },
      checked: false,
      code: {
        src: '',
        value: '',
        len: 4,
        type: 'text'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' },
          { required: true, trigger: 'blur' }
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
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('Login', this.loginForm).then(res => {
            this.$router.push({ path: '/' })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">

</style>
