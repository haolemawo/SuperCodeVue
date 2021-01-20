<template>
  <div>
    <el-card class="dictionary-tree-card">
      <div slot="header" class="clearfix">
        <span>字典分类</span>
        <el-button v-show="isAdmin" style="float: right; padding: 3px 0" type="text" @click="AddDictionaryType">新增分类</el-button>
      </div>
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />
      <el-tree
        ref="DictionaryTypeTree"
        class="filter-tree"
        :data="DictionaryType"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        highlight-current
        lazy
        :load="GetDictionaryType"
        :filter-node-method="filterNode"
        @node-click="handleCheckChange"
      />
    </el-card>
    <el-card class="dictionary-detail-card">
      <div slot="header" class="clearfix">
        <span>字典明细</span>
        <div style="float: right; ">
          <el-button v-show="isAdmin" style="padding: 3px 0" type="text" @click="AddDictionaryDetail">新增字典</el-button>
          <el-button v-show="isAdmin" style="padding: 3px 0" type="text" @click="EditDictionaryDetail">编辑字典</el-button>
          <!-- <el-button v-show="isAdmin" style="padding: 3px 0" size="mini" type="text" @click="DeleteDictionaryDetail">删除字典</el-button> -->
        </div>
      </div>
      <el-table
        v-loading="detailloading"
        :data="DictionaryDetailData"
        border
        highlight-current-row
        style="width: 100%"
        current-row-key="DICTIONARYDETAILID"
        @row-click="RowSelect"
      >
        <el-table-column
          prop="SEQNO"
          label="序号"
          width="60"
        />
        <el-table-column
          prop="DETAILCODE"
          label="字典编码"
          width="160"
        />
        <el-table-column
          prop="DETAILTITLECN"
          label="字典名称"
          width="180"
        />
        <el-table-column
          prop="ISSYSTEMCN"
          label="是否系统内置"
          width="110"
        />
        <el-table-column
          prop="SYSTEMCODE"
          label="系统编码"
        />
      </el-table>
    </el-card>
    <!-- 字段分类表单 Start -->
    <DictionaryTypeForm v-if="formparams.isvisible" ref="TypeFormEdit" :formparams="formparams" />
    <!-- 字段分类表单 END -->
    <!-- 字典明细分类表单 Start -->
    <DictionaryDetailForm v-if="detailformparams.isvisible" ref="DetailFormEdit" :detailformparams="detailformparams" />
    <!-- 字典明细分类表单 END -->
  </div>
</template>

<script>
import dictionary from '@/api/system/dictionary'
import DictionaryTypeForm from './module/DictionaryTypeForm'
import DictionaryDetailForm from './module/DictionaryDetailForm'
import { getCookiesUserInfo } from '@/utils/auth'

export default {
  components: { DictionaryTypeForm, DictionaryDetailForm },
  data() {
    return {
      isAdmin: false,
      filterText: '',
      DictionaryType: [{
        id: 0,
        code: 'error',
        label: '字典分类',
        children: [{}]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      DictionaryDetailData: [],
      formparams: {
        isvisible: false,
        type: 'AddTypeForm'
      },
      detailformparams: {
        isvisible: false,
        type: 'DetailFormEdit'
      },
      // 详细当前选择行ID
      currentRowId: null,
      detailloading: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.DictionaryTypeTree.filter(val)
    }
  },
  created() {
    var UserInfo = getCookiesUserInfo()
    if (UserInfo.Userid === 1) {
      this.isAdmin = true
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    GetDictionaryType(node, resolve) {
      // 获取字典分类
      if (node.level === 0) {
        return resolve([{ id: '0', label: '数据字典' }])
      }
      if (node.level > 1) return resolve([])
      dictionary.GetDictionaryType({ sqlwhere: '1=1' }).then(res => {
        if (res.Issuccess) {
          const arr = []
          res.Data.forEach(element => {
            arr.push({ id: element.DICTIONARYID, code: element.DICTIONARYCODE, label: element.DICTIONARYNAME })
          })
          this.$refs.DictionaryTypeTree.setCheckedNodes(arr)
          resolve(arr)
        }
      })
    },
    AddDictionaryType() {
      // 新增字典分类
      this.formparams = {
        isvisible: true,
        type: 'AddTypeForm'
      }
      this.$refs.TypeFormEdit.Init()
    },
    handleCheckChange(data, checked, indeterminate) {
      const node = this.$refs.DictionaryTypeTree.getCurrentNode()
      if (node) {
        this.GetDictionaryDetailList(node.code)
      }
    },
    RowSelect(row) {
      // 选择当前行
      this.currentRowId = row.DICTIONARYDETAILID
    },
    GetDictionaryDetailList(typecode) {
      // 获取字典明细
      this.detailloading = true
      dictionary.GetDictionaryDetailList({ typecode: typecode }).then(res => {
        if (res.Issuccess) {
          this.DictionaryDetailData = res.Data
        }
        this.detailloading = false
      })
    },
    AddDictionaryDetail() {
      // 新增字典明细
      const node = this.$refs.DictionaryTypeTree.getCurrentNode()
      if (node) {
        this.detailformparams.isvisible = false
        this.$nextTick(() => {
          this.detailformparams = {
            isvisible: true,
            typecode: node.code,
            typeid: node.id,
            type: 'AddDetailForm'
          }
        })
      } else {
        this.$message({
          showClose: true,
          message: '请先选择字典分类',
          type: 'warning'
        })
      }
    },
    EditDictionaryDetail() {
      if (!this.currentRowId) {
        this.$message({
          showClose: true,
          message: '请选择要编辑的数据行',
          type: 'warning'
        })
        return
      }
      const node = this.$refs.DictionaryTypeTree.getCurrentNode()
      this.detailformparams = {
        isvisible: true,
        typecode: node.code,
        typeid: node.id,
        keyid: this.currentRowId,
        type: 'EditDetailForm'
      }
    },
    RefreshDetailList() {
      this.GetDictionaryDetailList(this.detailformparams.typecode)
    }
  }

}

</script>

<style lang="scss" scoped>
 .dictionary-tree-card {
    width: 30%;
    min-height: 500px;
    margin-top: 10px;
        display: inline-block;
  }
  .el-card__header{
      padding-top:15px;
      padding-bottom: 15px;
  }
  .dictionary-detail-card {
    width: 65%;
    min-height: 500px;
    margin-top: 10px;
    margin-left: 10px;
    display: inline-block;
  }
</style>

