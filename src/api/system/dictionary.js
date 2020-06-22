/**
 * 用户登录、权限等管理接口
 */
import $base from '../base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

const dictionary = {
  // 获取字典分类
  GetDictionaryType(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Dictionary/GetDictionaryType',
      method: 'post',
      data: postData
    })
  },
  // 新增字典分类
  AddDictionaryType(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Dictionary/AddDictionaryType',
      method: 'post',
      data: postData
    })
  },
  // 新增字典m明细
  AddDictionaryDetil(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Dictionary/AddDictionaryDetil',
      method: 'post',
      data: postData
    })
  },
  // 根据字典分类编码，获取字典明细
  GetDictionaryDetailList(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Dictionary/GetDictionaryDetail',
      method: 'post',
      data: postData
    })
  },
  GetDictionaryDetailModel(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Dictionary/GetDictionaryDetailModel',
      method: 'post',
      data: postData
    })
  }
}

export default dictionary
