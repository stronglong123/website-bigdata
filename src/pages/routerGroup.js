import helloRouter from "../router/test/helloRouter";
import tableRouter from "../router/tableManager/tableRouter";
import projectRouter from "../router/projectManager/projectRouter";
import workbenchRouter from '../router/workbench/workbenchRouter'
import utilRouter from '../router/utilManager/utilRouter'
import questionBankRouter from '../router/questionBank/questionBankRouter'
import dictionaryRouter from '../router/ dictionary/dictionaryRouter'

const menuGroups = {
    myWorks:[
        ...helloRouter,
        ...workbenchRouter,
    ],
    myWarehouse:[
        ...projectRouter,
    ],
    storeReports:[
        ...tableRouter,
        ...utilRouter,
        ...questionBankRouter,
        ...dictionaryRouter,
    ],
    sysSettings:[
    ]
}

export default menuGroups