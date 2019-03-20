<template>
  <div class="app-container">
    <span class="header-title">笔记编辑</span>
    <div v-if="showLoading" class="loading-box">
      <i class="el-icon-loading"></i>
      加载中...
    </div>
    <div class="crumbs disNone">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 笔记本</el-breadcrumb-item>
          <el-breadcrumb-item>修改笔记</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container big-box1200">
      <el-card shadow="never" v-loading="showGIF">
        <div class="upbtn-group">
          <el-button type="primary" @click="cameraTakePicture">拍照上传</el-button>
          <div class="crop-demo-btn">上传图片
            <input class="crop-input" ref="referenceUpload" id='upimg' type="file" name="image" accept="image/*" multiple @change="toChoose" />
          </div>
      </div>
      </el-card>
      <div class="noteEdit-title">
        <h4>笔记标题</h4>
        <el-input v-model="note.Headline" placeholder="请输入内容"></el-input>
      </div>
      <div class="noteEdit-title">
      <h4>笔记正文</h4>
        <div ref="editor" class="divWangeditor" style="text-align:left"></div>
        <!-- <quill-editor ref="myTextEditor" v-model="note.Content" :options="editorOption"></quill-editor> -->
        <br/>
        <div class="voice-button">
          <div class="voice-input-button-wrapper">
            <voice-input-button
                server="https://www.mccyu.com:444/"
                appId="5c52f87b"
                APIKey="3d0fba416f2a2423e7380ea2ab397d9e"
                @record="showResult"
                color="#fff"
                tipPosition="top"
            >
              <template slot="no-speak">没听清您说的什么</template>
            </voice-input-button>
          </div>
        </div>
        <el-button type="primary" @click="dialogFormVisible = true">提交</el-button>
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
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确定修改</el-button>
        </div>
      </el-dialog>
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

export default {
  name: 'note_edit',
  data: function() {
    return {
      dialogFormVisible: false,
      dialogVisible: false,
      showGIF: false,
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
      this.$notify({
        title: '提示',
        message: '网页端请选择上传图片的方式！',
        type: 'info'
      })
      // navigator.camera.getPicture(this.onSuccess, this.onFail, {
      //   quality: 50,
      //   destinationType: Camera.DestinationType.DATA_URL,
      //   encodingType: Camera.EncodingType.JPEG,
      //   sourceType: Camera.PictureSourceType.Camera
      // })
    },
    onSuccess(imageURI) {
      var file = this.dataURLtoFile('data:image/jpeg;base64,' + imageURI, 'camera.jpeg')
      this.setImage(file)
    },
    onFail(mess) {
      console.log('未选择图片')
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = window.atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      var blob = new Blob([u8arr], { type: mime })
      blob.lastModifiedDate = new Date()
      blob.name = filename
      return blob
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
    // handleClose(done) {
    //   this.cropImg = ''
    //   done()
    // },
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
      var url = 'https://mccyu.com:444/shouxie'
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
    toright() {
      this.btnRight = this.btnRight === '0' ? '-96px' : '0'
      var btnF = document.querySelector('.btngroup_first .el-icon-back')
      btnF.style.transform = this.btnRight === '0' ? 'rotate(180deg)' : ''
    },
    scrollRight() {
      this.scroll(-2)
    },
    scrollLeft() {
      this.scroll(
        2)
    },
    scroll(nn) {
      // var toolbar = document.getElementsByClassName('ql-toolbar')[0]
      // toolbar.style.left = toolbar.offsetLeft + nn + 'px'
      // console.log(toolbar.offsetLeft)
      var toolbar = document.querySelector('.ql-toolbar')
      var toobarWidth = toolbar.offsetWidth - 1430

      var firstchild = document.querySelector('.ql-formats')
      var ov = setInterval(() => {
        // toolbar.scrollBy(nn, 0)
        if (this.marginL <= 0 && this.marginL >= toobarWidth) {
          this.marginL = this.marginL + nn
          if (this.marginL > 0) {
            this.marginL = 0
          }
          if (this.marginL < toobarWidth) {
            this.marginL = toobarWidth
          }
        }
        firstchild.style.marginLeft = this.marginL + 'px'
      }, 2)
      setTimeout(function() {
        clearInterval(ov)
      }, 500)
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
    // var Imgurl = 'http://192.168.1.105/'
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

<style lang="scss">
.edit-container{
  .noteEdit-title{
    margin-bottom: 25px;
    padding: 5px;
  }
  // .quill-editor{
  //   .ql-snow.ql-toolbar{
  //     position: fixed;
  //     background: #fff;
  //     z-index: 10;
  //     border: 0;
  //     border-bottom: 1px solid rgba(0,0,0,.05);
  //     box-shadow: 0 1px 10px rgba(90,109,122,.4);
  //     text-overflow: ellipsis;
  //     white-space: nowrap;
  //     // overflow-x: hidden;
  //     // overflow-y: visible;
  //     left: 210px;
  //     right: 0;
  //     height: 55px;
  //     transition: all .28s;
  //     &::-webkit-scrollbar {
  //         display: none;
  //     }
  //     button,.ql-color-picker,.ql-icon-picker{

  //       margin: 5px;
  //       height: 28px;
  //       width: 31px;

  //       &:hover{
  //         background: #f1f3f6;
  //       }
  //     }
  //     .ql-picker:hover{
  //        background: #f1f3f6;
  //     }
  //   }

  //   .ql-container div.ql-editor{
  //     height: 100%;
  //     border-bottom: 1px solid rgba(0,0,0,.05);
  //     padding-top: 90px;
  //   }
  //   .ql-container.ql-snow{
  //     border: 0;
  //   }
  // }
  // .btn-wrapper{
  //   position: fixed;
  //   right: -96px;
  //   bottom: 200px;
  //   box-shadow: 0 1px 10px rgba(64, 158, 255,.5);
  //   transition: all 0.3s;
  //   .el-button{
  //     border-radius: 0;
  //     padding: 12px 16px;
  //   }
  // }
}
@media (max-width: 768px)
{
  // .edit-container{
  //   .quill-editor{
  //     .ql-container div.ql-editor{
  //      height: calc(100% - 56px);
  //     }
  //     // .ql-snow.ql-toolbar{
  //     //   overflow: auto;
  //     // }
  //   }
  // }
}
</style>
