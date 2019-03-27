<template>
  <div class="app-container">
    <span class="header-title">生成试题</span>
    <div class="crumbs disNone">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 生成试题</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="big-box1200">
      <!--工具条-->
      <div class="list-gbtn">
          <el-button type="primary" plain  @click="dialogFormVisible=!dialogFormVisible" size="medium">生成试题</el-button>
        <!-- <div class="gbtn-box"> -->
          <el-checkbox v-model="showAnalysis" label="答案" border size="medium"></el-checkbox>
        <!-- </div> -->
      </div>
      <el-alert
        class="toShow"
        title="目前手机端暂不支持下载word,请移步pc端下载"
        type="warning">
      </el-alert>
      <div class="container" id="Test">
        <div v-if="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <!-- <img :src="'http://127.0.0.1:9528/static/img/avatar.jpg'" alt=""> -->
        <!-- <img src="http://p0.so.qhimgs1.com/sdr/400__/t014c2f774eb0ffbd3a.jpg" alt=""> -->
        <div class="test-box" v-for="(item,index) in Tests" :key="index">
          <br>
          <div class="test_title">
            <span v-if="isDelete">
              <el-button type="text" icon="el-icon-close" circle @click="todelete(index)"></el-button>
            </span>
            <!-- <span v-if="isXuhao">{{index+1}}.</span> -->
            <div class="test_content" v-html="item.Content"></div>
          </div>
          <br/>
          <div class="tipbox test_Correct" style="color:#f95353" v-if="showAnalysis" v-html="item.Analysis"></div>
        </div>
      </div>
      <br/>
      <!-- <el-button v-if="Tests[0]" type="primary"  @click="ToWord">生成Word</el-button> -->
      <!-- <el-button type="primary"  @click="ToWord">生成Word</el-button> -->
      <!-- <a href="https://www.baidu.com/">打开百度</a>-->
      <!-- <a href="https://www.baidu.com/" id="alink" download="test.doc">test</a> -->
      <!-- <a href="" id="alink" target="_blank" style="display: none">test</a> -->
      <!-- <el-button type="primary"  @click="ToMobile">下载1</el-button>
      <el-button type="primary"  @click="ToMo">下载2</el-button> -->
    </div>
    <el-dialog title="生成试题" :visible.sync="dialogFormVisible" center>
      <el-form :model="getForm" ref="form">
        <!-- <el-form-item label="关键字">
          <el-input v-model="form.Keywords"></el-input>
        </el-form-item> -->
        <el-form-item label="试题分类">
          <el-select size="medium" v-model="getForm.CategoryId" placeholder="选择分类" @change="">
            <el-option
              v-for="item in Categorylist"
              :key="item.Id"
              :label="item.Subject"
              :value="item.Id">
              <span style="float: left">{{ item.Subject }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Class }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最近天数">
          <el-select size="medium" v-model="getForm.Date" placeholder="选择最近天数" @change="">
            <el-option
              v-for="item in toDay"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目数量">
          <el-select size="medium" v-model="getForm.Number" placeholder="选择题目数量" @change="">
              <el-option
                v-for="item in toNum"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="getTest">确定</el-button>
      </div>
    </el-dialog>
    <div  v-if="Tests[0]" class="note_d-edit">
      <el-dropdown trigger="click">
        <el-button type="primary" icon="el-icon-edit" circle></el-button>
        <el-dropdown-menu style="overflow: hidden;" slot="dropdown">
          <div @click="deleteAll">
            <el-dropdown-item icon="el-icon-delete">全部清空</el-dropdown-item>
          </div>
          <div @click="isDelete=!isDelete">
            <el-dropdown-item icon="el-icon-close" divided>删除单个</el-dropdown-item>
          </div>
          <div @click="ToWord">
            <el-dropdown-item icon="el-icon-download" divided>生成word</el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import qs from 'qs'

import saveAs from '@/assets/js/fileexport.js'
window.saveAs = saveAs
import '@/assets/js/jquery.wordexport.js'
import {
  questionCategory
} from '@/api/toget'

import {
  GetTest
} from '@/api/toPost'

export default {
  name: 'test_detail',
  data() {
    return {
      dialogFormVisible: false,
      showLoading: false,
      showAnalysis: false,
      isDelete: false,
      // isXuhao: false,
      Categorylist: [],
      Tests: [],
      oldTest: [],
      getForm: {
        UserId: this.$store.getters.user.Id,
        CategoryId: '10',
        Date: '30',
        Number: '10'
      },
      toDay: [{
        value: '7',
        label: '7天'
      }, {
        value: '15',
        label: '15天'
      }, {
        value: '30',
        label: '30天'
      }, {
        value: '60',
        label: '60天'
      }, {
        value: '120',
        label: '120天'
      }],
      toNum: [{
        value: '1',
        label: '1题'
      }, {
        value: '10',
        label: '10题'
      }, {
        value: '30',
        label: '30题'
      }, {
        value: '50',
        label: '50题'
      }]
    }
  },
  methods: {
    // 获取题目分类
    GetCategory() {
      // 未登录 不请求
      if (!this.$store.getters.user.Id) {
        return
      }
      questionCategory().then(res => {
        this.Categorylist = res.data.data
      }).catch((res) => {
        console.log(res)
      })
    },
    addOrdinal() {
      var i = 0
      this.Tests.forEach(item => {
        i++
        var index1 = item.Content.indexOf('>') + 1
        var index2 = item.Content.indexOf('.') + 1
        var index = (index2 > index1) && (index2 - index1 < 4) ? index2 : index1
        // console.log(index)
        item.Content = item.Content.substring(0, index1) + i + '.' + item.Content.substring(index++)
        // console.log(item.Content.substring(0, index))
      })

      // this.isXuhao = true
    },
    getTest() {
      this.showLoading = true
      GetTest(qs.stringify(this.getForm)).then(res => {
        this.Tests = res.data.data
        this.showLoading = false
        this.addOrdinal()
      }).catch((res) => {
        console.log(res)
      })
      this.dialogFormVisible = false
    },
    ToWord() {
      this.isDelete = false
      var that = this
      setTimeout(function() {
        var blob = $('#Test').wordExport('test')
        var fileName = 'Test'
        var file = that.blobToFile(blob, 'test')
        // var files = new window.File([blob], 'Test', { type: 'doc' })
        window.saveAs(file, fileName + '.doc')
        // window.open(window.URL.createObjectURL(blob))
      }, 100)
      // window.navigator.msSaveBlob(blob, filename + '.doc')
      // window.open(URL.createObjectURL(blob), '_system')
      // alert(blob)
      // 手机端保存
      // var files = new window.File([blob], 'test', { type: 'doc' })
      // window.open(files, '_system')
      // }).catch(() => {})
    },
    blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date()
      theBlob.name = fileName
      return theBlob
    },
    ToMobile() {
      window.open('https://coding.net/api/share/download/925b6a78-ea70-489d-826f-aa394fb0ea1d', '_system')
    },
    ToMo() {
      var blob = $('#Test').wordExport('test')
      window.open(URL.createObjectURL(blob))
    },
    deleteAll() {
      this.Tests = []
    },
    todelete(index) {
      this.Tests.splice(index, 1)
      this.addOrdinal()
      this.$notify({
        title: '提示',
        message: '已移除该项',
        type: 'info'
      })
    }
  },
  created() {
    this.GetCategory()
  }
}
</script>


<style lang="scss" scoped>
.test-box{
  border-bottom: 1px solid #dedede;
}
.test-box:last-child{
  border-bottom: none;
}
.test_title{
  display: flex;
  margin: 5px 0 4px;
  span{
    line-height: 1.8em;
    margin-right: 10px;
  }
  .test_index{
    margin-right: 5px;
    line-height: 1.8em;
  }
  .test_content{
    display: inline-block;
    line-height: 1.8em;
    p{
      display: inline-block;
    }
  }

}
  .test_Correct{
    line-height: 27px;
    font-size: 14px;
  }
.gbtn-box{
  flex-grow: 1;
  text-align: center;
  margin-bottom: 10px;
}
.list-gbtn{
  justify-content: space-between;
}
</style>
