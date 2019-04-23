<template>
  <div class="app-container">
    <span class="header-title">测试详情</span>
    <div class="crumbs disNone">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/class/index' }"><i class="el-icon-date"></i> 我的班级</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/class/class_detail/' + ClassId }"> 初二物理班</el-breadcrumb-item>
          <el-breadcrumb-item>测试详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="big-box1200">
      <!--工具条-->
      <div class="list-gbtn">
        <!-- <div class="gbtn-box"> -->
          <div>
            <router-link :to="'/class/test_student/'+test_id">
              <el-button v-if="user.roles.toString()!=['student']" type="primary" plain size="small">学生完成情况</el-button>
            </router-link>
            <router-link :to="'/class/test_todo/'+test_id">
              <el-button v-if="user.roles.toString()==['student']" type="primary" plain size="small">开始测试</el-button>
            </router-link>
          </div>
          <div>
            <div v-if="user.roles.toString()!=['student']">
              <el-button v-show="Tests[0]" type="primary"  @click="ToWord" size="small">下载word</el-button>
             <el-checkbox v-model="showAnalysis" label="答案" border size="small"></el-checkbox>
            </div>
          </div>
        <!-- </div> -->
      </div>
      <div class="container" id="Test">
        <div v-if="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div v-if="Tests[0]" class="test_top"  style="text-align: center;">
          <h3 style="font-size:18px;">三月小测试</h3>
          <p>2019/03/27 19:56:33 ~ 2019/04/07 19:56:33 <el-tag size="small" type="success">在测</el-tag></p>
        </div>
        <div>
          <div class="test-box" v-for="(item,index) in Tests" :key="index">
          <br>
          <div class="test_title">
            <!-- <span v-if="isDelete">
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="todelete(index)"></el-button>
            </span> -->
             <div class="test_content" v-html="item.Content"></div>
          </div>
          <br/>
          <div class="tipbox test_Correct" style="color:#f95353" v-if="showAnalysis" v-html="item.Analysis"></div>
        </div>
        </div>
      </div>
      <br/>
    </div>
  </div>
</template>

<script>
import saveAs from '@/assets/js/fileexport.js'
window.saveAs = saveAs
import '@/assets/js/jquery.wordexport.js'

import {
  GetTestDetail
} from '@/api/toget'

export default {
  name: 'test_detail',
  data() {
    return {
      ClassId: '',
      test_id: this.$route.params.id,
      user: this.$store.getters.user,
      dialogFormVisible: false,
      showLoading: false,
      showAnalysis: false,
      isDelete: false,
      // isXuhao: false,
      Categorylist: [],
      Tests: [],
      getForm: {
        UserId: this.$store.getters.user.Id,
        // CategoryId: '10',
        Date: '30',
        Number: '10'
      }
    }
  },
  methods: {
    addOrdinal() {
      var i = 0
      this.Tests.forEach(item => {
        i++
        var index1 = item.Content.indexOf('>') + 1
        var index2 = item.Content.indexOf('.') + 1
        var index = (index2 > index1) && (index2 - index1 < 4) ? index2 : index1
        // console.log(index1, index2, index)
        item.Content = item.Content.substring(0, index1) + i + '.' + item.Content.substring(index++)
      })
    },
    getTest() {
      // console.log(this.$route.params.id)
      this.showLoading = true
      GetTestDetail(this.$route.params.id).then(res => {
        this.Tests = res.data.data.Questions
        this.ClassId = res.data.data.UserrelationId
        this.showLoading = false
        this.addOrdinal()
      }).catch((res) => {
        console.log(res)
      })
    },
    ToWord() {
      this.isDelete = false
      setTimeout(function() {
        var blob = $('#Test').wordExport('test')
        var fileName = 'Test'
        window.saveAs(blob, fileName + '.doc')
      }, 100)
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
    this.getTest()
  }
}
</script>


<style lang="scss" scoped>
.test_top{
  text-align: center;
  margin-bottom: 20px;
  p{
    font-size: 13px;
    color: #666;
  }
}
.test-box{
  border-bottom: 1px solid #dedede;
}
.test-box:last-child{
  border-bottom: none;
}
</style>
