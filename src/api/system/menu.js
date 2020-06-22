/**
 * 用户登录、权限等管理接口
 */
import $base from '../base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

const menu = {
  // 根据 menuno 以及menuclass 获取按钮集合
  GetContextMenuList(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/PageMenu/GetContextMenuList',
      method: 'post',
      data: postData
    })
  },
  // 获取系统菜单列表,用于系统管理、系统菜单列表
  GetMenuList(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/PageMenu/GetMenuList',
      method: 'post',
      data: postData
    })
  },
  // 根据 编码获取 菜单对象
  GetMenuDataByNo(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/PageMenu/GetMenuDataByNo',
      method: 'post',
      data: postData
    })
  },
  // 保存 菜单对象
  SaveMenuData(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/PageMenu/SaveMenuData',
      method: 'post',
      data: postData
    })
  }
}

export default menu
