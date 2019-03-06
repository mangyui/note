<template>
  <section class="app-main">
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
    }
  }
}
</script>
