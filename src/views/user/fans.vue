<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 题友</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs v-model="activeName" class='is_stretch' >
      <el-tab-pane name="followee">
        <div slot="label"><i class="el-icon-date"></i>关注的人</div>
          <div class="">
            <el-row :gutter="12">
              <el-col  :xs="12" :sm="12" :md="8" :lg="6" :xl="6" v-for="(item,index) in Followees" :key="index">
                <el-card class="friend-box" :body-style="{ padding: '0px' }"  shadow="hover">
                  <div>
                    <div class="friend-top" :style="{backgroundImage:'url(' + top_bg + ')'}"><div class="top_bg"></div></div>
                    <span @click="toAttention(index)" >
                      <nx-svg-icon
                        class-name='international-icon icon-collect'
                        style="color: #F56C6C"
                        icon-class="collect" />
                    </span>
                    <router-link  :to="'/user/others/'+item.User.Id">
                      <div class="friend-body">
                        <img src="#" :src="item.User.Avatar||deAvatar">
                        <b>{{item.User.Name|| '匿名'}}</b>
                        <p>{{item.User.Intro||'这个家伙很懒，什么都没留下'}}</p>
                      </div>
                    </router-link>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
      </el-tab-pane>
      <el-tab-pane name="fans">
        <div slot="label"><i class="el-icon-date"></i>粉丝</div>
        <div class="">
          <el-row :gutter="12">
            <el-col  :xs="12" :sm="12" :md="8" :lg="6" :xl="6" v-for="(item,index) in Fans" :key="index">
              <el-card class="friend-box" :body-style="{ padding: '0px' }"  shadow="hover">
                <div>
                  <div class="friend-top" :style="{backgroundImage:'url(' + top_bg + ')'}"><div class="top_bg"></div></div>
                  <!-- <span @click="toAttention(index)" >
                    <nx-svg-icon
                      class-name='international-icon icon-collect'
                      :style="item.attention==true?'color: #F56C6C':''"
                      icon-class="collect" />
                  </span> -->
                  <router-link  :to="'/user/others/'+item.User.Id">
                    <div class="friend-body">
                      <img src="#" :src="item.User.Avatar||deAvatar">
                      <b>{{item.User.Name|| '匿名'}}</b>
                      <p>{{item.User.Intro||'这个家伙很懒，什么都没留下'}}</p>
                    </div>
                  </router-link>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  GetFans,
  GetFollowee,
  P_toFollowee
} from '@/api/toPost'

import qs from 'qs'

import nxSvgIcon from '@/components/nx-svg-icon/index'

export default {
  name: 'fans',
  components: { nxSvgIcon },
  data() {
    return {
      id: '',
      top_bg: './static/img/box_bg.jpg',
      deAvatar: './static/img/avatar.jpg',
      activeName: 'followee',
      Fans: [],
      Followees: []
    }
  },
  methods: {
    getTiyou() {
      GetFans(qs.stringify({ UserId: this.id })).then(res => {
        this.Fans = res.data.data
      }).catch(() => {})
      GetFollowee(qs.stringify({ UserId: this.id })).then(res => {
        this.Followees = res.data.data
      }).catch(() => {})
      this.loading = false
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
      P_toFollowee(qs.stringify(data)).then(res => {
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
      this.id = this.$route.params.id
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
