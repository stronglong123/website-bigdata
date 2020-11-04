
const tableRouter = [
    {
        path: "/projectList",
        name: 'projectList',
        meta: {
            title:'项目管理',
            keepalive:true
        },
        title: '项目管理',
        component: ()=> import('pages/projectManager/projectList')
    },
    {
        path: "/projectAdd",
        name: 'projectAdd',
        meta: {
            title:'新增表格',
        },
        title: '新增表格',
        component: ()=> import('pages/tableManager/tableAdd')
    },
]

export default tableRouter;