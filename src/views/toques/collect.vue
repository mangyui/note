<template>
  <div class="app-container">
    <span class="header-title">我的收藏</span>
    <div class="crumbs disNone">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 错题本</el-breadcrumb-item>
          <el-breadcrumb-item>我的收藏</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="big-box1200">
      <!-- <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="错题关键字" v-model="search.keys"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" v-on:click="toSearch"></el-button>
        </el-form-item>
      </el-form> -->
      <!-- <div class="list-gbtn">
        <div></div>
        <div>
          <el-button type="primary" icon="el-icon-refresh" circle @click="getCollects"></el-button>
        </div>
      </div> -->
      <div class="container">
        <div v-if="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div v-if="!collects[0] && !showLoading" class="loading-box">
          <i class="el-icon-search"></i>
          空空如也...
        </div>
        <div class="ques-list">
          <div class="ques-list_item" v-for="(item,index) in collects" :key="index">
            <div class="ques_box">
              <span @click="toCollect(index)" >
                <nx-svg-icon
                  class-name='international-icon icon-collect'
                  style="color: #F56C6C"
                  icon-class="collect" />
              </span>
              <router-link :to="item.QuestionId==0?'/home/mistake/'+item.MistakeId:(item.MistakeId==0?'/home/question_details/'+item.QuestionId:'/home/mistake/'+item.MistakeId)">
                <div class="ques_body tipbox">
                  <b>{{index+1}}.</b><div v-html="item.Question.Content||item.Mistake.QuestionContent"></div>
                </div>
              </router-link>
              <el-button class="downMore" @click="clickfun($event)" type="primary" icon="el-icon-caret-bottom" size="mini" ></el-button>
              <div class="ques_footer">
                <nx-svg-icon class-name='international-icon' icon-class="zan" /><span class="ques_footer_num">{{item.Question.LikeNumber}}</span>
                <nx-svg-icon class-name='international-icon' icon-class="collect" /><span class="ques_footer_num">{{item.Question.CollectNumber}}</span>
                <el-tag v-if="item.QuestionId==0" type="info">个人</el-tag>
                <el-tag v-if="item.QuestionId!=0 && item.MistakeId==0">官方</el-tag>
                <!-- <el-tag v-if="item.MistakeId!=0" type="warning">题友</el-tag> -->
              </div>
            </div>
          </div>
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
    <div v-if="ScrollTop>700" class="note_d-edit" onclick="document.querySelector('.app-main').scrollTop=0">
      <el-button class="tototop" icon="el-icon-d-arrow-left" circle></el-button>
    </div>
  </div>
</template>


<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'
import {
  CollectList,
  P_toCollect
} from '@/api/toPost'

import qs from 'qs'

export default {
  name: 'collect',
  components: { nxSvgIcon },
  data() {
    return {
      homeTop: 0,
      ScrollTop: 0,
      showLoading: true,
      showMore: false,
      NoneMore: false,
      collects: [],
      // type: '',
      // typelist: [
      //   {
      //     Id: 0,
      //     Name: '所有'
      //   }
      // ],
      tolist: {
        UserId: this.$store.getters.user.Id,
        Number: 3,
        Page: 1
      },
      search: {
        keys: '',
        UserId: this.$store.getters.user.Id
      }
    }
  },
  created() {
    this.getCollects()
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
  mounted() {
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  methods: {
    getCollects() {
      this.showLoading = true
      this.tolist.Page = 1
      CollectList(qs.stringify(this.tolist)).then(res => {
        this.collects = res.data.data
        this.showLoading = false
      }).catch(() => {})
    },
    toCollect(index) {
      this.$confirm('确定取消收藏？', '提示', {
        confirmButtonText: '确定不要了',
        cancelButtonText: '留着吧',
        type: 'warning'
      }).then(() => {
        var data = {
          QuestionId: this.collects[index].QuestionId,
          UserId: this.$store.getters.user.Id
        }
        P_toCollect(qs.stringify(data)).then(res => {
          if (res.data.data === -1) {
            this.$notify({
              title: '提示',
              message: '已取消收藏',
              type: 'info'
            })
            this.collects.splice(index, 1)
          } else {
            this.$notify({
              title: '提示',
              message: '收藏成功',
              type: 'info'
            })
          }
        }).catch(() => {
          this.$message.warning('操作失败...')
        })
      }).catch(() => {})
    },
    // toSearch() {
    //   if (this.search.keys === '') {
    //     this.getNotes()
    //     return
    //   }
    //   this.showLoading = true
    //   SearchNote(qs.stringify(this.search)).then(res => {
    //     this.notes = res.data.data
    //     this.showLoading = false
    //   }).catch(() => {})
    // },
    clickfun(e) {
      var p = e.currentTarget.previousElementSibling.firstElementChild
      if (p.style.maxHeight === '1000px') {
        p.style.maxHeight = '200px'
        e.currentTarget.firstElementChild.style.transform = ''
      } else {
        p.style.maxHeight = '1000px'
        e.currentTarget.firstElementChild.style.transform = 'rotate(180deg)'
      }
    },
    onScroll() {
      var innerHeight = document.querySelector('.app-container').clientHeight
      var outerHeight = document.querySelector('.app-main').clientHeight
      var scrollTop = document.querySelector('.app-main').scrollTop
      this.ScrollTop = scrollTop
      if (innerHeight <= (outerHeight + scrollTop)) {
        if (this.NoneMore || this.showMore) {
          return
        }
        this.showMore = true
        this.tolist.Page++
        CollectList(qs.stringify(this.tolist)).then(res => {
          this.collects = this.collects.concat(res.data.data)
          this.showMore = false
          if (res.data.data.length < this.tolist.Number) {
            this.NoneMore = true
          } else {
            this.NoneMore = false
          }
        }).catch(() => {})
      }
    }
  }
}
</script>


<style scoped>
.ques-list .ques-list_item .ques_box{
  padding-top: 45px;
}
</style>
