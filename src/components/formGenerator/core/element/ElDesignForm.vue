<template>
  <div class="fc-style">
    <el-container class="fc-container">
      <el-main class="fc-main" style='height: 600px'>
        <el-container>
          <el-aside width="250px">
            <div class="components">
              <ComponentGroup
                title="基础标签"
                :fields="basicFields"
                :list="element.basicComponents"
              />
              <ComponentGroup
                title="高级标签"
                :fields="advanceFields"
                :list="element.advanceComponents"
              />
              <ComponentGroup
                title="布局标签"
                :fields="layoutFields"
                :list="element.layoutComponents"
              />
            </div>
          </el-aside>
          <el-main class="center-container">
						<ElCustomHeader
							v-bind="$props"
							@preview="() => (previewVisible = true)"
							@uploadJson="() => (uploadJsonVisible = true)"
							@generateJson="handleGenerateJson"
							@generateCode="handleGenerateCode"
							@clearable="handleClearable"
						>
							<slot name="header"></slot>
						</ElCustomHeader>
						<el-main :class="{ 'widget-empty': widgetForm.list }">
							<ElWidgetForm
								ref="widgetFormRef"
								v-model:widgetForm="widgetForm"
								v-model:widgetFormSelect="widgetFormSelect"
							/>
						</el-main>
          </el-main>
          <el-aside class="widget-config-container" width="300px">
            <el-container>
              <el-header>
                <div
                  class="config-tab"
                  :class="{ active: configTab === 'widget' }"
                  @click="configTab = 'widget'"
                >
                  标签属性
                </div>
                <div
                  class="config-tab"
                  :class="{ active: configTab === 'form' }"
                  @click="configTab = 'form'"
                >
                  表单属性
                </div>
              </el-header>
              <el-main class="config-content">
								<div v-show="configTab === 'widget'">
									<ElWidgetConfig
										v-if='widgetFormSelect'
										v-model:select="widgetFormSelect"
									/>
									<div v-else style='text-align: center; margin-top: 100px; color: #909399'>
										暂未选中标签
									</div>
								</div>
                <ElFormConfig
                  v-show="configTab === 'form'"
                  v-model:config="widgetForm.config"
                />
              </el-main>
            </el-container>
          </el-aside>
        </el-container>
      </el-main>

      <el-dialog v-model="uploadJsonVisible" title="导入JSON" width="60%">
				<el-alert title="JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可" type="info" show-icon class='mb10' />
				<codeEditor v-if='uploadJsonVisible' v-model:modelValue='jsonEg' theme='ambiance-mobile'></codeEditor>
        <template #footer>
          <el-button size="medium" @click="() => (uploadJsonVisible = false)"
            >取消</el-button
          >
          <el-button type="primary" size="medium" @click="handleUploadJson"
            >导入</el-button
          >
        </template>
      </el-dialog>

      <el-dialog v-model="previewVisible" title="预览" fullscreen custom-class='form-design-dialog-preview'>
        <ElGenerateForm
          ref="generateFormRef"
          v-if="previewVisible"
          :data="widgetForm"
        />
        <template #footer>
					<div style='text-align: center;'>
						<el-button size="medium" @click="handleReset">重置</el-button>
						<el-button type="primary" size="medium" @click="handleGetData">获取数据</el-button>
					</div>
        </template>

        <el-dialog v-model="dataJsonVisible" title="获取数据" width="60%">
          <CodeEditor v-if='dataJsonVisible' :modelValue="dataJsonTemplate" language="json" readonly />

          <template #footer>
            <el-button size="medium" @click="() => (dataJsonVisible = false)">取消</el-button>
            <el-button
              type="primary"
              size="medium"
              @click="handleCopyClick(dataJsonTemplate)">复制</el-button>
          </template>
        </el-dialog>
      </el-dialog>

      <el-dialog v-model="generateJsonVisible" title="生成JSON" width="60%">
				<codeEditor v-if='generateJsonVisible' :modelValue='generateJsonTemplate' theme='ambiance-mobile' readOnly></codeEditor>

        <template #footer>
          <el-button size="medium" @click="() => (generateJsonVisible = false)"
            >取消</el-button
          >
          <el-button
            type="primary"
            size="medium"
            @click="handleCopyClick(generateJsonTemplate)"
            >Copy</el-button
          >
        </template>
      </el-dialog>

      <el-dialog v-model="dataCodeVisible" title="生产代码" width="60%">
				<codeEditor v-if='dataCodeVisible' :modelValue='dataCodeTemplate' theme='ambiance-mobile' readOnly></codeEditor>

        <template #footer>
          <el-button size="medium" @click="() => (dataCodeVisible = false)"
            >取消</el-button
          >
          <el-button
            type="primary"
            size="medium"
            @click="handleCopyClick(dataCodeTemplate)"
            >Copy</el-button
          >
        </template>
      </el-dialog>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, toRefs, watchEffect, ref } from 'vue';
import { ElMessage } from 'element-plus'
import CodeEditor from '/@/components/codeEditor/index.vue'
import { defaultsDeep } from 'lodash'
import ComponentGroup from '/@/components/formGenerator/components/ComponentGroup.vue'
import ElCustomHeader from './ElCustomHeader.vue'
import ElWidgetForm from './ElWidgetForm.vue'
import ElGenerateForm from './ElGenerateForm.vue'
import ElWidgetConfig from './ElWidgetConfig.vue'
import ElFormConfig from './ElFormConfig.vue'
import { element } from '/@/components/formGenerator/config'
import { copy } from '/@/components/formGenerator/utils'
import { CodeType, PlatformType } from '/@/components/formGenerator/enums'
import generateCode from '/@/components/formGenerator/utils/generateCode'
import { WidgetForm } from '/@/components/formGenerator/config/element'

export default defineComponent({
  name: 'ElDesignForm',
  components: {
		ElCustomHeader,
    ComponentGroup,
    ElWidgetForm,
    ElGenerateForm,
    ElWidgetConfig,
    ElFormConfig,
		CodeEditor
  },
  props: {
    preview: {
      type: Boolean,
      default: true
    },
    generateCode: {
      type: Boolean,
      default: true
    },
    generateJson: {
      type: Boolean,
      default: true
    },
    uploadJson: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    basicFields: {
      type: Array as PropType<Array<string>>,
      default: () => [
        'input',
        'password',
        'textarea',
        'number',
        'radio',
        'checkbox',
        'time',
        'date',
        'rate',
        'select',
        'switch',
        'slider',
        'text'
      ]
    },
    advanceFields: {
      type: Array as PropType<Array<string>>,
      default: () => ['img-upload', 'richtext-editor', 'cascader']
    },
    layoutFields: {
      type: Array as PropType<Array<string>>,
      default: () => ['grid']
    }
  },
  setup() {
		const generateFormRef = ref()
    const state = reactive({
      element,
      codeType: CodeType,
      widgetForm: JSON.parse(JSON.stringify(element.widgetForm)),
      widgetFormSelect: undefined,
      configTab: 'widget',
      previewVisible: false,
      uploadJsonVisible: false,
      dataJsonVisible: false,
      dataCodeVisible: false,
      generateJsonVisible: false,
      generateCodeVisible: false,
      generateJsonTemplate: JSON.stringify(element.widgetForm, null, 2),
      dataJsonTemplate: '',
      dataCodeTemplate: '',
      codeLanguage: CodeType.Vue,
      jsonEg: JSON.stringify(element.widgetForm, null, 2)
    })

    const handleUploadJson = () => {
      try {
        state.widgetForm.list = []
        defaultsDeep(state.widgetForm, JSON.parse(state.jsonEg))

        if (state.widgetForm.list) {
          state.widgetFormSelect = state.widgetForm.list[0]
        }

        state.uploadJsonVisible = false
        ElMessage.success('上传成功')
      } catch (error) {
        ElMessage.error('上传失败')
      }
    }

    const handleCopyClick = (text: string) => {
      copy(text)
      ElMessage.success('复制成功')
    }

    const handleGetData = () => {
			generateFormRef.value.getData().then((res: any) => {
        state.dataJsonTemplate = JSON.stringify(res, null, 2)
        state.dataJsonVisible = true
      })
    }

    const handleGenerateJson = () =>
      (state.generateJsonTemplate = JSON.stringify(
        state.widgetForm,
        null,
        2
      )) && (state.generateJsonVisible = true)

    const handleGenerateCode = () => {
      state.codeLanguage = CodeType.Vue
      state.dataCodeVisible = true
    }

    watchEffect(() => {
      if (state.dataCodeVisible) {
        state.dataCodeTemplate = generateCode(
          state.widgetForm,
          state.codeLanguage,
          PlatformType.Element
        )!
      }
    })

    const handleClearable = () => {
      state.widgetForm.list = []
      defaultsDeep(
        state.widgetForm,
        JSON.parse(JSON.stringify(element.widgetForm))
      )
      state.widgetFormSelect = undefined
    }

    const handleReset = () => generateFormRef.value.reset()

    const getJson = () => state.widgetForm

    const setJson = (json: WidgetForm) => {
      state.widgetForm.list = []
      defaultsDeep(state.widgetForm, json)
      if (json.list.length) {
        state.widgetFormSelect = json.list[0]
      }
    }

    const getTemplate = (codeType: CodeType) =>
      generateCode(state.widgetForm, codeType, PlatformType.Element)

    const clear = () => handleClearable()

    return {
      handleUploadJson,
      handleCopyClick,
      handleGetData,
      handleGenerateJson,
      handleGenerateCode,
      handleClearable,
      handleReset,
      getJson,
      setJson,
      getTemplate,
      clear,
			generateFormRef,
			...toRefs(state),
    }
  }
})
</script>
