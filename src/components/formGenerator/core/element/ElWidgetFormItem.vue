<template>
	<div class="widget-item-container">
		<el-form-item
			class="widget-view"
			v-if="element"
			:key="element.key"
			:class="{ active: selectWidget?.key === element.key, 'widget-view-alert': element.type === 'alert' }"
			:label="element.options.hideLabel ? '' : element.label"
			:label-width="element.options.hideLabel ? '0' : element.options.labelWidth + 'px'"
			:rules="element.options.rules"
			style='padding: 5px;'
		>
			<template v-if="element.type === 'input'">
				<el-input
					readonly
					:modelValue="element.options.defaultValue"
					:style="{ width: element.options.width }"
					:placeholder="element.options.placeholder"
					:maxlength="parseInt(element.options.maxlength)"
					:clearable="element.options.clearable"
					:disabled="element.options.disabled"
				>
					<template #prefix v-if="element.options.prefix">{{ element.options.prefix }}</template>
					<template #suffix v-if="element.options.suffix">{{ element.options.suffix }}</template>
					<template #prepend v-if="element.options.prepend">{{ element.options.prepend }}</template>
					<template #append v-if="element.options.append">{{ element.options.append }}</template>
				</el-input>
			</template>

			<template v-if="element.type === 'password'">
				<el-input
					readonly
					:modelValue="element.options.defaultValue"
					:style="{ width: element.options.width }"
					:placeholder="element.options.placeholder"
					:maxlength="parseInt(element.options.maxlength)"
					:clearable="element.options.clearable"
					:disabled="element.options.disabled"
					:show-password="element.options.showPassword"
				>
					<template #prefix v-if="element.options.prefix">
						{{ element.options.prefix }}
					</template>
					<template #suffix v-if="element.options.suffix">
						{{ element.options.suffix }}
					</template>
					<template #prepend v-if="element.options.prepend">
						{{ element.options.prepend }}
					</template>
					<template #append v-if="element.options.append">
						{{ element.options.append }}
					</template>
				</el-input>
			</template>

			<template v-if="element.type === 'textarea'">
				<el-input
					type="textarea"
					resize="none"
					readonly
					:rows="element.options.rows"
					:modelValue="element.options.defaultValue"
					:style="{ width: element.options.width }"
					:placeholder="element.options.placeholder"
					:maxlength="parseInt(element.options.maxlength)"
					:show-word-limit="element.options.showWordLimit"
					:autosize="element.options.autosize"
					:disabled="element.options.disabled"
				/>
			</template>

			<template v-if="element.type === 'number'">
				<el-input-number
					:modelValue="element.options.defaultValue"
					:style="{ width: element.options.width }"
					:max="element.options.max"
					:min="element.options.min"
					:step="element.options.step"
					:precision="element.options.precision"
					:controls="element.options.controls"
					:controls-position="element.options.controlsPosition"
					:disabled="element.options.disabled"
				/>
			</template>

			<template v-if="element.type === 'radio'">
				<el-radio-group
					:modelValue="element.options.defaultValue"
					:style="{ width: element.options.width}"
					:disabled="element.options.disabled"
					:class='element.options.inline ? "" : "select-box"'
					class=''
				>
					<el-radio
						v-for="item of element.options.options"
						:key="item.value"
						:label="item.value"
						:style="{marginRight: element.options.inline ? '' : '32px'}"
					>
						{{ element.options.showLabel ? item.label : item.value }}
					</el-radio>
				</el-radio-group>
			</template>

			<template v-if="element.type === 'checkbox'">
				<el-checkbox-group
					:modelValue="element.options.defaultValue"
					:style="{ width: element.options.width }"
					:disabled="element.options.disabled"
				>
					<el-checkbox
						v-for="item of element.options.options"
						:key="item.value"
						:label="item.value"
						:style="{
              display: element.options.inline ? 'inline-block' : 'block'
            }"
					>{{ element.options.showLabel ? item.label : item.value }}
					</el-checkbox>
				</el-checkbox-group>
			</template>

			<template v-if="element.type === 'date'">
				<el-date-picker
					:type="element.options.type"
					:modelValue="element.options.defaultValue"
					:placeholder="element.options.placeholder"
					:start-placeholder="element.options.startPlaceholder"
					:end-placeholder="element.options.endPlaceholder"
					:readonly="element.options.readonly"
					:editable="element.options.editable"
					:clearable="element.options.clearable"
					:format="element.options.format"
					:disabled="element.options.disabled"
					:style="{ width: element.options.width }"
				/>
			</template>

			<template v-if="element.type === 'rate'">
				<el-rate
					:modelValue="element.options.defaultValue"
					:max="element.options.max"
					:allowHalf="element.options.allowHalf"
					:disabled="element.options.disabled"
				/>
			</template>

			<template v-if="element.type === 'color'">
				<el-color-picker
					:modelValue="element.options.defaultValue"
					:size="element.options.size"
					:showAlpha="element.options.showAlpha"
					:colorFormat="element.options.colorFormat"
					:popperClass="element.options.popperClass"
					:predefine="element.options.predefine"
					:disabled="element.options.disabled"
				/>
			</template>

			<template v-if="element.type === 'select'">
				<el-select
					:modelValue="element.options.defaultValue"
					:multiple="element.options.multiple"
					:placeholder="element.options.placeholder"
					:clearable="element.options.clearable"
					:filterable="element.options.filterable"
					:disabled="element.options.disabled"
					:style="{ width: element.options.width }"
				>
					<el-option
						v-for="item of element.options.options"
						:key="item.value"
						:value="item.value"
						:label="element.options.showLabel ? item.label : item.value"
					/>
				</el-select>
			</template>

			<template v-if="element.type === 'switch'">
				<el-switch
					:modelValue="element.options.defaultValue"
					:active-text="element.options.activeText"
					:inactive-text="element.options.inactiveText"
					:disabled="element.options.disabled"
				/>
			</template>

			<template v-if="element.type === 'slider'">
				<el-slider
					:modelValue="element.options.defaultValue"
					:min="element.options.min"
					:max="element.options.max"
					:step="element.options.step"
					:range="element.options.range"
					:disabled="element.options.disabled"
					:style="{ width: element.options.width }"
				/>
			</template>

			<template v-if="element.type === 'text'">
				<span>{{ element.options.defaultValue }}</span>
			</template>

			<template v-if="element.type === 'html'">
				<span v-html='element.options.defaultValue'></span>
			</template>

			<template v-if="element.type === 'button'">
				<el-button
					:size='element.options.size'
					:type='element.options.type'
					:plain='element.options.plain'
					:round='element.options.round'
					:circle='element.options.circle'
					:icon='element.options.icon'
					:autoInsertSpace='element.options.autoInsertSpace'
					:disabled='element.options.disabled'
				>
					{{ element.options.name }}
				</el-button>
			</template>

			<template v-if="element.type === 'link'">
				<el-link
					:type='element.options.type'
					:underline='element.options.underline'
					:href='element.options.href'
					:icon='element.options.icon'
					:disabled='element.options.disabled'
					:target='element.options.target ? "_blank": undefined'
				>
					{{ element.options.name }}
				</el-link>
			</template>

			<template v-if="element.type === 'img-upload'">
				<el-upload
					:name="element.options.file"
					:action="element.options.action"
					:accept="element.options.accept"
					:file-list="element.options.defaultValue"
					:listType="element.options.listType"
					:multiple="element.options.multiple"
					:limit="element.options.limit"
					:disabled="element.options.disabled"
				>
					<SvgIcon
						v-if="element.options.listType === 'picture-card'"
						name="insert"
					/>
					<el-button v-else>
						<SvgIcon name="img-upload" style="margin-right: 10px;" />
						点击上传
					</el-button>
				</el-upload>
			</template>

			<template v-if="element.type === 'cascader'">
				<el-cascader
					:modelValue="element.options.defaultValue"
					:options="element.options.remoteOptions"
					:placeholder="element.options.placeholder"
					:filterable="element.options.filterable"
					:clearable="element.options.clearable"
					:disabled="element.options.disabled"
					:style="{ width: element.options.width }"
				/>
			</template>

			<template v-if="element.type === 'alert'">
				<el-alert
					:title="element.options.title"
					:type="element.options.type"
					:closable="element.options.closable"
					:center="element.options.center"
					:close-text="element.options.closeText"
					:show-icon="element.options.showIcon"
					:effect='element.options.effect'
				/>
			</template>

			<template v-if="element.type === 'divider'">
				<el-divider
					:direction="element.options.direction"
					:border-style="element.options.borderStyle"
					:content-position="element.options.contentPosition"
				>
					{{ element.options.defaultValue }}
				</el-divider>
			</template>
		</el-form-item>

		<div class="widget-view-action" v-if="selectWidget?.key === element.key">
			<SvgIcon class='svg-icon' name="fcopy" @click.stop="$emit('copy')" />
			<SvgIcon class='svg-icon' name="fdelete" @click.stop="$emit('delete')" />
		</div>

		<div class="widget-view-drag" v-if="selectWidget?.key === element.key">
			<SvgIcon name="fmove" className="drag-widget svg-icon" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SvgIcon from '/@/components/svgIcon/index.vue';
import { WidgetForm } from '/@/components/formGenerator/config/element'

export default defineComponent({
	name: 'ElWidgetFormItem',
	components: {
		SvgIcon,
	},
	props: {
		config: {
			type: Object as PropType<WidgetForm['config']>,
			required: true
		},
		element: {
			type: Object,
			required: true
		},
		selectWidget: {
			type: Object
		}
	},
	emits: ['copy', 'delete']
})
</script>

<style lang='scss' scoped>
.select-box {
	flex-direction: column;
}

.widget-view-alert {
	::v-deep(.el-form-item__content) {
		line-height: 0;
	}
}
</style>
