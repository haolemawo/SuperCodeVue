<template>
  <div>
    <div class="Search-menubtn-toolbar">
      <SearchConditionToolbar />
      <MenuBottomToolbar menuclass="BASE_ROLEMANAGER" />
    </div>
    <el-table
      :data="tableData"
      :height="$store.state.app.ScreenSize.tableHeight"
      stripe
      highlight-current-row
      border
      style="width: 100%"
      :fit="true"
      current-row-key="ROLEID"
      @row-click="RowSelect"
    >
      <el-table-column
        fixed
        prop="ROLENAME"
        label="角色名称"
        width="200px"
      />
      <el-table-column
        prop="ROLELEVELCN"
        label="角色等级"
        width="200px"
      />
      <el-table-column
        prop="REMARK"
        label="角色描述"
        width="340px"
      />
      <el-table-column
        label="创建时间"
        width="200px"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ $moment(scope.row.CREATEDATE).format("YYYY-MM-DD") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="USERNAME"
        label="创建人"
        width="120"
      />
    </el-table>
    <div class="container-page-element">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="dataCount"
        :page-count="pageCount"
        :hide-on-single-page="false"
      />
    </div>
    <!-- 角色添加、编辑框 Start -->
    <roleedit-form v-if="formparams.isvisible" ref="roleEdit" :formparams="formparams" />
    <!-- 角色添加、编辑框 END -->
  </div>
</template>

<script>
import role from '@/api/system/role'
import MenuBottomToolbar from '@/layout/components/Controls/MenuBottomToolbar'
import SearchConditionToolbar from '@/layout/components/Controls/SearchConditionToolbar'
import roleeditForm from './module/roleform'

export default {
  components: { MenuBottomToolbar, SearchConditionToolbar, 'roleedit-form': roleeditForm },
  data() {
    return {
      dataCount: 10, // 总条数
      pageCount: 10, // 总页数
      currentPage: 1, // 当前页
      pageSize: 15, // 每页大小
      tableData: null,
      // 当前选择行
      currentRowId: null,
      // 控制编辑框显示
      showRoleForm: false,
      formparams: {
        isvisible: false
      }
    }
  },
  created() {
    this.$bus.on('cllFun', this.cllFun)
    this.InitData()
  },
  beforeDestroy() {
    this.$bus.off('cllFun', this.cllFun)
  },
  methods: {
    cllFun(methodName) {
      this[methodName].apply(this)
    },
    InitData() {
      const that = this
      role.GetRoleList({ cp: that.currentPage, sp: that.pageSize, filters: '' }).then(response => {
        if (response.Issuccess) {
          const pageData = response.Data
          that.dataCount = pageData.dataCount
          that.pageCount = pageData.pageCount
          that.currentPage = pageData.page
          that.pageSize = pageData.pageSize
          that.tableData = pageData.data
        }
      })
    },
    RowSelect(row) {
      // 选择当前行
      this.currentRowId = row.ROLEID
    },
    // 新增
    Add() {
      this.formparams.isvisible = false
      this.$nextTick(() => {
        this.formparams = {
          isvisible: true,
          type: 'Add'
        }
      })
    },
    Edit() {
      if (!this.currentRowId) {
        this.$message({
          showClose: true,
          message: '请选择要编辑的数据行',
          type: 'warning'
        })
        return
      }
      this.formparams.isvisible = false
      this.$nextTick(() => {
        this.formparams = {
          isvisible: true,
          key: this.currentRowId,
          type: 'Edit'
        }
      })
    },
    Delete() {
      if (!this.currentRowId) {
        this.$message({
          showClose: true,
          message: '请选择要删除的数据行',
          type: 'warning'
        })
        return
      }
      this.$confirm('确定要删除当前角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        role.DeleteRole({ key: this.currentRowId }).then(res => {
          if (res.Issuccess) {
            this.entity = res.Data
            this.$message({
              message: '操作成功!',
              type: 'success'
            })
            this.RefreshList()
          } else {
            this.$message.error(res.DataMsg)
          }
        })
      }).catch(_ => {})
    },
    RefreshList() {
      // 刷新列表
      const that = this
      role.GetRoleList({ cp: 1, sp: that.pageSize, filters: '' }).then(response => {
        if (response.Issuccess) {
          const pageData = response.Data
          that.dataCount = pageData.dataCount
          that.pageCount = pageData.pageCount
          that.currentPage = pageData.page
          that.pageSize = pageData.pageSize
          that.tableData = pageData.data
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container-page-element{
    background-color: #fff;
    bottom: 0px;
    // position: absolute;
    width: 100%;
    text-align: right;
    margin-top: 10px;
}
.el-pagination{
  padding: 5px;
}
</style>
