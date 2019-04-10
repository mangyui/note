<template>
  <el-form class="login-form" status-icon :rules="loginRules" ref="loginForm" :model="loginForm" label-width="0">
    <el-form-item prop="phone">
      <div class="svgIcon">
        <svg-icon class-name='international-icon' icon-class="mobile" />
      </div>
      <el-input size="small" @keyup.enter.native="handleRegister" v-model="loginForm.phone" auto-complete="off" placeholder="手机号码">
      </el-input>
    </el-form-item>
    <el-form-item prop="username">
      <div class="svgIcon">
        <svg-icon class-name='international-icon' icon-class="me" />
      </div>
      <el-input size="small" @focus="nameFocus"  @keyup.enter.native="handleRegister" v-model="loginForm.username" auto-complete="off" placeholder="填用户号">
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <div class="svgIcon">
        <svg-icon class-name='international-icon' icon-class="lock" />
      </div>
      <el-input size="small" @keyup.enter.native="handleRegister" :type="passwordType" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码">
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="class">
      <div class="svgIcon">
        <svg-icon class-name='international-icon' icon-class="pointMap" />
      </div>
      <!-- <el-cascader style="width: 100%;" v-model=""
        placeholder="请正确选择您的年级"
        :options="classlist"
      ></el-cascader> -->
      <el-select style="width: 100%;" size="large" @keyup.enter.native="handleRegister" v-model="loginForm.class" placeholder="请正确选择您的年级">
        <el-option
          v-for="item in classlist"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <!-- <el-checkbox v-model="isTeacher">我是教师</el-checkbox> -->
    <el-form-item>
      <el-button type="primary" size="medium" @click.native.prevent="handleRegister" class="login-submit" v-loading.fullscreen.lock="fullscreenLoading">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { classList } from '@/assets/js/class.js'
export default {
  name: 'register',
  components: { },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    const validateName = (rule, value, callback) => {
      if (value.length < 3 || value.length > 16) {
        return callback(new Error('用户号长度为3到16位'))
      } else {
        const reg = /^[a-zA-Z0-9_-]{3,16}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('用户号只能含英文字母和数字'))
        }
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 6 || value.length > 18) {
        return callback(new Error('密码长度为6到18位'))
      } else {
        const reg = /^[^\u4e00-\u9fa5]{0,}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('密码6到18位 不含中文'))
        }
      }
    }
    return {
      fullscreenLoading: false,
      isTeacher: false,
      loginForm: {
        username: '',
        password: '',
        phone: '',
        class: ''
        // occupation: 1
      },
      classlist: classList,
      loginRules: {
        username: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        class: [
          { required: true, message: '请正确选择你的年级', trigger: 'blur' }
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
    nameFocus() {
      this.$notify({
        title: '提示',
        message: '用户号是唯一的，请注意填写',
        type: 'info'
      })
    },
    showPassword() {
      // console.log(this.loginForm.class)
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleRegister() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // if (this.isTeacher) {
          //   this.loginForm.occupation = 2
          // }
          this.fullscreenLoading = true
          this.$store.dispatch('Register', this.loginForm).then(res => {
            this.fullscreenLoading = false
            if (res.data.code === 0) {
              // this.$router.push({ path: '/user/index' })
              // 为了重置路由
              location.reload()
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
