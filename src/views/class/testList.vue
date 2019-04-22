<template>
  <div class="app-container test_list">
    <!-- <span class="header-title">学生测试</span> -->
    <div class="big-box1200">
      <!-- <div class="top-search">
        <el-input
          placeholder="请输入内容"
          @keyup.enter.native=""
          v-model="search.keys">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div> -->
      <div class="list-gbtn">
        <p class="list_p">在测<span>{{this.GetAllTestByTeacherId.length}}</span> 结束<span>0</span></p>
        <div v-if="user.roles.toString()!=['student']">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="addtest"
          >添加测试</el-button>
        </div>
      </div>
      <div class="block">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in GetAllTestByTeacherId"
            :key="index"
            :timestamp="item.Ctime"
            placement="top"
          >
            <el-card
              class="test-card"
              shadow="hover"
              :style="{backgroundColor: '#ecf5ff'}"
            >
              <router-link
                class="test_box"
                :to="'/class/test_detail/'+item.Id"
              >
                <div>
                  <h4 v-html="item.Title"></h4>
                  <!-- <p>备注</p> -->
                  <h5>共 <span style="color: #F56C6C"> {{item.QCount}}</span> 道测试题目</h5>
                </div>
                <div>
                  <p class="test_state"><span class="test_time">{{item.Ctime}}</span><span class="test_time">限制时间：<span style="color: #F56C6C">{{item.LimiteTime/60}}</span> 分钟</span>
                    <el-tag
                      size="small"
                      v-if="item.Status=='0'"
                      type="success"
                    ><span>在测</span></el-tag>
                    <el-tag
                      size="small"
                      v-else
                      type="warning"
                    ><span>未在测</span> </el-tag>
                  </p>
                </div>
              </router-link>
              <el-button
                v-if="user.roles.toString()!=['student']"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="toEdit(index)"
              ></el-button>
              <!-- <el-button v-if="user.roles.toString()==['student']" type="danger" icon="el-icon-close" size="mini" @click="toExit"></el-button> -->
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <!-- <el-dialog title="测试编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="测试名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
           <el-date-picker
            v-model="form.startdate"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间">
           <el-date-picker
            v-model="form.enddate"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="测试状态">
          <el-select v-model="form.region" placeholder="请选择测试状态">
            <el-option label="测试" value="start"></el-option>
            <el-option label="暂停" value="pause"></el-option>
            <el-option label="结束" value="end"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog> -->
    <el-dialog
      title="测试编辑"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="toupdate"
        :rules="editFormRules"
      >
        <el-form-item
          label="测试名称"
          prop="Title"
        >
          <el-input
            v-model="toupdate.Title"
            placeholder="输入测试名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="测试时长"
          prop="LimiteTime"
        >
          <el-input
            v-model="toupdate.LimiteTime"
            placeholder="输入该测试多少分钟内完成"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="测试状态"
          prop="Status"
        >
          <el-select
            v-model="toupdate.Status"
            placeholder="请选择测试状态"
          >
            <el-option
              label="现在开始测试"
              value="0"
            ></el-option>
            <el-option
              label="稍后开始测试"
              value="1"
            ></el-option>
            <!-- <el-option label="结束" value="end"></el-option> -->
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="undateTest()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetTestByTidAndUid, questionCategory } from '@/api/toget'
import { updateTest } from '@/api/toPost'
export default {
  name: 'testList',
  data() {
    const validateLimiteTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('测试时间不能为空'))
      } else {
        const reg = new RegExp('^[0-9]*[1-9][0-9]*$')
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('测试时间只能为大于0的正整数'))
        }
      }
    }
    return {
      user: this.$store.getters.user,
      search: {
        keys: '',
        UserId: this.$store.getters.user.Id
      },
      page: 1,
      Uid: 0,
      total: null,
      GetAllTestByTeacherId: [],
      dialogFormVisible: false,
      Categorylist: [],
      form: {
        id: '',
        name: '',
        Testtime: '',
        region: 'start'
      },
      toupdate: {
        TeacherId: this.$store.getters.user.Id,
        Id: '',
        Title: '',
        LimiteTime: '',
        Status: '0'
      },
      editFormRules: {
        Title: [
          { required: true, message: '测试名称不能为空', trigger: 'blur' }
        ],
        LimiteTime: [
          { validator: validateLimiteTime, trigger: 'blur' }
        ],
        Status: [
          { required: true, message: '测试状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['classId'],
  methods: {
    GetCategory() {
      // 未登录 不请求
      if (!this.$store.getters.user.Id) {
        return
      }
      questionCategory().then(res => {
        this.Categorylist = res.data.data
      }).catch((res) => {
        console.log(res)
      })
    },
    // 修改测试
    undateTest() {
      if (this.$store.getters.user.Id) {
        updateTest(this.$qs.stringify(this.toupdate)).then(res => {
          if (res.data.code === 0) {
            this.$message.success('数据更新成功！')
            this.toupdate = {
              TeacherId: this.$store.getters.user.Id,
              Id: '',
              Title: '',
              LimiteTime: '',
              Status: '0'
            }
            this.Init()
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.$message.error('更新失败！')
        })
      } else {
        this.$message.error('请先登录！')
      }
      this.dialogFormVisible = false
    },
    // 添加测试
    addtest() {
      this.$router.push('/carveup/index')
    },
    // 编辑测试
    toEdit(index) {
      this.toupdate.LimiteTime = this.GetAllTestByTeacherId[index].LimiteTime
      this.toupdate.Id = this.GetAllTestByTeacherId[index].Id
      this.toupdate.Title = this.GetAllTestByTeacherId[index].Title
      this.toupdate.Status = this.GetAllTestByTeacherId[index].Status
      this.dialogFormVisible = true
    },
    getQuestionCount(q) {
      q = q.Content
      let cnt = 1
      for (let i = 0; i < q.length; i++) {
        if (q[i] === ',') {
          cnt++
        }
      }
      return cnt
    },
    getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
    },
    Init() {
      if (this.$store.getters.user.Id) {
        GetTestByTidAndUid(this.$store.getters.user.Id, this.classId).then(res => {
          if (res.data.code === 0) {
            this.GetAllTestByTeacherId = res.data.data
            for (let i = 0; i < this.GetAllTestByTeacherId.length; i++) {
              this.GetAllTestByTeacherId[i].QCount = this.getQuestionCount(this.GetAllTestByTeacherId[i])
              this.GetAllTestByTeacherId[i].Ctime = this.getLocalTime(this.GetAllTestByTeacherId[i].Ctime)
            }
            console.log(res.data.data)
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.$message.error('获取数据失败')
        })
      } else {
        console.log('未登录')
      }
    }
    // toExit() {
    //   this.$confirm('退出测试?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {

    //   }).catch(() => {})
    // }
  },
  created() {
    // console.log(this.user.roles)
    this.Init()
    this.GetCategory()
  }
}
</script>

<style lang="scss">
.test_list {
  .list-gbtn {
    .list_p {
      font-size: 12px;
      span {
        font-size: 16px;
        margin-right: 5px;
        margin-left: 2px;
        color: rgb(245, 108, 108);
      }
    }
  }
  .test-card {
    position: relative;
    .el-button {
      border: 0;
      padding: 8px 12px;
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .test_state {
      font-size: 12px;
      color: #666;
      text-align: right;
      .test_time {
        display: block;
        margin-bottom: 2px;
      }
    }
  }
  .test_box {
    display: flex;
    justify-content: space-between;
    position: relative;
    align-items: flex-end;
    & > div {
      width: 50%;
      h4 {
        margin: 10px 0;
        font-size: 15px;
      }
    }
  }
}
</style>
