<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 我的笔记</el-breadcrumb-item>
          <el-breadcrumb-item>笔记分类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tag> 所 有 </el-tag>
      <el-tag type="success"> 数 学 </el-tag>
      <el-tag type="info"> 语 文 </el-tag>
      <el-tag type="warning"> 英 语 </el-tag>
      <el-tag type="danger"> 其 他 </el-tag>
          <div class="ques-list">
      <div class="ques-list_item" v-for="(item,index) in questions" :key="index">
        <div class="ques_box">
          <span @click="toCollect(index)" >
            <nx-svg-icon
              class-name='international-icon icon-collect'
              :style="item.collect==true?'color: #F56C6C':''"
              icon-class="collect" />
          </span>
          <router-link to="/home/question_details/1">
            <div class="ques_body">
              <b class="ques_title">{{item.title}}</b>
              <div class="tipbox ques_answer">{{item.answer}}</div>
            </div>
          </router-link>
          <div class="ques_footer">
            <nx-svg-icon class-name='international-icon' icon-class="zan" /><span class="ques_footer_num">666</span>
            <nx-svg-icon class-name='international-icon' icon-class="collect" /><span class="ques_footer_num">6</span>
            <nx-svg-icon class-name='international-icon' icon-class="comment" /><span  class="ques_footer_num">66</span>
            <el-tag>数学</el-tag>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>


<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'
import {
  getNoteList
} from '@/api/notes'

export default {
  name: 'collect',
  components: { nxSvgIcon },
  data() {
    return {
      questions: [],
      type: ''
    }
  },
  methods: {
    getNotes() {
      getNoteList().then(res => {
        this.questions = res.data
      }).catch(() => {})
      this.loading = false
    },
    toCollect(index) {
      if (this.questions[index].collect === true) {
        this.questions[index].collect = false
        this.$notify({
          title: '提示',
          message: '已取消收藏',
          type: 'info'
        })
      } else {
        this.questions[index].collect = true
        this.$notify({
          title: '提示',
          message: '收藏成功',
          type: 'success'
        })
      }
    }
  },
  created() {
    this.getNotes()
  }
}
</script>


<style scopd>
.ques-list .ques-list_item .ques_box{
  padding-top: 40px;
}
</style>
