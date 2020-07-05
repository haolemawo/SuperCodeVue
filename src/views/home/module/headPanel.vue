<template>
  <div>
    <div id="headMainEcharts" ref="headMainEcharts" style="width:100%; height:360px" />
  </div>
</template>

<script>
import homeServer from '@/api/home/home'
export default {
  name: 'HeadPanel',
  data() {
    return {
      query: {
        startTemp: null,
        endTemp: null
      },
      myChart: null,
      optionLegend: [],
      chartSeries: [],
      xAxisData: []
    }
  },
  mounted() {
    this.InitEcharts()
  },
  created() {
    this.SetxAxisData(15)
  },
  methods: {
    // 初始化图标
    InitEcharts() {
      // 指定图表的配置项和数据
      var echarts = require('echarts')
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById('headMainEcharts'))
      var option = {
        title: {
          text: '热点运营数据'
        },
        tooltip: {
          trigger: 'axis',
          showDelay: 20
        },
        grid: {
          right: 60,
          left: 30,
          bottom: 20,
          containLabel: true
        },
        legend: {
          data: this.optionLegend
        },
        xAxis: {
          boundaryGap: false,
          data: this.xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: this.chartSeries
      }
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option)
      // 商品浏览量
      this.InitBrowseerSummaryDays()
      // 登录人数
      this.InitUserLoginSummary()
    },
    InitBrowseerSummaryDays() {
      homeServer.GetBrowseerSummaryDays(this.query).then(res => {
        if (res.Issuccess) {
          this.optionLegend.push('商品浏览量')
          this.chartSeries.push({
            name: '商品浏览量',
            type: 'line',
            data: res.Data
          })
          // 重新赋值
          this.myChart.setOption({
            legend: {
              data: this.optionLegend
            },
            series: this.chartSeries
          })
        }
      })
    },
    InitUserLoginSummary() {
      homeServer.GetUserLoginSummaryDays(this.query).then(res => {
        if (res.Issuccess) {
          this.optionLegend.push('用户登录量')
          this.chartSeries.push({
            name: '用户登录量',
            type: 'line',
            data: res.Data
          })
          // 重新赋值
          this.myChart.setOption({
            legend: {
              data: this.optionLegend
            },
            series: this.chartSeries
          })
        }
      })
    },
    // 设置x轴数据
    SetxAxisData(num) {
      const oneDayTime = 24 * 60 * 60 * 1000
      const now = new Date()
      const nowTime = new Date(now.getTime() - num * oneDayTime).getTime()
      for (let i = 1; i <= num; i++) {
        const ShowTime = nowTime + i * oneDayTime
        const myDate = new Date(ShowTime)
        // const y = myDate.getFullYear()// 年
        const m = myDate.getMonth() + 1// 月
        const d = myDate.getDate()// 日
        this.xAxisData.push(m + '-' + d)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.backwhite{
    background-color: #FFFFFF;
}
</style>
