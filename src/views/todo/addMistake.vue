<template>
  <div class="">
    <span class="header-title">添加错题</span>
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
          <el-button class="sq-change" type="danger" size="medium" v-if="showBtn" @click="showShou=(showShou==false?true:false)">{{showShou==false?"手动添加":"返回相似"}}</el-button>
          <div class="run_btn">
            <img v-if="showGIF" class="loading-gif" src="@/assets/images/home/loading2.gif" alt="Loading">
            <el-checkbox v-model="isHand" label="含手写" border></el-checkbox>
            <el-button class="editor-btn" type="danger" @click="torun">提取文字</el-button>
          </div>
          <div class="ocr-edit">
            <h3 class="Hpipei">手动添加</h3>
            <h4>错题题目(不含答案)</h4>
            <div ref="ShouTitle" class="divWangeditor" style="text-align:left"></div>
            <!-- <quill-editor ref="titleEditor" v-model="form.Content" :options="editorOption" ></quill-editor> -->
            <br/>
            <div class="voice-button">
              <div class="voice-input-button-wrapper">
                <voice-input-button
                    server="https://www.mccyu.com:444/"
                    appId="5c52f87b"
                    APIKey="3d0fba416f2a2423e7380ea2ab397d9e"
                    @record="showResult1"
                    color="#fff"
                    tipPosition="top"
                >
                  <template slot="no-speak">没听清您说的什么</template>
                </voice-input-button>
              </div>
            </div>
            <h4>错题解答(可选)</h4>
            <div ref="ShouCorrect" class="divWangeditor" style="text-align:left"></div>
            <!-- <quill-editor ref="AnalysisEditor" v-model="form.Analysis" :options="editorOption" ></quill-editor> -->
            <br/>
            <div class="voice-button">
              <div class="voice-input-button-wrapper">
                <voice-input-button
                    server="https://www.mccyu.com:444/"
                    appId="5c52f87b"
                    APIKey="3d0fba416f2a2423e7380ea2ab397d9e"
                    @record="showResult2"
                    color="#fff"
                    tipPosition="top"
                >
                  <template slot="no-speak">没听清您说的什么</template>
                </voice-input-button>
              </div>
            </div>
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
          <el-button type="primary" icon="el-icon-plus" @click="showAdd=!showAdd" circle></el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加错题分类" :visible.sync="showAdd">
      <el-form :model="toadd" :rules="addrules" ref="addForm" label-width="100px">
        <el-form-item label="错题分类名" prop="Name">
          <el-input v-model="toadd.Name"></el-input>
        </el-form-item>
        <el-form-item label="分类说明" prop="Intro">
          <el-input type="textarea" v-model="toadd.Intro"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addMistakeType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

// wangeditor 富文本
import E from 'wangeditor'
var ShouTitle, ShouCorrect

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
  Imgurl,
  addMistake,
  // ocrQues,
  mistakeCate,
  AddMistakeCate
} from '@/api/toPost'

export default {
  name: 'addMistake',
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
      // this.torun()
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
        ShouTitle.txt.html(this.form.Content)
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
    addMistakeType() {
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
          AddMistakeCate(qs.stringify(this.toadd)).then(res => {
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
            this.GetCategory()
          }).catch(() => {})
        }
      })
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
          // this.form.Text = this.$refs.titleEditor.quill.getText().trim()
          var datas = {
            'UserId': this.$store.getters.user.Id,
            'QuestionContent': this.form.Content,
            'MistakeCateId': this.form.CategoryId,
            'Correct': this.form.Analysis
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
    showResult1(text) {
      ShouTitle.txt.append('<span>' + text.substr(0, text.length - 1) + '</span>')
      // console.log(text.substr(0, text.length - 1))
    },
    showResult2(text) {
      ShouCorrect.txt.append('<span>' + text.substr(0, text.length - 1) + '</span>')
      // console.log(text.substr(0, text.length - 1))
    }
  },
  mounted() {
    // 富文本配置
    var That = this
    // var Imgurl = 'http://192.168.1.105/'
    ShouTitle = new E(this.$refs.ShouTitle)
    ShouCorrect = new E(this.$refs.ShouCorrect)
    ShouTitle.customConfig = {
      onchange: function(html) {
        That.form.Content = html
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
    ShouCorrect.customConfig = {
      onchange: function(html) {
        That.form.Analysis = html
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
    ShouTitle.customConfig.menus =
    ShouCorrect.customConfig.menus = [
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
    ShouTitle.create()
    ShouCorrect.create()

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
@media (max-width: 768px) {

  .crop-topimg[data-v-29742ae3] {
      padding-bottom: 60%;
  }
}
.ocr-content{
  white-space:initial!important;
}
</style>
