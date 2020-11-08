import helloRouter from '../test/helloRouter'
import tableRouter from "../tableManager/tableRouter";
import projectRouter from "../projectManager/projectRouter";
import workbenchRouter from '../workbench/workbenchRouter'

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
            ...workbenchRouter,
        ]
    },
]

export default homeRouter;