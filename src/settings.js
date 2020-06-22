module.exports = {
  title: '博硕团在线学习系统',
  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description 是否固定右侧导航栏
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 是否固定页眉导航
   */
  fixedHeader: false,
  /**
   * @type {boolean} true | false
   * @description 是否在侧边栏中显示徽标
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
