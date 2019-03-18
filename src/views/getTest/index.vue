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
        <div class="gbtn-box">
          <el-select v-model="getForm.CategoryId" placeholder="选择分类" @change="">
              <el-option
                v-for="item in Categorylist"
                :key="item.Id"
                :label="item.Subject"
                :value="item.Id">
                <span style="float: left">{{ item.Subject }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Class }}</span>
              </el-option>
          </el-select>
          <!-- <el-input-number v-model="getForm.Number" :step="2" :max="50" :min="1">数量</el-input-number> -->
          <el-select v-model="getForm.Number" placeholder="选择数量" @change="">
              <el-option
                v-for="item in toNum"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </div>
        <div class="gbtn-box">
          <el-checkbox v-model="showAnalysis" label="显示答案" border></el-checkbox>
          <el-button type="primary"  @click="getTest">生成试题</el-button>
        </div>
      </div>
      <div class="container" id="Test">
        <div v-if="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <!-- <img :src="'http://127.0.0.1:9528/static/img/avatar.jpg'" alt=""> -->
        <!-- <img src="http://p0.so.qhimgs1.com/sdr/400__/t014c2f774eb0ffbd3a.jpg" alt=""> -->
        <p>有种你就在手机端把我下载喽</p>
        <div v-for="(item,index) in Tests" :key="index">
          <div class="test_title">
            <div class="test_content" v-html="item.Content"></div>
          </div>
          <br/>
          <div class="tipbox test_Correct" style="color:red" v-if="showAnalysis" v-html="item.Analysis"></div>
          <br/>
        </div>
      </div>
      <br/>
      <el-button v-if="Tests[0]" type="primary"  @click="ToWord">生成Word</el-button>
      <el-button type="primary"  @click="ToWord">生成Word</el-button>
      <!-- <a href="https://www.baidu.com/">打开百度</a>-->
      <!-- <a href="https://www.baidu.com/" id="alink" download="test.doc">test</a> -->
      <!-- <a href="" id="alink" target="_blank" style="display: none">test</a> -->
      <!-- <el-button type="primary"  @click="ToMobile">下载1</el-button>
      <el-button type="primary"  @click="ToMo">下载2</el-button> -->
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
  name: 'getTest',
  data() {
    return {
      showLoading: false,
      showAnalysis: false,
      Categorylist: [],
      Tests: [],
      getForm: {
        UserId: this.$store.getters.user.Id,
        CategoryId: '',
        Date: 30,
        Number: '10'
      },
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
        var index = item.Content.indexOf('>') + 1
        // console.log(index)
        item.Content = item.Content.substring(0, index) + i + '. ' + item.Content.substring(index++)
        // console.log(item.Content.substring(0, index))
      })
    },
    getTest() {
      this.showLoading = true
      GetTest(qs.stringify(this.getForm)).then(res => {
        this.Tests = res.data.data
        this.addOrdinal()
        this.showLoading = false
      }).catch((res) => {
        console.log(res)
      })
    },
    ToWord() {
      // this.$prompt('请输入文件名', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   value: 'test',
      //   center: true
      // }).then(({ value }) => {
      var blob = $('#Test').wordExport('test')
      var filename = 'test_' + new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, '').replace(/\.[\d]{3}Z/, '')
      window.saveAs(blob, filename + '.doc')

      // window.navigator.msSaveBlob(blob, filename + '.doc')
      // window.open(URL.createObjectURL(blob), '_system')
      // alert(blob)
      // 手机端保存
      // var files = new window.File([blob], 'test', { type: 'doc' })
      // window.open(files, '_system')
      // }).catch(() => {})
    },
    ToMobile() {
      window.open('https://coding.net/api/share/download/925b6a78-ea70-489d-826f-aa394fb0ea1d', '_system')
    },
    ToMo() {
      var blob = $('#Test').wordExport('test')
      window.open(URL.createObjectURL(blob))
    }
  },
  created() {
    this.GetCategory()
  }
}
</script>


<style lang="scss" scoped>
.test_title{
  margin: 20px 0 15px;
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
  .test_Correct{
    line-height: 1.8em;
    font-size: 15px;
  }
}
.gbtn-box{
  flex-grow: 1;
  text-align: center;
  margin-bottom: 10px;
}
</style>
