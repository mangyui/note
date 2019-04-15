<template>
  <el-dropdown class='international' @command="handleSetRole" trigger="click">
    <div >
      <svg-icon class-name='naver-icon' icon-class="actor" />
      <span class="naver-text sym-text">身份</span>
    </div>
    <el-dropdown-menu class="actor-down" slot="dropdown">
      <el-dropdown-item v-if="isAdmin" command="admin" :disabled="roles==['admin']">管理员</el-dropdown-item>
      <el-dropdown-item command="teacher" :disabled="roles==['teacher']">教师</el-dropdown-item>
      <el-dropdown-item command="student" :disabled="roles==['student']">学生</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'actor-select',
  data() {
    return {
      isAdmin: this.$store.getters.user.Name === 'ming'
    }
  },
  computed: {
    roles() {
      return this.$store.getters.user.roles.toString()
    }
  },
  methods: {
    handleSetRole(roles) {
      var role = [roles]
      this.$store.dispatch('UpdateRoles', role)
      // this.$notify({
      //   title: '提示',
      //   message: '已更换身份！',
      //   type: 'success'
      // })
      location.reload()
    }
  },
  created() {
    if (this.$store.getters.user.Id && !this.$store.getters.user.roles) {
      this.$store.dispatch('LogOut')
      location.reload()
    }
  }
}
</script>

<style scoped>
.el-dropdown{
  color:#5a5e66;
  cursor: pointer;
}
@media (min-width: 769px) {
  .el-dropdown:hover{
    color: #52bab5;
  }
}
</style>


