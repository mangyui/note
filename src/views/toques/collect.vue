<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 我的笔记</el-breadcrumb-item>
          <el-breadcrumb-item>笔记分类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true">
      <el-form-item>
        <el-input placeholder="错题关键字" v-model="search.keys"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" v-on:click="toSearch"></el-button>
      </el-form-item>
    </el-form>
    <div class="list-gbtn">
      <el-select v-model="tolist.QuesCategoryId" placeholder="错题分类" @change="getNotes">
        <el-option
          v-for="item in typelist"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id">
        </el-option>
      </el-select>
      <div>
        <el-button type="primary" icon="el-icon-refresh" circle @click="getNotes"></el-button>
      </div>
    </div>
    <div class="container">
      <div v-if="showLoading" class="loading-box">
        <i class="el-icon-loading"></i>
        加载中...
      </div>
      <div class="ques-list">
        <div class="ques-list_item" v-for="(item,index) in questions" :key="index">
          <div class="ques_box">
            <span @click="toCollect(index)" >
              <nx-svg-icon
                class-name='international-icon icon-collect'
                :style="item.collect==true?'color: #F56C6C':''"
                icon-class="collect" />
            </span>
            <router-link to="/home/question_details/1">
              <div class="ques_body">
                <b class="ques_title">{{item.title}}</b>
                <div class="tipbox ques_answer">{{item.answer}}</div>
              </div>
            </router-link>
            <div class="ques_footer">
              <nx-svg-icon class-name='international-icon' icon-class="zan" /><span class="ques_footer_num">666</span>
              <nx-svg-icon class-name='international-icon' icon-class="collect" /><span class="ques_footer_num">6</span>
              <el-tag>数学</el-tag>
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
  NoteList,
  DeteleNote,
  SearchNote
} from '@/api/toPost'

import { NoteCategory } from '@/api/toget'
import qs from 'qs'

export default {
  name: 'collect',
  components: { nxSvgIcon },
  data() {
    return {
      showLoading: true,
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
        QuesCategoryId: 0
      },
      search: {
        keys: '',
        UserId: this.$store.getters.user.Id
      }
    }
  },
  created() {
    this.getCategory()
  },
  methods: {
    getCategory() {
      NoteCategory(this.$store.getters.user.Id).then(res => {
        if (res.data.code === 0) {
          this.typelist = this.typelist.concat(res.data.data)
        } else {
          this.$message.warning('获取笔记分类失败...')
        }
      }).catch(() => {})
    },
    getNotes() {
      NoteList(qs.stringify(this.tolist)).then(res => {
        this.notes = res.data.data
        this.showLoading = false
      }).catch(() => {})
    },
    toCollect(index) {
      if (this.questions[index].collect === true) {
        this.questions[index].collect = false
        this.$notify({
          title: '提示',
          message: '已取消收藏',
          type: 'info'
        })
      } else {
        this.questions[index].collect = true
      }
    },
    toDetele(index) {
      this.$confirm('此操作将永久删除该笔记, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeteleNote(qs.stringify({ Id: index })).then(res => {
          if (res.data.code === 0) {
            this.$message.success('删除成功...')
          } else {
            this.$message.warning('操作失败...')
          }
        }).catch(() => {})
        //
      }).catch(() => {})
    },
    toSearch() {
      if (this.search.keys === '') {
        this.getNotes()
        return
      }
      this.showLoading = true
      SearchNote(qs.stringify(this.search)).then(res => {
        this.notes = res.data.data
        this.showLoading = false
      }).catch(() => {})
    },
    clickfun(e) {
      var p = e.currentTarget.previousElementSibling.firstElementChild
      if (p.style.maxHeight === '1000px') {
        p.style.maxHeight = '200px'
        e.currentTarget.style.transform = ''
      } else {
        p.style.maxHeight = '1000px'
        e.currentTarget.style.transform = 'rotate(180deg)'
      }
    }
  },
  mounted() {
    this.getNotes()
  }
}
</script>


<style scopd>
.ques-list .ques-list_item .ques_box{
  padding-top: 40px;
}
</style>
