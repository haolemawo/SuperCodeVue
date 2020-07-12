// 菜单按钮控件
<template>
  <div class="MenuButtomToolBarCon">
    <el-row v-if="TopMenu.length > 0">
      <el-button
        v-for="item in TopMenu"
        :key="item.ContextMenuNo"
        type="primary"
        icon="item.ImageName"
        plain
        @click="callFun(item.ContextMenuScript)"
      >{{ item.ContextMenuDesc }}</el-button>
      <!-- <el-button type="primary" icon="el-icon-search" size="mini" plain @click="Edit">编辑</el-button>
      <el-button type="primary" icon="el-icon-search" size="mini" plain>查看</el-button> -->
      <el-dropdown v-if="MoreMenu.length > 0" @command="handleCommand">
        <el-button type="primary">
          更多<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in MoreMenu"
            :key="item.ContextMenuNo"
            :command="item.ContextMenuScript"
          >{{ item.ContextMenuDesc }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
  </div>
</template>

<script>
import menu from '@/api/system/menu'
export default {
  name: 'MenuBottomToolbar',
  props: {
    menuclass: { // 当前列表需要的按钮分类
      type: String,
      default: ''
    }
  },
  data() {
    return {
      TopMenu: [],
      MoreMenu: []
    }
  },
  created() {
    const menuno = this.$route.meta.menuno
    if (menuno && this.menuclass) {
      const param = {
        menuNo: menuno,
        menuclass: this.menuclass
      }
      menu.GetContextMenuList(param).then(res => {
        if (res.Issuccess) {
          const menuData = res.Data
          this.TopMenu = menuData.slice(0, 3)
          if (menuData.length >= 3) {
            this.MoreMenu = menuData.slice(3, menuData.length)
          }
        }
      })
    }
  },
  methods: {
    callFun(methodName) {
      // this.$parent[methodName].apply(this)
      // this.$parent.$emit(methodName)
      // this.$emit('cllFun', methodName)
      this.$bus.emit('cllFun', methodName)
    },
    handleCommand(command) {
      // 处理 下拉菜单中的事件
      // this.$parent[command].apply(this)
      this.$bus.emit('cllFun', command)
    }
  }
}
</script>
<style lang="scss" scoped>
    .MenuButtomToolBarCon{
        float:right;
        background-color: #fff;
        padding: 8px 10px;
    }
</style>
