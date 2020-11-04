import httpUtil from "@/common/httpUtil";
import baseConfig from './baseConfig'

const taskManagementUrls = {
    pageList: baseConfig.basePrefix + '/taskManager/pageList', // 保存
    insert: baseConfig.basePrefix + '/taskManager/insert', // 保存
    update: baseConfig.basePrefix + '/taskManager/update', // 保存

}

// 保存
export function pageList(params = {}) {
    return httpUtil.fetchPost(taskManagementUrls.pageList, params)
}
// 保存
export function insert(params = {}) {
    return httpUtil.fetchPost(taskManagementUrls.insert, params)
}

// 保存
export function update(params = {}) {
    return httpUtil.fetchPost(taskManagementUrls.update, params)
}