<template>
  <div class="">
    <span class="header-title">拍照搜题</span>
    <div class="container">
      <div class="inside-box">
        <!-- <el-alert
          class="top-warn"
          title="图片文件过大会影响识别速度"
          type="warning">
        </el-alert> -->
        <div class="crop-demo">
          <label ref="select_frame"  class="crop-topimg" @click="cameraTakePicture" :style="{backgroundImage:'url(' + cropImg + ')', backgroundSize:'contain'}">
            <!-- <img v-if="cropImg" :src="cropImg" class="pre-img"> -->
            <div v-if="!cropImg" class="up_inside">
              <nx-svg-icon class-name='icon-camera' icon-class="camera3" />
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
        <div class="sq-body">
          <el-button class="sq-change" type="danger" size="medium" v-if="showBtn" @click="showShou=(showShou==false?true:false)">{{showShou==false?"手动添加":"返回搜题"}}</el-button>
          <div v-if="!showShou && questions[0]"  class="ques-list">
            <h3 class="Hpipei">猜你要找:</h3>
            <slider v-if="" ref="slider" :options="sliderOptions" @slide='slide' @tap='onTap' @init='onInit'>
              <slideritem class="slider-ques" v-for="(item,index) in questions" :key="index" :style="item.style">
                <div class="myslide-box">
                <div class="ques-list_item">
                  <div class="ques_box">
                    <router-link to="/home/question_details/1">
                      <div class="ques_body tipbox heightAuto">
                        <div class="ocr-content" v-html="item.Content"> </div><b>{{index+1}}.</b>
                      </div>
                    </router-link>
                  </div>
                </div>
                <h4>添加解答</h4>
                <quill-editor ref="AnalysisEditor" v-model="haveF.Analysis[index].text" :options="editorOption" ></quill-editor>
                <el-button class="editor-btn pull-right" type="primary" @click="dialogFormVisible = true">提交</el-button>
              </div>
              </slideritem>
              <div slot="loading">loading...</div>
            </slider>

          </div>
          <!-- <div class="run_btn">
            <img v-if="showGIF" class="loading-gif" src="@/assets/images/home/loading2.gif" alt="Loading">
            <el-checkbox v-model="isHand" label="含手写" border></el-checkbox>
            <el-button class="editor-btn" type="danger" @click="torun">提取文字</el-button>
          </div> -->
          <div v-if="showShou" class="ocr-edit">
            <h3 class="Hpipei">手动添加</h3>
            <h4>错题题目(不含答案)</h4>
            <quill-editor ref="titleEditor" v-model="form.Content" :options="editorOption" ></quill-editor>
            <h4>错题解答(可选)</h4>
            <quill-editor ref="AnalysisEditor" v-model="form.Analysis" :options="editorOption" ></quill-editor>
            <el-button class="editor-btn pull-right" type="primary" @click="dialogFormVisible = true">提交</el-button>
          </div>
        </div>
      </div>
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
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import nxSvgIcon from '@/components/nx-svg-icon/index'
import quexBox from '@/components/my-box/quex-box'
import { quillEditor } from 'vue-quill-editor'
import VueCropper from 'vue-cropperjs'
import axios from 'axios'
import qs from 'qs'
import { slider, slideritem } from 'vue-concise-slider'

// import {
//   questionCategory
// } from '@/api/toget'

import {
  // upQuestion,
  addMistake,
  ocrQues,
  mistakeCate
} from '@/api/toPost'

export default {
  name: 'mocr',
  components: {
    VueCropper,
    quillEditor,
    quexBox,
    nxSvgIcon,
    slider,
    slideritem
  },
  data: function() {
    return {
      showGIF: false,
      showShou: false,
      showBtn: false,
      lines: '',
      result: '',
      isHand: false,
      editorOption: {
        placeholder: '等待提取中...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['code-block', 'link', 'image']
          ]
        }
      },
      sliderOptions: {
        currentPage: 0,
        thresholdDistance: '50',
        thresholdTime: '500'
      },
      cropImg: '',
      imgSrc: '',
      dialogVisible: false,
      dialogFormVisible: false,
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
      },
      haveF: {
        Analysis: [
          {
            text: ''
          },
          {
            text: ''
          },
          {
            text: ''
          },
          {
            text: ''
          }
        ],
        currentPage: ''
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // 这里的vm指的就是vue实例，可以用来当做this使用
    next(vm => {
      if (from.path === '/home/index') {
        vm.cameraTakePicture()
      }
    })
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
      this.$refs.cropper.rotate(10)
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
        // 这里获取相关题目
        this.getQues()
      } else {
        this.$notify({
          title: '提示',
          message: '没有提取任何文字信息，请检查图片再操作！',
          type: 'info'
        })
        this.showGIF = false
      }
    },
    submit() {
      if (!this.$store.getters.user.Id) {
        this.$confirm('你还没有登录，不能进行该操作！前往登录', '提示', {
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
      this.$refs.Form.validate(valid => {
        if (valid) {
          let datas
          if (this.showShou) {
            // this.form.Text = this.$refs.titleEditor.quill.getText().trim()
            datas = {
              'UserId': 1,
              'QuestionContent': this.form.Content,
              'MistakeCateId': this.form.CategoryId,
              'Correct': this.form.Analysis
            }
          } else {
            datas = {
              'UserId': 1,
              'QuestionId': this.questions[this.haveF.currentPage].Id,
              'MistakeCateId': this.form.CategoryId,
              'Correct': this.haveF.Analysis[this.haveF.currentPage].text
            }
          }
          addMistake(qs.stringify(datas)).then(res => {
            this.dialogFormVisible = false
            this.$message.success('提交成功！')
            this.$router.push({
              path: '/toques/quesList/'
            })
          }).catch((msg) => {
            this.$message.warning('响应错误！')
          })
        }
      })
    },
    getQues() {
      ocrQues(qs.stringify({ Text: this.form.Text })).then(res => {
        this.questions = res.data.data
        this.showShou = false
        this.showBtn = true
        this.showGIF = false
        this.$notify({
          title: '提示',
          message: '已搜索相关题目！',
          type: 'success'
        })
      }).catch(() => {
        this.showGIF = false
        this.$notify({
          title: '提示',
          message: '请求错误！',
          type: 'error'
        })
      })
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
    },
    // 滑动组件监听事件
    slide(data) {
      this.haveF.currentPage = data.currentPage
    },
    onTap(data) {
    },
    onInit(data) {
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
  }
}
</script>

<style scoped lang="scss">
    @import '../../styles/ocr.scss';
.top-warn{
  margin-bottom: 10px;
}
.up_inside
{
  top: calc(50% - 61px);
  .icon-camera{
    margin-bottom: 0;
    font-size: 122px;
    border: 6px solid #edf8f7;
    border-radius: 50%;
    fill: #52bab5;
    padding: 11px;
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
.ocr-edit{
  margin-top: 20px;
}
.el-dialog{
  margin-top: 7vh!important;
}
.ques_body{
  line-height: 28px;
  b{
    white-space: initial;
  }
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
.heightAuto{
  max-height: initial;
}
@media (max-width: 768px) {

  .crop-topimg[data-v-29742ae3] {
      padding-bottom: 60%;
  }
}
.ocr-content{
  white-space:initial!important;
}
</style>
