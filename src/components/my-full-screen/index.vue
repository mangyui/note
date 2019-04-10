<template>
  <div @click='click'>
    <svg-icon class-name='naver-icon' icon-class="fulls" />
    <span class="naver-text disNone">全屏</span>
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'screenfull',
  props: {
    width: {
      type: Number,
      default: 22
    },
    height: {
      type: Number,
      default: 22
    },
    fill: {
      type: String,
      default: '#48576a'
    }
  },
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 18px;
  height: 18px;
  vertical-align: 10px;
}
</style>
