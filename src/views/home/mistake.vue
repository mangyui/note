<template>
  <div class="app-container">
    <span class="header-title">错题详情</span>
    <div v-if="showLoading" class="loading-box">
      <i class="el-icon-loading"></i>
      加载中...
    </div>
    <div class="crumbs disNone">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 错题详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="note_details">
      <div class="page-content">
        <div class="detail-top">
          <el-tag v-if="question.Category">{{question.Category.Subject}}</el-tag>
          <!-- <el-button class="de-more" size="medium">相似错题</el-button> -->
        </div>
        <div class="sys-notes" v-html="question.Title"></div>
        <div class="sys-section" v-if="isMe">
          <div class="title">
            <strong>我的解答</strong>
              <div class="ques_header">
                <router-link to="/user/index">
                  <img :src="user.avatar || myavatar">
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
          <!-- <quill-editor v-if="isUpdae" ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor> -->
          <br/>
          <el-button v-if="!isUpdae" class="editor-btn" type="primary" @click="handleChange">修改解答</el-button>
          <el-button v-if="isUpdae" class="editor-btn" @click="isUpdae=false">返回</el-button>
          <el-button v-if="isUpdae" class="editor-btn" type="danger" @click="submit">确定修改</el-button>
        </div>
        <div class="sys-section" v-if="!isMe">
          <div class="title">
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
        <div class="toNum">
          <div @click="dianZan">
            <nx-svg-icon class-name='qu-icon' icon-class="zan" :style="isLike==true?'color: #409EFF;border-color: #409EFF':''" /><span>{{question.LikeNumber}}</span>
          </div>
          <div @click="toCollect">
            <nx-svg-icon class-name='qu-icon' icon-class="collect" :style="isCollect==true?'color: #409EFF;border-color: #409EFF':''"/><span>{{question.CollectNumber}}</span>
          </div>
        </div>
        <div class="sys-section" v-if="haveGuanfang">
        <div class="title">
            <i class="el-icon-success"></i> <strong>官方解答</strong>
          </div>
          <div class="sys-article" v-html="question.Guangfang"></div>
        </div>
        <div class="sys-section">
          <!-- <div class="title">
            <strong>暂无题友解答</strong>
          </div> -->
          <!-- <div class="answer_item" v-for="(item,index) in 1" :key="index">
            <div class="answer_item_top">
              <div class="ques_header">
                <router-link to="/user/others/1">
                  <img :src="myavatar">
                </router-link>
                <div class="header_right">
                  <b>{{user.Name}}</b>
                </div>
              </div>
            </div>
            <router-link to="/home/other_answer/2">
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
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// import { quillEditor } from 'vue-quill-editor'

// wangeditor 富文本
import E from 'wangeditor'
var editor

import nxSvgIcon from '@/components/nx-svg-icon/index'

import {
  MistakeDetails
} from '@/api/toget'
import {
  P_dianZan,
  P_toCollect,
  UpdateMistake,
  Imgurl
} from '@/api/toPost'
import qs from 'qs'

export default {
  name: 'other_answer',
  components: {
    nxSvgIcon
  },
  data() {
    return {
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
      // editorOption: {
      //   placeholder: '等待提取中...',
      //   modules: {
      //     toolbar: [
      //       ['bold', 'italic', 'underline', 'strike'],
      //       [{ 'script': 'sub' }, { 'script': 'super' }],
      //       [{ 'header': 1 }, { 'header': 2 }],
      //       [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      //       [{ 'align': [] }],
      //       [{ 'color': [] }, { 'background': [] }],
      //       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      //       ['code-block', 'link', 'image']
      //     ]
      //   }
      // },
      isMe: true,
      haveGuanfang: true,
      isLike: false,
      isCollect: false
    }
  },
  methods: {
    handleChange() {
      // var That = this
      // var Imgurl = 'http://192.168.1.105/'
      // editor.customConfig = {
      //   onchange: function(html) {
      //     That.content = html
      //   },
      //   uploadImgServer: Imgurl + '?service=App.Upload.Upload', // 上传图片到服务器
      //   uploadFileName: 'file', // 后端使用这个字段获取图片信息
      //   uploadImgMaxLength: 1, // 限制一次最多上传 1 张图片
      //   showLinkImg: false,
      //   uploadImgHooks: {
      //     customInsert: function(insertImg, result, editor) {
      //       var url = Imgurl + 'upload/' + result.data.data.data
      //       // console.log(result.data.data.data)
      //       insertImg(url)
      //     }
      //   }
      // }
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
      P_dianZan(qs.stringify(data)).then(res => {
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
        this.user = res.data.data.User
        this.isLike = res.data.data.Like
        this.isCollect = res.data.data.Collection
        if (this.$store.getters.user && this.$store.getters.user.Id === this.user.Id) {
          this.isMe = true
          this.content = this.question.Correct
          editor.txt.html(this.content)
        } else {
          this.isMe = false
        }
        this.showLoading = false
      }).catch((res) => {
        console.log(res)
        // this.$message.warning('没有找到...')
        // var close = document.querySelector('.tags-view-item.active .el-icon-close')
        // close.click()
      })
    },
    submit() {
      this.$confirm('确定修改错题整理?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        UpdateMistake(qs.stringify({
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
    // var Imgurl = 'http://192.168.1.105/'
    editor = new E(this.$refs.editor)
    editor.customConfig = {
      onchange: function(html) {
        That.content = html
      },
      uploadImgServer: Imgurl + '?service=App.Upload.Upload', // 上传图片到服务器
      uploadFileName: 'file', // 后端使用这个字段获取图片信息
      uploadImgMaxLength: 1, // 限制一次最多上传 1 张图片
      showLinkImg: false,
      uploadImgHooks: {
        customInsert: function(insertImg, result, editor) {
          var url = Imgurl + 'upload/' + result.data.data.data
          // console.log(result.data.data.data)
          insertImg(url)
        }
      }
    }
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      // 'video',  // 插入视频
      'code', // 插入代码
      'symbols',
      'undo', // 撤销
      'redo' // 重复
    ]
    editor.create()
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
    border-bottom: 4px solid #f7b3b3;
    border-top: 4px solid #f7b3b3;
  }
}
</style>
