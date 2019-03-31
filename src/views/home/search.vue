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
          <i slot="suffix" v-show="Sdata.Keys" class="el-input__icon el-icon-close" @click="Sdata.Keys=''"></i>
        </el-input>
        <!-- <el-input placeholder="搜索题目" @keyup.enter.native="SearchQuestion" v-model="text"></el-input>
        <el-button type="primary" icon="el-icon-search" v-on:click="SearchQuestion"></el-button> -->
      </div>
      <div class="voice-button">
        <div class="voice-input-button-wrapper">
          <voice-input-button
              server="https://www.mccyu.com:444/"
              appId="5c52f87b"
              APIKey="3d0fba416f2a2423e7380ea2ab397d9e"
              @record="showResult"
              @record-start="recordStart"
              @record-stop="recordStop"
              @record-blank="recordNoResult"
              @record-failed="recordFailed"
              color="#fff"
              tipPosition="top"
          >
            <template slot="no-speak">没听清您说的什么</template>
          </voice-input-button>
        </div>
      </div>
      <!-- <el-select  v-model="type" placeholder="选择类型">
        <el-option label="数学" value="type1"></el-option>
        <el-option label="语文" value="type2"></el-option>
        <el-option label="其他" value="type3"></el-option>
      </el-select> -->
      <el-tabs v-model="activeName" class='is_stretch'>
        <el-tab-pane name="ques">
          <div slot="label">题目</div>
            <div v-if="showLoading" class="loading-box">
              <i class="el-icon-loading"></i>
              加载中...
            </div>
            <div v-if="showNone" class="loading-box">
              <i class="el-icon-search"></i>
              空空如也...
            </div>

            <quex-box :option="questions"></quex-box>

            <div v-if="showMore" class="loading-box">
              <i class="el-icon-loading"></i>
              加载更多中...
            </div>
            <div v-if="!showMore && NoneMore" class="loading-box">
              <i class="el-icon-search"></i>
              没有更多了...
            </div>
          </el-tab-pane>
        <el-tab-pane name="user">
          <div slot="label">用户</div>
            <div v-if="showLoading" class="loading-box">
              <i class="el-icon-loading"></i>
              加载中...
            </div>
            <div v-if="!showLoading&&!users[0]" class="loading-box">
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
      </el-tabs>
    </div>
    <div v-if="ScrollTop>700" class="note_d-edit" onclick="document.querySelector('.app-main').scrollTop=0">
      <el-button class="tototop" icon="el-icon-d-arrow-left" circle></el-button>
    </div>
  </div>
</template>


<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'
import VoiceInputButton from 'voice-input-button'
import {
  SearchQues,
  SearchUsers
} from '@/api/toPost'

import quexBox from '@/components/my-box/quex-box'
import qs from 'qs'

export default {
  name: 'search',
  components: {
    nxSvgIcon,
    quexBox,
    VoiceInputButton
  },
  data() {
    return {
      homeTop: 0,
      ScrollTop: 0,
      screenWidth: document.body.clientWidth,
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
      SearchQues(qs.stringify(this.Sdata)).then(res => {
        this.oldQuetions = res.data.data
        this.Gaoliang()
        this.questions = this.oldQuetions
        this.showLoading = false
        if (!this.questions[0]) {
          this.showNone = true
        } else {
          this.showNone = false
        }
      }).catch(() => {})
    },
    Gaoliang() {
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
            // item.Content = item.Content.split(value[i]).join('<span style="background:#ff0;font-weight: bold;">' + value + '</span>')
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
        SearchQues(qs.stringify(this.Sdata)).then(res => {
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
        return
      }
      SearchUsers(qs.stringify({ name: this.Sdata.Keys })).then(res => {
        if (res.data.data.Name) {
          this.users[0] = res.data.data
        } else {
          this.users = res.data.data
        }
      }).catch(() => {})
    },
    showResult(text) {
      this.Sdata.Keys = this.Sdata.Keys + text.substr(0, text.length - 1)
      if (text !== '') {
        this.SearchQuestion()
      }
      // console.log(this.Sdata.keys)
      // this.SearchQuestion()
    },
    recordStart() {
    },
    recordStop() {
    },
    recordNoResult() {
    },
    recordFailed(error) {
      console.info('识别失败，错误栈：', error)
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
