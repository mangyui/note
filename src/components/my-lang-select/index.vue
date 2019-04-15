<template>
  <el-dropdown class='international' @command="handleSetLanguage" trigger="click">
    <div>
      <svg-icon class-name='naver-icon' icon-class="language" />
      <span class="naver-text sym-text" style="">语言</span>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="language==='zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'lang-select',
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang)
      this.$message({
        message: '更换系统语言成功',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.international-icon {
  font-size: 22px;
  cursor: pointer;
  vertical-align: -5px!important;
}
.el-dropdown{
  color:#5a5e66;
}
@media (min-width: 769px) {
  .el-dropdown:hover{
    color: #52bab5;
  }
}
</style>


