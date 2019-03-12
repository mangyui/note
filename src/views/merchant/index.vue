<template>
  <div class="app-container">
    <span class="header-title">商城</span>
    <h2 class="top-title disNone">商城</h2>
    <el-tabs @tab-click="handleClick">
      <el-tab-pane :label="'商家'+(index1+1)" v-for="(item1,index1) in moreList" :key="index1">
        <el-row :gutter="10">
          <el-col v-for="(item2,index2) in 10" :key="index2" :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
            <div class="more_item">
              <router-link to="#">
                <el-card :body-style="{ padding: '0px' }">
                  <img :src="item1.img" class="image">
                  <div style="padding: 10px;">
                    <b>{{item1.content}}</b>
                  </div>
                  <div class="sale-bottom">
                    <span class="price">￥{{item1.price}}</span>
                    <span class="sale">已售{{item1.sale}}</span>
                  </div>
                </el-card>
              </router-link>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
import nxSvgIcon from '@/components/nx-svg-icon/index'

export default {
  name: 'merchant',
  components: {
    nxSvgIcon,
    activeName: '1号商家'
  },
  data() {
    return {
      moreList: [
        {
          id: 1,
          title: '1号商家',
          img: './static/img/merchant/s1.jpg',
          route: '#',
          color: '#F56C6C',
          content: 'PS全套入门到精通',
          price: '99',
          sale: 66
        },
        {
          id: 2,
          title: '2号商家',
          img: './static/img/merchant/s2.jpg',
          route: '#',
          color: '#409EFF',
          content: 'Excel企业办公全套教程',
          price: '99',
          sale: 999
        },
        {
          id: 3,
          title: '3号商家',
          img: './static/img/merchant/s3.jpg',
          route: '#',
          color: '#52bab5',
          content: '软面皮书',
          price: '9',
          sale: 666
        },
        {
          id: 4,
          title: '4号商家',
          img: './static/img/merchant/s4.jpg',
          route: '#',
          color: '#52bab5',
          content: '晨光工具-中性笔',
          price: '19',
          sale: 9999
        },
        {
          id: 5,
          title: '5号商家',
          img: './static/img/merchant/s5.jpg',
          route: '#',
          color: '#52bab5',
          content: '晨光工具-橡皮擦',
          price: '9',
          sale: 666
        },
        {
          id: 1,
          title: '1号商家',
          img: './static/img/merchant/s1.jpg',
          route: '#',
          color: '#F56C6C',
          content: 'PS全套入门到精通',
          price: '99',
          sale: 66
        },
        {
          id: 2,
          title: '2号商家',
          img: './static/img/merchant/s2.jpg',
          route: '#',
          color: '#409EFF',
          content: 'Excel企业办公全套教程',
          price: '99',
          sale: 999
        },
        {
          id: 3,
          title: '3号商家',
          img: './static/img/merchant/s3.jpg',
          route: '#',
          color: '#52bab5',
          content: '软面皮书',
          price: '9',
          sale: 666
        },
        {
          id: 4,
          title: '4号商家',
          img: './static/img/merchant/s4.jpg',
          route: '#',
          color: '#52bab5',
          content: '晨光工具-中性笔',
          price: '19',
          sale: 9999
        },
        {
          id: 5,
          title: '5号商家',
          img: './static/img/merchant/s5.jpg',
          route: '#',
          color: '#52bab5',
          content: '晨光工具-橡皮擦',
          price: '9',
          sale: 666
        }
      ]
    }
  },
  methods: {
    handleClick() {

    }
  }
}
</script>

<style lang="scss" scoped>
.top-title{
  margin: 0 0 20px ;
}
.more_item{
  text-align: center;
  margin: 5px 0;
  .el-card{
    .sale-bottom{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px;
      .price{
        color: red;
        font-size: 19px;
        font-weight: bold;
      }
      .sale{
        color: #aaa;
        font-size: 13px;
      }
    }
  }
}
</style>
