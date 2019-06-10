!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("iview-imgbox",[],t):"object"==typeof exports?exports["iview-imgbox"]=t():e["iview-imgbox"]=t()}("undefined"!=typeof self?self:this,function(){return function(e){function t(i){if(n[i])return n[i].exports;var a=n[i]={i:i,l:!1,exports:{}};return e[i].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/dist/",t(t.s=1)}([function(e,t,n){"use strict";var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.a={name:"iview-imgbox",data:function(){return{options:{uploadParams:{url:"",data:{},headers:{},method:"POST"},listParams:{url:"",data:{},headers:{},method:"GET"},deleteParams:{url:"",data:{},headers:{},method:"POST"},pageSize:18,multiple:!0,limit:5,onSelect:null,enableUpload:!0,maxSize:5120},isLoading:!0,visible:!0,selectedImgs:{},selectedImgCount:0,uploadSuccessCount:0,fixThumbInterval:null,imgRes:{list:[],total:0},selectAll:!1,page:1}},methods:{syncSelectedImgCount:function(){var e=0;$.each(this.selectedImgs,function(t,n){e++}),this.selectedImgCount=e},loadImgList:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.page=t;var n=this.options.listParams;if(""!=n.url){this.isLoading=!0;var i=this.options.pageSize,a=n;a.data=Object.assign(a.data,{page:t,rows:i}),$.ajax(a).done(function(t){if(!t.success)return void e.$Message.warning({content:"程序异常"});var t=t.data;e.renderimgList(t)})}},renderimgList:function(e){var t=this.$data,n=[];t.imgRes.total=parseInt(e.total);for(var a in e.list){var o=e.list[a];if("string"!=typeof o.url){var s="图片数据必须包含'url'属性！";throw alert(s),s}"string"!=typeof o.name&&(o.name=o.url.substr(o.url.lastIndexOf("/")+1)),o.selected="object"===i(t.selectedImgs[o.id]),n.push(o)}t.imgRes.list=n,t.isLoading=!1},handlePageChange:function(e){this.loadImgList(e)},handleSelectImage:function(e){if("object"===i(this.selectedImgs[e.id])){e.selected=!1;var t={};this.options.multiple&&$.each(this.selectedImgs,function(n,i){n!==e.id&&(t[n]=i)}),this.selectedImgs=t}else{if(this.options.limit>0&&this.selectedImgCount>=this.options.limit)return void this.$message({message:"最多只能选择"+this.options.limit+"张图片",type:"warning"});this.options.multiple||this.handleCancelAll(),e.selected=!0,this.selectedImgs[e.id]=JSON.parse(JSON.stringify(e))}this.syncSelectedImgCount()},handleCancelAll:function(){this.selectedImgCount=0,this.selectedImgs={};for(var e in this.imgRes.list)this.imgRes.list[e].selected=!1},handleDeleteImage:function(e){this.deleteImgageByIds(e.id)},deleteImgageByIds:function(e){var t=this,n=this.options.deleteParams;""!=n.url&&this.$Modal.confirm({title:"提示",content:"删除不可恢复,确认删除么?",onOk:function(){var i=(t.options.pageSize,n);i.data=Object.assign(i.data,{ids:e}),$.ajax(i).done(function(e){e.success?(t.$Message.success("删除成功"),t.loadImgList(t.page),t.reset()):t.$Message.error("删除失败")})},onCancel:function(){},closable:!0})},handleDeleteSelectAll:function(){if(this.selectedImgCount<=0)return this.$Message.warning("请选择要删除的图片");var e=[];$.each(this.selectedImgs,function(t,n){e.push(t)}),e=e.join(","),this.deleteImgageByIds(e)},beforeUpload:function(){var e=this.uploadSuccessCount<this.options.limit;return e||this.$Notice.warning({title:"文件数量超限",desc:"上传图片数量不能超过"+this.options.limit+"张"}),e},handleFormatError:function(e){this.$Notice.warning({title:"不支持的文件格式",desc:"所选文件‘ "+e.name+" ’格式不正确, 请选择 .jpg .jpeg .png .gif .bmp格式文件"})},handleMaxSize:function(e){this.$Notice.warning({title:"文件大小过大",desc:"所选文件‘ "+e.name+" ’大小过大, 不得超过 "+this.fileLimit+"."})},handleSuccess:function(e,t){if(1==e.success){var n=this.$data;n.imgRes.list.splice(0,0,e.data.item);var i=n.imgRes.list.length;i>this.options.pageSize&&n.imgRes.list.splice(i-1,1),n.imgRes.total=e.data.total}else this.$Message.error(e.message)},handleError:function(e,t,n){this.$Message.error(e.toString())},handleCanceAll:function(){this.handleCancelOrSelectAll(!1)},handleSelectAll:function(){this.handleCancelOrSelectAll(!0)},handleCancelOrSelectAll:function(e){var t=0,n={};e&&(t=this.imgRes.list.length,$.each(this.imgRes.list,function(e,t){n[t.id]=JSON.parse(JSON.stringify(t))})),this.selectedImgCount=t,this.selectedImgs=n;for(var i in this.imgRes.list)this.imgRes.list[i].selected=e},handleConfirmSelect:function(){if("function"!=typeof this.options.onSelect)return this.$Message.error("请先设置回调函数"),!1;var e=$.Callbacks();e.add(this.options.onSelect);var t=[];for(var n in this.selectedImgs)t.push(this.selectedImgs[n]);e.fire(t),this.visible=!1,this.reset()},reset:function(){this.uploadSuccessCount=0,this.handleCancelAll()},changeUnit:function(e){var t="";t=e<102.4?e.toFixed(2)+"KB":e<104857.6?(e/1024).toFixed(2)+"MB":(e/1048576).toFixed(2)+"GB";var n=t+"",i=n.indexOf(".");return"00"==n.substr(i+1,2)?n.substring(0,i)+n.substr(i+3,2):t}},computed:{fileLimit:function(){return this.changeUnit(this.options.maxSize)}},mounted:function(){this.loadImgList()}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(2),a={install:function(e){var t=e.extend(i.a),n=void 0;e.iviewImgbox=e.prototype.$iviewImgbox=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(n||(n=new t),n.options=$.extend(!0,{},n.options,e),!n.$el){var i=n.$mount();document.querySelector("body").appendChild(i.$el)}return n.options.multiple||n.handleCancelAll(),n.visible=!0,n}}};"undefined"!=typeof window&&window.Vue&&window.Vue.use(a),t.default=a},function(e,t,n){"use strict";function i(e){n(3)}var a=n(0),o=n(9),s=n(8),r=i,l=s(a.a,o.a,!1,r,"data-v-454b9ddd",null);t.a=l.exports},function(e,t,n){var i=n(4);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);n(6)("0b10aeac",i,!0,{})},function(e,t,n){t=e.exports=n(5)(!1),t.push([e.i,'.vertical-center-modal[data-v-454b9ddd]{display:flex;align-items:center;justify-content:center}.vertical-center-modal .ivu-modal[data-v-454b9ddd]{top:0}.img-body[data-v-454b9ddd]{height:460px}.img-container[data-v-454b9ddd]{display:flex;display:-webkit-flex;padding:10px 10px 41px;flex-wrap:wrap;max-height:460px;overflow-y:hidden}.img-container .item[data-v-454b9ddd]{flex:none;position:relative;width:calc(20% - 40px);margin:5px;text-align:center;vertical-align:middle;background-color:#eee;background-size:contain;background-repeat:no-repeat;background-position:50% 50%}.img-container .item[data-v-454b9ddd]:before{content:"";display:inline-block;padding-bottom:100%;width:.1px;vertical-align:middle}.img-container .item[data-v-454b9ddd]:hover{outline:2px solid #3296fa}.img-container .item:hover .del[data-v-454b9ddd]{display:block}.img-container .item .mask[data-v-454b9ddd]{position:absolute;top:0;right:0;bottom:0;left:0;z-index:5;background-color:rgba(0,0,0,.5);text-align:center;display:none}.img-container .item.active .mask[data-v-454b9ddd]{display:block}.img-container .item .mask .ivu-icon[data-v-454b9ddd]{color:#fff;font-size:32px;position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.img-container .item .del[data-v-454b9ddd]{position:absolute;width:34px;line-height:34px;text-align:center;background-color:#3296fa;cursor:pointer;bottom:0;right:0;z-index:6;color:#fff;display:none}.img-container .item .name[data-v-454b9ddd]{position:absolute;bottom:0;left:0;width:100%;line-height:34px;background:rgba(0,0,0,.5);color:#fff;padding:0 20px;text-align:left;z-index:2;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.my-modal .upload[data-v-454b9ddd]{display:inline-block}',""])},function(e,t){function n(e,t){var n=e[1]||"",a=e[3];if(!a)return n;if(t&&"function"==typeof btoa){var o=i(a);return[n].concat(a.sources.map(function(e){return"/*# sourceURL="+a.sourceRoot+e+" */"})).concat([o]).join("\n")}return[n].join("\n")}function i(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var i=n(t,e);return t[2]?"@media "+t[2]+"{"+i+"}":i}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var i={},a=0;a<this.length;a++){var o=this[a][0];"number"==typeof o&&(i[o]=!0)}for(a=0;a<e.length;a++){var s=e[a];"number"==typeof s[0]&&i[s[0]]||(n&&!s[2]?s[2]=n:n&&(s[2]="("+s[2]+") and ("+n+")"),t.push(s))}},t}},function(e,t,n){function i(e){for(var t=0;t<e.length;t++){var n=e[t],i=c[n.id];if(i){i.refs++;for(var a=0;a<i.parts.length;a++)i.parts[a](n.parts[a]);for(;a<n.parts.length;a++)i.parts.push(o(n.parts[a]));i.parts.length>n.parts.length&&(i.parts.length=n.parts.length)}else{for(var s=[],a=0;a<n.parts.length;a++)s.push(o(n.parts[a]));c[n.id]={id:n.id,refs:1,parts:s}}}}function a(){var e=document.createElement("style");return e.type="text/css",u.appendChild(e),e}function o(e){var t,n,i=document.querySelector("style["+v+'~="'+e.id+'"]');if(i){if(m)return g;i.parentNode.removeChild(i)}if(b){var o=f++;i=p||(p=a()),t=s.bind(null,i,o,!1),n=s.bind(null,i,o,!0)}else i=a(),t=r.bind(null,i),n=function(){i.parentNode.removeChild(i)};return t(e),function(i){if(i){if(i.css===e.css&&i.media===e.media&&i.sourceMap===e.sourceMap)return;t(e=i)}else n()}}function s(e,t,n,i){var a=n?"":i.css;if(e.styleSheet)e.styleSheet.cssText=y(t,a);else{var o=document.createTextNode(a),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(o,s[t]):e.appendChild(o)}}function r(e,t){var n=t.css,i=t.media,a=t.sourceMap;if(i&&e.setAttribute("media",i),h.ssrId&&e.setAttribute(v,t.id),a&&(n+="\n/*# sourceURL="+a.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */"),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}var l="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!l)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var d=n(7),c={},u=l&&(document.head||document.getElementsByTagName("head")[0]),p=null,f=0,m=!1,g=function(){},h=null,v="data-vue-ssr-id",b="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());e.exports=function(e,t,n,a){m=n,h=a||{};var o=d(e,t);return i(o),function(t){for(var n=[],a=0;a<o.length;a++){var s=o[a],r=c[s.id];r.refs--,n.push(r)}t?(o=d(e,t),i(o)):o=[];for(var a=0;a<n.length;a++){var r=n[a];if(0===r.refs){for(var l=0;l<r.parts.length;l++)r.parts[l]();delete c[r.id]}}}};var y=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()},function(e,t){e.exports=function(e,t){for(var n=[],i={},a=0;a<t.length;a++){var o=t[a],s=o[0],r=o[1],l=o[2],d=o[3],c={id:e+":"+a,css:r,media:l,sourceMap:d};i[s]?i[s].parts.push(c):n.push(i[s]={id:s,parts:[c]})}return n}},function(e,t){e.exports=function(e,t,n,i,a,o){var s,r=e=e||{},l=typeof e.default;"object"!==l&&"function"!==l||(s=e,r=e.default);var d="function"==typeof r?r.options:r;t&&(d.render=t.render,d.staticRenderFns=t.staticRenderFns,d._compiled=!0),n&&(d.functional=!0),a&&(d._scopeId=a);var c;if(o?(c=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),i&&i.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(o)},d._ssrRegister=c):i&&(c=i),c){var u=d.functional,p=u?d.render:d.beforeCreate;u?(d._injectStyles=c,d.render=function(e,t){return c.call(t),p(e,t)}):d.beforeCreate=p?[].concat(p,c):[c]}return{esModule:s,exports:r,options:d}}},function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("Modal",{attrs:{title:"图片","class-name":"my-modal vertical-center-modal",width:"900px;"},model:{value:e.visible,callback:function(t){e.visible=t},expression:"visible"}},[n("Spin",{directives:[{name:"show",rawName:"v-show",value:e.isLoading,expression:"isLoading"}],attrs:{fix:"",size:"large"}}),e._v(" "),n("Row",{staticStyle:{"margin-left":"20px"}},[n("Upload",{ref:"up",staticClass:"upload",attrs:{action:e.options.uploadParams.url,data:e.options.uploadParams.data,headers:e.options.uploadParams.headers,"on-success":e.handleSuccess,"on-error":e.handleError,format:["jpg","jpeg","png","gif","bmp"],accept:".jpg, .jpeg, .png, .gif, .bmp","max-size":e.options.maxSize,"on-format-error":e.handleFormatError,"on-exceeded-size":e.handleMaxSize,"before-upload":e.beforeUpload,"show-upload-list":!1,multiple:!0}},[n("Button",{attrs:{type:"primary",size:"large"}},[e._v("上传图片")])],1),e._v(" "),n("Button",{staticStyle:{"margin-left":"10px"},attrs:{type:"error",size:"large"},on:{click:e.handleDeleteSelectAll}},[e._v("删除")])],1),e._v(" "),n("Divider",{staticStyle:{margin:"10px 0 0 0"},attrs:{size:"small"}}),e._v(" "),n("div",{staticClass:"img-body"},[n("div",{staticClass:"img-container"},e._l(e.imgRes.list,function(t){return n("div",{key:t.id,staticClass:"item",class:{active:t.selected},style:{backgroundImage:"url("+t.url+")"},on:{click:function(n){return e.handleSelectImage(t)}}},[n("div",{staticClass:"name"},[e._v(e._s(t.name))]),e._v(" "),n("div",{staticClass:"mask"},[n("Icon",{attrs:{type:"md-checkmark"}})],1),e._v(" "),n("div",{staticClass:"del",on:{click:function(n){return n.stopPropagation(),e.handleDeleteImage(t)}}},[n("Icon",{attrs:{type:"md-trash",size:"16"}})],1)])}),0)]),e._v(" "),n("div",{attrs:{slot:"footer"},slot:"footer"},[n("Row",[n("Col",{attrs:{span:"2"}},[e.options.multiple?n("Checkbox",{attrs:{size:"large"},on:{"on-change":function(t){return e.handleCancelOrSelectAll(e.selectAll)}},model:{value:e.selectAll,callback:function(t){e.selectAll=t},expression:"selectAll"}},[e._v("全选")]):e._e()],1),e._v(" "),n("Col",{attrs:{span:"22"}},[n("Page",{attrs:{total:e.imgRes.total,"page-size":e.options.pageSize,"show-elevator":""},on:{"on-change":e.handlePageChange}})],1)],1),e._v(" "),n("br"),e._v(" "),n("Row",[n("Col",{staticStyle:{"text-align":"center"}},[n("Button",{staticStyle:{"padding-left":"50px","padding-right":"50px"},attrs:{size:"large"}},[e._v("取消")]),e._v(" "),n("Badge",{attrs:{count:e.selectedImgCount}},[n("Button",{staticStyle:{"padding-left":"50px","padding-right":"50px","margin-left":"30px"},attrs:{type:"primary"},on:{click:e.handleConfirmSelect}},[e._v("确定")])],1)],1)],1)],1)],1)],1)},a=[],o={render:i,staticRenderFns:a};t.a=o}])});
//# sourceMappingURL=iview-imgbox.js.map