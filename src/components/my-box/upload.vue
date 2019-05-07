<template>
  <el-upload
    class="upload-demo"
    ref="upload"
    :limit="1"
    :accept="'video/*'"
    :action="upUrl"
    :on-success="handleSuccess"
    :on-change="handleChange"
    :on-error="handleError"
    :file-list="fileList">
    <el-button slot="trigger" size="small" type="success">选取视频</el-button>
    <span slot="tip" class="el-upload__tip" style="margin-left: 20px;">上传视频文件</span>
  </el-upload>
</template>

<script>
import { upVideo } from '@/api/upload'

export default {
  name: 'upload-box',
  data() {
    return {
      upUrl: upVideo,
      fileList: []
    }
  },
  methods: {
    handleError(response, file, fileList) {
      this.$notify({
        message: '网络错误',
        type: 'warning'
      })
      fileList.splice(0)
    },
    handleChange(file, fileList) {
      // console.log(file.raw.type)
      // if (file.raw.type === 'video/mp4' || file.raw.type === 'video/ogg' || file.raw.type === 'video/webm') {
      //   console.log(file.raw.type, fileList)
      // } else {
      //   this.$notify({
      //     message: '暂不支持该视频格式',
      //     type: 'warning'
      //   })
      //   fileList.splice(0)
      // }
    },
    handleSuccess(response, file, fileList) {
      if (response.ret !== 200) {
        this.$notify({
          message: '服务器错误',
          type: 'warning'
        })
        fileList.splice(0)
      }
      console.log('success', response)
    }
  }
}
</script>

<style>
.upload-demo{
  margin-bottom: 36px;
}
</style>
