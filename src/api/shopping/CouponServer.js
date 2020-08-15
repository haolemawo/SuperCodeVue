/**
 * 优惠券功能接口
 */
import $base from '../base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

// 保存优惠券
export function SaveCoupon(params) {
  const postData = qs.stringify(params)
  return request({
    url: $base.web + '/Coupon/SaveCoupon',
    method: 'post',
    data: postData
  })
}
// 获取优惠券列表
export function GetCouponList(params) {
  const postData = qs.stringify(params)
  return request({
    url: $base.web + '/Coupon/GetCouponList',
    method: 'post',
    data: postData
  })
}
// 获取优惠券
export function GetCoupon(params) {
  const postData = qs.stringify(params)
  return request({
    url: $base.web + '/Coupon/GetCoupon',
    method: 'post',
    data: postData
  })
}