import Cookies from 'js-cookie'
import { decode, encode } from '@/utils/common/base64'

const TokenKey = 'CurrentToken' // token key值
const CurrentUser = 'CurrentUserInfo' // 用户信息key值
const CurrentUUID = 'CurrentUUID' // uuid key值
// 获取当前token
export function getToken() {
  return Cookies.get(TokenKey)
}
// 获取当前uuid
export function getUUID() {
  return Cookies.get(CurrentUUID)
}
// 保存当前token、 uuid
export function setToken(token, uuid) {
  Cookies.set(CurrentUUID, uuid)
  return Cookies.set(TokenKey, token)
}
// 删除当前token、 uuid
export function removeToken() {
  Cookies.remove(CurrentUUID)
  return Cookies.remove(TokenKey)
}
// 获取当前用户
export function getCookiesUserInfo() {
  const BaseUserStr = Cookies.get(CurrentUser)
  if (BaseUserStr) {
    const userJsonStr = decode(BaseUserStr)
    return JSON.parse(userJsonStr)
  } else {
    return null
  }
}
// 保存当前用户
export function setCookiesUserInfo(user) {
  if (user) {
    const userJson = JSON.stringify(user)
    const BaseToken = encode(userJson)
    return Cookies.set(CurrentUser, BaseToken)
  } else {
    return null
  }
}
// 删除当前用户
export function removeCookiesUserInfo() {
  return Cookies.remove(CurrentUser)
}
