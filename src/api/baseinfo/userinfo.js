/**
 * 用户信息管理
 */
import $base from '../base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

const userinfo = {
  // 获取用户列表
  GetUserTable(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/userinfo/GetUserTable',
      method: 'post',
      data: postData
    })
  },
  // 获取用户对象信息
  GetUserInfo(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/userinfo/GetUserInfo',
      method: 'post',
      data: postData
    })
  },
  // 保存用户对象
  SaveUserInfo(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/userinfo/SaveUserInfo',
      method: 'post',
      data: postData
    })
  },
  // 导入用户信息
  ImportUser(params) {
    return request({
      url: $base.web + '/userinfo/ImportUser',
      method: 'post',
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  // 修改密码
  modifyUserPwd(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Auth/ModifyUserPwd',
      method: 'post',
      data: postData
    })
  }
}

export default userinfo
