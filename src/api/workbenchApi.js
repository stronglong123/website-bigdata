import httpUtil from "@/common/httpUtil";
import baseConfig from './baseConfig'

export function getTaskIndicators(params={}){
    return httpUtil.fetchPost(baseConfig.supplyChainUrl + '/warehousedata/getWarehouseOrderCount',params)
}
export function getStoreIndicators(params = {}) {
    return httpUtil.fetchPost(baseConfig.supplyChainUrl + '/warehousedata/getWarehouseInventoryCount',params)
}

export function getWorkerIndicators(params = {}) {
    return httpUtil.fetchPost(baseConfig.supplyChainUrl + '/warehousedata/getWarehouseEmployeeCount',params)
}