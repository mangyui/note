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
          <el-card shadow="hover" class="cut_item" v-for="(item,index) in 4" :key="index" >
            <b>{{index+1}}.</b>
            <br/>
            <el-button class="cut_item-detele" type="text" icon="el-icon-close" size="large" @click="Detele(index)"></el-button>
            <img preview='1' :src="Quesimgs[index]" alt="没找到" :title="'第'+ (index+1) +'题'">
            <div class="cut_item_content">2.甲、乙两物体均做直线运动,甲物体速度随时间变化的图象如图甲所示,乙物体位置随
              时间变化的图象如图乙所示,则这两个物体的运动情况是。
              <p>A.甲在04s内运动方向改变,通过的路程为12m</p>
              <p>B.甲在04s内运动方向不变,通过的位移大小为6m</p>
              <p>C.乙在0-4s内运动方向改变,通过的路程为12m</p>
              <p>D.乙在04s内运动方向不变,通过的位移大小为6m</p></div>
              <div style="text-align: right;">
                <!-- <el-button type="primary" icon="el-icon-plus" size="small" @click="">加入测试集</el-button> -->
                <el-button type="primary" icon="el-icon-edit" size="small" @click="adddialog=true">修改</el-button>
              </div>
          </el-card>
        </div>
        <div class="cut-footer">
          <el-button size="medium" @click="adddialog=!adddialog">添加题目</el-button>
          <el-button type="danger" size="medium" @click="">生成测试</el-button>
        </div>
        <!-- <div class="ocr-edit" v-show="adddialog">
          <h4>题目(不含答案)</h4>
          <div ref="ShouTitle" class="divWangeditor" style="text-align:left"></div>
          <h4>解答(可选)</h4>
          <div ref="ShouCorrect" class="divWangeditor" style="text-align:left"></div>
          <br/>
          <el-button class="editor-btn pull-right" type="primary" @click="dialogFormVisible = true">提交</el-button>
        </div> -->
      </div>
    </div>
    <el-dialog class="crop-pic" title="裁剪图片" :visible.sync="dialogVisible" :before-close="cancelCrop" width="75%">
      <vue-cropper class="dgCropper" ref='cropper' :auto-crop-area="0.98" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" :style="'width:100%;  height: '+ 0.7*documentWidth + 'px'"></vue-cropper>
      <el-alert
        title="请旋转正常角度"
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
    <el-dialog title="题目备注" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="Form">
        <el-form-item label="关键字(以逗号分隔)">
          <el-input v-model="form.Keywords"></el-input>
        </el-form-item>
        <el-form-item label="题目分类" prop="CategoryId">
          <el-select v-model="form.CategoryId" placeholder="请选择题目分类">
            <el-option
              v-for="item in Categorylist"
              :key="item.Id"
              :label="item.Subject"
              :value="item.Id">
              <span style="float: left">{{ item.Subject }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Class }}</span>
            </el-option>
          </el-select>
          <!-- <el-button type="primary" icon="el-icon-plus" @click="showAdd=!showAdd" circle></el-button> -->
        </el-form-item>
        <el-form-item label="* 题目类型">
          <el-select v-model="form.Type" placeholder="请选择题目分类">
            <el-option
              v-for="item in typelist"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!-- <el-button type="primary" icon="el-icon-plus" @click="showAdd=!showAdd" circle></el-button> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加题目" :visible.sync="adddialog" @opened="openAdd" width="80%">
      <div class="ocr-edit">
        <h4 style="margin-top:0">题目(不含答案)</h4>
        <div ref="ShouTitle" class="divWangeditor" style="text-align:left"></div>
        <h4>解答(可选)</h4>
        <div ref="ShouCorrect" class="divWangeditor" style="text-align:left"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="adddialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="dialogFormVisible = true">添 加</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import E from 'wangeditor'
var ShouTitle, ShouCorrect

import VoiceInputButton from 'voice-input-button'
import nxSvgIcon from '@/components/nx-svg-icon/index'
import quexBox from '@/components/my-box/quex-box'
import VueCropper from 'vue-cropperjs'
import qs from 'qs'
// import { slider, slideritem } from 'vue-concise-slider'

import {
  questionCategory
} from '@/api/toget'

import {
  Imgurl,
  upQuestion
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
      documentWidth: document.body.clientHeight,
      openNum: false,
      showGIF: false,
      // showShou: true,
      showBtn: false,
      lines: '',
      result: '',
      isHand: false,
      cropImg: './static/img/mock/test.png',
      imgSrc: '',
      dialogVisible: false,
      adddialog: false,
      dialogFormVisible: false,
      showAdd: false,
      questions: [],
      Categorylist: [],
      form: {
        Content: '',
        Text: '',
        Analysis: '',
        Keywords: '',
        CategoryId: '',
        Type: ''
      },
      rules: {
        CategoryId: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ]
      },
      typelist: [{
        value: '选择题',
        label: '选择题'
      }, {
        value: '填空题',
        label: '填空题'
      }, {
        value: '判断题',
        label: '判断题'
      }, {
        value: '作图题',
        label: '作图题'
      }, {
        value: '实验题',
        label: '实验题'
      }, {
        value: '综合题',
        label: '综合题'
      }, {
        value: '计算题',
        label: '计算题'
      }, {
        value: '完形填空',
        label: '完形填空'
      }, {
        value: '阅读题',
        label: '阅读题'
      }, {
        value: '作文题',
        label: '作文题'
      }, {
        value: '',
        label: '自己看什么题'
      }],
      resultImg: './static/img/mock/test.png',
      Locations: [{
        location: {
          width: 182,
          top: 46,
          left: 40,
          height: 47
        }
      }, {
        location: {
          width: 1714,
          top: 157,
          left: 42,
          height: 38
        }
      }, {
        location: {
          width: 1719,
          top: 200,
          left: 42,
          height: 35
        }
      }, {
        location: {
          width: 581,
          top: 241,
          left: 41,
          height: 38
        }
      }],
      Quesimgs: []
    }
  },
  methods: {
    toCutup() {
      // this.Quesimgs = new Array(this.Locations.length)

      for (var i = 0; i < this.Locations.length; i++) {
        var imgs = new Image('./static/img/mock/test.png')
        imgs.setAttribute('src', './static/img/mock/test.png')
        imgs.setAttribute('index', i)
        var That = this
        imgs.onload = function() {
          var j = this.getAttribute('index')
          var w = That.Locations[j].location.width
          var h = That.Locations[j].location.height
          var sx = That.Locations[j].location.left
          var sy = That.Locations[j].location.top
          var canvas = document.createElement('CANVAS')
          canvas.width = w
          canvas.height = h
          var context = canvas.getContext('2d')
          context.drawImage(this, sx, sy, w, h, 0, 0, w, h)
          // $('body').append(canvas)
          That.Quesimgs[parseInt(j)] = canvas.toDataURL('image/png')
        }
      }
    },
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
    Detele(index) {
      this.$confirm('确定删除该题？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      }).catch(() => {})
    },
    submit() {
      this.$refs.Form.validate(valid => {
        if (valid) {
          // this.form.Text = this.$refs.titleEditor.quill.getText().trim()
          var datas = {
            'Content': this.form.Content,
            'Text': ShouTitle.txt.text(),
            'CategoryId': this.form.CategoryId,
            'Analysis': this.form.Analysis,
            'KeyWords': this.form.Keywords,
            'Type': this.form.Type
          }
          upQuestion(qs.stringify(datas)).then(res => {
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '添加成功！',
              type: 'success'
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
      // if (!this.$store.getters.user.Id) {
      //   return
      // }
      questionCategory(qs.stringify()).then(res => {
        this.Categorylist = res.data.data
      }).catch(() => {
        console.log('获取题目分类数据失败！')
      })
    },
    openAdd() {
      if (this.openNum) {
        return
      }
      this.openNum = true
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
      ShouTitle.create()
      ShouCorrect.create()
    }
  },
  mounted() {
    // this.openAdd()

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
    this.toCutup()
  },
  activated() {
  }
}
</script>

<style scoped lang="scss">
    @import '../../styles/ocr.scss';

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
.cut_item{
  margin-top: 20px;
  .cut_item_content{
    background: #eef1f6;
    padding: 15px 16px;
    line-height: 28px;
    font-size: 15px;
    margin-bottom: 5px;
  }
  .cut_item-detele{
    position: absolute;
    right: 5px;
    top: 5px;
    color: #F56C6C;
    font-size: 19px;
    font-weight: bold;
    padding: 0;
  }
}
.cut-footer{
  text-align: center;
  margin: 20px 0;
}
</style>
