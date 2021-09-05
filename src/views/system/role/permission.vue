<template>
	<div class="system-menu-container">
		<el-card class="box-card" style='margin-bottom: 10px;'>
			<el-button type="primary" size='small'><i class='el-icon-receiving'></i> &nbsp;保 存</el-button>
		</el-card>
		<el-row :gutter="10">
			<el-col :span="6">
				<el-card class="box-card">
					<el-row>
						<el-input
							size="mini"
							placeholder="输入关键字进行过滤"
							v-model="filterText"
							class="input-with-select"
							style="margin-bottom: 10px"
						>
						</el-input>
					</el-row>
					<el-tree
						:data="menuTree"
						node-key="id"
						:props="defaultProps"
						class="filter-tree"
						default-expand-all
						@current-change='getCurrentNode'
						@check-change="handleCheckChange"
						:filter-node-method="filterNode"
						ref='menuTreeRef'
						show-checkbox
						:expand-on-click-node="false">
						<template #default="{ data, node }">
							<div class="custom-tree-node">
								<span :style='data.meta.isHide ? {color:"#999"}:{}'>
									<i :class='data.meta.icon'></i> {{ node.label }}
								</span>
							</div>
						</template>
					</el-tree>
				</el-card>
			</el-col>
			<el-col :span="18">
				<el-tabs type="border-card" shadow="hover">
					<el-tab-pane label="页面按钮">
						<PageElement :menu='menu'></PageElement>
					</el-tab-pane>
				</el-tabs>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
import { watch, ref, toRefs, reactive, onMounted } from 'vue';
import { useStore } from '/@/store';
import { useRoute } from 'vue-router';
import PageElement from './components/pageElement.vue'

export default {
	name: 'SystemMenuIndex',
	components: { PageElement },
	setup: function() {
		const menuTreeRef = ref();
		const store = useStore();
		const route = useRoute();
		const state = reactive({
			filterText: '',
			menu: {},
			menuTree: {},
			defaultProps: {
				children: 'children',
				label: 'title',
			}
		});

		const filterNode = (value: string, data: any) => {
			if (!value) return true;
			return data.title.indexOf(value) !== -1;
		};

		const getCurrentNode = (data: any) => {
			state.menu = Object.assign(data, data.meta);
		}

		const handleCheckChange = (data:any, checked:boolean, indeterminate:boolean) => {
			console.log(data, checked, indeterminate, route.params.id)
		}

		watch(() => state.filterText, (newValue) => {
			menuTreeRef.value.filter(newValue);
		});

		onMounted(() => {
			state.menuTree = store.state.requestRoutes.requestRoutes;
		});

		return {
			menuTreeRef,
			getCurrentNode,
			filterNode,
			handleCheckChange,
			...toRefs(state),
		};
	},
};
</script>

<style lang='scss' scoped>
.custom-tree-node {
	width:100%;
	text-overflow:ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
::v-deep(.el-form-item__content .el-input-group) {
	vertical-align: middle;
}
::v-deep(.el-alert--info.is-light) {
	border-radius: 3px;
}
</style>
