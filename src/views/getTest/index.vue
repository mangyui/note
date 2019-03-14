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
        <div>
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
          <el-input-number v-model="getForm.Number" :step="2" :max="50" :min="1">数量</el-input-number>
        </div>
        <div>
          <el-checkbox v-model="showAnalysis" label="显示答案" border></el-checkbox>
          <el-button type="primary"  @click="getTest">生成试题</el-button>
        </div>
      </div>
      <div class="container" id="Test">
        <div v-if="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div v-for="(item,index) in Tests" :key="index">
          <div class="test_title">
            <span class="test_index">{{index+1}}.</span>
            <div class="test_content" v-html="item.Content"></div>
          </div>
          <div class="tipbox test_Correct" style="color:red" v-if="showAnalysis" v-html="item.Analysis"></div>
        </div>
      </div>
      <br/>
      <el-button v-if="Tests[0]" type="primary"  @click="ToWord">下载Word</el-button>
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
        Number: 10
      }
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
    getTest() {
      this.showLoading = true
      GetTest(qs.stringify(this.getForm)).then(res => {
        this.Tests = res.data.data
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
      $('#Test').wordExport('test')
      // }).catch(() => {})
    }
  },
  created() {
    this.GetCategory()
  }
}
</script>


<style lang="scss" scoped>
.test_title{
  display: flex;
  margin: 20px 0 15px;
  .test_index{
    margin-right: 5px;
    line-height: 1.8em;
  }
  .test_content{
    line-height: 1.8em;
  }
  .test_Correct{
    line-height: 1.8em;
    font-size: 15px;
  }
}
</style>
