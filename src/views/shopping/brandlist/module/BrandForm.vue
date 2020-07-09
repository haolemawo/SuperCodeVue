// 商品分类新增、编辑表单
<template>
  <div>
    <el-dialog
      v-if="params.isvisible"
      title="新增/编辑商品分类"
      width="60%"
      custom-class="BrandForm-dialog"
      node-key="id"
      top="58px"
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
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="品牌分类" prop="BRANDTYPEID">
              <el-select
                v-model="entity.BRANDTYPEID"
                filterable
                remote
                reserve-keyword
                placeholder="请选择品牌分类"
                class="fullWidth"
                :remote-method="GetBrandSortList"
                :loading="SelectLoading"
              >
                <el-option
                  v-for="item in BrandSortSelectData"
                  :key="item.BRANDTYPEID"
                  :label="item.BRANDTYPENAME"
                  :value="item.BRANDTYPEID"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌名称" prop="BRANDNAME">
              <el-input v-model="entity.BRANDNAME" class="fullWidth" placeholder="品牌名称" />
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="品牌网址" prop="BRANDWEBSITE">
              <el-input v-model="entity.BRANDWEBSITE" class="fullWidth" placeholder="品牌网址www.xxxx.com">
                <template slot="prepend">Http://</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-select v-model="entity.ISENABLE" class="fullWidth" placeholder="是否启用">
                <el-option label="启用" value="Y" />
                <el-option label="停用" value="N" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="是否热门">
              <el-select v-model="entity.ISHOT" class="fullWidth" placeholder="是否热门">
                <el-option label="是" value="Y" />
                <el-option label="否" value="N" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否推荐">
              <el-select v-model="entity.ISRECOMMEND" class="fullWidth" placeholder="是否推荐">
                <el-option label="是" value="Y" />
                <el-option label="否" value="N" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="品牌Logo" class="upload-mallicon-form" prop="BRANDLOGO">
              <el-upload
                class="avatar-uploader"
                accept="image/*"
                :action="GetUploadServer()"
                :headers="UpLoadHeaders"
                :data="UpLoadData"
                :show-file-list="false"
                :on-success="handleLogoSuccess"
                :before-upload="beforeLogoUpload"
              >
                <img v-if="entity.BRANDLOGO" :src="entity.BRANDLOGO" class="avatar" style="width:100px;">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="entity.REMARK" class="fullWidth" type="text" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="SEO标题">
            <el-input v-model="entity.SEOTITLE" class="fullWidth" placeholder="SEO标题,一般不超过80个字符" />
          </el-form-item>
          <el-form-item label="SEO关键词">
            <el-input v-model="entity.SEOKEYWORD" class="fullWidth" placeholder="SEO关键词,一般不超过100个字符，多个关键字以半圆角逗号 [ , ] 隔开" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="SEO描述">
            <el-input v-model="entity.SEODESCRIBE" class="fullWidth" type="textarea" placeholder="SEO描述,一般不超过200个字符" />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="params.type !== 'View'" type="primary" :loading="SaveDataLoading" @click="save('entity')">保存</el-button>
        <el-button @click="params.isvisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UploadService from '@/api/common/common.js'
import { getToken } from '@/utils/auth'
import service from '@/api/shopping/BrandServer'
import modalMixin from './modalMixin'
export default {
  name: 'BrandForm',
  mixins: [modalMixin],
  data() {
    return {
      UpLoadHeaders: { Authorization: 'Bearer ' + getToken() },
      UpLoadData: { fileFolder: 'MallPhoto' },
      SelectLoading: false,
      FormDataLoading: false,
      SaveDataLoading: false,
      BrandSortSelectData: []
    }
  },
  created() {
    this.GetBrandSortList('')
    if (this.params.type === 'Edit' || this.params.type === 'View') {
      this.InitData()
    }
  },
  methods: {
    InitData() {
      this.FormDataLoading = true
      service.GetBrandDetail({ id: this.params.keyid }).then(response => {
        if (response.Issuccess) {
          this.entity = response.Data
        }
        this.FormDataLoading = false
      })
    },
    // 初始化分类下拉框的值
    GetBrandSortList(query) {
      this.SelectLoading = true
      service.GetBrandTypeList({ currenrpage: 1, pagesize: 20 }).then(response => {
        if (response.Issuccess) {
          this.BrandSortSelectData = response.Data.data
        }
        this.SelectLoading = false
      })
    },
    GetUploadServer() {
      return UploadService.HttpUploadFile
    },
    handleLogoSuccess(response, file, fileList) {
      if (response.Issuccess) {
        this.entity.BRANDLOGO = response.Data[0].Url
      }
    },
    beforeLogoUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
      const form = new FormData()
      form.append('file', file)
      form.append('fileFolder', 'MallPhoto')
      this.UpLoadData.fileUid = file.uid
      return isLt2M
    },
    save() {
      // 保存
      this.$refs.entityForm.validate((valid) => {
        if (valid) {
          service.SaveBrand({ formData: this.entity }).then(response => {
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
/deep/.el-input-group__prepend{
    padding: 0px 10px;
}
.el-dialog__body{
    height: 480px;
    overflow: auto;
}
.el-input{
    width: 250px;
}
.fullWidth{
    width: 100%;
}
</style>
