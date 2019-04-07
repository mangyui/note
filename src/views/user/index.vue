<template>
  <div class="user">
    <div class="user_top" :style="{backgroundImage:'url(./static/img/main/user_bg' + bgindex+ '.svg)'}">
      <!-- <div class="bg-blur"></div> -->
      <!-- <router-link :to="'/user/fans/'+user.Id">
        <el-button class="toAttention"
          type="danger"
          round >题友
        </el-button>
      </router-link> -->
      <div class="toOther">
        <div class="tiyou">
          <router-link to="/tonote/noteList">
            <nx-svg-icon class-name='tiyou_icon' icon-class="note" />
            <p>笔记</p>
          </router-link>
        </div>
        <div></div>
        <div class="tiyou">
          <router-link to="/user/fans/">
            <nx-svg-icon class-name='tiyou_icon' icon-class="peoples" />
            <p>题友</p>
          </router-link>
        </div>
      </div>
      <!-- <div class="top_item">
        <p style="height:80px">
          <router-link to="/tonote/noteList"></router-link>
        </p>
        <p>
          <router-link to="/toques/quesList"></router-link>
        </p>
      </div> -->
    </div>
    <div class="user_center">
      <!-- <div class="div-logout toShow"><nx-svg-icon class-name='more_icon' icon-class="logout" /></div> -->
      <div class="avatar">
        <img preview :src="cropImg" />
        <label v-show="isUpdate" for="Choose_Avatar">更换头像</label>
      </div>
      <input id="Choose_Avatar" ref="referenceUpload" style="display: none" type="file" name="image" accept="image/*" multiple @change="toChoose"/>
      <div>
        <h2 style="margin: 5px 0;">{{user.Name}}</h2>
        <p class="user_address">{{Class==null?'':Class+' |'}}  {{user.Name=='ming'?'管理员':(user.Occupation==2?'教师':'学生')}}</p>
        <!-- <p class="user_mess">{{user.Intro}}</p> -->
        <p class="user_money">金币：<span>{{user.Coin||0}}</span> <el-button size="mini" round @click="chongzhiBox = true">充值</el-button></p>
      </div>
    </div>
    <div v-if="!isUpdate" class="contariner-wraper UserInfo">
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
                <td>{{Class}}</td>
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
        <div class="save-me" style="text-align: right">
          <el-button size="small" v-if="!isUpdate" @click="isChange">刷新资料</el-button>
          <el-button size="small" type="primary" v-if="!isUpdate" @click="isUpdate=!isUpdate">修改资料</el-button>
      </div>
      <div class="div-logout toShow" @click="logout"><el-button type="danger">退出登录</el-button></div>
      </div>
    </div>
    <div v-if="isUpdate" class="contariner-wraper">
      <div class="center-section-wrap">
        <div class="datum-item-box">
          <div class="datum-title-box">
            基本信息
          </div>
          <div class="table-wrap">
            <table class="datum-table">
              <!-- <tr>
                <th>用户名</th>
                <td><el-input v-model="form.Name" placeholder="请设置您的用户名"></el-input></td>
              </tr> -->
              <tr>
                <th>性别</th>
                <td>
                  <el-select size="mini" v-model="form.Sex" placeholder="请设置你的性别">
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
                  <el-input size="mini" v-model="form.Address" placeholder="请设置你的地址"></el-input>
                </td>
              </tr>
              <tr>
                <th>简介</th>
                <td class="brief-introduction">
                  <el-input size="mini" type="textarea" v-model="form.Intro"></el-input>
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
                  <el-select size="mini" v-model="form.SchoolId" placeholder="请选择您的学校">
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
                <td>
                  <el-select size="mini" v-model="form.Class" placeholder="请正确选择您的年级">
                    <el-option
                      v-for="item in classlist"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
      <!-- <el-input v-model="form.Class" placeholder="请设置您的年级"></el-input> -->
                </td>
              </tr>
            </table>
          </div>
        </div>
        <!-- <div class="datum-item-box">
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
        </div> -->
        <el-alert
          title="修改了信息，别忘了保存哦！"
          type="warning">
        </el-alert>
        <div class="save-me" style="text-align: right">
        <el-button size="small" v-if="isUpdate" @click="isUpdate=false">返回</el-button>
        <el-button size="small" type="primary" @click="toSave">保存修改</el-button>
        </div>
      </div>

    </div>
    <el-dialog
      title="金币"
      :visible.sync="chongzhiBox"
      width="40%"
      center>
      <div class="jinbi">金币数：<nx-count-up class="num" :start="0" :end="parseInt(user.Coin)"/></div>
      <div class="jinbi">
        <el-select v-model="addJinbi" placeholder="请选择">
          <el-option
            v-for="item in numList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button  size="small" @click="chongzhiBox = false">取 消</el-button>
        <el-button  size="small" type="primary" @click="chongZhi">确定充值</el-button>
      </span>
    </el-dialog>
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
import nxSvgIcon from '@/components/nx-svg-icon/index'
// import { areajson } from '@/assets/js/city.js'
import { classList } from '@/assets/js/class.js'
import VueCropper from 'vue-cropperjs'
import {
  getSchoolList
} from '@/api/toget'
import {
  GetCustomer,
  ChangeUserAvatar
} from '@/api/toPost'

import { dataURLtoBlob, blobToFile } from '@/utils/index.js'

export default {
  name: 'user',
  components: {
    VueCropper,
    nxCountUp,
    nxSvgIcon
  },
  data() {
    return {
      user: this.$store.getters.user,
      bgindex: Math.floor(Math.random() * 6),
      avatar: this.$store.getters.user.Avatar || './static/img/avatar.jpg',
      defaultSrc: '',
      cropImg: '',
      imgSrc: '',
      dialogVisible: false,
      chongzhiBox: false,
      isUpdate: false,
      sex: [{
        value: '男',
        label: '男'
      }, {
        value: '女',
        label: '女'
      }],
      // city: areajson,
      classlist: classList,
      Class: '',
      schoolList: [],
      School: '',
      form: {
        username: this.$store.getters.user.Name,
        userid: this.$store.getters.user.Id,
        password: this.$store.getters.user.Password,
        SchoolId: this.$store.getters.user.SchoolId,
        Sex: this.$store.getters.user.Sex,
        Intro: this.$store.getters.user.Intro,
        Class: this.$store.getters.user.Class,
        Address: this.$store.getters.user.Address
      },
      numList: [{
        value: '10',
        label: '10'
      }, {
        value: '50',
        label: '50'
      }, {
        value: '100',
        label: '100'
      }, {
        value: '500',
        label: '500'
      }, {
        value: '1000',
        label: '1000'
      }],
      addJinbi: '10',
      avatarFile: ''
    }
  },
  methods: {
    toSave() {
      this.$store.dispatch('UpdateMe', this.form).then(res => {
        if (res.data.code === 0) {
          this.isUpdate = false
          var index1 = this.classlist.find((item) => {
            return item.value === this.user.Class
          })
          this.Class = index1.label
          var index2 = this.schoolList.find((item) => {
            return item.Id === this.user.SchoolId
          })
          this.School = index2.Name
          this.$notify({
            title: '消息',
            message: '修改资料成功！',
            type: 'success'
          })
        } else {
          this.$message.warning('操作失败...')
        }
      })
      // }).catch(() => {})
    },
    toChoose(e) {
      const file = e.target.files[0]
      this.setImage(file)
    },
    setImage(file) {
      if (!file || !file.type.includes('image/')) {
        return
      }
      this.avatarFile = file
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
      this.changeAvatar()
    },
    toRotate() {
      this.$refs.cropper.rotate(10)
    },
    changeAvatar() {
      var blob = dataURLtoBlob(this.cropImg)
      var file = blobToFile(blob, 'avatar')
      var data = new FormData()
      // console.log(file)
      data.append('file', file, 'avatar.png')
      data.append('UserId', this.user.Id)
      // alert(data)
      // alert(this.dataURLtoFile(this.cropImg, 'avatar.png'))
      // var xhr = new XMLHttpRequest()
      // xhr.open('POST', uploadImgServer)
      // // 设置超时
      // xhr.timeout = 15000
      // xhr.onreadystatechange = (res) => {
      //   if (xhr.readyState === 4 && xhr.status === 200) {
      //     console.log(xhr)
      //     var respp = JSON.parse(xhr.responseText)
      //     // console.log(respp.data.data.data)
      //     if (respp.data.data.data && respp.data.ret !== 200) {
      //       this.$store.dispatch('UpdateAvatar', respp.data.data.data[0])
      //       // console.log(respp.data.data.data[0])
      //       location.reload()
      //     } else {
      //       this.$notify({
      //         title: '提示',
      //         message: '修改头像失败',
      //         type: 'info'
      //       })
      //       this.cropImg = this.avatar
      //     }
      //   } else {
      //     this.$notify({
      //       title: '提示',
      //       message: '修改头像失败',
      //       type: 'info'
      //     })
      //     this.cropImg = this.avatar
      //   }
      // }
      // xhr.send(data)
      ChangeUserAvatar(data).then(res => {
        if (res.data.data.data[0]) {
          this.$store.dispatch('UpdateAvatar', res.data.data.data[0])
          location.reload()
        } else {
          this.$notify({
            title: '提示',
            message: '修改图片失败',
            type: 'info'
          })
          this.cropImg = this.avatar
        }
      }).catch(() => {

      })
    },
    getschool() {
      getSchoolList().then(res => {
        this.schoolList = res.data.data
        var index = this.schoolList.find((item) => {
          return item.Id === this.user.SchoolId
        })
        this.School = index.Name
      }).catch(() => {
      })
    },
    chongZhi() {
      var data = {
        coin: this.addJinbi,
        userId: this.$store.getters.user.Id
      }
      console.log(data)
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
      location.reload()
    },
    isChange() {
      GetCustomer(this.$qs.stringify({ UserId: this.user.Id })).then(res => {
        if (res.data.data.Id === this.user.Id) {
          this.$store.dispatch('RefreshUser', res.data.data)
          location.reload()
        }
      })
    }
  },
  created() {
    this.cropImg = this.avatar
    this.getschool()
    var index = this.classlist.find((item) => {
      return item.value === this.user.Class
    })
    this.Class = index.label
  }
}
</script>

<style scoped lang='scss'>
 @import '../../styles/consumer.scss';
 .UserInfo{
   .datum-table td{
      padding: 10px 0;
   }
   .datum-table th{
     padding: 10px 30px 10px 0px;
   }
 }
.user_top {
  width: 100%;
  height: 180px;
  position: relative;
  transition: 0.28s;
  // background-size: 8%;
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
  width: 100px;
  height: 100px;
  position: absolute;
  left: calc(50% - 50px);
  top: -50px;
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
  font-size: 12px;
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
  text-align: right;
  max-width: 95%;
  margin: 20px auto 0;
}
.jinbi {
  text-align: center;
  margin-bottom: 20px;
  .num{
    font-size: 28px;
    color: #52bab5;
  }
}
.toOther{
  position: absolute;
  width: 100%;
  left: 0;
  top: 40%;
  display: flex;
  justify-content: space-around;
  .tiyou{
    color: #fff;
    text-align: center;
    .tiyou_icon{
      width: 2em;
      height: 2em;
    }
    p{
      margin-top: 8px;
      font-size: 12px;
    }
  }
}

@media (min-width: 1600px)
{
  .bg-blur{
    filter: blur(8px);
  }
}
@media (max-width: 768px)
{
  // .user_top{
  //   height: 200px;
  // }
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
  .div-logout{
    width: 400px;
    max-width: 95%;
    margin: 40px auto 0;
    button{
      width: 100%;
    }
  }
}
</style>
