<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 第三方网站</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="10">
      <el-col :span="6" :xs="12" :sm="8" :md="6"  v-for="(item,index) in webs" :key="index">
        <router-link v-bind="{to:'/other/open/'+item.id}">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <img :src="item.img"  :style="{backgroundImage:'url(' + item.img + ')'}" class="image">
            <div class="card-title" style="padding: 14px;">
              <span>{{item.title}}</span>
            </div>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'webs',
  data() {
    return {
      webs: [
        {
          id: 1,
          title: '百度',
          url: 'https://www.baidu.com/',
          img: 'https://www.baidu.com/img/bd_logo1.png'
        },
        {
          id: 2,
          title: '百度翻译',
          url: 'https://fanyi.baidu.com/',
          img: 'https://fanyi.bdstatic.com/static/translation/img/header/logo_cbfea26.png'
        },
        {
          id: 3,
          title: '百度文库',
          url: 'https://wenku.baidu.com/',
          img: 'static/img/mock/card/wenku.jpg'
        }
      ]
    }
  },
  methods: {

  }

}
</script>

<style scoped>
.image{
  width: 100%;
  height: 0;
  padding-bottom: 56%;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
}
.el-col{
  margin-top: 5px;
  margin-bottom: 5px;
}
.card-title{
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin-top: -50px;
  position: relative;
}
</style>
