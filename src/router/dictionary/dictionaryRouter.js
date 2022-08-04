
const dictionaryRouter = [
    {
        path: "/dictionaryList",
        name: 'dictionaryList',
        meta: {
            title:'字典管理',
            keepalive:true
        },
        title: '字典管理',
        component: ()=> import('pages/dictionary/dictionaryList')
    },
]

export default dictionaryRouter;