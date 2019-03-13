<template>
  <div class="app-container">
    <span class="header-title">语音搜题</span>
    <div class="crumbs disNone">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 操作</el-breadcrumb-item>
          <el-breadcrumb-item>语音输入</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="voice">
      <div class="tipbox tip-warning">
        <ul>
          <li>初次使用将请求语音权限，请同意后使用</li>
        </ul>
      </div>
      <div class="voice-button_right">
        <!-- <el-tooltip class="item" effect="dark" content="转入编辑器" placement="top-end">
          <el-button type="success" icon="el-icon-sort" circle @click="toeditor"></el-button>
        </el-tooltip> -->
        <el-tooltip class="item" effect="dark" content="撤销" placement="top-end">
          <el-button type="primary" icon="el-icon-refresh" circle @click="undo"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="全部清空" placement="top-end">
          <el-button type="danger" icon="el-icon-close" circle @click="allDelete"></el-button>
        </el-tooltip>
      </div>
      <textarea class="result" v-model="result" placeholder="等待录入中..."></textarea>
      <div class="voice-button">
         <el-tooltip class="item" effect="dark" content="按住开始语音" placement="bottom-start">
          <div class="voice-input-button-wrapper">
            <voice-input-button
                server="https://www.mccyu.com:444/"
                appId="5c52f87b"
                APIKey="3d0fba416f2a2423e7380ea2ab397d9e"
                @record="showResult"
                @record-start="recordStart"
                @record-stop="recordStop"
                @record-blank="recordNoResult"
                @record-failed="recordFailed"
                color="#fff"
                tipPosition="top"
            >
              <template slot="no-speak">没听清您说的什么</template>
            </voice-input-button>
          </div>
        </el-tooltip>
      </div>
      <div class="">
        <el-button type="primary" icon="el-icon-search" @click="SearchQuestion"></el-button>
      </div>
      <p>以下匹配：<b v-text="result"></b></p>
      <h3 v-if="questions[0]" class="Hpipei"> </h3>
      <quex-box :option="questions"></quex-box>
      <div v-if="showLoading" class="loading-box">
        <i class="el-icon-loading"></i>
        加载中...
      </div>
      <div v-if="showNone" class="loading-box">
        <i class="el-icon-search"></i>
        没找到你想要的...
      </div>
      <div v-if="showMore" class="loading-box">
        <i class="el-icon-loading"></i>
        加载更多中...
      </div>
      <div v-if="!showMore && NoneMore" class="loading-box">
        <i class="el-icon-search"></i>
        没有更多了...
      </div>
      <!-- <quill-editor ref="myTextEditor" v-model="content" :options="editorOption" @change="onEditorChange($event)"></quill-editor>
      <el-button class="editor-btn" type="primary" @click="submit">提交</el-button> -->
    </div>
    <div v-if="ScrollTop>700" class="note_d-edit" onclick="document.querySelector('.app-main').scrollTop=0">
      <el-button class="tototop" icon="el-icon-d-arrow-left" circle></el-button>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import VoiceInputButton from 'voice-input-button'
import { quillEditor } from 'vue-quill-editor'
import quexBox from '@/components/my-box/quex-box'

import {
  SearchQues
} from '@/api/toPost'
import qs from 'qs'

export default {
  name: 'voice',
  components: {
    VoiceInputButton,
    quillEditor,
    quexBox
  },
  data() {
    return {
      homeTop: 0,
      ScrollTop: 0,
      showLoading: false,
      showNone: false,
      result: '',
      oldResult: '',
      content: '',
      editorOption: {
        placeholder: '等待转入中...'
      },
      questions: [],
      showMore: false,
      NoneMore: false,
      Sdata: {
        Keys: '',
        Page: 1,
        Number: 10,
        CategoryId: 0
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
  methods: {
    // onEditorChange({ quill, html, text }) {
    //   this.content = html
    // },
    // submit() {
    //   console.log(this.content)
    //   this.$message.success('提交成功！')
    // },
    showResult(text) {
      this.oldResult = this.result
      this.result = this.result + text.substr(0, text.length - 1)
      this.SearchQuestion()
    },
    recordStart() {
      console.info('录音开始')
    },
    recordStop() {
      console.info('录音结束')
    },
    recordNoResult() {
      console.info('没有录到什么，请重试')
    },
    recordFailed(error) {
      console.info('识别失败，错误栈：', error)
    },
    allDelete() {
      this.oldResult = this.result
      this.result = ''
    },
    undo() {
      var str = this.oldResult
      this.oldResult = this.result
      this.result = str
    },
    SearchQuestion() {
      this.Sdata.Page = 1
      this.showNone = false
      this.NoneMore = false
      this.showLoading = true
      this.Sdata.Keys = this.result.substring(0, 50)
      SearchQues(qs.stringify(this.Sdata)).then(res => {
        this.questions = res.data.data
        this.showLoading = false
        if (!this.questions[0]) {
          this.showNone = true
        } else {
          this.showNone = false
        }
      }).catch(() => {})
    },
    toeditor() {
      this.content = this.content + this.result
      this.SearchQuestion()
    },
    onScroll() {
      var innerHeight = document.querySelector('.app-container').clientHeight
      var outerHeight = document.querySelector('.app-main').clientHeight
      var scrollTop = document.querySelector('.app-main').scrollTop
      this.ScrollTop = scrollTop
      if (innerHeight <= (outerHeight + scrollTop)) {
        if (this.NoneMore || this.showMore) {
          return
        }
        this.showMore = true
        this.Sdata.Page++
        SearchQues(qs.stringify(this.Sdata)).then(res => {
          this.questions = this.questions.concat(res.data.data)
          this.showMore = false
          if (res.data.data.length < this.Sdata.Number) {
            this.NoneMore = true
          } else {
            this.NoneMore = false
          }
        }).catch(() => {})
      }
    }
  },
  mounted() {
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  created() {
  }
}
</script>

<style>
  #voice {
    margin: 30px auto;
    width: 1200px;
    max-width: 100%;
  }
  .voice-input-button-wrapper{
    width: 42px;
    height: 42px;
    background-color: mediumpurple;
    border-radius: 50%;
  }
  .result{
    width: 100%;
    padding: 10px 15px;
    border: #e2e2e2 1px solid;
    border-radius: 5px;
    line-height: 2;
    font-size: 16px;
    color: #727272;
    min-height: 24px;
    height: 150px;
  }
  .voice-button,.voice-button_right{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .voice-button{
    justify-content: center;
  }
  .editor-btn{
      margin-top: 20px;
  }
  .el-button.is-circle{
    width: 42px;
    height: 42px;
    padding: 0;
  }
  .voice-button_right .el-button i{
    font-size: 24px;
  }
</style>
