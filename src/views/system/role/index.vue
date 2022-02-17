<template>
	<div>
		<el-card shadow="hover">
			<div class="system-user-search mb10">
				<el-button v-auths="['system:role:create']" type="primary" class="mr10" @click='handleCreate'><el-icon class='mr5'><Plus></Plus></el-icon>新建</el-button>
				<el-input v-model='listQuery.key' placeholder="请输入角色名称" @keyup.enter.native='getList' prefix-icon="Search" style="max-width: 350px">
					<template #append>
						<el-button icon="Search" @click='getList'></el-button>
					</template>
				</el-input>
			</div>
			<el-table :data="list" border stripe style="width: 100%" v-loading="loading" size='small'>
				<el-table-column prop="key" label="标识" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
				<el-table-column label="状态" show-overflow-tooltip>
					<template #default='{row}'>
						<el-tag :type="row.status ? 'success' : 'danger'" size='small' >
							{{ row.status ? '可用' : '禁用' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" show-overflow-tooltip>
					<template #default='{row}'>
						{{ parseTime(row.create_time) }}
					</template>
				</el-table-column>
				<el-table-column label="更新时间" show-overflow-tooltip>
					<template #default='{row}'>
						{{ parseTime(row.update_time) }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180">
					<template #default="scope">
						<el-button size="small" type="text" @click="handlePermission(scope.row)" v-auths="['system:role:permission']" icon='Postcard'>权限</el-button>
						<el-button size="small" type="text" @click="handleEdit(scope.row)" v-auths="['system:role:edit']" icon='Edit'>编辑</el-button>
						<el-button size="small" type="text" @click="handleDelete(scope.row)" v-auths="['system:role:delete']" icon='Delete'>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination v-show="total>0" :total="total" v-model:page="listQuery.page" v-model:size="listQuery.size" @pagination="getList" />
		</el-card>

		<el-dialog
			title="角色管理"
			v-model="dialogVisible"
			:close-on-click-modal='false'
			width="50%">
			<div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="80px">
					<el-row :gutter="20">
						<el-col :span="12" class="mb20">
							<el-form-item label="标识：" prop="key">
								<el-input   v-model="ruleForm.key" :disabled='dialogStatus==="edit"' placeholder="请输入角色标识"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item label="名称：" prop="name">
								<el-input   v-model="ruleForm.name" placeholder="请输入角色名称"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" v-if='dialogStatus==="edit"'>
							<el-form-item label="状态：">
								<el-switch v-model="ruleForm.status"></el-switch>
							</el-form-item>
						</el-col>
						<el-col :span="dialogStatus==='create'?24:12">
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
	</div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, nextTick, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { ElNotification, ElMessageBox } from 'element-plus';
import Pagination from '/@/components/pagination/index.vue';
import { parseTime } from '/@/utils/formatTime';
import {
	roleList,
	saveRole,
	deleteRole,
} from '/@/api/system/role'
export default defineComponent({
	name: 'SystemRoleIndex',
	components: { Pagination },
	setup: function() {
		const ruleFormRef = ref();
		const router = useRouter();
		const state: any = reactive({
			dialogVisible: false,
			loading: false,
			list: [],
			total: 0,
			listQuery: {
				page: 1,
				size: 10,
			},
			ruleForm: {},
			rules: {
				key: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
				],
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' },
				]
			},
			dialogStatus: 'create'
		});

		const getList = () => {
			state.loading = true
			roleList(state.listQuery).then(res => {
				state.list = res.data.list;
				state.total = res.data.total;
				state.loading = false
			});
		};

		// 当前行删除
		const handleDelete = (row: any) => {
			ElMessageBox.confirm(`此操作将删除该用户《${row.name}》?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				deleteRole(row.id).then(() => {
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
			state.dialogStatus = 'create'
			state.ruleForm = {
				status: true
			}
			state.dialogVisible = true;
			nextTick(() => {
				ruleFormRef.value.clearValidate();
			})
		};

		const handleEdit = (row: object) => {
			state.dialogStatus = 'edit'
			state.ruleForm = row
			state.dialogVisible = true
			nextTick(() => {
				ruleFormRef.value.clearValidate();
			})
		}

		const handlePermission = (row:any) => {
			router.push({ path: `/system/role/permission/${row.id}` })
		}

		const submitForm = () => {
			ruleFormRef.value.validate((valid: boolean) => {
				if (valid) {
					saveRole(state.ruleForm).then(() => {
						getList();
						state.dialogVisible = false;
						ElNotification({
							type: 'success',
							message: '保存用户成功',
						});
					});
				}
			});
		};

		// 页面加载时
		onMounted(() => {
			getList();
		});
		return {
			ruleFormRef,
			parseTime,
			handleDelete,
			getList,
			handleCreate,
			handleEdit,
			handlePermission,
			submitForm,
			...toRefs(state),
		};
	},
})
</script>
