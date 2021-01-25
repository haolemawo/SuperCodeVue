/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import router from '@/router'
import { Message, Notification } from 'element-ui'
import store from '@/store'
import { getToken, getUUID } from '@/utils/auth'

/** 提示函数
 * 5 秒后自动消失
 */
const tip = msg => {
  Message({
    message: msg,
    type: 'error',
    duration: 10 * 1000
  })
}
/**
 * 用于提示接口异常数据
 * @param {简洁提示} Message
 * @param {开发提示} DevelopmentMessage
 */
const NotificationErr = (Message, DevelopmentMessage) => {
  Notification.error({
    title: '内部服务器错误',
    dangerouslyUseHTMLString: true,
    duration: 0,
    message: '错误提示：<div style="max-height: 50px;overflow-y: scroll;word-break: break-word;white-space: normal;width: 260px;">' +
      Message +
      '</div><div><span>详细信息：</span><div style="height: 100px;overflow: scroll;white-space: normal;word-break: break-word;width: 260px;">' +
      DevelopmentMessage + '</div></div>'
  })
}

/**
 * 跳转登录页
 * 携带当前页面路由，并在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other, DevelopmentMessage) => {
  console.log('status' + status)
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    // case 401:
    //   toLogin()
    //   break
    // 403 token过期
    // 清除token并跳转登录页
    case 403 || 401:
      tip('登录过期，请重新登录')
      localStorage.removeItem('USER_TOKEN')
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
      // 404请求不存在
    case 404:
      tip('请求的资源不存在')
      break
    case 504:
      tip('请检查您的网络是否正常')
      break
    case -100:
      tip('断网了，请检查您的网络是否正常')
      break
    case 500:
      NotificationErr(other, DevelopmentMessage)
      break
    default:
      tip('状态响应码：' + status + '响应信息：' + other)
  }
}

// 创建axios实例， 设置请求超时时间为 1000 * 12
var instance = axios.create({ timeout: 5000 * 12 })
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    if (store.getters.token) {
      // 让每个请求携带
      config.headers.Authorization = 'Bearer ' + getToken()
      config.headers['Session-UUID'] = getUUID()
    }
    // 应用编码
    config.headers['Application-Code'] = store.state.app.ApplicationCode
    // 当前系统
    config.headers['Current-osVersion'] = store.state.app.osVersion
    // 当前浏览器
    config.headers['Current-Browser'] = store.state.app.CurrentBrowser
    return config
  },
  error => Promise.error(error))

// 当前是否正在刷新token
let isRefreshing = true
// 被挂起的请求数组, 每一项将是一个待执行的函数形式
let subscribers = []
/* push所有请求到数组中*/
function subscribeRefreshPush(cb) {
  subscribers.push(cb)
}
// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  response => {
    const res = response.data
    if (response.status !== 200) {
      return Promise.reject(res)
    } else {
      return Promise.resolve(res)
    }
  },
  // 请求失败
  error => {
    const { response } = error
    // console.log(response)
    if (response) {
      // 请求已发出，但是不在2xx的范围
      const dataStatus = response.data.StatusCode
      if (dataStatus) {
        const config = response.config
        if (dataStatus === 401) {
          if (getUUID()) {
            if (isRefreshing) {
              isRefreshing = false
              return referToken().then(res => {
                if (res.Issuccess) {
                  config.baseURL = ''
                  if (store.getters.token) {
                    // 让每个请求携带
                    config.headers.Authorization = 'Bearer ' + getToken()
                    config.headers['Session-UUID'] = getUUID()
                  }
                  // 应用编码
                  config.headers['Application-Code'] = store.state.app.ApplicationCode
                  // 当前系统
                  config.headers['Current-osVersion'] = store.state.app.osVersion
                  // 当前浏览器
                  config.headers['Current-Browser'] = store.state.app.CurrentBrowser
                  // 已经刷新了token，将所有队列中的请求进行重试
                  subscribers.forEach(cb => cb(res.token))
                  // 重试完了别忘了清空这个队列
                  subscribers = []
                  return instance(config)
                  // return Promise.resolve(instance(config))
                } else {
                  window.location.href = '/'
                }
              }).catch(res => {
                console.error('refreshtoken error =>', res)
                // window.location.href = '/'
              }).finally(() => {
                setTimeout(function() {
                  isRefreshing = true
                }, 3000)
              })
            } else {
              return new Promise((resolve) => {
                /* (token) => {...}这个函数就是回调函数*/
                subscribeRefreshPush(token => {
                  config.baseURL = ''
                  if (store.getters.token) {
                    // 让每个请求携带
                    config.headers.Authorization = 'Bearer ' + token
                    config.headers['Session-UUID'] = getUUID()
                  }
                  // 应用编码
                  config.headers['Application-Code'] = store.state.app.ApplicationCode
                  // 当前系统
                  config.headers['Current-osVersion'] = store.state.app.osVersion
                  // 当前浏览器
                  config.headers['Current-Browser'] = store.state.app.CurrentBrowser
                  /* 将请求挂起*/
                  resolve(instance(config))
                })
              })
            }
          } else {
            errorHandle(401, '抱歉，请先登录!', '')
            window.location.href = '/'
            return response.data
          }
        } else {
          console.log('6')
        }
      } else {
        errorHandle(response.status, '响应码:' + response.statusText, '')
        return response.data
      }
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit('changeNetwork', false)
      errorHandle(-100, '断网了', '')
      return response.data
    }
    // return Promise.reject(response.data)
  })

function referToken() {
  const params = {
    uuid: getUUID(),
    token: getToken()
  }
  return store.dispatch('user/refreshToken', params)
}

export default instance
