<template>
  <div class="app-container test_todo">
    <span class="header-title">测试</span>
    <div class="big-box1200">
      <div v-if="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
      <div class="list-gbtn" v-show="Tests[1]">
        <div>
          <el-button v-show="crrindex!=0" type="primary" icon="el-icon-caret-left" size="small" @click="toPrev" round>上一题</el-button>
        </div>
        <div>
          <el-button v-show="crrindex!=Tests.length-1" type="primary" size="small" @click="toNext" round>下一题<i class="el-icon-caret-right el-icon--right"></i></el-button>
        </div>
      </div>
      <div class="container">
        <el-carousel height="800px" ref="carousel" arrow="never" indicator-position="none" @change="getIndex"
        :autoplay="false"
        :loop="false">
          <el-carousel-item v-for="(item,index) in Tests" :key="index">
            <div>
              <br>
              <br>
              <el-tag class="test_type" size="small">{{item.Type}}</el-tag>
              <b class="test_indicator"><span style="color:#409EFF">{{index+1}}</span> / {{Tests.length}}</b>
              <div class="test_title">
                <span>{{index+1}}.</span>
                <div class="test_content" v-html="item.Content"></div>
              </div>
              <!-- <div v-show="IsAnalysis[0]!=null">
                <el-checkbox v-model="IsAnalysis[index]">查看答案</el-checkbox>
                <div v-show="IsAnalysis[index]" class="tipbox test_Correct" v-html="item.Analysis"></div>
              </div> -->
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script>

import {
  GetTestDetail
} from '@/api/toPost'

export default {
  name: 'test_todo',
  data() {
    return {
      test_id: this.$route.params.id,
      crrindex: 0,
      showLoading: false,
      Tests: [],
      IsAnalysis: null,
      getForm: {
        Id: this.$route.params.id,
        UserId: this.$store.getters.user.Id,
        CategoryId: '10',
        Date: '30',
        Number: '10'
      }
    }
  },
  methods: {
    toPrev() {
      this.$refs.carousel.prev()
    },
    toNext() {
      this.$refs.carousel.next()
    },
    getIndex(index, oldindex) {
      this.crrindex = index
    },
    addIsAnalysis() {
      this.IsAnalysis = new Array(this.Tests.length).fill(false)
    },
    getTestDetail() {
      this.showLoading = true
      GetTestDetail(this.$qs.stringify(this.getForm)).then(res => {
        this.Tests = res.data.data.Questions
        this.addIsAnalysis()
        this.showLoading = false
      }).catch((res) => {
        console.log(res)
        this.showLoading = false
      })
    }
  },
  created() {
    this.getTestDetail()
  }
}
</script>

<style lang="scss" scoped>
.test_content{
  margin-bottom: 50px;
}
.test_indicator{
  position: absolute;
  right: 0px;
  top: 0px;
}
.test_type{
  position: absolute;
  left: 0px;
  top: 0px;
}
.test_Correct{
  margin-top: 10px;
}
</style>
