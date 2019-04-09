<template>
  <div>
    <br>
    <div class="list-gbtn" v-show="Tests[1]">
      <div>
        <el-button v-show="crrindex!=0" type="primary" icon="el-icon-caret-left" size="small" @click="toPrev">上一题</el-button>
      </div>
      <div>
        <el-button v-show="crrindex!=Tests.length-1" type="primary" size="small" @click="toNext">下一题<i class="el-icon-caret-right el-icon--right"></i></el-button>
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
              <!-- <span>{{index+1}}.</span> -->
              <div class="test_content" v-html="item.Content"></div>
            </div>
            <div v-show="IsAnalysis[0]!=null">
              <el-checkbox v-model="IsAnalysis[index]">查看答案</el-checkbox>
              <div v-show="IsAnalysis[index]" class="tipbox test_Correct" v-html="item.Analysis"></div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>

export default {
  name: 'testOnline',
  props: {
    Tests: Array
  },
  data() {
    return {
      crrindex: 0,
      IsAnalysis: null
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
      this.IsAnalysis = null
      this.IsAnalysis = new Array(this.Tests.length).fill(false)
    }
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
