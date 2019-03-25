<template>
  <section :id="key=='/user/index'?'user_body':''" class="app-main">
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      rou: this.$route,
      ScrollTop: 0
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  },
  // 监听路由，使每次更换页面都滚动到顶部
  watch: {
    $route(to, from) {
      var ele = document.querySelector('.app-main')
      ele.scrollTop = '0px'
      $('body>ul').remove()
      $('body>div').not('#app,.pswp').remove()
      // this.$previewRefresh()
      // this.rou = to
      // console.log(this.rou)
    }
  }
}
</script>
