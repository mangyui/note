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
        <el-button type="primary" icon="el-icon-search" v-on:click="" >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="container">
      <el-collapse v-loading="loading" v-model="activeNames">
        <el-collapse-item v-for="(item,index) in questions" :key="index">
          <template slot="title">
            <i class="header-icon el-icon-question"></i> {{index+1}}.  {{item.title}}
          </template>
          <i class="header-icon el-icon-circle-check"></i><b> 解答：</b>
          <div class="answer tipbox">{{item.answer}}</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>

import {
  getNoteList
} from '@/api/notes'

export default {
  name: 'notes',
  data() {
    return {
      activeNames: ['1'],
      questions: [],
      loading: true
    }
  },
  methods: {
    handleChange(val) {
      console.log(val)
    },
    getNotes() {
      getNoteList().then(res => {
        this.questions = res.data
      }).catch(() => {})
      this.loading = false
    }
  },
  created() {
    // console.log('created')
    this.getNotes()
  }
  // 监听生命周期钩子函数的触发实现'回到'该页面时更新data，发现无作用，只能通过监听路由变化实现
  // beforeMount() {
  //   console.log('beforeMount')
  // },
  // mounted() {
  //   console.log('mounted')
  // },
  // updated() {
  //   console.log('updated')
  // }
}
</script>

<style scoped>

</style>
