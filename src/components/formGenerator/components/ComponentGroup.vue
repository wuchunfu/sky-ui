<template>
  <div class="widget-cate">{{ title }}</div>
  <draggable
    tag="ul"
    item-key="type"
    ghostClass="ghost"
    :group="{ name: 'people', pull: 'clone', put: false }"
    :sort="false"
    :list="list"
  >
		<transition-group>
			<div v-for="element in list" :key="element.type">
				<li
					v-if="fields.includes(element.type)"
					class="form-edit-widget-label"
					:class="{ 'no-put': element.tpye === 'divider' }"
				>
					<a>
						<SvgIcon class='mr6 ml8' :name="element.type" />
						<span>{{ element.label }}</span>
					</a>
				</li>
			</div>
		</transition-group>
  </draggable>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next'
import SvgIcon from '/@/components/svgIcon/index.vue';

export default defineComponent({
  name: 'ComponentGroup',
  components: {
		draggable: VueDraggableNext,
    SvgIcon
  },
  props: {
    title: {
      type: String,
      required: true
    },
    fields: {
      type: Array as PropType<Array<string>>,
      required: true
    },
    list: {
      required: true
    }
  }
})
</script>
