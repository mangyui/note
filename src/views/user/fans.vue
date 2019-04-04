<template>
  <div class="app-container">
    <span class="header-title">题友</span>
    <div class="big-box1200">
      <el-tabs v-model="activeName" class='is_stretch' >
        <el-tab-pane name="followee">
          <div slot="label"><i class="el-icon-date"></i>关注的人</div>
            <div class="">
              <div v-if="showLoading" class="loading-box">
                <i class="el-icon-loading"></i>
                加载中...
              </div>
              <div v-if="!Followees[0] && !showLoading" class="loading-box">
                <i class="el-icon-search"></i>
                空空如也...
              </div>
              <customer-box :option="Followees"></customer-box>
            </div>
        </el-tab-pane>
        <el-tab-pane name="fans">
          <div slot="label"><i class="el-icon-date"></i>粉丝</div>
          <div class="">
            <div v-if="showLoading" class="loading-box">
              <i class="el-icon-loading"></i>
              加载中...
            </div>
            <div v-if="!Fans[0] && !showLoading" class="loading-box">
              <i class="el-icon-search"></i>
              空空如也...
            </div>
            <customer-box :option="Fans"></customer-box>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  GetFans,
  GetFollowee,
  P_toFollowee
} from '@/api/toPost'

import nxSvgIcon from '@/components/nx-svg-icon/index'
import customerBox from '@/components/my-box/customer-box'

export default {
  name: 'fans',
  components: {
    nxSvgIcon,
    customerBox
  },
  data() {
    return {
      showLoading: false,
      id: '',
      activeName: 'followee',
      Fans: [],
      Followees: []
    }
  },
  methods: {
    getTiyou() {
      this.showLoading = true
      GetFans(this.$qs.stringify({ UserId: this.id })).then(res => {
        this.Fans = res.data.data
        this.showLoading = false
      }).catch(() => {})
      GetFollowee(this.$qs.stringify({ UserId: this.id })).then(res => {
        this.Followees = res.data.data
        this.showLoading = false
      }).catch(() => {})
    },
    toAttention(index) {
      if (!this.$store.getters.user.Id) {
        this.$confirm('你还没有登录，不能进行该操作！前往登录', '提示', {
          confirmButtonText: '立即登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {})
        return
      }
      var data = {
        FolloweeId: index,
        UserId: this.$store.getters.user.Id
      }
      P_toFollowee(this.$qs.stringify(data)).then(res => {
        if (res.data.data === -1) {
          this.$notify({
            title: '提示',
            message: '已取消关注',
            type: 'info'
          })
        }
        this.fetchDate()
      }).catch(() => {
        this.$message.warning('操作失败...')
      })
    },
    fetchDate() {
      this.id = this.$store.getters.user.Id
      if (this.id) {
        this.getTiyou()
      }
    }
  },
  created() {
    this.fetchDate()
  }
}
</script>

<style lang="scss" scoped>

</style>
