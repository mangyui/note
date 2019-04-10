<template>
  <div class="app-container">
    <span class="header-title">错题本</span>
    <div class="big-box1200">
      <div class="top-search">
        <el-input
          placeholder="搜索题目"
          @keyup.enter.native="toSearch"
          v-model="search.keys">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="list-gbtn">
        <el-select v-model="tolist.MistakeCateId" placeholder="错题分类" @change="toSearch">
          <el-option
            v-for="item in typelist"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id">
          </el-option>
        </el-select>
        <div>
          <!-- <el-button icon="el-icon-refresh" circle @click="refresh"></el-button> -->
          <router-link  to='/todo/addMistake'>
            <el-button type="primary" icon="el-icon-plus" circle></el-button>
          </router-link>
          <el-button type="danger" icon="el-icon-delete" circle @click="$refs.misList.showDelete=!$refs.misList.showDelete"></el-button>
        </div>
      </div>
      <div class="container">
        <div v-show="showLoading" class="loading-box">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div v-show="!questions[0] && !showLoading" class="loading-box">
          <i class="el-icon-search"></i>
          空空如也...
        </div>

        <misList ref="misList" :questions="questions"></misList>

        <div v-show="showMore" class="loading-box">
          <i class="el-icon-loading"></i>
          加载更多中...
        </div>
        <div v-show="!showMore && NoneMore" class="loading-box">
          <i class="el-icon-search"></i>
          没有更多了...
        </div>
      </div>
    </div>
    <div v-if="ScrollTop>700" class="note_d-edit" onclick="document.querySelector('.app-main').scrollTop=0">
      <el-button class="tototop" icon="el-icon-d-arrow-left" circle></el-button>
    </div>
  </div>
</template>


<script>
import misList from '@/views/common/misList'
import {
  QuesList,
  SearchMistake,
  mistakeCate
} from '@/api/toPost'

export default {
  name: 'quesList',
  components: {
    misList
  },
  data() {
    return {
      homeTop: 0,
      ScrollTop: 0,
      showLoading: true,
      showMore: false,
      NoneMore: false,
      showDelete: false,
      questions: [],
      type: '',
      typelist: [
        {
          Id: 0,
          Name: '所有'
        }
      ],
      tolist: {
        UserId: this.$store.getters.user.Id,
        MistakeCateId: this.$route.params.cateId || 0,
        Number: 10,
        Page: 1
      },
      search: {
        keys: '',
        UserId: this.$store.getters.user.Id
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // 这里的vm指的就是vue实例，可以用来当做this使用
    next(vm => {
      if (from.path === '/toques/mistake_type') {
        var cateid = vm.$route.params.cateId
        if (cateid) {
          vm.tolist.MistakeCateId = cateid
          vm.getQues()
        }
        // console.log(cateid, vm.tolist.MistakeCateId)
      }
    })
  },
  created() {
    this.getCategory()
    this.getQues()
  },
  activated() {
    document.querySelector('.app-main').scrollTop = this.homeTop || 0
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  beforeRouteLeave(to, from, next) {
    this.homeTop = document.querySelector('.app-main').scrollTop || 0
    document.querySelector('.app-main').removeEventListener('scroll', this.onScroll)
    next()
  },
  mounted() {
    document.querySelector('.app-main').addEventListener('scroll', this.onScroll)
  },
  methods: {
    // refresh() {
    //   this.getCategory()
    //   this.getQues()
    // },
    getCategory() {
      mistakeCate(this.$qs.stringify({ UserId: this.$store.getters.user.Id })).then(res => {
        this.typelist = this.typelist.concat(res.data.data)
      }).catch(() => {
        console.log('获取数据失败！')
      })
    },
    getQues() {
      this.NoneMore = false
      this.showLoading = true
      this.tolist.Page = 1
      QuesList(this.$qs.stringify(this.tolist)).then(res => {
        this.questions = res.data.data
        this.showLoading = false
      }).catch(() => {})
    },
    toSearch() {
      if (this.search.keys.trim() === '') {
        this.getQues()
        return
      }
      this.showLoading = true
      SearchMistake(this.$qs.stringify(this.search)).then(res => {
        this.questions = res.data.data
        this.showLoading = false
      }).catch(() => {})
    },
    onScroll() {
      var innerHeight = document.querySelector('.app-container').clientHeight
      var outerHeight = document.querySelector('.app-main').clientHeight
      var scrollTop = document.querySelector('.app-main').scrollTop
      this.ScrollTop = scrollTop
      if (innerHeight <= (outerHeight + scrollTop)) {
        if (this.NoneMore || this.showMore || this.showLoading || this.search.keys.trim() !== '') {
          return
        }
        this.showMore = true
        this.tolist.Page++
        QuesList(this.$qs.stringify(this.tolist)).then(res => {
          this.questions = this.questions.concat(res.data.data)
          this.showMore = false
          if (res.data.data.length < this.tolist.Number) {
            this.NoneMore = true
          } else {
            this.NoneMore = false
          }
        }).catch(() => {})
      }
    }
  }
}
</script>


<style lang="scss" scoped>
// .ques-list .ques-list_item .ques_box{
//   padding-top: 35px;
// }
</style>
