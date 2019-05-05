<template>
  <div id="container" style="width: 100%; height: 6rem;">
  </div>
</template>

<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data () {
    return {
      value: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let myChart = echarts.init(document.getElementById('container'))
      let options = {
        title: {
          text: 'Echarts 入门实例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
      myChart.setOption(options)
    }
  }
}
</script>
