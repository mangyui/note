<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n' // 中英文
import { mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters(['website'])
  },
  watch: {
    $route(to, from) {
      // console.log(to)
      setTimeout(() => {
        setTitle(this.generateTitle(to.meta.title) + ' - ' + this.website.title)
      }, 0)
    }
  }
}

</script>
