<template>
  <div class="app-container">
    <span class="header-title">添加笔记</span>
    <div class="container big-box1200">

      <pictureOcr v-show="isOcr" ocrIcon="form_search" ocrMode="手写" @Oresult="Getresult"></pictureOcr>
      <el-button class="de-more" type="danger" size="small" @click="isOcr=!isOcr">{{isOcr?"关闭":"开启"}}文字识别</el-button>

      <div class="noteEdit-title">
        <h4 class="htitle">笔记标题</h4>
        <el-input v-model="note.Headline" placeholder=""></el-input>
      </div>
      <div class="noteEdit-title">
      <h4 class="htitle">笔记正文</h4>
        <div ref="editor" class="divWangeditor" style="text-align:left"></div>
        <div class="voice-button">
          <div class="voice-input-button-wrapper">
            <voiceBtn @record="showResult"></voiceBtn>
          </div>
        </div>
        <el-button size="large" class="mobile_bbtn" type="primary" @click="dialogFormVisible = true">提交</el-button>
      </div>
      <el-dialog title="笔记备注" :visible.sync="dialogFormVisible">
        <el-form :model="note" :rules="rules" ref="Form">
          <!-- <el-form-item label="关键字">
            <el-input v-model="form.Keywords"></el-input>
          </el-form-item> -->
          <el-form-item label="笔记分类" prop="NoteCategoryId">
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
          <el-button size="small" type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <addType ref="addType" MistakeOrNote="note" @addBack="addBack"></addType>
  </div>
</template>

<script>
// wangeditor 富文本
var editor

import { NoteCategory } from '@/api/toget'
import { AddNote, Imgurl } from '@/api/toPost'
import voiceBtn from '@/components/voice/index'
import pictureOcr from '@/components/picture-ocr/index'
import addType from '@/views/common/addType'
export default {
  name: 'edit',
  components: {
    voiceBtn,
    pictureOcr,
    addType
  },
  data: function() {
    return {
      isOcr: true,
      dialogFormVisible: false,
      showGIF: false,
      lines: '',
      result: '',
      typelist: [],
      Content: '',
      note: {
        UserId: this.$store.getters.user.Id,
        Headline: '',
        Content: '',
        NoteCategoryId: ''
      },
      rules: {
        NoteCategoryId: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getCategory()
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
            editor.txt.append('<span>' + item.words + '</span>')
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
    getCategory() {
      if (!this.$store.getters.user.Id) {
        return
      }
      NoteCategory(this.$store.getters.user.Id).then(res => {
        if (res.data.code === 0) {
          this.typelist = res.data.data
        } else {
          this.$message.warning('获取笔记分类失败...')
        }
      }).catch(() => {})
    },
    addBack() {
      this.getCategory()
    },
    submit() {
      if (!this.$store.getters.user.Id) {
        this.$confirm('你这个操作，登录就能解决', '提示', {
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
      editor.change && editor.change()
      if (this.note.Headline.trim().length === 0) {
        this.$notify({
          title: '提示',
          message: '笔记标题不能为空！',
          type: 'warning'
        })
        // this.note.Content += '<br/>'
        // console.log(this.note.Content)
        return
      }
      this.$refs.Form.validate(valid => {
        if (valid) {
          AddNote(this.$qs.stringify(this.note)).then(res => {
            if (res.data.code === 0) {
              this.$router.push({
                path: '/tonote/note_detail/' + res.data.data
              })
              this.dialogFormVisible = false
            } else {
              this.$message.warning('添加失败...')
            }
          }).catch(() => {})
        }
      })
    },
    showResult(text) {
      if (this.note.Content === '') {
        editor.txt.html('<span>' + text.substr(0, text.length - 1) + '</span>')
      } else {
        editor.txt.append('<span>' + text.substr(0, text.length - 1) + '</span>')
      }
      // console.log(text.substr(0, text.length - 1))
    }
  },
  mounted() {
    var That = this
    editor = new this.$E(this.$refs.editor)
    // console.log(editor.customConfig)
    editor.customConfig = {
      onchange: function(html) {
        That.note.Content = html
        // console.log(That.note.Content)
      },
      uploadImgServer: Imgurl + '?service=App.Upload.Upload', // 上传图片到服务器
      uploadFileName: 'file', // 后端使用这个字段获取图片信息
      uploadImgMaxLength: 1, // 限制一次最多上传 1 张图片
      showLinkImg: false,
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
