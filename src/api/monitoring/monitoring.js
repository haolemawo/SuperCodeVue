/**
 * 用户登录、权限等管理接口
 */
import $base from '../base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

const server = {
  // 获取服务器的CPU信息
  GetServerCPU(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Monitoring/GetServerCPU',
      method: 'post',
      data: postData
    })
  }
}

export default server
