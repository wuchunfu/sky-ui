<template>
	<el-icon v-if='name.startsWith("ele-")'>
		<component :is='name.slice(0, name.length)'></component>
	</el-icon>
  <svg aria-hidden="true" class="svg-icon-spin" v-else>
    <use :fill="color" :xlink:href="symbolId"/>
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon'
    },
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#333'
    }
  },
  setup(props) {
		const symbolId = computed(() => `#${props.prefix}-${props.name}`)
		return { symbolId }
  }
})
</script>

<style lang="scss" scoped>
.svg-icon-spin {
  width: 1em;
  height: 1em;
  fill: currentColor;
  vertical-align: middle;
}
</style>
