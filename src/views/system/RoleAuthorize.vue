<template>
  <div class="components-container">
    <!-- <div style="height:200px">
       <MenuBottomToolbar menuclass="BASE_ROLEAUTHORIZE" @cllFun="cllFun" />
    </div> -->
    <split-pane :min-percent="15" :default-percent="20" :max-percent="30" split="vertical">
      <template slot="paneL">
        <div class="left-container">
          <el-card>
            <el-input
              v-model="filterText"
              placeholder="输入角色关键字过滤"
            />
            <el-tree
              ref="RoleTree"
              class="filter-tree"
              :props="defaultProps"
              style="height:500px"
              node-key="id"
              default-expand-all
              highlight-current
              lazy
              :load="GetRoleTree"
              :filter-node-method="filterNode"
              @node-click="handleCheckChange"
            />
          </el-card>
        </div>
      </template>
      <template slot="paneR">
        <el-card v-loading="tabCardLoading">
          <el-tabs v-model="CurrentActiveTag" type="border-card" @tab-click="tabClick">
            <el-tab-pane label="授权功能" name="AuthoreMenu">
              <SearchConditionToolbar />
              <MenuBottomToolbar menuclass="BASE_ROLEAUTHORIZE" @cllFun="cllFun" />
              <el-table
                v-loading="RolePrivileageMenuDataLoading"
                :data="RolePrivileageMenuData"
                style="width: 100%;margin-bottom: 20px;"
                height="420px"
                row-key="key"
                highlight-current-row
                border
                :span-method="RolePrivileageMenuDataSpanFun"
                :tree-props="{children: 'children'}"
              >
                <el-table-column
                  prop="Extend.MENUNAME"
                  label="菜单名称"
                  width="120"
                />
                <el-table-column
                  label="访问授权"
                  align="center"
                  width="80"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.Extend.IsAccess === 'Y' ? '是' : '否' }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Extend.MENUCLASSDESC"
                  label="功能集名称"
                  width="150"
                />
                <el-table-column
                  prop="Extend.CONTEXTMENUDESC"
                  label="已授权按钮名称"
                />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="授权用户" name="AuthoreUser">
              <SearchConditionToolbar />
              <MenuBottomToolbar menuclass="BASE_ROLEAUTHORIZEUSER" @cllFun="cllFun" />
              <el-table
                :data="RolePrivileageUserData.data"
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                highlight-current-row
                border
                @select="selectUserRow"
                @select-all="selectUserRow"
              >
                <el-table-column
                  type="selection"
                  width="30"
                />
                <el-table-column
                  prop="USERNAME"
                  label="用户姓名"
                  align="center"
                  width="120"
                />
                <el-table-column
                  prop="USERACCOUNT"
                  label="登录账号"
                  align="center"
                  width="150"
                />
                <el-table-column
                  prop="USERSEX"
                  label="性别"
                  align="center"
                  width="80"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.USERSEX === '0' ? '男' : '女' }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="CONTEXTMENUDESC"
                  label="角色有效期"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.STARTDATE === null && scope.row.ENDDATE === null">
                      永不过期
                    </span>
                    <span v-else-if="scope.row.STARTDATE === null && scope.row.ENDDATE !== null">
                      {{ scope.row.ENDDATE }}过期
                    </span>
                    <span v-else>
                      {{ scope.row.STARTDATE }}生效
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </template>
    </split-pane>
    <RoleAuthorize-Form v-if="authorizeparams.isvisible" ref="RoleAuthorizeForm" :authorizeparams="authorizeparams" @RefreshDetailList="RefreshDetailList" />
    <RoleAuthorizeUser-Form v-if="authorizeuserparams.isvisible" ref="RoleAuthorizeUserForm" :authorizeuserparams="authorizeuserparams" />
  </div>
</template>

<script>
import role from '@/api/system/role'
import MenuBottomToolbar from '@/layout/components/Controls/MenuBottomToolbar'
import SearchConditionToolbar from '@/layout/components/Controls/SearchConditionToolbar'
import splitPane from 'vue-splitpane'
import RoleAuthorizeForm from './RoleAuthorizeForm'
import RoleAuthorizeUserForm from './RoleAuthorizeUserForm'

export default {
  components: { MenuBottomToolbar, SearchConditionToolbar, 'split-pane': splitPane,
    'RoleAuthorize-Form': RoleAuthorizeForm,
    'RoleAuthorizeUser-Form': RoleAuthorizeUserForm },
  data() {
    return {
      filterText: '',
      CurrentActiveTag: 'AuthoreMenu',
      tabCardLoading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      RolePrivileageMenuDataLoading: false,
      RolePrivileageMenuData: [],
      RolePrivileageUserData: { data: [] },
      // 授权菜单参数
      authorizeparams: {
        isvisible: false,
        type: 'authorize'
      },
      // 增加授权用户参数
      authorizeuserparams: {
        isvisible: false,
        type: 'AddAuthorizeUser'
      },
      // 当前选择角色
      currentRoleNode: null,
      // 待删除用户信息
      NeedDeleteUserList: [],
      detailloading: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.RoleTree.filter(val)
    }
  },
  created() {
    this.$bus.on('cllFun', this.cllFun)
  },
  beforeDestroy() {
    this.$bus.off('cllFun', this.cllFun)
  },
  methods: {
    cllFun(methodName) {
      this[methodName].apply(this)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 选项卡切换事件
    tabClick(tab, event) {
      this.CurrentActiveTag = tab.name
    },
    // 获取角色
    GetRoleTree(node, resolve) {
      if (node.level === 0) {
        return resolve([{ id: '0', label: '角色' }])
      }
      if (node.level > 1) return resolve([])
      role.GetRoleTree().then(res => {
        if (res.Issuccess) {
          const arr = []
          res.Data.forEach(element => {
            arr.push({ id: element.keyid, label: element.name })
          })
          this.$refs.RoleTree.setCheckedNodes(arr)
          resolve(arr)
        }
      })
    },
    // 角色点击事件
    handleCheckChange(data, checked, indeterminate) {
      this.currentRoleNode = this.$refs.RoleTree.getCurrentNode()
      this.GetRoleAuthorize(this.currentRoleNode.id)
      this.GetRoleAuthorizeUser(this.currentRoleNode.id)
    },
    // 用户选择事件
    selectUserRow(selection, row) {
      this.NeedDeleteUserList = selection
    },
    // 获取角色的功能列表
    GetRoleAuthorize(roleid) {
      this.tabCardLoading = true
      this.RolePrivileageMenuDataLoading = true
      role.GetRolePrivileageMenu({ roleid: roleid }).then(res => {
        if (res.Issuccess) {
          this.RolePrivileageMenuData = res.Data
        }
        this.tabCardLoading = false
        this.RolePrivileageMenuDataLoading = false
      })
    },
    // 获取角色的授权用户列表 RolePrivileageUserData
    GetRoleAuthorizeUser(roleid) {
      this.tabCardLoading = true
      role.GetRolePrivileageUserList({ roleid: roleid, pageIndex: 1, pageSize: 15 }).then(res => {
        if (res.Issuccess) {
          this.RolePrivileageUserData = res.Data
        }
        this.tabCardLoading = false
      })
    },
    // 刷新授权功能列表
    RefreshDetailList() {
      this.GetRoleAuthorize(this.currentRoleNode.id)
    },
    // 刷新授权用户列表
    RefreshUserList() {
      this.GetRoleAuthorizeUser(this.currentRoleNode.id)
    },
    // 授权
    Authorize() {
      if (!this.currentRoleNode) {
        this.$message({
          showClose: true,
          message: '请选择要授权的角色',
          type: 'warning'
        })
        return
      }
      this.authorizeparams.isvisible = false
      this.$nextTick(() => {
        this.authorizeparams = {
          roleid: this.currentRoleNode.id,
          isvisible: true,
          type: 'authorize'
        }
      })
      // this.$refs.RoleAuthorizeForm.Init()
    },
    AddAuthorizeUser() {
      // 增加授权用户
      if (!this.currentRoleNode) {
        this.$message({
          showClose: true,
          message: '请选择要授权的角色',
          type: 'warning'
        })
        return
      }
      this.authorizeuserparams.isvisible = false
      this.$nextTick(() => {
        this.authorizeuserparams = {
          roleid: this.currentRoleNode.id,
          isvisible: true,
          type: 'AddAuthorizeUser'
        }
      })
    },
    // 删除授权用户
    DeleteAuthorizeUser() {
      const userids = []
      this.NeedDeleteUserList.forEach(res => {
        userids.push(res.USERID)
      })
      if (userids.length <= 0) {
        this.$message({
          message: '请先勾选您要删除的用户',
          type: 'warning'
        })
        return
      }
      this.SaveDataLoading = true
      role.DeleteAuthorUser({ roleid: this.currentRoleNode.id, userids: userids.join(',') }).then(res => {
        if (res.Issuccess) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.RefreshUserList()
        } else {
          this.$message.error(res.DataMsg)
        }
      })
      this.SaveDataLoading = false
    },
    RolePrivileageMenuDataSpanFun({ row, column, rowIndex, columnIndex }) {
      console.log(row)
      console.log(column)
      console.log(rowIndex)
      console.log(columnIndex)
    }
  }

}

</script>

<style lang="scss" scoped>

</style>

