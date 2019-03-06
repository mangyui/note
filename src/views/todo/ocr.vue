<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 操作</el-breadcrumb-item>
        <el-breadcrumb-item>图片文字识别</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="inside-box">
        <div class="tipbox tip-warning">
          <ul>
            <li>图片文件过大会影响识别速度</li>
          </ul>
        </div>
        <div class="crop-demo">
          <label ref="select_frame"  class="crop-topimg" for="upimg" :style="{backgroundImage:'url(' + cropImg + ')', backgroundSize:'contain'}">
            <!-- <img v-if="cropImg" :src="cropImg" class="pre-img"> -->
            <div v-if="!cropImg" class="up_inside">
              <i class="el-icon-upload"></i>
              <p>{{screenWidth>770?"将图片拖到这里，或点击上传":"点击选择上传图片或打开相机"}}</p>
            </div>
            <div ref="select_frame" class="tuoUp"></div>
          </label>
          <div class="upbtn-group">
            <div class="crop-demo-btn">上传图片
              <input class="crop-input" ref="referenceUpload" id='upimg' type="file" name="image" accept="image/*" multiple @change="toChoose" />
            </div>
          </div>
        </div>
        <div class="run_btn">
          <img v-if="showGIF" class="loading-gif" src="@/assets/images/home/loading2.gif" alt="Loading">
          <el-checkbox v-model="isHand" label="含手写" border></el-checkbox>
          <el-button class="editor-btn" type="primary" plain @click="torun">提取文字</el-button>
        </div>
        <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
        <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        <div>
          <h3 v-if="questions[0]" class="Hpipei">猜你要找:</h3>
          <quex-box :option="questions"></quex-box>
        </div>
      </div>
    </div>
    <el-dialog title="裁剪图片" :visible.sync="dialogVisible" :before-close="cancelCrop" width="90%">
      <vue-cropper class="dgCropper" ref='cropper' :auto-crop-area="1" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;  height: 480px;"></vue-cropper>
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
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import quexBox from '@/components/my-box/quex-box'
import { quillEditor } from 'vue-quill-editor'
import VueCropper from 'vue-cropperjs'
import axios from 'axios'
import qs from 'qs'

import {
  getNoteList
} from '@/api/notes'

export default {
  name: 'ocr',
  components: {
    VueCropper,
    quillEditor,
    quexBox
  },
  data: function() {
    return {
      screenWidth: document.body.clientWidth,
      showGIF: false,
      lines: '',
      result: '',
      content: '',
      isHand: false,
      editorOption: {
        placeholder: '等待提取中...'
      },
      cropImg: '',
      imgSrc: '',
      dialogVisible: false,
      questions: []
    }
  },
  methods: {
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
    },
    // handleClose(done) {
    //   this.cropImg = ''
    //   done()
    // },
    toRotate() {
      this.$refs.cropper.rotate(20)
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
      var url = 'https://mccyu.com:444/ocr'
      if (this.isHand === true) {
        url = 'https://mccyu.com:444/shouxie'
      }
      axios.post(url, qs.stringify(ocr_data))
        .then(res => {
          this.result = res.data.words_result
          this.lines = res.data.words_result_num
          this.formatText()
          this.showGIF = false
          console.log(res.data.words_result_num)
        })
        .catch(err => console.error(err))
    },
    formatText() {
      if (this.lines > 0) {
        this.$notify({
          title: '提示',
          message: '文字提取成功！',
          type: 'success'
        })
        this.result.forEach(item => {
          this.content = this.content + item.words + '<br />'
        })
        // 这里获取相关题目
        this.getNotes()
      } else {
        this.$notify({
          title: '提示',
          message: '没有提取任何文字信息，请检查图片再操作！',
          type: 'info'
        })
      }
    },
    submit() {
      console.log(this.content)
      this.$message.success('提交成功！')
    },
    getNotes() {
      getNoteList().then(res => {
        this.questions = res.data
      }).catch(() => {})
    }
  },
  mounted() {
    this.$refs.select_frame.ondragleave = (e) => {
      // 阻止离开时的浏览器默认行为
      e.preventDefault()
      this.$refs.select_frame.style.backgroundColor = '#fff'
      this.$refs.select_frame.style.border = '0.11em dashed #d9d9d9'
    }
    this.$refs.select_frame.ondrop = (e) => {
      e.preventDefault()
      const data = e.dataTransfer.files[0]
      if (data.length < 1) {
        return
      }
      this.setImage(data)
      this.$refs.select_frame.style.backgroundColor = '#fff'
      this.$refs.select_frame.style.border = '0.11em dashed #d9d9d9'
    }
    this.$refs.select_frame.ondragenter = (e) => {
      e.preventDefault()
      this.$refs.select_frame.style.backgroundColor = '#edf8f7'
      this.$refs.select_frame.style.border = '0.11em dashed #52bab5'
    }
    this.$refs.select_frame.ondragover = (e) => {
      e.preventDefault()
    }
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
  },
  created() {

  }
}
</script>

<style scoped lang="scss">
    @import '../../styles/ocr.scss';
</style>
