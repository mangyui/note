<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="note_details">
      <div class="page-content">
        <div class="detail-top">
          <el-tag v-if="question.Category">{{question.Category.Subject}}</el-tag>
          <el-button class="de-more" size="medium">更多相似</el-button>
        </div>
        <h2>题目</h2>
        <div class="sys-notes" v-html="question.Content"></div>
        <div class="sys-section">
          <div class="title">
            <i class="el-icon-success"></i> <strong>解答</strong>
          </div>
          <div class="sys-article" v-html="question.Analysis"></div>
        </div>
        <div class="toNum">
            <div @click="dianZan">
              <nx-svg-icon class-name='qu-icon' icon-class="zan" :style="isLike==true?'color: #409EFF;border-color: #409EFF':''" /><span>{{question.LikeNumber}}</span>
            </div>
            <div @click="toCollect">
              <nx-svg-icon class-name='qu-icon' icon-class="collect" :style="isCollect==true?'color: #409EFF;border-color: #409EFF':''"/><span>{{question.CollectNumber}}</span>
            </div>
            <div @click="haveBug">
              <el-tooltip class="item" effect="dark" content="解答有错误？" placement="top-end">
               <nx-svg-icon class-name='qu-icon' icon-class="bug" />
              </el-tooltip>
               <span>2</span>
            </div>
        </div>
        <div class="sys-section">
          <div class="title">
            <strong>题友解答(66)</strong>
          </div>
          <div class="answer_item" v-for="(item,index) in 4" :key="index">
            <div class="answer_item_top">
              <div class="ques_header">
                <router-link to="/user/others/1">
                  <img :src="user.avatar">
                </router-link>
                <div class="header_right">
                  <b>{{user.name}}</b>
                </div>
              </div>
            </div>
            <router-link to="/home/other_answer/1">
              <div class="sys-article item-article">
                <p>系统组件主要分为三大类</p>
                <p>功能类：以实现具体功能为主，包括对第三方组件的二次封装类，尽量不要修改。</p>
                <p>布局类：以常用布局为主，包括标题、间距、搜索之类的纯布局组件，可按实际项目要求修改</p>
                <p>辅助类：文档辅助说明及其他组件部分，可能不会应用在正式产品中，该类别可以不引入到正式产品中</p>
              </div>
            </router-link>
            <div class="sys_footer">
              <span>
                <nx-svg-icon class-name='sys_footer_icon' icon-class="zan" /><span class="ques_footer_num">66</span>
              </span>
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
  QuesDetails
} from '@/api/toget'

import {
  P_dianZan,
  P_toCollect
} from '@/api/toPost'

export default {
  name: 'question_details',
  components: { nxSvgIcon },
  data() {
    return {
      id: '',
      user: this.$store.getters,
      question: '',
      isLike: true,
      isCollect: false
    }
  },
  methods: {
    handleChange(val) {
      console.log(val)
    },
    dianZan() {
      P_dianZan().then(res => {
        this.isLike = !this.isLike
      }).catch(() => {
        this.$message.warning('操作失败...')
      })
    },
    toCollect() {
      P_toCollect().then(res => {
        this.isCollect = !this.isCollect
      }).catch(() => {
        this.$message.warning('操作失败...')
      })
    },
    haveBug() {
      this.$confirm('该解答有问题? 反馈给我们', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '反馈成功！感谢您的反馈'
        })
      }).catch(() => {

      })
    },
    getQues() {
      QuesDetails(this.id).then(res => {
        this.question = res.data.data
      }).catch(() => {
        console.log('获取数据失败！')
      })
    },
    fetchDate() {
      this.id = this.$route.params.id
      if (this.id) {
        this.getQues()
      }
    }
  },
  watch: {
    $route: 'fetchDate'
  },
  created() {
    this.fetchDate()
  }
}
</script>

<style lang="scss" scoped>
    @import '../../styles/details.scss';
</style>
