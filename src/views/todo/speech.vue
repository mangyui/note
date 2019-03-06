<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 语音播放测试</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div>
        <el-input class="speech_text" type="textarea" v-model="text"></el-input>
        <div class="speech_btn">
          <el-checkbox v-model="isEng" label="英文" border></el-checkbox>
          <el-button type="primary" @click="tospeech">语音播放</el-button>
        </div>
      </div>
      <h5>示例</h5>
      <div class="alert_list_item" v-for="(item,index) in speechList" :key="index">
        <el-alert
          :title="item.text"
          type="info"
          :closable="false"
          show-icon>
        </el-alert>
        <el-button type="primary" icon="el-icon-service" circle @click="onRun(item.text, item.lang)"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'speech',
  components: {
  },
  data() {
    return {
      text: '请将您要播放的语句写到这里...',
      isEng: false,
      speechList: [
        {
          id: 1,
          text: 'For this example, they show what you see in Listing 2.',
          lang: 'en-US'
        },
        {
          id: 2,
          text: '例如，它们可以显示您在列表2 中看到的内容。',
          lang: 'zh-CN'
        },
        {
          id: 3,
          text: 'Listing 2 shows an example of how to do this.',
          lang: 'en-US'
        }
      ]
    }
  },
  methods: {
    tospeech() {
      if (this.isEng === false) {
        this.onRun(this.text, 'zh-CN')
      } else {
        this.onRun(this.text, 'en-US')
      }
    },
    onRun(mess, tolang) {
      if (!('speechSynthesis' in window)) {
        this.$message({
          message: '对不起，您的设备不支持该功能',
          type: 'error'
        })
        return
      }
      // 以cancel(终止) -> speak(加入播放) ->resume(重新开始) 达到非第一次播放时直接覆盖之前的播放。测试了好久...
      window.speechSynthesis.cancel()

      var msg = new SpeechSynthesisUtterance(mess)
      msg.lang = tolang || 'zh-CN'
      window.speechSynthesis.speak(msg)

      window.speechSynthesis.resume()
    }
  }
}
</script>

<style lang="scss">
.speech_text{
  .el-textarea__inner{
    padding: 10px;
    margin: 5px 0;
    height: 100px;
  }
}
.speech_btn{
  margin: 15px 0;
  text-align: center;
}
.alert_list_item{
  margin-top: 30px;
  padding-bottom: 50px;
  border-bottom: 1px solid #ebeef5;
  .el-alert{
    padding: 16px;
    margin-bottom: 5px;
    .el-alert__title{
      font-size: 14px;
    }
  }
  .el-button{
    float: right;
  }
}
</style>
