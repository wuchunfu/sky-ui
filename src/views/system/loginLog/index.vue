<template>
	<div>
		<el-card shadow="hover">
			<div class="system-user-search mb10">
				<el-input v-model='listQuery[searchField]' placeholder="请输入搜索内容" @keyup.enter.native='getList' prefix-icon="Search" style="max-width: 500px">
					<template #prepend>
						<el-select v-model="searchField" placeholder="请选择" style='width: 115px;' class='input-select-search'>
							<el-option label="用户名" value="username"></el-option>
							<el-option label="状态" value="status"></el-option>
							<el-option label="IP地址" value="ip"></el-option>
							<el-option label="浏览器" value="browser"></el-option>
							<el-option label="系统" value="system"></el-option>
						</el-select>
					</template>
					<template #append>
						<el-button icon="Search" @click='getList'></el-button>
					</template>
				</el-input>
			</div>
			<el-table :data="list" border stripe style="width: 100%" v-loading="loading" size='small'>
				<el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="状态" show-overflow-tooltip></el-table-column>
				<el-table-column prop='ip' label="IP地址" show-overflow-tooltip></el-table-column>
				<el-table-column prop='browser' label="浏览器" show-overflow-tooltip></el-table-column>
				<el-table-column prop='system' label="系统" show-overflow-tooltip></el-table-column>
				<el-table-column label="登陆时间" show-overflow-tooltip>
					<template #default='{row}'>
						{{ parseTime(row.create_time) }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="80" v-auths="['system:loginLog:delete']">
					<template #default="scope">
						<el-button size="small" type="text" @click="handleDelete(scope.row.id)" icon='Delete'>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination v-show="total>0" :total="total" v-model:page="listQuery.page" v-model:size="listQuery.size" @pagination="getList" />
		</el-card>
	</div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, defineComponent } from 'vue';
import Pagination from '/@/components/pagination/index.vue';
import { ElNotification, ElMessageBox } from 'element-plus';
import { parseTime } from '/@/utils/formatTime';
import {
	getLoginLogList, deleteLoginLog
} from '/@/api/system/loginLog'
export default defineComponent({
	name: 'SystemLoginLog',
	components: { Pagination },
	setup: function() {
		const ruleFormRef = ref();
		const state: any = reactive({
			searchField: 'username',
			loading: false,
			list: [],
			total: 0,
			listQuery: {
				page: 1,
				size: 10,
			},
		});

		const getList = () => {
			state.loading = true
			if (state.listQuery[state.searchField] && state.searchField == "") {
				ElNotification({
					type: 'warning',
					message: '未选择需要搜索的字段',
				});
				state.loading = false
			} else {
				getLoginLogList(state.listQuery).then(res => {
					state.list = res.data.list;
					state.total = res.data.total;
					state.loading = false
				});
			}
		};

		const handleDelete = (id:number) => {
			ElMessageBox.confirm('确认是否删除此登陆日志?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				deleteLoginLog(id).then(() => {
					getList()
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

		// 页面加载时
		onMounted(() => {
			getList();
		});
		return {
			ruleFormRef,
			parseTime,
			getList,
			handleDelete,
			...toRefs(state),
		};
	},
})
</script>

<style lang='scss' scoped>
	::v-deep(.system-user-search .el-input__suffix) {
		top: -3px;
	}
</style>
