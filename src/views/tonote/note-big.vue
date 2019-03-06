<template>
  <div class="app-container notes">
    <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 我的笔记</el-breadcrumb-item>
          <el-breadcrumb-item>笔记列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--工具条-->
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item>
        <el-input placeholder="题目"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" v-on:click="">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="">新增</el-button>
      </el-form-item>
      <el-select  v-model="type" placeholder="选择类型">
        <el-option label="数学" value="type1"></el-option>
        <el-option label="语文" value="type2"></el-option>
        <el-option label="其他" value="type3"></el-option>
      </el-select>
    </el-form>
    <div class="container">
      <el-row :gutter="15">
        <el-col  :xs="24" :sm="24" :md="12" :lg="12" :xl="8" v-for="(item,index) in questions" :key="index">
          <router-link  to='/todo/edit/1'>
            <el-card shadow="hover">
              <div class="big-box">
                <i class="header-icon el-icon-star-on"></i>
                <div class="big-body">
                  <b class="big-title">{{item.title}}</b>
                  <div><p class="tipbox big-content">{{item.answer}}</p></div>
                  <div class="big-time"><i class="el-icon-time"> 2019-02-16 19:52:24</i></div>
                  <div><el-tag>数学</el-tag></div>
                </div>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import {
  getNoteList
} from '@/api/notes'

export default {
  name: 'BigNotes',
  data() {
    return {
      questions: [],
      loading: true,
      type: 'type1'
    }
  },
  methods: {
    getNotes() {
      getNoteList().then(res => {
        this.questions = res.data
      }).catch(() => {})
      this.loading = false
    }
  },
  mounted() {
    this.getNotes()
  }
}
</script>

<style scoped>
.el-card{
  margin-bottom: 20px;
  position: relative;
}
.big-box{
  display: flex;
}
.big-title{
  padding: 5px 10px;
  font-size: 17px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 3px;
  background: #fff;
  margin-bottom: 5px;
}
.big-content{
  font-size: 14px;
  color: #666;
  line-height: 1.5em;
  height: 55px;
  overflow: hidden;
  padding: 10px 5px;
}
i.header-icon{
  margin-right: 8px;
  margin-left: -8px;
  color: #52bab5;
}
.big-body{
  flex-grow:1;
  width: 0;
}
.big-time{
  font-size: 13px;
  color: #52bab5;
  margin-top: 8px;
  text-align: right;
  position: absolute;
  right: 8px;
  bottom: 8px;
}
</style>
