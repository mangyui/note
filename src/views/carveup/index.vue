<template>
  <div class="app-container">
    <span class="header-title">添加测试</span>
      <div class="big-box1200">
        <!-- <pictureCut cutIcon="cutup" @Cresult="Getresult" @CImage="GetImage" @Cquestion="GetQuestion"></pictureCut>
        <br/> -->
        <div class="list-gbtn">
          <div>
            <el-button class="yellow-btn" icon="el-icon-rank" @click="isSuo=!isSuo" size="small">{{isSuo?'展开':'收缩'}}题目</el-button>
          </div>
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
            <div v-show="!showLoading&&!questionList[0]" class="loading-box">
              - 空空如也 -
            </div>
            <el-card shadow="hover" class="cut_item" v-for="(item,index) in questionList" :key="index">
              <b>{{index+1}}.</b>
              <br/>
              <!--触发改变-->
              <span v-show="item.left"></span>
              <el-button v-show="item.question.Content" class="cut_item-detele cut_item-edit" type="text" icon="el-icon-edit" size="large" @click="Edit(index)"></el-button>
              <el-button class="cut_item-detele" type="text" icon="el-icon-close" size="large" @click="Detele(index)"></el-button>
              <img v-show="item.Image&&!isSuo" preview='1' :src="item.Image" alt="加载中" :title="'第'+ (index+1) +'题'">
              <el-main v-if="!item.question.Content" v-loading="true">
                <div class="cut_item_content" v-html="item.words"></div>
              </el-main>
              <div v-show="item.question.Content" class="cut_item_content" :style="isSuo?'max-height: 39px':''" v-html="item.question.Content"></div>
              <!-- <div style="text-align: right;">
                <el-button v-show="item.question.Id"  class="yellow-btn" icon="el-icon-edit" size="small" @click="Edit(index)">修改</el-button>
              </div> -->
            </el-card>
          </div>
        </div>
        <div v-show="questionList[0]" class="cut-footer">
          <el-button type="primary" size="medium" @click="toTest">生成测试</el-button>
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
     <el-dialog title="测试编辑添加" :visible.sync="TestdialogFormVisible" >
      <el-form :model="Testform" :rules="TesteditFormRules">
        <el-form-item label="测试名称" prop="Title">
          <el-input v-model="Testform.Title" placeholder="输入测试名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="测试时长" prop="LimiteTime">
            <el-input v-model="Testform.LimiteTime" placeholder="输入该测试多少分钟内完成" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="UserrelationId">
          <el-select v-model="Testform.UserrelationId" placeholder="请选择班级">
            <el-option
              v-for="item in ClassListByTid"
              :key="item.Id"
              :label="item.Intor"
              :value="item.Id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试状态" prop="Status">
          <el-select v-model="Testform.Status" placeholder="请选择测试状态">
            <el-option label="现在开始测试" value="0"></el-option>
            <el-option label="稍后开始测试" value="1"></el-option>
            <!-- <el-option label="结束" value="end"></el-option> -->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="TestdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="undateTest()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
var ShouTitle, ShouCorrect

import quexBox from '@/components/my-box/quex-box'
import VueCropper from 'vue-cropperjs'
import { typeList } from '@/assets/js/question_type.js'
import searchQues from './searchQues'
import {
  questionCategory,
  GetListByTid
} from '@/api/toget'

import {
  Imgurl,
  upQuestion,
  addTest
} from '@/api/toPost'

export default {
  name: 'carveup',
  components: {
    VueCropper,
    quexBox,
    searchQues
    // slider,
    // slideritem
  },
  data: function() {
    const validateLimiteTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('测试时间不能为空'))
      } else {
        const reg = new RegExp('^[0-9]*[1-9][0-9]*$')
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('测试时间只能为大于0的正整数'))
        }
      }
    }
    return {
      activeName: 'cutup',
      dialogSearch: false,
      isSuo: false,
      loading: false,
      openNum: false,
      showLoading: false,
      cropImg: '',
      adddialog: false,
      dialogFormVisible: false,
      showAdd: false,
      questionList: [],
      questionIds: [],
      Categorylist: [],
      ClassListByTid: [],
      Updateindex: null,
      TestdialogFormVisible: false,
      Testform: {
        Title: '',
        TeacherId: this.$store.getters.user.Id,
        LimiteTime: '',
        Status: '0',
        UserrelationId: '',
        Content: ''
      },
      form: {
        Content: '',
        Text: '',
        Analysis: '',
        KeyWords: '',
        CategoryId: '',
        Type: '',
        Repetition: 1
      },
      TesteditFormRules: {
        Title: [
          { required: true, message: '测试名称不能为空', trigger: 'blur' }
        ],
        LimiteTime: [
          { validator: validateLimiteTime, trigger: 'blur' }
        ],
        Status: [
          { required: true, message: '测试状态不能为空', trigger: 'blur' }
        ]
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
    undateTest() {
      addTest(this.$qs.stringify(this.Testform)).then(res => {
        if (parseInt(res.data.code) === 0) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          console.log(this.questionList)
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '添加失败!'
        })
      })
      this.TestdialogFormVisible = false
    },
    toTest() {
      this.TestdialogFormVisible = true
      var str = ''
      var cnt = 0
      this.questionList.forEach(element => {
        if (cnt !== 0) {
          str = str + ','
        }
        str = str + element.question.Id
        cnt = cnt + 1
      })
      this.Testform.Content = str
      console.log(this.Testform)
    },
    toCutup() {
      var imgs = new Image()
      imgs.setAttribute('src', this.cropImg)
      var That = this
      imgs.onload = function() {
        for (var j = 0; j < That.Locations.length; j++) {
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
          That.Locations[parseInt(j)].question = {}
        }
        That.questionList = That.questionList.concat(That.Locations)
      }
    },
    SearchAdd(value) {
      var index = this.questionList.find((item) => {
        return item.question.Id === value.Id
      })
      if (index) {
        this.$notify({
          title: '提示',
          message: '该题已存在',
          position: 'bottom-right'
        })
      } else {
        var question = {}
        question.question = value
        this.questionList = this.questionList.concat(question)
        this.$notify({
          message: '添加成功',
          position: 'bottom-right'
        })
      }
    },
    Getresult(data) {
      this.LocaLength = this.questionList.length
      this.Locations = data
      if (this.Locations) {
        this.toCutup()
      }
    },
    GetImage(value) {
      this.cropImg = value
    },
    GetQuestion(questions) {
      for (var i = 0; i < questions.length; i++) {
        this.questionList[this.LocaLength + i].question = questions[i][0]
      }
      // 主动触发数据的改变
      this.questionList[this.LocaLength].left += 1
    },
    Add() {
      this.form.Content = ''
      this.form.Analysis = ''
      this.form.Type = ''
      this.form.CategoryId = ''
      this.adddialog = true
      this.Updateindex = null
    },
    // 编辑
    Edit(index) {
      this.form.Content = this.questionList[index].question.Content
      this.form.Analysis = this.questionList[index].question.Analysis
      this.form.Type = this.questionList[index].question.Type
      this.form.CategoryId = this.questionList[index].question.CategoryId
      this.adddialog = true
      this.Updateindex = index
    },
    Detele(index) {
      this.$confirm('确定删除该题？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.questionList.splice(index, 1)
      }).catch(() => {})
    },
    submit() {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.upOradd()
          this.dialogFormVisible = false
          this.adddialog = false
          var datas = this.form
          datas.Text = ShouTitle.txt.text()
          upQuestion(this.$qs.stringify(datas)).then(res => {
            if (this.Updateindex !== null) {
              this.questionList[this.Updateindex].question.Id = res.data.data.Id
            } else {
              this.questionList[this.questionList.length - 1].question.Id = res.data.data.Id
            }
          }).catch((msg) => {
            this.$message.warning(msg)
          })
        }
      })
    },
    upOradd() {
      var question = {
        Content: this.form.Content,
        Analysis: this.form.Analysis,
        Type: this.form.Type,
        CategoryId: this.form.CategoryId
      }
      if (this.Updateindex !== null) {
        this.questionList[this.Updateindex].question = question
        this.$notify({
          title: '提示',
          message: '修改成功！',
          type: 'success'
        })
      } else {
        var ques = {
          question: question
        }
        this.questionList = this.questionList.concat(ques)
        this.$notify({
          title: '提示',
          message: '添加成功！',
          type: 'success'
        })
      }
    },
    // 通过教师id获取创建的班级列表
    GetClassListByTeacherId() {
      if (this.$store.getters.user.Id) {
        GetListByTid(this.$store.getters.user.Id).then(res => {
          this.ClassListByTid = res.data.data
        }).catch(() => {
          console.log('获取班级分类数据失败！')
        })
      }
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
    this.GetClassListByTeacherId()
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
  margin-bottom: 20px;
  .cut_item_content{
    background: #eef1f6;
    padding: 7px 11px;
    line-height: 28px;
    font-size: 15px;
    margin-bottom: 5px;
    overflow: hidden;
    max-height: 500px;
    transition: 0.28s;
  }
  .cut_item-detele{
    position: absolute;
    right: 5px;
    top: 5px;
    color: #F56C6C;
    font-size: 21px;
    padding: 0;
    i{
      font-weight: bold;
    }
  }
  .cut_item-edit{
    right: 40px;
    color: #409EFF;
    font-size: 19px;
  }
}
.cut-footer{
  text-align: center;
  margin: 20px 0;
}
</style>
