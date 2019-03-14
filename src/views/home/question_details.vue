<template>
  <div class="app-container">
    <span class="header-title">题目详情</span>
    <div v-if="showLoading" class="loading-box">
      <i class="el-icon-loading"></i>
      加载中...
    </div>
    <div class="crumbs disNone">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 题目详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="note_details">
      <div class="page-content">
        <div class="detail-top">
          <el-tag v-if="question.Category">{{question.Category.Subject}}</el-tag>
          <el-button class="de-more" size="medium">相似题型</el-button>
        </div>
        <h2>题目</h2>
        <div class="sys-notes" v-html="question.Content"></div>
        <div class="sys-section">
          <div class="title">
            <i class="el-icon-success"></i> <strong>官方解答</strong>
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
               <span></span>
            </div>
        </div>
        <div class="sys-section">
          <div class="title">
            <strong>题友解答</strong>
          </div>
          <div class="answer_item" v-for="(item,index) in friendCorrect" :key="index">
            <div class="answer_item_top">
              <div class="ques_header">
                <router-link :to="'/user/others/'+item.UserId">
                  <img :src="item.Avatar||'./static/img/avatar.jpg'">
                </router-link>
                <div class="header_right">
                  <b>{{item.userName || '匿名'}}</b>
                </div>
              </div>
            </div>
            <router-link :to="'/home/mistake/'+item.MistakeCateId">
              <div class="sys-article item-article" v-html="item.Correct">
              </div>
            </router-link>
            <div class="sys_footer">
              <span>
                <nx-svg-icon class-name='sys_footer_icon' icon-class="zan" /><span class="ques_footer_num">{{item.LikeNumber}}</span>
                <nx-svg-icon class-name='sys_footer_icon' icon-class="collect" /><span class="ques_footer_num">{{item.CollectNumber}}</span>
              </span>
            </div>
          </div>
          <div v-if="!friendCorrect[0]" class="loading-box">
            <i class="el-icon-search"></i>
            没有更多题友解答...
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
  P_toCollect,
  QFriendCorrect
} from '@/api/toPost'

import qs from 'qs'

export default {
  name: 'question_details',
  components: { nxSvgIcon },
  data() {
    return {
      showLoading: true,
      id: '',
      user: this.$store.getters.user,
      question: '',
      friendCorrect: [],
      isLike: false,
      isCollect: false
    }
  },
  methods: {
    handleChange(val) {
      console.log(val)
    },
    dianZan() {
      if (!this.$store.getters.user.Id) {
        this.$confirm('你还没有登录，不能进行该操作！前往登录', '提示', {
          confirmButtonText: '立即登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {})
        return
      }
      if (this.isLike === true) {
        this.isLike = false
        this.question.LikeNumber--
      } else {
        this.isLike = true
        this.question.LikeNumber++
      }
      var data = {
        QuestionId: this.id,
        UserId: this.user.Id
      }
      P_dianZan(qs.stringify(data)).then(res => {
        if (res.data.code !== 0) {
          this.$notify({
            title: '提示',
            message: '网络错误，点赞失败',
            type: 'error'
          })
          if (this.isLike === true) {
            this.isLike = false
            this.question.LikeNumber--
          } else {
            this.isLike = true
            this.question.LikeNumber++
          }
        }
      }).catch(() => {
        this.$message.warning('操作失败...')
      })
    },
    toCollect() {
      if (!this.$store.getters.user.Id) {
        this.$confirm('你还没有登录，不能进行该操作！前往登录', '提示', {
          confirmButtonText: '立即登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {})
        return
      }
      if (this.isCollect === true) {
        this.isCollect = false
        this.question.CollectNumber--
      } else {
        this.isCollect = true
        this.question.CollectNumber++
      }
      var data = {
        QuestionId: this.id,
        UserId: this.user.Id
      }
      P_toCollect(qs.stringify(data)).then(res => {
        if (res.data.code !== 0) {
          this.$notify({
            title: '提示',
            message: '网络错误，操作失败',
            type: 'error'
          })
          if (this.isCollect === true) {
            this.isCollect = false
            this.question.CollectNumber--
          } else {
            this.isCollect = true
            this.question.CollectNumber++
          }
        }
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
    getFriendCorrect() {
      QFriendCorrect(qs.stringify({ QuestionId: this.id })).then(res => {
        this.friendCorrect = res.data.data
      }).catch((res) => {
        console.log(res)
      })
    },
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
        this.showLoading = false
        this.getFriendCorrect()
      }).catch((res) => {
        this.$message.warning('没有找到...')
        // var close = document.querySelector('.tags-view-item.active .el-icon-close')
        // close.click()
      })
    },
    fetchDate() {
      this.id = this.$route.params.id
      if (this.id) {
        this.getQues()
      }
    }
  },
  // watch: {
  //   $route: 'fetchDate'
  // },
  created() {
    this.fetchDate()
  }
}
</script>

<style lang="scss" scoped>
    @import '../../styles/details.scss';
</style>
