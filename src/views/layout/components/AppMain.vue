<template>
  <section :id="key=='/user/index'?'user_body':''" class="app-main">
    <!-- <div class="bg-warp">
      <span class="bg_item bg_item1"></span>
      <span class="bg_item bg_item2"></span>
      <span class="bg_item bg_item3"></span>
      <span class="bg_item bg_item4"></span>
      <span class="bg_item bg_item5"></span>
    </div> -->
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
  }
  // 监听路由，使每次更换页面都滚动到顶部
  // watch: {
  //   $route(to, from) {
  //     // var ele = document.querySelector('.app-main')
  //     // ele.scrollTop = '0px'
  //     $('body>ul').remove()
  //     $('body>div').not('#app,.pswp').remove()
  //     // this.$previewRefresh()
  //     // this.rou = to
  //     // console.log(this.rou)
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.bg-warp{
  position: fixed;
  z-index: 0;
  height: 100%;
  width: 100%;
  .bg_item{
    display: inline-block;
    position: absolute;
    background-color: #56d4ce;
    border-radius: 100px;
    transform: rotate(30deg)
  }
  .bg_item1{
    width: 25px;
    height: 100px;
    top: 10%;
    left: 6%;
    opacity: 0.5;
  }
  .bg_item2{
    width: 25px;
    height: 150px;
    top: 20%;
    left: 90%;
    opacity: 0.8;
  }
  .bg_item3{
    width: 25px;
    height: 190px;
    top: 30%;
    left: 0%;
    opacity: 0.7;
  }
  .bg_item4{
    width: 25px;
    height: 120px;
    top: 60%;
    left: 50%;
    opacity: 0.9;
  }
  .bg_item5{
    width: 25px;
    height: 180px;
    top: 80%;
    left: 70%;
    opacity: 0.6;
  }
}
</style>
