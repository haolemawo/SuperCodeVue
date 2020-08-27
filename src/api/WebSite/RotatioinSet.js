/**
 * 轮播图设置
 */
import $base from '../base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

const RotatioinSet = {
  // 获取轮播图列表
  GetRotationList(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/RotatioinSet/GetRotationList',
      method: 'post',
      data: postData
    })
  },
  // 获取轮播图列表
  GetRotationSetEntity(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/RotatioinSet/GetRotationSetEntity',
      method: 'post',
      data: postData
    })
  },
  // 保存轮播图
  SaveRotationSet(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/RotatioinSet/SaveRotationSet',
      method: 'post',
      data: postData
    })
  }
}

export default RotatioinSet
