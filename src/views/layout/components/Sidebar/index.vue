<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <logo :isCollapse="isCollapse"></logo>
    <div class="user_center">
      <router-link  to="/user/index" class="avatar"><img :src="user.avatar"></router-link>
      <div>
        <p class="user_name">{{user.name}}</p>
        <p class="user_address">江西 | 学生</p>
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
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import logo from './logo'
import store from '@/store'
export default {
  components: { SidebarItem, logo },
  data() {
    return {
      user: this.$store.getters
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
  margin-bottom: 50px;
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
