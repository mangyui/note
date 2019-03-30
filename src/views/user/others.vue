<template>
  <div class="profile">
    <div v-if="Loadingtop" class="loading-box">
      <i class="el-icon-loading"></i>
      加载中...
    </div>
    <div class="profile-header" :style="{backgroundImage:'url(./static/img/main/user_bg' + Math.floor(Math.random()*6)+ '.svg)'}">
      <!-- <div class="bg-blur"></div> -->

      <el-button class="toAttention"
          :type="Attention==true?'danger':''"
          :icon="Attention==true?'':'el-icon-plus'"
          @click="toAttention()"
          round >{{Attention==true?'已关注':'关注'}}
      </el-button>

      <img class="header-avatar" preview :src="user.Avatar||'./static/img/avatar.jpg'">
      <span class="header-name">{{user.Name}}</span>
      <span class="header-bio">{{user.Intro}}</span>
      <!-- <div class="header-info">
      </div> -->
    </div>
    <div id="content" class="big-box1200">
      <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
        <el-tab-pane name="info">
          <div slot="label"><i class="el-icon-date"></i>基本资料</div>
          <div class="contariner-wraper">
            <div class="center-section-wrap">
              <div class="datum-item-box">
                <div class="datum-title-box">
                  基本信息
                </div>
                <div class="table-wrap">
                  <table class="datum-table">
                    <tr>
                      <th>用户名</th>
                      <td>{{user.Name}}</td>
                    </tr>
                    <tr>
                      <th>性别</th>
                      <td>{{user.Sex}}</td>
                    </tr>
                    <tr>
                      <th>地址</th>
                      <td>
                        {{user.Address}}
                      </td>
                    </tr>
                    <tr>
                      <th>简介</th>
                      <td class="brief-introduction">
                        <p>{{user.Intro}}</p>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <div class="datum-item-box">
                <div class="datum-title-box">
                  教育背景
                </div>
                <div class="table-wrap">
                  <table class="datum-table">
                    <tr>
                      <th>在读院校</th>
                      <td>{{School}}</td>
                    </tr>
                    <tr>
                      <th>年级</th>
                      <td>{{Class}}</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div class="datum-item-box">
                <div class="datum-title-box">
                  联系方式
                </div>
                <div class="table-wrap">
                  <table class="datum-table">
                    <tr>
                      <th>手机号码</th>
                      <td>{{user.Phone}}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="TA的错题" name="ques">
          <div v-if="showLoading" class="loading-box">
            <i class="el-icon-loading"></i>
            加载中...
          </div>
          <div class="ques-list">
            <div class="ques-list_item" v-for="(item,index) in questions" :key="index">
              <div class="ques_box">
                <router-link :to="'/home/mistake/'+item.Id">
                  <div class="ques_body tipbox">
                    <b>{{index+1}}.</b><div v-html="item.QuestionContent||item.Question.Content"></div>
                  </div>
                </router-link>
                <el-button class="downMore" @click="clickfun($event)" type="primary" icon="el-icon-caret-bottom" size="mini" ></el-button>
                <div class="ques_footer">
                  <nx-svg-icon class-name='international-icon' icon-class="zan" /><span class="ques_footer_num">{{item.LikeNumber}}</span>
                  <nx-svg-icon class-name='international-icon' icon-class="collect" /><span class="ques_footer_num">{{item.CollectNumber}}</span>
                  <el-tag v-if="item.QuestionContent" type="info">个人</el-tag>
                  <el-tag v-if="!item.QuestionContent">官方</el-tag>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!questions[0]" class="loading-box">
            <i class="el-icon-search"></i>
            空空如也...
          </div>
          <div v-if="showMore" class="loading-box">
            <i class="el-icon-loading"></i>
            加载更多中...
          </div>
          <div v-if="questions[0]&&!showMore && NoneMore" class="loading-box">
            <i class="el-icon-search"></i>
            没有更多了...
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'
// import {
//   getNoteList
// } from '@/api/notes'

import {
  P_toFollowee,
  GetCustomer,
  QuesList
} from '@/api/toPost'
import { classList } from '@/assets/js/class.js'
import {
  getSchoolList
} from '@/api/toget'

import qs from 'qs'

export default {
  name: 'others',
  components: { nxSvgIcon },
  data() {
    return {
      Loadingtop: true,
      showLoading: false,
      showNone: false,
      showMore: false,
      NoneMore: false,
      id: '',
      user: '',
      questions: [],
      Attention: false,
      activeName: 'info',
      classlist: classList,
      Class: '',
      schoolList: [],
      School: '',
      tolist: {
        UserId: 0,
        MistakeCateId: 0,
        Number: 3,
        Page: 1
      }
    }
  },
  activated() {
    this.fetchDate()
    document.querySelector('.app-main').scrollTop = this.homeTop || 0
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  beforeRouteLeave(to, from, next) {
    this.homeTop = document.querySelector('.app-main').scrollTop || 0
    document.querySelector('.app-main').removeEventListener('scroll', this.onScroll)
    next()
  },
  mounted() {
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  methods: {
    getCustomer() {
      GetCustomer(qs.stringify({ UserId: this.id, RequesterId: this.$store.getters.user.Id })).then(res => {
        this.user = res.data.data
        if (!this.user.Id) {
          this.$message.warning('没有找到...')
          var close = document.querySelector('.tags-view-item.active .el-icon-close')
          close.click()
        } else {
          var index = this.classlist.find((item) => {
            return item.value === this.user.Class
          })
          this.Class = index.label
          this.Loadingtop = false
          this.Attention = this.user.Focus || false
        }
        this.tolist.UserId = this.user.Id
        this.getschool()
        this.getQues()
      }).catch(() => {})
    },
    getschool() {
      getSchoolList().then(res => {
        this.schoolList = res.data.data
        var index = this.schoolList.find((item) => {
          return item.Id === this.user.SchoolId
        })
        this.School = index.Name
      }).catch((res) => {
        console.log(res)
      })
    },
    getQues() {
      this.NoneMore = false
      this.showLoading = true
      this.tolist.Page = 1
      QuesList(qs.stringify(this.tolist)).then(res => {
        this.questions = res.data.data
        this.showLoading = false
      }).catch(() => {})
    },
    onScroll() {
      var innerHeight = document.querySelector('.profile').clientHeight
      var outerHeight = document.querySelector('.app-main').clientHeight
      var scrollTop = document.querySelector('.app-main').scrollTop
      this.ScrollTop = scrollTop
      if (innerHeight <= (outerHeight + scrollTop)) {
        if (this.NoneMore || this.showMore) {
          return
        }
        this.showMore = true
        this.tolist.Page++
        QuesList(qs.stringify(this.tolist)).then(res => {
          this.questions = this.questions.concat(res.data.data)
          this.showMore = false
          if (res.data.data.length < this.tolist.Number) {
            this.NoneMore = true
          } else {
            this.NoneMore = false
          }
        }).catch(() => {})
      }
    },
    handleClick(tab) {
      // if (tab.name === 'ques' && !this.questions[0]) {
      //   // console.log(tab.name)
      //   this.getQues()
      // }
    },
    toAttention() {
      if (!this.$store.getters.user.Id) {
        this.$confirm('你还没有登录，不能进行该操作！前往登录', '提示', {
          confirmButtonText: '立即登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {})
        return
      }
      var data = {
        FolloweeId: this.user.Id,
        UserId: this.$store.getters.user.Id
      }
      P_toFollowee(qs.stringify(data)).then(res => {
        if (res.data.data === -1) {
          this.$notify({
            title: '提示',
            message: '已取消关注',
            type: 'info'
          })
        }
        this.Attention = !this.Attention
        // this.fetchDate()
      }).catch(() => {
        this.$message.warning('操作失败...')
      })
    },
    fetchDate() {
      this.id = this.$route.params.id
      if (this.id) {
        if (this.id === this.$store.getters.user.Id) {
          var close = document.querySelector('.tags-view-item.active .el-icon-close')
          close.click()
          this.$router.push({
            path: '/user/index'
          })
        } else {
          this.getCustomer()
        }
      }
    }
  },
  created() {
    // this.getNotes()
    this.fetchDate()
  }
}
</script>

<style scoped>
 @import '../../styles/consumer.scss';
 .datum-table td{
   padding: 20px 0;
 }
 #content{
   margin-top: 20px;
 }
.profile .icon-collect{
  top: 10px;
  right: 20px;
  font-size: 46px;
}
.bg-blur{
  width: 100%;
  height: 100%;
  background: url("../../assets/images/home/user_bg.jpg") center no-repeat;
  background-size: cover;
  position: absolute;
  z-index: -1;
  filter: blur(8px);
}
.profile-header {
    width: 100%;
    height: 200px;
    /* background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat; */
    display: flex;
    flex-flow: column;
    z-index: 2;
    position: relative;
    transition: 0.28s;
    background-size: 8%;
}

.profile-header .header-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-top: 40px;
    margin-left: 50%;
    transform: translateX(-50%);
    border: 2px solid #fff;
    overflow: hidden;
}

.profile-header .header-info {
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: absolute;
    bottom: 0;
    background: linear-gradient( to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100% )
}

.profile-header .header-name,.profile-header .header-bio {
    color: #ffffff;
    display: inline-block;
    text-align: center;
    font-size: 16px;
    margin-top: 16px;
    font-weight: bold;
}

.profile-header .header-bio {
    font-size: 14px;
}

.info-tab {
    width: 100%;
    height: 50px;
    display: flex;
    flex-flow: row;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    color: #ffffff;
}

.info-tab .info-tag {
    flex: 1;
}
.datum-item-box{
    border-top: 0;
    border-bottom: 1px solid #eeeeee;
}
@media (max-width: 768px)
{
  /* .profile-header{
    height: 240px;
  } */
  /* .profile-header .header-avatar{
    margin-top: 50px;
  } */
}
</style>
