<template>
	<div :class="{'hidden':hidden}" class="pagination-container">
		<el-pagination
			:background="background"
			v-model:current-page="currentPage"
			v-model:page-size="pageSize"
			:layout="layout"
			:page-sizes="pageSizes"
			:total="total"
			v-bind="$attrs"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
	</div>
</template>

<script lang="ts">
import { computed } from 'vue'
export default {
	name: 'Pagination',
	props: {
		total: {
			required: true,
			type: Number
		},
		page: {
			type: Number,
			default: 1
		},
		limit: {
			type: Number,
			default: 20
		},
		pageSizes: {
			type: Array,
			default() {
				return [10, 20, 30, 50]
			}
		},
		layout: {
			type: String,
			default: 'total, sizes, prev, pager, next, jumper'
		},
		background: {
			type: Boolean,
			default: true
		},
		autoScroll: {
			type: Boolean,
			default: true
		},
		hidden: {
			type: Boolean,
			default: false
		}
	},
	setup(props: any, context: any) {
		function handleSizeChange(val:number) {
			context.emit('pagination', { page: props.currentPage, limit: val })
			if (props.autoScroll) {
				scrollTo(0, 800)
			}
		}

		function handleCurrentChange(val:number) {
			context.emit('pagination', { page: val, limit: props.pageSize })
			if (props.autoScroll) {
				scrollTo(0, 800)
			}
		}

		const currentPage = computed({
			get() {
				return props.page
			},
			set(val) {
				context.emit('update:page', val)
			}
		})

		const pageSize = computed({
			get() {
				return props.limit
			},
			set(val) {
				context.emit('update:limit', val)
			}
		})

		return {
			handleSizeChange,
			handleCurrentChange,
			currentPage,
			pageSize
		};
	}
};
</script>

<style lang='scss' scoped>
.pagination-container {
	background: #fff;
	padding: 20px 0 5px 0;
}
.pagination-container.hidden {
	display: none;
}
::v-deep(.el-pagination.is-background .btn-next) {
	padding-left: 10px;
}
::v-deep(.el-pagination.is-background .btn-prev) {
	padding-left: 10px;
}
</style>