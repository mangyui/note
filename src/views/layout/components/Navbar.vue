<template>
  <el-menu :id="isUsercenter==true&&ScrollTop<120?'user_head':''" class="navbar" mode="horizontal">
    <nx-hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></nx-hamburger>
    <nx-breadcrumb class="breadcrumb-container"></nx-breadcrumb>
    <span v-if="isBack" class="goback toShow" @click="goBack">
      <i class="el-icon-arrow-left"></i>
    </span>
    <span class="goback toShow" onclick="location.reload()">
      <i class="el-icon-refresh"></i>
    </span>
    <router-link v-if="!isBack" id="BTN" to="/home/search" class="toShow">
      <el-button class="top-btn_search" round icon="el-icon-search" size="small" style=" margin-left:10px;border:0; position: relative;top: -3px;">搜索</el-button>
    </router-link>
    <div class="right-menu disNone">
      <actor-select v-if="isTeacher" class="nx-help right-menu-item disNone" />

      <nx-message v-if="user.Id" class="nx-help right-menu-item disNone" />
      <nx-mobile class="nx-help right-menu-item disNone"></nx-mobile>
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
          <router-link to="/login">
            <el-dropdown-item v-if="!user.Name">
                <span style="display:block;">登录</span>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <nx-full-screen class="screenfull right-menu-item"></nx-full-screen>
          </el-dropdown-item>
          <el-dropdown-item>
            <nx-lang-select class="international right-menu-item"></nx-lang-select>
          </el-dropdown-item>
          <span @click="logout">
            <el-dropdown-item v-if="user.Name" divided>
              <span style="display:block;">登出</span>
            </el-dropdown-item>
          </span>
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
import actorSelect from '@/components/comps/actor-select'

export default {
  name: 'navBar',
  components: {
    nxBreadcrumb,
    nxHamburger,
    nxMessage,
    nxLangSelect,
    nxFullScreen,
    nxMobile,
    actorSelect
  },
  data() {
    return {
      user: this.$store.getters.user,
      isTeacher: this.$store.getters.user.Occupation === 1 || this.$store.getters.user.Name === 'ming',
      isBack: false,
      isUsercenter: false,
      ScrollTop: 0,
      whiteList: [
        '/home/index',
        '/SQu/index', // 拍照搜题
        '/more/index', // 更多
        '/merchant/index', // 商家
        '/about/index', // 关于帮助
        '/home/search', // 搜索页
        '/tonote/noteList',
        '/toques/collect',
        '/toques/quesList'
      ]
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
      this.$store.dispatch('LogOut')
      location.reload()
    },
    fetchDate() {
      if (this.$route.path === '/home/index') {
        this.isBack = false
      } else {
        this.isBack = true
      }
      if (this.$route.path === '/user/index') {
        this.isUsercenter = true
      } else {
        this.isUsercenter = false
      }
    },
    goBack() {
      if (this.whiteList.indexOf(this.$route.path) !== -1) {
        this.$router.push({
          path: '/home/index'
        })
      } else {
        this.$router.go(-1)
      }
    },
    onScroll() {
      var scrollTop = document.querySelector('.app-main').scrollTop
      this.ScrollTop = scrollTop
      // console.log(this.ScrollTop)
    }
  },
  watch: {
    $route: 'fetchDate'
  },
  created() {
    this.fetchDate()
  },
  mounted() {
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
    // console.log(this.user)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.goback{
  display: inline-block;
  height: 100%;
  width: 45px;
  text-align: center;
  line-height: 51px;
  color: #fff;
  &:focus{
    outline: none;
  }
  i{
    font-size: 19px;
    font-weight: bold;
  }
}
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
