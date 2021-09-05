<template>
	<div>
		<el-empty v-if='!menu.title || menu.type === 3' description="未选择菜单节点"></el-empty>
		<div v-else>
			<el-empty v-if='pageButtons[menu.id] === undefined' description="暂无按钮"></el-empty>
			<div v-else>
				<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
				<el-row>
					<el-checkbox-group v-model="buttonList" size="mini" @change='handleCheckChange'>
						<el-checkbox style='margin-top: 10px;' v-for='item in pageButtons[menu.id]' :key='item.id' :label="item">{{ item.title }}</el-checkbox>
					</el-checkbox-group>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, reactive, toRefs } from 'vue';
import { useStore } from '/@/store'

export default {
	name: 'pageElement',
	props: {
		menu: Object,
	},
	setup(props) {
		const ruleFormRef = ref()
		const store = useStore();
		const state = reactive({
			checkAll: false,
			buttonList: [],
			pageButtons: store.state.requestRoutes.requestButtons,
			isIndeterminate: false
		});

		const handleCheckChange = (value) => {
			let checkedCount = value.length;
			state.checkAll = checkedCount === state.pageButtons[props.menu.id].length;
			state.isIndeterminate = checkedCount > 0 && checkedCount < state.pageButtons[props.menu.id].length;
		}

		const handleCheckAllChange = (val) => {
			state.buttonList = val ? state.pageButtons[props.menu.id] : [];
			state.isIndeterminate = false;
		}

		return {
			ruleFormRef,
			handleCheckChange,
			handleCheckAllChange,
			...toRefs(state),
		};
	}
};
</script>