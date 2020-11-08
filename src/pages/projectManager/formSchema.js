const stateOptions = [
    {key: '-1', value: '作废'},
    {key: '1', value: '未开始'},
    {key: '2', value: '开发中'},
    {key: '3', value: '开发完成'},
    {key: '4', value: '部署test'},
    {key: '5', value: '部署release'},
    {key: '6', value: '部署pre'},
    {key: '7', value: '部署product'},
];

const formSchema = [
    {
        name: 'taskName',
        label: '开发任务',
        type: 'text',
        rules: [{required: true, message: '请填写货主名称'}],
    },
    {
        name: 'refProject',
        label: '涉及项目',
        type: 'text',
        rules: [{required: true, message: '请填写字段名'}],
    },
    // {
    //     name: 'state',
    //     label: '状态',
    //     type: 'select',
    //     rules: [{required: true, message: '请选择状态'}],
    //     options: stateOptions,
    //     formatter: function (value) {
    //         return this.options.find(option => option.key === value).value
    //     },
    //     defaultValue: '1'
    // },
    {
        name: 'priority',
        label: '优先级',
        type: 'text',
        rules: [],
    },
    {
        name: 'deadTime',
        label: '截止时间',
        type: 'singleDate',
        rules: [],
        showTime:'showTime',
    },
    {
        name: 'operator',
        label: '开发人',
        type: 'text',
        rules: []
    },
    {
        name: 'remark',
        label: '备注',
        type: 'text',
        rules: []
    }
]

export default formSchema