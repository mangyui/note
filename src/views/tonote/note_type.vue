<template>
  <div class="app-container">
    <span class="header-title">笔记分类</span>
    <div class="crumbs disNone">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 笔记本</el-breadcrumb-item>
          <el-breadcrumb-item>笔记分类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="big-box1200">
      <div class="list-gbtn">
        <div></div>
        <div>
          <el-button icon="el-icon-refresh" circle @click="getCategory"></el-button>
          <el-button type="primary" icon="el-icon-plus" @click="showAdd=!showAdd" circle></el-button>
          <!-- <el-button type="danger" icon="el-icon-delete" circle @click="showDelete=!showDelete"></el-button> -->
        </div>
      </div>
      <div class="container">
        <div v-if="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div v-if="!types[0] && !showLoading" class="loading-box">
          <i class="el-icon-search"></i>
          空空如也...
        </div>
        <el-row :gutter="15">
          <el-col  :xs="12" :sm="12" :md="8" :lg="8" :xl="8" v-for="(item,index) in types" :key="index">
              <el-card>
                <i v-if="showDelete" class="el-icon-close icon-delete" @click="toDetele(item.Id)"></i>
                <div class="big-box">
                  <div class="big-body">
                    <b class="type_title">{{item.Name}}</b>
                    <div><p class="tipbox type_content" v-html="item.Intro"></p></div>
                  </div>
                </div>
              </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog title="添加笔记分类" :visible.sync="showAdd">
      <el-form :model="toadd" :rules="rules" ref="Form" label-width="100px">
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

import {
  AddNoteType
} from '@/api/toPost'

import { NoteCategory } from '@/api/toget'
import qs from 'qs'

export default {
  name: 'note_type',
  data() {
    return {
      homeTop: 0,
      showLoading: true,
      showDelete: false,
      showAdd: false,
      types: [],
      toadd: {
        UserId: this.$store.getters.user.Id,
        Name: '',
        Intro: ''
      },
      rules: {
        Name: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        Intro: [
          { required: true, message: '请输入分类说明', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCategory()
  },
  activated() {
    document.querySelector('.app-main').scrollTop = this.homeTop || 0
    this.getCategory()
  },
  methods: {
    getCategory() {
      this.showLoading = true
      NoteCategory(this.$store.getters.user.Id).then(res => {
        if (res.data.code === 0) {
          this.types = res.data.data
        } else {
          this.$message.warning('获取笔记分类失败...')
        }
        this.showLoading = false
      }).catch(() => {})
    },
    addNoteType() {
      this.$refs.Form.validate(valid => {
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
    }
    // toDetele(index) {
    //   this.$confirm('此操作将永久删除该错题, 是否继续?', '提示', {
    //     confirmButtonText: '确定不要了',
    //     cancelButtonText: '先留着吧',
    //     type: 'warning'
    //   }).then(() => {
    //     DeteleNote(qs.stringify({ Id: index })).then(res => {
    //       if (res.data.code === 0) {
    //         this.$message.success('删除成功...')
    //       } else {
    //         this.$message.warning('操作失败...')
    //       }
    //       this.getNotes()
    //     }).catch(() => {})
    //     //
    //   }).catch(() => {})
    // }
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
    font-size: 18px;
    margin-bottom: 5px;
    display: inline-block;
  }
  .type_content {
    margin-bottom: 0;
    line-height: 26px;
    font-size: 14px;
    padding: 10px;
    background-color: #fef0f0;
    max-height: 124px;
    overflow: hidden;
  }
}
</style>
