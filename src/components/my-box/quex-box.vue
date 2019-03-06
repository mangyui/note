<template>
  <div class="ques-list">
    <div class="ques-list_item" v-for="(item,index) in option" :key="index">
      <div class="ques_box">
        <router-link :to="'/home/question_details/'+item.Id">
          <div class="ques_body tipbox">
            <b>{{index+1}}.</b><div v-html="item.Content"></div>
          </div>
        </router-link>
        <div class="ques_footer">
          <nx-svg-icon class-name='international-icon' icon-class="zan" /><span class="ques_footer_num">{{item.LikeNumber}}</span>
          <nx-svg-icon class-name='international-icon' icon-class="collect" /><span class="ques_footer_num">{{item.CollectNumber}}</span>
          <!-- <nx-svg-icon class-name='international-icon' icon-class="comment" /><span  class="ques_footer_num">{{66}}</span> -->
          <el-tag>数学</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'
export default {
  name: 'quex-box',
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
  }
}
</script>

<style lang="scss" scoped>
.ques-list .ques-list_item .ques_box .ques_body{
  max-height: 240px;
  overflow: hidden;
}
</style>
