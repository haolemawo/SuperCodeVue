/**
 * 用户登录、权限等管理接口
 */
import $base from './base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

const user = {
  // 用户登录
  login(params) {
    return request.get($base.web + '/Auth/Login', {
      params: params
    })
  },
  // 根据 token，获取用户信息对象
  getInfo(token) {
    const postData = qs.stringify({
      token: token
    })
    return request({
      url: $base.web + '/Auth/GetUserInfo',
      method: 'post',
      data: postData
    })
  },
  // 获取当前用户的菜单，并把信息放到store中
  getUserMenuList() {
    return request({
      url: $base.web + '/PageMenu/GetUserMenuList',
      method: 'post'
    })
  }
  // 根据MenuNo获取当前的
}

export default user