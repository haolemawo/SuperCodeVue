<template>
  <div>
    <el-dialog
      v-if="detailformparams.isvisible"
      title="新增/编辑字典明细"
      :visible.sync="detailformparams.isvisible"
      :close-on-click-modal="false"
      width="700px"
    >
      <el-form
        ref="entity"
        :model="entity"
        size="small"
        :inline="true"
        :rules="rules"
        label-width="110px"
      >
        <el-form-item label="字典分类编码" prop="DICTIONARYCODE">
          <el-input v-model="entity.DICTIONARYCODE" :disabled="true" />
        </el-form-item>
        <el-form-item label="字典明细编码" prop="DETAILCODE">
          <el-input v-model="entity.DETAILCODE" :disabled="detailformparams.type === 'EditDetailForm' ? true : false" placeholder="字典明细编码" />
        </el-form-item>
        <el-form-item label="字典明细名称" prop="DETAILTITLECN">
          <el-input v-model="entity.DETAILTITLECN" placeholder="字典明细名称" />
        </el-form-item>
        <el-form-item label="是否为默认值">
          <el-select v-model="entity.ISDEFAULT" filterable placeholder="是否为默认值">
            <el-option label="是" value="Y" />
            <el-option label="否" value="N" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否系统内置">
          <el-select v-model="entity.ISSYSTEM" filterable placeholder="是否系统内置">
            <el-option label="是" value="Y" />
            <el-option label="否" value="N" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="entity.SEQNO" type="number" placeholder="排序" />
        </el-form-item>
        <el-form-item label="系统编码">
          <el-input v-model="entity.SYSTEMCODE" :disabled="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save('entity')">保存</el-button>
        <el-button @click="detailformparams.isvisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dictionary from '@/api/system/dictionary'
export default {
  name: 'DictionaryTypeForm',
  props: {
    detailformparams: { // 这个就是父组件中子标签自定义名字
      type: Object,
      required: true
    }
  },
  data() {
    return {
      entity: {
        DICTIONARYDETAILID: 0,
        DICTIONARYID: 0,
        DICTIONARYCODE: null,
        DETAILCODE: null,
        DETAILTITLECN: null,
        ISDEFAULT: 'N',
        ISSYSTEM: 'Y',
        SEQNO: null,
        SYSTEMCODE: 'SHOPMALL'
      },
      rules: {
        DICTIONARYCODE: [
          { required: true, message: '请输入字典编码', trigger: 'change' }
        ],
        DETAILCODE: [
          { required: true, message: '请输入字典明细编码', trigger: 'change' }
        ],
        DETAILTITLECN: [
          { required: true, message: '请输入字典名称', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.$set(this.entity, 'DICTIONARYID', this.detailformparams.typeid)
    this.$set(this.entity, 'DICTIONARYCODE', this.detailformparams.typecode)
    if (this.detailformparams.type === 'EditDetailForm') {
      this.InitForm()
    }
  },
  methods: {
    InitForm() {
      dictionary.GetDictionaryDetailModel({ keyid: this.detailformparams.keyid }).then(res => {
        if (res.Issuccess) {
          this.entity = res.Data
        } else {
          this.$message.error(res.DataMsg)
        }
      })
    },
    save(formEntity) {
      // 保存字典分类
      this.$refs[formEntity].validate((valid) => {
        if (valid) {
          dictionary.AddDictionaryDetil({ entity: this.entity }).then(res => {
            if (res.Issuccess) {
              this.detailformparams.isvisible = false
              this.$message({
                message: '操作成功!',
                type: 'success'
              })
              this.$parent.RefreshDetailList()
            } else {
              this.$message.error(res.DataMsg)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
