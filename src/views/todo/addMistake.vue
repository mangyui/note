<template>
  <div class="">
    <span class="header-title">添加错题</span>
    <div class="container">
      <div class="inside-box">

        <pictureOcr v-show="isOcr" ocrIcon="add" @Oresult="Getresult"></pictureOcr>
        <el-button class="de-more" type="danger" size="small" @click="isOcr=!isOcr">{{isOcr?"关闭":"开启"}}文字识别</el-button>
        <div class="sq-body">
          <!-- <el-button class="sq-change" type="danger" size="medium" v-if="showBtn" @click="showShou=(showShou==false?true:false)">{{showShou==false?"手动添加":"返回相似"}}</el-button> -->
          <!-- <el-card shadow="never" v-loading="showGIF">
            <div class="run_btn">
              <el-checkbox v-model="isHand" label="含手写" border></el-checkbox>
              <el-button class="editor-btn" type="danger" @click="torun">提取文字</el-button>
            </div>
          </el-card> -->
          <div class="ocr-edit">
            <!-- <h3 class="Hpipei">手动添加</h3> -->
            <h4 class="htitle">错题题目(不含答案)</h4>
            <div ref="ShouTitle" class="divWangeditor" style="text-align:left"></div>
            <!-- <quill-editor ref="titleEditor" v-model="form.Content" :options="editorOption" ></quill-editor> -->
            <!-- <br/> -->
            <div class="voice-button">
              <div class="voice-input-button-wrapper">
                <voiceBtn @record="showResult1"></voiceBtn>
              </div>
            </div>
            <h4 class="htitle">错题解答(可选)</h4>
            <div ref="ShouCorrect" class="divWangeditor" style="text-align:left"></div>
            <!-- <quill-editor ref="AnalysisEditor" v-model="form.Analysis" :options="editorOption" ></quill-editor> -->
            <!-- <br/> -->
            <div class="voice-button">
              <div class="voice-input-button-wrapper">
                <voiceBtn @record="showResult2"></voiceBtn>
              </div>
            </div>
            <el-button class="mobile_bbtn" type="primary" @click="dialogFormVisible = true">提交</el-button>
          </div>
        </div>
      </div>
    </div>
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
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submit">确 定</el-button>
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
        <el-button size="small" @click="showAdd = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addMistakeType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

// wangeditor 富文本
var ShouTitle, ShouCorrect

import nxSvgIcon from '@/components/nx-svg-icon/index'
import quexBox from '@/components/my-box/quex-box'

// import {
//   questionCategory
// } from '@/api/toget'
import voiceBtn from '@/components/voice/index'
import pictureOcr from '@/components/picture-ocr/index'

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
    quexBox,
    nxSvgIcon,
    voiceBtn,
    pictureOcr
    // slider,
    // slideritem
  },
  data: function() {
    return {
      isOcr: true,
      showBtn: false,
      lines: '',
      result: '',
      isHand: false,
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
  methods: {
    Getresult(value) {
      this.lines = value.lines
      this.result = value.result
      this.formatText()
    },
    formatText() {
      if (this.lines > 0) {
        this.result.forEach(item => {
          if (this.form.Content === '') {
            ShouTitle.txt.html('<span>' + item.words + '</span>')
          } else {
            ShouTitle.txt.append('<span>' + item.words + '</span>')
          }
          this.form.Content = this.form.Content + item.words + '<br />'
          this.form.Text = this.form.Text + item.words
        })
        // ShouTitle.txt.append('<p>' + this.form.Content + '</p>')
        // ShouTitle.txt.html(this.form.Content)
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
          AddMistakeCate(this.$qs.stringify(this.toadd)).then(res => {
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
    // 获取题目分类
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
    showResult1(text) {
      if (this.form.Content === '') {
        ShouTitle.txt.html('<span>' + text.substr(0, text.length - 1) + '</span>')
      } else {
        ShouTitle.txt.append('<span>' + text.substr(0, text.length - 1) + '</span>')
      }
      // ShouTitle.txt.append('<span>' + text.substr(0, text.length - 1) + '</span>')
    },
    showResult2(text) {
      if (this.form.Analysis === '') {
        ShouCorrect.txt.html('<span>' + text.substr(0, text.length - 1) + '</span>')
      } else {
        ShouCorrect.txt.append('<span>' + text.substr(0, text.length - 1) + '</span>')
      }
      // ShouCorrect.txt.append('<span>' + text.substr(0, text.length - 1) + '</span>')
      // console.log(text.substr(0, text.length - 1))
    }
  },
  mounted() {
    // 富文本配置
    var That = this
    ShouTitle = new this.$E(this.$refs.ShouTitle)
    ShouCorrect = new this.$E(this.$refs.ShouCorrect)
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
  margin-top: 10px;
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
  .crop-topimg {
      padding-bottom: 60%;
  }
}
.ocr-content{
  white-space:initial!important;
}
</style>
