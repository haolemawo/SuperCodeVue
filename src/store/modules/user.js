// import { login, logout, getInfo } from '@/api/user'
import user from '@/api/user'
import { Message } from 'element-ui'
import { getToken, setToken, removeToken, setCookiesUserInfo, getCookiesUserInfo, removeCookiesUserInfo } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    tokenexpires: 0,
    uuid: '',
    userCookes: getCookiesUserInfo(),
    name: '',
    avatar: '',
    userMenu: null
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TOKENEXPIRES: (state, expires) => {
    state.tokenexpires = expires
  },
  SET_UUID: (state, uuid) => {
    state.uuid = uuid
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = '/assets/images/' + avatar
  },
  SET_USERCOOKIES: (state, userCookes) => {
    state.userCookes = userCookes
  },
  SET_USERMENU: (state, userMenu) => {
    state.userMenu = userMenu
  }
}

const actions = {
  // 登陆
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      user.login(userInfo).then(res => {
        if (res) {
          if (res.Issuccess) {
            const token = res.Data.token.token
            const uuid = res.Data.UUID
            console.log(res.Data.token.expires_in)
            commit('SET_TOKEN', token)
            commit('SET_UUID', uuid)
            commit('SET_TOKENEXPIRES', res.Data.token.expires_in)
            setToken(token, uuid)
            Message({
              showClose: true,
              message: '登录成功，欢迎回来',
              type: 'success'
            })
          } else {
            Message({
              showClose: true,
              message: res.DataMsg,
              type: 'error'
            })
          }
        }
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 根据token获取用户对象信息model
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      user.getInfo(state.token).then(response => {
        if (!response.Issuccess) {
          reject('认证失败，请重新登陆！')
        }
        const data = JSON.parse(response.Data)
        setCookiesUserInfo(data)
        commit('SET_USERCOOKIES', data)
        commit('SET_NAME', data.UserName)
        commit('SET_AVATAR', data.UserHeadImg)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取当前用户的菜单，并把信息放到store中
  getUserMenuList({ commit, state }) {
    return new Promise((resolve, reject) => {
      user.getUserMenuList().then(response => {
        if (!response.Issuccess) {
          reject('认证失败，请重新登陆！')
        }
        commit('SET_USERMENU', response.Data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 退出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      user.loginout().then(res => {
        if (res) {
          if (res.Issuccess) {
            // 移出token
            removeToken()
            removeCookiesUserInfo()
            resetRouter()
          } else {
            Message({
              showClose: true,
              message: res.DataMsg,
              type: 'error'
            })
          }
        }
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  // 刷新token
  refreshToken({ commit }, param) {
    return new Promise((resolve, reject) => {
      user.RefreshToken(param).then(res => {
        if (res) {
          if (res.Issuccess) {
            const token = res.Data.token.token
            const uuid = res.Data.UUID
            console.log(res.Data.token.expires_in)
            commit('SET_TOKEN', token)
            commit('SET_UUID', uuid)
            commit('SET_TOKENEXPIRES', res.Data.token.expires_in)
            setToken(token, uuid)
            resolve({ Issuccess: true, token: token })
          } else {
            resolve({ Issuccess: false })
          }
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

