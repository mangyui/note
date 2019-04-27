<template>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="margin-top:20px;margin-left:20px;">
      <el-tab-pane label="商家一" name="first">
          <div>
            <h2>商家一</h2>
          </div>
            <div class="app-container">
              <div class="item">
                <h4>文具</h4>
                <nxDataCard :option="easyDataOption0"></nxDataCard>
              </div>
            </div>
      </el-tab-pane>
      <el-tab-pane label="商家二" name="second">   <div>
            <h2>商家二</h2>
          </div>
            <div class="app-container">
              <div class="item">
                <h4>文具</h4>
                <nxDataCard :option="easyDataOption0"></nxDataCard>
              </div>
            </div></el-tab-pane>
      <el-tab-pane label="商家三" name="third">   <div>
            <h2>商家三</h2>
          </div>
            <div class="app-container">
              <div class="item">
                <h4>文具</h4>
                <nxDataCard :option="easyDataOption0"></nxDataCard>
              </div>
            </div></el-tab-pane>
      <el-tab-pane label="商家四" name="fourth">   <div>
            <h2>商家四</h2>
          </div>
            <div class="app-container">
              <div class="item">
                <h4>文具</h4>
                <nxDataCard :option="easyDataOption0"></nxDataCard>
              </div>
            </div></el-tab-pane>
    </el-tabs>
</template>
<script>
import nxDataCard from '@/components/my-data-card/nx-data-card'
export default {
  name: 'report',
  components: {
    nxDataCard
  },
  data() {
    return {
      activeName: 'first',
      easyDataOption0: {
        span: 6,
        borderColor: '#fff',
        data: [
          {
            name: '铅笔',
            src: './static/img/merchant/w3.jpg',
            text: '根据实际需要，2B铅笔墨的深度适合考试涂机读卡、容易书写',
            price: '1.5'
          },
          {
            name: '笔记本',
            src: './static/img/merchant/w2.jpg',
            text: '这是一款多彩设计的无线装订软抄本本，与众不同，给你的办公、学习生活添加一份色彩',
            price: '18'
          },
          {
            name: '得力橡皮擦',
            src: './static/img/merchant/w4.jpg',
            text: '2b像皮擦批发专用美术文具用品橡皮檫不留痕小学生盒装象皮擦4b橡皮',
            price: '9.9'
          },
          {
            name: '活页名片册',
            src: './static/img/merchant/w5.jpg',
            text: '火车票、银行卡、纪念片、明星片、游戏卡、电影票、会员卡、手机相册等等都可以放起来收藏使用',
            price: '95'
          }
        ]
      }
    }
  },
  methods: {
    handleClick() {
      console.log(1)
    }
  },
  created() {},
  watch: {},
  mounted() {},
  computed: {}
}
</script>

<style scoped>
.item {
  margin-bottom: 16px;
}
</style>
<style lang ="scss">
@import '../../styles/data-card.scss'
</style>
