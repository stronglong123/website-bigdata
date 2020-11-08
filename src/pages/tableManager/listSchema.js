const typeOptions = {'VARCHAR':'字符串','BOOLEAN':'布尔','TINYINT':'短数值','INTEGER':'数值','BIGINT':'序列'};
const nullOptions = {'TRUE':'是','FALSE':'否'};

const schema = {
    searchItems : [
        {
            name:'tableName',
            label:'表名',
            type:'text'
        },
        {
            name:'tableComment',
            label:'表描述',
            type:'text',
        },
    ],
    columns:[
        {
            key:'tableName',
            title:'表名',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'tableComment',
            title:'表描述',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'columnName',
            title:'字段名',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'type',
            title:'字段属性',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return typeOptions[value];
            },
        },
        {
            key:'isNull',
            title:'是否非空',
            fixed:false,
            sortable:false,
            formatter: function (row, col, value) {
                return nullOptions[value];
            },
        },
        {
            key:'defaultValue',
            title:'默认值',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'comment',
            title:'描述',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'operation',
            title:'操作',
            fixed:false,
            width:180
        },
    ],
    rowActions:[
        {
            type:'detail',
            actionType:"view",
            text:'详情'
        },
        {
            type:'push',
            actionType:"update",
            text:'下推',
            permission: function (row, role, org) {
                return org.serviceId === 1
            },
            conditions:[{key:'pushState',value:[0]}]
        },
    ]
}

export default schema;