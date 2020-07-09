/**
 * 商城功能接口
 */
import $base from '../base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

const BrandServer = {
  // 获取品牌列表信息
  GetBrandList(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Brand/GetBrandList',
      method: 'post',
      data: postData
    })
  },
  // 添加品牌
  SaveBrand(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Brand/SaveBrand',
      method: 'post',
      data: postData
    })
  },
  // 获取品牌详细
  GetBrandDetail(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Brand/GetBrandDetail',
      method: 'post',
      data: postData
    })
  },
  // 获取品牌分类列表信息
  GetBrandTypeList(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Brand/GetBrandTypeList',
      method: 'post',
      data: postData
    })
  },
  // 添加品牌分类
  SaveBrandType(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Brand/SaveBrandType',
      method: 'post',
      data: postData
    })
  },
  // 获取品牌分类详细
  GetBrandTypeDetail(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Brand/GetBrandTypeDetail',
      method: 'post',
      data: postData
    })
  }
}

export default BrandServer
