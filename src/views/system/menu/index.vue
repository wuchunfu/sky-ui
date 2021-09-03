<template>
	<div class="system-menu-container">
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
							<template #append>
								<el-tooltip class="item" effect="dark" content="新增顶层菜单节点" placement="top">
									<el-button @click='resetRuleForm'>新增</el-button>
								</el-tooltip>
							</template>
						</el-input>
					</el-row>

					<el-tree
						:data="menuTree"
						node-key="id"
						:props="defaultProps"
						class="filter-tree"
						default-expand-all
						:filter-node-method="filterNode"
						@current-change='getCurrentNode'
						@node-drag-end="handleDragEnd"
						draggable
						@node-contextmenu='rightClickCurrentNode'
						ref='menuTreeRef'
						:expand-on-click-node="false">
						<template #default="{ data, node }">
							<div class="custom-tree-node" @contextmenu="openContextMenu">
								<span :style='data.meta.isHide ? {color:"#999"}:{}'>
									<i :class='data.meta.icon'></i> {{ node.label }}
								</span>
							</div>
						</template>
					</el-tree>
					<context-menu name="menu-tree-context">
						<context-menu-item :divider="true" @itemClickHandle="addChildrenMenu">
							<i class='el-icon-plus'></i> 新 建
						</context-menu-item>
						<context-menu-item
							:disabled='!currentNode.children || currentNode.children.length === 0 ? false : true'
							@itemClickHandle="deleteMenuHandle">
							<i class='el-icon-delete'></i> 删 除
						</context-menu-item>
					</context-menu>
				</el-card>
			</el-col>
			<el-col :span="18">
				<el-tabs type="border-card" shadow="hover">
					<el-tab-pane label="菜单表单">
						<el-alert
							:title="alertTitle"
							type="info"
							show-icon>
						</el-alert>
						<div style='margin-top: 10px;'>
							<el-empty v-if='ruleForm.title === undefined' :description="$t('message.router.systemMenuEmptyRemarks')"></el-empty>
							<el-form v-else :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
								<el-row :gutter="20">
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
										<el-form-item label="类型：" prop='type'>
											<el-radio-group v-model="ruleForm.type" size="small">
												<el-radio :label="1">目录</el-radio>
												<el-radio :label="2">菜单</el-radio>
											</el-radio-group>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
										<el-form-item label="展示顺序：" prop="sort">
											<el-input-number v-model="ruleForm.sort" size='small'></el-input-number>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
										<el-form-item label="标题：" prop="title">
											<el-input v-model="ruleForm.title" size='small' placeholder='请输入标题'></el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
										<el-form-item label="图标：">
											<IconSelector v-model="ruleForm.icon" />
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if='ruleForm.type !== 3'>
										<el-form-item label="路由路径：" prop="path">
											<el-input v-model="ruleForm.path" size='small' placeholder='请输入路由路径'></el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if='ruleForm.type !== 3'>
										<el-form-item label="路由名称：">
											<el-input v-model="ruleForm.name" size='small' placeholder='请输入路由名称'></el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if='ruleForm.type !== 3'>
										<el-form-item label="组件路径：" prop='component'>
											<el-input v-model="ruleForm.component" size='small' placeholder='请输入组件路径'></el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if='ruleForm.type !== 3'>
										<el-form-item label="跳转地址：" prop='redirect'>
											<el-input v-model="ruleForm.redirect" size='small' placeholder='请输入跳转地址'></el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if='ruleForm.type === 2'>
										<el-form-item label="是否超链接：" prop='redirect'>
											<el-switch v-model="isLinkStatus"></el-switch>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if='isLinkStatus && ruleForm.type === 2'>
										<el-form-item label="超链接地址：">
											<el-input v-model="ruleForm.hyperlink" size='small'></el-input>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
										<el-form-item label="权限标识：">
											<el-select
												style='width: 100%'
												size='small'
												v-model="ruleForm.auth"
												multiple
												filterable
												allow-create
												default-first-option
												placeholder='请输入权限标识'
											>
												<el-option
													v-for="item in menuAuth"
													:key="item.value"
													:label="item.label"
													:value="item.value">
												</el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if='ruleForm.type !== 3'>
										<el-form-item label="是否隐藏：">
											<el-switch v-model="ruleForm.isHide"></el-switch>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if='ruleForm.type === 2'>
										<el-form-item label="是否缓存：">
											<el-switch v-model="ruleForm.isKeepAlive"></el-switch>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if='ruleForm.type !== 3'>
										<el-form-item label="固定标签栏：">
											<el-switch v-model="ruleForm.isAffix"></el-switch>
										</el-form-item>
									</el-col>
									<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if='ruleForm.type === 2'>
										<el-form-item label="内嵌窗口：">
											<el-switch v-model="ruleForm.isIframe"></el-switch>
										</el-form-item>
									</el-col>
								</el-row>
								<el-form-item>
									<el-button type="primary" @click="editSubmitForm('ruleForm')" size='small'><i class='el-icon-check'></i>&nbsp; 保 存</el-button>
								</el-form-item>
							</el-form>
						</div>
					</el-tab-pane>
					<el-tab-pane label="页面按钮">
						<PageElement :menu='ruleForm'></PageElement>
					</el-tab-pane>
				</el-tabs>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
import { watch, ref, toRefs, reactive, onMounted, nextTick } from 'vue';
import { ElNotification, ElMessageBox } from 'element-plus';
import IconSelector from '/@/components/iconSelector/index.vue';
import { inject } from 'vue';
import {
	getMenus,
	saveMenu,
	deleteMenu
} from '/@/api/system/menu'
import { useStore } from '/@/store';

import PageElement from './components/pageElement.vue'

export default {
	name: 'SystemMenuIndex',
	components: { IconSelector, PageElement },
	setup() {
		const menuTreeRef = ref()
		const ruleFormRef = ref()
		const store = useStore();
		const state = reactive({
			filterText: '',
			menuTree: {},
			alertTitle: '新增顶层菜单节点。',
			currentNode: {},
			ruleForm: {
				id: 0,
				type: 1,
				auth: [],
				sort: 1,
				title: '',
				meta: {},
			},
			isLinkStatus: false,
			menuAuth: [],
			defaultProps: {
				children: 'children',
				label: 'title'
			},
			rules: {
				type: [
					{ required: true, message: '请选择菜单类型', trigger: 'change' },
				],
				title: [
					{ required: true, message: '请输入标题', trigger: 'blur' },
				],
				path: [
					{ required: true, message: '请输入路由路径', trigger: 'blur' },
				],
				component: [
					{ required: true, message: '请输入组件路径', trigger: 'blur' },
				]
			}
		});

		const resetRuleForm = () => {
			state.ruleForm = {
				id: 0,
				type: 1,
				auth: [],
				sort: 1,
				title: '',
				meta: {},
			}
		}

		const getMenuInit = async () => {
			await getMenus().then(res => {
				state.menuTree = res.data.menu;
			});
		}

		const getCurrentNode = (data: any) => {
			state.ruleForm = Object.assign(data, data.meta);
			state.alertTitle = `编辑《${state.ruleForm.title}》菜单节点。`
			nextTick(() => {
				ruleFormRef.value.clearValidate();
			})
		}

		// 新建子菜单
		const addChildrenMenu = () => {
			resetRuleForm()
			state.ruleForm.parent = state.currentNode.id
			state.alertTitle = `新增《${state.currentNode.title}》菜单节点下的子菜单节点。`
			nextTick(() => {
				ruleFormRef.value.clearValidate();
			})
		}

		// 删除子菜单
		const deleteMenuHandle = () => {
			ElMessageBox.confirm('此操作将删除当前菜单节点?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				deleteMenu(state.currentNode.id).then(() => {
					getMenuInit()
					ElNotification({
						type: 'success',
						message: '删除成功!',
					});
				})

				}).catch(() => {
					ElNotification({
						type: 'info',
						message: '已取消删除',
					});
				}
			);
		}

		const rightClickCurrentNode = (event:Event, data:object) => {
			state.currentNode = data
		}

		const handleDragEnd = (draggingNode:any, dropNode:any, position:any) => {
			let nodeData = draggingNode.data
			if (position === 'inner') {
				nodeData.parent = dropNode.data.id
			} else {
				nodeData.parent = dropNode.data.parent
			}

			if (position === 'before') {
				nodeData.sort = dropNode.data.sort - 1
			} else if (position === 'after') {
				nodeData.sort = dropNode.data.sort + 1
			}

			nodeData = Object.assign(nodeData, nodeData.meta);

			saveMenu(nodeData).then(() => {
				getMenuInit()
				ElNotification({
					type: 'success',
					message: '移动菜单节点位置成功'
				})
			})
		}

		// eslint-disable-next-line no-unused-vars
		const emitContext = inject('emitContext') as (event: Event, dataId: Record<string, unknown>) => void
		const openContextMenu = (e: any) => {
			emitContext(e, { name: 'menu-tree-context' })
		}

		const editSubmitForm = () => {
			ruleFormRef.value.validate((valid:any) => {
				if (valid) {
					saveMenu(state.ruleForm).then(res => {
						state.ruleForm = res.data
						state.alertTitle = `编辑《${state.ruleForm.title}》菜单节点。`
						getMenuInit()
						ElNotification({
							type: 'success',
							message: '保存菜单数据成功'
						})
					})
				}
			});
		}

		const filterNode = (value:string, data:any) => {
			if (!value) return true;
			return data.title.indexOf(value) !== -1;
		}

		watch(() => state.filterText, (newValue) => {
				menuTreeRef.value.filter(newValue)
		})

		onMounted(() => {
			state.menuTree = store.state.requestRoutes.requestRoutes
		})

		return {
			menuTreeRef,
			ruleFormRef,
			editSubmitForm,
			resetRuleForm,
			getCurrentNode,
			filterNode,
			//
			handleDragEnd,
			//
			openContextMenu,
			addChildrenMenu,
			deleteMenuHandle,
			rightClickCurrentNode,
			//
			...toRefs(state),
		};
	}
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
	::v-deep(.v-contextmenu-item) {
		padding: 10px 15px;
	}
</style>
