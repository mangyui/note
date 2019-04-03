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
      <el-card shadow="never" v-loading="showGIF">
        <div class="upbtn-group">
          <el-button type="primary" @click="cameraTakePicture">拍照上传</el-button>
          <div class="crop-demo-btn tiffany-btn">上传图片
            <input class="crop-input" ref="referenceUpload" id='upimg' type="file" name="image" accept="image/*" multiple @change="toChoose" />
          </div>
      </div>
      </el-card>
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
            <voice-input-button
                :server="voice.serverurl"
                :appId="voice.appId"
                :APIKey="voice.APIKey"
                @record="showResult"
                color="#fff"
                tipPosition="top"
            >
              <template slot="no-speak">没听清您说的什么</template>
            </voice-input-button>
          </div>
        </div>
        <el-button type="primary" class="mobile_bbtn" @click="dialogFormVisible = true">提交</el-button>
      </div>
      <el-dialog class="crop-pic" title="裁剪图片" :visible.sync="dialogVisible" :before-close="cancelCrop" width="70%">
        <vue-cropper class="dgCropper" ref='cropper' :auto-crop-area="1" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;  height: 400px;"></vue-cropper>
        <el-alert
          title="请旋转正常角度，提高识别准确率"
          type="warning"
          show-icon>
        </el-alert>
        <span slot="footer" class="dialog-footer">
          <el-button class="to-left" size="medium" @click="toRotate" type="primary" icon="el-icon-refresh"></el-button>
          <el-button size="medium" @click="cancelCrop">取 消</el-button>
          <el-button type="primary"  size="medium" @click="toCrop">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="笔记备注" :visible.sync="dialogFormVisible">
        <el-form :model="note" ref="form">
          <!-- <el-form-item label="关键字">
            <el-input v-model="form.Keywords"></el-input>
          </el-form-item> -->
          <el-form-item label="笔记分类">
            <el-select v-model="note.NoteCategoryId" placeholder="请选择笔记分类">
              <el-option
                v-for="item in typelist"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submit">确定修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

// wangeditor 富文本
import E from 'wangeditor'
var editor

import VoiceInputButton from 'voice-input-button'
import { NoteCategory } from '@/api/toget'
import {
  UpdateNote,
  NoteDetails,
  Imgurl
} from '@/api/toPost'
import VueCropper from 'vue-cropperjs'
import axios from 'axios'
import qs from 'qs'
import { dataURLtoFile } from '@/utils/index.js'
import { voice, ocr } from '@/utils/private.js'

export default {
  name: 'note_edit',
  data: function() {
    return {
      dialogFormVisible: false,
      dialogVisible: false,
      showGIF: false,
      voice: voice,
      lines: '',
      result: '',
      isHand: false,
      cropImg: '',
      imgSrc: '',
      showLoading: true,
      btnRight: '-96px',
      marginL: 0,
      totalwidth: 1430,
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
    VueCropper,
    VoiceInputButton
  },
  methods: {
    cameraTakePicture() {
      if (navigator.camera) {
        navigator.camera.getPicture(this.onSuccess, this.onFail, {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,//eslint-disable-line
          encodingType: Camera.EncodingType.JPEG,//eslint-disable-line
          sourceType: Camera.PictureSourceType.Camera//eslint-disable-line
        })
      } else {
        this.$notify({
          title: '提示',
          message: '网页端请选择上传图片的方式！',
          type: 'info'
        })
      }
    },
    onSuccess(imageURI) {
      var file = dataURLtoFile('data:image/jpeg;base64,' + imageURI, 'camera.jpeg')
      this.setImage(file)
    },
    onFail(mess) {
      console.log('未选择图片')
    },
    toChoose(e) {
      const file = e.target.files[0]
      this.setImage(file)
    },
    setImage(file) {
      if (!file || !file.type.includes('image/')) {
        return
      }
      const reader = new FileReader()
      reader.onload = event => {
        this.dialogVisible = true
        this.imgSrc = event.target.result
        this.$refs.cropper && this.$refs.cropper.replace(event.target.result)
      }
      reader.readAsDataURL(file)
      this.$refs.referenceUpload.value = null
    },
    cropImage() {
      // this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.7)
    },
    cancelCrop() {
      this.dialogVisible = false
      this.cropImg = ''
    },
    toCrop() {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.7)
      this.dialogVisible = false
      this.torun()
    },
    toRotate() {
      this.$refs.cropper.rotate(45)
    },
    torun() {
      if (!this.cropImg) {
        this.$notify({
          title: '提示',
          message: '请先上传图片后再操作！',
          type: 'warning'
        })
        return
      }
      this.showGIF = true
      var ocr_data = {
        'image': this.cropImg.replace(/data:image\/.*;base64,/, '')
      }
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
      var url = ocr.shouxie
      axios.post(url, qs.stringify(ocr_data))
        .then(res => {
          this.result = res.data.words_result
          this.lines = res.data.words_result_num
          this.formatText()
          // console.log(res.data.words_result_num)
        })
        .catch(err => console.error(err))
    },
    formatText() {
      if (this.lines > 0) {
        this.result.forEach(item => {
          this.Content = this.Content + item.words + '<br />'
          editor.txt.append('<p>' + item.words + '<p>' + '<br />')
          // this.form.Text = this.form.Text + item.words
        })
        // editor.txt.html(this.Content)
        this.$notify({
          title: '提示',
          message: '已提取图中文字',
          type: 'info'
        })
        // // 这里获取相关题目
        // this.getQues()
      } else {
        this.$notify({
          title: '提示',
          message: '没有提取任何文字信息，请检查图片再操作！',
          type: 'info'
        })
      }
      this.showGIF = false
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
      UpdateNote(qs.stringify(this.note)).then(res => {
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
      NoteDetails(qs.stringify({ Id: this.note.Id })).then(res => {
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
      editor.txt.append('<span>' + text.substr(0, text.length - 1) + '</span>')
      // console.log(text.substr(0, text.length - 1))
    }
  },
  // 注意
  // watch: {
  //   $route: 'fetchDate'
  // },
  created() {
    this.fetchDate()
    this.getCategory()
  },
  mounted() {
    var That = this
    editor = new E(this.$refs.editor)
    editor.customConfig = {
      onchange: function(html) {
        That.note.Content = html
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
