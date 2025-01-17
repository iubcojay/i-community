import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from "./store";
import md5 from 'js-md5';
import axios from "axios";
import interAxios from "axios";
import common from './commom.js'
// import '../public/static/icon/iconfont.css'
// 引入全局可用阿里图标样式文件
import '@/assets/iconfont/iconfont.css'
// 引入全局可用阿里图标js文件
import '@/assets/iconfont/iconfont.js'

import lottie from "vue-lottie";
import AsyncComputed from 'vue-async-computed'

import Video from 'video.js'
import 'video.js/dist/video-js.css'

import 'animate.css';

const echarts = require("echarts")
const uuid = require("uuid")


Vue.prototype.$video = Video //引入Video播放器
Vue.prototype.$uuid = uuid

Vue.component("lottie", lottie);

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.use(ElementUI);
Vue.prototype.$md5 = md5;
axios.defaults.baseURL = window.PLATFORM_CONFIG.ServerAddress
Vue.prototype.$ServerAddress = window.PLATFORM_CONFIG.ServerAddress
Vue.prototype.$StaticResourceAddress = window.PLATFORM_CONFIG.StaticResourceAddress
Vue.prototype.$WSAddress = window.PLATFORM_CONFIG.WSAddress

// Vue.prototype.$TreeJsServerAddress = window.PLATFORM_CONFIG.TreeJsServerAddress
Vue.prototype.$common = common
Vue.prototype.$axios = axios
Vue.prototype.$interAxios = interAxios

Vue.use(AsyncComputed)


Vue.config.ignoredElements = [
    /^a-/
];

XE.ready()
    .then(() => {
        //加载标绘插件
        // const p1 = XE.HTML.loadJS('./static/earthsdk/XbsjEarth-Plugins/plottingSymbol/plottingSymbol.js');
        // const p2 = XE.HTML.loadJS('./static/earthsdk/XbsjEarth-Plugins/customPrimitive/customPrimitive.js');
        // const p3 = XE.HTML.loadJS('./static/earthsdk/XbsjEarth-Plugins/customPrimitiveImage/customPrimitiveImage.js');
        // const p5 = XE.HTML.loadJS('./static/earthsdk/XbsjEarth-Plugins/plottingSymbol2/plottingSymbol2.js');
        // const p4 = XE.HTML.loadJS('//earthsdk.com/v/last/Apps/Demos/Viewer/scripts/three.min.js'); // 部分图元需要加载three.js
        // return Promise.all([p1, p2, p3,p5])
    }).then(() => {
        let app = new Vue({
            router,
            store,
            render: h => h(App),
        }).$mount('#app')
    });
