<template>
  <div class="app-container">
    <span class="header-title">错题本</span>
    <div class="crumbs disNone">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 错题本</el-breadcrumb-item>
          <el-breadcrumb-item>我的错题</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="big-box1200">
      <div class="top-search">
        <el-input
          placeholder="请输入内容"
          @keyup.enter.native="toSearch"
          v-model="search.keys">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <!-- <el-input placeholder="错题关键字" @keyup.enter.native="toSearch" v-model="tolist.keys"></el-input>
        <el-button type="primary" icon="el-icon-search" v-on:click="toSearch"></el-button> -->
      </div>
      <!-- <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="错题关键字" v-model="tolist.keys"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" v-on:click="toSearch"></el-button>
        </el-form-item>
      </el-form> -->
      <div class="list-gbtn">
        <el-select v-model="tolist.MistakeCateId" placeholder="错题分类" @change="toSearch">
          <el-option
            v-for="item in typelist"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id">
          </el-option>
        </el-select>
        <div>
          <el-button icon="el-icon-refresh" circle @click="refresh"></el-button>
          <router-link  to='/todo/addMistake'>
            <el-button type="primary" icon="el-icon-plus" circle></el-button>
          </router-link>
          <el-button type="danger" icon="el-icon-delete" circle @click="showDelete=!showDelete"></el-button>
        </div>
      </div>
      <div class="container">
        <div v-if="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div v-if="!questions[0] && !showLoading" class="loading-box">
          <i class="el-icon-search"></i>
          空空如也...
        </div>
        <div class="ques-list">
          <div class="ques-list_item" v-for="(item,index) in questions" :key="index">
            <div class="ques_box">
              <i v-if="showDelete" class="el-icon-close icon-delete" @click="toDetele(item.Id)"></i>
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
  QuesList,
  DeleteMistake,
  SearchMistake,
  mistakeCate
} from '@/api/toPost'

import qs from 'qs'

export default {
  name: 'quesList',
  components: { nxSvgIcon },
  data() {
    return {
      homeTop: 0,
      ScrollTop: 0,
      showLoading: true,
      showMore: false,
      NoneMore: false,
      showDelete: false,
      questions: [],
      type: '',
      typelist: [
        {
          Id: 0,
          Name: '所有'
        }
      ],
      tolist: {
        UserId: this.$store.getters.user.Id,
        MistakeCateId: 0,
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
    this.getCategory()
    this.getQues()
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
    refresh() {
      this.getCategory()
      this.getQues()
    },
    getCategory() {
      mistakeCate(qs.stringify({ UserId: this.$store.getters.user.Id })).then(res => {
        this.typelist = this.typelist.concat(res.data.data)
      }).catch(() => {
        console.log('获取数据失败！')
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
    toDetele(index) {
      this.$confirm('此操作将永久删除该错题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteMistake(qs.stringify({ Id: index, UserId: this.$store.getters.user.Id })).then(res => {
          if (res.data.code === 0) {
            this.$message.success('删除成功...')
          } else {
            this.$message.warning('操作失败...')
          }
          this.toSearch()
        }).catch(() => {})
        //
      }).catch(() => {})
    },
    toSearch() {
      if (this.search.keys.trim() === '') {
        this.getQues()
        return
      }
      this.showLoading = true
      SearchMistake(qs.stringify(this.search)).then(res => {
        this.questions = res.data.data
        this.showLoading = false
      }).catch(() => {})
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
    },
    onScroll() {
      var innerHeight = document.querySelector('.app-container').clientHeight
      var outerHeight = document.querySelector('.app-main').clientHeight
      var scrollTop = document.querySelector('.app-main').scrollTop
      this.ScrollTop = scrollTop
      if (innerHeight <= (outerHeight + scrollTop)) {
        if (this.NoneMore || this.showMore || this.search.keys.trim() !== '') {
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
    }
  }
}
</script>


<style lang="scss" scoped>
.ques-list .ques-list_item .ques_box{
  padding-top: 35px;
}
</style>
