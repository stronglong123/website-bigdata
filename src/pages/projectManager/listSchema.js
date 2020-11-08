import moment from 'moment'

const stateEnums = [
    {key: '-1', value: '作废'},
    {key: '1', value: '未开始'},
    {key: '2', value: '开发中'},
    {key: '3', value: '开发完成'},
    {key: '4', value: '部署test'},
    {key: '5', value: '部署release'},
    {key: '6', value: '部署pre'},
    {key: '7', value: '部署product'}]
const stateOptions = {
    '-1': '作废',
    '1': '未开始',
    '2': '开发中',
    '3': '开发完成',
    '4': '部署test',
    '5': '部署release',
    '6': '部署pre',
    '7': '部署product'
};
const schema = {
    searchItems: [
        {
            name: 'taskName',
            label: '开发任务',
            type: 'text',
        },
        {
            name: 'taskNo',
            label: '开发编号',
            type: 'text',
        },
        {
            name: 'stateList',
            label: '状态',
            type: 'select',
            mode: "multiple",
            options: stateEnums,
            defaultValue: ['1','2']
        }
    ],
    columns: [
        {
            key: 'taskName',
            title: '开发任务',
            fixed: false,
            formatter: function (row, col, value) {
                return value;
            },
        },
        {
            key: 'taskNo',
            title: '开发编号',
            fixed: false,
            formatter: function (row, col, value) {
                return value;
            },
        },
        {
            key: 'refProject',
            title: '涉及项目',
            fixed: false,
            formatter: function (row, col, value) {
                return value;
            },
        },
        {
            key: 'state',
            title: '状态',
            fixed: false,
            formatter: function (row, col, value) {
                return stateOptions[value];
            },
        },
        {
            key: 'deadTime',
            title: '截止时间',
            fixed: false,
            formatter: function (row, col, value) {
                return value;
            },

        },
        {
            key: 'priority',
            title: '优先级',
            fixed: false,
            formatter: function (row, col, value) {
                return value;
            },
        },
        {
            key: 'operator',
            title: '开发人',
            fixed: false,
            formatter: function (row, col, value) {
                return value;
            },
        },
        {
            key: 'remark',
            title: '备注',
            fixed: false,
            formatter: function (row, col, value) {
                return value;
            },
        },
        {
            key: 'operation',
            title: '操作',
            fixed: false,
            width: 180
        },
    ],
    rowActions: [
        {
            type:'edit',
            text:'编辑',
            conditions:[{key:'state',value:[1,2,3,4,5,6,7]}]
        },
        {
            type:'invalid',
            text:'作废',
            conditions:[{key:'state',value:[1,2,3,4]}]
        },
        {
            type:'start',
            text:'开始开发',
            conditions:[{key:'state',value:[1]}]
        },
        {
            type:'complete',
            text:'完成任务',
            conditions:[{key:'state',value:[2]}]
        },
        {
            type:'test',
            text:'部署test',
            conditions:[{key:'state',value:[3]}]
        },
        {
            type:'release',
            text:'部署release',
            conditions:[{key:'state',value:[4]}]
        },
        {
            type:'pre',
            text:'部署pre',
            conditions:[{key:'state',value:[5]}]
        },
        {
            type:'product',
            text:'部署product',
            conditions:[{key:'state',value:[6]}]
        },
    ]
}

export default schema;