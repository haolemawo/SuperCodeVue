<template>
  <div style="margin-top:20px;">
    <el-row :gutter="20">
      <el-col :span="11">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>CPU</span>
          </div>
          <div>
            <table class="cont-table" border="0" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <th class="colum">
                    <div class="thead-cell">属性</div>
                  </th>
                  <th class="colum">
                    <div class="thead-cell">值</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="colum">
                    <div> 核心数 </div>
                  </td>
                  <td class="colum">
                    <div> {{ CPUInfo.CpuSum }} </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="11" :push="1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{ '列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import service from '@/api/monitoring/monitoring'

export default {
  data() {
    return {
      CPUInfoLoading: false,
      CPUInfo: []
    }
  },
  created() {
    this.InitCPUInfo()
  },
  methods: {
    InitCPUInfo() {
      this.CPUInfoLoading = true
      service.GetServerCPU({}).then(response => {
        if (response.Issuccess) {
          this.CPUInfo = response.Data
        } else {
          this.$message.error(response.DataMsg)
        }
        this.CPUInfoLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-card__header{
  padding: 15px 10px;
    color: #606266;
}
.cont-table{
  font-size: 14px;
  color: #606266;
  width: 100%;
  .colum{
    text-align: left;
    border-bottom: 1px solid #E4E7ED;
    padding: 10px 0px;
  }
}

</style>
