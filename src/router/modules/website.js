import Layout from '@/layout'

// 网站配置
const website = {
  path: '/website',
  component: Layout,
  redirect: '/website/RotationSet',
  name: 'website',
  meta: { title: '网站配置', icon: 'shopping', affix: false, menuno: 'WEB_WEBSITESET' },
  children: [
    {
      path: 'RotationSet',
      name: '轮播图设置',
      component: () => import('@/views/website/rotationset/index'),
      meta: { title: '轮播图设置', icon: 'table', menuno: 'WEB_ROTATIONSET' }
    },
    {
      path: 'WechatAppletSet',
      name: '小程序设置',
      component: () => import('@/views/website/appletset/index'),
      meta: { title: '小程序设置', icon: 'table', menuno: 'WEB_WECHATAPPLETSET' }
    },
    {
      path: 'WebBaseSet',
      name: '网站设置',
      component: () => import('@/views/website/baseseting'),
      meta: { title: '网站设置', icon: 'table', menuno: 'WEB_WEBBASESET' }
    },
    {
      path: 'WebSiteMenu',
      name: '网站导航',
      component: () => import('@/views/website/sitemenu'),
      meta: { title: '网站导航', icon: 'table', menuno: 'WEB_WEBSITEMENU' }
    }
  ]
}

export default website
