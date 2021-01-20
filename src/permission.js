import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
// import { GetUrlRelativePath } from '@/utils/common/get-pagerouter'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        // const fromPath = GetUrlRelativePath(window.location.href)
        try {
          // 获取当前用户菜单列表
          await store.dispatch('permission/generateRoutes')
          // 获取当前用户信息
          await store.dispatch('user/getInfo')
          router.addRoutes(store.getters.addUserRoutes) // 2.动态添加路由
          // next()
          // console.log(fromPath.length)
          // if (fromPath.length > 0) {
          //   next({ path: fromPath })
          // } else {
          //   next({ ...to, replace: true })
          // }
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

// function getpermssionRouter(needAddRouters) {
//   console.log(needAddRouters)
//   const AddRouters = []
//   needAddRouters.forEach(route => {
//     const tmp = { ...route }
//     const meta = {
//       icon: tmp.MenuIcon,
//       title: tmp.MenuName
//     }
//     const item = {
//       name: tmp.MenuNo.tolower(),
//       path: tmp.MenuRouter,
//       redirect: tmp.MenuRouter,
//       meta: meta
//     }
//     AddRouters.push(item)
//   })
//   console.log(AddRouters)
//   return AddRouters
// }
