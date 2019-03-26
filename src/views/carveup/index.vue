<template>
  <div class="">
    <span class="header-title">试卷切题</span>
    <div class="container">
      <div class="inside-box">
        <!-- <el-alert
          class="top-warn"
          title="图片文件过大会影响识别速度"
          type="warning">
        </el-alert> -->
        <div class="crop-demo">
          <label ref="select_frame"  class="crop-topimg" :style="{backgroundImage:'url(' + cropImg + ')', backgroundSize:'contain'}">
            <img v-show="cropImg" preview :src="cropImg" class="up_img" >
            <div v-if="!cropImg" class="up_inside">
              <nx-svg-icon class-name='icon-camera' icon-class="cutup" />
              <p>请选择图像上传方式，或将图像拖到此处</p>
            </div>
            <!-- <div class="tuoUp"></div> -->
            <img v-if="showGIF" class="loading-gif" src="@/assets/images/home/loading2.gif" alt="Loading">
          </label>
          <div class="upbtn-group">
            <el-button type="primary" @click="cameraTakePicture">拍照上传</el-button>
            <div class="crop-demo-btn">上传图片
              <input class="crop-input" ref="referenceUpload" id='upimg' type="file" name="image" accept="image/*" multiple @change="toChoose" />
            </div>
          </div>
        </div>
        <div>
          <el-card shadow="hover" class="cut_item" v-for="(item,index) in 3" :key="index" >
            <b>{{index+1}}.</b>
            <img :src="'./static/img/mock/testQuestion.png'" alt="没找到" :title="'第'+index+'题'">
            <div class="cut_item_content">2.甲、乙两物体均做直线运动,甲物体速度随时间变化的图象如图甲所示,乙物体位置随
              时间变化的图象如图乙所示,则这两个物体的运动情况是。
              <p>A.甲在04s内运动方向改变,通过的路程为12m</p>
              <p>B.甲在04s内运动方向不变,通过的位移大小为6m</p>
              <p>C.乙在0-4s内运动方向改变,通过的路程为12m</p>
              <p>D.乙在04s内运动方向不变,通过的位移大小为6m</p></div>
          </el-card>
        </div>
      </div>
    </div>
    <el-dialog class="crop-pic" title="裁剪图片" :visible.sync="dialogVisible" :before-close="cancelCrop" width="80%">
      <vue-cropper class="dgCropper" ref='cropper' :auto-crop-area="0.98" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;  height: 400px;"></vue-cropper>
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
    <!-- Form -->
    <el-dialog title="错题备注" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="Form">
        <!-- <el-form-item label="关键字">
          <el-input v-model="form.Keywords"></el-input>
        </el-form-item> -->
        <el-form-item label="题目分类" prop="CategoryId">
          <el-select v-model="form.CategoryId" placeholder="请选择题目分类">
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
        <el-button type="primary" @click="">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import VoiceInputButton from 'voice-input-button'
import nxSvgIcon from '@/components/nx-svg-icon/index'
import quexBox from '@/components/my-box/quex-box'
import VueCropper from 'vue-cropperjs'
import axios from 'axios'
import qs from 'qs'
// import { slider, slideritem } from 'vue-concise-slider'

// import {
//   questionCategory
// } from '@/api/toget'

import {
  mistakeCate
} from '@/api/toPost'

export default {
  name: 'carveup',
  components: {
    VueCropper,
    quexBox,
    nxSvgIcon,
    VoiceInputButton
    // slider,
    // slideritem
  },
  data: function() {
    return {
      showGIF: false,
      // showShou: true,
      showBtn: false,
      lines: '',
      result: '',
      isHand: false,
      cropImg: '',
      imgSrc: '',
      dialogVisible: false,
      dialogFormVisible: false,
      showAdd: false,
      questions: [],
      typelist: [],
      form: {
        Content: '',
        Text: '',
        Analysis: '',
        Keywords: '',
        CategoryId: ''
      },
      rules: {
        CategoryId: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ]
      }
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
      // this.torun()
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
      var url = 'https://mccyu.com:444/ocr'
      if (this.isHand === true) {
        url = 'https://mccyu.com:444/shouxie'
      }
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
          this.form.Content = this.form.Content + item.words + '<br />'
          this.form.Text = this.form.Text + item.words
        })
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
    // 获取题目分类
    GetCategory() {
      // 未登录 不请求
      if (!this.$store.getters.user.Id) {
        return
      }
      mistakeCate(qs.stringify({ UserId: this.$store.getters.user.Id })).then(res => {
        this.typelist = res.data.data
      }).catch(() => {
        console.log('获取题目分类数据失败！')
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
  },
  created() {
    this.GetCategory()
  },
  activated() {
    this.GetCategory()
  }
}
</script>

<style scoped lang="scss">
    @import '../../styles/ocr.scss';
.up_inside
{
  top: calc(50% - 61px);
  .icon-camera{
    margin-bottom: 0;
    font-size: 80px;
    fill: #52bab5;
  }
}
.slider-ques{
  font-size: unset;
  text-align: left;
  color: unset;
}
.container{
  border: 0;
}
.sq-body{
  position: relative;
  margin-top: 10px;
  .sq-change{
    position: absolute;
    right: 0;
    top: 0;
  }
}
.crop-topimg {
    padding-bottom: 40%;
}
@media (max-width: 768px) {
  .crop-topimg {
      padding-bottom: 50%;
  }
}
.up_img{
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0;
}
.cut_item{
  margin-top: 20px;
  .cut_item_content{
    background: #eef1f6;
    padding: 15px 16px;
    line-height: 28px;
    font-size: 15px;
    margin-bottom: 5px;
  }
}
</style>
