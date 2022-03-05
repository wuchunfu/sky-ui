export interface Rules {
  trigger: string
  enum?: string
  len?: number
  max?: number
  message: string
  min?: number
  pattern?: string
  required: boolean
  type?: string
}

export interface WidgetForm {
  list: any[]
  config: {
    size: string
    hideRequiredAsterisk: boolean
    labelWidth: number
    labelPosition: string
  }
}

const rules: Rules = {
  trigger: 'blur',
  enum: undefined,
  len: undefined,
  max: undefined,
  message: '必填',
  min: undefined,
  pattern: undefined,
  required: false,
  type: undefined
}

export const tableRowCol = {
  type: "td",
  list: [],
  options: {
    customClass: "",
    colspan: 1,
    rowspan: 1,
    align: "left",
    valign: "top",
    width: "50%",
    height: ""
  },
}

export const widgetForm: WidgetForm = {
  list: [],
  config: {
    size: 'default',
    hideRequiredAsterisk: false,
    labelWidth: 120,
    labelPosition: 'right'
  }
}

export const basicComponents = [
  {
    label: '单行文本',
    type: 'input',
    options: {
      width: '100%',
      labelWidth: 120,
      hideLabel: false,
      defaultValue: '',
      placeholder: '',
      maxlength: null,
      prefix: '',
      suffix: '',
      prepend: '',
      append: '',
      disabled: false,
      clearable: false,
      readonly: false,
      rules
    }
  },
  {
    label: '密码框',
    type: 'password',
    options: {
      width: '100%',
      labelWidth: 120,
      hideLabel: false,
      defaultValue: '',
      placeholder: '',
      maxlength: null,
      prefix: '',
      suffix: '',
      prepend: '',
      append: '',
      showPassword: true,
      disabled: false,
      clearable: false,
      readonly: false,
      rules
    }
  },
  {
    label: '多行文本',
    type: 'textarea',
    options: {
      width: '100%',
      labelWidth: 120,
      hideLabel: false,
      defaultValue: '',
      placeholder: '',
      maxlength: null,
      rows: 3,
      autosize: false,
      showWordLimit: false,
      disabled: false,
      readonly: false,
      rules
    }
  },
  {
    label: '计数器',
    type: 'number',
    options: {
      width: '',
      labelWidth: 120,
      hideLabel: false,
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 1,
      precision: 0,
      controls: true,
      controlsPosition: 'default',
      disabled: false,
    }
  },
  {
    label: '单选框组',
    type: 'radio',
    options: {
      defaultValue: '',
      labelWidth: 120,
      hideLabel: false,
      width: '',
      inline: true,
      remote: false,
      showLabel: false,
      remoteFunc:
        'https://raw.githubusercontent.com/fuchengwei/vue-form-create/master/mock/mock.json',
      options: [
        {
          value: 'Option 1',
          label: 'Option 1'
        },
        {
          value: 'Option 2',
          label: 'Option 2'
        },
        {
          value: 'Option 3',
          label: 'Option 3'
        }
      ],
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      disabled: false,
    }
  },
  {
    label: '多选框组',
    type: 'checkbox',
    options: {
      defaultValue: [],
      width: '',
      labelWidth: 120,
      hideLabel: false,
      inline: true,
      remote: false,
      showLabel: false,
      remoteFunc:
        'https://raw.githubusercontent.com/fuchengwei/vue-form-create/master/mock/mock.json',
      options: [
        {
          label: 'Option 1',
          value: 'Option 1'
        },
        {
          label: 'Option 2',
          value: 'Option 2'
        },
        {
          label: 'Option 3',
          value: 'Option 3'
        }
      ],
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      disabled: false,
    }
  },
  {
    label: '下拉选择框',
    type: 'select',
    options: {
      defaultValue: '',
      width: '200px',
      labelWidth: 120,
      hideLabel: false,
      multiple: false,
      placeholder: '',
      remote: false,
      showLabel: false,
      filterable: false,
      clearable: false,
      disabled: false,
      props: {
        label: 'label',
        value: 'value'
      },
      options: [
        {
          label: 'Option 1',
          value: 'Option 1'
        },
        {
          label: 'Option 2',
          value: 'Option 2'
        },
        {
          label: 'Option 3',
          value: 'Option 3'
        }
      ],
      remoteOptions: [],
      remoteFunc:
        'https://raw.githubusercontent.com/fuchengwei/vue-form-create/master/mock/mock.json',
    }
  },
  {
    label: '时间选择器',
    type: 'date',
    options: {
      type: 'datetime',
      defaultValue: '',
      width: '',
      labelWidth: 120,
      hideLabel: false,
      placeholder: '请选择时间',
      startPlaceholder: '请选择开始时间',
      endPlaceholder: '请选择结束时间',
      format: 'YYYY-MM-DD HH:mm:ss',
      readonly: false,
      editable: true,
      clearable: true,
      disabled: false,
    }
  },
  {
    label: '评分',
    type: 'rate',
    options: {
      defaultValue: 0,
      labelWidth: 120,
      hideLabel: false,
      max: 5,
      allowHalf: false,
      disabled: false,
    }
  },
  {
    label: '颜色选择器',
    type: 'color',
    options: {
      defaultValue: '',
      labelWidth: 120,
      hideLabel: false,
      size: 'default',
      showAlpha	: false,
      disabled: false,
    }
  },
  {
    label: '开关',
    type: 'switch',
    options: {
      defaultValue: false,
      labelWidth: 120,
      hideLabel: false,
      disabled: false,
      activeText: '',
      inactiveText: '',
    }
  },
  {
    label: '滑块',
    type: 'slider',
    options: {
      defaultValue: 0,
      width: '',
      labelWidth: 120,
      hideLabel: false,
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      range: false,
    }
  },
  {
    label: '文字',
    type: 'text',
    options: {
      defaultValue: 'This is a text',
      labelWidth: 120,
      hideLabel: false,
    }
  },
  {
    label: 'HTML',
    type: 'html',
    options: {
      defaultValue: '<b style="color: red;">\n' +
        '\tThis is a HTML5\n' +
        '</b>',
      labelWidth: 120,
      hideLabel: false,
    }
  },
  {
    label: '按钮',
    type: 'button',
    options: {
      name: 'Button',
      labelWidth: 120,
      hideLabel: true,
      size: 'default',
      type: 'default',
      plain: false,
      round: false,
      circle: false,
      icon: '',
      autoInsertSpace: false,
      disabled: false,
    }
  },
  {
    label: '链接',
    type: 'link',
    options: {
      name: '跳转',
      labelWidth: 120,
      hideLabel: false,
      type: 'default',
      underline: false,
      href: '',
      icon: '',
      target: false,
      disabled: false,
    }
  },
  {
    title: '提示信息',
    type: 'alert',
    options: {
      title: '这是一条提示信息',
      type: 'info',
      closable: true,
      center: false,
      closeText: '',
      showIcon: false,
      effect: 'light'
    }
  },
  {
    label: '分割线',
    type: 'divider',
    options: {
      defaultValue: '分割线',
      labelWidth: 120,
      hideLabel: true,
      direction: 'horizontal',
      borderStyle: 'solid',
      contentPosition: 'center'
    }
  }
]

export const advanceComponents = [
  {
    label: '图片',
    type: 'img-upload',
    options: {
      defaultValue: [],
      labelWidth: 120,
      hideLabel: false,
      name: 'file',
      action: 'http://example.com/upload',
      method: 'post',
      listType: 'text',
      accept: 'image/*',
      limit: 3,
      multiple: false,
      disabled: false,
    }
  },
  {
    label: '级联选择器',
    type: 'cascader',
    options: {
      defaultValue: [],
      width: '200px',
      labelWidth: 120,
      hideLabel: false,
      placeholder: '',
      disabled: false,
      clearable: false,
      filterable: false,
      remote: true,
      remoteOptions: [],
      props: {
        label: 'label',
        value: 'value',
        children: 'children'
      },
      remoteFunc:
        'https://raw.githubusercontent.com/fuchengwei/vue-form-create/master/mock/mock.json',
    }
  }
]

export const layoutComponents = [
  {
    label: '栅格布局',
    type: 'grid',
    columns: [
      {
        span: 12,
        list: []
      },
      {
        span: 12,
        list: []
      }
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top'
    }
  },
  {
    label: '表格布局',
    type: 'table',
    options: {
    },
    rows: [
      {
        columns: [
          tableRowCol,
          tableRowCol
        ]
      },
      {
        columns: [
          tableRowCol,
          tableRowCol,
        ]
      }
    ],
  }
]
