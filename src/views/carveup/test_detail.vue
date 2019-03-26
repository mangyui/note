<template>
  <div class="app-container">
    <span class="header-title">测试详情</span>
    <div class="big-box1200">
      <!--工具条-->
      <div class="list-gbtn">
        <!-- <div class="gbtn-box"> -->
          <el-checkbox v-model="showAnalysis" label="答案" border size="medium"></el-checkbox>
          <el-button type="primary" plain  @click="dialogFormVisible=!dialogFormVisible" size="medium">学生完成情况</el-button>
        <!-- </div> -->
      </div>
      <div class="container" id="Test">
        <div v-if="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div class="test-box" v-for="(item,index) in 10" :key="index">
          <div class="test_title">
            <!-- <span v-if="isDelete">
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="todelete(index)"></el-button>
            </span> -->
            <div class="test_content">
              <p>水的密度是1.0×10<sup>3</sup>千克/米<sup>3</sup>，它表示<u></u></p>
            </div>
          </div>
          <br/>
          <div class="tipbox test_Correct" style="color:#f95353" v-if="showAnalysis">
            正确答案:&nbsp;体积是1米&sup3;水的质量为1.0×10&sup3;㎏ <br/>试题分析：密度表示的是某种物质单位体积的质量，水的密度是1.0×10<sup>3</sup>千克/米<sup>3</sup>，所以1米&sup3;水的质量为1.0×10&sup3;㎏。<br>考点：密度的物理意义
          </div>
          <br>
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

// import {
//   GetTest
// } from '@/api/toPost'
// import qs from 'qs'

export default {
  name: 'getTest',
  data() {
    return {
      dialogFormVisible: false,
      showLoading: false,
      showAnalysis: false,
      isDelete: false,
      // isXuhao: false,
      Categorylist: [],
      Tests: [],
      oldTest: []
    }
  },
  methods: {
    // 获取题目分类
    addOrdinal() {
      var i = 0
      this.Tests.forEach(item => {
        i++
        var index1 = item.Content.indexOf('>') + 1
        var index2 = item.Content.indexOf('.') + 1
        var index = index2 - index1 < 4 ? index2 : index1
        item.Content = item.Content.substring(0, index1) + i + '.' + item.Content.substring(index++)
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
