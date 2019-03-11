<template>
  <div>
    <span class="header-title">笔记详情</span>
    <div class="app-container">
      <div class="crumbs disNone">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/tonote/noteList' }"><i class="el-icon-date"></i> 笔记列表</el-breadcrumb-item>
            <el-breadcrumb-item>笔记详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="big-box1200">
        <div class="note_d-title">
          <h3>{{note.Headline}}</h3>
          <el-tag size="small">{{note.Category}}</el-tag>
          <p class="note_d-remark">笔记 | {{note.DateTime}}</p>
        </div>
        <div class="note_d-content" v-html="note.Content"></div>
      </div>
    </div>
    <div class="note_d-edit">
      <el-dropdown trigger="click">
        <el-button type="primary" icon="el-icon-edit" circle></el-button>
        <el-dropdown-menu slot="dropdown">
          <router-link :to="'/tonote/note_edit/'+ id">
            <el-dropdown-item icon="el-icon-edit">修改</el-dropdown-item>
          </router-link>
          <div @click="toDetele">
            <el-dropdown-item icon="el-icon-delete" divided>删除</el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {
  NoteDetails,
  DeteleNote
} from '@/api/toPost'
import qs from 'qs'

export default {
  name: 'note_detail',
  data() {
    return {
      id: null,
      note: {
        Headline: '',
        Category: '',
        DateTime: '',
        Content: ''
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // 这里的vm指的就是vue实例，可以用来当做this使用
    next(vm => {
      if (from.path.indexOf('/tonote/note_edit/') === 0) {
        vm.getNote()
      }
    })
  },
  methods: {
    getNote() {
      NoteDetails(qs.stringify({ Id: this.id })).then(res => {
        this.note = res.data.data
        if (!this.note.UserId || this.note.UserId !== this.$store.getters.user.Id) {
          this.$message.warning('没有找到...')
          var close = document.querySelector('.tags-view-item.active .el-icon-close')
          close.click()
          // this.$router.push({
          //   path: '/tonote/noteList'
          // })
        }
      }).catch(() => {
        this.$message.warning('没有找到...')
        var close = document.querySelector('.tags-view-item.active .el-icon-close')
        close.click()
      })
    },
    fetchDate() {
      this.id = this.$route.params.id
      if (this.id) {
        this.getNote()
      }
    },
    toDetele() {
      if (!this.id) {
        return
      }
      this.$confirm('此操作将永久删除该笔记, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeteleNote(qs.stringify({ Id: this.id })).then(res => {
          if (res.data.code === 0) {
            this.$message.success('删除成功...')
            var close = document.querySelector('.tags-view-item.active .el-icon-close')
            close.click()
            this.$router.push({
              path: '/tonote/noteList'
            })
          } else {
            this.$message.warning('操作失败...')
          }
        }).catch(() => {})
        //
      }).catch(() => {})
    }
  },
  // 该监听是全局的  可怕
  // watch: {
  //   $route: 'fetchDate'
  // },
  created() {
    this.fetchDate()
  }
}
</script>

<style lang="scss" scoped>
.note_d-title{
  text-align: center;
}
.note_d-remark{
  font-size: 12px;
  color: #666;
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}
.note_d-content{
  padding: 10px 3px 3px 3px;
}

</style>
