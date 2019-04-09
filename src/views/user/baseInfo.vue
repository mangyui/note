<template>
  <div class="contariner-wraper">
    <div class="center-section-wrap">
      <div class="datum-item-box">
        <div class="datum-title-box">
          基本信息
        </div>
        <div class="table-wrap">
          <table class="datum-table">
            <tr>
              <th>用户号</th>
              <td>{{user.Name}}</td>
            </tr>
            <tr>
              <th>性别</th>
              <td>{{user.Sex}}</td>
            </tr>
            <tr>
              <th>地址</th>
              <td>
                {{user.Address}}
              </td>
            </tr>
            <tr>
              <th>简介</th>
              <td class="brief-introduction">
                <p>{{user.Intro}}</p>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="datum-item-box">
        <div class="datum-title-box">
          教育背景
        </div>
        <div class="table-wrap">
          <table class="datum-table">
            <tr>
              <th>在读院校</th>
              <td>{{School}}</td>
            </tr>
            <tr>
              <th>年级</th>
              <td>{{mClass}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="datum-item-box">
        <div class="datum-title-box">
          联系方式
        </div>
        <div class="table-wrap">
          <table class="datum-table">
            <tr>
              <th>手机号码</th>
              <td>{{user.Phone}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'baseInfo',
  props: {
    user: Object,
    School: String,
    mClass: String
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
 @import '../../styles/consumer.scss';
</style>
