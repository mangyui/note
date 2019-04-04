<template>
  <div class="app-container">
    <span class="header-title">我的班级</span>
    <div class="big-box1200">
      <div v-if="user.roles.toString()!=['student']" class="list-gbtn">
        <div>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="showAdd=!showAdd">创建新班级</el-button>
        </div>
        <div>
          <el-button type="info" icon="el-icon-edit" size="small" @click="showEdit=!showEdit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="showDelete=!showDelete">删除</el-button>
        </div>
      </div>
      <div v-if="user.roles.toString()==['student']" class="list-gbtn">
        <div>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="">加入班级</el-button>
        </div>
        <div>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="showDelete=!showDelete">退出班级</el-button>
        </div>
      </div>
      <div class="container">
        <div v-if="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <!-- <div v-if="!types[0] && !showLoading" class="loading-box">
          <i class="el-icon-search"></i>
          空空如也...
        </div> -->
        <el-row :gutter="15">
          <el-col  :xs="24" :sm="12" :md="12" :lg="12" :xl="12" v-for="(item,index) in 3" :key="index">
            <el-card>
              <i v-show="showEdit" class="el-icon-edit icon-update" @click="showEditBox(index)"></i>
              <i v-show="showDelete" class="el-icon-close icon-delete" @click="toDetele(item.Id)"></i>
              <div class="big-box">
                <div class="big-body">
                  <b class="type_title">.</b>
                  <div @click="ToList(item.Id)">
                    <div class="tipbox type_content">
                      <h3 style="margin:5px 0 8px">
                        初二物理班
                      </h3>
                      <p class="class_type">
                        2019/04/04 &nbsp;&nbsp;‧&nbsp;&nbsp; 初二 &nbsp;&nbsp;‧&nbsp;&nbsp; 物理
                      </p>
                      <div class='class_content'>
                        <p class="class_desc">备注</p>
                        <table>
                          <tr>
                            <td>测试数：<b>03</b></td>
                            <td>学生数：<b>24</b></td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog title="开设班级" :visible.sync="showAdd">
      <el-form :model="toadd" :rules="rules" ref="Form" label-width="100px">
        <el-form-item label="科目年级">
          <el-select size="medium" v-model="toadd.CategoryId" placeholder="选择科目年级" @change="">
            <el-option
              v-for="item in Categorylist"
              :key="item.Id"
              :label="item.Subject"
              :value="item.Id">
              <span style="float: left">{{ item.Subject }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Class }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级名" prop="Name">
          <el-input v-model="toadd.Name"></el-input>
        </el-form-item>
        <el-form-item label="班级备注" prop="Intro">
          <el-input type="textarea" v-model="toadd.Intro"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addMistakeType">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改班级" :visible.sync="showUpdate">
      <el-form :model="toupdate" :rules="rules" ref="updateForm" label-width="100px">
        <el-form-item label="科目年级">
          <el-select size="medium" v-model="toupdate.CategoryId" placeholder="选择科目年级" @change="">
            <el-option
              v-for="item in Categorylist"
              :key="item.Id"
              :label="item.Subject"
              :value="item.Id">
              <span style="float: left">{{ item.Subject }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Class }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级名" prop="Name">
          <el-input v-model="toupdate.Name"></el-input>
        </el-form-item>
        <el-form-item label="班级备注" prop="Intro">
          <el-input type="textarea" v-model="toupdate.Intro"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="showUpdate = false">取 消</el-button>
        <el-button size="small" type="primary" @click="updateMistakeCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

// import {
//   mistakeCate,
//   AddMistakeCate,
//   DeleteMistakeCate,
//   UpdateMistakeCate
// } from '@/api/toPost'

import {
  questionCategory
} from '@/api/toget'

export default {
  name: 'mistake_type',
  data() {
    return {
      user: this.$store.getters.user,
      showLoading: false,
      showDelete: false,
      showAdd: false,
      showEdit: false,
      showUpdate: false,
      Categorylist: [],
      types: [],
      toadd: {
        UserId: this.$store.getters.user.Id,
        Name: '',
        CategoryId: '10',
        Intro: ''
      },
      toupdate: {
        UserId: this.$store.getters.user.Id,
        MistakeCateId: '',
        CategoryId: '10',
        Name: '',
        Intro: ''
      },
      rules: {
        Name: [
          { required: true, message: '请输入班级名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        Intro: [
          { min: 0, max: 30, message: '长度在 0 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getClass()
    this.GetCategory()
  },
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
    getClass() {
      // this.showLoading = true
      // mistakeCate(qs.stringify({ UserId: this.$store.getters.user.Id })).then(res => {
      //   if (res.data.code === 0) {
      //     this.types = res.data.data
      //   } else {
      //     this.$message.warning('获取科目失败...')
      //   }
      //   this.showLoading = false
      // }).catch((res) => {
      //   console.log(res)
      // })
    },
    addMistakeType() {
      this.$refs.Form.validate(valid => {
        if (valid) {
          // AddMistakeCate(qs.stringify(this.toadd)).then(res => {
          //   if (res.data.code === 0) {
          //     this.$notify({
          //       title: '提示',
          //       message: '开始班级成功！',
          //       type: 'success'
          //     })
          //   } else {
          //     this.$message.warning('操作失败...')
          //   }
          //   this.showAdd = false
          //   this.getCategory()
          // }).catch(() => {})
        }
      })
    },
    showEditBox(index) {
      this.toupdate.MistakeCateId = this.types[index].Id
      this.toupdate.Name = this.types[index].Name
      this.toupdate.Intro = this.types[index].Intro
      this.showUpdate = true
    },
    updateMistakeCate() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          // UpdateMistakeCate(qs.stringify(this.toupdate)).then(res => {
          //   if (res.data.code === 0) {
          //     this.$notify({
          //       title: '提示',
          //       message: '修改班级信息成功！',
          //       type: 'success'
          //     })
          //   } else {
          //     this.$message.warning('操作失败...')
          //   }
          //   this.showUpdate = false
          //   this.getCategory()
          // }).catch(() => {})
        }
      })
    },
    toDetele(index) {
      this.$confirm('此操作将不解散该班级,该班级下的学生测试都将删除，无法还原, 是否继续?', '警告', {
        confirmButtonText: '全都不要了',
        cancelButtonText: '先留着吧',
        type: 'error'
      }).then(() => {
        // DeleteMistakeCate(qs.stringify({ UserId: this.$store.getters.user.Id, MistakeCateId: index })).then(res => {
        //   if (res.data.code === 0) {
        //     this.$notify({
        //       title: '提示',
        //       message: '成功解散班级，并删除了' + res.data.data + '条测试',
        //       type: 'success'
        //     })
        //   } else {
        //     this.$message.warning('操作失败...')
        //   }
        //   this.getCategory()
        // }).catch(() => {})
        //
      }).catch(() => {})
    },
    ToList(Id) {
      this.$router.push({
        path: '/class/class_detail/' + Id
      })
    }
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
.el-card {
  margin-bottom: 20px;
  position: relative;
  .type_title{
    font-size: 16px;
    margin-bottom: 5px;
    display: block;
    margin: 0 auto 5px;
    text-align: center;
    width: 90%;
  }
  .type_content {
    margin-bottom: 0;
    line-height: 22px;
    font-size: 14px;
    padding: 5px 10px;
    background-color: rgb(217, 236, 255);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    height: 150px;
    cursor: pointer;
  }
}
.class_type{
  color: #666;
}
.class_content{
  .class_desc{
    font-size: 12px;
    height: 48px;
    overflow: hidden;
    margin: 5px 0;
  }
  table{
    width: 100%;
    b{
      color: #409EFF;
      font-size: 15px;
    }
  }
}
@media (max-width: 768px) {
  .el-card {
    .type_content{
      font-size: 10px;
      padding: 5px;
    }
  }
}
</style>
