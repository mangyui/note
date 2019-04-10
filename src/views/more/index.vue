<template>
  <div class="app-container">
    <span class="header-title">更多</span>
    <h2 class="top-title disNone">更多</h2>
    <el-row :gutter="10">
      <el-col v-for="(item,index) in moreList" :key="index" :xs="12" :sm="8" :md="6" :lg="6" :xl="5">
        <div class="more_item">
          <router-link :to="item.route">
            <svg-icon class-name='more_icon' :style="{color:item.color}" :icon-class="item.icon" />
            <p>{{item.title}}</p>
          </router-link>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script>

export default {
  name: 'more',
  components: {
  },
  data() {
    return {
      moreList: [
        {
          id: 1,
          title: '记录汇总',
          icon: 'dashboard',
          route: '/more/dataNum',
          color: '#F56C6C'
        },
        {
          id: 2,
          title: '数据统计',
          icon: 'heatmapChart',
          route: '/more/charts',
          color: '#52bab5'
        },
        {
          id: 3,
          title: '第三方网站',
          icon: 'baidumap',
          route: '/more/webs',
          color: '#409EFF'
        }
      ]
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
  .more_icon{
    width: 3em;
    height: 3em;
  }
  p{
    margin-top: 1em;
  }
}
</style>
