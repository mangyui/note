<template>
  <div class="app-container">
    <div class="crumbs">
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
        <el-tooltip class="item" effect="dark" content="转入编辑器" placement="top-end">
          <el-button type="success" icon="el-icon-sort" circle @click="toeditor"></el-button>
        </el-tooltip>
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
      <h3 v-if="questions[0]" class="Hpipei">猜你要找:</h3>
      <quex-box :option="questions"></quex-box>
      <!-- <quill-editor ref="myTextEditor" v-model="content" :options="editorOption" @change="onEditorChange($event)"></quill-editor>
      <el-button class="editor-btn" type="primary" @click="submit">提交</el-button> -->
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
  getNoteList
} from '@/api/notes'

export default {
  name: 'voice',
  components: {
    VoiceInputButton,
    quillEditor,
    quexBox
  },
  data() {
    return {
      result: '',
      oldResult: '',
      content: '',
      editorOption: {
        placeholder: '等待转入中...'
      },
      questions: []
    }
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      this.content = html
    },
    submit() {
      console.log(this.content)
      this.$message.success('提交成功！')
    },
    showResult(text) {
      this.oldResult = this.result
      this.result = this.result + text.substr(0, text.length - 1)
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
    toeditor() {
      this.content = this.content + this.result
      this.getNotes()
    },
    getNotes() {
      getNoteList().then(res => {
        this.questions = res.data
      }).catch(() => {})
    }
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
