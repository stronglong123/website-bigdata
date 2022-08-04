const typeOptions = {'VARCHAR':'字符串','BOOLEAN':'布尔','TINYINT':'短数值','INTEGER':'数值','BIGINT':'序列'};
const nullOptions = {'TRUE':'是','FALSE':'否'};

const schema = {
    searchItems : [
        {
            name:'question',
            label:'题目',
            type:'text'
        },
        {
            name:'keyWord',
            label:'关键词',
            type:'text',
        },
    ],
    columns:[
        {
            key:'question',
            title:'题目',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'keyWord',
            title:'关键词',
            fixed:false,
            sortable:true,
            formatter: function (row, col, value) {
                return value;
            },
            showOverflowTooltip:true
        },
        {
            key:'answer',
            title:'答案',
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
            type:'edit',
            text:'编辑',
        },
        {
            type:'delete',
            text:'删除'
        },
    ]
}

export default schema;