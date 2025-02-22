<template>
  <div class="fc-style">
    <el-form
      ref="generateFormRef"
      label-suffix=":"
      :model="model"
      :rules="rules"
      :size="widgetForm.config.size"
      :label-position="widgetForm.config.labelPosition"
      :label-width="`${widgetForm.config.labelWidth}px`"
      :hide-required-asterisk="widgetForm.config.hideRequiredAsterisk"
    >
      <template v-for="(element, index) of widgetForm.list">
        <template v-if="element.type === 'grid'">
          <el-row
            type="flex"
            v-if="element.key"
            :key="element.key"
            :gutter="element.options.gutter ?? 0"
            :justify="element.options.justify"
            :align="element.options.align"
          >
            <el-col
              v-for="(col, colIndex) of element.columns"
              :key="colIndex"
              :span="col.span ?? 0"
            >
              <ElGenerateFormItem
                v-for="colItem of col.list"
                :model="model"
                :key="colItem.key"
                :element="colItem"
                :config="data.config"
                :disabled="disabled"
              />
            </el-col>
          </el-row>
        </template>
				<template v-else-if="element.type === 'table'">
					<div
						v-if="element.key"
						:key="element.key"
						class="widget-view-table"
					>
						<table style='width: 100%'>
							<tr v-for='(rowItem, rowIndex) in element.rows' :key='rowIndex'>
								<td
									v-for='(columnItem, columnIndex) in rowItem.columns'
									:key='columnIndex'
									:style='{width: 100 / rowItem.columns.length + "%"}'
								>
									<ElGenerateFormItem
										v-for="colItem of columnItem.list"
										:model="model"
										:key="colItem.key"
										:element="colItem"
										:config="data.config"
										:disabled="disabled"
									/>
								</td>
							</tr>
						</table>
						<div class="widget-view-action widget-col-action" v-if="widgetFormSelect?.key === element.key">
							<SvgIcon name="fdelete" @click.stop="handleDeleteClick(index, widgetForm.list)" />
						</div>
						<div class="widget-view-drag widget-col-drag" v-if="widgetFormSelect?.key === element.key">
							<SvgIcon name="fmove" />
						</div>
					</div>
				</template>
        <ElGenerateFormItem
          v-else
          :model="model"
          :key="element.key"
          :element="widgetForm.list[index]"
          :config="data.config"
          :disabled="disabled"
        />
      </template>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch, ref } from 'vue'
import { ElMessage } from 'element-plus'
import ElGenerateFormItem from './ElGenerateFormItem.vue'
import { element } from '/@/components/formGenerator/config'

export default defineComponent({
  name: 'ElGenerateForm',
  components: {
    ElGenerateFormItem
  },
  props: {
    data: {
      type: Object,
      default: element.widgetForm
    },
    value: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
		const generateFormRef = ref();
    const state = reactive({
      model: {} as any,
      rules: {} as any,
      widgetForm:
        (props.data && JSON.parse(JSON.stringify(props.data))) ??
        element.widgetForm
    })

    const generateModel = (list: any[]) => {
      for (let index = 0; index < list.length; index++) {
        const model = list[index].model
        if (!model) {
          return
        }
        if (list[index].type === 'grid') {
          list[index].columns.forEach((col: any) => generateModel(col.list))
        } else {
          if (props.value && Object.keys(props.value).includes(model)) {
            state.model[model] = props.value[model]
          } else {
            state.model[model] = list[index].options.defaultValue
          }
          state.rules[model] = list[index].options.rules
        }
      }
    }

    const generateOptions = (list: any[]) => {
      list.forEach(item => {
        if (item.type === 'grid') {
          item.columns.forEach((col: any) => generateOptions(col.list))
        } else {
          if (item.options.remote && item.options.remoteFunc) {
            fetch(item.options.remoteFunc).then(resp => resp.json()).then(json => {
							if (json instanceof Array) {
								item.options.remoteOptions = json.map(data => ({
									label: data[item.options.props.label],
									value: data[item.options.props.value],
									children: data[item.options.props.children]
								}))
							}
						})
          }
        }
      })
    }

    watch(
      () => props.data,
      val => {
        state.widgetForm =
          (val && JSON.parse(JSON.stringify(val))) ?? element.widgetForm
        state.model = {}
        state.rules = {}
        generateModel(state.widgetForm.list)
        generateOptions(state.widgetForm.list)
      },
      { deep: true, immediate: true }
    )

    onMounted( () => {
      generateModel(state.widgetForm?.list ?? [])
      generateOptions(state.widgetForm?.list ?? [])
    })

    const getData = () => {
      return new Promise((resolve, reject) => {
				generateFormRef.value.validate().then((validate: boolean) => {
					if (validate) {
						resolve(state.model)
					} else {
						ElMessage.error('验证失败')
					}
				}).catch((error: Error) => {
					reject(error)
				})
      })
    }

    const reset = () => {
			generateFormRef.value.resetFields()
    }

    return {
			generateFormRef,
      getData,
      reset,
			...toRefs(state),
    }
  }
})
</script>
