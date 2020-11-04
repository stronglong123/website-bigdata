import Vue from 'vue'
import App from './App.vue'
// import App from './Portal.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import _ from 'lodash'
import '@/assets/fonts/iconfont.css'
import './antd'
// import './components/timeOutLogin/loginModal'
import './draggableInit'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import Mock from './mock'
import '@/assets/jigsaw/jigsaw.css'
import '@/assets/jigsaw/jigsaw.js'
import mixins from '@/common/mixins'
import './registerServiceWorker'
import Contextmenu from "vue-contextmenujs"
Vue.use(Contextmenu);
// 引入外部视频插件
import VideoPlayer from "vue-video-player";
import SparkMD5 from '@/common/utils/spark-md5-3.0.0.min'
import '@/common/utils/mathFuc'
// 引入vue-amap
// import VueAMap from 'vue-amap';
// Vue.use(VueAMap);

require("video.js/dist/video-js.css");
require("vue-video-player/src/custom-theme.css");
Vue.use(VideoPlayer);

// 初始化vue-amap
// VueAMap.initAMapApiLoader({
//     // 高德的key
//     key: '83c5c64438ea3fd8def44a3087093d51',
//     // 插件集合
//     plugin: ['AMap.Geocoder','AMap.Driving','AMap.MouseTool','AMap.Scale','AMap.PolyEditor','AMap.Autocomplete','AMap.PlaceSearch', 'AMap.ToolBar',],
//     // 高德 sdk 版本，默认为 1.4.4
//     v: '1.4.4',
//     uiVersion: '1.0.11'
// });

Vue.directive('allow', {
  bind: function (el, binding, vnode) {
    setTimeout(() => {
      // 通过登录成功后获取所有权限列表，如下permissGroup类型，存到vuex，其中所有名字必须均独一无二
      let {context} = vnode
      let btnPermissions = context.btnPermissions
      // 按组名获取权限列表，
      if (binding.value && !btnPermissions.some(it => it.toLowerCase() === binding.value)) {
        el.style.display = "none"
      }
    }, 0)
  }
})


Vue.config.productionTip = false
Vue.config.silent = false
Vue.config.keyCodes.f1 = 112
Vue.config.keyCodes.f2 = 113
Vue.config.keyCodes.f3 = 114
Vue.config.keyCodes.f4 = 115
Vue.config.keyCodes.f5 = 116
Vue.config.keyCodes.f6 = 117
Vue.config.keyCodes.f7 = 118
Vue.config.keyCodes.f8 = 119
Vue.config.keyCodes.f9 = 120
Vue.config.keyCodes.f10 = 121
Vue.config.keyCodes.f11 = 122
Vue.config.keyCodes.f12 = 123
Vue.prototype._ = _
Vue.prototype._store = store

// Vue.prototype.$axios = axios
Vue.prototype.$http = axios
Vue.use(ElementUI);
Vue.mixin(mixins)
Vue.component('external-script', {
  render: function (createElement) {
    var _this = this;
    return createElement('script', {
      attrs: {
        type: 'text/javascript',
        src: this.src
      },
      on: {
        load: function (event) {
          _this.$emit('load', event);
        },
        error: function (event) {
          _this.$emit('error', event);
        },
        readystatechange: function (event) {
          if (this.readyState == 'complete') {
            _this.$emit('load', event);
          }
        }
      }
    });
  },
  props: {
    src: {
      type: String,
      required: true
    }
  }
})

Vue.component('vstyle', {
  render: function (createElement) {
    return createElement('style', this.$slots.default)
  }
})


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
