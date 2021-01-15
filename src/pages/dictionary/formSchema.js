
const formSchema = [
    {
        name: 'name',
        label: '名称',
        type: 'text',
        rules: [{required: true, message: '请填写货主名称'}],
    },
    {
        name: 'alias',
        label: '别名',
        type: 'text',
        rules: [{required: true, message: '请填写货主编码'}],
    },
    {
        name: 'description',
        label: '描述',
        type: 'text',
        rules: [{required: true, message: '请填写字段名'}],
    },
    {
        name: 'source',
        label: '出处',
        type: 'text',
        rules: [{required: true, message: '请填写字段名'}],
    },
    {
        name: 'type',
        label: '分类',
        type: 'text',
        rules: []
    },
    {
        name: 'instance',
        label: '实例',
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