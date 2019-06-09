<template>
  <ve-radar :data="radarData" :extend="{}"></ve-radar>
</template>

<script>
  import VeRadar from 'v-charts/lib/radar'
  export default {
    name: 'radarChart',
    components: {
      VeRadar
    },
    props: ['customerName'],
    data() {
      return {
        radarData: {
          columns: ['用户名', '数学', '英语', '物理', '语文', '其他'],
          rows: [
            { '用户名': '', '数学': 100, '英语': 100, '物理': 100, '语文': 100, '其他': 100 }
          ]
        }
      }
    },
    methods: {
      Init() {
        const a = {
          '用户名': this.customerName,
          '数学': 75,
          '英语': 40,
          '物理': 95,
          '语文': 80,
          '其他': 60
        }
        this.radarData.rows.push(a)
      }
    },
    created() {
      this.Init()
    }
  }
</script>
