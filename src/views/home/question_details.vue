<template>
  <div class="app-container">
    <span class="header-title">题目详情</span>
    <div v-if="showLoading" class="loading-box">
      <i class="el-icon-loading"></i>
      加载中...
    </div>
    <div v-show="question" class="note_details big-box1200">
      <div class="page-content">
        <div class="detail-top">
          <el-tag size="large" type="danger" v-if="question.Category">{{question.Category.Class}} ‧ {{question.Category.Subject}}</el-tag>
          <el-tag size="large">{{question.Type}}</el-tag>
          <router-link :to="'/home/ques_more/'+ this.id">
            <el-button class="de-more" size="small" >相似题型</el-button>
          </router-link>
        </div>
        <!-- <h2>题目</h2> -->
        <div class="sys-notes" v-html="question.Content"></div>
        <div class="sys-section">
          <div class="title" style="border:0">
            <i class="el-icon-success"></i> <strong>官方解答</strong>
          </div>
          <div class="sys-article" v-html="question.Analysis"></div>
        </div>
        <div class="toNum">
            <div @click="dianZan">
              <svg-icon class-name='qu-icon' icon-class="zan" :style="isLike==true?'color: #409EFF;border-color: #409EFF':''" /><span>{{question.LikeNumber}}</span>
            </div>
            <div @click="toCollect">
              <svg-icon class-name='qu-icon' icon-class="collect" :style="isCollect==true?'color: #409EFF;border-color: #409EFF':''"/><span>{{question.CollectNumber}}</span>
            </div>
            <div @click="haveBug">
              <!-- <el-tooltip class="item" effect="dark" content="解答有错误？" placement="top-end"> -->
               <svg-icon class-name='qu-icon' icon-class="bug" />
              <!-- </el-tooltip> -->
               <span></span>
            </div>
        </div>
        <div class="sys-section">
          <div class="title">
            <strong>题友解答</strong>
          </div>
          <div class="answer_item" v-for="(item,index) in friendCorrect" :key="index">
            <div class="answer_item_top">
              <div class="ques_header">
                <router-link :to="'/user/others/'+item.UserId">
                  <img :src="item.User.Avatar||'./static/img/avatar.jpg'">
                </router-link>
                <div class="header_right">
                  <b>{{item.User.Name || '匿名'}}</b>
                </div>
              </div>
            </div>
            <router-link :to="'/home/mistake/'+item.Id">
              <div class="sys-article item-article" v-html="item.Correct">
              </div>
            </router-link>
            <div class="sys_footer">
              <span>
                <svg-icon class-name='sys_footer_icon' icon-class="zan" /><span class="ques_footer_num">{{item.LikeNumber}}</span>
                <svg-icon class-name='sys_footer_icon' icon-class="collect" /><span class="ques_footer_num">{{item.CollectNumber}}</span>
              </span>
            </div>
          </div>
          <div v-if="!friendCorrect[0]" class="loading-box">
            <i class="el-icon-search"></i>
            暂无更多题友解答...
          </div>
          <br/>
          <div v-show="this.user.Id">
            <div v-if="this.user.Id" class="ques_header">
              <router-link to="/user/index">
                <img v-if="user" :src="user.Avatar || './static/img/avatar.jpg'">
              </router-link>
              <div class="header_right">
                <b>{{user.Name}}</b>
              </div>
            </div>
            <div ref="HaveCorrect" class="divWangeditor" style="text-align:left"></div>
            <br/>
            <el-button class="mobile_bbtn" type="primary" @click="dialogFormVisible = true">提交</el-button>
           </div>
        </div>
      </div>
    </div>
    <el-dialog title="错题备注" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="Form">
        <el-form-item label="题目分类" prop="CategoryId">
          <el-select v-model="form.CategoryId" placeholder="请选择题目分类">
            <el-option
              v-for="item in typelist"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id">
            </el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus" @click="showAdd=!showAdd" circle></el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加错题分类" :visible.sync="showAdd">
      <el-form :model="toadd" :rules="addrules" ref="addForm" label-width="100px">
        <el-form-item label="错题分类名" prop="Name">
          <el-input v-model="toadd.Name"></el-input>
        </el-form-item>
        <el-form-item label="分类说明" prop="Intro">
          <el-input type="textarea" v-model="toadd.Intro"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  size="small" @click="showAdd = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addMistakeType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 编辑器
var HaveCorrect

import {
  QuesDetails
} from '@/api/toget'

import {
  Imgurl,
  P_dianZan,
  P_toCollect,
  QFriendCorrect,
  addMistake,
  mistakeCate,
  AddMistakeCate
} from '@/api/toPost'

export default {
  name: 'question_details',
  components: { },
  data() {
    return {
      showLoading: true,
      showAdd: false,
      dialogVisible: false,
      dialogFormVisible: false,
      id: '',
      user: this.$store.getters.user,
      question: '',
      friendCorrect: [],
      isLike: false,
      isCollect: false,
      typelist: [],
      form: {
        Content: '',
        Text: '',
        Analysis: '',
        Keywords: '',
        CategoryId: ''
      },
      rules: {
        CategoryId: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ]
      },
      haveF: {
        Correct: '',
        Analysis: ''
      },
      toadd: {
        UserId: this.$store.getters.user.Id,
        Name: '',
        Intro: ''
      },
      addrules: {
        Name: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        Intro: [
          { min: 0, max: 30, message: '长度在 0 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleChange(val) {
      console.log(val)
    },
    dianZan() {
      if (!this.$store.getters.user.Id) {
        this.$confirm('你还没有登录，不能进行该操作！前往登录', '提示', {
          confirmButtonText: '立即登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {})
        return
      }
      if (this.isLike === true) {
        this.isLike = false
        this.question.LikeNumber--
      } else {
        this.isLike = true
        this.question.LikeNumber++
      }
      var data = {
        QuestionId: this.id,
        UserId: this.user.Id
      }
      P_dianZan(this.$qs.stringify(data)).then(res => {
        if (res.data.code !== 0) {
          this.$notify({
            title: '提示',
            message: '网络错误，点赞失败',
            type: 'error'
          })
          if (this.isLike === true) {
            this.isLike = false
            this.question.LikeNumber--
          } else {
            this.isLike = true
            this.question.LikeNumber++
          }
        }
      }).catch(() => {
        this.$message.warning('操作失败...')
      })
    },
    toCollect() {
      if (!this.$store.getters.user.Id) {
        this.$confirm('你还没有登录，不能进行该操作！前往登录', '提示', {
          confirmButtonText: '立即登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {})
        return
      }
      if (this.isCollect === true) {
        this.isCollect = false
        this.question.CollectNumber--
      } else {
        this.isCollect = true
        this.question.CollectNumber++
      }
      var data = {
        QuestionId: this.id,
        UserId: this.user.Id
      }
      P_toCollect(this.$qs.stringify(data)).then(res => {
        if (res.data.code !== 0) {
          this.$notify({
            title: '提示',
            message: '网络错误，操作失败',
            type: 'error'
          })
          if (this.isCollect === true) {
            this.isCollect = false
            this.question.CollectNumber--
          } else {
            this.isCollect = true
            this.question.CollectNumber++
          }
        }
      }).catch(() => {
        this.$message.warning('操作失败...')
      })
    },
    haveBug() {
      this.$confirm('该解答有问题? 反馈给我们', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '反馈成功！感谢您的反馈'
        })
      }).catch(() => {

      })
    },
    getFriendCorrect() {
      QFriendCorrect(this.$qs.stringify({ QuestionId: this.id })).then(res => {
        this.friendCorrect = res.data.data
      }).catch((res) => {
        console.log(res)
      })
    },
    getQues() {
      var data = {
        Id: this.id,
        UserId: this.user.Id
      }
      QuesDetails(data).then(res => {
        if (!res.data.data.Id) {
          this.$message.warning('没有找到...')
          var close = document.querySelector('.tags-view-item.active .el-icon-close')
          close.click()
        }
        this.question = res.data.data
        this.isLike = res.data.data.Like || false
        this.isCollect = res.data.data.Collection || false
        this.showLoading = false
        this.Magnify()
        this.getFriendCorrect()
      }).catch((res) => {
        this.$message.warning('没有找到...')
        this.showLoading = false
        // var close = document.querySelector('.tags-view-item.active .el-icon-close')
        // close.click()
      })
    },
    Magnify() {
      var value = '<img'
      // 匹配图片标签正则
      var replaceReg = new RegExp(value, 'g')
      // 加上放大组件属性
      var replaceString = value + ' preview '
      // 开始替换
      this.question.Content = this.question.Content.replace(replaceReg, replaceString)
      this.question.Analysis = this.question.Analysis.replace(replaceReg, replaceString)
    },
    submit() {
      if (!this.$store.getters.user.Id) {
        this.$confirm('你还没有登录，不能进行该操作！前往登录', '提示', {
          confirmButtonText: '立即登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {})
        return
      }
      this.$refs.Form.validate(valid => {
        if (valid) {
          var datas = {
            'UserId': this.$store.getters.user.Id,
            'QuestionId': this.id,
            'MistakeCateId': this.form.CategoryId,
            'Correct': this.haveF.Correct
          }
          addMistake(this.$qs.stringify(datas)).then(res => {
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '加入错题成功',
              type: 'success'
            })
            this.getFriendCorrect()
          }).catch((msg) => {
            this.$message.warning('响应错误！')
          })
        }
      })
    },
    addMistakeType() {
      if (!this.$store.getters.user.Id) {
        this.$confirm('你这个操作，登录就能解决', '提示', {
          confirmButtonText: '立即登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {})
        return
      }
      this.$refs.addForm.validate(valid => {
        if (valid) {
          AddMistakeCate(this.$qs.stringify(this.toadd)).then(res => {
            if (res.data.code === 0) {
              this.$notify({
                title: '提示',
                message: '添加分类成功！',
                type: 'success'
              })
            } else {
              this.$message.warning('操作失败...')
            }
            this.showAdd = false
            this.GetCategory()
          }).catch(() => {})
        }
      })
    },
    // 获取题目分类
    GetCategory() {
      // 未登录 不请求
      if (!this.$store.getters.user.Id) {
        return
      }
      mistakeCate(this.$qs.stringify({ UserId: this.$store.getters.user.Id })).then(res => {
        this.typelist = res.data.data
      }).catch(() => {
        console.log('获取题目分类数据失败！')
      })
    },
    fetchDate() {
      this.id = this.$route.params.id
      if (this.id) {
        this.getQues()
        this.GetCategory()
      }
    }
  },
  mounted() {
    var That = this
    HaveCorrect = new this.$E(this.$refs.HaveCorrect)
    HaveCorrect.customConfig = {
      onchange: function(html) {
        That.haveF.Correct = html
      },
      uploadImgServer: Imgurl + '?service=App.Upload.Upload', // 上传图片到服务器
      uploadFileName: 'file', // 后端使用这个字段获取图片信息
      uploadImgMaxLength: 1, // 限制一次最多上传 1 张图片
      showLinkImg: false,
      uploadImgHooks: {
        customInsert: function(insertImg, result, editor) {
          var url = result.data.data.data
          // console.log(result.data.data.data)
          insertImg(url)
        }
      }
    }
    HaveCorrect.create()
  },
  created() {
    this.fetchDate()
  }
}
</script>

<style lang="scss" scoped>
    @import '../../styles/details.scss';
</style>
