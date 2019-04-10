<template>
  <div class="app-container">
    <span class="header-title">相似题目</span>
    <div v-if="topLoading" class="loading-box">
      <i class="el-icon-loading"></i>
      加载中...
    </div>
    <!-- <div class="crumbs disNone">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 相似题目</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div class="note_details big-box1200">
      <div class="page-content">
        <div class="detail-top">
          <el-tag v-if="question.Category">{{question.Category.Subject}}</el-tag>
        </div>
        <!-- <h2>题目</h2> -->
        <div class="sys-notes" v-html="question.Content"></div>
        <div class="sys-section">
          <div class="" style="margin-bottom:20px;">
            <i class="el-icon-share"></i> <strong>相似题目</strong>
          </div>
          <quex-box :option="quesList"></quex-box>
          <div v-show="showLoading" class="loading-box">
            <i class="el-icon-loading"></i>
            加载中...
          </div>
          <div v-show="showNone" class="loading-box">
            <i class="el-icon-search"></i>
            空空如也...
          </div>
          <!-- <div v-if="showMore" class="loading-box">
            <i class="el-icon-loading"></i>
            加载更多中...
          </div>
          <div v-if="!showMore && NoneMore" class="loading-box">
            <i class="el-icon-search"></i>
            没有更多了...
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import quexBox from '@/components/my-box/quex-box'
import {
  QuesDetails
} from '@/api/toget'

import {
  QuestionMore
} from '@/api/toPost'

export default {
  name: 'ques_more',
  components: {
    quexBox
  },
  data() {
    return {
      homeTop: 0,
      ScrollTop: 0,
      topLoading: true,
      showMore: false,
      showNone: false,
      NoneMore: false,
      showLoading: true,
      id: '',
      user: this.$store.getters.user,
      question: '',
      quesList: [],
      tolist: {
        UserId: this.$store.getters.user.Id,
        Id: '',
        Number: 3
        // Page: 1
      }
    }
  },
  activated() {
    document.querySelector('.app-main').scrollTop = this.homeTop || 0
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  beforeRouteLeave(to, from, next) {
    this.homeTop = document.querySelector('.app-main').scrollTop || 0
    document.querySelector('.app-main').removeEventListener('scroll', this.onScroll)
    next()
  },
  mounted() {
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  methods: {
    getQues() {
      var data = {
        Id: this.id,
        UserId: this.user.Id
      }
      QuesDetails(data).then(res => {
        if (!res.data.data.Id) {
          this.$message.warning('没有找到...')
          var close = document.querySelector('.tags-view-item.active .el-icon-close')
          close.click()
        }
        this.question = res.data.data
        this.isLike = res.data.data.Like || false
        this.isCollect = res.data.data.Collection || false
        this.topLoading = false
        this.getQuestionMore()
      }).catch((res) => {
        this.$message.warning('没有找到...')
        // var close = document.querySelector('.tags-view-item.active .el-icon-close')
        // close.click()
      })
    },
    fetchDate() {
      this.id = this.$route.params.id
      if (this.id) {
        this.tolist.Id = this.id
        this.getQues()
      }
    },
    getQuestionMore() {
      this.showLoading = true
      // this.tolist.Page = 1
      QuestionMore(this.$qs.stringify(this.tolist)).then(res => {
        this.quesList = res.data.data
        this.showLoading = false
        if (!this.quesList[0]) {
          this.showNone = true
        } else {
          this.showNone = false
        }
      }).catch(() => {})
    }
  },
  created() {
    this.fetchDate()
  }
}
</script>

<style lang="scss" scoped>
    @import '../../styles/details.scss';
</style>
