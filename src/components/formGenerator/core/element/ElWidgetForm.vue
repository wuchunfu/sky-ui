<template>
  <div class="widget-form-container">
		<div v-if="!widgetForm.list || widgetForm.list.length === 0" class="form-empty">
			从左侧拖拽来添加标签
		</div>
    <el-form
      label-suffix=":"
      :size="widgetForm.config.size"
      :label-position="widgetForm.config.labelPosition"
      :label-width="`${widgetForm.config.labelWidth}px`"
      :hide-required-asterisk="widgetForm.config.hideRequiredAsterisk"
    >
      <Draggable
        class="widget-form-list"
        item-key="key"
        ghostClass="ghost"
        :animation="200"
        :group="{ name: 'people' }"
        :list="widgetForm.list"
        @add="handleMoveAdd"
      >
				<transition-group name="fade" tag="div" v-for="(element, index) of widgetForm.list" :key='index'>
					<template v-if="element.type === 'grid'">
						<el-row
							class="widget-col widget-view"
							type="flex"
							v-if="element.key"
							:key="element.key"
							:class="{ active: widgetFormSelect?.key === element.key }"
							:gutter="element.options.gutter ?? 0"
							:justify="element.options.justify"
							:align="element.options.align"
							@click="handleItemClick(element)"
						>
							<el-col
								v-for="(col, colIndex) of element.columns"
								:key="colIndex"
								:span="col.span ?? 0"
							>
								<Draggable
									class="widget-col-list"
									item-key="key"
									ghostClass="ghost"
									:animation="200"
									:group="{ name: 'people' }"
									:no-transition-on-drag="true"
									:list="col.list"
									@add="handleColMoveAdd($event, element, colIndex)"
								>
									<transition-group name="fade" tag="div" v-for="(element, index) of col.list" :key='index'>
										<ElWidgetFormItem
											v-if="element.key"
											:key="element.key"
											:element="element"
											:config="widgetForm.config"
											:selectWidget="widgetFormSelect"
											@click.stop="handleItemClick(element)"
											@copy="handleCopyClick(index, col.list)"
											@delete="handleDeleteClick(index, col.list)"
										/>
									</transition-group>
								</Draggable>
							</el-col>
							<div
								class="widget-view-action widget-col-action"
								v-if="widgetFormSelect?.key === element.key"
							>
								<SvgIcon
									name="fdelete"
									@click.stop="handleDeleteClick(index, widgetForm.list)"
								/>
							</div>

							<div
								class="widget-view-drag widget-col-drag"
								v-if="widgetFormSelect?.key === element.key"
							>
								<SvgIcon name="fmove" />
							</div>
						</el-row>
					</template>
					<template v-else-if='element.type === "table"'>
						<div
							class="widget-col widget-view-table widget-view"
							:class="{ active: widgetFormSelect?.key === element.key }"
							@click="handleItemClick(element)"
						>
							<table
								style='width: 100%'
							>
								<tr v-for='(rowItem, rowIndex) in element.rows' :key='rowIndex'>
									<td
										class="widget-col widget-view"
										v-for='(columnItem, columnIndex) in rowItem.columns'
										:key='columnIndex'
										@click.stop="handleItemClick(columnItem)"
										:class="{ active: widgetFormSelect?.key === columnItem.key }"
										:colspan="columnItem.options.colspan"
										:rowspan="columnItem.options.rowspan"
									>
										<Draggable
											class="widget-col-list"
											item-key="key"
											ghostClass="ghost"
											:animation="200"
											:group="{ name: 'people' }"
											:no-transition-on-drag="true"
											:list="columnItem.list"
											@add="handleColMoveAdd($event, columnItem, columnIndex)"
										>
											<transition-group name="fade" tag="div" v-for="(element, index) of columnItem.list" :key='index'>
												<ElWidgetFormItem
													v-if="element.key"
													:key="element.key"
													:element="element"
													:config="widgetForm.config"
													:selectWidget="widgetFormSelect"
													@click.stop="handleItemClick(element)"
													@copy="handleCopyClick(index, columnItem.list)"
													@delete="handleDeleteClick(index, columnItem.list)"
												/>
											</transition-group>
										</Draggable>
										<div
											class="widget-view-action widget-col-action"
											v-if="widgetFormSelect?.key === columnItem.key"
										>
											<el-dropdown trigger="click" class='widget-col-action-dropdown' size='small' placement='bottom-end'>
												<SvgIcon
													name="table-settings"
												/>
												<template #dropdown>
													<el-dropdown-menu>
														<el-dropdown-item @click.stop='handleAddTdClick(columnIndex, "leftCol")'>左插入列</el-dropdown-item>
														<el-dropdown-item @click.stop='handleAddTdClick(columnIndex, "rightCol")'>右插入列</el-dropdown-item>
														<el-dropdown-item @click.stop='handleAddTdClick(rowIndex, "topRow")'>上插入行</el-dropdown-item>
														<el-dropdown-item @click.stop='handleAddTdClick(rowIndex, "bottomRow")'>下插入行</el-dropdown-item>
<!--														<el-dropdown-item-->
<!--															divided-->
<!--															:disabled='columnItem.options.rowspan !== 1 || columnIndex === rowItem.columns?.length - 1'-->
<!--															@click.stop='columnItem.options.rowspan !== 1 || columnIndex === rowItem.columns?.length - 1 ? "" : handleMergeClick(rowIndex, columnIndex, "right")'-->
<!--														>向右合并</el-dropdown-item>-->
<!--														<el-dropdown-item-->
<!--															@click.stop='columnItem.options.colspan !== 1 || columnItem.options.rowspan + rowIndex === element.rows?.length ? "" : handleMergeClick(rowIndex, columnIndex, "bottom")'-->
<!--															:disabled='columnItem.options.colspan !== 1 || columnItem.options.rowspan + rowIndex === element.rows?.length'-->
<!--														>向下合并</el-dropdown-item>-->
<!--														<el-dropdown-item divided>拆分成列</el-dropdown-item>-->
<!--														<el-dropdown-item>拆分成行</el-dropdown-item>-->
														<el-dropdown-item
															divided
															:disabled='columnItem.options.colspan !== 1 || rowItem.columns?.length === 1'
															@click.stop="columnItem.options.colspan !== 1 || rowItem.columns?.length === 1 ? '' : handleDeleteTdClick(rowIndex, columnIndex, element.key, 'col')"
														>删除当前列</el-dropdown-item>
														<el-dropdown-item
															:disabled='columnItem.options.rowspan !== 1 || element.rows?.length === 1'
															@click.stop="columnItem.options.rowspan !== 1 || element.rows?.length === 1 ? '' : handleDeleteTdClick(rowIndex, columnIndex, element.key, 'row')"
														>删除当前行</el-dropdown-item>
													</el-dropdown-menu>
												</template>
											</el-dropdown>
										</div>
									</td>
								</tr>
							</table>
							<div class="widget-view-action widget-col-action widget-view-table-action" v-if="widgetFormSelect?.key === element.key">
								<SvgIcon name="charuhang" @click.stop="handleInsertRow(element.rows)" />
								<SvgIcon name="charulie" style='margin-left: 5px' @click.stop="handleInsertCol(element.rows)" />
								<SvgIcon name="fdelete" style='margin-left: 5px' @click.stop="handleDeleteClick(index, widgetForm.list)" />
							</div>
							<div class="widget-view-drag widget-col-drag" v-if="widgetFormSelect?.key === element.key">
								<SvgIcon name="fmove" />
							</div>
						</div>
					</template>
					<template v-else>
						<ElWidgetFormItem
							v-if="element.key"
							:key="element.key"
							:element="element"
							:config="widgetForm.config"
							:selectWidget="widgetFormSelect"
							@click="handleItemClick(element)"
							@copy="handleCopyClick(index, widgetForm.list)"
							@delete="handleDeleteClick(index, widgetForm.list)"
						/>
					</template>
				</transition-group>
      </Draggable>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, PropType } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next'
import { v4 } from 'uuid'
import ElWidgetFormItem from './ElWidgetFormItem.vue'
import SvgIcon from '/@/components/svgIcon/index.vue';
import { WidgetForm, tableRowCol } from '/@/components/formGenerator/config/element'

export default defineComponent({
  name: 'ElWidgetForm',
  components: {
    SvgIcon,
    Draggable: VueDraggableNext,
    ElWidgetFormItem
  },
  props: {
    widgetForm: {
      type: Object as PropType<WidgetForm>,
      required: true
    },
    widgetFormSelect: {
      type: Object
    }
  },
  emits: ['update:widgetForm', 'update:widgetFormSelect'],
  setup(props, context) {
    const handleItemClick = (row: any) => {
      context.emit('update:widgetFormSelect', row)
    }

		const handleListInsert = (key: string, list: any[], obj: any) => {
			const newList: any[] = []
			list.forEach(item => {
				if (item.key === key) {
					newList.push(item)
					newList.push(obj)
				} else {
					if (item.columns) {
						item.columns = item.columns.map((col: any) => ({
							...col,
							list: handleListInsert(key, col.list, obj)
						}))
					} else if (item.rows) {
						for (let row of item.rows) {
							row.columns = row.columns.map((col: any) => ({
								...col,
								list: handleListInsert(key, col.list, obj)
							}))
						}
					}
					newList.push(item)
				}
			})
			return newList
		}

		const handleListDelete = (key: string, list: any[]) => {
			const newList: any[] = []
			list.forEach(item => {
				if (item.key !== key) {
					if (item.columns) {
						item.columns = item.columns.map((col: any) => ({
							...col,
							list: handleListDelete(key, col.list)
						}))
					} else if (item.rows) {
						for (let row of item.rows) {
							row.columns = row.columns.map((col: any) => ({
								...col,
								list: handleListDelete(key, col.list)
							}))
						}
					}
					newList.push(item)
				}
			})
			return newList
		}

    const handleCopyClick = (index: number, list: any[]) => {
      const key = getKey()
			const oldList = JSON.parse(JSON.stringify(props.widgetForm.list))

      let copyData = {
        ...list[index],
        key,
        model: `${list[index].type}_${key}`,
        rules: list[index].rules ?? []
      }

      if (
        list[index].type === 'radio' ||
        list[index].type === 'checkbox' ||
        list[index].type === 'select'
      ) {
        copyData = {
          ...copyData,
          options: {
            ...copyData.options,
            options: copyData.options.options.map((item: any) => ({ ...item }))
          }
        }
      }

      context.emit('update:widgetForm', {
        ...props.widgetForm,
        list: handleListInsert(list[index].key, oldList, copyData)
      })

      context.emit('update:widgetFormSelect', copyData)
    }

    const handleDeleteClick = (index: number, list: any[]) => {
      const oldList = JSON.parse(JSON.stringify(props.widgetForm.list))

      if (list.length - 1 === index) {
        if (index === 0) {
          nextTick(() => context.emit('update:widgetFormSelect', null))
        } else {
          context.emit('update:widgetFormSelect', list[index - 1])
        }
      } else {
        context.emit('update:widgetFormSelect', list[index + 1])
      }

			context.emit('update:widgetForm', {
				...props.widgetForm,
				list: handleListDelete(list[index].key, oldList)
			})
    }

    const newCol = () => {
			let col = JSON.parse(JSON.stringify(tableRowCol))
			col.key = getKey()
			return col
    }

    // const handleMergeClick = (rowIndex: number, index: number, type: string) => {
		// 	let newList: any[] = []
		// 	const oldList = JSON.parse(JSON.stringify(props.widgetForm.list))
		// 	oldList.map((item: any) => {
		// 		item.rows.map((rowItem: any, rIndex: any) => {
		// 			if (rIndex === rowIndex && rowItem.columns) {
		// 				if (type === 'right') {
		// 					rowItem.columns[index].list.push(...rowItem.columns[index + 1].list)
		// 					rowItem.columns[index].options.colspan += rowItem.columns[index + 1].options.colspan
		// 					rowItem.columns.splice(index + 1, 1)
		// 					return
		// 				} else {
		//
		// 					getCollList(index, oldList)
		//
		// 					// let nextIndex = index
		// 					// let nextRowIndex = rowIndex + rowItem.columns[index].options.rowspan
		// 					// if (rowItem.columns.length !== item.rows[nextRowIndex].columns.length) {
		// 					// 	nextIndex = index - Math.abs(rowItem.columns.length - item.rows[nextRowIndex].columns.length);
		// 					// }
		// 					// rowItem.columns[index].list.push(...item.rows[nextRowIndex].columns[nextIndex].list)
		// 					// rowItem.columns[index].options.rowspan += item.rows[nextRowIndex].columns[nextIndex].options.rowspan
		// 					// item.rows[nextRowIndex].columns.splice(index, 1)
		// 					// return
		// 				}
		// 			}
		// 		})
		// 		newList.push(item)
		// 	})
		//
		// 	context.emit('update:widgetForm', {
		// 		...props.widgetForm,
		// 		list: newList
		// 	})
    // }

    const handleAddTdClick = (index: number, type: string) => {
			let newList: any[] = []
			const oldList = JSON.parse(JSON.stringify(props.widgetForm.list))
			oldList.map((item: any) => {
				if (type === 'leftCol' || type === 'rightCol') {
					for (let row of item.rows) {
						if (type === 'leftCol') {
							row.columns.splice(index, 0, newCol())
						} else {
							row.columns.splice(index + 1, 0, newCol())
						}
					}
				} else if (type === 'topRow' || type === 'bottomRow') {
					let cols = []
					for (let i = 0; i < item.rows[0].columns.length; i++) {
						cols.push(newCol())
					}
					if (type === 'topRow') {
						item.rows.splice(index, 0, {columns: cols})
					} else {
						item.rows.splice(index + 1, 0, {columns: cols})
					}
				}
				newList.push(item)
			})

			context.emit('update:widgetForm', {
				...props.widgetForm,
				list: newList
			})
    }

    const handleDeleteTdClick = (rowIndex: number, colIndex: number, key: string, type: string) => {
			let newList: any[] = []
			const oldList = JSON.parse(JSON.stringify(props.widgetForm.list))
			let selectData: any = {}
			oldList.map((item: any) => {
				if (item.key === key) {
					let columns: any[] = []
					if (type === 'row') {
						item.rows.splice(rowIndex, 1)
					} else if (type === 'col') {
						for (let rIndex in item.rows) {
							if (item.rows.length === 1) {
								item.rows[rIndex].columns.splice(colIndex, 1)
							} else {
								if (parseInt(rIndex) > 0) {
									if (item.rows[rIndex].columns.length > item.rows[0].columns.length) {
										item.rows[rIndex].columns.splice(colIndex, 1)
									}
								} else {
									item.rows[rIndex].columns.splice(colIndex, 1)
								}
							}
						}
					}
					if (item.rows.length === rowIndex) {
						columns = item.rows[rowIndex - 1].columns
					} else {
						columns = item.rows[rowIndex].columns
					}
					if (columns.length === colIndex) {
						selectData = columns[colIndex - 1]
					} else {
						selectData = columns[colIndex]
					}
				}
				newList.push(item)
			})

			context.emit('update:widgetForm', {
				...props.widgetForm,
				list: newList
			})

			context.emit('update:widgetFormSelect', selectData)
    }

    const handleMoveAdd = (event: any) => {
      const { newIndex } = event

      const key = getKey()
      const list = JSON.parse(JSON.stringify(props.widgetForm.list))

      list[newIndex] = {
        ...list[newIndex],
        key,
        model: `${list[newIndex].type}_${key}`,
        rules: []
      }

      if (
        list[newIndex].type === 'radio' ||
        list[newIndex].type === 'checkbox' ||
        list[newIndex].type === 'select'
      ) {
        list[newIndex] = {
          ...list[newIndex],
          options: {
            ...list[newIndex].options,
            options: list[newIndex].options.options.map((item: any) => ({
              ...item
            }))
          }
        }
      }

      if (list[newIndex].type === 'grid') {
        list[newIndex] = {
          ...list[newIndex],
          columns: list[newIndex].columns.map((item: any) => ({ ...item }))
        }
      } else if (list[newIndex].type === 'table') {
				list[newIndex].rows[0].columns[0].key = getKey()
			}

      context.emit('update:widgetForm', { ...props.widgetForm, list })

      context.emit('update:widgetFormSelect', list[newIndex])
    }

		const handleAddColumns = (row: { list: { [x: string]: any; }; }, newIndex: string | number, key: any) => {
			row.list[newIndex] = {
				...row.list[newIndex],
				key,
				model: `${row.list[newIndex].type}_${key}`,
				rules: []
			}

			if (
				row.list[newIndex].type === 'radio' ||
				row.list[newIndex].type === 'checkbox' ||
				row.list[newIndex].type === 'select'
			) {
				row.list[newIndex] = {
					...row.list[newIndex],
					options: {
						...row.list[newIndex].options,
						options: row.list[
							newIndex
							].options.options.map((item: any) => ({ ...item }))
					}
				}
			}

			context.emit('update:widgetFormSelect', row.list[newIndex])
		}

    const handleColMoveAdd = (
      event: any,
      row: any,
      index: string | number | symbol
    ) => {
      const { newIndex, oldIndex, item } = event
      const list = JSON.parse(JSON.stringify(props.widgetForm.list))

      if (item.className.includes('data-grid')) {
        item.tagName === 'DIV' &&
          list.splice(oldIndex, 0, row.columns[index].list[newIndex])
        row.columns[index].list.splice(newIndex, 1)
        return false
      }

      const key = getKey()

			if (row.type === 'td') {
				handleAddColumns(row, newIndex, key)
			} else {
				handleAddColumns(row.columns[index], newIndex, key)
			}
    }

    const handleInsertRow = (rows: any) => {
			let cols = []
			for (let i = 0; i < rows[0].columns.length; i++) {
				cols.push(newCol())
			}
			rows.push({
				columns: cols
			})
    }

		const handleInsertCol = (rows: any) => {
			for (let r of rows) {
				r.columns.push(newCol())
			}
		}

		const getKey = () => {
			return v4().replaceAll('-', '').substr(0,20)
		}

    return {
      handleItemClick,
      handleCopyClick,
      handleDeleteClick,
			handleDeleteTdClick,
			handleAddTdClick,
			// handleMergeClick,
      handleMoveAdd,
      handleColMoveAdd,
			handleInsertRow,
			handleInsertCol
    }
  }
})
</script>
