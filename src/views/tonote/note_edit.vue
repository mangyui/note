<template>
  <div class="app-container">
    <span class="header-title">笔记编辑</span>
    <div v-if="showLoading" class="loading-box">
      <i class="el-icon-loading"></i>
      加载中...
    </div>
    <!-- <div class="crumbs disNone">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 笔记本</el-breadcrumb-item>
          <el-breadcrumb-item>修改笔记</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div class="container big-box1200">
      <pictureOcr v-show="isOcr" ocrIcon="form_search" ocrMode="shouxie" @Oresult="Getresult"></pictureOcr>
      <el-button class="de-more" type="danger" size="small" @click="isOcr=!isOcr">{{isOcr?"关闭":"开启"}}文字识别</el-button>
      <div class="noteEdit-title">
        <h4 class="htitle">笔记标题</h4>
        <el-input v-model="note.Headline" placeholder="请输入内容"></el-input>
      </div>
      <div class="noteEdit-title">
      <h4 class="htitle">笔记正文</h4>
        <div ref="editor" class="divWangeditor" style="text-align:left"></div>
        <!-- <quill-editor ref="myTextEditor" v-model="note.Content" :options="editorOption"></quill-editor> -->
        <br/>
        <div class="voice-button">
          <div class="voice-input-button-wrapper">
            <voiceBtn @record="showResult"></voiceBtn>
          </div>
        </div>
        <el-button size="large" type="primary" class="mobile_bbtn" @click="dialogFormVisible = true">提交</el-button>
      </div>
      <el-dialog title="笔记备注" :visible.sync="dialogFormVisible">
        <el-form :model="note" ref="form">
          <el-form-item label="笔记分类">
            <el-select v-model="note.NoteCategoryId" placeholder="请选择笔记分类">
              <el-option
                v-for="item in typelist"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id">
              </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-plus" @click="$refs.addType.showAdd = true" circle></el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submit">确定修改</el-button>
        </div>
      </el-dialog>
    </div>

    <addType ref="addType" MistakeOrNote="note" @addBack="addBack"></addType>
  </div>
</template>

<script>

// wangeditor 富文本
var editor
import { NoteImg } from '@/api/upload'
import { NoteCategory } from '@/api/toget'
import {
  UpdateNote,
  NoteDetails
} from '@/api/toPost'
import voiceBtn from '@/components/voice/index'
import pictureOcr from '@/components/picture-ocr/index'
import addType from '@/views/common/addType'

export default {
  name: 'note_edit',
  data: function() {
    return {
      isOcr: true,
      dialogFormVisible: false,
      showGIF: false,
      lines: '',
      result: '',
      showLoading: true,
      typelist: [],
      note: {
        Id: '',
        Headline: '',
        Content: '',
        NoteCategoryId: ''
      }
    }
  },
  components: {
    pictureOcr,
    voiceBtn,
    addType
  },
  methods: {
    Getresult(value) {
      this.lines = value.lines
      this.result = value.result
      this.formatText()
    },
    formatText() {
      if (this.lines > 0) {
        this.result.forEach(item => {
          if (this.Content === '') {
            editor.txt.html('<span>' + item.words + '</span>')
          } else {
            editor.txt.append('<p>' + item.words + '</p>')
          }
          this.Content = this.Content + item.words + '<br />'
        })
        this.$notify({
          title: '提示',
          message: '已提取图中文字',
          type: 'info'
        })
      } else {
        this.$notify({
          title: '提示',
          message: '没有提取任何文字信息，请检查图片再操作！',
          type: 'info'
        })
      }
    },
    addBack() {
      this.getCategory()
    },
    getCategory() {
      NoteCategory(this.$store.getters.user.Id).then(res => {
        if (res.data.code === 0) {
          this.typelist = res.data.data
        } else {
          this.$message.warning('获取笔记分类失败...')
        }
      }).catch(() => {})
    },
    submit() {
      if (this.note.Headline.trim().length === 0) {
        this.$notify({
          title: '提示',
          message: '笔记标题不能为空！',
          type: 'warning'
        })
        return
      }
      UpdateNote(this.$qs.stringify(this.note)).then(res => {
        if (res.data.code === 0) {
          this.$router.push({
            path: '/tonote/note_detail/' + this.note.Id
          })
          this.dialogFormVisible = false
        } else {
          this.$message.warning('添加失败...')
        }
      }).catch(() => {})
    },
    getNote() {
      NoteDetails(this.$qs.stringify({ Id: this.note.Id })).then(res => {
        this.note = res.data.data
        if (!this.note.UserId || this.note.UserId !== this.$store.getters.user.Id) {
          this.$message.warning('没有找到...')
          var close = document.querySelector('.tags-view-item.active .el-icon-close')
          close.click()
        } else {
          this.showLoading = false
          editor.txt.html(this.note.Content)
        }
      }).catch(() => {
        this.$message.warning('系统错误...')
      })
    },
    fetchDate() {
      this.note.Id = this.$route.params.id
      if (this.note.Id) {
        this.getNote()
      }
    },
    showResult(text) {
      if (this.note.Content === '') {
        editor.txt.html('<span>' + text.substr(0, text.length - 1) + '</span>')
      } else {
        editor.txt.append('<span>' + text.substr(0, text.length - 1) + '</span>')
      }
    }
  },
  created() {
    this.fetchDate()
    this.getCategory()
  },
  mounted() {
    var That = this
    editor = new this.$E(this.$refs.editor)
    editor.customConfig = {
      onchange: function(html) {
        That.note.Content = html
      },
      uploadImgServer: NoteImg, // 上传图片到服务器
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
  }
}
</script>

<style lang="scss" scoped>
.container{
  border: 0;
}
</style>
