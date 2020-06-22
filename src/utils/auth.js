import Cookies from 'js-cookie'
import { decode, encode } from '@/utils/common/base64'

const TokenKey = 'CurrentToken' // token key值
const CurrentUser = 'CurrentUserInfo' // 用户信息key值
// 获取当前token
export function getToken() {
  return Cookies.get(TokenKey)
}
// 保存当前token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 删除当前token
export function removeToken() {
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
// // 删除当前用户
// export function removeCookiesUserInfo() {
//   return Cookies.remove(CurrentUser)
// }
