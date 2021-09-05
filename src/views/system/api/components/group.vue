<template>
	<div>
		<div class="system-user-search mb15">
			<el-button v-auths="['system:user:create']" size="small" type="primary" class="mr10" @click='handleCreate'><i class='el-icon-plus'></i> 新建</el-button>
		</div>
		<el-table
			:data="list"
			style="width: 100%;margin-bottom: 20px;"
			row-key="id"
			size="small"
			default-expand-all>
			<el-table-column
				prop="app"
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
					<el-button size="mini" type="text" @click="handleEdit(scope.row)" icon='el-icon-edit'>编辑</el-button>
					<el-button size="mini" type="text" @click="handleDelete(scope.row)" icon='el-icon-delete'>删除</el-button>
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
				<el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
					<el-form-item label="应用：" prop="app">
						<el-input v-model="ruleForm.app" size='small'></el-input>
					</el-form-item>
					<el-form-item label="备注：">
						<el-input type='textarea' v-model="ruleForm.remark" size='small'></el-input>
					</el-form-item>
				</el-form>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false" size='small'>取 消</el-button>
					<el-button type="primary" @click="submitForm" size='small'>确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { ElNotification, ElMessageBox } from 'element-plus'
import { ref, reactive, toRefs, onMounted, nextTick } from 'vue';
import Pagination from '/@/components/pagination/index.vue'
import { parseTime } from '/@/utils/formatTime';
import {
	apiGroupList,
	saveApiGroup,
	deleteApiGroup
} from '/@/api/system/apiGroup'
export default {
	name: 'SystemApiGroup',
	components: { Pagination },
	setup(props, context) {
		const ruleFormRef = ref()
		const state = reactive({
			dialogVisible: false,
			ruleForm: {},
			rules: {
				app: [
					{ required: true, message: '请输入应用', trigger: 'blur' }
				],
				group: [
					{ required: true, message: '请输入分组', trigger: 'blur' }
				]
			},
			list: [],
			total: 0,
			listQuery: {
				page: 1,
				size: 10,
			}
		});

		const getList = () => {
			apiGroupList(state.listQuery).then(res => {
				state.list = res.data.list
				state.total = res.data.total
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
};
</script>

<style scoped>

</style>