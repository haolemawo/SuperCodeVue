/**
 * 商城功能接口
 */
import $base from '../base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

const shoppingmall = {
  // 获取商品列表信息
  GetMallInfoList(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Mall/GetMallInfoList',
      method: 'post',
      data: postData
    })
  },
  // 获取商品对象信息
  GetMallInfoEntity(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Mall/GetMallInfoEntity',
      method: 'post',
      data: postData
    })
  },
  // 获取商品对象的相册信息
  GetMallPhotoInfoList(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Mall/GetMallPhotoInfoList',
      method: 'post',
      data: postData
    })
  },
  // 保存商品信息
  SaveMallInfo(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Mall/SaveMallInfo',
      method: 'post',
      data: postData
    })
  },
  // 根据获取商城分类父级ID获取列表
  GetMallTypeListByParentId(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Mall/GetMallTypeListByParentId',
      method: 'post',
      data: postData
    })
  },
  // 根据ID获取商品分类实体
  GetMallTypeBytId(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Mall/GetMallTypeBytId',
      method: 'post',
      data: postData
    })
  },
  // 获取产品分类,包含【父级】这一下拉项
  GetMallTypeSelectTree(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Mall/GetMallTypeSelectTree',
      method: 'post',
      data: postData
    })
  },
  // 获取产品分类， 不包含【父级】这一下拉项
  GetMallTypeSelectTree2(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Mall/GetMallTypeSelectTreeNoParent',
      method: 'post',
      data: postData
    })
  },
  // 保存商品分类实体
  SaveMallType(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Mall/SaveMallType',
      method: 'post',
      data: postData
    })
  },
  // 改变商品分类状态
  ChangeMallTypeEnabled(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Mall/ChangeMallTypeEnabled',
      method: 'post',
      data: postData
    })
  },
  // 获取商品分类tree
  GetMallTypeTreeList(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Mall/GetMallTypeTreeList',
      method: 'post',
      data: postData
    })
  }
}

export default shoppingmall
