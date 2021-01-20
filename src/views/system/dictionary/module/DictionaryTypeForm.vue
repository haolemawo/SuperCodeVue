<template>
  <div>
    <el-dialog
      title="新增/编辑字典分类"
      :visible.sync="formparams.isvisible"
      :close-on-click-modal="false"
      width="700px"
    >
      <el-form
        ref="entity"
        :model="entity"
        size="small"
        :inline="true"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="字典编码" prop="DICTIONARYCODE">
          <el-input v-model="entity.DICTIONARYCODE" />
        </el-form-item>
        <el-form-item label="字典名称" prop="DICTIONARYNAME">
          <el-input v-model="entity.DICTIONARYNAME" />
        </el-form-item>
        <el-form-item label="是否系统内置">
          <el-select v-model="entity.ISSYSTEM" filterable placeholder="是否系统内置">
            <el-option label="是" value="Y" />
            <el-option label="否" value="N" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否可以编辑">
          <el-select v-model="entity.ISUSEREDIT" filterable placeholder="是否可以编辑">
            <el-option label="是" value="Y" />
            <el-option label="否" value="N" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否可见">
          <el-select v-model="entity.ISVISIBLE" filterable placeholder="是否可见">
            <el-option label="是" value="Y" />
            <el-option label="否" value="N" />
          </el-select>
        </el-form-item>
        <el-form-item label="系统编码">
          <el-input v-model="entity.SYSTEMCODE" :disabled="true" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="entity.DICTIONARYDESC" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save('entity')">保存</el-button>
        <el-button @click="formparams.isvisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import role from '@/api/system/role'
import dictionary from '@/api/system/dictionary'
export default {
  name: 'DictionaryTypeForm',
  props: {
    formparams: { // 这个就是父组件中子标签自定义名字
      type: Object,
      required: true
    }
  },
  data() {
    return {
      entity: {
        DICTIONARYID: 0,
        DICTIONARYCODE: null,
        DICTIONARYNAME: null,
        ISSYSTEM: 'N',
        ISUSEREDIT: 'Y',
        ISVISIBLE: 'N',
        SYSTEMCODE: 'SHOPMALL',
        DICTIONARYDESC: null
      },
      rules: {
        DICTIONARYCODE: [
          { required: true, message: '请输入字典编码', trigger: 'change' }
        ],
        DICTIONARYNAME: [
          { required: true, message: '请输入字典名称', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    Init() {

    },
    InitForm() {
      role.GetRoleEntity({ key: this.formparams.key }).then(res => {
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
          dictionary.AddDictionaryType({ entity: this.entity }).then(res => {
            if (res.Issuccess) {
              this.formparams.isvisible = false
              this.$message({
                message: '操作成功!',
                type: 'success'
              })
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
