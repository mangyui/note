<template>
  <div class="app-container">
    <h2 class="top-title">商家</h2>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="'商家'+(index+1)" v-for="(item,index) in 5" :key="index"  :name="index">
        <el-row :gutter="10">
          <el-col v-for="(item,index) in moreList" :key="index" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <div class="more_item">
              <router-link :to="item.route">
                <el-card :body-style="{ padding: '0px' }">
                  <img :src="item.img" class="image">
                  <div style="padding: 14px;">
                    <span>{{item.title}}</span>
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
    activeName: '1'
  },
  data() {
    return {
      moreList: [
        {
          id: 1,
          title: '1号商家',
          img: './static/img/merchant/merchant_1.jpg',
          route: '#',
          color: '#F56C6C'
        },
        {
          id: 2,
          title: '2号商家',
          img: './static/img/merchant/merchant_2.jpg',
          route: '#',
          color: '#409EFF'
        },
        {
          id: 3,
          title: '3号商家',
          img: './static/img/merchant/merchant_3.jpg',
          route: '#',
          color: '#52bab5'
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
  margin: 20px 0 30px;
  .el-card{
    img{
      padding: 20px 0;
    }
  }
}
</style>
