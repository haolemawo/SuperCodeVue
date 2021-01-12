<template>
  <div>
    <div class="Search-menubtn-toolbar">
      <SearchConditionToolbar ref="searchCondition" :searchsetting="searchSetting" />
      <MenuBottomToolbar menuclass="BASE_ROLEMANAGER" />
    </div>
    <el-table
      :data="tableData"
      stripe
      highlight-current-row
      border
      style="width: 100%"
      :fit="true"
      current-row-key="ROLEID"
      @row-click="RowSelect"
    >
      <el-table-column prop="UserID" label="用户ID" />
      <el-table-column prop="LoginIP" label="登录IP" />
      <el-table-column prop="LoginAddres" label="登录地址" />
      <el-table-column prop="LoginOs" label="操作系统" />
      <el-table-column prop="LoginTerminal" label="登录设备" />
      <el-table-column prop="LoginBrowser" label="登录时浏览器" />
      <el-table-column label="登录时间" width="150px">
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.LoginTime).format("YYYY-MM-DD HH:MM:SS") }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="container-page-element">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="dataCount"
        :page-size="pageSize"
        :current-page="currentPage"
        :hide-on-single-page="false"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import server from '@/api/monitoring/onlineuser'
import MenuBottomToolbar from '@/layout/components/Controls/MenuBottomToolbar'
import SearchConditionToolbar from '@/layout/components/Controls/SearchConditionToolbar'

export default {
  components: { MenuBottomToolbar, SearchConditionToolbar },
  data() {
    return {
      searchSetting: { // 搜索字段初始化
        searchConditionId: 'sysList3',
        fields: [{
          fldName: 'LoginTerminal', fldType: 'LC', fldDesc: '登录设备', placeHolder: '登录设备',
          dataSource: [{ text: 'H5端', value: 'H5' }, { text: 'PC端', value: 'PC' }, { text: '小程序端', value: 'Applet' }, { text: '微信小程序', value: 'WechatApplet' }]
        }]
      },
      dataCount: 10, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      onLineUserData: null,
      onLineUserDataBak: null,
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
      server.GetOnlineUserList({ }).then(response => {
        if (response.Issuccess) {
          const dataJson = response.Data
          const dataObj = JSON.parse(dataJson)
          that.onLineUserData = dataObj
          that.onLineUserDataBak = dataObj
          that.dataCount = dataObj.length
          that.BindPageData()
        }
      })
    },
    // 绑定页面数据
    BindPageData() {
      if (this.dataCount <= this.pageSize) {
        this.tableData = this.onLineUserData
      }
      const startIndex = (this.currentPage - 1) * this.pageSize
      this.tableData = this.onLineUserData.slice(startIndex, startIndex + this.pageSize)
    },
    RowSelect(row) {
      // 选择当前行
      this.currentRowId = row.ROLEID
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val
      this.BindPageData()
    },
    // 搜索事件
    search() {
      const filterArr = this.$refs.searchCondition.getfilterConditionArr()
      var resultData = null
      if (filterArr.length <= 0) {
        resultData = this.onLineUserDataBak
      } else {
        filterArr.forEach(filter => {
          if (filter[0] === 'LoginTerminal') {
            resultData = this.onLineUserDataBak.filter(item => item.LoginTerminal.indexOf(filter[2]) > -1)
          }
        })
      }
      this.onLineUserData = resultData
      this.currentPage = 1
      this.dataCount = this.onLineUserData.length
      this.BindPageData()
    },
    RefreshList() {
      // 刷新列表

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
