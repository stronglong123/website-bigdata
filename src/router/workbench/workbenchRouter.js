const workbenchRouter = [
    {
        path: "/myWorkbench",
        name: 'myWorkbench',
        meta: {
            title: '我的工作台',
            keepalive: true
        },
        title: '我的工作台',
        component: () => import('pages/workbench/myWorkbench')
    },
    {
        path:'/manageState',
        name:'manageState',
        meta:{
            title:'我的工作状态',
            keepalive:false
        },
        title:'我的工作状态',
        component: () => import('pages/workbench/manageState')
    },
]
export default workbenchRouter