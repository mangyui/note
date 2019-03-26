<template>
  <div class="app-container">
    <span class="header-title">学生测试</span>
    <div class="big-box1200">
      <div class="top-search">
        <el-input
          placeholder="请输入内容"
          @keyup.enter.native=""
          v-model="search.keys">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="block">
        <el-timeline>
            <el-timeline-item v-for="(item,index) in 3" :key="index" timestamp="2019/3/12 12:12:12" placement="top">
              <router-link to="/carveup/test_detail/1">
                <el-card shadow="hover">
                  <h4>测试标题</h4>
                  <p>测试备注</p>
                  <h5>共24人参加测试</h5>
                </el-card>
              </router-link>
            </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      search: {
        keys: '',
        UserId: this.$store.getters.user.Id
      }
    }
  }
}
</script>
