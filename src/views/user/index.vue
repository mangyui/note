<template>
  <div class="user">
    <div class="user_top">
      <div class="bg-blur"></div>
      <el-button class="toAttention"
        type="danger"
        round >关注(66)
      </el-button>
      <div class="top_item">
        <p>笔记
          <router-link to="/tonote/notes"><nx-count-up :start="0" :end="66"/></router-link>
        </p>
        <p>错题
          <router-link to="/toques/quesList"><nx-count-up :start="0" :end="66"/></router-link>
        </p>
      </div>
    </div>
    <div class="user_center">
      <div class="avatar">
        <img :src="cropImg" />
        <label for="Choose_Avatar">更换头像</label>
      </div>
      <input id="Choose_Avatar" ref="referenceUpload" style="display: none" type="file" name="image" accept="image/*" multiple @change="toChoose"/>
      <div>
        <h2>{{user.Name}}</h2>
        <p class="user_address">{{user.Address+'|'}}  学生</p>
        <p class="user_mess">{{user.Intro}}</p>
        <p class="user_money">金币：<span>{{user.Coin}}</span></p>
      </div>
    </div>
    <div class="contariner-wraper">
      <div class="center-section-wrap">
        <div class="datum-item-box">
          <div class="datum-title-box">
            基本信息
          </div>
          <div class="table-wrap">
            <table class="datum-table">
              <tr>
                <th>用户名</th>
                <td><el-input v-model="form.Name" placeholder="请设置您的用户名"></el-input></td>
              </tr>
              <tr>
                <th>性别</th>
                <td>
                  <el-select v-model="form.Sex" placeholder="请设置你的性别">
                    <el-option
                      v-for="item in sex"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <th>位置</th>
                <td>
                  <el-cascader expand-trigger="hover" :options="city" v-model="form.Address" filterable change-on-select></el-cascader>
                </td>
              </tr>
              <tr>
                <th>简介</th>
                <td class="brief-introduction">
                  <el-input type="textarea" v-model="form.Intro"></el-input>
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
                <th>院校</th>
                <td>
                  <el-select v-model="form.SchoolId" placeholder="请选择">
                    <el-option
                      v-for="item in schoolList"
                      :key="item.Id"
                      :label="item.Name"
                      :value="item.Id">
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <th>年级</th>
                <td><el-input v-model="form.Class" placeholder="请设置您的年级"></el-input></td>
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
                <th>联系方式</th>
                <td><el-input v-model="form.Phone" placeholder="请设置您的联系方式"></el-input></td>
              </tr>
            </table>
          </div>
        </div>
        <el-alert
          title="修改了信息，别忘了保存哦！"
          type="warning">
        </el-alert>
      </div>
      <div class="save-me">
          <el-button @click="toSave">保存修改</el-button>
      </div>
    </div>
    <el-dialog title="裁剪图片" :visible.sync="dialogVisible" :before-close="cancelCrop" width="30%">
      <vue-cropper class="dgCropper" ref='cropper' :auto-crop-area="1" :aspectRatio="1/1"  :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
      <span slot="footer" class="dialog-footer">
        <el-button class="to-left" size="medium" @click="toRotate" type="primary" icon="el-icon-refresh"></el-button>
        <el-button size="medium" @click="cancelCrop">取 消</el-button>
        <el-button type="primary"  size="medium" @click="toCrop">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import nxCountUp from '@/components/nx-count-up/index.vue'
import { areajson } from '@/assets/js/city.js'
import VueCropper from 'vue-cropperjs'
import {
  getSchoolList
} from '@/api/toget'

export default {
  name: 'user',
  components: {
    VueCropper,
    nxCountUp
  },
  data() {
    return {
      user: this.$store.getters.user,
      avatar: this.$store.getters.user.avatar || './static/img/avatar.jpg',
      defaultSrc: '',
      cropImg: '',
      imgSrc: '',
      dialogVisible: false,
      sex: [{
        value: '男',
        label: '男'
      }, {
        value: '女',
        label: '女'
      }],
      city: areajson,
      schoolList: [],
      form: {
        Name: this.$store.getters.user.Name,
        SchoolId: this.$store.getters.user.SchoolId,
        Sex: this.$store.getters.user.Sex,
        Phone: this.$store.getters.user.Phone,
        Intro: this.$store.getters.user.Intro,
        Class: this.$store.getters.user.Class,
        Address: ['110000', '110100', '110101']
      }
    }
  },
  methods: {
    toSave() {

    },
    toChoose(e) {
      const file = e.target.files[0]
      this.setImage(file)
    },
    setImage(file) {
      if (!file || !file.type.includes('image/')) {
        return
      }
      const reader = new FileReader()
      reader.onload = event => {
        this.dialogVisible = true
        this.imgSrc = event.target.result
        this.$refs.cropper && this.$refs.cropper.replace(event.target.result)
      }
      reader.readAsDataURL(file)
      this.$refs.referenceUpload.value = null
    },
    cropImage() {
      // this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.7)
    },
    cancelCrop() {
      this.dialogVisible = false
      this.cropImg = this.avatar
    },
    toCrop() {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.7)
      this.dialogVisible = false
    },
    toRotate() {
      this.$refs.cropper.rotate(10)
    },
    getschool() {
      getSchoolList().then(res => {
        this.schoolList = res.data.data
      }).catch(() => {
        console.log('获取学校数据失败！')
      })
    }
  },
  created() {
    this.cropImg = this.avatar
    this.getschool()
  }
}
</script>

<style scoped lang='scss'>
 @import '../../styles/consumer.scss';
.user_top {
  width: 100%;
  height: 350px;
  position: relative;
}
.bg-blur{
  width: 100%;
  height: 100%;
  background: url("../../assets/images/home/user_bg.jpg") center no-repeat;
  background-size: cover;
}
.top_item {
  position: absolute;
  display: flex;
  bottom: 0;
  justify-content: space-around;
  width: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
}
.top_item p {
  width: 220px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  position: relative;
  text-align: center;
}
.top_item p a {
  color: white;
  font-size: 24px;
  display: block;
  margin-top: 14px;
}
.user_center {
  position: relative;
  text-align: center;
  padding-top: 50px;
}
.avatar img {
  width: 100%;
}
.avatar {
  width: 120px;
  height: 120px;
  position: absolute;
  left: calc(50% - 60px);
  top: -60px;
  border-radius: 50%;
  border: 3px solid #fff;
  overflow: hidden;
}
.avatar label{
  position: absolute;
  display: block;
  height: 100%;
  width: 100%;
  left: 120px;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  color: #fff;
  text-align: center;
  line-height: 120px;
  border-radius: 50%;
  transition: 0.28s;
}
.avatar:hover label{
  left: 0;
}
.user_address {
  font-size: 13px;
  color: #ccc;
    margin: 10px 0
}
.user_mess {
  font-size: 15px;
  color: #666;
  margin: 10px 0
}
.user_money {
  font-size: 14px;
  color: #666;
  margin: 10px 0;
  span {
    color: #52bab5;
  }
}
.save-me{
  text-align: center;
  margin-top: 20px;
}
@media (min-width: 1600px)
{
  .bg-blur{
    filter: blur(8px);
  }
}
@media (max-width: 768px)
{
  .user_top{
    height: 200px;
  }
  .avatar {
    width: 100px;
    height: 100px;
    top: -50px;
    left: calc(50% - 50px);
  }
  .top_item p,.top_item p a{
    margin: 5px 0 2px;
  }
  .user_center{
    padding-top: 40px;
  }
  .datum-table th{
    width: 105px;
  }
}
</style>
