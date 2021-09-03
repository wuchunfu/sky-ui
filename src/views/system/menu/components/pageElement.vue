<template>
	<div>
		<el-empty v-if='!menu.title || menu.type === 3' description="未选择菜单节点"></el-empty>
		<div v-else>
			<el-alert
				:title="'当前页面为《'+menu.title+'》的按钮管理页面。'"
				type="info"
				show-icon>
			</el-alert>
			<el-row style='margin-top: 15px;'>
				<el-button size='small' type='primary' @click='handleCreate'><i class="el-icon-plus"></i> &nbsp;新 建</el-button>
				<el-button size='small' type='success' :disabled='buttonList.length !== 1' @click='handleEdit'><i class="el-icon-edit"></i> &nbsp;编 辑</el-button>
				<el-button size='small' type='danger' :disabled='buttonList.length === 0' @click='handleDelete'><i class="el-icon-delete"></i> &nbsp;删 除</el-button>
			</el-row>
			<el-divider></el-divider>
			<el-empty v-if='pageButtons[menu.id] === undefined' description="暂无按钮"></el-empty>
			<div v-else>
				<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
				<el-row>
					<el-checkbox-group v-model="buttonList" size="mini" @change='handleCheckChange'>
						<el-checkbox style='margin-top: 10px;' v-for='item in pageButtons[menu.id]' :key='item.id' :label="item">{{ item.title }}</el-checkbox>
					</el-checkbox-group>
				</el-row>
			</div>
		</div>
		<el-dialog
			title="管理按钮"
			v-model="buttonDialog"
			width="50%">
			<div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
					<el-form-item label="标题：" prop="title">
						<el-input v-model="ruleForm.title" size='small' placeholder='请输入标题'></el-input>
					</el-form-item>
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
				</el-form>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="buttonDialog = false" size='small'>取 消</el-button>
					<el-button type="primary" @click="handleSubmit" size='small'>确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { ref, reactive, toRefs } from 'vue';
import { useStore } from '/@/store'
import { saveMenu, menuButton, batchMenuButton } from '/@/api/system/menu';
import { ElNotification, ElMessageBox } from 'element-plus';

export default {
	name: 'pageElement',
	props: {
		menu: Object,
	},
	setup(props) {
		const ruleFormRef = ref()
		const store = useStore();
		const state = reactive({
			checkAll: false,
			buttonList: [],
			menuAuth: [],
			pageButtons: store.state.requestRoutes.requestButtons,
			isIndeterminate: false,
			buttonDialog: false,
			ruleForm: {
				title: '',
				type: 3,
				auth: [],
			},
			rules: {
				title: [
					{ required: true, message: '请输入标题', trigger: 'blur' },
				]
			}
		});

		const handleCheckChange = (value) => {
			let checkedCount = value.length;
			state.checkAll = checkedCount === state.pageButtons[props.menu.id].length;
			state.isIndeterminate = checkedCount > 0 && checkedCount < state.pageButtons[props.menu.id].length;
		}

		const resetRuleForm = () => {
			state.ruleForm = {
				title: '',
				type: 3,
				auth: [],
			}
		}

		const handleCheckAllChange = (val) => {
			state.buttonList = val ? state.pageButtons[props.menu.id] : [];
			state.isIndeterminate = false;
		}

		const handleCreate = () => {
			resetRuleForm()
			state.buttonDialog = true
		}

		const handleEdit = () => {
			state.ruleForm = state.buttonList[0]
			state.buttonDialog = true
		}

		const handleDelete = () => {
			ElMessageBox.confirm('此操作将批量删除按钮标签?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				var menuIds = []
				for (var m of state.buttonList) {
					menuIds.push(m.id)
				}
				batchMenuButton({
					menu_ids: menuIds
				}).then(() => {
					getMenuButton()
					ElNotification({
						type: 'success',
						message: '删除成功!',
					});
				})
			})
			.catch(() => {
				ElNotification({
					type: 'info',
					message: '已取消删除',
				});
			});
		}

		// 获取菜单下的所有按钮
		const getMenuButton = () => {
			menuButton(props.menu.id).then(res => {
				state.buttonList = []
				state.isIndeterminate = false
				state.pageButtons[props.menu.id] = res.data
			})
		}

		const handleSubmit = () => {
			state.ruleForm.parent = props.menu.id
			ruleFormRef.value.validate((valid) => {
				if (valid) {
					saveMenu(state.ruleForm).then(() => {
						getMenuButton()
						state.buttonDialog = false
						ElNotification({
							type: 'success',
							message: '保存按钮数据成功'
						})
					})
				}
			});
		}

		return {
			ruleFormRef,
			handleCheckChange,
			handleCheckAllChange,
			handleCreate,
			handleEdit,
			handleDelete,
			handleSubmit,
			...toRefs(state),
		};
	}
};
</script>

<style lang='scss' scoped>
	::v-deep(.el-divider--horizontal) {
		margin: 15px 0;
	}
</style>