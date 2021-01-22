<template>
  <div>
    <div class="Search-menubtn-toolbar">
      <SearchConditionToolbar ref="searchCondition" :searchsetting="searchSetting" />
      <MenuBottomToolbar menuclass="SM_SHOPPINGBRANDLIST" />
    </div>
    <div class="malllist-div">
      <el-table
        v-loading="tableDataLoading"
        :data="tableData"
        stripe
        highlight-current-row
        border
        :height="$store.state.app.ScreenSize.tableHeight"
        style="width: 100%;"
        current-row-key="MALLID"
        @row-click="RowSelect"
      >
        <el-table-column prop="BRANDTYPENAME" label="品牌分类名称" align="center" width="120px" />
        <el-table-column prop="BRANDNAME" label="品牌名称" align="center" width="180px">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" @click="clickName(scope.row.BRANDID)">{{ scope.row.BRANDNAME }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="品牌Logo" align="center" width="100px">
          <template slot-scope="scope">
            <img :src="scope.row.BRANDLOGO">
          </template>
        </el-table-column>
        <el-table-column prop="BRANDWEBSITE" label="官网" align="center" width="180px" />
        <el-table-column label="是否热门" align="center" width="80px">
          <template slot-scope="scope">
            {{ scope.row.ISHOT == 'Y' ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="是否推荐" align="center" width="80px">
          <template slot-scope="scope">
            {{ scope.row.ISRECOMMEND == 'Y' ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center" width="80px">
          <template slot-scope="scope">
            {{ scope.row.ISENABLE == 'Y' ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="150px">
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

    <Brand-Form v-if="formparams.isvisible" ref="brandForm" :params="formparams" @RefreshList="RefreshList" />
  </div>
</template>

<script>
import MenuBottomToolbar from '@/layout/components/Controls/MenuBottomToolbar'
import SearchConditionToolbar from '@/layout/components/Controls/SearchConditionToolbar'
import BrandForm from './module/BrandForm'
import commonService from '@/api/common/common'
import Service from '@/api/shopping/BrandServer'

export default {
  components: { MenuBottomToolbar, SearchConditionToolbar, 'Brand-Form': BrandForm },
  data() {
    return {
      searchSetting: { // 搜索字段初始化
        searchConditionId: 'sysList3',
        fields: [{
          fldName: 'BRANDNAME', fldType: 'S', fldDesc: '品牌名称', placeHolder: '品牌名称'
        }]
      },
      query: {
        currenrpage: 1,
        pagesize: 10,
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
      Service.GetBrandList(this.query).then(res => {
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
      this.currentRowId = row.BRANDID
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
        commonService.DeleteData({ TableName: 'shop_brand', TableColumn: 'BRANDID', RecordId: this.currentRowId }).then(res => {
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
    // 搜索事件
    search() {
      this.query.filters = this.$refs.searchCondition.getFilterCondition()
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
</style>
