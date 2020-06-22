<template>
  <div>
    <el-dialog
      v-if="formparams.isvisible"
      title="新增/编辑角色"
      :visible.sync="formparams.isvisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="entity"
        size="small"
        label-width="80px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="entity.ROLENAME" />
        </el-form-item>
        <el-form-item label="角色等级">
          <el-select v-model="entity.ROLELEVEL" filterable placeholder="请选择角色等级">
            <el-option
              v-for="item in RoleLevelOptions"
              :key="item.Key"
              :label="item.Value"
              :value="item.Key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期">
          <!-- <el-col class="line" :span="1" style="text-align:center;">
            <el-tooltip class="item" effect="dark" content="123456" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </el-col> -->
          <el-col :span="10">
            <el-date-picker
              v-model="entity.STARTDATE"
              placeholder="开始日期"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
            />
          </el-col>
          <el-col class="line" :span="1" style="text-align:center;">-</el-col>
          <el-col :span="10">
            <el-date-picker
              v-model="entity.ENDDATE"
              placeholder="结束日期"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="entity.REMARK" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="formparams.isvisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import common from '@/api/common/common'
import role from '@/api/system/role'
export default {
  name: 'RoleeditForm',
  props: {
    formparams: { // 这个就是父组件中子标签自定义名字
      type: Object,
      required: true
    }
  },
  data() {
    return {
      RoleLevelOptions: [],
      entity: {
        ROLEID: 0,
        ROLENAME: null,
        ROLELEVEL: null,
        STARTDATE: null,
        ENDDATE: null,
        REMARK: null
      }
    }
  },
  created() {
    this.Init()
  },
  methods: {
    Init() {
      this.GetRoleLevel()
      if (this.formparams.type !== 'Add' && this.formparams.key) {
        this.entity.ROLEID = this.formparams.key
        this.InitForm()
      }
    },
    InitForm() {
      role.GetRoleEntity({ key: this.formparams.key }).then(res => {
        if (res.Issuccess) {
          this.entity = res.Data
          console.log(this.entity)
        } else {
          this.$message.error(res.DataMsg)
        }
      })
    },
    save() {
      // 保存角色
      role.SaveForm({ roleEntity: this.entity }).then(res => {
        if (res.Issuccess) {
          this.formparams.isvisible = false
          this.$parent.RefreshList()
        } else {
          this.$message.error(res.DataMsg)
        }
      })
    },
    GetRoleLevel() {
      // 获取角色等级下拉框
      common.GetPopSelect({ diccode: 'RoleLevel' }).then(res => {
        if (res.Issuccess) {
          this.RoleLevelOptions = res.Data
        }
      })
    }
  }
}
</script>
