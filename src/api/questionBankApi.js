import httpUtil from "@/common/httpUtil";
import baseConfig from './baseConfig'

const questionBankUrls = {
    pageList: baseConfig.basePrefix + '/questionbank/pageList', // 保存
    insert: baseConfig.basePrefix + '/questionbank/insert', // 保存
    update: baseConfig.basePrefix + '/questionbank/update', // 保存
    delete: baseConfig.basePrefix + '/questionbank/delete', // 保存

}

// 保存
export function pageList(params = {}) {
    return httpUtil.fetchPost(questionBankUrls.pageList, params)
}
// 保存
export function insert(params = {}) {
    return httpUtil.fetchPost(questionBankUrls.insert, params)
}

// 保存
export function update(params = {}) {
    return httpUtil.fetchPost(questionBankUrls.update, params)
}


// 保存
export function deleteData(params = {}) {
    return httpUtil.fetchPost(questionBankUrls.delete, params)
}