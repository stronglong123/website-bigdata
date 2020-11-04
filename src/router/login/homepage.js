import helloRouter from '../test/helloRouter'
import tableRouter from "../tableManager/tableRouter";
import projectRouter from "../projectManager/projectRouter";

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
            ...projectRouter,
        ]
    },
]

export default homeRouter;