<template>
  <div class="data-card">
    <el-row :span="24">
      <el-col :span="span" :xs="24" :sm="12" :md="8" :lg="6" v-for="(item,index) in data" :key="index">
        <div class="item" :style="{backgroundColor:item.color}">
          <img src="static/img/mock/card/quill_pen.png" class="item-img" />
          <div class="item-text" :style="{color:colorText,backgroundColor:bgText}">
            <h3>{{item.name}}</h3>
            <p>{{item.text}}</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'nx-data-card',
  data() {
    return {
      span: this.option.span || 6,
      data: this.option.data || [],
      colorText: this.option.colorText || '#fff',
      bgText: this.option.bgText || '#2e323f',
      borderColor: this.option.borderColor || '#2e323f'
    }
  },
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
 .item{
   background: #52bab5;
 }
</style>
