// 新增/编辑品牌分类
<template>
  <div>
    <el-dialog
      v-if="params.isvisible"
      title="新增/编辑品牌分类"
      width="600px"
      custom-class="SortForm-dialog"
      node-key="id"
      :lock-scroll="true"
      :visible.sync="params.isvisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form
        ref="entityForm"
        v-loading="FormDataLoading"
        :model="entity"
        :rules="rules"
        :disabled="params.type === 'View'"
        label-width="110px"
      >
        <el-form-item label="分类名称" prop="BRANDTYPENAME">
          <el-input v-model="entity.BRANDTYPENAME" type="text" placeholder="分类名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="entity.SEQNO" :min="1" label="排序" />
        </el-form-item>
        <el-form-item label="是否启用" prop="ISENABLE">
          <el-select v-model="entity.ISENABLE" placeholder="是否启用">
            <el-option label="启用" value="Y" />
            <el-option label="停用" value="N" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="entity.REMARK" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="params.type !== 'View'" type="primary" :loading="SaveDataLoading" @click="saveForm">保存</el-button>
        <el-button @click="params.isvisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import service from '@/api/shopping/BrandServer'
import modalMixin from './modalMixin'
export default {
  name: 'SortForm',
  mixins: [modalMixin],
  data() {
    return {
      FormDataLoading: false,
      SaveDataLoading: false
    }
  },
  created() {
    if (this.params.type === 'Edit' || this.params.type === 'View') {
      this.InitData()
    }
  },
  methods: {
    InitData() {
      this.FormDataLoading = true
      service.GetBrandTypeDetail({ id: this.params.keyid }).then(res => {
        if (res.Issuccess) {
          this.entity = res.Data
        }
        this.FormDataLoading = false
      })
    },
    saveForm() {
      // 保存
      this.$refs.entityForm.validate((valid) => {
        if (valid) {
          service.SaveBrandType({ formData: this.entity }).then(response => {
            if (response.Issuccess) {
              this.$message({
                message: '操作成功!',
                type: 'success'
              })
              this.params.isvisible = false
              this.$emit('RefreshList')
            } else {
              this.$message.error(response.DataMsg)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__body{
    height: 480px;
    overflow: auto;
}
</style>
