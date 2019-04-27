<template>
  <div>
    <el-button class="btn-text can-hover" type="text" @click="handleClick">
      <svg-icon class-name='naver-icon' icon-class="mobile" />
      <span class="naver-text" style="">手机端</span>
    </el-button>
  </div>
</template>

<script>

export default {
  name: 'mobile',
  data() {
    return {
      url: ''
    }
  },
  methods: {
    handleClick() {
      window.open(this.url)
    },
    toMobile() {
      // getVersion().then(res => {
      //   this.url = res.data.url
      // }).catch(() => {})
    }
  },
  created() {
    this.toMobile()
  }
}
</script>


<style lang="scss" scoped>
.link {
  color: #FFF;
  text-decoration: none;
}
.el-button{
  font-size: 18px;
  &:hover{
    color: rgba(84, 93, 206,0.9);
  }
}
</style>
