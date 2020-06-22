/**
 * 系统配置相关
 */
import $base from '../base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

const SystemConfigSet = {
  // 获取系统设置列表
  GetConfigSettingTable(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/SystemConfig/GetConfigSettingTable',
      method: 'post',
      data: postData
    })
  }
}

export default SystemConfigSet
