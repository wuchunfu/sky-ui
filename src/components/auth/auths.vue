<template>
	<div v-if="getUserAuthBtnList">
		<slot />
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '/@/store';
export default defineComponent({
	name: 'auths',
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
			let flag = false;
			// @ts-ignore
			store.state.userInfos.userInfos.button.map((val: any) => {
				props.value.map((v:any) => {
					if (val === v) flag = true;
				});
			});
			return flag;
		});
		return {
			getUserAuthBtnList,
		};
	},
})
</script>
