<template>
  <div class="my-data-display">
    <el-row :span="24">
      <el-col v-for="(item,index) in data" :key="index" :span="span">
        <div class="item" :style="{color:color}">
          <h5 class="count"><my-count-up :start="0" :end="item.count"/></h5>
          <span class="splitLine" />
          <p class="title">{{item.title}}</p>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import myCountUp from '@/components/my-count-up/index.vue'
export default {
  name: 'my-data-display',
  components: {
    myCountUp
  },
  data() {
    return {
      span: this.option.span || 8,
      data: this.option.data,
      color: this.option.color || 'rgb(63, 161, 255)'
    }
  },
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  created() {},
  methods: {}
}
</script>
