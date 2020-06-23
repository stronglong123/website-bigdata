const login = () => import('pages/login/login')
const register = () => import('pages/login/register')

const loginRouter = [
    {
        path: "/login",
        name: 'login',
        meta: {
            title:'登录'
        },
        title: '登录',
        component: login
    },
    {
        path:"/register",
        name:"register",
        meta:{
            title:'注册'
        },
        title:'注册',
        component:register
    },
    {
        path:'/forbiddenAu',
        name:'forbiddenAu',
        title:'无权访问',
        component:()=>import('pages/forbidden/forbidden')
    }
]
export default loginRouter