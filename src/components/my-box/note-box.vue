<template>
  <div>
    <div v-for="(item,index) in option" :key="index">
      <router-link  :to="'/tonote/note_detail/'+item.Id">
        <el-card shadow="hover">
          <div class="big-box">
            <i class="header-icon el-icon-star-on"></i>
            <div class="big-body">
              <b class="big-title">{{item.Headline}}</b>
              <div><p class="tipbox big-content" v-html="item.Content"></p></div>
              <div class="big-time"><i class="el-icon-time"> {{item.DateTime}}</i></div>
              <div><el-tag size="small">笔记</el-tag></div>
            </div>
          </div>
        </el-card>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'quex-box',
  data() {
    return {

    }
  },
  props: {
    option: {
      type: Array,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../styles/note_box.scss';
</style>
