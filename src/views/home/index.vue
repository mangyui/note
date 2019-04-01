<template>
  <div class="home-container">
    <div class="big-box1200">
      <router-link to="/home/search" class="disNone">
        <el-button class="top-btn_search" round icon="el-icon-search" :size="screenWidth>770?'':'small'" :style="screenWidth>770?'':'border:0'">搜索</el-button>
      </router-link>
      <div class="top-camera toShow">
        <router-link to="/todo/addMistake">
          <div class="icon-wrap">
            <div class="light"></div>
            <nx-svg-icon class-name='icon-camera' icon-class="add" />
            <b>错题添加</b>
          </div>
        </router-link>
      </div>
      <div class="home-box">
        <!-- <div class="bg_updown"><img :src="bg1"/></div>
        <div class="bg_updown"><img :src="bg2"/></div> -->
        <div class="home-top">
            <div class="home_item">
              <router-link to="/SQu/index">
                <nx-svg-icon class-name='more_icon' style="color:#52bab5" icon-class="camera3" />
                <p>拍照搜题</p>
              </router-link>
            </div>
            <div class="home_item disNone">
              <router-link to="/todo/addMistake">
                <nx-svg-icon class-name='more_icon' style="color:#F56C6C" icon-class="add" />
                <p>添加错题</p>
              </router-link>
            </div>
            <div class="home_item toShow">
              <router-link to="/toques/quesList">
                <nx-svg-icon class-name='more_icon' style="color:#F56C6C" icon-class="cuoti" />
                <p>我的错题</p>
              </router-link>
            </div>
            <div class="home_item">
              <router-link to="/todo/edit">
                <nx-svg-icon class-name='more_icon' style="color:#409EFF" icon-class="form" />
                <p>添加笔记</p>
              </router-link>
            </div>
            <div class="home_item">
              <!-- <div @click="toQidai"> -->
              <router-link to="/getTest/index">
                <nx-svg-icon class-name='more_icon' style="color:#fdb75b" icon-class="shijuan" />
                <p>生成试题</p>
              </router-link>
            </div>
          <!-- <div class="top-search">
            <el-input placeholder="搜索题目"></el-input>
            <el-button type="primary" icon="el-icon-search" v-on:click=""></el-button>
          </div> -->
        </div>
      </div>
      <div>
        <div v-if="!showLoading && !questions[0]" class="loading-box">
          <i class="el-icon-search"></i>
          空空如也...
        </div>
        <!-- <h4 class="home-h4" v-if="myques[0]">最近错题</h4>
        <myquex-box :option="myques"></myquex-box> -->
        <h4 class="home-h4" v-if="notes[0]"><i class="el-icon-star-off"></i> 最近笔记 <i class="el-icon-star-off"></i></h4>
        <note-box :option="notes"></note-box>
        <h4 class="home-h4" v-if="questions[0]"><i class="el-icon-star-off"></i> 推荐题目 <i class="el-icon-star-off"></i></h4>
        <quex-box :option="questions"></quex-box>
        <div v-if="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'
import {
  getRecommend
} from '@/api/toget'
import quexBox from '@/components/my-box/quex-box'
import noteBox from '@/components/my-box/note-box'
export default {
  name: 'home',
  components: {
    nxSvgIcon,
    quexBox,
    noteBox
  },
  data() {
    return {
      homeTop: 0,
      screenWidth: document.body.clientWidth,
      questions: [],
      notes: [],
      myques: [],
      type: '',
      showLoading: true
    }
  },
  activated() {
    document.querySelector('.app-main').scrollTop = this.homeTop || 0
    // console.log(this.homeTop)
    // this.getNotes()
  },
  beforeRouteLeave(to, from, next) {
    this.homeTop = document.querySelector('.app-main').scrollTop || 0
    next()
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     vm.getNotes()
  //   })
  // },
  methods: {
    // loadmore() {
    //   console.log('11')
    //   this.getNotes()
    // },
    getNotes() {
      if (this.$store.getters.user.Id) {
        getRecommend(this.$store.getters.user.Id).then(res => {
          this.questions = res.data.data.Questions
          this.notes = res.data.data.Notes
          this.showLoading = false
        }).catch(() => {
          console.log('获取数据失败！')
          this.showLoading = false
        })
      } else {
        getRecommend().then(res => {
          this.questions = res.data.data
          // this.notes = res.data.data.Notes
          this.showLoading = false
        }).catch(() => {
          console.log('获取数据失败！')
          this.showLoading = false
        })
      }
    },
    toQidai() {
      this.$alert('敬请期待...', '生成练习', {
        confirmButtonText: '确定'
      })
    }
    // handleScroll(e) {
    //   var scrollTop = e.target.scrollTop
    //   var windowHeight = e.target.clientHeight
    //   var scrollHeight = e.target.scrollHeight
    //   if (scrollTop > windowHeight && scrollTop + windowHeight === scrollHeight) {
    //     console.log(scrollTop, windowHeight, scrollHeight)
    //     this.loadmore()
    //   }
    // }
  },
  mounted() {
    // window.addEventListener('scroll', this.handleScroll, true)
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
  },
  created() {
    this.getNotes()
  },
  deactivated() {
    // console.log('deactivated')
  }
}
</script>


