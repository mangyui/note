<template>
  <div class="app-container">
    <span class="header-title">添加错题</span>
    <div class="container big-box1200">

        <pictureOcr v-show="isOcr" ocrIcon="add" @Oresult="Getresult"></pictureOcr>
        <el-button class="de-more" type="danger" size="small" @click="isOcr=!isOcr">{{isOcr?"关闭":"开启"}}文字识别</el-button>
        <div class="sq-body">
          <div class="ocr-edit">
            <h4 class="htitle">错题题目(不含答案)</h4>
            <div ref="ShouTitle" class="divWangeditor" style="text-align:left"></div>
            <div class="voice-button">
              <div class="voice-input-button-wrapper">
                <voiceBtn @record="showResult1"></voiceBtn>
              </div>
            </div>
            <h4 class="htitle">错题解答(可选)</h4>
            <div ref="ShouCorrect" class="divWangeditor" style="text-align:left"></div>
            <div class="voice-button">
              <div class="voice-input-button-wrapper">
                <voiceBtn @record="showResult2"></voiceBtn>
              </div>
            </div>
            <el-button size="large" class="mobile_bbtn" type="primary" @click="dialogFormVisible = true">提交</el-button>
          </div>
        </div>
    </div>
    <!-- Form -->
    <el-dialog title="错题备注" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="Form">
        <el-form-item label="题目分类" prop="CategoryId" label-width="100px">
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

// wangeditor 富文本
var ShouTitle, ShouCorrect

import quexBox from '@/components/my-box/quex-box'
import voiceBtn from '@/components/voice/index'
import pictureOcr from '@/components/picture-ocr/index'
import addType from '@/views/common/addType'
import {
  Imgurl,
  addMistake,
  mistakeCate
} from '@/api/toPost'

export default {
  name: 'addMistake',
  components: {
    quexBox,
    voiceBtn,
    pictureOcr,
    addType
  },
  data: function() {
    return {
      isOcr: true,
      showBtn: false,
      lines: '',
      result: '',
      isHand: false,
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
    addBack() {
      this.GetCategory()
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
    },
    showResult2(text) {
      if (this.form.Analysis === '') {
        ShouCorrect.txt.html('<span>' + text.substr(0, text.length - 1) + '</span>')
      } else {
        ShouCorrect.txt.append('<span>' + text.substr(0, text.length - 1) + '</span>')
      }
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
