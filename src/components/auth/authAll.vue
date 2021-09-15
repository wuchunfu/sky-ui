<template>
	<div v-if="getUserAuthBtnList">
		<slot />
	</div>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useStore } from '/@/store';
import { judementSameArr } from '/@/utils/arrayOperation';
export default {
	name: 'authAll',
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	setup(props:any) {
		const store = useStore();
		// 获取 vuex 中的用户权限
		const getUserAuthBtnList = computed(() => {
			// @ts-ignore
			return judementSameArr(props.value, store.state.userInfos.userInfos.button);
		});
		return {
			getUserAuthBtnList,
		};
	},
};
</script>
