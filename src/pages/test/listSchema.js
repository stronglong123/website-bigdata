const typeOptions = {'1':'合作商','2':'入驻商','4':'默认货主'}
const schema = {
    searchItems : [
        {
            name:'ownerName',
            label:'货主名称',
            type:'text'
        },
        {
            name:'state',
            label:'状态',
            type:'select',
            defaultValue:'1',
            options:[{key:'1',value:'启用'},{key:'0',value:'停用'}],
            dataSource:null
        },
    ],
    columns:[
        {
            key:'ownerName',
            title:'货主名称',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'ownerNo',
            title:'货主编码',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'ownerType',
            title:'类型',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return typeOptions[value];
            },
        },
        {
            key:'userName',
            title:'联系人',
            fixed:false,
            sortable:false,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'mobileNo',
            title:'电话',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'state',
            title:'状态',
            fixed:false,
            sortable:true,
            slotRender: function(row) {
                const cls = row.state === 1 ? 'start-icon' : 'stop-icon'
                    const valueName = row.state === 1 ? "启用" : "停用"
                    return `<i class='${cls} tip-icons'></i> ${valueName}`;
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
            type:'start',
            actionType:"update",
            text:'启用',
            conditions:[{key: 'state',value:[0]}]
        },
        {
            type:'stop',
            actionType:"update",
            text:'停用',
            conditions:[{key: 'state',value:[1]}]
        },
    ]
}

export default schema;