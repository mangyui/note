<template>
  <div class="ques-list">
    <div class="ques-list_item" v-for="(item,index) in option" :key="index">
      <div class="ques_box">
        <router-link :to="'/home/mistake/'+item.Id">
          <div class="ques_body tipbox">
            <b>{{index+1}}.</b><div v-html="item.Content"></div>
          </div>
        </router-link>
        <el-button class="downMore" @click="clickfun($event)" type="primary" icon="el-icon-caret-bottom" size="mini" ></el-button>
        <div class="ques_footer">
          <svg-icon class-name='international-icon' icon-class="zan" /><span class="ques_footer_num">{{item.LikeNumber}}</span>
          <svg-icon class-name='international-icon' icon-class="collect" /><span class="ques_footer_num">{{item.CollectNumber}}</span>
          <el-tag>题目</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myquex-box',
  components: { nxSvgIcon },
  data() {
    return {

    }
  },
  props: {
    option: {
      type: Array,
      default: () => {}
    }
  },
  methods: {
    clickfun(e) {
      var p = e.currentTarget.previousElementSibling.firstElementChild
      if (p.style.maxHeight === '1000px') {
        p.style.maxHeight = '200px'
        e.currentTarget.style.transform = ''
      } else {
        p.style.maxHeight = '1000px'
        e.currentTarget.style.transform = 'rotate(180deg)'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
