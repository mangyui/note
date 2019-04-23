<template>
  <div ref="smore" class="app-container">
    <span class="header-title">搜索</span>
    <div class="big-box1200">
      <div class="top-search">
        <el-input
          placeholder="搜索"
          @keyup.enter.native="SearchQuestion"
          v-model="Sdata.Keys">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <i slot="suffix" v-show="Sdata.Keys" class="el-input__icon el-icon-close" @click="Sdata.Keys=''"></i>
        </el-input>
        <!-- <el-input placeholder="搜索题目" @keyup.enter.native="SearchQuestion" v-model="text"></el-input>
        <el-button type="primary" icon="el-icon-search" v-on:click="SearchQuestion"></el-button> -->
      </div>
      <div class="voice-button">
        <div class="voice-input-button-wrapper">
          <voiceBtn @record="showResult"></voiceBtn>
        </div>
      </div>
      <el-tabs v-model="activeName" class='is_stretch'>
        <el-tab-pane name="left" disabled></el-tab-pane>
        <el-tab-pane name="ques">
          <div slot="label">题目</div>
            <div v-show="showLoading" class="loading-box">
              <i class="el-icon-loading"></i>
              加载中...
            </div>
            <div v-show="showNone" class="loading-box">
              <i class="el-icon-search"></i>
              空空如也...
            </div>

            <quex-box :option="questions"></quex-box>

            <div v-show="showMore" class="loading-box">
              <i class="el-icon-loading"></i>
              加载更多中...
            </div>
            <div v-show="!showMore && NoneMore" class="loading-box">
              <i class="el-icon-search"></i>
              没有更多了...
            </div>
          </el-tab-pane>
          <el-tab-pane name="center" disabled></el-tab-pane>
        <el-tab-pane name="user">
        <div slot="label">用户</div>
          <div v-show="showLoading" class="loading-box">
            <i class="el-icon-loading"></i>
            加载中...
          </div>
          <div v-show="!showLoading&&!users[0]" class="loading-box">
            <i class="el-icon-search"></i>
            空空如也...
          </div>
          <el-row :gutter="12">
          <el-col  :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-for="(item,index) in users" :key="index">
            <el-card class="friend-box" :body-style="{ padding: '0px' }"  shadow="hover">
              <div class="people">
                  <router-link  :to="'/user/others/'+item.Id">
                    <div class="friend-body">
                      <img src="#" :src="item.Avatar||'./static/img/avatar.jpg'">
                      <div class="peo-right">
                        <b>{{item.Name|| '匿名'}}</b>
                        <p>{{item.Intro||'这个家伙很懒，什么都没留下'}}</p>
                      </div>
                    </div>
                  </router-link>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane name="right" disabled></el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="ScrollTop>700" class="note_d-edit" onclick="document.querySelector('.app-main').scrollTop=0">
      <el-button class="tototop" icon="el-icon-d-arrow-left" circle></el-button>
    </div>
  </div>
</template>


<script>
import {
  SearchQues,
  SearchUsers
} from '@/api/toPost'

import voiceBtn from '@/components/voice/index'
import quexBox from '@/components/my-box/quex-box'
import { voice } from '@/utils/private.js'

export default {
  name: 'search',
  components: {
    quexBox,
    voiceBtn
  },
  data() {
    return {
      homeTop: 0,
      voice: voice,
      ScrollTop: 0,
      activeName: 'ques',
      users: [],
      questions: [],
      oldQuetions: [],
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
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  beforeRouteLeave(to, from, next) {
    this.homeTop = document.querySelector('.app-main').scrollTop || 0
    document.querySelector('.app-main').removeEventListener('scroll', this.onScroll)
    next()
  },
  methods: {
    SearchQuestion() {
      // if (this.Sdata.Keys.trim() === '') {
      //   return
      // }
      this.searchuser()

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
          }
        }
      })
    },
    onScroll() {
      var innerHeight = document.querySelector('.app-container').clientHeight
      var outerHeight = document.querySelector('.app-main').clientHeight
      var scrollTop = document.querySelector('.app-main').scrollTop
      this.ScrollTop = scrollTop
      // console.log(innerHeight, outerHeight, scrollTop)
      if (innerHeight <= (outerHeight + scrollTop)) {
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
      }
    },
    searchuser() {
      if (this.Sdata.Keys.trim() === '') {
        this.users = []
        return
      }
      SearchUsers(this.$qs.stringify({ name: this.Sdata.Keys })).then(res => {
        this.users = []
        if (res.data.data.Name) {
          this.users[0] = res.data.data
        } else {
          this.users = res.data.data
        }
      }).catch((res) => {
        console.log(res)
      })
    },
    showResult(text) {
      this.Sdata.Keys = this.Sdata.Keys + text.substr(0, text.length - 1)
      if (text !== '') {
        this.SearchQuestion()
      }
    }
  },
  mounted() {
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

@media (min-width: 769px){
  .big-box1200{
    margin-top: 10px;
    padding-top: 5px;
  }
}

</style>
