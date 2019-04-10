<template>
  <div class="app-container">
    <span class="header-title">我的收藏</span>
    <!-- <div class="crumbs disNone">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 错题本</el-breadcrumb-item>
          <el-breadcrumb-item>我的收藏</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div class="big-box1200">
      <div class="list-gbtn">
        <div>我的收藏
        </div>
        <div>
          <el-button icon="el-icon-refresh" circle @click="getCollects"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="showDelete=!showDelete"></el-button>
        </div>
      </div>
      <div class="container">
        <div v-show="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div v-show="!collects[0] && !showLoading" class="loading-box">
          <i class="el-icon-search"></i>
          空空如也...
        </div>
        <div class="ques-list">
          <div class="ques-list_item" v-for="(item,index) in collects" :key="index">
            <div class="ques_box">
              <span v-show="showDelete" @click="toCollect(index)" >
                <svg-icon
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
                <svg-icon class-name='international-icon' icon-class="zan" /><span class="ques_footer_num">{{item.Question.LikeNumber}}</span>
                <svg-icon class-name='international-icon' icon-class="collect" /><span class="ques_footer_num">{{item.Question.CollectNumber}}</span>
                <el-tag v-if="item.QuestionId==0" type="info">个人</el-tag>
                <el-tag v-if="item.QuestionId!=0 && item.MistakeId==0">官方</el-tag>
                <!-- <el-tag v-if="item.MistakeId!=0" type="warning">题友</el-tag> -->
              </div>
            </div>
          </div>
        </div>
        <div v-show="showMore" class="loading-box">
          <i class="el-icon-loading"></i>
          加载更多中...
        </div>
        <div v-show="!showMore && NoneMore" class="loading-box">
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
import {
  CollectList,
  P_toCollect
} from '@/api/toPost'

export default {
  name: 'collect',
  components: { },
  data() {
    return {
      homeTop: 0,
      ScrollTop: 0,
      showLoading: true,
      showDelete: false,
      showMore: false,
      NoneMore: false,
      collects: [],
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
      CollectList(this.$qs.stringify(this.tolist)).then(res => {
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
        P_toCollect(this.$qs.stringify(data)).then(res => {
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
        CollectList(this.$qs.stringify(this.tolist)).then(res => {
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
  padding-top: 24px;
}
</style>
