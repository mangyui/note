<template>
  <div class="">
    <div class="big-box1200">
      <router-link to="/todo/edit/1">
        <el-button class="top-btn_edit" round icon="el-icon-edit" :size="screenWidth>770?'':'small'" :style="screenWidth>770?'':'border:0'">写笔记</el-button>
      </router-link>
      <router-link to="/home/search">
        <el-button class="top-btn_search" round icon="el-icon-search" :size="screenWidth>770?'':'small'" :style="screenWidth>770?'':'border:0'">搜索</el-button>
      </router-link>
      <div class="top-camera toShow">
        <router-link to="/SQu/index">
          <div class="icon-wrap">
            <div class="light"></div>
            <nx-svg-icon class-name='icon-camera' icon-class="camera3" />
            <b>拍照搜题</b>
          </div>
        </router-link>
      </div>
      <div class="home-top">
        <el-select  v-model="type" placeholder="选择类型">
          <el-option label="数学" value="type1"></el-option>
          <el-option label="语文" value="type2"></el-option>
          <el-option label="其他" value="type3"></el-option>
        </el-select>
        <!-- <div class="top-search">
          <el-input placeholder="搜索题目"></el-input>
          <el-button type="primary" icon="el-icon-search" v-on:click=""></el-button>
        </div> -->
      </div>
      <quex-box :option="questions"></quex-box>
    </div>
  </div>
</template>


<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'
import {
  getRecommend
} from '@/api/toget'
import quexBox from '@/components/my-box/quex-box'

export default {
  name: 'home',
  components: {
    nxSvgIcon,
    quexBox
  },
  data() {
    return {
      screenWidth: document.body.clientWidth,
      questions: [],
      type: ''
    }
  },
  methods: {
    getNotes() {
      getRecommend().then(res => {
        this.questions = res.data.data.Questions
      }).catch(() => {
        console.log('获取数据失败！')
      })
    }
  },
  mounted() {
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
    console.log('deactivated')
  }
}
</script>

<style lang="scss" scoped>
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
  display: flex;
  max-width: 100%;
  justify-content: space-between;
  margin:0px auto 50px;
  flex-direction:row-reverse;
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
}
@media (max-width: 768px)
{
  .home-top {
    margin: 0;
    padding: 10px 5px 24px;
    background: linear-gradient(to bottom, #52bab5, #ffffff);
  }
}
</style>
