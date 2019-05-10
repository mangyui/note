<template>
  <div class="app-container">
    <span class="header-title">添加题目</span>
    <div class="container big-box1200">

        <pictureOcr v-show="isOcr" ocrIcon="add" @Oresult="Getresult"></pictureOcr>
        <el-button class="de-more" type="danger" size="small" @click="isOcr=!isOcr">{{isOcr?"关闭":"开启"}}文字识别</el-button>
        <div class="sq-body">
          <div class="ocr-edit">
            <h4 class="htitle">题目(不含答案)</h4>
            <div ref="ShouTitle" class="divWangeditor" style="text-align:left"></div>
            <div class="voice-button">
              <div class="voice-input-button-wrapper">
                <voiceBtn @record="showResult1"></voiceBtn>
              </div>
            </div>
            <h4 class="htitle">题目解答</h4>
            <div ref="ShouCorrect" class="divWangeditor" style="text-align:left"></div>
            <div class="voice-button">
              <div class="voice-input-button-wrapper">
                <voiceBtn @record="showResult2"></voiceBtn>
              </div>
            </div>
            <h4 class="htitle">视频解答(可选)</h4>
            <uploadVideo @getVideoUrl="GetVideoUrl" @changeCost="ChangeCost"></uploadVideo>
            <br/>
            <el-button size="large" class="mobile_bbtn" type="primary" @click="dialogFormVisible = true">提交</el-button>
          </div>
        </div>
    </div>
    <!-- Form -->
    <el-dialog title="题目备注" :visible.sync="dialogFormVisible" >
      <el-form :model="form" :rules="rules" ref="Form">
        <el-form-item label="题目关键字">
          <el-input v-model="form.KeyWords" placeholder="(以逗号分隔)"></el-input>
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
        <el-form-item label="题目类型" prop="Type">
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

  </div>
</template>

<script>

// wangeditor 富文本
var ShouTitle, ShouCorrect
import { QuestionImg } from '@/api/upload'
import quexBox from '@/components/my-box/quex-box'
import uploadVideo from '@/components/my-box/upload'
import voiceBtn from '@/components/voice/index'
import pictureOcr from '@/components/picture-ocr/index'
import { typeList } from '@/assets/js/question_type.js'
import {
  questionCategory
} from '@/api/toget'
import {
  upQuestion
} from '@/api/toPost'

export default {
  name: 'addQues',
  components: {
    quexBox,
    voiceBtn,
    uploadVideo,
    pictureOcr
  },
  data: function() {
    return {
      isOcr: true,
      lines: '',
      result: '',
      dialogFormVisible: false,
      typelist: typeList,
      Categorylist: [],
      form: {
        Content: '',
        Text: '',
        Analysis: '',
        KeyWords: '',
        CategoryId: '',
        Type: '',
        Repetition: 1,
        AnswerVideo: 0,
        VideoCost: 0
      },
      rules: {
        CategoryId: [
          { required: true, message: '请选择题目分类', trigger: 'change' }
        ],
        Type: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    GetVideoUrl(videoUrl) {
      this.form.AnswerVideo = videoUrl || 0
      // console.log('suucc', videoUrl)
    },
    ChangeCost(costNum) {
      this.form.VideoCost = costNum || 0
      // console.log(costNum, this.form.VideoCost)
    },
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
        this.$notify({
          title: '提示',
          message: '已提取图中文字',
          type: 'info'
        })
      } else {
        this.$notify({
          title: '提示',
          message: '没有提取任何文字信息，请检查图片再操作！',
          type: 'info'
        })
      }
    },
    submit() {
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
          var datas = this.form
          datas.Text = ShouTitle.txt.text()
          upQuestion(this.$qs.stringify(datas)).then(res => {
            this.dialogFormVisible = false
            if (res.data.code === 0) {
              this.$notify({
                title: '提示',
                message: '添加题目成功！',
                type: 'success'
              })
            }
          }).catch((msg) => {
            this.$message.warning(msg)
          })
        }
      })
    },
    // 获取题目分类
    async GetCategory() {
      questionCategory(this.$qs.stringify()).then(res => {
        this.Categorylist = res.data.data
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
      uploadImgServer: QuestionImg, // 上传图片到服务器
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
    ShouCorrect.customConfig = {
      onchange: function(html) {
        That.form.Analysis = html
      },
      uploadImgServer: QuestionImg, // 上传图片到服务器
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
.container{
  border: 0;
}
.ocr-edit{
  margin-top: 10px;
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

.ocr-content{
  white-space:initial!important;
}

</style>
