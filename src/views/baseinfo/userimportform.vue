// 导入用户表单
<template>
  <div>
    <el-dialog
      v-if="formparams.isvisible"
      title="导入用户"
      :visible.sync="formparams.isvisible"
      :close-on-click-modal="false"
      width="400px"
    >
      <el-upload
        class="upload-demo"
        action=""
        :on-preview="handlePreview"
        :on-progress="handleUploading"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="beforeupload"
        :before-remove="beforeRemove"
        :limit="1"
        :on-change="changefile"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :auto-upload="false"
      >
        <el-button size="mini" type="primary">选择文件</el-button>
        <el-button size="mini" icon="el-icon-upload2" type="success" @click="submitUpload">导入</el-button>
        <div slot="tip" class="el-upload__tip">只能上传.xlsx文件，且不超过1MB</div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import uploadService from '@/api/baseinfo/userinfo'
export default {
  name: 'Userimportform',
  props: {
    formparams: { // 参数
      type: Object,
      required: true
    }
  },
  data() {
    return {
      fileList: [],
      formFile: []
    }
  },
  methods: {
    changefile(file, fileList) {
      this.formFile.push(file.raw)
    },
    // 点击列表文件触发
    handlePreview(file) {

    },
    beforeupload(file) {
      const size = file.size
      const fileName = file.name
      const flieArr = fileName.split('.')
      const fileSuffix = flieArr[flieArr.length - 1]
      if (fileSuffix !== 'xlsx') {
        this.$message.warning('请上传文件格式为: .xlsx的文件')
        return false
      }
      // 此处文件的单位为： Bytes
      if (size > 1048576) {
        this.$message.warning('您上传的文件大小已超出1MB，请控制文件大小')
        return false
      }
    },
    // 提交上传
    submitUpload() {
      if (this.formFile.length <= 0) {
        this.$message.warning('请先选择您要上传的文件')
        return
      }
      console.log(this.formFile)
      var formData = new FormData()
      formData.append('file', this.formFile[0])
      uploadService.ImportUser(formData).then(res => {
        console.log(res)
      })
    },
    // 上传中
    handleUploading(event, file, fileList) {
      console.log('上传中')
    },
    // 上传成功
    handleUploadSuccess(response, file, fileList) {
      alert('上传成功')
    },
    // 上传失败
    handleUploadError(err, file, fileList) {
      alert('失败')
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制，只能选择1个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-demo{
  height: 100px;
}
</style>
