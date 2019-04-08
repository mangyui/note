<template>
  <div class="app-container">
    <span class="header-title">班级测试</span>
    <div class="crumbs disNone">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/class/index' }"><i class="el-icon-date"></i> 我的班级</el-breadcrumb-item>
          <el-breadcrumb-item> 初二物理班  </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="big-box1200">
      <el-tabs v-model="activeName" class='is_stretch' >
        <el-tab-pane name="left" disabled></el-tab-pane>
        <el-tab-pane name="tests">
          <div slot="label"> 测验列表</div>
           <testList :classId="classId"></testList>
        </el-tab-pane>
        <el-tab-pane name="center" disabled></el-tab-pane>
        <el-tab-pane name="students">
          <div slot="label">学生列表</div>
          <studentList :classId="classId"></studentList>
        </el-tab-pane>
        <el-tab-pane name="right" disabled></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import testList from './testList'
import studentList from './studentList'

export default {
  name: 'class_detail',
  components: {
    testList,
    studentList
  },
  data() {
    return {
      showLoading: false,
      classId: 11,
      activeName: 'tests'
    }
  },
  methods: {
    fetchDate() {
      this.id = this.$store.getters.user.Id
      // if (this.id) {
      //   this.getTiyou()
      // }
    }
  },
  created() {
    this.fetchDate()
  }
}
</script>

<style lang="scss" scoped>

</style>
