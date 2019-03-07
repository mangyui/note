<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 我的错题</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- <el-tag> 所 有 </el-tag>
      <el-tag type="success"> 数 学 </el-tag>
      <el-tag type="info"> 语 文 </el-tag>
      <el-tag type="warning"> 英 语 </el-tag>
      <el-tag type="danger"> 其 他 </el-tag> -->
      <el-select  v-model="type" placeholder="选择类型">
        <el-option label="数学" value="type1"></el-option>
        <el-option label="语文" value="type2"></el-option>
        <el-option label="其他" value="type3"></el-option>
      </el-select>
      <router-link to="/SQu/index">
        <el-button type="primary" icon="el-icon-add">添加</el-button>
      </router-link>
      <el-button type="danger" icon="el-icon-delete" circle @click="showDelete=!showDelete"></el-button>
      <div class="ques-list">
      <div class="ques-list_item" v-for="(item,index) in questions" :key="index">
        <div class="ques_box">
          <i v-if="showDelete" class="el-icon-close icon-delete" @click="toDetele"></i>
          <router-link to="/toques/my_answer/1">
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
  name: 'quesList',
  components: { nxSvgIcon },
  data() {
    return {
      showDelete: false,
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
    toDetele() {
      this.$confirm('此操作将永久删除该笔记, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    }
  },
  created() {
    this.getNotes()
  }
}
</script>


<style lang="scss" scoped>
.ques-list .ques-list_item .ques_box{
  padding-top: 40px;
}
</style>
