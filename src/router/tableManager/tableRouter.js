
const tableRouter = [
    {
        path: "/tableList",
        name: 'tableList',
        meta: {
            title:'表格管理',
            keepalive:true
        },
        title: '表格管理',
        component: ()=> import('pages/tableManager/tableList')
    },
    {
        path: "/tableAdd",
        name: 'tableAdd',
        meta: {
            title:'新增表格',
        },
        title: '新增表格',
        component: ()=> import('pages/tableManager/tableAdd')
    },
]

export default tableRouter;