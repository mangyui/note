<template>
  <div class="app-container">
    <span class="header-title">拍照搜题</span>
    <div class="container big-box1200">
        <pictureOcr ocrIcon="form_search" ocrMode="acc" @Oresult="Getresult"></pictureOcr>
        <div v-show="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div class="sq-body">
          <el-button class="sq-change" size="small" v-if="showBtn" @click="showShou=(showShou==false?true:false)">{{showShou==false?"没有找到":"返回搜题"}}</el-button>
          <div v-show="!showShou && questions[0]"  class="ques-list">
            <h3 class="Hpipei">猜你要找:</h3>
            <slider v-if="" ref="slider" :options="sliderOptions" @slide='slide' @tap='onTap' @init='onInit'>
              <slideritem class="slider-ques" v-for="(item,index) in questions" :key="index" :style="item.style">
                <div class="myslide-box">
                <div class="ques-list_item">
                  <div class="ques_box">
                    <router-link :to="'/home/question_details/'+item.Id">
                      <div class="ques_body tipbox heightAuto">
                        <div class="ocr-content" v-html="item.Content"> </div><b>{{index+1}}.</b>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>
              </slideritem>
              <div slot="loading">loading...</div>
            </slider>
            <h4 class="htitle">添加解答</h4>
            <div ref="HaveCorrect" class="divWangeditor" style="text-align:left"></div>
            <br/>
            <el-button class="mobile_bbtn" type="primary" @click="dialogFormVisible = true">添加到错题本</el-button>
          </div>
          <div v-show="showShou" class="ocr-edit">
            <h3 class="Hpipei">手动添加</h3>
            <h4 class="htitle">错题题目(不含答案)</h4>
            <div ref="ShouTitle" class="divWangeditor" style="text-align:left"></div>
            <!-- <quill-editor ref="titleEditor" v-model="form.Content" :options="editorOption" ></quill-editor> -->
            <br/>
            <h4 class="htitle">错题解答(可选)</h4>
            <div ref="ShouCorrect" class="divWangeditor" style="text-align:left"></div>
            <!-- <quill-editor ref="AnalysisEditor" v-model="form.Analysis" :options="editorOption" ></quill-editor> -->
            <br/>
            <el-button class="mobile_bbtn" type="primary" @click="dialogFormVisible = true">添加到错题本</el-button>
          </div>
        </div>
    </div>
    <!-- Form -->
    <el-dialog title="错题备注" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="Form">
        <el-form-item label="题目分类" prop="CategoryId">
          <el-select v-model="form.CategoryId" placeholder="请选择题目分类">
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

    <addType ref="addType" MistakeOrNote="Mistake" @addBack="addBack"></addType>
  </div>
</template>

<script>

// 编辑器
var ShouTitle, ShouCorrect, HaveCorrect

import { slider, slideritem } from 'vue-concise-slider'
import pictureOcr from '@/components/picture-ocr/index'
import addType from '@/views/common/addType'

import {
  Imgurl,
  addMistake,
  ocrQues,
  mistakeCate
} from '@/api/toPost'

export default {
  name: 'mocr',
  components: {
    slider,
    slideritem,
    pictureOcr,
    addType
  },
  data: function() {
    return {
      showLoading: false,
      showShou: false,
      showBtn: false,
      lines: '',
      result: '',
      isHand: false,
      sliderOptions: {
        currentPage: 0,
        thresholdDistance: '50',
        thresholdTime: '500'
      },
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
        Correct: '',
        Analysis: '',
        currentPage: ''
      }
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   // 这里的vm指的就是vue实例，可以用来当做this使用
  //   next(vm => {
  //     if (from.path === '/home/index') {
  //       vm.cameraTakePicture()
  //     }
  //   })
  // },
  methods: {
    Getresult(value) {
      this.lines = value.lines
      this.result = value.result
      this.formatText()
    },
    formatText() {
      if (this.lines > 0) {
        // 清空
        this.showLoading = true
        this.form.Content = ''
        this.form.Text = ''
        ShouTitle.txt.html('')
        // 重加
        this.result.forEach(item => {
          this.form.Content = this.form.Content + item.words + '<br />'
          this.form.Text = this.form.Text + item.words
        })
        ShouTitle.txt.html(this.form.Content)
        // 这里获取相关题目
        this.getQues()
      } else {
        this.$notify({
          title: '提示',
          message: '没有提取任何文字信息，请检查图片再操作！',
          type: 'info'
        })
        this.showLoading = false
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
      if (this.form.Content.trim().length === 0) {
        this.$notify({
          title: '提示',
          message: '题目不能为空！',
          type: 'warning'
        })
        return
      }
      this.$refs.Form.validate(valid => {
        if (valid) {
          let datas
          if (this.showShou) {
            // this.form.Text = this.$refs.titleEditor.quill.getText().trim()
            datas = {
              'UserId': this.$store.getters.user.Id,
              'QuestionContent': this.form.Content,
              'MistakeCateId': this.form.CategoryId,
              'Correct': this.form.Analysis
            }
          } else {
            datas = {
              'UserId': this.$store.getters.user.Id,
              'QuestionId': this.questions[this.haveF.currentPage].Id,
              'MistakeCateId': this.form.CategoryId,
              'Correct': this.haveF.Correct
            }
          }
          addMistake(this.$qs.stringify(datas)).then(res => {
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
      ocrQues(this.$qs.stringify({ Text: this.form.Text })).then(res => {
        this.questions = res.data.data
        this.showShou = false
        this.showBtn = true
        this.showLoading = false
        this.$notify({
          title: '提示',
          message: '已搜索相关题目！',
          type: 'success'
        })
      }).catch(() => {
        this.showLoading = false
        this.$notify({
          title: '提示',
          message: '请求错误！',
          type: 'error'
        })
      })
    },
    addBack() {
      this.GetCategory()
    },
    GetCategory() {
      // 未登录 不请求
      if (!this.$store.getters.user.Id) {
        return
      }
      mistakeCate(this.$qs.stringify({ UserId: this.$store.getters.user.Id })).then(res => {
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
    // 富文本配置
    var That = this
    ShouTitle = new this.$E(this.$refs.ShouTitle)
    ShouCorrect = new this.$E(this.$refs.ShouCorrect)
    HaveCorrect = new this.$E(this.$refs.HaveCorrect)
    ShouTitle.customConfig = {
      onchange: function(html) {
        That.form.Content = html
      },
      uploadImgServer: Imgurl + '?service=App.Upload.Upload', // 上传图片到服务器
      uploadFileName: 'file', // 后端使用这个字段获取图片信息
      uploadImgMaxLength: 1, // 限制一次最多上传 1 张图片
      uploadImgHooks: {
        customInsert: function(insertImg, result, ShouTitle) {
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
      uploadImgHooks: {
        customInsert: function(insertImg, result, editor) {
          var url = result.data.data.data
          // console.log(result.data.data.data)
          insertImg(url)
        }
      }
    }
    HaveCorrect.customConfig = {
      onchange: function(html) {
        That.haveF.Correct = html
      },
      uploadImgServer: Imgurl + '?service=App.Upload.Upload', // 上传图片到服务器
      uploadFileName: 'file', // 后端使用这个字段获取图片信息
      uploadImgMaxLength: 1, // 限制一次最多上传 1 张图片
      uploadImgHooks: {
        customInsert: function(insertImg, result, editor) {
          var url = result.data.data.data
          // console.log(result.data.data.data)
          insertImg(url)
        }
      }
    }
    HaveCorrect.create()
    ShouTitle.create()
    ShouCorrect.create()
  },
  created() {
    this.GetCategory()
  }
}
</script>

<style scoped lang="scss">
.top-warn{
  margin-bottom: 10px;
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
.ques-list{
  margin-bottom: 0
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
    right: 0px;
    top: 0;
  }
}
.heightAuto{
  height: 400px!important;
}

.ocr-content{
  white-space:initial!important;
}
</style>
