<template>
	<div>
		<el-tabs type="border-card" v-model='activeName' :before-leave="beforeLeave" @tab-click='handleTabClick'>
			<template v-if='apiGroupList.length > 0'>
				<el-tab-pane :name='item.id' v-for='item of apiGroupList' :key='item.id' :label="item.name">
					<div class="system-user-search mb10">
						<el-button v-auths="['system:api:create']" type="primary" class="mr10" @click='handleCreate'><el-icon class='mr5'><Plus></Plus></el-icon>新建</el-button>
						<el-input v-model='listQuery.title' placeholder="请输入接口名称" @keyup.enter.native='getList' prefix-icon="Search" style="max-width: 350px">
							<template #append>
								<el-button icon="Search" @click='getList'></el-button>
							</template>
						</el-input>
					</div>
					<el-table :data="list" stripe style="width: 100%" border v-loading="loading" size='small'>
						<el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
						<el-table-column prop="url" label="地址" show-overflow-tooltip></el-table-column>
						<el-table-column prop="method" label="方法" show-overflow-tooltip></el-table-column>
						<el-table-column label="操作" width="120">
							<template #default="scope">
								<el-button size="small" type="text" @click="handleEdit(scope.row)" v-auths="['system:api:edit']" icon='Edit'>编辑</el-button>
								<el-button size="small" type="text" @click="handleDelete(scope.row)" v-auths="['system:api:delete']" icon='Delete'>删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<Pagination v-show="total>0" :total="total" v-model:page="listQuery.page" v-model:size="listQuery.size" @pagination="getList" />
				</el-tab-pane>
			</template>
			<el-tab-pane label="暂无数据" v-else>
				<el-empty description="暂无接口相关数据"></el-empty>
			</el-tab-pane>
			<el-tab-pane key="addButton" v-auths="['system:api-group:list']">
				<template #label>
					<span style='font-size: 15px;'><el-icon><Setting></Setting></el-icon></span>
				</template>
			</el-tab-pane>
		</el-tabs>

		<el-dialog
			title="接口管理"
			v-model="dialogVisible"
			:close-on-click-modal='false'
			width="50%">
			<div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
					<el-row :gutter="20">
						<el-col :span="24" class="mb20">
							<el-form-item label="标题：" prop="title">
								<el-input   v-model="ruleForm.title" placeholder="请输入接口标题"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item label="地址：" prop="url">
								<el-input   v-model="ruleForm.url" placeholder="请输入接口地址"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item label="方法：" prop="method">
								<el-select style='width: 100%'   v-model="ruleForm.method" placeholder="请输入接口方法">
									<el-option label="GET" value="GET"></el-option>
									<el-option label="POST" value="POST"></el-option>
									<el-option label="PUT" value="PUT"></el-option>
									<el-option label="DELETE" value="DELETE"></el-option>
									<el-option label="PATCH" value="PATCH"></el-option>
									<el-option label="OPTIONS" value="OPTIONS"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20" v-if='ruleFormStatus === "edit"'>
							<el-form-item label="所属应用：" prop="group">
								<el-select   v-model="ruleForm.group" placeholder="请选择所属应用" style='width: 100%'>
									<el-option
										v-for="item in apiGroupList"
										:key="item.id"
										:label="item.name"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="备注：">
								<el-input   placeholder="请输入备注" type='textarea' v-model="ruleForm.remark"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false"  >取 消</el-button>
					<el-button type="primary" @click="submitForm"  >确 定</el-button>
				</span>
			</template>
		</el-dialog>

		<el-dialog
			title="接口分组列表"
			v-model="apiGroupDialog"
			:close-on-click-modal='false'
			width="50%">
			<div>
				<ApiGroup @getApiGroupList='getApiGroupList'></ApiGroup>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, nextTick, watch, defineComponent } from 'vue';
import { ElNotification, ElMessageBox } from 'element-plus';
import Pagination from '/@/components/pagination/index.vue';
import ApiGroup from './components/group.vue'
import { apiList, saveApi, deleteApi } from '/@/api/system/api'
import { apiGroupList } from '/@/api/system/apiGroup'
export default defineComponent({
	name: 'SystemApiIndex',
	components: { Pagination, ApiGroup },
	setup: function() {
		const ruleFormRef = ref();
		const state: any = reactive({
			dialogVisible: false,
			apiGroupDialog: false,
			status: false,
			apiGroupList: [],
			activeName: 0,
			loading: false,
			list: [],
			total: 0,
			listQuery: {
				page: 1,
				size: 10,
			},
			ruleForm: {},
			rules: {
				title: [
					{ required: true, message: '请输入接口标题', trigger: 'blur' },
				],
				url: [
					{ required: true, message: '请输入接口地址', trigger: 'blur' },
				],
				method: [
					{ required: true, message: '请输入接口方法', trigger: 'change' },
				],
				group: [
					{ required: true, message: '请选择所属应用', trigger: 'blur' },
				]
			},
			ruleFormStatus: 'create'
		});

		const getList = () => {
			state.loading = true;
			apiList(state.listQuery).then(res => {
				state.list = res.data.list;
				state.total = res.data.total;
				state.loading = false;
			});
		};

		const getApiGroupList = () => {
			apiGroupList({
				size: 999999
			}).then(res => {
				if (res.data.list && res.data.list.length > 0) {
					state.apiGroupList = res.data.list
					if (!state.listQuery.group) {
						state.listQuery.group = res.data.list[0].id
						state.activeName = res.data.list[0].id
					}
					getList();
				}
			})
		}

		const beforeLeave = (activeName:string) => {
			if (state.apiGroupList.length === 0) {
				return false
			}
			return activeName !== "" + state.apiGroupList.length;
		}

		const handleTabClick = (tab:any) => {
			if (state.apiGroupList.length === 0) {
				state.apiGroupDialog = true
			} else {
				state.apiGroupDialog = tab.index === "" + state.apiGroupList.length
			}
		}

		// 当前行删除
		const handleDelete = (row: any) => {
			ElMessageBox.confirm(`此操作将删除该接口《${row.title}》?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				deleteApi(row.id).then(() => {
					getList()
					ElNotification({
						type: 'success',
						message: '删除成功!'
					});
				})
			}).catch(() => {
				ElNotification({
					type: 'info',
					message: '已取消删除'
				});
			});
		};

		const handleCreate = () => {
			state.ruleFormStatus = 'create'
			state.ruleForm = {
				status: true,
				group: state.activeName
			}
			state.dialogVisible = true;
			nextTick(() => {
				ruleFormRef.value.clearValidate();
			})
		};

		const handleEdit = (row: object) => {
			state.ruleFormStatus = 'edit'
			state.ruleForm = row
			state.dialogVisible = true
			nextTick(() => {
				ruleFormRef.value.clearValidate();
			})
		}

		const submitForm = () => {
			ruleFormRef.value.validate((valid: boolean) => {
				if (valid) {
					saveApi (state.ruleForm).then(() => {
						getList();
						state.dialogVisible = false;
						ElNotification({
							type: 'success',
							message: '保存接口信息成功',
						});
					});
				}
			});
		};

		watch(() => state.activeName, (newValue) => {
			state.listQuery.group = newValue
			getList()
		})

		// 页面加载时
		onMounted(() => {
			getApiGroupList();
		});
		return {
			ruleFormRef,
			handleDelete,
			getList,
			getApiGroupList,
			handleCreate,
			handleEdit,
			beforeLeave,
			handleTabClick,
			submitForm,
			...toRefs(state),
		};
	},
})
</script>
