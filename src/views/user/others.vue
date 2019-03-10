<template>
  <div class="profile">
    <div class="profile-header">
      <div class="bg-blur"></div>

      <el-button class="toAttention"
          :type="Attention==true?'danger':''"
          :icon="Attention==true?'':'el-icon-plus'"
          @click="toAttention($event)"
          round >{{Attention==true?'已关注':'关注'}}
      </el-button>

      <img class="header-avatar" :src="user.avatar">
      <span class="header-name">{{user.name}}</span>
      <span class="header-bio">这个家伙很懒，什么都没留下</span>
      <div class="header-info">
      </div>
    </div>
    <div id="content">
      <el-tabs v-model="activeName" class='is_stretch' >
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
                      <td>mangyu</td>
                    </tr>
                    <tr>
                      <th>性别</th>
                      <td>男</td>
                    </tr>
                    <tr>
                      <th>家乡</th>
                      <td>
                        江西/赣州
                      </td>
                    </tr>
                    <tr>
                      <th>现居</th>
                      <td>浙江/绍兴</td>
                    </tr>
                    <tr>
                      <th>职业</th>
                      <td>学生</td>
                    </tr>
                    <tr>
                      <th>简介</th>
                      <td class="brief-introduction">
                        <p>学习，运动，编程都不擅长，擅长吃饭，睡觉，打游戏</p>
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
                      <td>Shaoxing University</td>
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
                      <th>QQ</th>
                      <td>1445327460</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="最近错题" name="ques">
          <div class="ques-list">
            <div class="ques-list_item" v-for="(item,index) in questions" :key="index">
              <div class="ques_box">
                <div class="ques_header">
                  <img :src="user.avatar">
                  <div class="header_right">
                    <b>{{user.name}}</b>
                  </div>
                </div>
                <span class="header_time"><i class="el-icon-time"> 19/02/16 19:52:24</i></span>
                <router-link to="/home/other_answer/1">
                  <div class="ques_body">
                    <b class="ques_title">{{item.title}}</b>
                    <div class="tipbox ques_answer">{{item.answer}}</div>
                  </div>
                </router-link>
                <div class="ques_footer">
                  <nx-svg-icon class-name='international-icon' icon-class="zan" /><span class="ques_footer_num">666</span>
                  <nx-svg-icon class-name='international-icon' icon-class="collect" /><span class="ques_footer_num">6</span>
                  <nx-svg-icon class-name='international-icon' icon-class="comment" /><span  class="ques_footer_num">66</span>
                  <el-tag>数学</el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'
import {
  getNoteList
} from '@/api/notes'

import {
  P_toFollowee
} from '@/api/toPost'

export default {
  name: 'others',
  components: { nxSvgIcon },
  data() {
    return {
      user: this.$store.getters,
      questions: [],
      Attention: true,
      activeName: 'info'
    }
  },
  methods: {
    getNotes() {
      getNoteList().then(res => {
        this.questions = res.data
      }).catch(() => {})
      this.loading = false
    },
    toAttention() {
      P_toFollowee().then(res => {
        this.Attention = !this.Attention
      }).catch(() => {
        this.$message.warning('操作失败...')
      })
      // if (this.Attention === true) {
      //   this.Attention = false
      //   this.$notify({
      //     title: '提示',
      //     message: '已取消关注',
      //     type: 'info'
      //   })
      // } else {
      //   this.Attention = true
      // }
    }
  },
  created() {
    this.getNotes()
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
    height: 350px;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    flex-flow: column;
    z-index: 2;
    position: relative;
}

.profile-header .header-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-top: 100px;
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
    background: linear-gradient( to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100% )
}

.profile-header .header-name,.profile-header .header-bio {
    color: #ffffff;
    display: inline-block;
    text-align: center;
    font-size: 15px;
    margin-top: 10px;
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

@media (max-width: 768px)
{
  .profile-header{
    height: 240px;
  }
  .profile-header .header-avatar{
    margin-top: 25px;
  }
}
</style>
