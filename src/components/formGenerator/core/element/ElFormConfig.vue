<template>
  <div class="form-config-container">
    <el-form label-position="top">
      <el-form-item label="标签对齐方式">
        <el-radio-group v-model="data.labelPosition">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
          <el-radio-button label="top">顶部对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="标签宽度">
        <el-input-number v-model.number="data.labelWidth" :min="0" />
      </el-form-item>

      <el-form-item label="组件尺寸">
        <el-radio-group v-model="data.size">
          <el-radio-button label="large">大</el-radio-button>
          <el-radio-button label="default">默认</el-radio-button>
          <el-radio-button label="small">小</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="隐藏必选标记">
        <el-switch v-model="data.hideRequiredAsterisk" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { WidgetForm } from '/@/components/formGenerator/config/element'
import { defineComponent, PropType, ref, watch } from 'vue'

export default defineComponent({
  name: 'ElFormConfig',
  props: {
    config: {
      type: Object as PropType<WidgetForm['config']>,
      required: true
    }
  },
  emits: ['update:config'],
  setup(props, context) {
    const data = ref(props.config)

    watch(data, () => context.emit('update:config', data))

    return {
      data
    }
  }
})
</script>
