<template>
  <div class="app-container">
    <span class="header-title">添加笔记</span>
      <div class="crumbs disNone">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-date"></i> 添加笔记</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    <div class="container big-box1200">
      <div class="noteEdit-title">
        <h4>笔记标题</h4>
        <el-input v-model="note.Headline" placeholder=""></el-input>
      </div>
      <div class="noteEdit-title">
      <h4>笔记正文</h4>
        <div ref="editor" class="divWangeditor" style="text-align:left"></div>
        <!-- <br/>
        <quill-editor ref="myTextEditor" v-model="note.Content" :options="editorOption"></quill-editor> -->
        <br/>
        <el-button type="primary" @click="dialogFormVisible = true">提交</el-button>
      </div>
      <!-- <div ref="btngroup" class="btn-wrapper" :style="{right: btnRight}">
        <el-button-group>
        <el-button class="btngroup_first" icon="el-icon-back" type="primary" @click="toright"></el-button>
        <el-button icon="el-icon-d-arrow-left" @click="scrollLeft"></el-button>
        <el-button icon="el-icon-d-arrow-right" @click="scrollRight"></el-button>
      </el-button-group>
      </div> -->
      <el-dialog title="笔记备注" :visible.sync="dialogFormVisible">
        <el-form :model="note" :rules="rules" ref="Form">
          <!-- <el-form-item label="关键字">
            <el-input v-model="form.Keywords"></el-input>
          </el-form-item> -->
          <el-form-item label="笔记分类" prop="NoteCategoryId">
            <el-select v-model="note.NoteCategoryId" placeholder="请选择笔记分类">
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
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog title="添加笔记分类" :visible.sync="showAdd">
      <el-form :model="toadd" :rules="addrules" ref="addForm" label-width="100px">
        <el-form-item label="笔记分类名" prop="Name">
          <el-input v-model="toadd.Name"></el-input>
        </el-form-item>
        <el-form-item label="分类说明" prop="Intro">
          <el-input type="textarea" v-model="toadd.Intro"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addNoteType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// vue-quill-editor 富文本
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// import { quillEditor } from 'vue-quill-editor'

// import '@/assets/js/editor/css/wangEditor.min.css'
// import '@/assets/js/editor/js/wangEditor.min.js'
// import '@/assets/js/editor/js/custom-menu.js'

// wangeditor 富文本
import E from 'wangeditor'
var editor

import { NoteCategory } from '@/api/toget'
import { AddNote, AddNoteType } from '@/api/toPost'
import qs from 'qs'

export default {
  name: 'edit',
  data: function() {
    return {
      dialogFormVisible: false,
      showAdd: false,
      btnRight: '-96px',
      marginL: 0,
      totalwidth: 1430,
      typelist: [],
      Content: '',
      note: {
        UserId: this.$store.getters.user.Id,
        Headline: '',
        Content: '',
        NoteCategoryId: ''
      },
      rules: {
        NoteCategoryId: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ]
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
  components: {
    // quillEditor
  },
  created() {
    this.getCategory()
  },
  methods: {
    getCategory() {
      if (!this.$store.getters.user.Id) {
        return
      }
      NoteCategory(this.$store.getters.user.Id).then(res => {
        if (res.data.code === 0) {
          this.typelist = res.data.data
        } else {
          this.$message.warning('获取笔记分类失败...')
        }
      }).catch(() => {})
    },
    addNoteType() {
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
          AddNoteType(qs.stringify(this.toadd)).then(res => {
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
            this.getCategory()
          }).catch(() => {})
        }
      })
    },
    submit() {
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
      if (this.note.Headline.trim().length === 0) {
        this.$notify({
          title: '提示',
          message: '笔记标题不能为空！',
          type: 'warning'
        })
        // this.note.Content += '<br/>'
        console.log(this.note.Content)
        return
      }
      this.$refs.Form.validate(valid => {
        if (valid) {
          AddNote(qs.stringify(this.note)).then(res => {
            if (res.data.code === 0) {
              this.$router.push({
                path: '/tonote/note_detail/' + res.data.data
              })
              this.dialogFormVisible = false
            } else {
              this.$message.warning('添加失败...')
            }
          }).catch(() => {})
        }
      })
    },
    toright() {
      this.btnRight = this.btnRight === '0' ? '-96px' : '0'
      var btnF = document.querySelector('.btngroup_first .el-icon-back')
      btnF.style.transform = this.btnRight === '0' ? 'rotate(180deg)' : ''
    },
    scrollRight() {
      this.scroll(-2)
    },
    scrollLeft() {
      this.scroll(2)
    },
    scroll(nn) {
      // var toolbar = document.getElementsByClassName('ql-toolbar')[0]
      // toolbar.style.left = toolbar.offsetLeft + nn + 'px'
      // console.log(toolbar.offsetLeft)
      var toolbar = document.querySelector('.ql-toolbar')
      var toobarWidth = toolbar.offsetWidth - 1430

      var firstchild = document.querySelector('.ql-formats')
      var ov = setInterval(() => {
        // toolbar.scrollBy(nn, 0)
        if (this.marginL <= 0 && this.marginL >= toobarWidth) {
          this.marginL = this.marginL + nn
          if (this.marginL > 0) {
            this.marginL = 0
          }
          if (this.marginL < toobarWidth) {
            this.marginL = toobarWidth
          }
        }
        firstchild.style.marginLeft = this.marginL + 'px'
      }, 2)
      setTimeout(function() {
        clearInterval(ov)
      }, 500)
    }
  },
  mounted() {
    var That = this
    editor = new E(this.$refs.editor)
    console.log(editor.customConfig)
    editor.customConfig = {
      onchange: function(html) {
        That.note.Content = html
        // console.log(That.note.Content)
      },
      uploadImgServer: 'http://1975386453.38haotyhn.duihuanche.com/?service=App.Upload.Upload', // 上传图片到服务器
      uploadFileName: 'Content', // 后端使用这个字段获取图片信息
      uploadImgMaxLength: 1 // 限制一次最多上传 1 张图片
    }
    editor.customConfig.menus = [
      'head1', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'code', // 插入代码
      'symbols',
      'undo', // 撤销
      'redo' // 重复
    ]
    editor.create()
  }
}
</script>

<style lang="scss">
.edit-container{
  .noteEdit-title{
    margin-bottom: 25px;
    padding: 5px;
  }
  .btn-wrapper{
    position: fixed;
    right: -96px;
    bottom: 200px;
    box-shadow: 0 1px 10px rgba(64, 158, 255,.5);
    transition: all 0.3s;
    .el-button{
      border-radius: 0;
      padding: 12px 16px;
    }
  }
}
@media (max-width: 768px)
{
  // .edit-container{
  //   .quill-editor{
  //     .ql-container div.ql-editor{
  //      height: calc(100% - 56px);
  //     }
  //     // .ql-snow.ql-toolbar{
  //     //   overflow: auto;
  //     // }
  //   }
  // }
}
</style>
