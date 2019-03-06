<template>
  <div class="open_window">
    <iframe :src="url" frameborder="0"></iframe>
  </div>
</template>


<script>
export default {
  name: 'open',
  created() {
    var pid = this.$route.params.id
    var index = this.webs.find((item) => {
      // 下列注释可取消eslint规则
      return item.id == pid//eslint-disable-line
    })
    this.url = index.url
  },
  data() {
    return {
      url: 'https://www.baidu.com/',
      webs: [
        {
          id: 1,
          title: '百度',
          url: 'https://www.baidu.com/',
          img: 'https://www.baidu.com/img/bd_logo1.png'
        },
        {
          id: 2,
          title: '百度翻译',
          url: 'https://fanyi.baidu.com/',
          img: 'https://fanyi.bdstatic.com/static/translation/img/header/logo_cbfea26.png'
        },
        {
          id: 3,
          title: '百度文库',
          url: 'https://wenku.baidu.com/',
          img: 'static/img/mock/card/wenku.jpg'
        }
      ]
    }
  }
}
</script>

<style scoped>
.open_window{
  height: 99%;
}
iframe{
  width: 100%;
  height: 100%;
}
</style>
