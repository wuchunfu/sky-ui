<template>
	<div>
		<el-empty v-if='!menu.title || menu.type === 3' description="未选择菜单节点"></el-empty>
		<div v-else>
			<el-alert
				:title="'当前页面为《'+menu.title+'》绑定API接口。'"
				type="info"
				show-icon>
			</el-alert>
			<el-row style='margin-top: 15px;'>
				<el-button size='small' type='primary' @click='handleSave'><i class="el-icon-check"></i> &nbsp;保 存</el-button>
			</el-row>
			<el-divider></el-divider>
			<div>
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
import { watch, reactive, toRefs } from 'vue';
import { ElNotification } from 'element-plus'
import { apiList } from '/@/api/system/api'
import { menuBindApi, menuUnBindApi, getMenuApis } from '/@/api/system/menu'

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

		const getApiData = () => {
			getMenuApis(props.menu.id).then(res => {
				state.rightData = res.data;
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
			})
		}

		const filterMethod = (query, item) => {
			return item.label.indexOf(query) > -1
		}

		const updateRightData = (value, direction, moveKeys) => {
			let params = {
				menu: props.menu.id,
				apis: moveKeys,
			}
			if (direction === 'right') {
				// 绑定
				menuBindApi(params).then(() => {
					ElNotification({
						type: 'success',
						message: '绑定成功!',
					});
				})

			} else if (direction === 'left') {
				// 解绑
				menuUnBindApi(params).then(() => {
					ElNotification({
						type: 'success',
						message: '解除绑定成功!',
					});
				})
			}
		}

		watch(() => props.menu.id, () => {
			if (props.menu.id !== 0) {
				getApiData()
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