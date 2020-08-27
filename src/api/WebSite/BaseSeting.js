/**
 * 基础信息配置
 */
import $base from '../base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

const BaseSeting = {
  // 获取基础信息配置
  GetWebBaseSetingEntity(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/BaseSeting/GetWebBaseSetingEntity',
      method: 'post',
      data: postData
    })
  },
  // 保存
  SaveWebBaseSeting(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/BaseSeting/SaveWebBaseSeting',
      method: 'post',
      data: postData
    })
  }
}

export default BaseSeting
