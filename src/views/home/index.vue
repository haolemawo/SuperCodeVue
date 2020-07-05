<template>
  <div class="page-container">
    <el-row class="backwhite">
        <el-col :span="24">
            <headPanel-Echart />
        </el-col>
    </el-row>
    <el-row>

    </el-row>
  </div>
</template>

<script>
import HeadPanelEchart from './module/headPanel'
export default {
  name: 'Home',
  components: { 'headPanel-Echart': HeadPanelEchart },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.backwhite{
    background-color: #FFFFFF;
}
</style>
