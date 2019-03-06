<template>
  <div class="edit-container">
    <quill-editor ref="myTextEditor" v-model="content" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"></quill-editor>
    <div ref="btngroup" class="btn-wrapper" :style="{right: btnRight}">
      <el-button-group>
      <el-button class="btngroup_first" icon="el-icon-back" type="primary" @click="toright"></el-button>
      <el-button icon="el-icon-d-arrow-left" @click="scrollLeft"></el-button>
      <el-button icon="el-icon-d-arrow-right" @click="scrollRight"></el-button>
    </el-button-group>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'edit',
  data: function() {
    return {
      content: '<p><br></p><h3><span style="color: rgb(240, 102, 102);"> 注：当屏幕宽度 ‘小于’ 上方工具栏时，可通过 ‘右方的辅助按钮’ 进行工具栏的 左右 滑动 </span></h3><p><br></p>',
      editorOption: {
        placeholder: '等待提取中...'
      },
      btnRight: '-96px',
      marginL: 0,
      totalwidth: 1430
    }
  },
  components: {
    quillEditor
  },
  methods: {
    onEditorBlur() {
      // var top2 = document.querySelector('.scroll-container')
      // var sec = document.querySelector('.app-main')
      // top2.style.height = '50px'
      // sec.style.marginTop = '100px'
      // sec.style.height = 'calc(100% - 100px)'
    }, // 失去焦点事件
    onEditorFocus() {
      // var top2 = document.querySelector('.scroll-container')
      // var sec = document.querySelector('.app-main')
      // top2.style.height = 0
      // sec.style.marginTop = '50px'
      // sec.style.height = 'calc(100% - 50px)'
    }, // 获得焦点事件
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
    }

  }
}
</script>

<style lang="scss">
.edit-container{
  .quill-editor{
    .ql-snow.ql-toolbar{
      position: fixed;
      background: #fff;
      z-index: 10;
      border: 0;
      border-bottom: 1px solid rgba(0,0,0,.05);
      box-shadow: 0 1px 10px rgba(90,109,122,.4);
      text-overflow: ellipsis;
      white-space: nowrap;
      // overflow-x: hidden;
      // overflow-y: visible;
      left: 210px;
      right: 0;
      height: 55px;
      transition: all .28s;
      &::-webkit-scrollbar {
          display: none;
      }
      button,.ql-color-picker,.ql-icon-picker{

        margin: 5px;
        height: 28px;
        width: 31px;

        &:hover{
          background: #f1f3f6;
        }
      }
      .ql-picker:hover{
         background: #f1f3f6;
      }
    }

    .ql-container div.ql-editor{
      height: 100%;
      border-bottom: 1px solid rgba(0,0,0,.05);
      padding-top: 90px;
    }
    .ql-container.ql-snow{
      border: 0;
    }
  }
  .btn-wrapper{
    position: fixed;
    right: -96px;
    top: 185px;
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
  .edit-container{
    .quill-editor{
      .ql-container div.ql-editor{
       height: calc(100% - 56px);
      }
      // .ql-snow.ql-toolbar{
      //   overflow: auto;
      // }
    }
  }
}
</style>
