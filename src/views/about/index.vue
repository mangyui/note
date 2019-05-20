<template>
  <div class="app-container">
    <span class="header-title">关于{{website.title}}</span>
    <div class="about-top">
      <img preview src="../../assets/images/home/logo.png" width="100px" height="100px" alt="logo" style="vertical-align: middle;" />
      <b>{{website.title}}</b>
      <i>V {{version}}</i>
    </div>
    <div>
      <div style="justify-content: space-between;" class="el-collapse-item__header" @click="toUp">
        版本更新<span v-if="isup" class="el-badge__content">new</span><span class="spanText">{{text}}</span>
      </div>
      <el-collapse>
        <el-collapse-item title="功能介绍" name="2">
          <ul>
            <li v-for="item in website.info.list">&nbsp;{{item}}</li>
          </ul>
        </el-collapse-item>
      </el-collapse>
      <div class="el-collapse-item__header">
        帮助<i class="el-collapse-item__arrow el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="about-bottom">
     Copyright © 2019 - why not -
    </div>
  </div>
</template>

<script>
// import { getVersion } from '@/api/version'
// import { getHello } from '@/api/test'
import { mapGetters } from 'vuex'
export default {
  name: 'about',
  data() {
    return {
      version: '1.1.0',
      isup: false,
      text: '已是最新版本',
      upUrl: ''
    }
  },
  computed: {
    ...mapGetters(['website'])
  },
  methods: {
    toUpdate() {
      // getVersion().then(res => {
      //   var ver = res.data.version
      //   if (ver === this.version) {
      //     this.text = '已是最新版本'
      //     this.isup = false
      //   } else {
      //     this.text = '新版本 ' + ver
      //     this.isup = true
      //     this.upUrl = res.data.url
      //   }
      // }).catch(() => {})
    },
    toUp() {
      if (this.upUrl !== '') {
        this.$confirm('前往下载 Android平台 最新版本', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          window.open(this.upUrl, '_blank').location
        }).catch(() => {
        })
      } else {
        this.$alert('当前已是最新版本', '更新', {
          confirmButtonText: '知道了'
        })
      }
    },
    getApi() {
      // getHello().then(res => {
      //   console.log('1:', res.data)
      // }).catch(() => {})
    }
  },
  created() {
    this.toUpdate()
  }
}
</script>

<style lang ="scss" scoped>
.about-top{
  text-align: center;
  display: flex;
  flex-direction : column;
  justify-content: center;
  align-items: center;
  b{
    margin: 8px 0;
  }
  i{
    font-size: 14px;
    color: #444;
  }
}
.about-bottom{
  text-align: center;
  font-size: 14px;
  color: #888;
  line-height: 2em;
  margin-top: 24px;
}
.el-collapse{
  border-top: 0;
}
ul li{
  margin: 5px 0;
  color: #555;
}
.spanText{
  float: right;
  color: #888;
}
.el-badge__content{
  height: 20px;
  margin-left: 5px;
}
@media (max-width: 768px)
{
  ul{
    padding-left: 24px;
  }
}
</style>
