<template>
  <div class="app-container test_student">
    <span class="header-title">学生完成情况</span>
    <div class="big-box1200">
      <div class="top-search">
        <el-input
          placeholder="查询学生"
          @keyup.enter.native=""
          v-model="search.keys">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="list-gbtn">
        <div>共 <b style="color: #F56C6C">24</b> 名学生</div>
        <div>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="addStudent">添加学生</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="showDelete=!showDelete" size="small">移除学生</el-button>
        </div>
      </div>
      <div class="container">
        <!-- <div style="text-align: center;">
          <h4>三月小测试</h4>
        </div> -->
        <el-collapse v-loading="loading" v-model="activeNames">
          <el-collapse-item v-for="(item,index) in 24" :key="index">
            <template slot="title">
              <div class="student_box ques_header">
                <div class="student_box_left">
                  <el-button class="btn-detele" v-show="showDelete" type="text" icon="el-icon-close" circle></el-button>
                  <router-link :to="'/user/other/'+1">
                    <img :src="user.Avatar || './static/img/avatar.jpg'">
                  </router-link>
                  <b>{{user.Name}}</b>
                </div>
                <span></span>
              </div>
            </template>
            <i class="header-icon el-icon-document"></i><b> 测试汇总：</b>
            <div class="answer tipbox">{{item.answer}}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <el-dialog
      title="添加学生"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="student_box ques_header">
        <div class="student_box_left">
          <router-link :to="'/user/other/'+1">
            <img :src="user.Avatar || './static/img/avatar.jpg'">
          </router-link>
          <b>{{user.Name}}</b>
        </div>
        <span></span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="dialogVisible = false">添加该学生</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'studentList',
  data() {
    return {
      activeNames: ['1'],
      user: this.$store.getters.user,
      dialogVisible: false,
      students: [],
      addstudent: '',
      loading: false,
      showDelete: false,
      search: {
        keys: ''
      }
    }
  },
  methods: {
    getNotes() {
      // getNoteList().then(res => {
      //   this.questions = res.data
      // }).catch(() => {})
      // this.loading = false
    },
    addStudent() {
      this.$prompt('请输入学生的用户号', '查找学生', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.dialogVisible = true
      })
    }
  },
  created() {
  }
}
</script>

<style lang='scss'>
.test_student{
  .student_box{
    line-height: 1em;
    padding-left: 5px;
    justify-content: space-between;
    .student_box_left{
      display: flex;
      align-items: center;
      .btn-detele{
        margin-right: 5px;
      }
      b{
        font-size: 14px;
        margin-left: 10px;
      }
    }

  }
  .el-collapse-item__header{
    height: 70px;
    line-height: 70px;
    &:hover{
      background-color: rgba(217, 236, 255,0.6)
    }
  }
}
@media (min-width: 769px)
{
  .test_student{
    .student_box{
      width: 95%;
    }
  }
}
</style>
