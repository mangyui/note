<template>
  <div class="ques-list">
    <div class="ques-list_item" v-for="(item,index) in questions" :key="index">
      <div class="ques_box">
        <i v-show="showDelete" class="el-icon-close icon-delete" @click="toDetele(item.Id)"></i>
        <router-link :to="'/home/mistake/'+item.Id">
          <div class="ques_body tipbox">
            <b>{{index+1}}.</b><div v-html="item.QuestionContent||item.Question.Content"></div>
          </div>
        </router-link>
        <el-button class="downMore" @click="clickfun($event)" type="primary" icon="el-icon-caret-bottom" size="mini" ></el-button>
        <div class="ques_footer">
          <nx-svg-icon class-name='international-icon' icon-class="zan" /><span class="ques_footer_num">{{item.LikeNumber}}</span>
          <nx-svg-icon class-name='international-icon' icon-class="collect" /><span class="ques_footer_num">{{item.CollectNumber}}</span>
          <el-tag v-if="item.QuestionContent" type="info">个人</el-tag>
          <el-tag v-if="!item.QuestionContent">官方</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  DeleteMistake
} from '@/api/toPost'
import nxSvgIcon from '@/components/nx-svg-icon/index'
export default {
  name: 'misList',
  components: {
    nxSvgIcon
  },
  props: {
    questions: Array
  },
  data() {
    return {
      showDelete: false
    }
  },
  methods: {
    toDetele(index) {
      this.$confirm('此操作将永久删除该错题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteMistake(this.$qs.stringify({ Id: index, UserId: this.$store.getters.user.Id })).then(res => {
          if (res.data.code === 0) {
            this.$notify({
              title: '提示',
              message: '删除成功！',
              type: 'info'
            })
          } else {
            this.$message.warning('操作失败...')
          }
          this.toSearch()
        }).catch(() => {})
        //
      }).catch(() => {})
    },
    clickfun(e) {
      var p = e.currentTarget.previousElementSibling.firstElementChild
      if (p.style.maxHeight === '1000px') {
        p.style.maxHeight = '200px'
        e.currentTarget.firstElementChild.style.transform = ''
      } else {
        p.style.maxHeight = '1000px'
        e.currentTarget.firstElementChild.style.transform = 'rotate(180deg)'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// .btn-detele{
//   position: absolute;
//   right: 5px;
//   top: 5px;
//   color: #F56C6C;
// }
</style>
