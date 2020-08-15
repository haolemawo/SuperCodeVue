<template>
  <div>
    <div class="Search-menubtn-toolbar">
      <SearchConditionToolbar ref="searchCondition" :searchsetting="searchSetting" />
      <MenuBottomToolbar menuclass="SM_SHOPCOUPONLIST" />
    </div>
    <div class="malllist-div">
      <el-table
        v-loading="tableDataLoading"
        :data="tableData"
        stripe
        highlight-current-row
        border
        :height="$store.state.app.ScreenSize.tableHeight"
        style="width: 100%; height: 465px;"
        current-row-key="COUPONID"
        @row-click="RowSelect"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="金额使用限制:">
                    <span>{{ props.row.AMOUNTLIMITUSE }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="有效类型:">
                    <span>{{ props.row.EFFECTIVETYPE == 'FixedDate' ? '固定日期' : '固定天数' }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="有效期:">
                    <span v-if="props.row.EFFECTIVETYPE == 'FixedDays'">{{ props.row.EFFECTIVEDAYS }}</span>
                    <span v-else>{{ props.row.EFFECTIVESTARTTIME }} - {{ props.row.EFFECTIVEENDTIME }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="相关产品/分类:">
                    <span>{{ props.row.REFRECORDNAME }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="优惠券名称" prop="COUPONNAME" />
        <el-table-column label="发放形式" prop="GRANTTYPE" align="center">
          <template slot-scope="scope">
            {{ scope.row.GRANTTYPE == 'Denomination' ? '通用领取' : scope.row.GRANTTYPE == 'Registration' ? '注册获取' : scope.row.GRANTTYPE == 'Invitation' ? '邀请发放' : '线下发放' }}
          </template>
        </el-table-column>
        <el-table-column label="优惠形式" prop="PREFERENTIALTYPE" align="center">
          <template slot-scope="scope">
            {{ scope.row.PREFERENTIALTYPE == 'Amount' ? '指定金额' : '折扣' }}
          </template>
        </el-table-column>
        <el-table-column label="优惠额度" prop="PREFERENTIALVAL" align="center" />
        <el-table-column label="优惠券数量" prop="GRANTNUM" align="center" />
        <el-table-column label="已发放数" align="center">
          <template slot-scope="scope">
            {{ scope.row.USECOUPONNUM + scope.row.NOUSECOUPONNUM }}
          </template>
        </el-table-column>
        <el-table-column label="已使用" prop="USECOUPONNUM" align="center" />
        <el-table-column label="是否上架" prop="ISUPPERSHELF" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.ISUPPERSHELF == 'Y'" effect="dark">已上架</el-tag>
            <el-tag v-else type="danger" effect="dark">下架</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="container-page-element">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="dataCount"
        :page-size="query.pagesize"
        :page-count="pageCount"
        @current-change="handleCurrentChange"
      />
    </div>

    <Coupon-Form v-if="formparams.isvisible" ref="couponForm" :params="formparams" @RefreshList="RefreshList" />
  </div>
</template>

<script>
import MenuBottomToolbar from '@/layout/components/Controls/MenuBottomToolbar'
import SearchConditionToolbar from '@/layout/components/Controls/SearchConditionToolbar'
import commonService from '@/api/common/common'
import * as Service from '@/api/shopping/CouponServer'
import CouponForm from './module/CouponForm'

export default {
  components: { MenuBottomToolbar, SearchConditionToolbar, 'Coupon-Form': CouponForm },
  data() {
    return {
      searchSetting: { // 搜索字段初始化
        searchConditionId: 'sysList3',
        fields: [{
          fldName: 'COUPONNAME', fldType: 'S', fldDesc: '优惠券名称', placeHolder: '优惠券名称'
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
      Service.GetCouponList(this.query).then(res => {
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
      this.currentRowId = row.COUPONID
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
