<template>
<div>
  <br>
  <el-carousel :interval="4000" type="card" :height="imgHeight" class="iiii" >
    <el-carousel-item v-for="(item,index) in product" :key="index">
      <img ref="imgHeight" :src="item.src">
    </el-carousel-item>
  </el-carousel>
  <el-col v-for="(item,index) in movies" :key="index" :span="24">
    <div class="movie_item">
      <div class="movie_header">
        <div class="movie_left">
          <p>{{item.title}}</p>
          <p class="p_2">{{item.buy}}</p>
        </div>
        <div class="movie_right">
          <el-tag type="danger" style="font-size:20px;margin-right:10px;"><i class="iconfont icondingyue" style="font-size:20px megint-right:10px;"></i>购买</el-tag>
        </div>
        <div style="clear:both;"></div>
      </div>
      <div class="movie_body">
        <div :style="{margin:' 0 auto',width: screenWidth>768?'600px':'100%'}">
          <dPlayer ref="player" :options="options"></dPlayer>
        </div>
        <!-- <video src="https://ugcbsy.qq.com/uwMROfz2r5xoIaQXGdGnC2dfJ7FGBru-Ct_gvGvMvMOgtaaJ/y0516zsz2s4.p709.1.mp4?sdtfrom=v1010&guid=9d46ed8a40a2bbfc945ab34d2a91b7bf&vkey=F039562501F18485D003C9D6921BE3A29996958B4E7A5E07E0F98AD33D3180F74BDFC4A785A703C39E43F0A5B8E5EC59F26A5CCA60A345A74B87F89A3814967326B94AD482E14C98094E5BB8E3B78600687D3B934A2CDC19EA72E6ADCFF83CE3861B9F1CC8E09F38AA5EA342284823B979F68409E2A3B433" style="width:60%;margin-left:20%;display:display;" preload="auto" controls="controls"></video> -->
        <p>{{item.descript}}</p>
      </div>
    </div>
  </el-col>
</div>
</template>

<script>
import dPlayer from 'vue-dplayer'
import 'vue-dplayer/dist/vue-dplayer.css'
export default {
  name: 'goodcard2',
  components: {
    dPlayer
  },
  props: ['product'],
  data() {
    return {
      options: {
        video: {
          url: 'http://goodtimp-vnote.oss-cn-hangzhou.aliyuncs.com/videos/2019/05/151154631.mp4',
          pic: './static/img/merchant/mvideo.png'
        },
        autoplay: false
      },
      screenWidth: document.body.clientWidth,
      imgHeight: $(window).width(),
      movies: [
        {
          title: '金星教育',
          descript: '数学基础强化、奥数思维培养、逻辑考题训练',
          buy: '2135已人购买'
        },
        {
          title: '黑马教育',
          descript: '英语听力提升、英语口语锻炼',
          buy: '500+已人购买'
        },
        {
          title: '启航教育',
          descript: '单词记忆强化',
          buy: '200+已人购买'
        }
      ]
    }
  },
  methods: {
    onResize() {
      this.toChange()
      $(window).resize(() => {
        this.toChange()
      })
    },
    toChange() {
      var $width = $(window).width()
      this.screenWidth = $width
      if ($width > 1500) {
        this.imgHeight = '400px'
      } else if ($width > 1200) {
        this.imgHeight = '360px'
      } else if ($width > 960) {
        this.imgHeight = '320px'
      } else if ($width > 768) {
        this.imgHeight = '240px'
      } else if ($width > 480) {
        this.imgHeight = '150px'
      } else {
        this.imgHeight = '100px'
      }
    }
  },
  created() {
    this.onResize()
  }
}
</script>

<style scoped>
@media screen and (min-width:1200px) {
  .mymedia {height: 650px;}
}
@media screen and (min-width: 960px) and (max-width: 1199px) {
  .mymedia {height: 350px;}
}
@media screen and (min-width: 768px) and (max-width: 959px) {
  .mymedia {height: 300px;}
}
@media only screen and (min-width: 480px) and (max-width: 767px) {
  .mymedia {height: 200px;}
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
/* css */
.movie_item{
  border-top: 1px solid rgb(124, 124, 124);
  border-bottom: 1px solid rgb(124, 124, 124);
  padding-top: 5px;
  margin-bottom: 15px;
  margin-top: 10px;
}
.movie_header{
  height: 100%;
}
.movie_header .movie_left {
  padding-top: 5px;
  height: 52px;
  float: left;
}
.movie_header .movie_right {
  float:right;
  height: 52px;
}
.movie_left p{
  font-size: 20px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
}
.movie_left .p_2{
  margin-top: 5px;
  font-size: 14px;
  color: rgb(124, 124, 124);
  text-indent: 0.5em;
}
.movie_right{
  line-height: 52px;
}
.movie_body {
  margin: 20px auto 30px auto;
  width: 100%;
}
.movie_body p{
  font-size: 15px;
  text-align: center;
  margin-top: 10px;
}
</style>
