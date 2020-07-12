/* eslint-disable vue/valid-v-for */
// 角色授权表单
<template>
  <div>
    <el-dialog
      v-if="authorizeparams.isvisible"
      title="角色授权"
      width="90%"
      custom-class="RoleAuthorizeForm-dialog"
      node-key="id"
      :fullscreen="true"
      :visible.sync="authorizeparams.isvisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :default-checked-keys="RoleMenuTreeDataChecked"
    >
      <split-pane :min-percent="15" :default-percent="20" :max-percent="30" split="vertical">
        <template slot="paneL">
          <el-card>
            <el-tree
              ref="RoleMenuTree"
              class="RoleMenu-tree"
              show-checkbox
              :data="RoleMenuTreeData"
              :props="defaultProps"
              node-key="id"
              default-expand-all
              highlight-current
              @check="MenuChange"
              @node-click="MenuCheckChange"
            />
          </el-card>
        </template>
        <template slot="paneR">
          <el-card v-loading="MenuBtnDatasLoading">
            <div style="height: 40px;line-height: 30px;">
              全部业务按钮
              <div style="float:right;padding-bottom: 10px;">
                <el-button size="mini" @click="menuBtnAllChecked">全选</el-button>
                <el-button size="mini" @click="menuBtnAllUnChecked">全不选</el-button>
              </div>
            </div>
            <div v-for="MenuBtns in MenuBtnDatas" :key="MenuBtns.MenuClass" class="menuclass-group">
              <div class="menuclass-item-title">
                {{ MenuBtns.MenuClassName }}
                <div class="menuclass-item-title-btn">
                  <el-button size="mini" @click="menuClassBtnAllChecked(MenuBtns.MenuClass)">全选</el-button>
                  <el-button size="mini" @click="menuClassBtnAllUnChecked(MenuBtns.MenuClass)">全不选</el-button>
                </div>
              </div>
              <div class="menuclass-item-body">
                <div>
                  <el-checkbox-group v-model="MenuBtns.CheckedMenuNo" @change="MentBtnCheckedChange">
                    <el-checkbox key="OpenMainMenu" label="OpenMainMenu">主菜单打开</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div v-if="MenuBtns.ContextBtnList.length > 0">
                  <el-checkbox-group v-model="MenuBtns.CheckedMenuNo" @change="MentBtnCheckedChange">
                    <el-checkbox v-for="btn in MenuBtns.ContextBtnList" :key="btn.ContextMenuNo" :label="btn.ContextMenuNo">{{ btn.ContextMenuName }}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </el-card>
        </template>
      </split-pane>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="SaveDataLoading" @click="save('entity')">保存</el-button>
        <el-button @click="authorizeparams.isvisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import role from '@/api/system/role'
import splitPane from 'vue-splitpane'

export default {
  name: 'RoleAuthorizeForm',
  components: { 'split-pane': splitPane },
  props: {
    authorizeparams: { // 这个就是父组件中子标签自定义名字
      type: Object,
      required: true
    }
  },
  data() {
    return {
      RoleMenuTreeData: [],
      RoleMenuTreeDataChecked: [], // 菜单选中的数据
      MenuBtnDatas: [], // 选择菜单后获取远程的按钮数据
      NeedSaveMenuBtnDatas: [], // 待保存的授权信息
      MenuBtnDatasLoading: false,
      SaveDataLoading: false,
      CheckedMenuBtns: [],
      CurentMenuNo: '', // 当前选中的菜单
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    NeedSaveMenuBtnDatas: {
      // 监听数组变化，用于左侧的勾选状态更新
      handler: function(val, oldval) {
        val.map(item => {
          if (item.MenuNo === this.CurentMenuNo) {
            let checkBtnNums = 0
            item.MenuContextBtnData.map(menuClassitem => {
              checkBtnNums += menuClassitem.CheckedMenuNo.length
            })
            if (checkBtnNums > 0) {
              this.RoleMenuTreeDataChecked.push(this.CurentMenuNo)
            } else {
              this.RoleMenuTreeDataChecked = this.RoleMenuTreeDataChecked.filter(t => t !== this.CurentMenuNo)
            }
          }
          return item
        })
        this.$refs.RoleMenuTree.setCheckedKeys(this.RoleMenuTreeDataChecked)
      },
      deep: true// 对象内部的属性监听，也叫深度监听
    }
  },
  created() {
    this.Init()
  },
  methods: {
    Init() {
      this.GetMenuTree()
    },
    GetMenuTree() {
      // 获取菜单
      role.GetRoleAuthorMenuTree({ roleid: this.authorizeparams.roleid }).then(res => {
        if (res.Issuccess) {
          const arr = this.GetMenuTreeData(res.Data)
          if (arr) {
            this.RoleMenuTreeData = [{
              id: '0',
              label: '全部业务菜单',
              children: arr
            }]
          }
        }
      })
    },
    GetMenuTreeData(menuList) {
      const arr = []
      menuList.forEach(element => {
        const menuObj = {}
        menuObj.DataID = element.DataID
        menuObj.id = element.MenuNo
        menuObj.label = element.MenuName
        if (element.IsHavaChild) {
          menuObj.children = this.GetMenuTreeData(element.MenuChild)
        }
        arr.push(menuObj)
      })
      return arr
    },
    // 选择左侧菜单
    MenuChange(data, nodeObj) {
      this.setMenuSelectChang(data)
    },
    MenuCheckChange() {
      // 左侧菜单树的点击
      const checkMenu = this.$refs.RoleMenuTree.getCurrentNode()
      this.setMenuSelectChang(checkMenu)
      // if (checkMenu) {
      //   this.MenuBtnDatasLoading = true
      //   const menuNo = checkMenu.id
      //   this.CurentMenuNo = menuNo
      //   let isHave = false
      //   this.NeedSaveMenuBtnDatas.forEach(item => {
      //     if (item.MenuNo === menuNo) {
      //       this.MenuBtnDatas = item.MenuContextBtnData
      //       isHave = true
      //     }
      //   })
      //   if (!isHave) {
      //     role.GetRoleAuthorMenuContextBtns({ menuNo: menuNo }).then(res => {
      //       if (res.Issuccess) {
      //         this.MenuBtnDatas = res.Data
      //         this.NeedSaveMenuBtnDatas.push({ MenuNo: menuNo, MenuContextBtnData: res.Data })
      //         console.log(this.NeedSaveMenuBtnDatas)
      //       }
      //       this.MenuBtnDatasLoading = false
      //     })
      //   } else {
      //     this.MenuBtnDatasLoading = false
      //   }
      // }
    },
    setMenuSelectChang(checkMenu) {
      if (checkMenu) {
        this.MenuBtnDatasLoading = true
        const menuNo = checkMenu.id
        const DataID = checkMenu.DataID
        this.CurentMenuNo = menuNo
        let isHave = false
        this.NeedSaveMenuBtnDatas.forEach(item => {
          if (item.MenuNo === menuNo) {
            this.MenuBtnDatas = item.MenuContextBtnData
            isHave = true
          }
        })
        if (!isHave) {
          role.GetRoleAuthorMenuContextBtns({ menuNo: menuNo }).then(res => {
            if (res.Issuccess) {
              this.MenuBtnDatas = res.Data
              this.NeedSaveMenuBtnDatas.push({ DataID: DataID, MenuNo: menuNo, MenuContextBtnData: res.Data })
              console.log(this.NeedSaveMenuBtnDatas)
            }
            this.MenuBtnDatasLoading = false
          })
        } else {
          this.MenuBtnDatasLoading = false
        }
      }
    },
    menuBtnAllChecked() {
      // 全选所有按钮
      this.NeedSaveMenuBtnDatas.map(item => {
        if (item.MenuNo === this.CurentMenuNo) {
          item.MenuContextBtnData.map(menuClassitem => {
            const btns = []
            menuClassitem.ContextBtnList.forEach(i => {
              btns.push(i.ContextMenuNo)
            })
            menuClassitem.CheckedMenuNo = btns
          })
        }
        return item
      })
    },
    menuBtnAllUnChecked() {
      // 全不选所有按钮
      this.NeedSaveMenuBtnDatas.map(item => {
        if (item.MenuNo === this.CurentMenuNo) {
          item.MenuContextBtnData.map(menuClassitem => {
            menuClassitem.CheckedMenuNo = []
          })
        }
        return item
      })
    },
    menuClassBtnAllChecked(MenuClass) {
      // 分类下 的全选
      this.NeedSaveMenuBtnDatas.map(item => {
        if (item.MenuNo === this.CurentMenuNo) {
          item.MenuContextBtnData.map(menuClassitem => {
            if (menuClassitem.MenuClass === MenuClass) {
              const btns = []
              menuClassitem.ContextBtnList.forEach(i => {
                btns.push(i.ContextMenuNo)
              })
              menuClassitem.CheckedMenuNo = btns
            }
          })
        }
        return item
      })
    },
    menuClassBtnAllUnChecked(MenuClass) {
      // 分类下 的全不选
      this.NeedSaveMenuBtnDatas.map(item => {
        if (item.MenuNo === this.CurentMenuNo) {
          item.MenuContextBtnData.map(menuClassitem => {
            if (menuClassitem.MenuClass === MenuClass) {
              menuClassitem.CheckedMenuNo = []
            }
          })
        }
        return item
      })
    },
    // 按钮选中事件
    MentBtnCheckedChange(value) {

    },
    save() {
      // 保存
      const checkedMenuList = this.$refs.RoleMenuTree.getCheckedNodes()
      if (checkedMenuList.length <= 0) {
        this.$message({
          message: '请先勾选您要授权的菜单',
          type: 'warning'
        })
        return
      }
      if (this.NeedSaveMenuBtnDatas.length <= 0) {
        this.$message({
          message: '请增加您要授权的菜单或按钮',
          type: 'warning'
        })
        return
      }
      this.SaveDataLoading = true
      const data = this.NeedSaveMenuBtnDatas.filter(item => {
        const isHave = checkedMenuList.filter(menu => menu.id === item.MenuNo)
        if (isHave.length > 0) {
          return item
        }
      })
      if (data.length > 0) {
        role.SaveRoleAuthorMenuContextBtnsData({ roleid: this.authorizeparams.roleid, dataJson: JSON.stringify(data) }).then(res => {
          if (res.Issuccess) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.DataMsg)
          }
        })
      }
      this.SaveDataLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.RoleAuthorizeForm-dialog{
    background-color: red;
}
.el-dialog__body {
    height: 80%;
}
.menuclass-group{
    padding: 15px;
    border-top: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    padding-bottom:0px;
}
.menuclass-item-title{
        border-bottom: 1px solid #dcdfe6;
    height: 35px;
    line-height: 30px;
}
.menuclass-item-title-btn{
        float: right;
}
.menuclass-item-body{
        padding: 12px 0px;
}
</style>
