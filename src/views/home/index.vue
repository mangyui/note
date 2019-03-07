<template>
  <div ref="scoll-home" class="">
    <div class="big-box1200">
      <!-- <router-link to="/todo/edit/1">
        <el-button class="top-btn_edit" round icon="el-icon-edit" :size="screenWidth>770?'':'small'" :style="screenWidth>770?'':'border:0'">写笔记</el-button>
      </router-link>
      <router-link to="/home/search">
        <el-button class="top-btn_search" round icon="el-icon-search" :size="screenWidth>770?'':'small'" :style="screenWidth>770?'':'border:0'">搜索</el-button>
      </router-link> -->
      <div class="top-camera toShow">
        <router-link to="/SQu/index">
          <div class="icon-wrap">
            <div class="light"></div>
            <nx-svg-icon class-name='icon-camera' icon-class="camera3" />
            <b>拍照搜题</b>
          </div>
        </router-link>
      </div>
      <div class="home-box">
        <div class="home-top">
            <div class="home_item">
              <router-link to="/SQu/index">
                <nx-svg-icon class-name='more_icon' style="color:#F56C6C" icon-class="theme" />
                <p>拍照搜题</p>
              </router-link>
            </div>
            <div class="home_item">
              <router-link to="/todo/edit/1">
                <nx-svg-icon class-name='more_icon' style="color:#52bab5" icon-class="theme" />
                <p>添加笔记</p>
              </router-link>
            </div>
            <div class="home_item">
              <router-link to="/">
                <nx-svg-icon class-name='more_icon' style="color:#409EFF" icon-class="theme" />
                <p>我的错题</p>
              </router-link>
            </div>
            <div class="home_item">
              <router-link to="/home/search">
                <nx-svg-icon class-name='more_icon' style="color:#409EFF" icon-class="theme" />
                <p>查找题目</p>
              </router-link>
            </div>
          <!-- <div class="top-search">
            <el-input placeholder="搜索题目"></el-input>
            <el-button type="primary" icon="el-icon-search" v-on:click=""></el-button>
          </div> -->
        </div>
      </div>
      <div>
        <h4 v-if="notes[0]">最近笔记</h4>
        <note-box :option="notes"></note-box>
        <h4 v-if="questions[0]">最近错题</h4>
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
      screenWidth: document.body.clientWidth,
      questions: [],
      notes: [],
      type: '',
      showLoading: true
    }
  },
  methods: {
    // loadmore() {
    //   console.log('11')
    //   this.getNotes()
    // },
    getNotes() {
      getRecommend().then(res => {
        this.questions = this.questions.concat(res.data.data.Questions)
        this.notes = res.data.data.Notes
        this.showLoading = false
      }).catch(() => {
        console.log('获取数据失败！')
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

<style lang="scss" scoped>

.home_item{
  color: #444;
  height: 60px;
  width: 80px;
  text-align: center;
  padding-top: 10px;
  .more_icon{
    width: 2em;
    height: 2em;
  }
  p{
    font-size: 14px;
    line-height: 1.8em
  }
}
.big-box1200{
  position: relative;
}
.top-btn_edit{
  position: absolute;
  left: 5px;
  top: 8px;
}
.top-btn_search{
  position: absolute;
  right: 5px;
  top: 8px;
}
.home-top{
  border: 1px solid #ebeef5;
  box-shadow: 0 1px 3px #dfdfdf;
  border-radius: 3px;
  background: #fff;
  display: flex;
  max-width: 100%;
  justify-content: space-around;;
  margin: 0 10px 15px;
  padding: 10px 5px 24px;
}
.top-camera{
  width: 100%;
  height: 300px;
  text-align: center;
  margin: 0 auto;
  background: #52bab5;
  .icon-wrap{
    display: inline-block;
    height: 160px;
    width: 160px;
    background: #fff;
    border-radius: 50%;
    padding: 15px;
    margin-top: 70px;
    box-shadow: 0 0 1px #444;
    position: relative;
    overflow: hidden;
    .icon-camera{
      width: 6.5em;
      height: 6.5em;
      margin-top: -3px;
      fill: #52bab5;
    }
    b{
      margin-top: -10px;
      display: block;
      font-size: 16px;
      color: #369490;;
    }
    .light{
      width: 30px;
      height: 200px;
      background: #fff;
      position: absolute;
      left: -50px;
      top: -80px;
      transform: rotate(30deg);
      animation-name: down;
      animation-duration: 4000ms;
      animation-timing-function: ease-in-out;
      animation-iteration-count:infinite;
      filter: blur(12px);
    }
  }

}
@keyframes down {
    0% {
      left: -50px;
      top: -80px;
    }
    40%{
      left: -50px;
      top: -80px;
    }
    80%{
      left: 200px;
      top: 120px;
    }
    90%{
      left: 200px;
      top: 120px;
    }
    100%{
      left: 200px;
      top: 120px;
    }
}
.top-search{
  display: flex;
  width: 450px;

  .el-input__inner{
    border-radius: 4px 0 0 4px;
    border-right: 0;
  }
  .el-button{
    border-radius: 0 4px 4px 0;
    height: 40px;
  }
}
@media (min-width: 769px){
  .big-box1200{
    margin-top: 10px;
    padding-top: 5px;
  }
  .top-btn_search{
    left: 125px;
  }
  .home-top {
    margin: 20px 0px 40px;
    padding: 28px 0px;
    .home_item{
      height: 120px;
      width: 100px;
      padding-top: 20px;
      .more_icon{
        width: 3em;
        height: 3em;
      }
      p{
        font-size: 15px;
        line-height: 2.2em
      }
    }
  }
}
@media (max-width: 768px)
{
  .home-box{
    background: linear-gradient(to bottom, #52bab5, #ffffff);
  }
}
</style>
