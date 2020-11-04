import httpUtil from "@/common/httpUtil";
import baseConfig from './baseConfig'

const tableManagementUrls = {
    createTable: baseConfig.basePrefix + '/tableManager/createTable', // 保存
    importTable: baseConfig.basePrefix + '/import/importTable', // 保存

}

// 保存
export function createTable(params = {}) {
    return httpUtil.fetchPost(tableManagementUrls.createTable, params)
}
// 保存
export function importTable(params = {}) {
    return httpUtil.fetchPost(tableManagementUrls.importTable, params)
}