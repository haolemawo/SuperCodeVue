// 网站基础设置
<template>
  <div class="components-container">
    <el-tabs type="border-card">
      <el-tab-pane label="基础配置">
        <el-form ref="BaseForm" v-loading="BaseFormLoading" :model="BaseForm" label-width="100px">
          <el-form-item label="网站名称">
            <el-input v-model="BaseForm.WERSITENAME" placeholder="请输入网站名称" />
          </el-form-item>
          <el-form-item label="系统Logo">
            <template slot="label">
              系统Logo
              <el-tooltip effect="dark" placement="top">
                <div slot="content">推荐尺寸：210px*50px;透明背景</div>
                <i class="el-icon-info" />
              </el-tooltip>
            </template>
            <el-upload
              class="avatar-uploader"
              :action="GetUploadServer()"
              :headers="UpLoadHeaders"
              :data="UpLoadData"
              :show-file-list="false"
              :on-success="uploadWebLogoSuccess"
              :before-upload="beforeWebLogoUpload"
            >
              <img v-if="BaseForm.WEBSITELOGO" :src="BaseForm.WEBSITELOGO" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item label="SEO标题">
            <el-input v-model="BaseForm.SEOTITLE" class="inputFullWidth" placeholder="SEO标题,一般不超过80个字符" />
          </el-form-item>
          <el-form-item label="SEO关键词">
            <el-input v-model="BaseForm.SEOKEYWORD" class="inputFullWidth" placeholder="SEO关键词,一般不超过100个字符，多个关键字以半圆角逗号 [ , ] 隔开" />
          </el-form-item>
          <el-form-item label="SEO描述">
            <el-input v-model="BaseForm.SEODESCRIBE" class="inputFullWidth" type="textarea" placeholder="SEO描述,一般不超过200个字符" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="SaveBaseFormLoading" @click="SaveBaseForm">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- <el-tab-pane label="Logo设置">
        <MenuBottomToolbar menuclass="WEB_WEBBASESET" />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
// import MenuBottomToolbar from '@/layout/components/Controls/MenuBottomToolbar'
import service from '@/api/WebSite/BaseSeting'
import UploadService from '@/api/common/common.js'
import { getToken } from '@/utils/auth'
export default {
  // components: { MenuBottomToolbar },
  data() {
    return {
      UpLoadHeaders: { Authorization: 'Bearer ' + getToken() },
      UpLoadData: { fileFolder: 'WebSite' },
      CompanyID: 1,
      BaseFormLoading: false,
      SaveBaseFormLoading: false,
      BaseForm: {
        WEBBASESETINGID: null,
        COMPANYID: 1,
        WERSITENAME: null,
        WEBSITELOGO: null,
        WEBSITEICO: null,
        SEOTITLE: null,
        SEOKEYWORD: null,
        SEODESCRIBE: null
      }
    }
  },
  created() {
    this.$bus.on('cllFun', this.cllFun)
    this.InitWebBaseSeting()
  },
  beforeDestroy() {
    this.$bus.off('cllFun', this.cllFun)
  },
  methods: {
    cllFun(methodName) {
      this[methodName].apply(this)
    },
    GetUploadServer() {
      return UploadService.HttpUploadFile
    },
    // 上传图片前相关
    beforeWebLogoUpload(file) {
      new Promise(function(resolve, reject) {
        const _URL = window.URL || window.webkitURL
        const img = new Image()
        img.onload = function() {
          file.Width = img.width
          file.Height = img.height
        }
        img.src = _URL.createObjectURL(file)
        resolve()
      }).then(() => {
        return file
      })
      this.UpLoadData.fileUid = file.uid
    },
    // 上传成功回掉
    uploadWebLogoSuccess(response, file, fileList) {
      if (response.Issuccess) {
        this.BaseForm.WEBSITELOGO = response.Data[0].Url
      }
    },
    InitWebBaseSeting() {
      this.BaseFormLoading = true
      service.GetWebBaseSetingEntity({ companyid: this.CompanyID }).then(res => {
        if (res.Issuccess) {
          if (res.Data) {
            this.BaseForm = res.Data
          }
        }
        this.BaseFormLoading = false
      })
    },
    SaveBaseForm() {
      this.SaveBaseFormLoading = true
      service.SaveWebBaseSeting({ entity: this.BaseForm }).then(res => {
        if (res.Issuccess) {
          this.$message({
            message: '操作成功!',
            type: 'success'
          })
          this.InitWebBaseSeting()
        } else {
          this.$message({ message: res.DataMsg })
        }
        this.SaveBaseFormLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 210px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .avatar {
    width: 210px;
    height: 50px;
    display: block;
  }
</style>
