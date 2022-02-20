<template>
    <div
        :id="chartId"
        :class="className"
        :style="{height:height,width:width}"
        class="base-charts-style"
    >
  </div>

</template>

<script>
import {onMounted, computed, nextTick} from "vue";
import * as echarts from "echarts";
export default {
  name: "pie-chart",
  props: {
    chartId: {
      type: String,
      default: "pie-chart"
    },
    className: {
      type: String,
      default: "pie-chart"
    },
    height: {
      type: String,
      default: "400px",
    },
    width: {
      type: String,
      default: "400px",
    },
    title: {
      type: String,
      default: "",
    },
    fontSize: {
      type: Number,
      default: 12,
    },
    fontWeight: {
      type: Number,
      default: 400,
    },
    xAxisData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    seriesData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    legendData: {
      type: Array,
      default: () => {
        return [];
      },
    }
  },
  setup(props) {
    // 配置信息
    const setOptions = computed(() => {
      return {
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' }
            ]
          }
        ]
      };
    });
    // 创建图表
    const initChart = () => {
      let myChart = document.getElementById(props.chartId)
      let chartObj=echarts.init(myChart);
      chartObj.setOption(setOptions.value);
    }

    onMounted(() => {
      nextTick(() => {
        initChart()
      })
    });

    return {
      setOptions
    };
  },
};
</script>

<style>
  .base-charts-style {
    border-radius: 3px;
  }
</style>
