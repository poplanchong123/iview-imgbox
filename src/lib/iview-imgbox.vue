<template>
  <div>
    <Modal v-model="visible" title="图片" class-name="my-modal vertical-center-modal" width="900px;">
      <Spin fix size="large" v-show="isLoading"></Spin>

      <Row style="margin-left:20px;">
        <Upload
          :action="options.uploadParams.url"
          :data="options.uploadParams.data"
          :headers="options.uploadParams.headers"
          :on-success="handleSuccess"
          :on-error="handleError"
          :format="['jpg','jpeg','png','gif','bmp']"
          accept=".jpg, .jpeg, .png, .gif, .bmp"
          :max-size="options.maxSize"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="beforeUpload"
          :show-upload-list="false"
          :multiple="true"
          ref="up"
          class="upload"
        >
          <Button type="primary" size="large">上传图片</Button>
        </Upload>
        <Button
          type="error"
          size="large"
          style="margin-left:10px;"
          @click="handleDeleteSelectAll"
        >删除</Button>
      </Row>
      <Divider style="margin:10px 0 0 0;" size="small"/>
      <div class="img-body">
        <div class="img-container">
          <div
            class="item"
            v-for="img in imgRes.list"
            :key="img.id"
            :style="{backgroundImage: 'url(' + img.url + ')'}"
            @click="handleSelectImage(img)"
            :class="{'active':img.selected}"
          >
            <div class="name">{{img.name}}</div>
            <div class="mask">
              <Icon type="md-checkmark"/>
            </div>
            <div class="del" @click.stop="handleDeleteImage(img)">
              <Icon type="md-trash" size="16"/>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer">
        <Row>
          <Col span="2">
            <Checkbox
              v-if="options.multiple"
              v-model="selectAll"
              size="large"
              @on-change="handleCancelOrSelectAll(selectAll)"
            >全选</Checkbox>
          </Col>
          <Col span="22">
            <Page
              :total="imgRes.total"
              :page-size="options.pageSize"
              show-elevator
              @on-change="handlePageChange"
            />
          </Col>
        </Row>
        <br>
        <Row>
          <Col style="text-align:center;">
            <Button size="large" style="padding-left:50px;padding-right:50px;">取消</Button>
            <Badge :count="selectedImgCount">
              <Button
                @click="handleConfirmSelect"
                type="primary"
                style="padding-left:50px;padding-right:50px;margin-left:30px;"
              >确定</Button>
            </Badge>
          </Col>
        </Row>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "iview-imgbox",
  data() {
    return {
      options: {
        uploadParams: {
          url: "", // 图片上传URL
          data: {},
          headers: {},
          method: "POST"
        },
        listParams: {
          url: "", // 图片列表URL
          data: {},
          headers: {},
          method: "GET"
        },
        deleteParams: {
          url: "", // 删除图片URL
          data: {},
          headers: {},
          method: "POST"
        },
        pageSize: 18, // 每页展示图片数
        multiple: true, // 是否支持选取多个图片
        limit: 5, // 一批次最多可上传图片数
        onSelect: null, // 选择后回调函数
        enableUpload: true, // 是否启用图片上传
        maxSize: 5120 // 最大尺寸（K）
      },
      isLoading: true,
      visible: true,
      selectedImgs: {},
      selectedImgCount: 0,
      uploadSuccessCount: 0,
      fixThumbInterval: null,
      imgRes: {
        list: [],
        total: 0
      },
      selectAll: false,
      page: 1
    };
  },
  methods: {
    /**
     * 多选时同步已选图片数量
     */
    syncSelectedImgCount() {
      let selectedCount = 0;
      $.each(this.selectedImgs, function(key, val) {
        selectedCount++;
      });
      this.selectedImgCount = selectedCount;
    },
    /**
     * 加载图片列表数据
     * @param page
     */
    loadImgList(page = 1) {
      this.page = page;
      let listParams = this.options.listParams;
      const url = listParams.url;

      if (url == "") {
        return;
      }

      this.isLoading = true;
      let pageSize = this.options.pageSize;

      let req = listParams;
      req["data"] = Object.assign(req.data, { page: page, rows: pageSize });

      $.ajax(req).done(res => {
        //{
        //     "code": 1,
        //     "success": true,
        //     "tip": "请求成功",
        //     "data": {
        //         "total": 1,
        //         "list": [
        //             {
        //                 "id": "1",
        //                 "name": "alired.jpg",
        //                 "url": "http://demo.myapiadmin.com.cn/attachment/images/2019/05/LmTMc1J419JVVvs6f96Z6f0Y90y1Xz.jpg",
        //                 "attachment": "images/2019/05/LmTMc1J419JVVvs6f96Z6f0Y90y1Xz.jpg"
        //             }
        //         ]
        //     }
        // }
        if (!res.success) {
          this.$Message.warning({
            content: "程序异常"
          });
          return;
        }

        var res = res.data;

        this.renderimgList(res);
      });
    },
    /**
     * 渲染数据
     */
    renderimgList(res) {
      let data = this.$data;
      let imgs = [];
      data.imgRes.total = parseInt(res.total);

      for (const i in res.list) {
        let img = res.list[i];

        // 图片缩略图
        if (typeof img.url !== "string") {
          let err = "图片数据必须包含'url'属性！";
          alert(err);
          throw err;
        }

        // 图片名
        if (typeof img.name !== "string") {
          img.name = img.url.substr(img.url.lastIndexOf("/") + 1);
        }

        // 图片选中状态
        img.selected = typeof data.selectedImgs[img.id] === "object";

        imgs.push(img);
      }

      data.imgRes.list = imgs;
      data.isLoading = false;
    },
    /**
     * 分页页面变化时刷新数据
     * @param page
     */
    handlePageChange(page) {
      this.loadImgList(page);
    },
    /**
     * 点击图片时选中或取消选中图片
     * @param img object
     */
    handleSelectImage(img) {
      if (typeof this.selectedImgs[img.id] === "object") {
        // 取消选择图片
        img.selected = false;

        let selectedImgs = {};
        if (this.options.multiple) {
          $.each(this.selectedImgs, function(key, val) {
            if (key === img.id) {
              return;
            }
            selectedImgs[key] = val;
          });
        }

        this.selectedImgs = selectedImgs;
      } else {
        // 选择图片
        if (
          this.options.limit > 0 &&
          this.selectedImgCount >= this.options.limit
        ) {
          this.$message({
            message: "最多只能选择" + this.options.limit + "张图片",
            type: "warning"
          });
          return;
        }

        if (!this.options.multiple) {
          // 单选时，取消已选
          this.handleCancelAll();
        }

        img.selected = true;
        this.selectedImgs[img.id] = JSON.parse(JSON.stringify(img));
      }

      this.syncSelectedImgCount();
    },
    /**
     *  取消已选
     */
    handleCancelAll() {
      this.selectedImgCount = 0;
      this.selectedImgs = {};
      for (const i in this.imgRes.list) {
        this.imgRes.list[i].selected = false;
      }
    },
    /**
     *  删除选中
     */
    handleDeleteImage(img) {
      this.deleteImgageByIds(img.id);
    },
    /**
     * 删除图片请求
     */
    deleteImgageByIds(ids) {
      let deleteParams = this.options.deleteParams;
      const url = deleteParams.url;

      if (url == "") {
        return;
      }

      this.$Modal.confirm({
        title: "提示",
        content: "删除不可恢复,确认删除么?",
        onOk: () => {
          let pageSize = this.options.pageSize;
          let req = deleteParams;
          req["data"] = Object.assign(req.data, { ids: ids });

          $.ajax(req).done(res => {
            if (res.success) {
              this.$Message.success("删除成功");

              this.loadImgList(this.page);
              this.reset();
            } else {
              this.$Message.error("删除失败");
            }
          });
        },
        onCancel: () => {},
        closable: true
      });
    },
    /**
     * 批量删除选中
     */
    handleDeleteSelectAll() {
      if (this.selectedImgCount <= 0) {
        return this.$Message.warning("请选择要删除的图片");
      }
      let ids = [];
      $.each(this.selectedImgs, function(key, val) {
        ids.push(key);
      });
      ids = ids.join(",");
      this.deleteImgageByIds(ids);
    },
    /**
     * 上传之前验证
     */
    beforeUpload() {
      const check = this.uploadSuccessCount < this.options.limit;
      if (!check) {
        this.$Notice.warning({
          title: "文件数量超限",
          desc: "上传图片数量不能超过" + this.options.limit + "张"
        });
      }
      return check;
    },
    /**
     * 上传格式错误
     */
    handleFormatError(file) {
      this.$Notice.warning({
        title: "不支持的文件格式",
        desc:
          "所选文件‘ " +
          file.name +
          " ’格式不正确, 请选择 .jpg .jpeg .png .gif .bmp格式文件"
      });
    },
    /**
     * 上传大小超限
     */
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件大小过大",
        desc:
          "所选文件‘ " +
          file.name +
          " ’大小过大, 不得超过 " +
          this.fileLimit +
          "."
      });
    },
    /**
     * 上传成功
     */
    handleSuccess(res, file) {
      // {
      //     "code":1,
      //     "success":true,
      //     "tip":"上传成功",
      //     "data":{
      //         "item":{
      //             "id":"LS2oBKS5",
      //             "name":"演示图片lala",
      //             "url":"http://imgbox.imcm.me/test/img/04.jpg",
      //             "attachment":""
      //         },
      //         "total":"1"
      //     }
      // }
      if (res.success == true) {
        let data = this.$data;
        data.imgRes.list.splice(0, 0, res.data.item);
        let currentPageImgCnt = data.imgRes.list.length;
        // 超出本页移除
        if (currentPageImgCnt > this.options.pageSize) {
          data.imgRes.list.splice(currentPageImgCnt - 1, 1);
        }
        data.imgRes.total = res.data.total;
      } else {
        this.$Message.error(res.message);
      }
    },
    /**
     * 上传失败
     */
    handleError(error, file, fileList) {
      this.$Message.error(error.toString());
    },
    /**
     *  全不选
     */
    handleCanceAll() {
      this.handleCancelOrSelectAll(false);
    },
    /**
     *  全选
     */
    handleSelectAll() {
      this.handleCancelOrSelectAll(true);
    },
    /**
     *  全选/全不选
     */
    handleCancelOrSelectAll(select) {
      let selectedImgCount = 0;
      let selectedImgs = {};
      if (select) {
        selectedImgCount = this.imgRes.list.length;
        $.each(this.imgRes.list, function(key, img) {
          selectedImgs[img.id] = JSON.parse(JSON.stringify(img));
        });
      }
      this.selectedImgCount = selectedImgCount;
      this.selectedImgs = selectedImgs;
      for (const i in this.imgRes.list) {
        this.imgRes.list[i].selected = select;
      }
    },
    /**
     * 确认选择从列表选择的图片
     */
    handleConfirmSelect() {
      if (typeof this.options.onSelect !== "function") {
        this.$Message.error("请先设置回调函数");
        return false;
      }

      const cb = $.Callbacks();
      cb.add(this.options.onSelect);

      // 单选返回一个图片
      let img_list = [];
      for (const i in this.selectedImgs) {
        img_list.push(this.selectedImgs[i]);
      }
      cb.fire(img_list);

      // 隐藏弹窗
      this.visible = false;
      this.reset();
    },
    /**
     * 重置参数
     */
    reset() {
      this.uploadSuccessCount = 0;
      this.handleCancelAll();
    },
    /**
     * 文件大小转换kb转其他
     */
    changeUnit(limit) {
      var size = "";
      if (limit < 0.1 * 1024) {
        //小于0.1MB，则转化成KB
        size = limit.toFixed(2) + "KB";
      } else if (limit < 0.1 * 1024 * 1024) {
        //小于0.1GB，则转化成MB
        size = (limit / 1024).toFixed(2) + "MB";
      } else {
        //其他转化成GB
        size = (limit / (1024 * 1024)).toFixed(2) + "GB";
      }

      var sizeStr = size + ""; //转成字符串
      var index = sizeStr.indexOf("."); //获取小数点处的索引
      var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
      if (dou == "00") {
        //判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
      }
      return size;
    }
  },
  computed: {
    fileLimit() {
      return this.changeUnit(this.options.maxSize);
    }
  },
  mounted() {
    this.loadImgList();
  }
};
</script>


<style lang="" scoped>
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vertical-center-modal .ivu-modal {
  top: 0;
}

.img-body {
  height: 460px;
}

.img-container {
  display: flex;
  display: -webkit-flex;
  padding: 10px 10px 41px;
  flex-wrap: wrap;
  max-height: 460px;
  overflow-y: hidden;
}

.img-container .item {
  flex: none;
  position: relative;
  width: calc(20% - 40px); /*图片宽*/
  margin: 5px; /*图片间间距*/
  text-align: center;
  vertical-align: middle;
  background-color: #eee;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}

.img-container .item:before {
  content: "";
  display: inline-block;
  padding-bottom: 100%;
  width: 0.1px;
  vertical-align: middle;
}

.img-container .item:hover {
  outline: 2px solid #3296fa;
}

.img-container .item:hover .del {
  display: block;
}

.img-container .item .mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  display: none;
}

.img-container .item.active .mask {
  display: block;
}

.img-container .item .mask .ivu-icon {
  color: #fff;
  font-size: 32px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.img-container .item .del {
  position: absolute;
  width: 34px;
  line-height: 34px;
  text-align: center;
  background-color: #3296fa;
  cursor: pointer;
  bottom: 0;
  right: 0;
  z-index: 6;
  color: #ffffff;
  display: none;
}

.img-container .item .name {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  line-height: 34px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 0 20px;
  text-align: left;
  z-index: 2;
}

.img-container .item .name {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.my-modal .upload {
  display: inline-block;
}
</style>