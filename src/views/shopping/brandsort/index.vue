<template>
  <div>
    <div class="Search-menubtn-toolbar">
      <SearchConditionToolbar ref="searchCondition" :searchsetting="searchSetting" />
      <MenuBottomToolbar menuclass="SM_SHOPPINGBRANDSORT" />
    </div>
    <div class="malllist-div">
      <el-table
        v-loading="tableDataLoading"
        :data="tableData"
        stripe
        highlight-current-row
        border
        style="width: 100%"
        current-row-key="MALLID"
        @row-click="RowSelect"
      >
        <el-table-column label="分类名称" align="center" width="400px">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" @click="clickName(scope.row.BRANDTYPEID)">{{scope.row.BRANDTYPENAME}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center" width="120px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.ISENABLE == 'Y'">启用</el-tag>
            <el-tag v-else type="info">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="SEQNO" label="排序" align="center" width="100px" />
        <el-table-column label="创建时间" align="center" width="200px">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ $moment(scope.row.CREATEDATE).format("YYYY-MM-DD") }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="CREATEUSERNAME" align="center" label="创建人" />
      </el-table>
    </div>
    <div class="container-page-element">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="dataCount"
        :page-size="query.pagesize"
        :page-count="pageCount"
        :hide-on-single-page="true"
        @current-change="handleCurrentChange"
      />
    </div>

    <Sort-Form v-if="formparams.isvisible" ref="sortForm" :params="formparams" @RefreshList="RefreshList" />
  </div>
</template>

<script>
import MenuBottomToolbar from '@/layout/components/Controls/MenuBottomToolbar'
import SearchConditionToolbar from '@/layout/components/Controls/SearchConditionToolbar'
import SortForm from './module/SortForm'
import commonService from '@/api/common/common'
import Service from '@/api/shopping/BrandServer'

export default {
  components: { MenuBottomToolbar, SearchConditionToolbar, 'Sort-Form': SortForm },
  data() {
    return {
      searchSetting: { // 搜索字段初始化
        searchConditionId: 'sysList3',
        fields: [{
          fldName: 'BRANDNAME', fldType: 'S', fldDesc: '分类名称', placeHolder: '分类名称'
        }]
      },
      query: {
        currenrpage: 1,
        pagesize: 15,
        filters: ''
      },
      tableDataLoading: false,
      tableData: [],
      dataCount: 0,
      pageCount: 0,
      currentRowId: null,
      formparams: {
        isvisible: false,
        type: 'Add'
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
      this.tableDataLoading = true
      Service.GetBrandTypeList(this.query).then(res => {
        if (res.Issuccess) {
          this.tableData = res.Data.data
          this.dataCount = res.Data.dataCount
          this.pageCount = res.Data.pageCount
        }
        this.tableDataLoading = false
      })
    },
    RowSelect(row) {
      // 选择当前行
      this.currentRowId = row.BRANDTYPEID
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
          keyid: this.currentRowId,
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
      this.$confirm('确定删除选中数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commonService.DeleteData({ TableName: 'shop_brandtype', TableColumn: 'BRANDTYPEID', RecordId: this.currentRowId }).then(res => {
          if (res.Issuccess) {
            if (res.Data) {
              this.$message({
                message: '操作成功!',
                type: 'success'
              })
              this.RefreshList()
            } else {
              this.$message.error('操作失败')
            }
          } else {
            this.$message.error(res.DataMsg)
          }
        })
      }).catch(() => { })
    },
    handleCurrentChange(val) {
      this.query.currenrpage = val
      this.InitData()
    },
    RefreshList() {
      // 刷新列表
      this.InitData()
    },
    clickName(keyid) {
      this.formparams.isvisible = false
      this.$nextTick(() => {
        this.formparams = {
          isvisible: true,
          keyid: keyid,
          type: 'View'
        }
      })
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
</style>
