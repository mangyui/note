<template>
  <div class="app-container">
    <span class="header-title">测试详情</span>
    <div class="big-box1200">
      <!--工具条-->
      <div class="list-gbtn">
        <!-- <div class="gbtn-box"> -->
          <router-link to="/carveup/test_student/1">
            <el-button type="primary" plain  @click="" size="small">学生完成情况</el-button>
          </router-link>
          <div>
            <el-button type="primary"  @click="ToWord" size="small">下载word</el-button>
            <el-checkbox v-model="showAnalysis" label="答案" border size="small"></el-checkbox>
          </div>
        <!-- </div> -->
      </div>
      <div class="container" id="Test">
        <div v-if="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div v-if="Tests[0]" class="test_top">
          <h3>三月小测试</h3>
          <p>2019/03/27 19:56:33 ~ 2019/04/07 19:56:33 <el-tag size="small" type="success">在测</el-tag></p>
        </div>
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
      <br/>
    </div>
    <!-- <div  v-if="Tests[0]" class="note_d-edit">
      <el-dropdown trigger="click">
        <el-button type="primary" icon="el-icon-edit" circle></el-button>
        <el-dropdown-menu slot="dropdown">
          <div @click="deleteAll">
            <el-dropdown-item icon="el-icon-edit">全部清空</el-dropdown-item>
          </div>
          <div @click="isDelete=!isDelete">
            <el-dropdown-item icon="el-icon-delete" divided>删除单个</el-dropdown-item>
          </div>
          <div @click="ToWord">
            <el-dropdown-item icon="el-icon-delete" divided>生成word</el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
  </div>
</template>

<script>
import saveAs from '@/assets/js/fileexport.js'
window.saveAs = saveAs
import '@/assets/js/jquery.wordexport.js'

import {
  GetTest
} from '@/api/toPost'
import qs from 'qs'

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
