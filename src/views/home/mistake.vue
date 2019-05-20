<template>
  <div class="app-container">
    <span class="header-title">错题详情</span>
    <div v-if="showLoading" class="loading-box">
      <i class="el-icon-loading"></i>
      加载中...
    </div>
    <!-- <div class="crumbs disNone">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 错题详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div v-show="question" class="note_details big-box1200">
      <div class="page-content">
        <!-- <div class="detail-top">
          <el-tag size="large">{{question.Type}}</el-tag>
        </div> -->
        <div class="sys-notes" v-html="question.Title"></div>
        <div class="sys-section" v-show="isMe">
          <div class="title" style="border:0">
            <strong>我的解答</strong>
              <div class="ques_header">
                <router-link to="/user/index">
                  <img :src="user.Avatar || myavatar">
                </router-link>
                <div class="header_right">
                  <b>{{user.Name}}</b>
                </div>
              </div>
          </div>
          <div v-if="!isUpdae" class="sys-article" v-html="content"></div>
          <div>
            <div v-show="isUpdae" ref="editor" class="divWangeditor" style=""></div>
          </div>
          <br/>
          <el-button v-if="!isUpdae" class="editor-btn" type="primary" size="small" @click="handleChange">修改解答</el-button>
          <el-button v-if="isUpdae" class="editor-btn" size="small" @click="isUpdae=false">返回</el-button>
          <el-button v-if="isUpdae" class="editor-btn" size="small" type="danger" @click="submit">确定修改</el-button>
        </div>
        <div class="sys-section" v-if="!isMe">
          <div class="title" style="border:0">
            <strong>题主解答</strong>
            <div class="answer_item_top">
              <div class="ques_header">
                <router-link :to="'/user/others/'+ user.Id">
                  <img v-if="user" :src="user.Avatar || myavatar">
                </router-link>
                <div class="header_right">
                  <b>{{user.Name}}</b>
                </div>
              </div>
            </div>
          </div>
          <div class="sys-article" v-html="question.Correct"></div>
        </div>
        <div v-show="question.AnswerVideo&&question.AnswerVideo!=0" :style="{height: screenWidth>1200?'380px':screenWidth*0.5+'px'}">
          <dPlayer ref="player" @play="play" :options="options"></dPlayer>
        </div>
        <div class="toNum">
          <div @click="dianZan">
            <svg-icon class-name='qu-icon' icon-class="zan" :style="isLike==true?'color: #409EFF;border-color: #409EFF':''" /><span>{{question.LikeNumber}}</span>
          </div>
          <div @click="toCollect">
            <svg-icon class-name='qu-icon' icon-class="collect" :style="isCollect==true?'color: #409EFF;border-color: #409EFF':''"/><span>{{question.CollectNumber}}</span>
          </div>
        </div>
        <div class="sys-section" v-if="haveGuanfang">
        <div class="title">
            <i class="el-icon-success"></i> <strong>官方解答</strong>
          </div>
          <div class="sys-article" v-html="question.Guangfang"></div>
        </div>
        <div class="sys-section">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dPlayer from 'vue-dplayer'
import 'vue-dplayer/dist/vue-dplayer.css'
// wangeditor 富文本
var editor
import { MistakeImg } from '@/api/upload'
import {
  MistakeDetails
} from '@/api/toget'
import {
  P_dianZan,
  P_toCollect,
  UpdateMistake,
  UpdateCoin
} from '@/api/toPost'

export default {
  name: 'mistake',
  components: {
    dPlayer
  },
  data() {
    return {
      player: null,
      options: {
        video: {
          url: ''
        },
        autoplay: false
      },
      AnswerVideo: 0,
      VideoCost: 0,
      isPay: false,
      screenWidth: document.body.clientWidth,
      showLoading: true,
      isUpdae: false,
      id: '',
      user: '',
      myavatar: './static/img/avatar.jpg',
      question: {
        Id: '',
        Title: '',
        Correct: '',
        Guangfang: '',
        LikeNumber: '',
        CollectNumber: ''
      },
      content: '',
      isMe: false,
      haveGuanfang: true,
      isLike: false,
      isCollect: false
    }
  },
  methods: {
    play() {
      if (this.isMe || this.isPay || this.question.AnswerVideo === '0') {
        return
      }
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
      this.AnswerVideo = this.question.AnswerVideo || 0
      this.VideoCost = this.question.VideoCost || 0
      this.$confirm('你需付费金币数：' + this.question.VideoCost, '付费观看', {
        confirmButtonText: '立即支付',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        var data = {
          coin: '-' + this.VideoCost,
          userId: this.$store.getters.user.Id
        }
        UpdateCoin(this.$qs.stringify(data)).then(res => {
          if (res.data.data === -1) {
            this.$notify({
              title: '付费失败',
              message: '余额不足，前往个人中心充值',
              type: 'error'
            })
          } else {
            this.isPay = true
            this.$store.dispatch('RechargeMoney', res.data.data)
            this.player.switchVideo({
              url: this.question.AnswerVideo
            })
            this.$notify({
              title: '付费成功',
              type: 'success'
            })
          }
        }).catch(() => {})
      }).catch(() => {})
      this.player.pause()
    },
    handleChange() {
      this.isUpdae = true
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
        MistakeId: this.id,
        UserId: this.$store.getters.user.Id
      }
      P_dianZan(this.$qs.stringify(data)).then(res => {
        if (res.data.code !== 0) {
          this.$notify({
            title: '提示',
            message: '网络错误，操作失败',
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
        MistakeId: this.id,
        UserId: this.$store.getters.user.Id
      }
      P_toCollect(this.$qs.stringify(data)).then(res => {
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
    getQues() {
      var data = {
        UserId: this.$store.getters.user.Id,
        Id: this.id
      }
      MistakeDetails(data).then(res => {
        if (!res.data.data.Id) {
          this.$message.warning('没有找到...')
          var close = document.querySelector('.tags-view-item.active .el-icon-close')
          close.click()
        }
        if (res.data.data.QuestionId !== '0') {
          this.haveGuanfang = true
          this.question.Id = res.data.data.Id
          this.question.Title = res.data.data.Question.Content
          this.question.Guangfang = res.data.data.Question.Analysis
          this.question.Correct = res.data.data.Correct
          this.question.LikeNumber = res.data.data.Question.LikeNumber
          this.question.CollectNumber = res.data.data.Question.CollectNumber
        } else {
          this.haveGuanfang = false
          this.question.Id = res.data.data.Id
          this.question.Title = res.data.data.QuestionContent
          this.question.Correct = res.data.data.Correct
          this.question.LikeNumber = res.data.data.LikeNumber
          this.question.CollectNumber = res.data.data.CollectNumber
        }
        this.question.AnswerVideo = res.data.data.AnswerVideo
        this.question.VideoCost = res.data.data.VideoCost

        this.user = res.data.data.User
        this.isLike = res.data.data.Like
        this.isCollect = res.data.data.Collection
        this.Magnify()
        if (this.$store.getters.user && this.$store.getters.user.Id === this.user.Id) {
          this.isMe = true
          this.content = this.question.Correct
          editor.txt.html(this.content)
          this.player.switchVideo({
            url: this.question.AnswerVideo
          })
        } else {
          this.isMe = false
        }
        this.showLoading = false
      }).catch((res) => {
        console.log(res)
      })
    },
    Magnify() {
      var value = '<img'
      // 匹配图片标签正则
      var replaceReg = new RegExp(value, 'g')
      // 加上放大组件属性
      var replaceString = value + ' preview '
      // 开始替换
      this.question.Title = this.question.Title.replace(replaceReg, replaceString)
      this.question.Correct = this.question.Correct.replace(replaceReg, replaceString)
    },
    submit() {
      this.$confirm('确定修改错题整理?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        UpdateMistake(this.$qs.stringify({
          Id: this.id,
          UserId: this.$store.getters.user.Id,
          Correct: this.content })).then(res => {
          if (res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success'
            })
            this.isUpdae = false
          } else {
            this.$message.warning('操作失败...')
          }
        }).catch(() => {})
        //
      }).catch(() => {})
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
  },
  mounted() {
    var That = this
    editor = new this.$E(this.$refs.editor)
    editor.customConfig = {
      onchange: function(html) {
        That.content = html
      },
      uploadImgServer: MistakeImg, // 上传图片到服务器
      uploadFileName: 'file', // 后端使用这个字段获取图片信息
      uploadImgMaxLength: 1, // 限制一次最多上传 1 张图片
      uploadImgHooks: {
        customInsert: function(insertImg, result, editor) {
          var url = result.data.data.data
          // console.log(result.data.data.data)
          insertImg(url)
        }
      }
    }
    editor.create()

    this.player = this.$refs.player.dp
  }
}
</script>

<style scoped lang="scss">
    @import '../../styles/details.scss';
.sys-section{
  margin-top: 20px;
}
.note_details{
  .sys-notes {
    background: rgb(254, 240, 240);
    border-color: #F56C6C;
  }
}
</style>
