<template>
     <!-- <el-button type="warning" icon="el-icon-star-off" circle></el-button>
    <el-button type="primary" round
    @contextmenu="menuPop"
    @mousedown="startRecording($event)"
    @mouseup="stopRecording($event)"
    @mouseleave="stopRecording($event)"
    @touchstart="startRecording($event)"
    @touchend="stopRecording($event)"
    @touchleave="stopRecording($event)"
     >开始</el-button>
    <el-button type="success" round @click="stopRecording">停止</el-button>
    <el-button type="danger" round @click="uploadAudio">上传</el-button>-->
    <!-- <el-button type="info" round @click="playRecording">播放</el-button> -->
    <div class="voice-input-button" v-if="isAudioAvailable" :class="{'active': recording}">
      <div class="record-btn"
        v-if="!processing"
        @contextmenu="menuPop"
        @mousedown="start($event)"
        @mouseup="stop($event)"
        @mouseleave="stop($event)"
        @touchstart="start($event)"
        @touchend="stop($event)"
        @touchleave="stop($event)"
      >
        <microphone v-if="!recording" color="#fff"></microphone>
        <recording-icon v-else color="#eee"></recording-icon>
        <recording-tip v-if="recording" :position="tipPosition"><slot name="recording">录音中…</slot></recording-tip>
        <recording-tip v-if="blank" :position="tipPosition"><slot name="no-speak">没听见，大点声</slot></recording-tip>
      </div>
      <loading v-else color="#fff"></loading>
      <audio v-show="false" id="audios"  controls autoplay></audio>
  </div>
</template>

<script>
import HZRecorder from '@/assets/js/HZRecorder.js'
var recorder
import loading from './components/icons/loading'
import recordingIcon from './components/icons/recording-icon'
import microphone from './components/icons/microphone'
import recordingTip from './components/recording-tip'

export default {
  name: 'voice',
  components: {
    loading,
    recordingIcon,
    microphone,
    recordingTip
  },
  data() {
    return {
      audio: '',
      recorder: null,
      processing: false,
      startTime: 0,
      time: 0,
      timer: null,
      recording: false,
      inputTarget: null,
      isAudioAvailable: true,
      blank: false,
      tipPosition: 'top'
    }
  },
  methods: {
    menuPop() {
      window.event.returnValue = false
      return false
    },
    start(e) {
      e.preventDefault()
      if (this.recording || this.processing || (e.which !== 1 && e.which !== 0)) return
      this.blank = false
      this.recording = true
      // console.log(1)
      HZRecorder.get(function(rec) {
        recorder = rec
        recorder.start()
      })
    },
    stop(e) {
      e.preventDefault()
      if (!this.recording || (e.which !== 1 && e.which !== 0)) return
      this.recording = false
      // console.log(2)
      this.processing = true
      recorder.stop()
      this.uploadAudio()
    },
    // startRecording(e) {
    //   e.preventDefault()
    //   console.log(HZRecorder)
    //   HZRecorder.get(function(rec) {
    //     recorder = rec
    //     recorder.start()
    //   })
    // },
    // stopRecording(e) {
    //   e.preventDefault()
    //   recorder.stop()
    //   this.uploadAudio()
    // },
    playRecording() {
      recorder.play(this.audio)
      // console.log(this.audio)
    },
    uploadAudio() {
      recorder.upload((state, e) => {
        switch (state) {
          case 'uploading':
            // var percentComplete = Math.round(e.loaded * 100 / e.total) + '%';
            break
          case 'ok':
            // alert(e.target.responseText);
            // alert('上传成功')
            if (e.data === '') {
              this.blank = true
              setTimeout(() => {
                this.blank = false
              }, 2000)
            } else {
              // console.log(e.data)
              this.$emit('record', e.data)
            }
            // window.location.href='VideoSearchServlet.do'
            break
          case 'error':
            console.log('上传失败:' + e.data.desc)
            break
          case 'cancel':
            console.log('上传被取消')
            break
        }
        this.processing = false
      })
    }
  },
  mounted() {
    this.audio = document.querySelector('#audios')
    // console.log(document.querySelector('#audios'))
  }
}
</script>

<style lang="scss" scoped>
.voice-input-button{
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .record-btn{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &.disabled{
        pointer-events: none;
        cursor: not-allowed;
      }
      > * {
        pointer-events: none;
      }
    }
  }
  .loader{
    display: inline-block;
    margin: 0 5px;
  }
  .pop{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 40%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,.5);
    pointer-events: none;
    opacity: 0;
    transition: opacity .1s;
    &.recording{
      opacity: 1;
    }
  }
</style>
