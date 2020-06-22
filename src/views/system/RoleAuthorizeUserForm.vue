// 角色授权用户、 增加用户表单
/* eslint-disable vue/valid-v-for */
// 角色授权表单
<template>
  <div>
    <el-dialog
      v-if="authorizeuserparams.isvisible"
      title="增加授权用户"
      width="460px"
      custom-class="RoleAuthorizeUserForm-dialog"
      node-key="id"
      :visible.sync="authorizeuserparams.isvisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-table
        :data="RoleAuthorUserDt.data"
        size="mini"
        height="350px"
        border
        style="width: 460px"
        @select="selectUser"
        @select-all="selectUser"
      >
        <el-table-column
          type="selection"
          width="30"
        />
        <el-table-column
          prop="USERNAME"
          label="姓名"
          align="center"
          width="120"
        />
        <el-table-column
          prop="USERACCOUNT"
          label="账号"
          align="center"
          width="180"
        />
        <el-table-column
          prop="name"
          label="性别"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.UserSex === '0' ? '男' : '女' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="container-page-element">
        <el-pagination
          background
          layout="total,prev, pager, next"
          :total="RoleAuthorUserDt.dataCount"
          :page-count="RoleAuthorUserDt.pageCount"
          :hide-on-single-page="false"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="SaveDataLoading" @click="save('entity')">保存</el-button>
        <el-button @click="authorizeuserparams.isvisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import role from '@/api/system/role'

export default {
  name: 'RoleAuthorizeUserForm',
  props: {
    authorizeuserparams: { // 这个就是父组件中子标签自定义名字
      type: Object,
      required: true
    }
  },
  data() {
    return {
      RoleAuthorUserDt: { data: [] },
      MenuBtnDatasLoading: false,
      SaveDataLoading: false,
      NeedSaveUserList: [],
      CurentMenuNo: '', // 当前选中的菜单
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.Init()
  },
  methods: {
    Init() {
      role.GetNeedAuthorUser({ roleid: this.authorizeuserparams.roleid, pageIndex: 1, pageSize: 15 }).then(res => {
        if (res.Issuccess) {
          this.RoleAuthorUserDt = res.Data
        }
      })
    },
    // 选择用户时触发
    selectUser(selection, row) {
      this.NeedSaveUserList = selection
    },
    save() {
      // 保存
      if (this.NeedSaveUserList.length <= 0) {
        this.$message({
          message: '请先勾选您要授权的用户',
          type: 'warning'
        })
        return
      }
      this.SaveDataLoading = true
      role.SaveNeedAuthorUser({ roleid: this.authorizeuserparams.roleid, param: JSON.stringify(this.NeedSaveUserList) }).then(res => {
        if (res.Issuccess) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          console.log(this.authorizeuserparams)
          this.authorizeuserparams.isvisible = false
          this.$parent.RefreshUserList()
        } else {
          this.$message.error(res.DataMsg)
        }
      })
      this.SaveDataLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
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
