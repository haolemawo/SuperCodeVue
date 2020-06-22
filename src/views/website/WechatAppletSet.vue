// 轮播图设置
<template>
  <div>
    <div class="Search-menubtn-toolbar">
      <MenuBottomToolbar menuclass="WEB_WECHATAPPLETINDEXTYPE" />
    </div>
    <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          一致性 Consistency
          <MenuBottomToolbar menuclass="WEB_WECHATAPPLETINDEXTYPE" />
        </template>
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </el-collapse-item>
      <el-collapse-item title="反馈 Feedback">
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
      <el-collapse-item title="效率 Efficiency">
        <div>简化流程：设计简洁直观的操作流程；</div>
        <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
        <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
      </el-collapse-item>
      <el-collapse-item title="可控 Controllability">
        <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import Service from '@/api/WebSite/RotatioinSet'
import MenuBottomToolbar from '@/layout/components/Controls/MenuBottomToolbar'
import commonService from '@/api/common/common'

export default {
  components: { MenuBottomToolbar },
  data() {
    return {
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
      Service.GetRotationList({ currenrpage: 1, pagesize: 15, filters: '' }).then(res => {
        if (res.Issuccess) {
          this.tableData = res.Data.data
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
