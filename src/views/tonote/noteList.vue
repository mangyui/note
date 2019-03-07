<template>
  <div class="app-container notes">
    <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 我的笔记</el-breadcrumb-item>
          <el-breadcrumb-item>笔记列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--工具条-->
    <el-form :inline="true">
      <el-form-item>
        <el-input placeholder="题目"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" v-on:click="">查询</el-button>
      </el-form-item>

      <el-select  v-model="type" placeholder="选择类型">
        <el-option label="数学" value="type1"></el-option>
        <el-option label="语文" value="type2"></el-option>
        <el-option label="其他" value="type3"></el-option>
      </el-select>
    </el-form>
    <div>
      <router-link  to='/todo/edit/1'>
        <el-button type="primary" @click="">新增</el-button>
      </router-link>
       <el-button type="danger" icon="el-icon-delete" circle @click="showDelete=!showDelete"></el-button>
    </div>
    <div class="container">
      <el-row :gutter="15">
        <el-col  :xs="24" :sm="24" :md="12" :lg="12" :xl="8" v-for="(item,index) in questions" :key="index">
            <el-card shadow="hover">
              <i v-if="showDelete" class="el-icon-close icon-delete" @click="toDetele"></i>
              <div class="big-box">
                <i class="header-icon el-icon-star-on"></i>
                <div class="big-body">
                <router-link  to='/tonote/note_detail/1'>
                  <b class="big-title">{{item.title}}</b>
                  <div><p class="tipbox big-content">{{item.answer}}</p></div>
                </router-link>
                  <div class="big-time"><i class="el-icon-time"> 2019-02-16 19:52:24</i></div>
                  <div><el-tag>数学</el-tag></div>
                </div>
              </div>
            </el-card>
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
  name: 'noteList',
  data() {
    return {
      showDelete: false,
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
    },
    toDetele() {
      this.$confirm('此操作将永久删除该笔记, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    }
  },
  mounted() {
    this.getNotes()
  }
}
</script>

<style scoped lang="scss">
    @import '../../styles/note_box.scss';
</style>
