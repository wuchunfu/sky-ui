<template>
	<div>
		<div class="system-user-search mb10">
			<el-button v-auths="['system:api-group:create']" type="primary" class="mr10" @click='handleCreate'><el-icon class='mr5'><Plus></Plus></el-icon>新建</el-button>
		</div>
		<el-table
			v-loading="loading"
			:data="list"
			style="width: 100%;margin-bottom: 20px;"
			row-key="id"
			border
			size='small'
			default-expand-all>
			<el-table-column
				prop="name"
				label="应用">
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
					<el-button size="small" type="text" @click="handleEdit(scope.row)" v-auths="['system:api-group:edit']" icon='Edit'>编辑</el-button>
					<el-button size="small" type="text" @click="handleDelete(scope.row)" v-auths="['system:api-group:delete']" icon='Delete'>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<Pagination v-show="total>0" :total="total" v-model:page="listQuery.page" v-model:size="listQuery.size" @pagination="getList" />
		<el-dialog
			title="接口分组管理"
			v-model="dialogVisible"
			:close-on-click-modal='false'
			width="30%">
			<div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="80px">
					<el-form-item label="应用：" prop="name">
						<el-input v-model="ruleForm.name"  ></el-input>
					</el-form-item>
					<el-form-item label="备注：">
						<el-input type='textarea' v-model="ruleForm.remark"  ></el-input>
					</el-form-item>
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

<script>
import { ElNotification, ElMessageBox } from 'element-plus'
import { ref, reactive, toRefs, onMounted, nextTick, defineComponent } from 'vue';
import Pagination from '/@/components/pagination/index.vue'
import { parseTime } from '/@/utils/formatTime';
import {
	apiGroupList,
	saveApiGroup,
	deleteApiGroup
} from '/@/api/system/apiGroup'
export default defineComponent({
	name: 'SystemApiGroup',
	components: { Pagination },
	setup(props, context) {
		const ruleFormRef = ref()
		const state = reactive({
			dialogVisible: false,
			ruleForm: {},
			rules: {
				name: [
					{ required: true, message: '请输入应用', trigger: 'blur' }
				]
			},
			loading: false,
			list: [],
			total: 0,
			listQuery: {
				page: 1,
				size: 10,
			}
		});

		const getList = () => {
			state.loading = true
			apiGroupList(state.listQuery).then(res => {
				state.list = res.data.list
				state.total = res.data.total
				state.loading = false
			})
		}

		const handleCreate = () => {
			state.ruleForm = {}
			state.dialogVisible = true
			nextTick(() => {
				ruleFormRef.value.clearValidate()
			})
		}

		const handleEdit = (row) => {
			state.ruleForm = row
			state.dialogVisible = true
			nextTick(() => {
				ruleFormRef.value.clearValidate()
			})
		}

		const handleDelete = (row) => {
			ElMessageBox.confirm('此操作将删除 API 接口分组?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				deleteApiGroup(row.id).then(() => {
					getList()
					context.emit("getApiGroupList")
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
		}

		const submitForm = () => {
			ruleFormRef.value.validate((valid) => {
				if (valid) {
					saveApiGroup(state.ruleForm).then(() => {
						getList()
						context.emit("getApiGroupList")
						state.dialogVisible = false
						ElNotification({
							type: 'success',
							message: '保存API接口分组成功!'
						});
					})
				}
			});
		}

		onMounted(() => {
			getList()
		})

		return {
			ruleFormRef,
			parseTime,
			getList,
			handleCreate,
			handleEdit,
			handleDelete,
			submitForm,
			...toRefs(state),
		};
	}
})
</script>

<style scoped>

</style>
