<template>
  <el-header class="btn-bar">
    <slot></slot>
    <el-button
      v-if="$attrs.uploadJson"
      type="text"
      size="medium"
      @click="$emit('uploadJson')"
			icon='Upload'
    >
      导入JSON
    </el-button>
    <el-button
      v-if="$attrs.clearable"
      type="text"
      size="medium"
      @click="$emit('clearable')"
			icon='Delete'
    >
      清空
    </el-button>
    <el-button
      v-if="$attrs.preview"
      type="text"
      size="medium"
      @click="$emit('preview')"
			icon='View'
    >
      预览
    </el-button>
    <el-button
      v-if="$attrs.generateJson"
      type="text"
      size="medium"
      @click="$emit('generateJson')"
			icon='Tickets'
    >
      生成JSON
    </el-button>
    <el-button
      v-if="$attrs.generateCode"
      type="text"
      size="medium"
      @click="$emit('generateCode')"
			icon='DocumentCopy'
    >
      生成代码
    </el-button>
  </el-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SvgIcon from '/@/components/svgIcon/index.vue';

export default defineComponent({
  name: 'CustomHeader',
  components: {
		SvgIcon
  },
  emits: ['uploadJson', 'clearable', 'preview', 'generateJson', 'generateCode']
})
</script>
