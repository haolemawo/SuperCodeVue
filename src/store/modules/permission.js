import { asyncRoutes, constantRoutes } from '@/router'
import user from '@/api/user'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addUserRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addUserRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

var asyncRouteList = []
const actions = {
  // 获取当前用户的菜单列表
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      user.getUserMenuList().then(response => {
        if (!response.Issuccess) {
          reject('认证失败，请重新登陆！')
        }
        const dynamicRouter = filterAsyncRouter(response.Data)
        // console.log(response.Data)
        console.log(asyncRoutes)
        commit('SET_ROUTES', dynamicRouter)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(routers) {
  GetasyncRouteList()
  var accessedRouters = []
  routers.forEach(item => {
    var needAddRouter = null
    asyncRouteList.forEach(asyncItem => {
      if (asyncItem.meta) {
        if (item.MenuNo === asyncItem.meta.menuno) {
          needAddRouter = asyncItem
        }
      }
    })
    if (item.MenuChild.length > 0) {
      needAddRouter.children = getfilterAsyncRouterChild(item.MenuChild)
    }
    if (needAddRouter != null) {
      accessedRouters.push(needAddRouter)
    }
  })
  return accessedRouters
}
function getfilterAsyncRouterChild(routers) {
  var accessedRouters = []
  routers.forEach(item => {
    var needAddRouter = null
    asyncRouteList.forEach(asyncItem => {
      if (asyncItem.meta) {
        if (item.MenuNo === asyncItem.meta.menuno) {
          needAddRouter = asyncItem
          needAddRouter.children = []
        }
      }
    })

    if (item.MenuChild) {
      if (item.MenuChild.length > 0) {
        needAddRouter.children = getfilterAsyncRouterChild(item.MenuChild)
      }
    }
    if (needAddRouter != null) {
      accessedRouters.push(needAddRouter)
    }
  })
  return accessedRouters
}
// 将需要授权的路由转换为数组
function GetasyncRouteList() {
  asyncRoutes.forEach(asyncItem => {
    asyncRouteList.push(asyncItem)
    if (asyncItem.children) {
      if (asyncItem.children.length > 0) {
        GetAsyncRouteChild(asyncItem.children)
      } else {
        asyncItem.children = []
      }
    } else {
      asyncItem.children = []
    }
  })
}
// 获取子级路由
function GetAsyncRouteChild(routeList) {
  routeList.forEach(item => {
    asyncRouteList.push(item)
    if (item.children) {
      if (item.children.length > 0) {
        GetAsyncRouteChild(item.children)
      } else {
        item.children = []
      }
    } else {
      item.children = []
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
