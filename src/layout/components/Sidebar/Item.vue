<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(createElement, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      const elHtml = createElement('i', {
        attrs: {
          'class': 'menu-item-icon iconfont ' + icon
        }
      })
      vnodes.push(elHtml)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
<style scoped>
.menu-item-icon {
  margin-right: 10px;
}
</style>
