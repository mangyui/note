<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n' // 中英文
import {
  setTitle
} from '@/utils/util' // 设置浏览器头部标题
export default {
  name: 'App',
  mounted() {
  },
  methods: {
    generateTitle
  },
  watch: {
    $route(to, from) {
      // console.log(to)
      setTimeout(() => {
        setTitle(this.generateTitle(to.meta.title) + ' - vNote')
      }, 0)
    }
  }
}

</script>
<style lang="scss">
  // 手机端
  @import "src/styles/app.scss";
</style>
