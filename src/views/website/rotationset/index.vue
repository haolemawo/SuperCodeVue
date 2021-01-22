// 轮播图设置
<template>
  <div>
    <div class="Search-menubtn-toolbar">
      <SearchConditionToolbar ref="searchCondition" :searchsetting="searchSetting" />
      <MenuBottomToolbar menuclass="WEB_ROTATIONSET" />
    </div>
    <el-table
      v-loading="tableDataLoading"
      :data="tableData"
      :height="$store.state.app.ScreenSize.tableHeight"
      stripe
      highlight-current-row
      border
      style="width: 100%"
      :fit="true"
      current-row-key="ROTATIONID"
      @row-click="RowSelect"
    >
      <el-table-column
        label="图片预览"
        align="center"
        width="300px"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.ROTATIONFILEPATH"
            fit="fit"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="ROTATIONTITLE"
        label="名称"
        align="center"
        width="150px"
      />
      <el-table-column
        label="轮播图尺寸"
        align="center"
        width="180px"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ROTATIONWIDTH }}px*{{ scope.row.ROTATIONHEIGHT }}px</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否启用"
        align="center"
        width="80px"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ISENABLED==='Y'?'是':'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="SEQ"
        label="排序"
        align="center"
        width="60px"
      />
      <el-table-column
        label="展示端"
        align="center"
        width="80px"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.SHOWPLACE==='Applets'?'小程序':scope.row.SHOWPLACE === 'Mobile' ? '手机端' : scope.row.SHOWPLACE === 'PC' ? '电脑端' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.CREATEDATE).format("YYYY-MM-DD") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="CREATEUSERNAME"
        label="创建人"
        align="center"
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
    <!-- 添加、编辑框 Start -->
    <RotationSet-Form v-if="formparams.isvisible" ref="roleEdit" :params="formparams" />
    <!-- 添加、编辑框 END -->
  </div>
</template>

<script>
import Service from '@/api/WebSite/RotatioinSet'
import MenuBottomToolbar from '@/layout/components/Controls/MenuBottomToolbar'
import SearchConditionToolbar from '@/layout/components/Controls/SearchConditionToolbar'
import RotationSetForm from './module/RotationSetForm'
import commonService from '@/api/common/common'

export default {
  components: { MenuBottomToolbar, SearchConditionToolbar, 'RotationSet-Form': RotationSetForm },
  data() {
    return {
      searchSetting: { // 搜索字段初始化
        searchConditionId: 'searchConditionId',
        fields: [{
          fldName: 'SHOWPLACE', fldType: 'LC', fldDesc: '分类名称', placeHolder: '分类名称',
          dataSource: [{
            value: 'Applets',
            text: '小程序'
          }, {
            value: 'Mobile',
            text: '手机端'
          }, {
            value: 'PC',
            text: '电脑端'
          }]
        }]
      },
      tableDataLoading: false,
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
      },
      query: {
        currenrpage: 1, // 当前页
        pageSize: 15, // 每页大小
        filters: ''
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
      this.tableData = []
      Service.GetRotationList(this.query).then(res => {
        if (res.Issuccess) {
          this.tableData = res.Data.data
          this.dataCount = this.tableData.length
        }
        this.tableDataLoading = false
      })
    },
    RowSelect(row) {
      // 选择当前行
      this.currentRowId = row.ROTATIONID
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
      this.$confirm('确定要删除当前轮播图吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commonService.DeleteData({ TableName: 'web_rotation', TableColumn: 'ROTATIONID', RecordId: this.currentRowId }).then(res => {
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
      }).catch(_ => {})
    },
    RefreshList() {
      // 刷新列表
      this.InitData()
    },
    // 搜索事件
    search() {
      const filter = this.$refs.searchCondition.getFilterCondition()
      this.tableDataLoading = true
      this.query.filters = filter
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
