<template>
	<div>
		<el-card shadow="hover">
			<div class="system-user-search mb10">
				<el-button v-auths="['system:user:create']" type="primary" class="mr10" @click='handleCreate'><el-icon class='mr5'><Plus></Plus></el-icon>新建</el-button>
				<el-input v-model='listQuery.username' placeholder="请输入用户名" @keyup.enter.native='getList' prefix-icon="Search" style="max-width: 350px">
					<template #append>
						<el-button icon="Search" @click='getList'></el-button>
					</template>
				</el-input>
			</div>
			<el-table :data="list" stripe style="width: 100%" border v-loading="loading" size='small'>
				<el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nickname" label="姓名" show-overflow-tooltip></el-table-column>
				<el-table-column label="邮箱" show-overflow-tooltip>
					<template #default='{row}'>
						{{ row.email }}
					</template>
				</el-table-column>
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
				<el-table-column label="操作" width="120">
					<template #default="scope">
						<el-button size="small" type="text" @click="handleEdit(scope.row)" v-auths="['system:user:edit']" icon='Edit'>编辑</el-button>
						<el-button size="small" type="text" @click="handleDelete(scope.row)" v-auths="['system:user:delete']" icon='Delete'>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination v-show="total>0" :total="total" v-model:page="listQuery.page" v-model:size="listQuery.size" @pagination="getList" />
		</el-card>

		<el-dialog
			title="用户管理"
			v-model="dialogVisible"
			:close-on-click-modal='false'
			width="50%">
			<div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
					<el-row :gutter="20">
						<el-col :span="12" class="mb20">
							<el-form-item label="用户名：" prop="username">
								<el-input   v-model="ruleForm.username" :disabled='dialogStatus === "edit"' placeholder="请输入用户名"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item label="姓名：" prop="nickname">
								<el-input   v-model="ruleForm.nickname" placeholder="请输入姓名"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20" v-if='dialogStatus === "create"'>
							<el-form-item label="密码：" prop="password">
								<el-input   type='password' v-model="ruleForm.password" placeholder="请输入密码"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20" v-if='dialogStatus === "create"'>
							<el-form-item label="确认密码：" prop="checkPassword">
								<el-input   type='password' v-model="ruleForm.checkPassword" placeholder="请输入确认密码"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item label="手机号：">
								<el-input   v-model="ruleForm.tel" placeholder="请输入手机号"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item label="邮箱：">
								<el-input   v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item label="角色：">
								<el-select   v-model="ruleForm.role" multiple placeholder="请选择角色" style='width:100%'>
									<el-option
										v-for="item in roleList"
										:key="item.id"
										:label="item.name"
										:value="item.key">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12" v-if='dialogStatus === "edit"'>
							<el-form-item label="状态：">
								<el-switch v-model="ruleForm.status"></el-switch>
							</el-form-item>
						</el-col>
						<el-col :span="dialogStatus==='create'?12:24">
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
import { ElNotification, ElMessageBox } from 'element-plus';
import Pagination from '/@/components/pagination/index.vue'
import { parseTime } from '/@/utils/formatTime';
import {
	getUserList,
	createUser,
	deleteUser,
	editUser,
	getUserInfoById
} from '/@/api/system/user'
import { roleList } from '/@/api/system/role';
export default defineComponent({
	name: 'SystemUserIndex',
	components: { Pagination },
	setup: function() {
		let checkPassValidate = (rule:object, value:string, callback:any) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== state.ruleForm.password) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		}

		const ruleFormRef = ref();
		const state: any = reactive({
			dialogVisible: false,
			loading: false,
			roleList: [],
			list: [],
			total: 0,
			listQuery: {
				page: 1,
				size: 10,
			},
			ruleForm: {},
			rules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
				],
				nickname: [
					{ required: true, message: '请输入姓名', trigger: 'blur' },
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ validator: checkPassValidate, trigger: 'blur', required: true }
				],
				checkPassword: [
					{ required: true, message: '请输入确认密码', trigger: 'blur' },
					{ validator: checkPassValidate, trigger: 'blur', required: true }
				],
			},
			dialogStatus: 'create'
		});

		const getList = () => {
			state.loading = true
			getUserList(state.listQuery).then(res => {
				state.list = res.data.list;
				state.total = res.data.total;
				state.loading = false
			});
		};

		const getRoleList =() => {
			roleList({
				page: 1,
				size: 999999
			}).then(res => {
				state.roleList = res.data.list;
			});
		}

		// 当前行删除
		const handleDelete = (row: any) => {
			ElMessageBox.confirm(`此操作将删除该用户《${row.nickname}》?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				deleteUser(row.id).then(() => {
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

		const handleEdit = async (row: any) => {
			let res = await getUserInfoById(row.id)
			state.dialogStatus = 'edit'
			state.ruleForm = res.data
			state.dialogVisible = true
			nextTick(() => {
				ruleFormRef.value.clearValidate();
			})
		}

		const submitForm = () => {
			ruleFormRef.value.validate((valid: boolean) => {
				if (valid) {
					if (state.dialogStatus === 'create') {
						createUser(state.ruleForm).then(() => {
							getList();
							state.dialogVisible = false;
							ElNotification({
								type: 'success',
								message: '创建用户成功',
							});
						});
					} else if (state.dialogStatus === 'edit') {
						editUser(state.ruleForm.id, state.ruleForm).then(() => {
							getList();
							state.dialogVisible = false;
							ElNotification({
								type: 'success',
								message: '更新用户成功',
							});
						})
					}
				}
			});
		};

		// 页面加载时
		onMounted(() => {
			getList();
			getRoleList();
		});
		return {
			ruleFormRef,
			parseTime,
			handleDelete,
			getList,
			handleCreate,
			handleEdit,
			submitForm,
			...toRefs(state),
		};
	},
})
</script>
