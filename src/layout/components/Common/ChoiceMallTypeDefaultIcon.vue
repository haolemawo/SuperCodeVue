// 商城，选择分类图标
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
            <div v-for="(item, index) in SysDefaultImage" :key="index" class="image-item">
              <el-image
                style="width: 50px; height: 50px"
                :src="item.FileUrl"
                fit="contain"
              />
              <el-radio v-if="ChoiceType==='Radio'" v-model="RadioValue" :label="item.FileUrl">{{ item.FileName }}</el-radio>
              <el-checkbox v-else-if="ChoiceType==='Multiple'" v-model="item.isChecked">{{ item.FileName }}</el-checkbox>
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
import commonService from '@/api/common/common'
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
      ChoiceData: [] // 存放选择的图片信息
    }
  },
  created() {
    if (this.params.ChoiceType) {
      this.ChoiceType = this.params.ChoiceType
    }
    this.InitChoiceDataLoading = true
    commonService.GetMallTypeDefaultImageList({}).then(response => {
      if (response.Issuccess) {
        response.Data.forEach(item => {
          item.isChecked = false
          this.SysDefaultImage.push(item)
        })
      }
      this.InitChoiceDataLoading = false
    })
  },
  methods: {
    ChoiceSave() {
      this.ChoiceData = []
      if (this.ChoiceType === 'Multiple') { // 多选
        this.SysDefaultImage.forEach(item => {
          if (item.isChecked) { this.ChoiceData.push(item.FileUrl) }
        })
      }
      if (this.ChoiceType === 'Radio') { // 单选
        if (this.RadioValue !== '') {
          this.ChoiceData.push(this.RadioValue)
        }
      }
      if (this.ChoiceData.length > 0) {
        this.params.isvisible = false
        this.$emit(this.params.AcceptMethod, this.ChoiceData)
      } else {
        this.$message({
          showClose: true,
          message: '请先选择图片',
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
/deep/ .el-image{
    margin: auto;
}
.image-item{
    display: inline-grid;
    margin: 12px;
    text-align: center
}
.image-item span{
    margin-top: 5px;
}
</style>
