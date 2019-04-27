<template>
  <div>
    <div v-for="(item,index) in num" :key="index">
      <el-card shadow="never">
        <div class="big-box">
          <div class="big-body">
            <b  class="tipbox" style="width:50%"></b>
            <div><p class="tipbox big-content" ></p></div>
            <div class="tipbox" style="margin:0;    padding: 10px;"></div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'empty_box',
  data() {
    return {

    }
  },
  props: {
    num: {
      default: 3
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../styles/note_box.scss';
  .big-box{
    opacity: 0.5;
    animation-name: Bop;
    animation-duration: 1500ms;
    animation-timing-function: ease-in-out;
    animation-iteration-count:infinite;
  }
  @keyframes Bop {
    0%{
      opacity: 0.5;
    }
    50%{
      opacity: 1;
    }
    100%{
      opacity: 0.5;
    }
  }
  .el-card{
    border-color: #f5f5f5
  }
</style>
