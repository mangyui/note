<template>
  <div class="app-container">
    <span class="header-title">相关题目</span>
    <!-- <div v-if="topLoading" class="loading-box">
      <i class="el-icon-loading"></i>
      加载中...
    </div> -->
    <!-- <div class="crumbs disNone">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 相关题目</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div class="note_details">
      <div class="page-content">
        <div class="detail-top">
          <el-tag size="small" v-if="note">{{note.Category}}</el-tag>
        </div>
        <!-- <h2>题目</h2> -->
        <h3 v-if="note">《 {{note.Headline}} 》</h3>
        <!-- <div v-show="false" ref="noteContent" v-html="note.Content"></div> -->
        <div class="sys-section">
          <div class="" style="margin-bottom:20px;">
            <i class="el-icon-share"></i> <strong>相关题目</strong>
          </div>
          <quex-box :option="quesList"></quex-box>
          <div v-show="showLoading" class="loading-box">
            <i class="el-icon-loading"></i>
            加载中...
          </div>
          <div v-show="showNone" class="loading-box">
            <i class="el-icon-search"></i>
            空空如也...
          </div>
          <!-- <div v-if="showMore" class="loading-box">
            <i class="el-icon-loading"></i>
            加载更多中...
          </div>
          <div v-if="!showMore && NoneMore" class="loading-box">
            <i class="el-icon-search"></i>
            没有更多了...
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'
import quexBox from '@/components/my-box/quex-box'

import {
  // NoteDetails,
  GetQuestionsByText
} from '@/api/toPost'

export default {
  name: 'note_more',
  components: {
    nxSvgIcon,
    quexBox
  },
  data() {
    return {
      homeTop: 0,
      ScrollTop: 0,
      topLoading: true,
      showMore: false,
      showNone: false,
      NoneMore: false,
      showLoading: true,
      id: null,
      user: this.$store.getters.user,
      note: {
        Headline: '',
        Category: ''
      },
      quesList: [],
      Text: ''
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
  mounted() {
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 这里的vm指的就是vue实例，可以用来当做this使用
      // console.log(to, from, vm.$route)
      vm.id = vm.$route.query.id
      vm.Text = vm.$route.query.content
      vm.note.Headline = vm.$route.query.Headline
      vm.note.Category = vm.$route.query.Category
      // console.log(vm.$route)
      vm.getQues()
    })
  },
  methods: {
    getQues() {
      if (!this.id) {
        this.$notify({
          title: '提示',
          message: '请关闭本页面重新打开',
          type: 'info'
        })
        var close = document.querySelector('.tags-view-item.active .el-icon-close')
        close.click()
        return
      }
      this.showLoading = true
      GetQuestionsByText(this.$qs.stringify({ UserId: this.$store.getters.user.Id, Text: this.Text })).then(res => {
        this.quesList = res.data.data
        // this.$notify({
        //   title: '提示',
        //   message: '已搜索相关题目！',
        //   type: 'success'
        // })
        this.showLoading = false
      }).catch(() => {
        this.$notify({
          title: '提示',
          message: '请求错误！',
          type: 'error'
        })
        this.showLoading = false
      })
    }
    // onScroll() {
    //   var innerHeight = document.querySelector('.app-container').clientHeight
    //   var outerHeight = document.querySelector('.app-main').clientHeight
    //   var scrollTop = document.querySelector('.app-main').scrollTop
    //   this.ScrollTop = scrollTop
    //   if (innerHeight <= (outerHeight + scrollTop)) {
    //     if (this.NoneMore || this.showMore) {
    //       return
    //     }
    //     this.showMore = true
    //     this.tolist.Page++
    //     QuestionMore(qs.stringify(this.tolist)).then(res => {
    //       this.quesList = this.quesList.concat(res.data.data)
    //       this.showMore = false
    //       if (res.data.data.length < this.tolist.Number) {
    //         this.NoneMore = true
    //       } else {
    //         this.NoneMore = false
    //       }
    //     }).catch(() => {})
    //   }
    // }
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
    @import '../../styles/details.scss';
</style>
