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
  name: "radar-chart",
  props: {
    chartId: {
      type: String,
      default: "radar-chart"
    },
    className: {
      type: String,
      default: "radar-chart"
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
        radar: {
          shape: 'circle',
          indicator: [
            { name: 'CPU', max: 6500 },
            { name: '内存', max: 16000 },
            { name: '硬盘', max: 30000 },
            { name: '容器组', max: 38000 },
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000],
                name: 'Allocated Budget'
              },
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
