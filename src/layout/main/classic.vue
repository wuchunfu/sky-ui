<template>
	<el-container class="layout-container flex-center">
		<Header />
		<el-container class="layout-mian-height-50">
			<Aside />
			<div class="flex-center layout-backtop">
				<Main />
			</div>
		</el-container>
		<el-backtop target=".layout-backtop .el-main .el-scrollbar__wrap"></el-backtop>
	</el-container>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useStore } from '/@/store';
import Aside from '/@/layout/component/aside.vue';
import Header from '/@/layout/component/header.vue';
import Main from '/@/layout/component/main.vue';
export default {
	name: 'layoutClassic',
	components: { Aside, Header, Main },
	setup() {
		const store = useStore();
		// 获取布局配置信息
		const getThemeConfig = computed(() => {
			return store.state.themeConfig.themeConfig;
		});
		return {
			getThemeConfig,
		};
	},
};
</script>
