import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '@/assets/iconfont/iconfont.css' // 引入iconfont
import '@/styles/index.scss' // global css
import Cookies from 'js-cookie'
import App from './App'
import store from './store' // 导入vuex文件
import router from './router' // 导入路由文件
import moment from 'moment'// 导入日期格式化插件
import api from './api' // 导入api接口

import '@/icons' // icon
import '@/permission' // permission control

// Vue-bus中央事件总线插件
import VueBus from './utils/common/vue-bus'
Vue.use(VueBus)

import $ from 'jquery'
// import '../node_modules/signalr/jquery.signalR.min.js'
// import 'signalr'
// 实时消息推送
import signalr from './utils/hubchat/signalR'
Vue.use(signalr)
// set ElementUI lang to EN
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium', // 设置 element-ui 默认大小
  locale
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$api = api // 将api挂载到vue的原型上
Vue.prototype.$moment = moment // 赋值使用
moment.locale('zh-cn') // 需要汉化
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
