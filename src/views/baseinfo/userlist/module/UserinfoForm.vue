// 导入用户表单
<template>
  <div>
    <el-dialog
      v-if="formparams.isvisible"
      title="导入用户"
      :visible.sync="formparams.isvisible"
      :close-on-click-modal="false"
      width="700px"
    >
      <el-form
        ref="entity"
        v-loading="formLoading"
        :model="entity"
        :inline="true"
        :rules="rules"
        label-width="110px"
      >
        <el-col :span="24">
          <el-form-item label="登录账号" prop="USERACCOUNT">
            <el-input v-model="entity.USERACCOUNT" placeholder="登录账号" />
          </el-form-item>
          <el-form-item label="姓名" prop="USERNAME">
            <el-input v-model="entity.USERNAME" placeholder="用户姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="密码" prop="USERPASSWORD">
            <el-input v-model="entity.USERPASSWORD" :disabled="formparams.type!=='Add'" placeholder="用户密码" show-password />
          </el-form-item>
          <el-form-item label="性别" prop="UserSex">
            <el-select v-model="entity.UserSex" placeholder="用户性别">
              <el-option label="男" value="0" />
              <el-option label="女" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="手机号">
            <el-input v-model="entity.USERTEL" placeholder="用户手机号" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="entity.USEREMAIL" placeholder="邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="QQ">
            <el-input v-model="entity.USERQQ" placeholder="QQ" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="entity.REMARK" type="textarea" />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="saveLoading" @click="save('entity')">保存</el-button>
        <el-button @click="formparams.isvisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import userinfoService from '@/api/baseinfo/userinfo'
export default {
  name: 'UserinfoForm',
  props: {
    formparams: { // 参数
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formLoading: false,
      saveLoading: false,
      entity: {
        USERID: 0,
        USERACCOUNT: null,
        USERPASSWORD: null,
        USERNAME: null,
        USERROLE: null,
        UserSex: '0',
        USERTEL: null,
        USEREMAIL: null,
        USERQQ: null,
        USERREGISTERSOURCE: 'ManualAdd',
        REMARK: null
      },
      rules: {
        USERACCOUNT: [
          { required: true, message: '请输入登录账号', trigger: 'change' }
        ],
        USERPASSWORD: [
          { required: true, message: '请输入用户密码', trigger: 'change' }
        ],
        USERNAME: [
          { required: true, message: '请输入用户姓名', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    if (this.formparams.type === 'Edit' || this.formparams.type === 'View') {
      this.InitData()
    }
  },
  methods: {
    InitData() {
      this.formLoading = true
      userinfoService.GetUserInfo({ userid: this.formparams.key }).then(res => {
        if (res.Issuccess) {
          this.entity = res.Data
        } else {
          this.$message.error(res.DataMsg)
        }
        this.formLoading = false
      })
    },
    save(formEntity) {
      // 保存字典分类
      this.$refs[formEntity].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          userinfoService.SaveUserInfo({ entity: this.entity }).then(res => {
            if (res.Issuccess) {
              this.formparams.isvisible = false
              this.$message({
                message: '操作成功!',
                type: 'success'
              })
              this.$emit('RefreshList')
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
.el-input--suffix .el-input__inner
{
        padding-right: 15px !important;
}
</style>
