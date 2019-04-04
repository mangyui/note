<template>
  <div>
    <span class="header-title">笔记详情</span>
    <div v-if="showLoading" class="loading-box">
      <i class="el-icon-loading"></i>
      加载中...
    </div>
    <div v-show="note.Id">
      <div class="app-container">
        <!-- <div class="crumbs disNone">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/tonote/noteList' }"><i class="el-icon-date"></i> 笔记列表</el-breadcrumb-item>
              <el-breadcrumb-item>笔记详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div> -->
        <div class="container big-box1200">
          <!-- <router-link :to="'/tonote/note_more/'+ this.id"> -->
            <el-button class="de-more" size="small" @click="to_more">相关题目</el-button>
          <!-- </router-link> -->
          <div class="note_d-title">
            <h3>{{note.Headline}}</h3>
            <el-tag size="small">{{note.Category}}</el-tag>
            <p class="note_d-remark">笔记 | {{note.DateTime}}</p>
          </div>
          <div ref="noteContent" class="note_d-content" v-html="note.Content"></div>
        </div>
      </div>
      <div class="note_d-edit">
        <el-dropdown trigger="click">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-dropdown-menu style="overflow: hidden;" slot="dropdown">
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
  </div>
</template>

<script>
import {
  NoteDetails,
  DeteleNote
} from '@/api/toPost'

export default {
  name: 'note_detail',
  data() {
    return {
      id: null,
      showLoading: true,
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
      NoteDetails(this.$qs.stringify({ Id: this.id })).then(res => {
        this.note = res.data.data
        if (!this.note.UserId || this.note.UserId !== this.$store.getters.user.Id) {
          this.$message.warning('没有找到...')
          var close = document.querySelector('.tags-view-item.active .el-icon-close')
          close.click()
          // this.$router.push({
          //   path: '/tonote/noteList'
          // })
        }
        this.showLoading = false
      }).catch(() => {
        this.$message.warning('系统错误...')
        // var close = document.querySelector('.tags-view-item.active .el-icon-close')
        // close.click()
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
        DeteleNote(this.$qs.stringify({ Id: this.id })).then(res => {
          if (res.data.code === 0) {
            this.$notify({
              title: '提示',
              message: '删除成功！',
              type: 'info'
            })
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
    },
    to_more() {
      this.$router.push({
        // params 传参只能用name 来指定路由
        path: '/tonote/note_more',
        query: {
          id: this.id,
          content: this.note.Headline + this.$refs.noteContent.innerText,
          Headline: this.note.Headline,
          Category: this.note.Category
        }
      })
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
.container {
    border: 0;
}
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
  min-height: 400px;
}

</style>
