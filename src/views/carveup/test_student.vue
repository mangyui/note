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
        <div></div>
        <div>
          <el-button type="primary" icon="el-icon-plus" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="showDelete=!showDelete"></el-button>
        </div>
      </div>
      <div class="container">
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
                <span>已完成</span>
              </div>
            </template>
            <i class="header-icon el-icon-document"></i><b> 完成情况：</b>
            <div class="answer tipbox">{{item.answer}}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'test_student',
  data() {
    return {
      activeNames: ['1'],
      user: this.$store.getters.user,
      students: [],
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
