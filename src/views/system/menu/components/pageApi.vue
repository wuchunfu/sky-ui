<template>
	<div>
		<el-empty v-if='!menu.title || menu.type === 3' description="未选择菜单节点"></el-empty>
		<div v-else>
			<el-alert
				:title="'当前页面为《'+menu.title+'》绑定API接口。'"
				type="info"
				show-icon>
			</el-alert>
			<div style='margin-top: 10px;'>
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
	</div>
</template>

<script>
import { watch, reactive, toRefs, onMounted } from 'vue';
import { ElNotification } from 'element-plus'
import { apiList } from '/@/api/system/api'
import { useRoute } from 'vue-router';
import { menuBindApi, getMenuApis } from '/@/api/system/menu'

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
			apiList({
				size: 99999
			}).then(res => {
				for (var api of res.data.list) {
					state.leftData.push({
						label: api.title,
						key: api.id
					})
				}
			});
		}

		const getRightData = () => {
			getMenuApis(props.menu.id).then(res => {
				state.rightData = res.data;
			})
		}

		const filterMethod = (query, item) => {
			return item.label.indexOf(query) > -1
		}

		const updateRightData = (value, direction, moveKeys) => {
			let roleId = route.params.id
			let params = {
				type: 1,
				apis: moveKeys,
			}
			let message = "绑定成功！"
			if (direction === 'left') {
				// 解绑
				params.type = 0
				message = "解绑成功！"
			}
			menuBindApi(roleId, params).then(() => {
				ElNotification({
					type: 'success',
					message: message,
				});
			})
		}

		onMounted(() => {
			getLeftData()
		})

		watch(() => props.menu.id, () => {
			if (props.menu.id !== 0) {
				state.rightData = []
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