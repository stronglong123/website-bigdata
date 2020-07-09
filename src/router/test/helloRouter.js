
const helloRouter = [
    {
        path: "/hello",
        name: 'hello',
        meta: {
            title:'测试页面',
            keepalive:true
        },
        title: '测试页面',
        component: ()=> import('pages/test/HelloWorld')
    },
]

export default helloRouter;