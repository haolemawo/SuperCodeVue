/**
 * 公共常用请求接口
 */
import $base from '../base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

const common = {
  HttpUploadFile: $base.web + '/Upload/UploadFile',
  // 删除数据【公共方法】
  DeleteData(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Common/DeleteData',
      method: 'post',
      data: postData
    })
  },
  // 根据字典编码，获取详细字典，返回 key-value 列表
  GetPopSelect(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Common/GetDicSelect',
      method: 'post',
      data: postData
    })
  },
  // 上传文件
  UploadFile(params) {
    // const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Upload/UploadFile',
      method: 'post',
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  // 商城管理中，增加商品分类，选择分类图标，返回系统内置的文件列表
  GetMallTypeDefaultImageList(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Upload/GetMallTypeDefaultImageList',
      method: 'post',
      data: postData
    })
  }
}

export default common
