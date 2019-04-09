<template>
  <div>
    <el-button class="btn-text can-hover" type="text" @click="handleClick">
      <nx-svg-icon class-name='naver-icon' icon-class="mobile" />
      <span class="naver-text" style="">手机端</span>
    </el-button>
  </div>
</template>

<script>
// import { getVersion } from '@/api/version'
import nxSvgIcon from '@/components/nx-svg-icon/index'

export default {
  name: 'mobile',
  components: { nxSvgIcon },
  data() {
    return {
      url: 'https://coding.net/api/share/download/e332e8a5-78c6-43a7-8396-73986989aff7'
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
    color: #52bab5;
  }
}
</style>
