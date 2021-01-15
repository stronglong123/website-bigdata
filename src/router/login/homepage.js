import helloRouter from '../test/helloRouter'
import tableRouter from "../tableManager/tableRouter";
import projectRouter from "../projectManager/projectRouter";
import workbenchRouter from '../workbench/workbenchRouter'
import utilRouter from '../utilManager/utilRouter'
import questionBankRouter from '../questionBank/questionBankRouter'
import dictionaryRouter from '../ dictionary/dictionaryRouter'


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
            ...utilRouter,
            ...questionBankRouter,
            ...dictionaryRouter,
        ]
    },
]

export default homeRouter;