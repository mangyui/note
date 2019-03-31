<template>
  <div>
    <el-row :gutter="12">
      <el-col  :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-for="(item,index) in option" :key="index">
        <el-card class="friend-box" :body-style="{ padding: '0px' }"  shadow="hover">
          <div class="people">
            <router-link  :to="'/user/others/'+item.User.Id">
              <div class="friend-body">
                <img src="#" :src="item.User.Avatar || './static/img/avatar.jpg'">
                <div class="peo-right">
                  <b>{{item.User.Name|| '匿名'}}</b>
                  <p>{{item.User.Intro||'这个家伙很懒，什么都没留下'}}</p>
                </div>
              </div>
            </router-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'customer-box',
  data() {
    return {

    }
  },
  props: {
    option: {
      type: Array,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
