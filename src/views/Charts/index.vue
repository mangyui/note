<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-date"></i> 图表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>饼状图</span>
          </div>
          <ve-pie :data="pieData"></ve-pie>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>柱状图</span>
          </div>
          <ve-histogram :data="columnarData"></ve-histogram>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>线型图</span>
          </div>
          <ve-line :data="lineData"></ve-line>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line'
import VeHistogram from 'v-charts/lib/histogram'
import VePie from 'v-charts/lib/pie'
export default {
  name: 'Charts',
  components: {
    VeLine,
    VeHistogram,
    VePie
  },
  data() {
    return {
      pieData: {
        columns: ['日期', '访问用户'],
        rows: [
          { '日期': '2/11', '访问用户': 1393 },
          { '日期': '2/12', '访问用户': 3530 },
          { '日期': '2/13', '访问用户': 2923 },
          { '日期': '2/14', '访问用户': 1723 },
          { '日期': '2/15', '访问用户': 3792 },
          { '日期': '2/16', '访问用户': 4593 }
        ]
      },
      columnarData: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { 日期: '1/1', 访问用户: 1393, 下单用户: 1093, 下单率: 32 },
          { 日期: '1/2', 访问用户: 3530, 下单用户: 3230, 下单率: 26 },
          { 日期: '1/3', 访问用户: 2923, 下单用户: 2623, 下单率: 76 },
          { 日期: '1/4', 访问用户: 1723, 下单用户: 1423, 下单率: 49 },
          { 日期: '1/5', 访问用户: 3792, 下单用户: 3492, 下单率: 32.3 },
          { 日期: '1/6', 访问用户: 4593, 下单用户: 4293, 下单率: 78 }
        ]
      },
      lineData: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { 日期: '1/1', 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
          { 日期: '1/2', 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
          { 日期: '1/3', 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
          { 日期: '1/4', 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
          { 日期: '1/5', 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
          { 日期: '1/6', 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 }
        ]
      }
    }
  }
}
</script>

<style scoped>
.el-card{
  margin-bottom: 20px;
}
</style>
