
const questionBankRouter = [
    {
        path: "/questionBankList",
        name: 'questionBankList',
        meta: {
            title:'问题管理',
            keepalive:true
        },
        title: '问题管理',
        component: ()=> import('pages/questionBank/questionBankList')
    },
    // {
    //     path: "/questionBankAdd",
    //     name: 'questionBankAdd',
    //     meta: {
    //         title:'新增问题',
    //     },
    //     title: '新增问题',
    //     component: ()=> import('pages/questionBank/questionBankAdd')
    // },
]

export default questionBankRouter;