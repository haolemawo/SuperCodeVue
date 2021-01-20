// 系统菜单，选择分类图标
<template>
  <div>
    <el-dialog
      v-if="params.isvisible"
      title="选择图标"
      width="65%"
      custom-class="ChoiceMallTypeDefaultIcon-dialog"
      top="58px"
      :lock-scroll="true"
      :visible.sync="params.isvisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-tabs v-loading="InitChoiceDataLoading" type="border-card">
        <el-tab-pane label="系统内置">
          <div class="imageList">
            <div v-for="(item, index) in SysDefaultImage" :key="index" class="image-item" :class="{ 'hasChoice': ChoiceData.name===item.value }">
              <i class="iconfont" :class="`icon-${item.value}`" @click="choiceIcon(item.value)" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自定义">
          功能开发中,暂未实现
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="ChoiceDataLoading" @click="ChoiceSave">选择</el-button>
        <el-button @click="params.isvisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ChoiceMallTypeDefaultIcon',
  props: {
    params: { // 当前列表需要的按钮分类
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ChoiceType: 'Radio', // 选择类型， 默认单选[Radio]; 多选[Multiple]
      InitChoiceDataLoading: false,
      SysDefaultImage: [],
      ChoiceDataLoading: false,
      RadioValue: '',
      ChoiceData: { } // 存放选择的图片信息
    }
  },
  created() {
    if (this.params.ChoiceType) {
      this.ChoiceType = this.params.ChoiceType
    }
    this.getLocalTTF()
  },
  methods: {
    // 解析本地 ttf 文件
    getLocalTTF() {
      const result = require('../../../assets/iconfont/iconfont.json')
      result.glyphs.forEach(glyphs => {
        this.SysDefaultImage.push({
          name: glyphs.font_class,
          value: glyphs.font_class
        })
      })
    },
    choiceIcon(val) {
      this.ChoiceData = {
        val: 'icon-' + val,
        name: val
      }
    },
    ChoiceSave() {
      if (this.ChoiceData.val) {
        this.params.isvisible = false
        this.$emit(this.params.AcceptMethod, this.ChoiceData)
      } else {
        this.$message({
          showClose: true,
          message: '请先选择图标',
          type: 'warning'
        })
        return
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body{
    padding: 0px !important;
}
/deep/ .el-radio__label{
    margin-top: 5px;
    padding-left: 5px;
}
/deep/ .el-checkbox__label{
    padding-left: 5px;
    margin-top: 5px;
}
.image-item{
    display: inline-grid;
    margin: 12px;
    text-align: center
}
.hasChoice{
  color: #1890ff;
  transform:scale(1.2);
}
.image-item:hover{
    color: #1890ff;
    transform:scale(1.2);
    cursor: pointer;
}
.image-item .iconfont{
    margin: 2px;
    font-size: 18px;
}
</style>
