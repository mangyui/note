<template>
  <div>
    <div class="crop-demo">
      <label ref="select_frame"  class="crop-topimg" :style="{backgroundImage:'url(' + cropImg + ')', backgroundSize:'contain'}">
        <img v-show="cropImg" preview :src="cropImg" class="up_img" >
        <div v-if="!cropImg" class="up_inside">
          <nx-svg-icon class-name='icon-camera' :icon-class="cutIcon" />
          <p>请选择图像上传方式{{documentWidth<768?"":"，或将图像拖到此处"}}</p>
        </div>
        <!-- <div class="tuoUp"></div> -->
        <img v-if="showGIF" class="loading-gif" src="@/assets/images/home/loading2.gif" alt="Loading">
      </label>
      <div class="upbtn-group">
        <el-button type="primary" @click="cameraTakePicture">拍照上传</el-button>
        <div class="crop-demo-btn tiffany-btn">上传图片
          <input class="crop-input" ref="referenceUpload" id='upimg' type="file" name="image" accept="image/*" multiple @change="toChoose" />
        </div>
      </div>
    </div>
    <el-dialog class="crop-pic" title="裁剪图片" :visible.sync="dialogVisible" :before-close="cancelCrop" width="70%">
      <vue-cropper class="dgCropper" ref='cropper' :auto-crop-area="1" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" :style="'width:100%;  height: '+ 0.7*documentWidth + 'px'"></vue-cropper>
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
import { dataURLtoBlob, blobToFile } from '@/utils/index.js'
import {
  CutQuestion,
  ToSearchs
} from '@/api/toPost'

import VueCropper from 'vue-cropperjs'
import { dataURLtoFile } from '@/utils/index.js'
import nxSvgIcon from '@/components/nx-svg-icon/index'
export default {
  name: 'picture_ocr',
  components: {
    VueCropper,
    nxSvgIcon
  },
  props: {
    cutIcon: String
  },
  data() {
    return {
      documentWidth: document.body.clientHeight,
      lines: '',
      result: '',
      cropImg: '',
      imgSrc: '',
      locs: [],
      dialogVisible: false,
      showGIF: false
    }
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
      this.$emit('CImage', this.cropImg)
      this.cutQuestion()
    },
    toRotate() {
      this.$refs.cropper.rotate(5)
    },
    cutQuestion() {
      this.showGIF = true
      var blob = dataURLtoBlob(this.cropImg)
      var file = blobToFile(blob, 'cutpicture')
      var data = new FormData()
      data.append('file', file, 'cutpicture.png')
      CutQuestion(data).then(res => {
        if (res.data.code === 0 && res.data.data[0]) {
          this.locs = res.data.data
          this.getSearchs()
          this.$emit('Cresult', res.data.data)
        } else {
          this.$notify({
            title: '提示',
            message: '未识别到相应题目！',
            type: 'info'
          })
        }
        this.showGIF = false
      }).catch((error) => {
        console.log(error)
        this.showGIF = false
      })
    },
    getSearchs() {
      var words = []
      this.locs.forEach(item => {
        words.push(item.words)
      })
      var data = {
        Texts: words
      }
      ToSearchs(this.$qs.stringify(data)).then(res => {
        this.$emit('Cquestion', res.data.data)
        // console.log(res.data)
      }).catch(() => {
        console.log('获取数据失败！')
      })
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
  }
}
</script>

<style lang="scss" scoped>

.crop-topimg{
   display: block;
   cursor: pointer;
   width: 100%;
   max-width: 750px;
   margin: 0 auto;
   height: 500px;
   border: 0.11em dashed #d9d9d9;
   border-radius: 5px;
   background-size: cover;
   background-repeat: no-repeat;
   background-position: center;
   padding-bottom: 26%;
   height: 0;
   position: relative;
   background-color: #fff;
 }
 .tuoUp{
   height: 100%;
   position: absolute;
   width: 100%;
 }
 .up_inside{
   width: 100%;
   text-align: center;
   position: absolute;
   top: calc(50% - 61px);
   .icon-camera{
     margin-bottom: 0;
     font-size: 80px;
     fill: #52bab5;
   }
 }
 .up_img{
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0;
}
 .up_inside i,.up_inside .icon-camera{
   font-size: 67px;
   color: #c0c4cc;
   margin-bottom: 16px;
   line-height: 50px;
 }
 .up_inside p{
   color: #606266;
   font-size: 14px;
   font-weight: normal;
   margin-top: 10px
 }
 .flex-center {
   display: flex;
   justify-content: center;
   align-items: center;
 }
 .loading-gif {
   z-index: 99999;
   position: absolute;
   top: 50%;
   left: 50%;
   margin-left: -125px;
   margin-top: -38px;
   opacity: 0.6;
 }
 .upload_img{
   position: relative;
 }
 .run_btn{
     position: relative;
    //  height: 150px;
     text-align: center;
    //  line-height: 150px;
 }
@media (max-width: 768px) {
  .crop-topimg {
      padding-bottom: 55%;
  }
  .dgCropper{
    height: 370px!important;
  }
}
</style>
