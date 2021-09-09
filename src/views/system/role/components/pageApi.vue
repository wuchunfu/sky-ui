<template>
	<div>
		<el-empty v-if='!menu.title || menu.type === 3' description="未选择菜单节点"></el-empty>
		<div v-else>
			<el-transfer
				class='menu-manage-api'
				style='width: 100%'
				v-model="rightData"
				filterable
				:titles="['未绑定', '已绑定']"
				:filter-method="filterMethod"
				filter-placeholder="请输入API接口标题"
				:data="leftData"
				@change='updateRightData'
			/>
		</div>
	</div>
</template>

<script>
import { watch, reactive, toRefs } from 'vue';
import { getMenuApiList } from '/@/api/system/menu'

export default {
	name: 'pageApi',
	props: {
		menu: Object,
	},
	setup(props) {
		const state = reactive({
			leftData: [],
			rightData: [],
			updateApiData: {
				add: [],
				delete: [],
			}
		});

		const handleSave = () => {

		}

		const getLeftData = () => {
			getMenuApiList(props.menu.id).then(res => {
				for (var api of res.data) {
					state.leftData.push({
						label: api.title,
						key: api.id
					})
				}
			})
		}

		const getRightData = () => {

		}

		const filterMethod = (query, item) => {
			return item.label.indexOf(query) > -1
		}

		const updateRightData = (value, direction, moveKeys) => {
			console.log(value, direction, moveKeys)
			if (direction === 'right') {
				// 绑定


			} else if (direction === 'left') {
				// 解绑

			}
		}

		watch(() => props.menu.id, () => {
			if (props.menu.id) {
				state.rightData = []
				getLeftData()
				getRightData()
			}
		})

		return {
			filterMethod,
			handleSave,
			updateRightData,
			...toRefs(state),
		};
	}
};
</script>

<style lang='scss' scoped>
	::v-deep(.el-divider--horizontal) {
		margin: 15px 0;
	}
	::v-deep(.menu-manage-api .el-transfer-panel) {
		width: 35%;
	}
</style>