const nullOptions = [{key: 'TRUE', value: '是'}, {key: 'FALSE', value: '否'}];
const typeOptions = [{key: 'VARCHAR', value: '字符串'},
    {key: 'BOOLEAN', value: '布尔'},
    {key: 'TINYINT', value: '短数值'},
    {key: 'INTEGER', value: '数值'},
    {key: 'BIGINT', value: '序列'},
]

const formSchema = [
    {
        name: 'question',
        label: '问题',
        type: 'text',
        rules: [{required: true, message: '请填写货主名称'}],
    },
    {
        name: 'keyWord',
        label: '关键词',
        type: 'text',
        rules: [{required: true, message: '请填写货主编码'}],
    },
    {
        name: 'answer',
        label: '解答',
        type: 'textarea',
        rules: [{required: true, message: '请填写字段名'}],
    }
]

export default formSchema