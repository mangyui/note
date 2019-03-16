<template>
  <div class="app-container">
    <span class="header-title">关于vNote</span>
    <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 关于vNote</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="about-top">
      <img src="../../assets/images/home/logo.png" width="100px" height="100px" alt="logo" style="vertical-align: middle;" />
      <b>vNote</b>
      <i>V {{version}}</i>
    </div>
    <div>
      <div class="el-collapse-item__header" @click="toUp">
        版本更新<span v-if="isup" class="el-badge__content">new</span><span class="spanText">{{text}}</span>
      </div>
      <el-collapse>
        <el-collapse-item title="功能介绍" name="2">
          <ul>
            <li>vNote 响应式布局，PC端和移动端都支持。</li>
            <li>在这里你可以记录和管理你的笔记错题。</li>
            <li>笔记整理</li>
            <li>错题整理。</li>
            <li>语音识别。</li>
            <li>拍照搜题。</li>
            <li>智能推荐。</li>
            <li>下载试题。</li>
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
export default {
  name: 'about',
  data() {
    return {
      version: '1.0.6',
      isup: false,
      text: '已是最新版本',
      upUrl: 'https://dn-coding-net-production-file.codehub.cn/e415d970-4725-11e9-8fcf-a1ca3c5c1ac9.vnd.android.package-archive?attname=vNote_1.0.6.apk&e=1552659982&token=goE9CtaiT5YaIP6ZQ1nAafd_C1Z_H2gVP8AwuC-5:Xe6-aiKxTGH9Z5TNnazoCjh46og='
    }
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
        this.$alert('当前已是最新版本', '提醒', {
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
