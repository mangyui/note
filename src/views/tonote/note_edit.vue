<template>
  <div class="app-container">
    <span class="header-title">笔记编辑</span>
    <div v-if="showLoading" class="loading-box">
      <i class="el-icon-loading"></i>
      加载中...
    </div>
    <div class="crumbs disNone">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 笔记本</el-breadcrumb-item>
          <el-breadcrumb-item>修改笔记</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container big-box1200">
      <div class="noteEdit-title">
        <h4>笔记标题</h4>
        <el-input v-model="note.Headline" placeholder="请输入内容"></el-input>
      </div>
      <div class="noteEdit-title">
      <h4>笔记正文</h4>
        <div ref="editor" class="divWangeditor" style="text-align:left"></div>
        <!-- <quill-editor ref="myTextEditor" v-model="note.Content" :options="editorOption"></quill-editor> -->
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
        <el-form :model="note" ref="form">
          <!-- <el-form-item label="关键字">
            <el-input v-model="form.Keywords"></el-input>
          </el-form-item> -->
          <el-form-item label="笔记分类">
            <el-select v-model="note.NoteCategoryId" placeholder="请选择笔记分类">
              <el-option
                v-for="item in typelist"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确定修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// import { quillEditor } from 'vue-quill-editor'

// wangeditor 富文本
import E from 'wangeditor'
var editor

import { NoteCategory } from '@/api/toget'
import {
  UpdateNote,
  NoteDetails
} from '@/api/toPost'
import qs from 'qs'

export default {
  name: 'note_edit',
  data: function() {
    return {
      dialogFormVisible: false,
      showLoading: true,
      btnRight: '-96px',
      marginL: 0,
      totalwidth: 1430,
      typelist: [],
      note: {
        Id: '',
        Headline: '',
        Content: '',
        NoteCategoryId: ''
      }
    }
  },
  components: {

  },
  methods: {
    getCategory() {
      NoteCategory(this.$store.getters.user.Id).then(res => {
        if (res.data.code === 0) {
          this.typelist = res.data.data
        } else {
          this.$message.warning('获取笔记分类失败...')
        }
      }).catch(() => {})
    },
    submit() {
      if (this.note.Headline.trim().length === 0) {
        this.$notify({
          title: '提示',
          message: '笔记标题不能为空！',
          type: 'warning'
        })
        return
      }
      UpdateNote(qs.stringify(this.note)).then(res => {
        if (res.data.code === 0) {
          this.$router.push({
            path: '/tonote/note_detail/' + this.note.Id
          })
          this.dialogFormVisible = false
        } else {
          this.$message.warning('添加失败...')
        }
      }).catch(() => {})
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
      this.scroll(
        2)
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
    },
    getNote() {
      NoteDetails(qs.stringify({ Id: this.note.Id })).then(res => {
        this.note = res.data.data
        if (!this.note.UserId || this.note.UserId !== this.$store.getters.user.Id) {
          this.$message.warning('没有找到...')
          var close = document.querySelector('.tags-view-item.active .el-icon-close')
          close.click()
        } else {
          this.showLoading = false
          editor.txt.html(this.note.Content)
        }
      }).catch(() => {
        this.$message.warning('系统错误...')
      })
    },
    fetchDate() {
      this.note.Id = this.$route.params.id
      if (this.note.Id) {
        this.getNote()
      }
    }
  },
  // 注意
  // watch: {
  //   $route: 'fetchDate'
  // },
  created() {
    this.fetchDate()
    this.getCategory()
  },
  mounted() {
    var That = this
    editor = new E(this.$refs.editor)
    editor.customConfig = {
      onchange: function(html) {
        That.note.Content = html
      },
      uploadImgServer: '/api/UploadImg', // 上传图片到服务器
      uploadFileName: 'Content', // 后端使用这个字段获取图片信息
      uploadImgMaxLength: 1 // 限制一次最多上传 1 张图片
    }
    editor.customConfig.menus = [
      'head', // 标题
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
      // 'video',  // 插入视频
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
  // .quill-editor{
  //   .ql-snow.ql-toolbar{
  //     position: fixed;
  //     background: #fff;
  //     z-index: 10;
  //     border: 0;
  //     border-bottom: 1px solid rgba(0,0,0,.05);
  //     box-shadow: 0 1px 10px rgba(90,109,122,.4);
  //     text-overflow: ellipsis;
  //     white-space: nowrap;
  //     // overflow-x: hidden;
  //     // overflow-y: visible;
  //     left: 210px;
  //     right: 0;
  //     height: 55px;
  //     transition: all .28s;
  //     &::-webkit-scrollbar {
  //         display: none;
  //     }
  //     button,.ql-color-picker,.ql-icon-picker{

  //       margin: 5px;
  //       height: 28px;
  //       width: 31px;

  //       &:hover{
  //         background: #f1f3f6;
  //       }
  //     }
  //     .ql-picker:hover{
  //        background: #f1f3f6;
  //     }
  //   }

  //   .ql-container div.ql-editor{
  //     height: 100%;
  //     border-bottom: 1px solid rgba(0,0,0,.05);
  //     padding-top: 90px;
  //   }
  //   .ql-container.ql-snow{
  //     border: 0;
  //   }
  // }
  // .btn-wrapper{
  //   position: fixed;
  //   right: -96px;
  //   bottom: 200px;
  //   box-shadow: 0 1px 10px rgba(64, 158, 255,.5);
  //   transition: all 0.3s;
  //   .el-button{
  //     border-radius: 0;
  //     padding: 12px 16px;
  //   }
  // }
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
