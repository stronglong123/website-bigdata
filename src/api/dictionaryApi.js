import httpUtil from "@/common/httpUtil";
import baseConfig from './baseConfig'

const questionBankUrls = {
    pageList: baseConfig.basePrefix + '/dictionary/pageList', // 保存
    insert: baseConfig.basePrefix + '/dictionary/insert', // 保存
    update: baseConfig.basePrefix + '/dictionary/update', // 保存

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