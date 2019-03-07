<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/tonote/notes' }"><i class="el-icon-date"></i> 笔记列表</el-breadcrumb-item>
          <el-breadcrumb-item>笔记详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div  class="note_d-title">
      <h3>{{note.title}}</h3>
      <el-tag size="small">笔记</el-tag>
      <p class="note_d-remark">{{note.category}} | {{note.datetime}}</p>
    </div>
    <div class="note_d-content" v-html="note.content"></div>
  </div>
</template>

<script>
export default {
  name: 'note_detail',
  data() {
    return {
      note: {
        title: '向往春常在',
        category: '笔记',
        datetime: '2019/12/11 08:08:08',
        content: '<h6>我是正文</h6><p>我是正文</p>'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.note_d-title{
  text-align: center;
}
.note_d-remark{
  font-size: 12px;
  color: #666;
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}
.note_d-content{
  padding: 10px 3px 3px 3px;
}
</style>
