const nullOptions = [{key: 'TRUE', value: '是'}, {key: 'FALSE', value: '否'}];
const typeOptions = [{key: 'VARCHAR', value: '字符串'},
    {key: 'BOOLEAN', value: '布尔'},
    {key: 'TINYINT', value: '短数值'},
    {key: 'INTEGER', value: '数值'},
    {key: 'BIGINT', value: '序列'},
]

const formSchema = [
    {
        name: '表名',
        label: '货主名称',
        type: 'text',
        rules: [{required: true, message: '请填写货主名称'}],
    },
    {
        name: 'tableComment',
        label: '表描述',
        type: 'text',
        rules: [{required: true, message: '请填写货主编码'}],
    },
    {
        name: 'columnName',
        label: '字段名',
        type: 'text',
        rules: [{required: true, message: '请填写字段名'}],
    },
    {
        name: 'type',
        label: '字段属性',
        type: 'select',
        rules: [{required: true, message: '请选择类型'}],
        options: typeOptions,
        formatter: function (value) {
            return this.options.find(option => option.key === value).value
        },
        defaultValue: 'VARCHAR'
    },
    {
        name: 'isNull',
        label: '是否非空',
        type: 'select',
        rules: [{required: true, message: '请选择是否非空'}],
        options: nullOptions,
        formatter: function (value) {
            return this.options.find(option => option.key === value).value
        },
        defaultValue: 'TRUE'
    },
    {
        name: 'defaultValue',
        label: '默认值',
        type: 'text',
        rules: []
    },
    {
        name: 'comment',
        label: '描述',
        type: 'text',
        rules: []
    }
]

export default formSchema