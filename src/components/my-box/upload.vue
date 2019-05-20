<template>
  <div>
    <el-upload
      class="upload-demo"
      ref="upload"
      :limit="1"
      :accept="'video/*'"
      :action="upUrl"
      :on-success="handleSuccess"
      :on-change="handleChange"
      :on-error="handleError"
      :on-remove="handleRemove"
      :file-list="fileList">
      <el-button slot="trigger" type="success">选取视频</el-button>
      <span class="el-upload__tip" style="margin: 0 20px;">上传视频文件</span>
    </el-upload>
    <el-form v-show="fileList[0]" ref="form" label-width="120px">
      <el-form-item label="视频价值金币数">
        <el-select v-model="cost" @change="changeCost" placeholder="观看者需付费的金币数">
          <el-option
            v-for="item in numList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!-- <el-input style="width: 300px;" v-model="cost" :blur="changeCost" :min="0"  placeholder="观看者需付费的金币数"></el-input> -->
      </el-form-item>
      </el-form>
  </div>
</template>

<script>
import { upVideo } from '@/api/upload'

export default {
  name: 'upload-box',
  data() {
    return {
      upUrl: upVideo,
      fileList: [],
      costBox: false,
      numList: [{
        value: '0',
        label: '0'
      }, {
        value: '1',
        label: '1'
      }, {
        value: '2',
        label: '2'
      }, {
        value: '5',
        label: '5'
      }, {
        value: '10',
        label: '10'
      }, {
        value: '20',
        label: '20'
      }, {
        value: '100',
        label: '100'
      }],
      cost: '1'
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.$emit('getVideoUrl', 0)
    },
    changeCost() {
      this.$emit('changeCost', this.cost)
    },
    handleError(response, file, fileList) {
      this.$notify({
        message: '网络错误',
        type: 'warning'
      })
      fileList.splice(0)
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleSuccess(response, file, fileList) {
      if (response.ret !== 200) {
        this.$notify({
          message: '服务器错误',
          type: 'error'
        })
        fileList.splice(0)
      } else {
        if (response.data.code === 0 && response.data.data.data[0]) {
          this.$emit('getVideoUrl', response.data.data.data[0])
          this.$emit('changeCost', this.cost)
          // console.log(response.data.data.data[0])
        } else {
          this.$notify({
            message: '上传失败，请检查视频重新上传',
            type: 'warning'
          })
          fileList.splice(0)
        }
      }
    }
  }
}
</script>

<style>
.upload-demo{
  margin-bottom: 36px;
}
</style>
