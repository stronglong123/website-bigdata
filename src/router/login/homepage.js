import helloRouter from '../test/helloRouter'
import tableRouter from "../tableManager/tableRouter";

const home = () => import('pages/homepage')

const homeRouter = [
    {
        path: "/homepage",
        name: 'homepage',
        meta: {
            title:'首页'
        },
        title: '首页',
        component: home,
        children:[
            ...helloRouter,
            ...tableRouter,
        ]
    },
]

export default homeRouter;