<template>
  <el-menu class="navbar" mode="horizontal">
    <nx-hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></nx-hamburger>
    <nx-breadcrumb class="breadcrumb-container"></nx-breadcrumb>

    <div class="right-menu">
      <nx-mobile class="nx-help right-menu-item disNone"></nx-mobile>

      <nx-message class="nx-help right-menu-item disNone" />

      <nx-lang-select class="international right-menu-item"></nx-lang-select>

      <nx-full-screen class="screenfull right-menu-item"></nx-full-screen>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
        <!-- <img class="user-avatar" :src="user.avatar"> -->
          <i class="el-icon-more"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link v-if="user.Name" to="/user/index">
            <el-dropdown-item>
              我的主页
            </el-dropdown-item>
          </router-link>
          <!-- <a target='_blank' href="https://github.com/mangyui">
            <el-dropdown-item>
              github地址
            </el-dropdown-item>
          </a> -->
          <el-dropdown-item v-if="user.Name" divided>
            <span @click="logout" style="display:block;">登出</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="!user.Name">
            <router-link to="/login">
              <span @click="logout" style="display:block;">登录</span>
            </router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'

import nxBreadcrumb from '@/components/nx-breadcrumb'
import nxHamburger from '@/components/nx-hamburger'
import nxMessage from '@/components/nx-message/index'
import nxFullScreen from '@/components/nx-full-screen/index'
import nxLangSelect from '@/components/nx-lang-select/index'
import nxMobile from '@/components/nx-mobile'

export default {
  name: 'navBar',
  components: {
    nxBreadcrumb,
    nxHamburger,
    nxMessage,
    nxLangSelect,
    nxFullScreen,
    nxMobile
  },
  data() {
    return {
      user: this.$store.getters.user
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  },
  mounted() {
    console.log(this.user)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .nx-help {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 10px;
    }
    .screenfull {
      height: 50px;
      vertical-align: top;
      line-height: 77px;
      &:hover .screenfull-svg{
        fill: #52bab5;
      }
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 16px;
      &:hover{
        color: #52bab5;
      }
      .avatar-wrapper {
        cursor: pointer;
        font-size: 28px;
        position: relative;
        .user-avatar {
          width: 36px;
          height: 36px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
