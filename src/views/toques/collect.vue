<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 我的笔记</el-breadcrumb-item>
          <el-breadcrumb-item>笔记分类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- <el-form :inline="true">
      <el-form-item>
        <el-input placeholder="错题关键字" v-model="search.keys"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" v-on:click="toSearch"></el-button>
      </el-form-item>
    </el-form> -->
    <div class="list-gbtn">
      <!-- <el-select v-model="tolist.QuesCategoryId" placeholder="错题分类" @change="getNotes">
        <el-option
          v-for="item in typelist"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id">
        </el-option>
      </el-select> -->
      <div>
        <el-button type="primary" icon="el-icon-refresh" circle @click="getCollects"></el-button>
      </div>
    </div>
    <div class="container">
      <div v-if="showLoading" class="loading-box">
        <i class="el-icon-loading"></i>
        加载中...
      </div>
      <div v-if="!collects[0]" class="loading-box">
        <i class="el-icon-search"></i>
        没有找到...
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
             <router-link :to="item.QuestionId==0?'/home/mistake/'+item.Id:(item.MistakeId==0?'/home/question_details/'+item.Id:'/home/mistake/'+item.Id)">
              <div class="ques_body tipbox">
                <b>{{index+1}}.</b><div v-html="item.Question.Content"></div>
              </div>
            </router-link>
            <el-button class="downMore" @click="clickfun($event)" type="primary" icon="el-icon-caret-bottom" size="mini" ></el-button>
            <div class="ques_footer">
              <nx-svg-icon class-name='international-icon' icon-class="zan" /><span class="ques_footer_num">{{item.Question.LikeNumber}}</span>
              <nx-svg-icon class-name='international-icon' icon-class="collect" /><span class="ques_footer_num">{{item.Question.CollectNumber}}</span>
              <el-tag>错题</el-tag>
            </div>
          </div>
        </div>
      </div>
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
      showLoading: true,
      showDelete: false,
      collects: [],
      // type: '',
      // typelist: [
      //   {
      //     Id: 0,
      //     Name: '所有'
      //   }
      // ],
      tolist: {
        UserId: this.$store.getters.user.Id
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
  methods: {
    getCollects() {
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
    }
  }
}
</script>


<style scoped>
.ques-list .ques-list_item .ques_box{
  padding-top: 45px;
}
</style>
