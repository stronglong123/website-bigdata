import helloRouter from "../router/test/helloRouter";
import tableRouter from "../router/tableManager/tableRouter";
import projectRouter from "../router/projectManager/projectRouter";

const menuGroups = {
    myWorks:[
        ...helloRouter,
        ...tableRouter,
        ...projectRouter,
    ],
    myWarehouse:[

    ],
    storeReports:[
    ],
    sysSettings:[

    ]
}

export default menuGroups