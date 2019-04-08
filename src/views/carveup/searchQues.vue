<template>
  <div class="searchQues-warp">
      <div class="top-search">
        <el-input
          placeholder="请输入内容"
          @keyup.enter.native="SearchQuestion"
          v-model="Sdata.Keys">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <i slot="suffix" v-show="Sdata.Keys" class="el-input__icon el-icon-close" @click="Sdata.Keys=''"></i>
        </el-input>
        <div class="voice-button">
          <div class="voice-input-button-wrapper">
            <voiceBtn @record="showResult"></voiceBtn>
          </div>
        </div>
      </div>
      <div class="searchBox">
        <div v-show="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div v-show="showNone" class="loading-box">
          <i class="el-icon-search"></i>
          空空如也...
        </div>

        <div class="ques-list">
          <div class="ques-list_item" v-for="(item,index) in questions" :key="index">
            <div class="ques_box">
              <router-link :to="'/home/question_details/'+item.Id">
                <div class="ques_body tipbox">
                  <b>{{index+1}}.</b><div class="QUesTitle" v-html="item.Content"></div>
                </div>
              </router-link>
              <el-button class="downMore" @click="clickfun($event)" type="primary" icon="el-icon-caret-bottom" size="mini" ></el-button>
              <div class="ques_footer">
                <nx-svg-icon class-name='international-icon' icon-class="zan" /><span class="ques_footer_num">{{item.LikeNumber}}</span>
                <nx-svg-icon class-name='international-icon' icon-class="collect" /><span class="ques_footer_num">{{item.CollectNumber}}</span>
                <el-checkbox class="addQuestion" size="small" v-model="isChecked" label="添加" border></el-checkbox>
              </div>
            </div>
          </div>
        </div>

        <div v-show="showMore" class="loading-box">
          <i class="el-icon-loading"></i>
          加载更多中...
        </div>
        <div v-show="!showMore && NoneMore" class="loading-box">
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

import voiceBtn from '@/components/voice/index'
import { voice } from '@/utils/private.js'

export default {
  name: 'searchQues',
  components: {
    nxSvgIcon,
    voiceBtn
  },
  data() {
    return {
      homeTop: 0,
      voice: voice,
      ScrollTop: 0,
      isChecked: false,
      questions: [],
      oldQuetions: [],
      type: '',
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
    document.querySelector('.searchBox').scrollTop = this.homeTop || 0
    console.log(this.homeTop)
  },
  beforeRouteLeave(to, from, next) {
    this.homeTop = document.querySelector('.searchBox').scrollTop || 0
    console.log(this.homeTop)
    next()
  },
  methods: {
    SearchQuestion() {
      // if (this.Sdata.Keys.trim() === '') {
      //   return
      // }
      this.Sdata.Page = 1
      this.showNone = false
      this.NoneMore = false
      this.showLoading = true
      this.Sdata.Keys = this.Sdata.Keys.substring(0, 50)
      SearchQues(this.$qs.stringify(this.Sdata)).then(res => {
        this.oldQuetions = res.data.data
        this.Gaoliang()
        this.questions = this.oldQuetions
        this.showLoading = false
        if (!this.questions[0]) {
          this.showNone = true
        } else {
          this.showNone = false
        }
      }).catch((res) => {
        console.log(res)
        this.showLoading = false
      })
    },
    Gaoliang() {
      this.oldQuetions.pop()
      var value = this.Sdata.Keys
      this.oldQuetions.forEach(item => {
        for (var i = 0; i < value.length; i++) {
          var pattern = new RegExp('[\u4E00-\u9FA5]+')
          if (pattern.test(value[i])) {
            // 匹配关键字正则
            var replaceReg = new RegExp(value[i], 'g')
            // 高亮替换v-html值
            var replaceString = '<span style="background:#ff0;font-weight: bold;">' + value[i] + '</span>'
            // 开始替换
            item.Content = item.Content.replace(replaceReg, replaceString)
            // console.log(item.Content)
            // item.Content = item.Content.split(value[i]).join('<span style="background:#ff0;font-weight: bold;">' + value + '</span>')
          }
        }
      })
    },
    onScroll() {
      if (this.NoneMore || this.showMore) {
        return
      }
      this.showMore = true
      this.Sdata.Page++
      SearchQues(this.$qs.stringify(this.Sdata)).then(res => {
        this.oldQuetions = res.data.data
        this.Gaoliang()
        this.questions = this.questions.concat(this.oldQuetions)
        this.showMore = false
        if (res.data.data.length < this.Sdata.Number) {
          this.NoneMore = true
        } else {
          this.NoneMore = false
        }
      }).catch(() => {})
    },
    showResult(text) {
      this.Sdata.Keys = this.Sdata.Keys + text.substr(0, text.length - 1)
      if (text !== '') {
        this.SearchQuestion()
      }
    },
    clickfun(e) {
      var p = e.currentTarget.previousElementSibling.firstElementChild
      if (p.style.maxHeight === '1000px') {
        p.style.maxHeight = '200px'
        e.currentTarget.firstElementChild.style.transform = ''
      } else {
        p.style.maxHeight = '1000px'
        e.currentTarget.firstElementChild.style.transform = 'rotate(180deg)'
      }
    }
  },
  mounted() {
  },
  created() {

  },
  deactivated() {
  }
}
</script>

<style lang="scss" scoped>
.searchQues-warp{
  position: relative;
  height: 100%;
}
.voice-input-button-wrapper{
  width: 36px;
  height: 36px;
  margin: 0 0 0 5px;
}
.searchBox{
  // border-top: 1px solid #efefef;
  // border-bottom: 1px solid #efefef;
  min-height: 300px;
  max-height: 92%;
  overflow: auto;
}
.addQuestion{
  float: right;
  margin-top: -7px;
}
</style>
