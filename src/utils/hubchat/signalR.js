import * as signalR from '@aspnet/signalr'
import $base from '../../api/base' // 导入接口域名列表

// 服务器地址
const signal = new signalR.HubConnectionBuilder()
  .withUrl($base.web + '/api/chatHub', {a:'b'})
  .configureLogging(signalR.LogLevel.Information)
  .build()
/* const signalr = function () {
  var hub
  if (hub === undefined) {
    hub = signal
  }
  return hub
} */
//  自动重连
// async function start() {
//   try {
//     await signal.start()
//     console.log('connected')
//   } catch (err) {
//     console.log(err)
//     setTimeout(() => start(), 5000)
//   }
// }

// signal.onclose(async() => {
//   await start()
// })

// 将创建的signal赋值给Vue实例
const install = function(Vue) {
  Vue.prototype.signal = signal
}

export default install
