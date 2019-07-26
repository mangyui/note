AINOTE
===

团队项目 • 前后端分离 • 响应式布局 • HybridAPP安卓端

![运行截图](./show/AINote.png)

所用技术
------
* `vue` • `vuex` • `vue-router` • `axios` • `scss` 


## 小点

### 路由懒加载

```
{
    path: '/home',
    component: Layout,
    meta: { title: 'home', icon: 'home' },
    children: [
      {
        path: 'index',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: { title: 'home', icon: 'home' }
      },
      {
        path: 'search',
        name: 'search',
        hidden: true,
        // component: Csearch,
        component: () => import('@/views/home/search'),
        meta: { title: 'Search' }
      },
      
      ......
```

### 动态路由

```
    store.dispatch('GenerateRoutes', roles).then(() => {
      router.addRoutes(store.getters.addRouters)
      // 动态路由 刷新致命点
      router.addRoutes([{ path: '*', redirect: '/', hidden: true }])
      next({ ...to, replace: true })
    })
```

### 动态title标题

```
 watch: {
    $route(to, from) {
      // console.log(to)
      setTimeout(() => {
        setTitle(this.generateTitle(to.meta.title) + ' - ' + this.website.title)
      }, 0)
    }
  }
```

### 图像处理，文字识别（百度ocr）

```
    torun() {
      if (!this.cropImg) {
        this.$notify({
          title: '提示',
          message: '请先上传图片后再操作！',
          type: 'warning'
        })
        return
      }
      this.showGIF = true
      var ocr_data = {
        'image': this.cropImg.replace(/data:image\/.*;base64,/, '')
      }
      Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
      var url = ocr.baseurl
      if (this.ocrMode === 'acc') {
        url = ocr.accurate
      } else if (this.ocrMode === 'shouxie') {
        url = ocr.shouxie
      } else {
        url = ocr.baseurl
      }
      Axios.post(url, this.$qs.stringify(ocr_data))
        .then(res => {
          this.result = res.data.words_result
          this.lines = res.data.words_result_num
          this.$emit('Oresult', { result: this.result, lines: this.lines })
          this.showGIF = false
          // this.formatText()
          // console.log(res.data.words_result_num)
        })
        .catch(err => {
          console.error(err)
          this.showGIF = false
        })
    }
  }
```

### 录音采集，语音识别（讯飞ASR）

```
this.upload = function (callback) {
    var xhr = new XMLHttpRequest();
        if (callback) {
            xhr.upload.addEventListener("progress", function (e) {
            callback('uploading', e);
        }, false);
        xhr.addEventListener("load", function (e) {
             callback('ok', JSON.parse(e.currentTarget.responseText));
        }, false);
        xhr.addEventListener("error", function (e) {
            callback('error', e);
        }, false);
        xhr.addEventListener("abort", function (e) {
             callback('cancel', e);
         }, false);
        }
      var speechUrl;
      var that = this;
      let param = {
        engine_type: "sms16k",
        aue: "raw"
      }
      param = Base64.encode(JSON.stringify(param))
      this.blobToDataURL(this.getBlob(), function (dataurl) {
        speechUrl = dataurl;
        var data = {
          "audio": speechUrl.split(',')[1],//base64的音频文件
        }
        let curTime = (new Date().getTime() / 1000) | 0 + ''
        xhr.open("POST", voice.serverurl + 'asr');
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
        xhr.setRequestHeader("X-Appid",voice.appId);
        xhr.setRequestHeader("X-CurTime",curTime);
        xhr.setRequestHeader("X-Param",param);
        xhr.setRequestHeader("X-CheckSum",md5(voice.APIKey + curTime + param));
        xhr.send(qs.stringify(data));
      });
      // 主动销毁上下文，避免6次上限
      context.close() 
    }
```

### svg 图标
```
Vue.component('svg-icon', nxSvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
```

### keep-alive缓存
```
  <keep-alive :include="hasViews">
    <router-view :key="key"></router-view>
  </keep-alive>
```
