<template>
	<div>
		<el-empty v-if='!menu.title || menu.type === 3' description="未选择菜单节点"></el-empty>
		<div v-else>
			<el-transfer
				class='menu-manage-api'
				style='width: 100%'
				v-model="rightData"
				filterable
				:titles="['未授权', '已授权']"
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
import { useRoute } from 'vue-router';
import { ElNotification } from 'element-plus'
import { getMenuApiList } from '/@/api/system/menu'
import { roleBindApi, getRoleApi } from '/@/api/system/role'

export default {
	name: 'pageApi',
	props: {
		menu: Object,
	},
	setup(props) {
		const route = useRoute();
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
				state.leftData = []
				for (let api of res.data) {
					state.leftData.push({
						label: api.title,
						key: api.id
					})
				}
			})
		}

		const getRightData = () => {
			state.rightData = []
			getRoleApi(route.params.id, {
				menu: props.menu.id,
			}).then(res => {
				state.rightData = res.data
			})
		}

		const filterMethod = (query, item) => {
			return item.label.indexOf(query) > -1
		}

		const updateRightData = (value, direction, moveKeys) => {
			let roleId = route.params.id
			let params = {
				type: 1,
				api: moveKeys
			}
			let message = "绑定成功！"
			if (direction === 'left') {
				// 解绑
				params.type = 0
				message = "解绑成功！"
			}
			roleBindApi(roleId, params).then(() => {
				ElNotification({
					type: 'success',
					message: message,
				});
			})
		}

		watch(() => props.menu.id, () => {
			if (props.menu.id) {
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