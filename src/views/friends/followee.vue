<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 题友</el-breadcrumb-item>
          <el-breadcrumb-item>关注的人</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="">
      <el-row :gutter="12">
        <el-col  :xs="12" :sm="12" :md="8" :lg="6" :xl="6" v-for="(item,index) in friends" :key="index">
          <el-card class="friend-box" :body-style="{ padding: '0px' }"  shadow="hover">
            <div>
              <div class="friend-top" :style="{backgroundImage:'url(' + top_bg + ')'}"><div class="top_bg"></div></div>
              <span @click="toAttention(index)" >
                <nx-svg-icon
                  class-name='international-icon icon-collect'
                  :style="item.attention==true?'color: #F56C6C':''"
                  icon-class="collect" />
              </span>
              <router-link  to='/user/others/1'>
                <div class="friend-body">
                  <img src="#" :src="item.avatar">
                  <b>{{item.name}}</b>
                  <p>{{item.introduction}}</p>
                </div>
              </router-link>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  getFriendList
} from '@/api/toget'

import nxSvgIcon from '@/components/nx-svg-icon/index'

export default {
  name: 'followee',
  components: { nxSvgIcon },
  data() {
    return {
      top_bg: './static/img/box_bg.jpg',
      friends: []
    }
  },
  methods: {
    getFriends() {
      getFriendList().then(res => {
        this.friends = res.data
      }).catch(() => {})
      this.loading = false
    },
    toAttention(index) {
      if (this.friends[index].attention === true) {
        this.friends[index].attention = false
        this.$notify({
          title: '提示',
          message: '已取消关注',
          type: 'info'
        })
      } else {
        this.friends[index].attention = true
        this.$notify({
          title: '提示',
          message: '已关注对方',
          type: 'success'
        })
      }
    }
  },
  mounted() {
    this.getFriends()
  }

}
</script>

<style lang="scss" scoped>

</style>
