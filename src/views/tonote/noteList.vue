<template>
  <div class="app-container notes">
    <span class="header-title">笔记本</span>
    <!-- <div class="crumbs disNone">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 笔记本</el-breadcrumb-item>
          <el-breadcrumb-item>笔记列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div class="big-box1200">
      <!--工具条-->
      <div class="top-search">
        <el-input
          placeholder="请输入内容"
          @keyup.enter.native="toSearch"
          v-model="search.keys">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="list-gbtn">
        <el-select v-model="tolist.NoteCategoryId" placeholder="笔记分类" @change="getNotes">
          <el-option
            v-for="item in typelist"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id">
          </el-option>
        </el-select>
        <div>
          <!-- <el-button icon="el-icon-refresh" circle @click="refresh"></el-button> -->
          <router-link  to='/todo/edit'>
            <el-button type="primary" icon="el-icon-plus" circle></el-button>
          </router-link>
          <el-button type="danger" icon="el-icon-delete" circle @click="showDelete=!showDelete"></el-button>
        </div>
      </div>
      <div class="container">
        <div class="tag-box">
          <span v-for="(item,index) in keyList" :key="index"
            :class="'note_tag '+ (KeyIds.indexOf(item.Id)>-1?'note_tag-active':'')"
            @click="clickKey(item.Id)">
            {{item.Word}}
          </span>
        </div>
        <div v-show="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div v-show="!notes[0] && !showLoading" class="loading-box">
          <i class="el-icon-search"></i>
          空空如也...
        </div>
        <el-row :gutter="15">
          <el-col  :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-for="(item,index) in notes" :key="index">
              <el-card shadow="hover">
                <i v-show="showDelete" class="el-icon-close icon-delete" @click="toDetele(item.Id)"></i>
                <div class="big-box">
                  <i class="header-icon el-icon-star-on"></i>
                  <div class="big-body">
                  <router-link  :to="'/tonote/note_detail/'+item.Id">
                    <b class="big-title">{{item.Headline}}</b>
                    <div><p class="tipbox big-content" v-html="item.Content"></p></div>
                  </router-link>
                    <div class="big-time"><i class="el-icon-time"> {{item.DateTime}}</i></div>
                    <div><el-tag>笔记</el-tag></div>
                  </div>
                </div>
              </el-card>
          </el-col>
        </el-row>
        <div v-show="showMore" class="loading-box">
          <i class="el-icon-loading"></i>
          加载更多中...
        </div>
        <div v-show="!showMore && NoneMore" class="loading-box">
          <i class="el-icon-search"></i>
          没有更多了...
        </div>
      </div>
    </div>
    <div v-if="ScrollTop>700" class="note_d-edit" onclick="document.querySelector('.app-main').scrollTop=0">
      <el-button class="tototop" icon="el-icon-d-arrow-left" circle></el-button>
    </div>
  </div>
</template>

<script>

import {
  NoteList,
  DeteleNote,
  SearchNote,
  GetKeysByUser,
  NotesByKeyIds
} from '@/api/toPost'

import { NoteCategory } from '@/api/toget'

export default {
  name: 'noteList',
  data() {
    return {
      homeTop: 0,
      ScrollTop: 0,
      showLoading: true,
      showDelete: false,
      showMore: false,
      NoneMore: false,
      notes: [],
      tolist: {
        UserId: this.$store.getters.user.Id,
        NoteCategoryId: this.$route.params.cateId || 0,
        Number: 3,
        Page: 1
      },
      search: {
        keys: '',
        UserId: this.$store.getters.user.Id
      },
      KeyIds: [],
      keyList: [],
      typelist: [
        {
          Id: 0,
          Name: '所有'
        }
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    // 这里的vm指的就是vue实例，可以用来当做this使用
    next(vm => {
      if (from.path === '/tonote/note_type') {
        var cateid = vm.$route.params.cateId
        if (cateid) {
          vm.tolist.NoteCategoryId = cateid
          vm.getNotes()
        }
        // console.log(cateid, vm.tolist.NoteCategoryId)
      }
    })
  },
  created() {
    this.getCategory()
    this.getNotes()
    this.getKeys()
  },
  activated() {
    document.querySelector('.app-main').scrollTop = this.homeTop || 0
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  beforeRouteLeave(to, from, next) {
    this.homeTop = document.querySelector('.app-main').scrollTop || 0
    document.querySelector('.app-main').removeEventListener('scroll', this.onScroll)
    next()
  },
  mounted() {
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  methods: {
    refresh() {
      this.getCategory()
      this.getQues()
    },
    clickKey(keyid) {
      var index = this.KeyIds.indexOf(keyid)
      if (index > -1) {
        this.KeyIds.splice(index, 1)
      } else {
        this.KeyIds.push(keyid)
      }
      this.getNotesByKeyIds()
    },
    getNotesByKeyIds() {
      var keyIdStr = ''
      for (var i = 0; i < this.KeyIds.length; i++) {
        keyIdStr += this.KeyIds[i]
      }
      var data = {
        UserId: this.$store.getters.user.Id,
        NoteCategoryId: this.tolist.NoteCategoryId,
        KeyIds: keyIdStr
      }
      NotesByKeyIds(this.$qs.stringify(data)).then(res => {
        if (res.data.code === 0) {
          this.notes = res.data.data
        } else {
          this.$message.warning('获取笔记失败...')
        }
      }).catch(() => {})
    },
    getCategory() {
      NoteCategory(this.$store.getters.user.Id).then(res => {
        if (res.data.code === 0) {
          this.typelist = this.typelist.concat(res.data.data)
        } else {
          this.$message.warning('获取笔记分类失败...')
        }
      }).catch(() => {})
    },
    getKeys() {
      GetKeysByUser(this.$qs.stringify({ UserId: this.$store.getters.user.Id })).then(res => {
        if (res.data.code === 0) {
          this.keyList = res.data.data
        } else {
          this.$message.warning('获取笔记分类失败...')
        }
      }).catch(() => {})
    },
    getNotes() {
      this.NoneMore = false
      this.showLoading = true
      this.tolist.Page = 1
      NoteList(this.$qs.stringify(this.tolist)).then(res => {
        this.notes = res.data.data
        this.showLoading = false
      }).catch(() => {})
    },
    toDetele(index) {
      this.$confirm('此操作将永久删除该错题, 是否继续?', '提示', {
        confirmButtonText: '确定不要了',
        cancelButtonText: '先留着吧',
        type: 'warning'
      }).then(() => {
        DeteleNote(this.$qs.stringify({ Id: index })).then(res => {
          if (res.data.code === 0) {
            this.$notify({
              title: '提示',
              message: '删除成功！',
              type: 'info'
            })
          } else {
            this.$message.warning('操作失败...')
          }
          this.getNotes()
        }).catch(() => {})
        //
      }).catch(() => {})
    },
    toSearch() {
      if (this.search.keys === '') {
        this.getNotes()
        return
      }
      this.showLoading = true
      SearchNote(this.$qs.stringify(this.search)).then(res => {
        this.notes = res.data.data
        this.showLoading = false
      }).catch(() => {})
    },
    onScroll() {
      var innerHeight = document.querySelector('.app-container').clientHeight
      var outerHeight = document.querySelector('.app-main').clientHeight
      var scrollTop = document.querySelector('.app-main').scrollTop
      this.ScrollTop = scrollTop
      if (innerHeight <= (outerHeight + scrollTop)) {
        if (this.NoneMore || this.showMore || this.search.keys.trim() !== '') {
          return
        }
        this.showMore = true
        this.tolist.Page++
        NoteList(this.$qs.stringify(this.tolist)).then(res => {
          this.notes = this.notes.concat(res.data.data)
          this.showMore = false
          if (res.data.data.length < this.tolist.Number) {
            this.NoneMore = true
          } else {
            this.NoneMore = false
          }
        }).catch(() => {})
      }
    }
  }
}
</script>

<style scoped lang="scss">
    @import '../../styles/note_box.scss';
</style>
