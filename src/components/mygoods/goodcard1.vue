<template>
  <el-col :span="6" :xs="12" :sm="10" :md="8" :lg="6">
    <div class="grid-content bg-purple">
      <el-card class="box-card" style="margin-bottom:20px;">
          <div class="img_border">
            <img :src="product.src" >
          </div>
        <p class="descript_text">{{product.Title}}</p>
        <div class="text_item">
          <p class="price_text">
            <span class="newprice">￥{{product.newprice}}</span>
          </p>
          <el-tag type="danger" size="mini" style="font-size:2px;float:right;margin-bottom:10px;">金币抵￥{{product.deductionprice}}</el-tag>
          <!-- <el-button style="float: right; padding: 3px 0;color:red;" type="text"><i  class="iconfont icongouwuche"></i></el-button> -->
        </div>
      </el-card>
    </div>
  </el-col>
</template>

<script>
export default {
  name: 'goodcard1',
  props: ['product'],
  data() {
    return {}
  }
}
</script>

<style scoped>
.clearfix span{
  color: rgb(46, 120, 216);
  font-size: 20px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.img_border{
  margin-bottom: 15px;
  margin-top: 15px;
}
.img_border img{
  margin: 0;
  border-radius: 5px;
  transition: 0.28s
}
.img_border img:hover {
  transform: scale(1.2);
  -webkit-transform: scale(1.2); /*Safari 和 Chrome*/
  -moz-transform: scale(1.2); /*Firefox*/
  -ms-transform: scale(1.2); /*IE9*/
  -o-transform: scale(1.2); /*Opera*/
  }
.text_item {
  margin-top: 10px;
  margin-bottom: 30px;
}
.price_text{
  font-size: 18px;
  line-height: 25px;
  float: left;
}
.price_text .newprice{
  color:rgb(34, 207, 150);
  font-weight: 600;
}
.descript_text{
  font-family: '微软雅黑';
  font-weight: 600;
  overflow: hidden;
  text-indent: 2em;
  font-size: 13px;
  margin-top: 20px;
  line-height: 17px;
  height: 51px;
}
@media (max-width: 768px){
  .el-col{
    padding-left: 5px!important;
    padding-right: 5px!important;
  }
}
</style>
