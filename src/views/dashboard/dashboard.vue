<template>
  <div class="app-container">
    <div class="item">
      <h4>数据展示</h4>
      <my-data-display :option="option"></my-data-display>
    </div>
    <div class="item">
      <h4>栏目展示</h4>
      <my-data-tabs :option="easyDataOption"></my-data-tabs>
    </div>
    <div class="item">
      <h4>笔记展示</h4>
      <my-data-card :option="easyDataOption0"></my-data-card>
    </div>
  </div>
</template>

<script>

import myDataDisplay from '@/components/my-data-display/my-data-display'
import myDataCard from '@/components/my-data-card/my-data-card'
import myDataTabs from '@/components/my-data-tabs/my-data-tabs'

export default {
  name: 'dashboard',
  components: {
    myDataDisplay,
    myDataCard,
    myDataTabs
  },
  data() {
    return {
      option: {
        span: 8,
        color: '#15A0FF',
        data: [
          {
            count: 666,
            title: '日活跃数'
          },
          {
            count: 6666,
            title: '月活跃数'
          },
          {
            count: 66666,
            title: '年活跃数'
          }
        ]
      },
      easyDataOption: {
        span: 6,
        data: [
          {
            title: '分类统计',
            subtitle: '实时',
            count: 7993,
            allcount: 10222,
            text: '当前分类总记录数',
            color: 'rgb(49, 180, 141)',
            key: '盲'
          },
          {
            title: '笔记统计',
            subtitle: '实时',
            count: 3112,
            allcount: 10222,
            text: '当前录入的笔记数',
            color: 'rgb(56, 161, 242)',
            key: '鱼'
          },
          {
            title: '测试统计',
            subtitle: '实时',
            count: 908,
            allcount: 10222,
            text: '测试次数',
            color: 'rgb(117, 56, 199)',
            key: '笔'
          },
          {
            title: '语音统计',
            subtitle: '实时',
            count: 908,
            allcount: 10222,
            text: '语音次数',
            color: 'rgb(59, 103, 164)',
            key: '记'
          }
        ]
      },
      easyDataOption0: {
        span: 6,
        borderColor: '#fff',
        data: [
          {
            name: '笔记1',
            color: '#31b48d',
            text: '备注1'
          },
          {
            name: '笔记2',
            color: '#38a1f2',
            text: '备注2'
          },
          {
            name: '笔记3',
            color: '#f56c6c',
            text: '备注3'
          },
          {
            name: '笔记4',
            color: '',
            text: '备注4'
          }
        ]
      },
      easyDataOption1: {
        color: 'rgb(63, 161, 255)',
        span: 4,
        data: [
          {
            title: '今日注册',
            count: 12678,
            icon: 'icon-cuowu'
          },
          {
            title: '今日登录',
            count: 22139,
            icon: 'icon-shujuzhanshi2'
          },
          {
            title: '今日订阅',
            count: 35623,
            icon: 'icon-jiaoseguanli'
          },
          {
            title: '今日评论',
            count: 16826,
            icon: 'icon-caidanguanli'
          },
          {
            title: '今日评论',
            count: 16826,
            icon: 'icon-caidanguanli'
          },
          {
            title: '今日评论',
            count: 16826,
            icon: 'icon-caidanguanli'
          }
        ]
      },
      easyDataOption2: {
        color: 'rgb(63, 161, 255)',
        span: 4,
        discount: true,
        data: [
          {
            title: '错误日志',
            count: 12678,
            icon: 'icon-cuowu'
          },
          {
            title: '数据展示',
            count: 12678,
            icon: 'icon-shujuzhanshi2'
          },
          {
            title: '权限管理',
            count: 12678,
            icon: 'icon-jiaoseguanli'
          },
          {
            title: '菜单管理',
            count: 12678,
            icon: 'icon-caidanguanli'
          },
          {
            title: '权限测试',
            count: 12678,
            icon: 'icon-caidanguanli'
          },
          {
            title: '错误页面',
            count: 12678,
            icon: 'icon-caidanguanli'
          }
        ]
      }
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
    @import '../../styles/data-card.scss';
</style>
