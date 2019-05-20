<template>
    <el-tabs :stretch="screenWidth<768?true:false" v-model="activeName" type="card" @tab-click="handleClick" style="margin:20px 10px;">
      <el-tab-pane label="文具" name="first">
        <div class="item_header">
          <span>更多<i class="iconfont icongengduo2" style="margin-left:5px;"></i></span>
          <h2 class="h2_border"><i class="iconfont iconrexiao" style="font-size:20px;color:red; margin-right:10px;"></i>热销</h2>
          <div style="clear:both;"></div>
        </div>
        <div class="app-container" style="margin-bottom:10px;">
          <div class="data-card" >
            <el-row :gutter="20">
                <goodcard1 v-for="(item,index) in productList1" :key="index" :product="item"></goodcard1>
            </el-row>
          </div>
        </div>
        <div class="item_header">
          <span>更多<i class="iconfont icongengduo2" style="margin-left:5px;"></i></span>
          <h2 class="h2_border"><i class="iconfont iconqianglietuijian" style="font-size:20px;color:red; margin-right:10px;"></i>强烈推荐</h2>
          <div style="clear:both;"></div>
        </div>
        <div class="app-container" style="margin-bottom:10px;">
          <div class="data-card" >
            <el-row :gutter="20">
              <goodcard1 v-for="(item,index) in productList1" :key="index" :product="item"></goodcard1>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="强化课程" name="second">
        <div class="item_header">
          <span>更多<i class="iconfont icongengduo2" style="margin-left:5px;"></i></span>
          <h2 class="h2_border"><i class="iconfont iconrexiao" style="font-size:20px;color:red; margin-right:10px;"></i>别人都已加入</h2>
          <div style="clear:both;"></div>
        </div>
        <goodcard2 :product="productList2"></goodcard2>
      </el-tab-pane>
      <el-tab-pane label="书籍" name="third">
        <div class="item_header">
          <span>更多<i class="iconfont icongengduo2" style="margin-left:5px;"></i></span>
          <h2 class="h2_border"><i class="iconfont iconrexiao" style="font-size:20px;color:red; margin-right:10px;"></i>精选好书</h2>
          <div style="clear:both;"></div>
        </div>
        <div class="app-container" style="margin-bottom:10px;">
          <div class="data-card" >
            <el-row :gutter="20">
              <goodcard3 v-for="(item,index) in productList3" :key="index" :product="item"></goodcard3>
            </el-row>
          </div>
        </div>
        <div class="item_header">
          <span>更多<i class="iconfont icongengduo2" style="margin-left:5px;"></i></span>
          <h2 class="h2_border"><i class="iconfont iconqianglietuijian" style="font-size:20px;color:red; margin-right:10px;"></i>我们推荐</h2>
          <div style="clear:both;"></div>
        </div>
        <div class="app-container" style="margin-bottom:10px;">
          <div class="data-card" >
            <el-row :gutter="20">
              <goodcard3 v-for="(item,index) in productList3" :key="index" :product="item"></goodcard3>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="其它" name="fourth">
        <div class="item_header">
          <span>更多<i class="iconfont icongengduo2" style="margin-left:5px;"></i></span>
          <h2 class="h2_border"><i class="iconfont iconrexiao" style="font-size:20px;color:red; margin-right:10px;"></i>精选</h2>
          <div style="clear:both;"></div>
        </div>
          <div class="app-container" style="margin-bottom:10px;">
            <div class="data-card" >
              <el-row :gutter="20">
                  <goodcard4 v-for="(item,index) in productList3" :key="index" :product="item"></goodcard4>
              </el-row>
            </div>
          </div>
        <div class="item_header">
          <span>更多<i class="iconfont icongengduo2" style="margin-left:5px;"></i></span>
          <h2 class="h2_border"><i class="iconfont iconrexiao" style="font-size:20px;color:red; margin-right:10px;"></i>看一看</h2>
          <div style="clear:both;"></div>
        </div>
          <div class="app-container" style="margin-bottom:10px;">
            <div class="data-card" >
              <el-row :gutter="20">
                  <goodcard4 v-for="(item,index) in productList3" :key="index" :product="item"></goodcard4>
              </el-row>
            </div>
          </div>
          </el-tab-pane>
    </el-tabs>
</template>
<script>
import '@/assets/iconfont/iconfont.css' // 引入icon图标
// import nxDataCard from '@/components/my-data-card/nx-data-card'
import goodcard1 from '@/components/mygoods/goodcard1'
import goodcard2 from '@/components/mygoods/goodcard2'
import goodcard3 from '@/components/mygoods/goodcard3'
import goodcard4 from '@/components/mygoods/goodcard4'
export default {
  name: 'report',
  components: {
    // nxDataCard,
    goodcard1,
    goodcard2,
    goodcard3,
    goodcard4
  },
  data() {
    return {
      screenWidth: document.body.clientWidth,
      productList1: [
        {
          name: '晨光彩色铅笔',
          src: './static/img/merchant/w1.jpg',
          descript: '晨光彩色铅笔水溶性彩铅画笔彩笔专业画画套装成人手绘48色初学者36色学生用72色水溶款填色彩铅笔儿童油24色',
          deductionprice: '0.5',
          newprice: '3.0',
          Title: '水溶性彩铅画笔彩笔专业画画套装成人手绘48色初学者'
        },
        {
          name: '康奈尔笔记本',
          src: './static/img/merchant/w2.jpg',
          descript: '这是一款多彩设计的无线装订软抄本本，与众不同，给你的办公、学习生活添加一份色彩',
          deductionprice: '4',
          newprice: '15',
          Title: 'A4网格本外壳可拆格子记事26孔扣环活动页小清新女大学生'
        },
        {
          name: '得力橡皮擦',
          src: './static/img/merchant/w3.jpg',
          descript: '2b像皮擦批发专用美术文具用品橡皮檫不留痕小学生盒装象皮擦4b橡皮',
          deductionprice: '2.3',
          newprice: '10.9',
          Title: '2b像皮擦批发专用美术文具用品4b橡皮檫'
        },
        {
          name: '活页名片册',
          src: './static/img/merchant/w5.jpg',
          descript: '火车票、银行卡、纪念片、明星片、游戏卡、电影票、会员卡、手机相册等等都可以放起来收藏使用',
          deductionprice: '15',
          newprice: '60',
          Title: '相册本diy手工创意纪念册活页相册粘贴式照片书'
        }
      ],
      productList2: [
        {
          name: '晨光彩色铅笔',
          src: './static/img/merchant/s1.jpg',
          descript: '晨光彩色铅笔水溶性彩铅画笔彩笔专业画画套装成人手绘48色初学者36色学生用72色水溶款填色彩铅笔儿童油24色',
          oldprice: '1.5',
          newprice: '1.0',
          Title: '晨光彩色铅笔水溶性彩铅画笔彩笔专业画画套装成人手绘48色初学者36色学生用72色水溶款填色彩铅笔儿童油24色'
        },
        {
          name: '康奈尔笔记本',
          src: './static/img/merchant/s2.jpg',
          descript: '这是一款多彩设计的无线装订软抄本本，与众不同，给你的办公、学习生活添加一份色彩',
          oldprice: '18',
          newprice: '12',
          Title: '康奈尔'
        },
        {
          name: '得力橡皮擦',
          src: './static/img/merchant/s3.jpg',
          descript: 'scratch3.0编程视频教程小学生人工智能少儿趣味数学入门精通教学',
          oldprice: '9.9',
          newprice: '8.9',
          Title: '得力'
        },
        {
          name: '活页名片册',
          src: './static/img/merchant/s4.jpg',
          descript: '火车票、银行卡、纪念片、明星片、游戏卡、电影票、会员卡、手机相册等等都可以放起来收藏使用',
          oldprice: '95',
          newprice: '60',
          Title: '晨光'
        }
      ],
      productList3: [
        {
          title: '悠长的告别',
          text: '先让你心碎，再用爱把你拼凑完整....',
          newprice: '65',
          deductionprice: '11', // 金币抵扣
          datetime: '今天',
          fabulous: '125', // 点赞数
          comment: '4234', // 评论数
          src: './static/img/merchant/book1.jpg'
        },
        {
          title: '好妈妈胜过好老师',
          text: '本书是近年来难得一见的优秀的家庭教育原创作品，是教育专家尹建莉的教子手记。本书首次提出一些令人耳目一' +
          '新的家庭教育原则，使父母在教育孩子的时候有章可循。',
          deductionprice: '98', // 金币抵扣
          newprice: '432',
          datetime: '今天',
          fabulous: '431',
          comment: '23512',
          src: './static/img/merchant/book2.jpg'
        },
        {
          title: '爱弥儿',
          text: '《爱弥儿，或论教育》，系法国资产阶级民主主义者、杰出的启蒙思想家卢梭(1712—1778)的重要著作。' +
          '此书写于1757年，1762年第一次在荷兰的阿姆斯特丹出版...',
          datetime: '05月12日',
          deductionprice: '150', // 金币抵扣
          fabulous: '65',
          newprice: '645',
          comment: '523',
          src: './static/img/merchant/book3.jpg'
        },
        {
          title: '爱的教育',
          text: '《爱的教育》全书共一百篇文章，包括主人公安利柯在一个学年中所记的日记、其父母为他写的劝诫启发性的文章，' +
          '以及老师在课堂上宣读的发人深省的小故事。“爱”贯穿在每一章节中，既有国家、民族、社会的大我之爱...',
          newprice: '12',
          deductionprice: '343', // 金币抵扣
          datetime: '05月10日',
          fabulous: '734',
          comment: '83456',
          src: './static/img/merchant/book4.jpg'
        },
        {
          title: '与孩子的天性合作',
          text: '如果你喜欢看故事，那么卢安克独特又传奇的经历足够让你佩服：在偏僻的广西农村居住、教书、做农活、放牛……' +
          '不过卢安克的说法是：“其实我很自私，因为我是为了自己的兴趣选择最适合的环境，我有条件选择...',
          datetime: '05月9日',
          deductionprice: '1.0', // 金币抵扣
          newprice: '15',
          fabulous: '54',
          comment: '456',
          src: './static/img/merchant/book5.jpg'
        },
        {
          title: '少儿美术绘画练习',
          text: '《少儿美术绘画练习:漂亮公主上色》内容简介：小朋友们，你看，红橙黄绿青蓝紫，多美丽的颜色呀！' +
          '我们把头发涂成黄色的，把眼睛涂成蓝色的，把项链涂成紫色的，把袜子涂成绿色的……这些你也能做到！心动了吗？',
          datetime: '05月10日',
          newprice: '20',
          deductionprice: '7', // 金币抵扣
          fabulous: '734',
          comment: '83456',
          src: './static/img/merchant/book6.jpg'
        }
      ],
      activeName: 'first'
    }
  },
  methods: {
    handleClick() {
      console.log(1)
    }
  },
  created() {},
  watch: {},
  mounted() {},
  computed: {}
}
</script>

<style scoped>
.item_header{
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.item_header :hover {
  cursor: pointer;
}
.item_header .h2_border{
   margin-top: 8px;
   float: left;
   margin-bottom: 8px;
   line-height: 20px;
   font-size: 20px;
}
.item_header span{
   float: right;
   line-height: 20px;
   font-size: 14px;
   color: rgb(146, 146, 146);
   margin-top: 9px;
   margin-right: 10px;
   font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.item {
  margin-bottom: 16px;
}
</style>

