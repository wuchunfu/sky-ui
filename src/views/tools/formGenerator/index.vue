<template>
	<div>
		<ElDesignForm></ElDesignForm>
	</div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';
import { ElDesignForm } from '/@/components/formGenerator/index'

export default defineComponent({
	name: 'index',
	components: {
		ElDesignForm
	},
	setup() {
		const state = reactive({});
		return {
			...toRefs(state),
		};
	},
});
</script>

<style scoped>

</style>
