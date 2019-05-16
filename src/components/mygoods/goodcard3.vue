<template>
  <el-col :span="6" :xs="24" :sm="12" :md="12" :lg="8" style="margin-bottom:20px;">
    <div class="grid-content bg-purple">
      <el-card class="box-card">
        <div class="book_item">
          <div class="item_body">
            <div class="item_img">
              <img :src="product.src" width="120">
            </div>
            <div class="item_text">
              <h3>《{{product.title}}》</h3>
              <p>{{product.text}}</p>
            </div>
          </div>
          <div style="clear:both;"></div>
          <div class="item_footer">

            <p>{{product.datetime}}</p>
            <span><i class="iconfont icondianzan"></i>{{product.fabulous}}</span>
            <span><i class="iconfont iconpinglun"></i>{{product.comment}}</span>
          </div>
        </div>
      </el-card>
    </div>
  </el-col>
</template>

<script>
export default {
  name: 'goodcard3',
  props: ['product'],
  data() {
    return {}
  }
}
</script>

<style scoped>
.item_text{
  width: 60%;
  float: left;
}
.item_text p{
  color: rgb(177, 177, 177);
  text-indent: 2em;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  height: 125px;
  overflow: hidden;
}
.item_img{
  width: 30%;
  float:right;
}
.item_footer{
  margin-bottom: 10px;
  margin-top: 10px;
  font-size: 14px;
  color: rgb(131, 131, 131);
}
.item_footer p{
  float: left;
}
.item_footer span{
  float:right;
  font-size: 12px;
  margin-right: 15px;
}
.item_footer span i{
  font-size: 10px;
}

@media (max-width: 768px){
  .item_text p{
    height: 95px;
  }
}
</style>
