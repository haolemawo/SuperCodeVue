<template>
  <div>
    <div class="Search-menubtn-toolbar">
      <!-- <SearchConditionToolbar ref="searchCondition" :searchsetting="searchSetting" /> -->
      <MenuBottomToolbar menuclass="SM_SHOPPINGPRODUCTTYPE" />
    </div>
    <el-table
      v-loading="TreeTableDataLoading"
      :data="TreeTableData"
      stripe
      highlight-current-row
      lazy
      :load="loadTreeData"
      row-key="MALLTYPEID"
      :fit="true"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @row-click="RowSelect"
    >
      <el-table-column
        fixed
        prop="MALLTYPECODE"
        label="分类编码"
      >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.MALLTYPEICON"
            style="width: 25px; height: 25px"
            :src="scope.row.MALLTYPEICON"
          />
          {{ scope.row.MALLTYPECODE }}
        </template>
      </el-table-column>
      <el-table-column
        prop="MALLTYPENAME"
        label="分类名称"
        align="center"
      />
      <!-- <el-table-column
        prop="MALLTYPEICON"
        label="图标"
        align="center"
        width="60px"
      /> -->
      <el-table-column
        label="是否启用"
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ISENABLED == 'Y' ? '是' : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="首页是否显示"
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ISSHOWHOME == 'Y' ? '是' : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否首页推荐"
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ISHOMEPAGE == 'Y' ? '是' : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ $moment(scope.row.CREATEDATE).format("YYYY-MM-DD") }}</span>
        </template>
      </el-table-column>
    </el-table>

    <MallType-Form v-if="formparams.isvisible" ref="mallTypeEdit" :params="formparams" />
  </div>
</template>

<script>
import service from '@/api/shopping/shoppingmall'
import MenuBottomToolbar from '@/layout/components/Controls/MenuBottomToolbar'
// import SearchConditionToolbar from '@/layout/components/Controls/SearchConditionToolbar'
import MallTypeForm from './MallTypeForm'

export default {
  components: { MenuBottomToolbar, 'MallType-Form': MallTypeForm },
  data() {
    return {
      // searchSetting: { // 搜索字段初始化
      //   searchConditionId: 'searchConditionId',
      //   fields: [{
      //     fldName: 'MALLTYPENAME', fldType: 'S', fldDesc: '分类名称', placeHolder: '分类名称'
      //   }]
      // },
      TreeTableDataLoading: false,
      dataCount: 10, // 总条数
      pageCount: 10, // 总页数
      currentPage: 1, // 当前页
      pageSize: 15, // 每页大小
      TreeTableData: [],
      // 当前选择行
      currentRow: null,
      formparams: { // 新增编辑参数
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
      service.GetMallTypeListByParentId({ parentid: 0 }).then(response => {
        if (response.Issuccess) {
          response.Data.map(item => {
            item.hasChildren = true
            return item
          })
          this.TreeTableData = response.Data
          console.log(this.TreeTableData)
        } else {
          this.$message.error(response.DataMsg)
        }
        this.TreeTableDataLoading = false
      })
    },
    loadTreeData(tree, treeNode, resolve) {
      service.GetMallTypeListByParentId({ parentid: tree.MALLTYPEID }).then(response => {
        if (response.Issuccess) {
          response.Data.map(item => {
            item.hasChildren = true
            return item
          })
          resolve(response.Data)
        } else {
          this.$message.error(response.DataMsg)
        }
      })
    },
    RowSelect(row) {
      // 选择当前行
      this.currentRow = row
    },
    // 新增分类
    Add() {
      this.formparams.isvisible = false
      this.$nextTick(() => {
        this.formparams = {
          isvisible: true,
          type: 'Add'
        }
      })
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
      this.formparams.isvisible = false
      this.$nextTick(() => {
        this.formparams = {
          isvisible: true,
          keyid: this.currentRow.MALLTYPEID,
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
