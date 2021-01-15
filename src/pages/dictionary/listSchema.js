const typeOptions = {'VARCHAR':'字符串','BOOLEAN':'布尔','TINYINT':'短数值','INTEGER':'数值','BIGINT':'序列'};
const nullOptions = {'TRUE':'是','FALSE':'否'};

const schema = {
    searchItems : [
        {
            name:'name',
            label:'名称',
            type:'text'
        },
        {
            name:'alias',
            label:'别名',
            type:'text',
        },
        {
            name:'source',
            label:'出处',
            type:'text',
        },
    ],
    columns:[
        {
            key:'name',
            title:'名称',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'alias',
            title:'别名',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'description',
            title:'描述',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'source',
            title:'出处',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'instance',
            title:'实例',
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