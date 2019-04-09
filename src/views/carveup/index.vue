<template>
  <div class="app-container">
    <span class="header-title">试卷切题</span>
      <div class="inside-box">
        <pictureCut cutIcon="cutup" @Cresult="Getresult" @CImage="GetImage" @Cquestion="GetQuestion"></pictureCut>
        <br/>
        <div class="list-gbtn">
          <div></div>
          <div>
            <el-button icon="el-icon-plus" size="small" @click="Add">手动添加</el-button>
            <el-button type="primary" icon="el-icon-search" @click="dialogSearch=true" size="small">搜索题库</el-button>
          </div>
        </div>
        <div class="container">
          <div>
            <div v-show="showLoading" class="loading-box">
              <i class="el-icon-loading"></i>
              加载中...
            </div>
            <div v-show="!showLoading&&!Locations[0]" class="loading-box">
              - 空空如也 -
            </div>
            <el-card shadow="hover" class="cut_item" v-for="(item,index) in Locations" :key="index">
              <b>{{index+1}}.</b>
              <br/>
              <!--触发改变-->
              <span v-show="item.left"></span>
              <el-button class="cut_item-detele" type="text" icon="el-icon-close" size="large" @click="Detele(index)"></el-button>
              <img v-show="item.Image" preview='1' :src="item.Image" alt="加载中" :title="'第'+ (index+1) +'题'">
              <el-main v-if="!item.words.Id" v-loading="true">
                <div class="cut_item_content" v-html="item.words"></div>
              </el-main>
              <div v-show="item.words.Id" class="cut_item_content" v-html="item.words.Content"></div>
              <div style="text-align: right;">
                <!-- <el-button type="primary" icon="el-icon-plus" size="small" @click="">加入测试集</el-button> -->
                <el-button v-show="item.words.Id"  class="yellow-btn" icon="el-icon-edit" size="small" @click="Edit(index)">修改</el-button>
              </div>
            </el-card>
          </div>
        </div>
        <div v-show="Locations[0]" class="cut-footer">
          <el-button type="primary" size="medium" @click="">生成测试</el-button>
        </div>
    </div>
    <!-- Form -->
    <el-dialog title="题目备注" :visible.sync="dialogFormVisible" >
      <el-form :model="form" :rules="rules" ref="Form">
        <el-form-item label="题目关键字">
          <el-input v-model="form.Keywords" placeholder="(以逗号分隔)"></el-input>
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
    <el-dialog title="编辑题目" :visible.sync="adddialog" @opened="openAdd" width="80%" v-loading="loading">
      <div class="ocr-edit">
        <h4 style="margin-top:0">题目(不含答案)</h4>
        <div ref="ShouTitle" class="divWangeditor" style="text-align:left"></div>
        <h4>解答(可选)</h4>
        <div ref="ShouCorrect" class="divWangeditor" style="text-align:left"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="adddialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="dialogFormVisible = true">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog class="search-dialog" title="搜索题目" :visible.sync="dialogSearch" width="85%" height="85%">
      <searchQues @Sadd="SearchAdd"></searchQues>
    </el-dialog>
  </div>
</template>

<script>
var ShouTitle, ShouCorrect

import pictureCut from '@/components/picture-cut/index'
import nxSvgIcon from '@/components/nx-svg-icon/index'
import quexBox from '@/components/my-box/quex-box'
import VueCropper from 'vue-cropperjs'
import { typeList } from '@/assets/js/question_type.js'
import searchQues from './searchQues'
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
    pictureCut,
    searchQues
    // slider,
    // slideritem
  },
  data: function() {
    return {
      activeName: 'cutup',
      dialogSearch: false,
      loading: false,
      openNum: false,
      showLoading: false,
      cropImg: '',
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
          { required: true, message: '请选择题目分类', trigger: 'change' }
        ],
        Type: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ]
      },
      typelist: typeList,
      Locations: [],
      LocaLength: 0
    }
  },
  methods: {
    toCutup() {
      var imgs = new Image()
      imgs.setAttribute('src', this.cropImg)
      var That = this
      imgs.onload = function() {
        for (var j = That.LocaLength; j < That.Locations.length; j++) {
          var w = That.Locations[j].width
          var h = That.Locations[j].height
          var sx = That.Locations[j].left
          var sy = That.Locations[j].top
          var canvas = document.createElement('CANVAS')
          canvas.width = w
          canvas.height = h
          var context = canvas.getContext('2d')
          context.drawImage(this, sx, sy, w, h, 0, 0, w, h)
          // $('body').append(canvas)
          That.Locations[parseInt(j)].Image = canvas.toDataURL('image/png')
        }
        // console.log(this.LocaLength, That.Locations)
        // 主动触发数据的改变
        That.Locations[That.LocaLength].left += 1
      }
    },
    SearchAdd(value) {
      var question = {}
      question.words = value
      this.Locations = this.Locations.concat(question)
    },
    Getresult(data) {
      this.LocaLength = this.Locations.length
      this.Locations = this.Locations.concat(data)
      if (this.Locations) {
        this.toCutup()
      }
    },
    GetImage(value) {
      this.cropImg = value
    },
    GetQuestion(questions) {
      for (var i = 0; i < questions.length; i++) {
        this.Locations[this.LocaLength + i].words = questions[i][0]
      }
    },
    Add() {
      this.form.Content = ''
      this.form.Analysis = ''
      this.adddialog = true
    },
    Edit(index) {
      this.form.Content = this.Locations[index].words.Content
      this.form.Analysis = this.Locations[index].words.Analysis
      this.adddialog = true
    },
    Detele(index) {
      this.$confirm('确定删除该题？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Locations.splice(index, 1)
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
          upQuestion(this.$qs.stringify(datas)).then(res => {
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
    async GetCategory() {
      questionCategory(this.$qs.stringify()).then(res => {
        this.Categorylist = res.data.data
      }).catch(() => {
        console.log('获取题目分类数据失败！')
      })
    },
    openAdd() {
      if (this.openNum) {
        ShouTitle.txt.html(this.form.Content)
        ShouCorrect.txt.html(this.form.Analysis)
        return
      }
      this.openNum = true
      this.loading = true
      // 富文本配置
      var That = this
      // var Imgurl = 'http://192.168.1.105/'
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
            insertImg(url)
          }
        }
      }
      ShouTitle.create()
      ShouCorrect.create()
      ShouTitle.txt.html(this.form.Content)
      ShouCorrect.txt.html(this.form.Analysis)
      this.loading = false
    }
  },
  mounted() {
  },
  created() {
    this.GetCategory()
    // this.toCutup()
  },
  activated() {
  }
}
</script>

<style scoped lang="scss">

.slider-ques{
  font-size: unset;
  text-align: left;
  color: unset;
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
    padding-bottom: 30%;
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
