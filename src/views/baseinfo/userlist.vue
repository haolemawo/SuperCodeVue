<template>
  <div>
    <div class="Search-menubtn-toolbar">
      <SearchConditionToolbar ref="searchCondition" :searchsetting="searchSetting" />
      <MenuBottomToolbar menuclass="BASE_USERINFOLIST" />
    </div>
    <el-table
      v-loading="UserTableDataLoading"
      :data="UserTableData.data"
      stripe
      highlight-current-row
      border
      style="width: 100%"
      current-row-key="USERID"
      @row-click="RowSelect"
    >
      <el-table-column
        fixed
        prop="USERNAME"
        label="用户姓名"
        align="center"
        width="200px"
      />
      <el-table-column
        prop="USERACCOUNT"
        label="登录账号"
        align="center"
        width="200px"
      />
      <el-table-column
        prop="UserSexCN"
        label="性别"
        align="center"
        width="60px"
      />
      <el-table-column
        prop="REMARK"
        label="角色"
        align="center"
        width="80px"
      />
      <el-table-column
        prop="USERTEL"
        label="手机号"
        align="center"
        width="160px"
      />
      <el-table-column
        prop="USERQQ"
        label="QQ"
        align="center"
        width="150px"
      />
      <el-table-column
        label="上次登录时间"
        align="center"
        width="180px"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ $moment(scope.row.CREATEDATE).format("YYYY-MM-DD") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="注册时间"
        width="180px"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ $moment(scope.row.CREATEDATE).format("YYYY-MM-DD") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="USERREGISTERSOURCECN"
        align="center"
        label="注册形式"
        width="120"
      />
    </el-table>
    <div class="container-page-element">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="UserTableData.dataCount"
        :page-count="UserTableData.pageCount"
        :hide-on-single-page="false"
      />
    </div>
    <!-- 导入用户表单 -->
    <UserImport-Form v-if="importformParams.isvisible" ref="roleEdit" :formparams="importformParams" />
    <!-- 新增、编辑表单 -->
    <Userinfo-Form v-if="formparams.isvisible" ref="UserinfoForm" @RefreshList="RefreshList" :formparams="formparams" />
  </div>
</template>

<script>
import MenuBottomToolbar from '@/layout/components/Controls/MenuBottomToolbar'
import SearchConditionToolbar from '@/layout/components/Controls/SearchConditionToolbar'
import UserImportForm from './userimportform'
import UserinfoForm from './UserinfoForm'
import userinfoService from '@/api/baseinfo/userinfo'

export default {
  components: { MenuBottomToolbar, SearchConditionToolbar, 'UserImport-Form': UserImportForm,
    'Userinfo-Form': UserinfoForm },
  data() {
    return {
      searchSetting: { // 搜索字段初始化
        searchConditionId: 'sysList3',
        fields: [{
          fldName: 'UserName', fldType: 'S', fldDesc: '用户姓名', placeHolder: '用户姓名'
        }, {
          fldName: 'UserAccount', fldType: 'S', fldDesc: '登录账号', placeHolder: '登录账号'
        }, {
          fldName: 'UserSex', fldType: 'LC', fldDesc: '性别', placeHolder: '性别', fldWidth: '80px',
          dataSource: [{ 'value': '0', 'text': '男' }, { 'value': '1', 'text': '女' }]
        }]
      },
      UserTableDataLoading: false,
      dataCount: 10, // 总条数
      pageCount: 10, // 总页数
      currentPage: 1, // 当前页
      pageSize: 15, // 每页大小
      UserTableData: {
        data: [],
        dataCount: 0,
        pageCount: 1,
        currentPage: 1,
        pageSize: 15
      },
      // 当前选择行
      currentRowId: null,
      importformParams: { // 导入参数
        isvisible: false
      },
      formparams: { // 新增编辑
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
      userinfoService.GetUserTable({ currenrpage: 1, pagesize: 15, filters: '' }).then(response => {
        if (response.Issuccess) {
          this.UserTableData = response.Data
        }
      })
    },
    RowSelect(row) {
      // 选择当前行
      this.currentRowId = row.USERID
    },
    // 搜索事件
    search() {
      const filter = this.$refs.searchCondition.getFilterCondition()
      if (filter) {
        this.UserTableDataLoading = true
        userinfoService.GetUserTable({ currenrpage: 1, pagesize: 15, filters: filter }).then(response => {
          if (response.Issuccess) {
            this.UserTableData = response.Data
          }
          this.UserTableDataLoading = false
        })
      } else {
        this.InitData()
      }
    },
    // 新增
    AddUser() {
      this.formparams.isvisible = false
      this.$nextTick(() => {
        this.formparams = {
          isvisible: true,
          type: 'Add'
        }
      })
    },
    EditUser() {
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
    DeleteUser() {
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

      }).catch(_ => {})
    },
    // 导入用户
    ImportUser() {
      this.importformParams.isvisible = false
      this.$nextTick(() => {
        this.importformParams = {
          isvisible: true,
          type: 'Import'
        }
      })
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
