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
        <p class="list_p">在测<span>3</span> 结束<span>0</span></p>
        <div v-if="user.roles.toString()!=['student']">
          <el-button type="primary" icon="el-icon-plus" size="small">添加测试</el-button>
        </div>
      </div>
      <div class="block">
        <el-timeline>
            <el-timeline-item v-for="(item,index) in 3" :key="index" timestamp="2019/3/12 12:12:12" placement="top">
                <el-card class="test-card" shadow="hover" :style="{backgroundColor: '#ecf5ff'}">
                  <router-link class="test_box" to="/class/test_detail/1">
                    <div>
                      <h4>三月小测试</h4>
                      <p>测试备注</p>
                      <h5>共 <span style="color: #F56C6C">24</span> 人参加测试</h5>
                    </div>
                    <div>
                      <p class="test_state"><span class="test_time">2019/03/27 19:56:33</span><span class="test_time">2019/04/07 19:56:33</span><el-tag size="small" type="success">在测</el-tag></p>
                    </div>
                  </router-link>
                  <el-button v-if="user.roles.toString()!=['student']" type="primary" icon="el-icon-edit" size="mini" @click="toEdit"></el-button>
                  <!-- <el-button v-if="user.roles.toString()==['student']" type="danger" icon="el-icon-close" size="mini" @click="toExit"></el-button> -->
                </el-card>
            </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <el-dialog title="测试编辑" :visible.sync="dialogFormVisible">
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'testList',
  data() {
    return {
      user: this.$store.getters.user,
      search: {
        keys: '',
        UserId: this.$store.getters.user.Id
      },
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date: ''
      }
    }
  },
  props: {
    classId: [String, Number]
  },
  methods: {
    toEdit() {
      this.dialogFormVisible = true
      return false
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
  }
}
</script>

<style lang="scss">
.test_list{
  .list-gbtn{
    .list_p{
      font-size: 12px;
      span{
        font-size: 16px;
        margin-right: 5px;
        margin-left: 2px;
        color: rgb(245, 108, 108);
      }
    }
  }
  .test-card{
    position: relative;
    .el-button{
      border: 0;
      padding: 8px 12px;
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .test_state{
      font-size: 12px;
      color: #666;
      text-align: right;
      .test_time {
        display: block;
        margin-bottom: 2px;
      }
    }
  }
  .test_box{
    display: flex;
    justify-content: space-between;
    position: relative;
    align-items: flex-end;
    &>div{
      width: 50%;
      h4{
        margin: 10px 0;
        font-size: 15px;
      }
    }
  }
}
</style>
