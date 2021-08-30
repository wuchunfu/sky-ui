<template>
	<div>
		<el-empty v-if='!menu.title || menu.type === 3' description="未选中菜单节点"></el-empty>
		<div v-else>
			<el-alert
				:title="'当前页面为《'+menu.title+'》的按钮管理页面。'"
				type="info"
				show-icon>
			</el-alert>
			<el-row style='margin-top: 15px;'>
				<el-button size='small' type='primary'><i class="el-icon-plus"></i> &nbsp;新 建</el-button>
				<el-button size='small' type='success' :disabled='buttonList.length !== 1'><i class="el-icon-edit"></i> &nbsp;编 辑</el-button>
				<el-button size='small' type='danger' :disabled='buttonList.length === 0'><i class="el-icon-delete"></i> &nbsp;删 除</el-button>
			</el-row>
			<el-divider></el-divider>
			<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
			<el-row>
				<el-checkbox-group v-model="buttonList" size="mini" @change='handleCheckChange'>
					<el-checkbox style='margin-top: 10px;' v-for='item in pageButtons[menu.id]' :key='item.id' :label="item.id">{{ item.title }}</el-checkbox>
				</el-checkbox-group>
			</el-row>
		</div>
	</div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { useStore } from '/@/store'

export default {
	name: 'pageElement',
	props: {
		menu: Object,
	},
	setup(props) {
		const store = useStore();
		const state = reactive({
			checkAll: false,
			buttonList: [],
			pageButtons: store.state.requestRoutes.requestButtons,
			isIndeterminate: false
		});

		function handleCheckChange(value) {
			let checkedCount = value.length;
			state.checkAll = checkedCount === state.pageButtons[props.menu.id].length;
			state.isIndeterminate = checkedCount > 0 && checkedCount < state.pageButtons[props.menu.id].length;
		}

		function handleCheckAllChange(val) {
			if (val) {
				for (var b of state.pageButtons[props.menu.id]) {
					if (state.buttonList.indexOf(b.id) === -1) {
						state.buttonList.push(b.id)
					}
				}
			} else {
				state.buttonList = []
			}
		}
		return {
			handleCheckChange,
			handleCheckAllChange,
			...toRefs(state),
		};
	}
};
</script>

<style lang='scss' scoped>
	::v-deep(.el-divider--horizontal) {
		margin: 15px 0;
	}
</style>