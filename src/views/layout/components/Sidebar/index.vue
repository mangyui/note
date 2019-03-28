<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <logo :isCollapse="isCollapse"></logo>
    <div class="user_center">
      <router-link  :to="user.Id?'/user/index':'/login'" class="avatar"><img :src="avatar"></router-link>
      <div>
        <p class="user_name">{{user.Name||'未登录'}}</p>
        <p  v-if="user.Id" class="user_address">学生</p>
      </div>
    </div>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#52bab5"
      text-color="white"
      active-text-color="#fff"
    >
    <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
    <div class="systom-group toShow">
      <div @click="logout">
        <div style="height:27px">
          <nx-svg-icon icon-class="logout"/>
        </div>
        <p>{{user.Id?'登出':'登录'}}</p>
      </div>
      <div>
        <nx-lang-select class="" style="height:27px"></nx-lang-select>
        <p>语言</p>
      </div>
      <div>
        <nx-full-screen class="" style="height:27px"></nx-full-screen>
        <p>全屏</p>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import logo from './logo'
import store from '@/store'
import nxFullScreen from '@/components/nx-full-screen/index'
import nxLangSelect from '@/components/nx-lang-select/index'
import nxSvgIcon from '@/components/nx-svg-icon/index'
export default {
  components: {
    SidebarItem,
    logo,
    nxLangSelect,
    nxFullScreen,
    nxSvgIcon
  },
  data() {
    return {
      user: this.$store.getters.user,
      avatar: this.$store.getters.user.Avatar || './static/img/avatar.jpg'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_routers'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    logout() {
      if (this.user.Id) {
        this.$store.dispatch('LogOut')
        location.reload()
      } else {
        this.$router.push({
          path: '/login'
        })
      }
    }
  },
  created() {
    store.dispatch('GenerateRoutes').then(() => {
    })
  }
}
</script>

<style scoped>
#app .el-scrollbar{
  background: #52bab5;
}
#app .el-menu{
  height: auto;
  margin-bottom: 75px;
}
.user_center {
  text-align: center;
  padding: 5px 5px 10px;
  background: #52bab5;
  min-width: 180px;
  margin-top: -1px
}
.avatar img {
  width: 100%;
}
#app .user_center .avatar {
  display: block!important;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #fff;
  overflow: hidden;
  margin: 0 auto;
}
.user_name{
  font-size: 17px;
  color: #fff;
  margin: 10px 0 8px;
}
.user_address {
  font-size: 12px;
  color: #ddd;
  margin: 5px 0;
}
</style>
