<template>
  <div class="app-container">
      <div class="crumbs">
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
        <quill-editor ref="myTextEditor" v-model="note.Content" :options="editorOption"></quill-editor>
        <br/>
        <el-button class="editor-btn pull-right" type="primary" @click="dialogFormVisible = true">提交</el-button>
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
            <el-select v-model="note.NoteCategoryId" placeholder="请选择题目分类">
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
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

import { NoteCategory } from '@/api/toget'
import { AddNote } from '@/api/toPost'
import qs from 'qs'

export default {
  name: 'edit',
  data: function() {
    return {
      dialogFormVisible: false,
      editorOption: {
        placeholder: '等待输入中...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['code-block', 'link', 'image']
          ]
        }
      },
      btnRight: '-96px',
      marginL: 0,
      totalwidth: 1430,
      typelist: [],
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
      }
    }
  },
  components: {
    quillEditor
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
