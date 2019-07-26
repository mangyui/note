<template>
  <div class="app-container">
    <span class="header-title">消息</span>
    <div class="container big-box1200">
      <el-tabs
        v-model="message"
        :stretch="true"
      >
        <el-tab-pane name="first">
          <span slot="label">
            <el-badge
              is-dot
              class="item"
            > 未读消息</el-badge>
          </span>
          <div>
            <div v-show="!unread[0]" class="loading-box">
              暂无消息
            </div>
            <div class="mess-item" v-for="(item,index) in unread" :key="index">
              <div class="mess-item-content"  @click="popMessage(item)"><p>{{item.Title}}</p><span>{{item.Ctime}}</span></div>
              <el-button size="mini" @click="handleRead(item)">标为已读</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label">
            已读消息
          </span>
          <div>
            <div v-show="!read[0]" class="loading-box">
              暂无消息
            </div>
            <div class="mess-item" v-for="(item,index) in read" :key="index">
              <div class="mess-item-content"  @click="popMessage(item)"><p>{{item.Title}}</p><span>{{item.Ctime}}</span></div>
              <!-- <el-button size="mini" @click="handleRead(item)">标为已读</el-button> -->
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        :title="msg.Title"
        :visible.sync="centerDialogVisible"
        width="30%"
        center
      >
        <span>{{msg.Content}}</span>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="centerDialogVisible = false">关 闭</el-button>
          <el-button
            @click="toOther()"
            type="primary"
          >进 入 测 试</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  GetMessage,
  UpdateRead
} from '@/api/toPost'

export default {
  name: 'message',
  data() {
    return {
      message: 'first',
      showHeader: false,
      unread: [],
      read: [],
      recycle: [],
      unlength: 0,
      relength: 0,
      msg: {
        Title: '',
        Content: '',
        Ctime: '',
        Author: '',
        Link: ''
      },
      centerDialogVisible: false
    }
  },
  beforeRouteEnter(to, from, next) {
    // 这里的vm指的就是vue实例，可以用来当做this使用
    next(vm => {
      vm.GetMessage()
    })
  },
  methods: {
    GetMessage() {
      GetMessage(this.$qs.stringify({ 'UserId': this.$store.getters.user.Id })).then(res => {
        // console.log(res.data.data.Read)
        this.unread = res.data.data.UnRead
        this.read = res.data.data.Read
        setTimeout(() => {
          this.changelength()
        }, 1000)
      }).catch(() => {
        console.log('获取数据失败！')
      })
    },
    handleRead(index) {
      const Id = index.Id
      UpdateRead(this.$qs.stringify({ 'UserId': this.$store.getters.user.Id, 'Id': Id })).then(res => {
        // console.log(res)
      }).catch(() => {
        console.log('修改数据失败')
      })
      // console.log(this.unread)
      const item = this.unread.splice(index.$index, 1)
      // console.log(item)
      this.read = item.concat(this.read)
      this.changelength()
    },
    handleDel(index) {
      const item = this.read.splice(index, 1)
      this.recycle = item.concat(this.recycle)
      this.changelength()
    },
    handleRestoreUnRead(index) {
      const Id = index.Id
      UpdateRead(this.$qs.stringify({ 'UserId': this.$store.getters.user.Id, 'Id': Id, 'ToReaded': false })).then(res => {
        // console.log(res)
      }).catch(() => {
        console.log('修改数据失败')
      })
      const item = this.read.splice(index.$index, 1)
      this.unread = item.concat(this.read)
      this.changelength()
    },
    handleRestore(index) {
      const item = this.recycle.splice(index, 1)
      this.read = item.concat(this.read)
      this.changelength()
    },
    allToDu() {
      this.read = this.read.concat(this.unread)
      this.unread = []
      this.changelength()
    },
    allToRecycle() {
      this.recycle = this.recycle.concat(this.read)
      this.read = []
      this.changelength()
    },
    alltoDelete() {
      this.recycle = []
      this.changelength()
    },
    popMessage(tmsg) {
      this.msg = tmsg
      // this.msg.Link = tmsg.Handle.indexOf('TestsId')
      if (tmsg.Handle.indexOf('[TestId') >= 0) { // 判断是否为测试通知
        let tid = tmsg.Handle.replace('[TestId:', '')
        tid = tid.replace(/]/, '')
        this.msg.Link = '/class/test_todo/' + tid
      }
      this.centerDialogVisible = true
      // console.log(this.msg)
    },
    changelength() {
      this.relength = this.read.length
      // console.log('已读: ' + this.relength)
      this.unlength = this.unread.length
      // console.log('未读: ' + this.unlength)
    },
    toOther() {
      this.centerDialogVisible = false
      console.log(this.msg.Link)
      this.$router.push({
        path: this.msg.Link
      })
    }
  },
  computed: {
    unreadNum() {
      return this.unread.length
    }
  },
  created() {
    this.GetMessage()
  }
}
</script>

<style lang="scss" scoped>
.handle-row {
  margin-top: 30px;
}
.message-title:hover {
  cursor: pointer;
}
.mess-item{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}
.mess-item{
  color: #606266;
  padding: 5px 5px;
  border-bottom: 1px solid #efefef;
  &:hover{
    background-color: rgb(236, 245, 255);
  }
}
.mess-item-content{
  flex-grow: 1;
  padding: 10px 10px 10px 5px;
  cursor: pointer;
  span{
    font-size: 12px;
    margin-top: 8px;
    display: inline-block;
    color: #999;
  }
}
</style>
