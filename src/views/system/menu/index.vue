<template>
  <div>
    <div class="Search-menubtn-toolbar">
      <!-- <SearchConditionToolbar ref="searchCondition" :searchsetting="searchSetting" /> -->
      <MenuBottomToolbar menuclass="BASE_SYSTEMMENU" />
    </div>
    <el-table
      v-loading="TreeTableDataLoading"
      :data="TreeTableData"
      stripe
      highlight-current-row
      row-key="MenuNo"
      :tree-props="{children: 'MenuChild'}"
      @row-click="RowSelect"
    >
      <el-table-column
        fixed
        prop="MenuName"
        label="菜单名称"
      >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.MenuIcon"
            style="width: 25px; height: 25px"
            :src="scope.row.MenuIcon"
          />
          {{ scope.row.MenuName }}
        </template>
      </el-table-column>
      <el-table-column
        prop="MenuNo"
        label="菜单编码"
        align="center"
      />
      <el-table-column
        label="是否启用"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.IsEnabled == true"> 是  </span>
          <span v-else style="color:#F56C6C;"> 否 </span>
        </template>
      </el-table-column>
      <el-table-column
        label="前端是否可见"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.IsVisible == true"> 可见  </span>
          <span v-else style="color:#F56C6C;"> 不可见 </span>
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        prop="OrderSotr"
        align="center"
      />
    </el-table>

    <Edit-Form v-if="editParams.isvisible" ref="editForm" :editparams="editParams" />
  </div>
</template>

<script>
import service from '@/api/system/menu'
import editForm from './module/editForm'
import MenuBottomToolbar from '@/layout/components/Controls/MenuBottomToolbar'

export default {
  components: { MenuBottomToolbar, 'Edit-Form': editForm },
  data() {
    return {
      TreeTableDataLoading: false,
      TreeTableData: [],
      // 当前选择行
      currentRow: null,
      editParams: { // 新增编辑参数
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
      this.TreeTableDataLoading = true
      service.GetMenuList({}).then(response => {
        if (response.Issuccess) {
          this.TreeTableData = response.Data
        } else {
          this.$message.error(response.DataMsg)
        }
        this.TreeTableDataLoading = false
      })
    },
    RowSelect(row) {
      // 选择当前行
      this.currentRow = row
    },
    // 编辑
    Edit() {
      if (!this.currentRow) {
        this.$message({
          showClose: true,
          message: '请选择要编辑的数据行',
          type: 'warning'
        })
        return
      }
      this.editParams.isvisible = false
      this.$nextTick(() => {
        this.editParams = {
          isvisible: true,
          key: this.currentRow.MenuNo,
          type: 'Edit'
        }
      })
    },
    // 启用
    Enable() {
      if (!this.currentRow) {
        this.$message({
          showClose: true,
          message: '请选择要启用的数据行',
          type: 'warning'
        })
        return
      }
      if (this.currentRow.ISENABLED === 'Y') {
        this.$message({
          showClose: true,
          message: '当前状态已为启用状态',
          type: 'warning'
        })
        return
      }
      this.ChangeMallTypeEnabled(this.currentRow.MALLTYPEID, 'Y')
    },
    // 停用
    Disabled() {
      if (!this.currentRow) {
        this.$message({
          showClose: true,
          message: '请选择要停用的数据行',
          type: 'warning'
        })
        return
      }
      if (this.currentRow.ISENABLED === 'N') {
        this.$message({
          showClose: true,
          message: '当前状态已为停用状态',
          type: 'warning'
        })
        return
      }
      this.$confirm('停用该分类，则此分类下的所有分类都将被停用，是否继续停用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ChangeMallTypeEnabled(this.currentRow.MALLTYPEID, 'N')
      }).catch(_ => {})
    },
    // 改变启用、停用状态
    ChangeMallTypeEnabled(id, state) {
      service.ChangeMallTypeEnabled({ malltypeid: id, state: state }).then(response => {
        if (response.Issuccess) {
          this.$message({
            message: '操作成功!',
            type: 'success'
          })
          this.RefreshList()
        } else {
          this.$message.error('操作失败，请重试!')
        }
      })
    },
    // 搜索事件
    search() {
      const filter = this.$refs.searchCondition.getFilterCondition()
      console.log(filter)
      if (filter) {
        this.UserTableDataLoading = true
      } else {
        this.InitData()
      }
    },
    // 刷新列表
    RefreshList() {
      this.InitData()
    }
  }
}
</script>
<style lang="scss" scoped>
.Search-menubtn-toolbar{
    background-color: #fff;
    width: 100%;
    display: inline-block;
    margin: 5px 0px;
    padding: 8px 10px;
}
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
