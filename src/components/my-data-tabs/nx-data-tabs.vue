<template>
  <div class="data-tabs">
    <el-row :span="24">
      <el-col :span="span" :xs="24" :sm="12" :md="8" :lg="6" v-for="(item,index) in data" :key="index">
        <div class="item" :style="{background:item.color}">
          <div class="item-header">
            <p>{{item.title}}</p>
            <span>{{item.subtitle}}</span>
          </div>
          <div class="item-body">
            <h2><my-count-up :start="0" :end="item.count"/></h2>
          </div>
          <div class="item-footer">
            <span>{{item.allcount}}</span>
            <p>{{item.text}}</p>
          </div>
          <p class="item-tip">{{item.key}}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import myCountUp from '@/components/my-count-up/index.vue'
export default {
  components: {
    myCountUp
  },
  name: 'my-data-tabs',
  data() {
    return {
      span: this.option.span || 6,
      data: this.option.data || []
    }
  },
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
