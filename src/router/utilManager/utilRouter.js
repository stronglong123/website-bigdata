
const helloRouter = [
    {
        path: "/utilManager",
        name: 'utilManager',
        meta: {
            title:'小工具',
            keepalive:true
        },
        title: '小工具',
        component: ()=> import('pages/utilManager/utilManager')
    },
]

export default helloRouter;