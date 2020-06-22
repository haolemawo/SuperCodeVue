/**
 * 用户登录、权限等管理接口
 */
import $base from '../base' // 导入接口域名列表
import request from '@/request/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块, 用于 序列化的处理

const role = {
  // 获取列表 带有分页
  GetRoleList(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Role/GetRoleTable',
      method: 'post',
      data: postData
    })
  },
  // 获取角色对象
  GetRoleEntity(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Role/GetRoleEntity',
      method: 'post',
      data: postData
    })
  },
  // 保存角色信息
  SaveForm(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Role/SaveRole',
      method: 'post',
      data: postData
    })
  },
  // 删除角色
  DeleteRole(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Role/DeleteRole',
      method: 'post',
      data: postData
    })
  },
  // 获取角色树
  GetRoleTree() {
    return request({
      url: $base.web + '/Role/GetRoleTree',
      method: 'post'
    })
  },
  // 授权时，获取当前用户拥有的菜单以及该角色拥有的菜单树
  GetRoleAuthorMenuTree(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Role/GetRoleAuthorMenuTree',
      method: 'post',
      data: postData
    })
  },
  // 获取当前用户拥有的菜单按钮
  GetRoleAuthorMenuContextBtns(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Role/GetRoleAuthorMenuContextBtns',
      method: 'post',
      data: postData
    })
  },
  // 保存当前角色的授权信息
  SaveRoleAuthorMenuContextBtnsData(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Role/SaveRoleAuthorMenuContextBtnsData',
      method: 'post',
      data: postData
    })
  },
  // 获取当前角色授权的菜单信息列表
  GetRolePrivileageMenu(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Role/GetRolePrivileageMenu',
      method: 'post',
      data: postData
    })
  },
  // 获取当前角色授权的用户信息列表
  GetRolePrivileageUserList(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Role/GetRolePrivileageUserList',
      method: 'post',
      data: postData
    })
  },
  // 增加授权用户列表
  GetNeedAuthorUser(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Role/GetNeedAuthorUser',
      method: 'post',
      data: postData
    })
  },
  // 保存 授权用户信息
  SaveNeedAuthorUser(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Role/SaveAuthorUser',
      method: 'post',
      data: postData
    })
  },
  // 删除授权用户信息
  DeleteAuthorUser(params) {
    const postData = qs.stringify(params)
    return request({
      url: $base.web + '/Role/DeleteAuthorUser',
      method: 'post',
      data: postData
    })
  }
}

export default role
