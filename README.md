# iview-imgbox

[![AUR](https://img.shields.io/aur/license/yaourt.svg)](https://github.com/poplanchong123/iview-imgbox/blob/master/LICENSE)
[![](https://img.shields.io/badge/Author-Exrick-orange.svg)](http://www.poplanchong.top)
[![](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)](https://github.com/Exrick/x-boot)
[![GitHub stars](https://img.shields.io/github/stars/poplanchong123/iview-imgbox.svg?style=social&label=Stars)](https://github.com/poplanchong123/iview-imgbox)
[![GitHub forks](https://img.shields.io/github/forks/poplanchong123/iview-imgbox.svg?style=social&label=Fork)](https://github.com/poplanchong123/iview-imgbox)

> 一个基于 iview 开发的一个上传图片的 vue 组件库

### 运行

```bash
# 建立依赖
npm install

# 在本地主机上进行热重新加载：8080
npm run dev
```

### 截图预览

![QQ截图20190605092410.png](https://i.loli.net/2019/06/05/5cf7194cbb04843451.png)

![QQ截图20190605092425.png](https://i.loli.net/2019/06/05/5cf7194cd78d213157.png)


### 使用说明

1.项目依赖vue,iview,jquery，保证集成项目有这些库
``` html
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/iview@3.4.2/dist/styles/iview.css"/>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/iview@3.4.2/dist/iview.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
```

2.引入dist/iview-imgbox.js
``` html
<script src="./dist/iview-imgbox.js"></script>
```

3.使用
```html
  <div id="app">

      <Card>
        <p slot="title">多选</p>
        <div>
            <Row>
              <i-col span="12">
                <i-input placeholder="" disabled/>
                <i-button slot="append" @click="multiple">选择图片</i-button>
              </i-col>
            </Row>
            <Row type="flex" justify="start" gutter="16" style="margin-top:10px;">
              <i-col>
                <div class="img-list" v-for="(img, index) in multiple_img_list" :key="img.id">
                    <img :src="img.url" onerror="this.src='./src/assets/nopic.jpg'; this.title='图片未找到.'; this.onerror=null;" width="150" class="img-responsive img-thumbnail">
                    <em class="close" style="position: absolute; top:0px; right:-14px;" title="删除这张图片" @click="deleteImage(index,multiple_img_list)">×</em>
                </div>
              </i-col>
            </Row>
          </div>
      </Card>
    </div>
```
```html
<script>
  var app = new Vue({
    el: '#app',
    data: function() {
      return {
        single_img_list: [],
        multiple_img_list:[],
        opts: {
          uploadUrl: '',// 上传图片接口链接
          uploadParams: {},// 用于验证信息
          listUrl: '',// 图片列表接口链接
          listParams: {},// 用于验证信息
          deleteUrl: '',// 删除图片接口链接
          deleteParams: {}, // 用于验证信息
          multiple: true,
          enableUpload: true,
          maxSize: 2048,
          onSelect: img_list=> {
            // 选中图片后回调处理
            this.multiple_img_list = img_list;
          }
        }
      }
    },
    methods: {
      multiple: function() {
        this.$iviewImgbox(this.opts)
      },
      deleteImage(index,list){
        list.splice(index,1);
      },
    }
  })

</script>
```
> 注：详细参考项目index.html文件
