<template>
	<div class="layout-navbars-container">
		<BreadcrumbIndex />
	</div>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useStore } from '/@/store';
import BreadcrumbIndex from '/@/layout/navBars/breadcrumb/index.vue';
export default {
	name: 'layoutNavBars',
	components: { BreadcrumbIndex },
	setup() {
		const store = useStore();
		// 是否显示 tagsView
		const setShowTagsView = computed(() => {
			let { layout, isTagsview } = store.state.themeConfig.themeConfig;
			return layout !== 'classic' && isTagsview;
		});
		return {
			setShowTagsView,
		};
	},
};
</script>

<style scoped lang="scss">
.layout-navbars-container {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
</style>
