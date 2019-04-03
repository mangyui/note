<template>
  <el-dropdown class='international' @command="handleSetLanguage">
    <div>
      <nx-svg-icon class-name='naver-icon' icon-class="language" />
      <span class="naver-text disNone" style="">语言</span>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="language==='zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'
export default {
  name: 'nx-lang-select',
  components: { nxSvgIcon },
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


