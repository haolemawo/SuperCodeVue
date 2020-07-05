/**
 * 首页图表相关接口
 */
import $base from '../base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

const homeServer = {
  // 获取当天以及前days天浏览数据汇总
  GetBrowseerSummaryDays(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Dashboard/GetBrowseerSummaryDays',
      method: 'post',
      data: postData
    })
  },
  // 获取用户当天以及前days天登录人数汇总
  GetUserLoginSummaryDays(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Dashboard/GetUserLoginSummaryDays',
      method: 'post',
      data: postData
    })
  }
}

export default homeServer
