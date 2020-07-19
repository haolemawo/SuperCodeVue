<template>
  <div class="components-container">
    <split-pane :min-percent="15" :default-percent="20" :max-percent="30" split="vertical">
      <template slot="paneL">
        <div class="left-container">
          <el-card>
            <el-input
              v-model="mallTypeFilterText"
              placeholder="输入关键字进行过滤"
            />
            <!-- @node-click="handleCheckChange" -->
            <el-tree
              ref="mallTypeTree"
              class="filter-tree"
              show-checkbox
              :data="mallTypeTreeData"
              :props="defaultProps"
              node-key="key"
              default-expand-all
              highlight-current
              :filter-node-method="filterMallTypeNode"
            />
          </el-card>
        </div>
      </template>
      <template slot="paneR">
        <div class="Search-menubtn-toolbar">
          <SearchConditionToolbar ref="searchCondition" :searchsetting="searchSetting" />
          <MenuBottomToolbar menuclass="SM_SHOPPINGPRODUCTLIST" />
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
            <el-table-column
              prop="MALLCODE"
              label="商品编码"
              align="center"
              width="180px"
            />
            <el-table-column
              label="商品名称"
              align="center"
              width="180px"
            >
              <template slot-scope="scope">
                <el-button type="text" style="padding-top: 0px;padding-bottom: 0px;" @click="clickMallNameBtn(scope.row.MALLID)">{{ scope.row.MALLNAME }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="商品价格"
              align="center"
              width="80px"
            >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.FLOORPRICE }}-{{ scope.row.CEILINGPRICE }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="QUANTITY"
              label="库存数量"
              align="center"
              width="80px"
            />
            <el-table-column
              label="是否推荐"
              align="center"
              width="70px"
            >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.ISHOMEPAGE === 'Y'? '是':'否' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="REMARK"
              label="购买量"
              align="center"
              width="80px"
            />
            <el-table-column
              prop="BROWSEVOLUME"
              label="浏览量"
              align="center"
              width="80px"
            />
            <el-table-column
              label="创建时间"
              align="center"
              width="150px"
            >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ $moment(scope.row.CREATEDATE).format("YYYY-MM-DD") }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="CREATEUSERNAME"
              align="center"
              label="创建人"
            />
          </el-table>
        </div>
        <div class="container-page-element">
          <el-pagination
            background
            layout="total,prev, pager, next"
            :total="dataCount"
            :page-count="pageCount"
            :hide-on-single-page="false"
          />
        </div>
      </template>
    </split-pane>
    <Mall-Form v-if="formparams.isvisible" ref="MallEdit" :params="formparams" />
  </div>
</template>

<script>
import Service from '@/api/shopping/shoppingmall'
import commonService from '@/api/common/common'
import splitPane from 'vue-splitpane'
import MenuBottomToolbar from '@/layout/components/Controls/MenuBottomToolbar'
import SearchConditionToolbar from '@/layout/components/Controls/SearchConditionToolbar'
import MallForm from './MallForm'

export default {
  components: { MenuBottomToolbar, SearchConditionToolbar, 'split-pane': splitPane, 'Mall-Form': MallForm },
  data() {
    return {
      searchSetting: { // 搜索字段初始化
        searchConditionId: 'sysList3',
        fields: [{
          fldName: 'MALLCODE', fldType: 'S', fldDesc: '商品编码', placeHolder: '商品编码'
        }, {
          fldName: 'MALLNAME', fldType: 'S', fldDesc: '商品名称', placeHolder: '商品名称'
        }]
      },
      mallTypeFilterText: '', // 商品分类过滤关键词
      mallTypeTreeData: [],
      // 当前选择商品分类
      currentRoleNode: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dataCount: 0, // 总条数
      pageCount: 0, // 总页数
      query: {
        currenrpage: 1, // 当前页
        pageSize: 15, // 每页大小
        filters: '',
        typeids: []
      },
      tableData: null,
      tableDataLoading: false,
      // 当前选择行
      currentRowId: null,
      // 控制编辑框显示
      showRoleForm: false,
      formparams: {
        isvisible: false,
        type: 'Add'
      }
    }
  },
  watch: {
    mallTypeFilterText(val) {
      this.$refs.mallTypeTree.filter(val)
    }
  },
  created() {
    this.$bus.on('cllFun', this.cllFun)
    this.InitData()
    this.GetMallTypeTree()
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
      Service.GetMallInfoList(this.query).then(res => {
        if (res.Issuccess) {
          this.tableData = res.Data.data
        }
        this.tableDataLoading = false
      })
    },
    RowSelect(row) {
      // 选择当前行
      this.currentRowId = row.MALLID
    },
    // 获取商城分类tree
    GetMallTypeTree() {
      Service.GetMallTypeTreeList().then(res => {
        console.log(res)
        if (res.Issuccess) {
          this.mallTypeTreeData = res.Data
        }
      })
    },
    // 过滤商城分类tree
    filterMallTypeNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 商城分类tree点击事件
    handleCheckChange(data, checked, indeterminate) {
      this.currentRoleNode = this.$refs.mallTypeTree.getCurrentNode()
      this.query.typeids = []
      this.query.typeids.push(this.currentRoleNode.key)
      this.search()
    },
    // 搜索事件
    search() {
      const filter = this.$refs.searchCondition.getFilterCondition()
      const typeids = this.$refs.mallTypeTree.getCheckedKeys()
      this.query.typeids = []
      typeids.forEach(item => {
        this.query.typeids.push(item)
      })
      this.tableDataLoading = true
      this.query.filters = filter
      Service.GetMallInfoList(this.query).then(res => {
        if (res.Issuccess) {
          this.tableData = res.Data.data
        }
        this.tableDataLoading = false
      })
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
      commonService.DeleteData({ TableName: 'shop_mall', TableColumn: 'MALLID', RecordId: this.currentRowId }).then(res => {
        if (res.Issuccess) {
          if (res.Data) {
            this.$message({
              message: '操作成功!',
              type: 'success'
            })
            this.RefreshMallList()
          } else {
            this.$message.error('操作失败')
          }
        } else {
          this.$message.error(res.DataMsg)
        }
      })
    },
    RefreshMallList() {
      // 刷新列表
      this.tableDataLoading = true
      Service.GetMallInfoList(this.query).then(res => {
        if (res.Issuccess) {
          this.tableData = res.Data.data
        }
        this.tableDataLoading = false
      })
    },
    clickMallNameBtn(keyid) {
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
/deep/.el-card__body{
  padding: 10px
}
.container-page-element{
    background-color: #fff;
    bottom: 0px;
    margin-bottom: 20px;
    position: absolute;
    width: 100%;
    text-align: right;
}
.el-pagination{
  padding: 5px;
}
.left-container{
  margin-top: 5px;
  height: calc(100vh - 105px);
  overflow: auto;
}
.malllist-div{
  height: calc(100vh - 180px);
}
</style>
