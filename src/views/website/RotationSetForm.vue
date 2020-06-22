<template>
  <div>
    <el-dialog
      v-if="params.isvisible"
      title="新增/编辑轮播图"
      width="500px"
      :visible.sync="params.isvisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        v-loading="InitDataLoading"
        :model="entity"
        size="small"
        :rules="formrules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="ROTATIONTITLE">
          <el-input v-model="entity.ROTATIONTITLE" placeholder="轮播图名称" />
        </el-form-item>
        <el-form-item label="是否启用" prop="ISENABLED">
          <el-select v-model="entity.ISENABLED" placeholder="是否上架">
            <el-option label="是" value="Y" />
            <el-option label="否" value="N" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="entity.SEQ" placeholder="排序" controls-position="right" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="entity.REMARK" type="textarea" placeholder="备注" />
        </el-form-item>
        <el-form-item label="轮播图片">
          <el-upload
            :action="GetUploadServer()"
            :headers="UpLoadHeaders"
            :data="UpLoadData"
            list-type="picture"
            :limit="1"
            :file-list="RotatioinFileList"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :on-success="uploadAppSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="SaveDataLoading" @click="save">保存</el-button>
        <el-button @click="params.isvisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UploadService from '@/api/common/common.js'
import { getToken } from '@/utils/auth'
import Service from '@/api/WebSite/RotatioinSet'
export default {
  name: 'RotationSetForm',
  props: {
    params: { // 这个就是父组件中子标签自定义名字
      type: Object,
      required: true
    }
  },
  data() {
    return {
      InitDataLoading: false,
      SaveDataLoading: false,
      UpLoadHeaders: { Authorization: 'Bearer ' + getToken() },
      UpLoadData: { fileFolder: 'WebSiteRotatioin' },
      RotatioinFileList: [],
      ImageWidth: 0,
      ImageHeight: 0,
      entity: {
        ROTATIONID: 0,
        ROTATIONTITLE: null,
        ROTATIONHREF: null,
        ROTATIONWIDTH: null,
        ROTATIONHEIGHT: null,
        ROTATIONFILENAME: null,
        ROTATIONFILEPATH: null,
        ISENABLED: null,
        SEQ: null,
        REMARK: null
      },
      formrules: {
        ROTATIONTITLE: [
          { required: true, message: '请输入轮播图名称', trigger: 'change' }
        ],
        ISENABLED: [
          { required: true, message: '请选择是否启用', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.Init()
  },
  methods: {
    Init() {
      if (this.params.type !== 'Add' && this.params.key) {
        this.entity.ROTATIONID = this.params.key
        this.InitForm()
      }
    },
    InitForm() {
      this.InitDataLoading = true
      Service.GetRotationSetEntity({ keyid: this.entity.ROTATIONID }).then(res => {
        if (res.Issuccess) {
          this.entity = res.Data
          this.RotatioinFileList.push({ name: this.entity.ROTATIONFILENAME, url: this.entity.ROTATIONFILEPATH })
        } else {
          this.$message.error(res.DataMsg)
        }
        this.InitDataLoading = false
      })
    },
    save() {
      // 保存
      if (this.entity.ROTATIONFILEPATH === null) {
        this.$message({
          showClose: true,
          message: '请上传轮播图图片',
          type: 'warning'
        })
        return
      }
      console.log(this.entity)
      Service.SaveRotationSet({ entity: this.entity }).then(res => {
        if (res.Issuccess) {
          this.$message({
            message: '操作成功!',
            type: 'success'
          })
          this.params.isvisible = false
          this.$parent.RefreshList()
        }
        this.tableDataLoading = false
      })
    },
    GetUploadServer() {
      return UploadService.HttpUploadFile
    },
    // 上传图片前相关
    beforeAvatarUpload(file) {
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
    // 相册删除
    handleRemove(file) {
    //   const fileObj = file.response.Data[0]
      this.entity.ROTATIONFILEPATH = null
      this.entity.ROTATIONWIDTH = null
      this.entity.ROTATIONHEIGHT = null
    },
    // 上传成功回掉
    uploadAppSuccess(response, file, fileList) {
      if (response.Issuccess) {
        this.entity.ROTATIONFILEPATH = response.Data[0].Url
        this.entity.ROTATIONFILENAME = response.Data[0].FileName
        this.entity.ROTATIONWIDTH = file.raw.Width
        this.entity.ROTATIONHEIGHT = file.raw.Height
      }
    },
    // 超出个数
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择1个文件，请先删除已经上传的图片，然后重新上传！`)
    }
  }
}
</script>
