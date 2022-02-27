<template>
  <el-form label-position="top" v-if="data" :key="data.key">
    <el-form-item label="标签标识" v-if="data.type !== 'grid'">
      <el-input v-model="data.model" />
    </el-form-item>

    <el-form-item label="标题" v-if="data.type !== 'grid'">
      <el-input v-model="data.label" />
    </el-form-item>

    <el-form-item label="宽度" v-if="hasKey('width')">
      <el-input v-model="data.options.width" />
    </el-form-item>

		<el-form-item label="标签宽度" v-if="hasKey('labelWidth')">
			<el-input-number v-model.number="data.options.labelWidth" />
		</el-form-item>

		<el-form-item label="隐藏标签" v-if="hasKey('hideLabel')">
			<el-switch v-model="data.options.hideLabel" />
		</el-form-item>

    <el-form-item label="占位内容" v-if="hasKey('placeholder')">
      <el-input v-model="data.options.placeholder" :type="data.type === 'textarea' ? 'textarea': ''" />
    </el-form-item>

    <el-form-item
      label="默认内容"
      v-if="
        hasKey('defaultValue') &&
          (data.type === 'input' ||
            data.type === 'password' ||
            data.type === 'textarea' ||
            data.type === 'text' ||
            data.type === 'rate' ||
            data.type === 'switch' ||
            data.type === 'slider')
      "
    >
      <el-input
        v-if="
          data.type === 'input' ||
            data.type === 'password' ||
            data.type === 'text'
        "
        v-model="data.options.defaultValue"
      />
      <el-input
        type="textarea"
        v-if="data.type === 'textarea'"
        v-model="data.options.defaultValue"
      />
      <el-rate
        v-if="data.type === 'rate'"
        v-model="data.options.defaultValue"
        :max="data.options.max"
        :allowHalf="data.options.allowHalf"
      />
      <el-switch
        v-if="data.type === 'switch'"
        v-model="data.options.defaultValue"
      />
      <template v-if="data.type === 'slider'">
        <el-input-number
          v-if="!data.options.range"
          v-model.number="data.options.defaultValue"
        />
        <template v-if="data.options.range">
          <el-input-number
            v-model.number="data.options.defaultValue[0]"
            :max="data.options.max"
          />
          <el-input-number
            v-model.number="data.options.defaultValue[1]"
            :max="data.options.max"
          />
        </template>
      </template>
    </el-form-item>

    <el-form-item label="最大长度" v-if="hasKey('maxlength')">
      <el-input v-model.number="data.options.maxlength" />
    </el-form-item>

    <el-form-item label="最大值" v-if="hasKey('max')">
      <el-input-number v-model.number="data.options.max" />
    </el-form-item>

    <el-form-item label="最小值" v-if="hasKey('min')">
      <el-input-number v-model.number="data.options.min" />
    </el-form-item>

    <el-form-item label="步长" v-if="hasKey('step')">
      <el-input-number v-model.number="data.options.step" :min="0" />
    </el-form-item>

    <el-form-item label="精度" v-if="hasKey('precision')">
      <el-input-number v-model.number="data.options.precision" :min="0" />
    </el-form-item>

		<el-form-item label="是否使用控制按钮" v-if="hasKey('controls')">
			<el-switch v-model="data.options.controls" />
		</el-form-item>

		<el-form-item label="控制按钮位置" v-if="data.options.controls && hasKey('controlsPosition')">
			<el-radio-group v-model="data.options.controlsPosition">
				<el-radio-button label="default">默认</el-radio-button>
				<el-radio-button label="right">右侧</el-radio-button>
			</el-radio-group>
		</el-form-item>

		<!--    <el-form-item label="前缀" v-if="hasKey('prefix')">-->
		<!--      <el-input v-model="data.options.prefix" />-->
		<!--    </el-form-item>-->

		<!--    <el-form-item label="后缀" v-if="hasKey('suffix')">-->
		<!--      <el-input v-model="data.options.suffix" />-->
		<!--    </el-form-item>-->

    <el-form-item label="前置标签" v-if="hasKey('prepend')">
      <el-input v-model="data.options.prepend" />
    </el-form-item>

    <el-form-item label="后置标签" v-if="hasKey('append')">
      <el-input v-model="data.options.append" />
    </el-form-item>

    <el-form-item label="选中时的内容" v-if="hasKey('activeText')">
      <el-input v-model="data.options.activeText" />
    </el-form-item>

    <el-form-item label="非选中时的内容" v-if="hasKey('inactiveText')">
      <el-input v-model="data.options.inactiveText" />
    </el-form-item>

    <el-form-item label="文本框可输入" v-if="hasKey('editable')">
      <el-switch v-model="data.options.editable" />
    </el-form-item>

    <el-form-item label="时间类型" v-if="data.type === 'date'">
			<el-select v-model="data.options.type" class="m-2" @change='handleSliderModeChange'>
				<el-option label="年" value="year"></el-option>
				<el-option label="月" value="month"></el-option>
				<el-option label="日期时间" value="datetime"></el-option>
				<el-option label="日期" value="date"></el-option>
				<el-option label="日期时间范围" value="datetimerange"></el-option>
				<el-option label="日期范围" value="daterange"></el-option>
			</el-select>
    </el-form-item>

    <el-form-item label="是否显示切换按钮" v-if="hasKey('showPassword')">
      <el-switch v-model="data.options.showPassword" />
    </el-form-item>

		<!--    <el-form-item label="是否显示字数" v-if="hasKey('showWordLimit')">-->
		<!--      <el-switch v-model="data.options.showWordLimit" />-->
		<!--    </el-form-item>-->

    <el-form-item label="是否自适应内容高度" v-if="hasKey('autosize')">
      <el-switch v-model="data.options.autosize" />
    </el-form-item>

    <el-form-item label="行数" v-if="hasKey('rows') && !data.options.autosize">
      <el-input-number v-model="data.options.rows" :min="0" />
    </el-form-item>

    <el-form-item label="是否允许半选" v-if="hasKey('allowHalf')">
      <el-switch v-model="data.options.allowHalf" />
    </el-form-item>

    <el-form-item label="布局方式" v-if="hasKey('inline')">
      <el-radio-group v-model="data.options.inline">
        <el-radio-button :label="true">行内</el-radio-button>
        <el-radio-button :label="false">块级</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="是否多选" v-if="hasKey('multiple')">
      <el-switch
        v-model="data.options.multiple"
        @change="handleSelectModeChange"
      />
    </el-form-item>

    <el-form-item label="是否可搜索" v-if="hasKey('filterable')">
      <el-switch v-model="data.options.filterable" />
    </el-form-item>

    <el-form-item label="选项" v-if="hasKey('options')">
			<div>
				<el-radio-group v-model="data.options.remote">
					<el-radio-button :label="false">静态数据</el-radio-button>
					<el-radio-button :label="true">远端数据</el-radio-button>
				</el-radio-group>
			</div>
      <div>
				<el-space
					v-if="data.options.remote"
					alignment="start"
					direction="vertical"
					style="margin-top: 10px;"
				>
					<el-input v-model="data.options.remoteFunc">
						<template #prepend>
							远端方法
						</template>
					</el-input>
					<el-input v-model="data.options.props.label">
						<template #prepend>
							标签
						</template>
					</el-input>
					<el-input v-model="data.options.props.value">
						<template #prepend>
							值
						</template>
					</el-input>
				</el-space>
				<template v-else>
					<div style="margin-top: 6px" v-if="hasKey('showLabel')">
						<el-checkbox v-model="data.options.showLabel" label="是否显示标签"></el-checkbox>
					</div>
					<template
						v-if="
            data.type === 'radio' ||
              (data.type === 'select' && !data.options.multiple)
          "
					>
						<el-radio-group
							v-model="data.options.defaultValue"
						>
							<Draggable
								tag="ul"
								item-key="index"
								ghostClass="ghost"
								:group="{ name: 'options' }"
								:list="data.options.options"
							>
								<transition-group name="fade" tag="div" v-for="(element, index) of data.options.options" :key='index'>
									<el-space direction="vertical" style='height: 40px;'>
										<div>
											<el-radio
												:label="element.value"
												style="margin-right: 0; margin-bottom: 0;"
											>
												<el-input
													:style="{
                          width: data.options.showLabel ? '90px' : '180px'
                        }"
													v-model="element.value"
												/>
												<el-input
													v-if="data.options.showLabel"
													:style="{
                          width: '90px'
                        }"
													v-model="element.label"
												/>
											</el-radio>
											<el-button
												style='position: relative; top: -6px; margin-left: 8px;'
												type="primary"
												circle
												@click="handleOptionsRemove(index)"
											>
												<SvgIcon name="fdelete" />
											</el-button>
										</div>
									</el-space>
								</transition-group>
							</Draggable>
						</el-radio-group>
					</template>

					<template
						v-if="
            data.type === 'checkbox' ||
              (data.type === 'select' && data.options.multiple)
          "
					>
						<el-checkbox-group
							v-model="data.options.defaultValue"
						>
							<Draggable
								tag="ul"
								item-key="index"
								ghostClass="ghost"
								:group="{ name: 'options' }"
								:list="data.options.options"
							>
								<transition-group name="fade" tag="div" v-for="(element, index) of data.options.options" :key='index'>
									<div class='fc_label_attribute_options'>
										<el-checkbox
											:label="element.value"
											style="margin-right: 0; margin-bottom: 0;"
										>
											<el-input
												:style="{
                        width: data.options.showLabel ? '90px' : '180px'
                      }"
												v-model="element.value"
											/>
											<el-input
												v-if="data.options.showLabel"
												v-model="element.label"
												:style="{ width: '90px' }"
											/>
										</el-checkbox>
										<el-button
											style='position: relative; top: -6px; margin-left: 8px;'
											type="primary"
											circle
											@click="handleOptionsRemove(index)"
										>
											<SvgIcon name="fdelete" />
										</el-button>
									</div>
								</transition-group>
							</Draggable>
						</el-checkbox-group>
					</template>

					<div>
						<el-button type="text" icon='Plus' @click="handleInsertOption">添加选项</el-button>
					</div>
				</template>
			</div>
    </el-form-item>

    <template v-if="data.type === 'date'">
      <el-form-item label="默认值">
        <el-date-picker
          style="width: 100%;"
          v-model="data.options.defaultValue"
          :format="data.options.format"
          :placeholder="data.options.placeholder"
          :type="data.options.type"
        />
      </el-form-item>
    </template>

    <template v-if="data.type === 'date'">
      <el-form-item label="格式">
        <el-input v-model="data.options.format" />
      </el-form-item>
    </template>

    <template v-if="data.type === 'img-upload'">
      <el-form-item label="模式">
        <el-radio-group v-model="data.options.listType">
          <el-radio-button label="text">text</el-radio-button>
          <el-radio-button label="picture">picture</el-radio-button>
          <el-radio-button label="picture-card">picture-card</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="文件参数名">
        <el-input v-model="data.options.name" />
      </el-form-item>

      <el-form-item label="上传地址">
        <el-input v-model="data.options.action" />
      </el-form-item>

      <el-form-item label="接受上传的文件类型(多个使用 , 隔开)">
        <el-input v-model="data.options.accept" />
      </el-form-item>

      <el-form-item label="最大上传数量">
        <el-input-number v-model.number="data.options.limit" :min="1" />
      </el-form-item>

      <el-form-item label="上传请求方法">
        <el-radio-group v-model="data.options.method">
          <el-radio-button label="post">POST</el-radio-button>
          <el-radio-button label="put">PUT</el-radio-button>
          <el-radio-button label="get">GET</el-radio-button>
          <el-radio-button label="delete">DELETE</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </template>

    <el-form-item label="远端数据" v-if="data.type === 'cascader'">
      <el-space direction="vertical" alignment="start">
        <el-input v-model="data.options.remoteFunc">
          <template #prepend>
            远端方法
          </template>
        </el-input>
        <el-input v-model="data.options.props.label">
          <template #prepend>
            标签
          </template>
        </el-input>
        <el-input v-model="data.options.props.value">
          <template #prepend>
            值
          </template>
        </el-input>
        <el-input v-model="data.options.props.children">
          <template #prepend>
            子选项
          </template>
        </el-input>
      </el-space>
    </el-form-item>

    <template v-if="data.type === 'grid'">
      <el-form-item label="栅格间隔">
        <el-input-number v-model.number="data.options.gutter" :min="0" />
      </el-form-item>

      <el-form-item label="列配置项" class='tag-attribute-list-item'>
				<div>
					<Draggable
						tag="ul"
						item-key="index"
						ghostClass="ghost"
						:group="{ name: 'options' }"
						:list="data.columns"
					>
						<transition-group name="fade" tag="div" v-for="(element, index) of data.columns" :key='index'>
							<li style="margin-bottom: 5px;" >
								<el-input-number
									placeholder="栅格值"
									v-model.number="element.span"
									:min="0"
									:max="24"
								/>
								<el-button
									type="primary"
									circle
									style="margin-left: 8px;"
									@click="handleOptionsRemove(index)"
								>
									<SvgIcon name="fdelete" />
								</el-button>
							</li>
						</transition-group>
					</Draggable>
				</div>
				<div>
					<el-button type="text" @click="handleInsertColumn" size="medium">
						添加列
					</el-button>
				</div>
      </el-form-item>

      <el-form-item label="垂直对齐方式">
        <el-radio-group v-model="data.options.align">
          <el-radio-button label="top">顶部对齐</el-radio-button>
          <el-radio-button label="middle">居中对齐</el-radio-button>
          <el-radio-button label="bottom">底部对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="水平排列方式">
        <el-select v-model="data.options.justify">
          <el-option value="start" label="左对齐" />
          <el-option value="end" label="右对齐" />
          <el-option value="center" label="居中" />
          <el-option value="space-around" label="两侧间隔相等" />
          <el-option value="space-between" label="两端对齐" />
        </el-select>
      </el-form-item>
    </template>

    <template v-if="data.type !== 'grid'">
      <el-form-item
				class='fc_label_attribute_operation'
        label="操作属性"
        v-if="
          hasKey('rules') ||
					hasKey('readonly') ||
					hasKey('disabled') ||
					hasKey('allowClear')
        "
      >
        <el-checkbox
          v-if="hasKey('rules')"
          v-model="data.options.rules.required">必填</el-checkbox
        >
        <el-checkbox v-if="hasKey('readonly')" v-model="data.options.readonly">只读</el-checkbox>
        <el-checkbox v-if="hasKey('disabled')" v-model="data.options.disabled">禁用</el-checkbox>
        <el-checkbox v-if="hasKey('clearable')" v-model="data.options.clearable">清除</el-checkbox>
      </el-form-item>

      <template v-if="hasKey('rules')">
        <h4>验证规则</h4>

        <el-form-item label="触发时机" class='mt10'>
          <el-radio-group v-model="data.options.rules.trigger">
            <el-radio-button label="blur">Blur</el-radio-button>
            <el-radio-button label="change">Change</el-radio-button>
          </el-radio-group>
        </el-form-item>

				<!--        <el-form-item label="枚举类型">-->
				<!--          <el-input v-model:value="data.options.rules.enum" />-->
				<!--        </el-form-item>-->

        <el-form-item label="标签长度">
          <el-input-number v-model.number="data.options.rules.len" />
        </el-form-item>

        <el-form-item label="最大长度">
          <el-input-number v-model.number="data.options.rules.max" />
        </el-form-item>

        <el-form-item label="最小长度">
          <el-input-number v-model.number="data.options.rules.min" />
        </el-form-item>

        <el-form-item label="提示内容">
          <el-input v-model="data.options.rules.message" />
        </el-form-item>

        <el-form-item label="校验类型">
          <el-select v-model="data.options.rules.type">
            <el-option v-for='item in checkOptions' :key='item.value' :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>

				<el-form-item label="正则表达式" v-if='data.options.rules.type === "regexp"'>
					<el-input v-model="data.options.rules.pattern" />
				</el-form-item>
      </template>
    </template>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, watch } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next'
import SvgIcon from '/@/components/svgIcon/index.vue';

export default defineComponent({
  name: 'ElWidgetConfig',
  components: {
    Draggable: VueDraggableNext,
    SvgIcon
  },
  props: {
    select: {
      type: Object
    }
  },
  emits: ['update:select'],
  setup(props, context) {
    const data = ref<any>(props.select);
		const state = reactive({
			checkOptions: [
				{value: 'string', label: '字符串'},
				{value: 'number', label: '数字'},
				{value: 'boolean', label: '布尔值'},
				{value: 'method', label: '方法'},
				{value: 'regexp', label: '正则表达式'},
				{value: 'integer', label: '整数'},
				{value: 'float', label: '浮点数'},
				{value: 'array', label: '数组'},
				{value: 'object', label: '对象'},
				{value: 'enum', label: '枚举'},
				{value: 'date', label: '时间'},
				{value: 'url', label: 'URL地址'},
				{value: 'hex', label: '十六进制'},
				{value: 'email', label: '邮箱地址'},
				{value: 'any', label: '任意类型'},
			]
		})

    watch(
      () => props.select,
      val => (data.value = val)
    )

    watch(data, val => context.emit('update:select', val), { deep: true })

    const hasKey = (key: string) =>
      Object.keys(data.value.options).includes(key)

    const handleInsertColumn = () => {
      data.value.columns.push({
        span: 0,
        list: []
      })
    }

    const handleInsertOption = () => {
      const index = data.value.options.options.length + 1
      data.value.options.options.push({
        label: `Option ${index}`,
        value: `Option ${index}`
      })
    }

    const handleOptionsRemove = (index: number) => {
      if (data.value.type === 'grid') {
        data.value.columns.splice(index, 1)
      } else {
        data.value.options.options.splice(index, 1)
      }
    }

    const handleSliderModeChange = () => {
      if (data.value.options.type === 'year') {
				data.value.options.format = 'YYYY'
			} else if (data.value.options.type === 'month') {
				data.value.options.format = 'MM'
			} else if (['date', 'daterange'].indexOf(data.value.options.type) !== -1) {
				data.value.options.format = 'YYYY-MM-DD'
			} else if (['datetime', 'datetimerange'].indexOf(data.value.options.type) !== -1) {
				data.value.options.format = 'YYYY-MM-DD HH:mm:ss'
			}
    }

    const handleSelectModeChange = (val: boolean) => {
      if (data.value.type === 'img-upload') {
        return
      }
      if (val) {
        if (data.value.options.defaultValue) {
          if (!(data.value.options.defaultValue instanceof Array)) {
            data.value.options.defaultValue = [data.value.options.defaultValue]
          }
        } else {
          data.value.options.defaultValue = []
        }
      } else {
        data.value.options.defaultValue.length
          ? (data.value.options.defaultValue =
              data.value.options.defaultValue[0])
          : (data.value.options.defaultValue = null)
      }
    }

    return {
      data,
      hasKey,
      handleInsertColumn,
      handleInsertOption,
      handleOptionsRemove,
      handleSliderModeChange,
      handleSelectModeChange,
			...toRefs(state)
    }
  }
})
</script>
