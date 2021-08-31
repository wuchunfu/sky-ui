<template>
	<div class="system-user-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-input size="small" placeholder="请输入用户名" prefix-icon="el-icon-search" style="max-width: 180px"></el-input>
				<el-button size="small" type="primary" class="ml10">查询</el-button>
			</div>
			<el-table :data="tableData.data" stripe style="width: 100%" size="small">
				<el-table-column prop="num" label="ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="用户名" show-overflow-tooltip></el-table-column>
				<el-table-column prop="phone" label="手机" show-overflow-tooltip></el-table-column>
				<el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
				<el-table-column prop="sex" label="性别" show-overflow-tooltip></el-table-column>
				<el-table-column prop="time" label="加入时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="path" label="操作" width="90">
					<template #default="scope">
						<el-button size="mini" type="text">修改</el-button>
						<el-button size="mini" type="text" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination v-show="tableData.total>0" :total="tableData.total" v-model:page="listQuery.page" v-model:limit="listQuery.limit" @pagination="getList" />
		</el-card>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted } from 'vue';
import Pagination from '/@/components/pagination/index.vue'
export default {
	name: 'systemUser',
	components: { Pagination },
	setup() {
		const state: any = reactive({
			tableData: {
				data: [],
				total: 100,
			},
			listQuery: {
				page: 1,
				limit: 10
			}
		});
		function getList() {}

		// 初始化表格数据
		const initTableData = () => {
			const data: Array<object> = [];
			for (let i = 0; i < 20; i++) {
				data.push({
					num: `00${i + 1}`,
					name: (Math.round(Math.random() * 20901) + 19968).toString(16),
					photo: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1633081619,2004077072&fm=26&gp=0.jpg',
					phone: Math.floor(Math.random() * 10000000000),
					email: `${Math.floor(Math.random() * 1000)}@qq.com`,
					sex: i % 2 === 0 ? '男' : '女',
					time: new Date().toLocaleDateString(),
				});
			}
			state.tableData.data = data;
			state.tableData.total = state.tableData.data.length;
		};
		// 当前行删除
		const onRowDel = (row: object) => {
			console.log(row);
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		return {
			onRowDel,
			getList,
			...toRefs(state),
		};
	},
};
</script>

<style scoped lang="scss">
.system-user-container {
	.system-user-search {
		text-align: right;
	}
	.system-user-photo {
		width: 40px;
		height: 40px;
		border-radius: 100%;
	}
}
</style>
