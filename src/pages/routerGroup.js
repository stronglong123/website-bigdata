import helloRouter from "../router/test/helloRouter";
import tableRouter from "../router/tableManager/tableRouter";

const menuGroups = {
    myWorks:[
        ...helloRouter,
        ...tableRouter,
    ],
    myWarehouse:[

    ],
    storeReports:[
    ],
    sysSettings:[

    ]
}

export default menuGroups