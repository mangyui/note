<template>
  <div class="app-container">
    <span class="header-title">添加笔记</span>
      <!-- <div class="crumbs disNone">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-date"></i> 添加笔记</el-breadcrumb-item>
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
        <el-input v-model="note.Headline" placeholder=""></el-input>
      </div>
      <div class="noteEdit-title">
      <h4 class="htitle">笔记正文</h4>
        <div ref="editor" class="divWangeditor" style="text-align:left"></div>
        <!-- <br/>
        <quill-editor ref="myTextEditor" v-model="note.Content" :options="editorOption"></quill-editor> -->
        <!-- <br/> -->
        <div class="voice-button">
          <div class="voice-input-button-wrapper">
            <voice-input-button
                :server="voice.serverurl"
                :appId="voice.appId"
                :APIKey="voice.APIKey"
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
        </div>
        <el-button class="mobile_bbtn" type="primary" @click="dialogFormVisible = true">提交</el-button>
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
            <el-button type="primary" icon="el-icon-plus" @click="showAdd=!showAdd" circle></el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog title="添加笔记分类" :visible.sync="showAdd">
      <el-form :model="toadd" :rules="addrules" ref="addForm" label-width="100px">
        <el-form-item label="笔记分类名" prop="Name">
          <el-input v-model="toadd.Name"></el-input>
        </el-form-item>
        <el-form-item label="分类说明" prop="Intro">
          <el-input type="textarea" v-model="toadd.Intro"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addNoteType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// wangeditor 富文本
var editor

import { NoteCategory } from '@/api/toget'
import { AddNote, AddNoteType, Imgurl } from '@/api/toPost'
import VueCropper from 'vue-cropperjs'
import { dataURLtoFile } from '@/utils/index.js'
import { voice, ocr } from '@/utils/private.js'

export default {
  name: 'edit',
  components: {
    VueCropper
  },
  data: function() {
    return {
      dialogFormVisible: false,
      dialogVisible: false,
      voice: voice,
      showGIF: false,
      lines: '',
      result: '',
      isHand: false,
      cropImg: '',
      imgSrc: '',
      showAdd: false,
      btnRight: '-96px',
      marginL: 0,
      totalwidth: 1430,
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
      },
      toadd: {
        UserId: this.$store.getters.user.Id,
        Name: '',
        Intro: ''
      },
      addrules: {
        Name: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        Intro: [
          { min: 0, max: 30, message: '长度在 0 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCategory()
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
      this.$axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
      var url = ocr.shouxie
      this.$axios.post(url, this.$qs.stringify(ocr_data))
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
          editor.txt.append('<p>' + item.words + '<p>')
          // this.form.Text = this.form.Text + item.words
        })
        // editor.txt.append('<p>' + this.Content + '</p>')
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
    addNoteType() {
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
      this.$refs.addForm.validate(valid => {
        if (valid) {
          AddNoteType(this.$qs.stringify(this.toadd)).then(res => {
            if (res.data.code === 0) {
              this.$notify({
                title: '提示',
                message: '添加分类成功！',
                type: 'success'
              })
            } else {
              this.$message.warning('操作失败...')
            }
            this.showAdd = false
            this.getCategory()
          }).catch(() => {})
        }
      })
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
        console.log(this.note.Content)
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
    toright() {
      this.btnRight = this.btnRight === '0' ? '-96px' : '0'
      var btnF = document.querySelector('.btngroup_first .el-icon-back')
      btnF.style.transform = this.btnRight === '0' ? 'rotate(180deg)' : ''
    },
    scrollRight() {
      this.scroll(-2)
    },
    scrollLeft() {
      this.scroll(2)
    },
    scroll(nn) {
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
    showResult(text) {
      editor.txt.append('<span>' + text.substr(0, text.length - 1) + '</span>')
      // console.log(text.substr(0, text.length - 1))
    },
    recordStart() {
    },
    recordStop() {
    },
    recordNoResult() {
    },
    recordFailed(error) {
      console.info('识别失败，错误栈：', error)
    }
  },
  mounted() {
    var That = this
    editor = new this.$E(this.$refs.editor)
    console.log(editor.customConfig)
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
    // editor.customConfig.menus = [
    //   'head1', // 标题
    //   'bold', // 粗体
    //   'fontSize', // 字号
    //   'fontName', // 字体
    //   'italic', // 斜体
    //   'underline', // 下划线
    //   'strikeThrough', // 删除线
    //   'foreColor', // 文字颜色
    //   'backColor', // 背景颜色
    //   'link', // 插入链接
    //   'list', // 列表
    //   'justify', // 对齐方式
    //   'quote', // 引用
    //   'emoticon', // 表情
    //   'image', // 插入图片
    //   'table', // 表格
    //   'code', // 插入代码
    //   'symbols',
    //   'undo', // 撤销
    //   'redo' // 重复
    // ]
    editor.create()
  }
}
</script>

<style lang="scss" scoped>

.container{
  border: 0;
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
