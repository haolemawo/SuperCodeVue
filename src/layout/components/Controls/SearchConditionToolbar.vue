// 搜索条件工具栏
<template>
  <div v-show="IsShowSearch" v-if="searchsetting && searchsetting.fields.length > 0" class="SearchConditionToolbarCon">
    <div :id="searchsetting.searchConditionId" class="search-fieldSet">
      <div v-for="(item,index) in searchsetting.fields" :key="item.fldName" class="search-field">
        <el-input
          v-if="item.fldType == 'S'"
          v-model="item.ModelValue"
          :label="item.fldDesc"
          :size="inputcontrolSize"
          :placeholder="item.placeHolder"
          :name="item.fldName"
          clearable
          :style="{width:item.fldWidth}"
          @input="onChange(index, item, $event)"
          @clear="onClearValue"
        />
        <el-select
          v-if="item.fldType == 'LC'"
          v-model="item.ModelValue"
          clearable
          :style="{width:item.fldWidth}"
          :size="inputcontrolSize"
          :placeholder="item.placeHolder"
          @change="onChange(index, item, $event)"
          @clear="onClearValue"
        >
          <el-option
            v-for="i in item.dataSource"
            :key="i.value"
            :label="i.text"
            :value="i.value"
          />
        </el-select>
      </div>
    </div>
    <el-button v-show="isSearchButtonDisabled" class="searchBtn" type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
  </div>
</template>

<script>
const Base64 = require('js-base64').Base64
export default {
  name: 'SearchConditionToolbar',
  props: {
    searchsetting: { // 参数
      type: Object,
      default: null
    }
  },
  data() {
    return {
      inputcontrolSize: 'mini',
      defaultInputWidth: '150px', // input 默认宽度
      IsShowSearch: true, // 是否显示搜索框， 如果没有搜索字段，默认为false
      isSearchButtonDisabled: true, // 是否显示搜索按钮
      filterConditionArr: [], // 用于返回搜索条件的字符串
    }
  },
  // watch: {
  //   filterConditionArr: { // 用于返回base64加密后的搜索条件字符串(建议使用)
  //     handler: function(val, oldval) {
  //       let result = ''
  //       if (this.filterConditionArr.length > 0) {
  //         const params = JSON.stringify(this.filterConditionArr)
  //         result = Base64.encode(params)
  //       }
  //       this.filterCondition = result
  //     },
  //     deep: true// 对象内部的属性监听，也叫深度监听
  //   }
  // },
  created() {
    if (this.searchsetting && this.searchsetting.fields.length > 0) {
      this.searchsetting.fields.map(field => {
        if (!field.fldWidth) { field.fldWidth = this.defaultInputWidth }
        field.ModelValue = null
      })
    } else {
      this.IsShowSearch = false
    }
  },
  methods: {
    onChange(index, item, e) {
      var newValue = e
      this.searchsetting.fields[index].ModelValue = newValue
      this.$forceUpdate() // 强制刷新
      this.setFilterConditionArr(item)
    },
    // 点击清空图标时触发
    onClearValue() {
      // console.log('123')
    },
    // 设置搜索条件的字符串
    setFilterConditionArr(field) {
      let isHave = false
      this.filterConditionArr.map((item, i) => {
        if (item[0] === field.fldName) {
          isHave = true
          item[2] = field.ModelValue
        }
      })
      if (!isHave) {
        let compareOperator = '' // 关系符
        switch (field.fldType) {
          case 'I':
          case 'FM':
          case 'FQ':
          case 'L':
          case 'LC':
          case 'L3':
            // 单选、数值、下拉框
            compareOperator = '='
            break
          case 'ML':
          case 'MLC':
          case 'ML3':
            // 多选
            compareOperator = 'in'
            break
          default:
            // like
            compareOperator = 'contains'
            break
        }
        this.filterConditionArr.push([field.fldName, compareOperator, field.ModelValue])
      }
    },
    // 用于返回搜索条件字符串(不建议使用)
    getFilterExpressions() {
      let filterStr = ''
      this.filterConditionArr.map(item => {
        if (item.length > 1) {
          if (filterStr === '') {
            filterStr += item[0] + ' like \'%' + item[2] + '%\''
          } else {
            filterStr += ' AND ' + item[0] + ' like \'%' + item[2] + '%\''
          }
        }
      })
      return filterStr
    },
    // 用于返回base64加密后的搜索条件字符串(建议使用)
    getFilterCondition() {
      let result = ''
      if (this.filterConditionArr.length > 0) {
        this.filterConditionArr.map(item => {
          if (item.length > 1) {
            if (!item[2]) {
              this.filterConditionArr.splice(this.filterConditionArr.indexOf(item), 1)
            }
          }
        })
      }
      if (this.filterConditionArr.length > 0) {
        const params = JSON.stringify(this.filterConditionArr)
        result = Base64.encode(params)
      }
      return result
    },
    // 搜索事件
    search() {
      this.$bus.emit('cllFun', 'search')
    }
  }
}
</script>

<style lang="scss" scoped>
    .SearchConditionToolbarCon{
        float: left;
        background-color: #fff;
        display: inline-flex;
    }
    .SearchConditionToolbarCon .searchBtn{
      margin-left: 5px;
    }
    .el-input__inner{
      padding-left: 10px;
    }
    .el-input__suffix{
      width: 20px !important;
    }
    .search-fieldSet{
          display: inline-flex;
    }
    .search-field{
          padding-right: 10px;
    }
</style>
