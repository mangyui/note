<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="note_details">
      <div class="page-content">
        <div class="detail-top">
          <el-tag>数学</el-tag>
          <el-button class="de-more" size="medium">更多相似</el-button>
        </div>
        <h2>题目</h2>
        <div class="sys-notes">
          该部分组件为本系统自行开发的组件（包括对第三方组件的封装），不包括纯粹的第三方组件。系统组件仅为通用的大众化组件，需注意和项目组件进行区分。全部系统组件文件位于 src/components/platformCom
        </div>
        <div class="sys-section">
          <div class="title">
            <div class="answer_item_top">
              <div class="ques_header">
                <router-link to="/user/others/1">
                  <img :src="user.avatar">
                </router-link>
                <div class="header_right">
                  <b>{{user.name}}</b>
                </div>
              </div>
            </div>
          </div>
          <div class="sys-article">
            <p>系统组件默认使用全局注册，无需再次引入。如果需要按需引入，只需在
              <span class="inline">src/main.js</span>中取消对全局组件的引入即可。如下所示</p>
            <p class="sys-pre">
              import Vue from "vue"
              import VueRouter from 'vue-router'
              ...
          -   // 全局组件
          -   import './components/platformCom/install'
              ...
             </p>
            <p>如果需要取消部分全局组件的应用，则修改
              <span class="inline">src/components/platformCom/install.js</span>的引入组件即可</p>
          </div>
        </div>
        <div class="toNum">
          <div>
            <nx-svg-icon class-name='qu-icon' icon-class="zan" /><span>666</span>
          </div>
          <div>
            <nx-svg-icon class-name='qu-icon' icon-class="collect" /><span>6</span>
          </div>
        </div>
        <div class="sys-section">
          <div class="title">
            <strong>更多题友解答</strong>
          </div>
          <div class="answer_item" v-for="(item,index) in 1" :key="index">
            <div class="answer_item_top">
              <div class="ques_header">
                <router-link to="/user/others/1">
                  <img :src="user.avatar">
                </router-link>
                <div class="header_right">
                  <b>{{user.name}}</b>
                </div>
              </div>
            </div>
            <router-link to="/home/other_answer/2">
              <div class="sys-article item-article">
                <p>系统组件主要分为三大类</p>
                <p>功能类：以实现具体功能为主，包括对第三方组件的二次封装类，尽量不要修改。</p>
                <p>布局类：以常用布局为主，包括标题、间距、搜索之类的纯布局组件，可按实际项目要求修改</p>
                <p>辅助类：文档辅助说明及其他组件部分，可能不会应用在正式产品中，该类别可以不引入到正式产品中</p>
              </div>
            </router-link>
            <div class="sys_footer">
              <span>
                <nx-svg-icon class-name='sys_footer_icon' icon-class="zan" /><span class="ques_footer_num">66</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'

export default {
  name: 'other_answer',
  components: { nxSvgIcon },
  data() {
    return {
      user: this.$store.getters
    }
  },
  methods: {
    handleChange(val) {
      console.log(val)
    }
  },
  mounted() {}
}
</script>

<style scoped lang="scss">
    @import '../../styles/details.scss';
.sys-section{
  margin-top: 20px;
}
</style>
