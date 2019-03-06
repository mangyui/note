<template>
  <div>
    <el-tooltip effect="dark" placement="bottom">
      <div slot="content">
        <a class="link" :href="url" target="_blank">下载Android手机端</a>
      </div>
      <el-button class="btn-text can-hover" type="text" @click="handleClick">
        <nx-svg-icon class-name='international-icon' icon-class="mobile" />
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
import { getVersion } from '@/api/version'
import nxSvgIcon from '@/components/nx-svg-icon/index'

export default {
  name: 'nx-mobile',
  components: { nxSvgIcon },
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
      getVersion().then(res => {
        this.url = res.data.url
      }).catch(() => {})
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
