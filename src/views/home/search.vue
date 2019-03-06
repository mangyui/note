<template>
  <div class="">
    <div class="big-box1200">
      <div class="home-top">
        <el-select  v-model="type" placeholder="选择类型">
          <el-option label="数学" value="type1"></el-option>
          <el-option label="语文" value="type2"></el-option>
          <el-option label="其他" value="type3"></el-option>
        </el-select>
        <div class="top-search">
          <el-input placeholder="搜索题目"></el-input>
          <el-button type="primary" icon="el-icon-search" v-on:click=""></el-button>
        </div>
      </div>
      <quex-box :option="questions"></quex-box>
    </div>
  </div>
</template>


<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'
import {
  getNoteList
} from '@/api/notes'
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
      getNoteList().then(res => {
        this.questions = res.data
      }).catch(() => {})
      this.loading = false
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
.home-top{
  display: flex;
  max-width: 100%;
  justify-content: space-between;
  margin:0px auto 50px;
  flex-direction:row-reverse;
}

@media (min-width: 769px){
  .big-box1200{
    margin-top: 10px;
    padding-top: 5px;
  }
}
@media (max-width: 768px)
{
  .home-top {
    margin: 0;
    padding: 10px 5px 24px;
  }
}
</style>
