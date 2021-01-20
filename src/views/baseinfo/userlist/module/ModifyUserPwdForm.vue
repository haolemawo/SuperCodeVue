// 修改密码
<template>
  <div>
    <el-dialog
      v-if="formparams.isvisible"
      title="修改密码"
      :visible.sync="formparams.isvisible"
      :close-on-click-modal="false"
      width="400px"
    >
      <el-form
        ref="formEntity"
        :model="entity"
        :inline="true"
        :rules="rules"
        label-width="110px"
      >
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input v-model="entity.oldPwd" placeholder="请输入旧密码" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="entity.newPwd" placeholder="请输入新密码" show-password />
        </el-form-item>
        <el-form-item label="再次输入" prop="againNewPwd">
          <el-input v-model="entity.againNewPwd" placeholder="请再次输入新密码" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="saveLoading" @click="saveData">保存</el-button>
        <el-button @click="formparams.isvisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UserService from '@/api/baseinfo/userinfo'
export default {
  name: 'ModifyUserPwdForm',
  props: {
    formparams: { // 参数
      type: Object,
      required: true
    }
  },
  data() {
    const validateOldPwd = (rule, value, callback) => {
      if (value.length < 0) {
        callback(new Error('请输入旧密码'))
      } else {
        callback()
      }
    }
    const validateNewPwd = (rule, value, callback) => {
      if (value.length < 0) {
        callback(new Error('请输入新密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位数字'))
      } else if (value !== this.entity.newPwd && this.entity.newPwd.length > 0) {
        callback(new Error('您俩次输入的密码不一致'))
      } else {
        callback()
      }
    }
    const validateAgainNewPwd = (rule, value, callback) => {
      if (value.length < 0) {
        callback(new Error('请输入新密码'))
      } else if (value !== this.entity.newPwd) {
        callback(new Error('您俩次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      entity: {
        oldPwd: null,
        newPwd: null,
        againNewPwd: null
      },
      saveLoading: false,
      rules: {
        oldPwd: [
          { required: true, trigger: 'blur', validator: validateOldPwd }
        ],
        newPwd: [
          { required: true, trigger: 'blur', validator: validateNewPwd }
        ],
        againNewPwd: [
          { required: true, trigger: 'blur', validator: validateAgainNewPwd }
        ]
      }
    }
  },
  methods: {
    // 提交上传
    saveData() {
      if (this.entity.newPwd !== this.entity.againNewPwd) {
        this.$message.warning('您俩次输入的密码不一致，请重新输入!')
        this.entity.newPwd = ''
        this.entity.againNewPwd = ''
        return
      }
      this.$refs.formEntity.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const param = {
            oldPwd: this.entity.oldPwd,
            newPwd: this.entity.againNewPwd
          }
          UserService.modifyUserPwd(param).then(res => {
            if (res.Issuccess) {
              this.formparams.isvisible = false
              this.$message({
                message: '操作成功!',
                type: 'success'
              })
            } else {
              this.$message.error(res.DataMsg)
            }
            this.saveLoading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-demo{
  height: 100px;
}
</style>
