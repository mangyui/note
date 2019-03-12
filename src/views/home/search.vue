<template>
  <div ref="smore" class="app-container">
    <span class="header-title">搜索</span>
    <div class="big-box1200">
      <div class="top-search">
        <el-input
          placeholder="请输入内容"
          @keyup.enter.native="SearchQuestion"
          v-model="Sdata.Keys">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <!-- <el-input placeholder="搜索题目" @keyup.enter.native="SearchQuestion" v-model="text"></el-input>
        <el-button type="primary" icon="el-icon-search" v-on:click="SearchQuestion"></el-button> -->
      </div>
      <!-- <el-select  v-model="type" placeholder="选择类型">
        <el-option label="数学" value="type1"></el-option>
        <el-option label="语文" value="type2"></el-option>
        <el-option label="其他" value="type3"></el-option>
      </el-select> -->
      <quex-box :option="questions"></quex-box>
      <div v-if="showLoading" class="loading-box">
        <i class="el-icon-loading"></i>
        加载中...
      </div>
      <div v-if="showNone" class="loading-box">
        <i class="el-icon-search"></i>
        空空如也...
      </div>
      <div v-if="showMore" class="loading-box">
        <i class="el-icon-loading"></i>
        加载更多中...
      </div>
      <div v-if="!showMore && NoneMore" class="loading-box">
        <i class="el-icon-search"></i>
        没有更多了...
      </div>
    </div>
  </div>
</template>


<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'

import {
  SearchQues
} from '@/api/toPost'

import quexBox from '@/components/my-box/quex-box'
import qs from 'qs'

export default {
  name: 'search',
  components: {
    nxSvgIcon,
    quexBox
  },
  data() {
    return {
      homeTop: 0,
      screenWidth: document.body.clientWidth,
      questions: [],
      type: '',
      text: '',
      showLoading: false,
      showNone: false,
      showMore: false,
      NoneMore: false,
      Sdata: {
        Keys: '',
        Page: 1,
        Number: 10,
        CategoryId: 0
      }
    }
  },
  activated() {
    document.querySelector('.app-main').scrollTop = this.homeTop || 0
  },
  beforeRouteLeave(to, from, next) {
    this.homeTop = document.querySelector('.app-main').scrollTop || 0
    next()
  },
  methods: {
    SearchQuestion() {
      if (this.Sdata.Keys.trim() === '') {
        return
      }
      this.Sdata.Page = 1
      this.showNone = false
      this.NoneMore = false
      this.showLoading = true
      this.Sdata.Keys = this.Sdata.Keys.substring(0, 50)
      SearchQues(qs.stringify(this.Sdata)).then(res => {
        this.questions = res.data.data
        this.showLoading = false
        if (!this.questions[0]) {
          this.showNone = true
        } else {
          this.showNone = false
        }
      }).catch(() => {})
    },
    onScroll() {
      var innerHeight = document.querySelector('.app-container').clientHeight
      var outerHeight = document.querySelector('.app-main').clientHeight
      var scrollTop = document.querySelector('.app-main').scrollTop
      if (innerHeight <= (outerHeight + scrollTop)) {
        if (this.NoneMore) {
          return
        }
        this.showMore = true
        this.Sdata.Page++
        SearchQues(qs.stringify(this.Sdata)).then(res => {
          this.questions = this.questions.concat(res.data.data)
          this.showMore = false
          if (res.data.data.length < this.Sdata.Number) {
            this.NoneMore = true
          } else {
            this.NoneMore = false
          }
        }).catch(() => {})
      }
    }
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  created() {

  },
  deactivated() {
  }
}
</script>

<style lang="scss" scoped>
.big-box1200{
  position: relative;
}
.home-top{
  display: flex;
  max-width: 100%;
  justify-content: space-between;
  margin:0px auto 50px;
  flex-direction:row-reverse;
}

@media (min-width: 769px){
  .big-box1200{
    margin-top: 10px;
    padding-top: 5px;
  }
}
@media (max-width: 768px)
{
  .home-top {
    margin: 0;
    padding: 10px 5px 24px;
  }
}
</style>
