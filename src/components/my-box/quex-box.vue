<template>
  <div class="ques-list">
    <div class="ques-list_item" v-for="(item,index) in option" :key="index">
      <div class="ques_box">
        <router-link :to="'/home/question_details/'+item.Id">
          <div class="ques_body tipbox">
            <b>{{index+1}}.</b><div class="QUesTitle" v-html="item.Content"></div>
          </div>
        </router-link>
        <el-button class="downMore" @click="clickfun($event)" type="primary" icon="el-icon-caret-bottom" size="mini" ></el-button>
        <div class="ques_footer">
          <nx-svg-icon class-name='international-icon' icon-class="zan" /><span class="ques_footer_num">{{item.LikeNumber}}</span>
          <nx-svg-icon class-name='international-icon' icon-class="collect" /><span class="ques_footer_num">{{item.CollectNumber}}</span>
          <!-- <nx-svg-icon class-name='international-icon' icon-class="comment" /><span  class="ques_footer_num">{{66}}</span> -->
          <el-tag>题目</el-tag>
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
  },
  methods: {
    clickfun(e) {
      var p = e.currentTarget.previousElementSibling.firstElementChild
      if (p.style.maxHeight === '1000px') {
        p.style.maxHeight = '200px'
        e.currentTarget.firstElementChild.style.transform = ''
      } else {
        p.style.maxHeight = '1000px'
        e.currentTarget.firstElementChild.style.transform = 'rotate(180deg)'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ques-list .ques-list_item .ques_box .ques_body{
  max-height: 200px;
  overflow: hidden;
  transition: .5s;
}
.downMore{
  position: absolute;
  left: 50%;
  bottom: 15px;
  margin-left: -22px;
  border-radius: 0 0 3px 3px;
  transition: 0s
}
</style>
