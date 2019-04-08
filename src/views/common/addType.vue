<template>
  <el-dialog :title="MistakeOrNote==='note'?'添加笔记分类':'添加错题分类'" :visible.sync="showAdd">
    <el-form :model="toadd" :rules="rules" ref="Form" label-width="100px">
      <el-form-item label="分类名" prop="Name">
        <el-input v-model="toadd.Name"></el-input>
      </el-form-item>
      <el-form-item label="分类说明" prop="Intro">
        <el-input type="textarea" v-model="toadd.Intro"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="showAdd = false">取 消</el-button>
      <el-button size="small" type="primary" @click="addType">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  AddMistakeCate,
  AddNoteType
} from '@/api/toPost'

export default {
  name: 'addType',
  props: {
    MistakeOrNote: String
  },
  data() {
    return {
      showAdd: false,
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
          { min: 0, max: 30, message: '长度在 0 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    if (!this.MistakeOrNote) {
      console.log('MistakeOrNote null')
    }
  },
  methods: {
    addType() {
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
          if (this.MistakeOrNote === 'Mistake') {
            AddMistakeCate(this.$qs.stringify(this.toadd)).then(res => {
              this.successBack(res)
            }).catch((res) => {
              this.$message.error('操作错误')
              console.log(res)
            })
          } else if (this.MistakeOrNote === 'note') {
            AddNoteType(this.$qs.stringify(this.toadd)).then(res => {
              this.successBack(res)
            }).catch((res) => {
              this.$message.error('操作错误')
              console.log(res)
            })
          }
        }
      })
    },
    successBack(res) {
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
      this.$emit('addBack')
    }
  }
}
</script>
