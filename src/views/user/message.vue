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
              :value="unlength"
              class="item"
            > 未读消息</el-badge>
          </span>
          <el-table
            :data="unread"
            :show-header="false"
            style="width: 100%"
            empty-text="暂无消息"
          >
            <el-table-column>
              <template slot-scope="scope">
                <span
                  class="message-title"
                  @click="popMessage(scope.row)"
                >{{scope.row.Title}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Ctime"
              width="180"
            ></el-table-column>
            <el-table-column
              fixed="right"
              width="95"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleRead(scope)"
                >
                  标为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div class="handle-row">
            <el-button
              size="small"
              type="primary"
              @click="allToDu"
            >全部标为已读</el-button>
          </div> -->
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label">
            <el-badge
              :value="relength"
              class="item"
            > 已读消息</el-badge>
          </span>
          <template v-if="message === 'second'">
            <el-table
              :data="read"
              :show-header="false"
              style="width: 100%"
              empty-text="暂无消息"
            >
              <el-table-column>
                <template slot-scope="scope">
                  <span
                    class="message-title"
                    @click="popMessage(scope.row)"
                  >{{scope.row.Title}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="Ctime"
                width="180"
              ></el-table-column>
              <el-table-column
                fixed="right"
                width="170"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleRestoreUnRead(scope)"
                  >
                    标记未读</el-button>
                  <!-- <el-button
                    size="mini"
                    type="danger"
                    @click="handleDel(scope.$index)"
                  >
                    删除</el-button> -->
                </template>
              </el-table-column>
            </el-table>
            <!-- <div class="handle-row">
              <el-button
                size="small"
                type="danger"
                @click="allToRecycle"
              >删除全部</el-button>
            </div> -->
          </template>
        </el-tab-pane>
        <!-- <el-tab-pane name="third">
          <span slot="label">
            <el-badge
              :value="recycle.length"
              class="item"
            > 回收站</el-badge>
          </span>
          <template v-if="message === 'third'">
            <el-table
              :data="recycle"
              :show-header="false"
              style="width: 100%"
              empty-text="暂无消息"
            >
              <el-table-column>
                <template slot-scope="scope">
                  <span class="message-title">{{scope.row.Title}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="Ctime"
                width="180"
              ></el-table-column>
              <el-table-column
                fixed="right"
                width="70"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleRestore(scope.$index)"
                  >
                    还原</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="handle-row">
              <el-button
                size="small"
                type="danger"
                @click="alltoDelete"
              >清空回收站</el-button>
            </div>
          </template>
        </el-tab-pane> -->
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
  methods: {
    GetMessage() {
      GetMessage(this.$qs.stringify({ 'UserId': this.$store.getters.user.Id })).then(res => {
        // console.log(res.data.data.Read)
        this.unread = res.data.data.UnRead
        this.read = res.data.data.Read

        this.changelength()
      }).catch(() => {
        console.log('获取数据失败！')
      })
    },
    handleRead(index) {
      const Id = index.row.Id
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
      const Id = index.row.Id
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
      console.log(this.msg)
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
</style>
