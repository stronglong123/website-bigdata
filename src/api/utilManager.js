import httpUtil from "@/common/httpUtil";
import baseConfig from './baseConfig'

const tableManagementUrls = {
    multipleReplace: baseConfig.basePrefix + '/util/multipleReplace', // 保存

}

// 保存
export function multipleReplace(params = {}) {
    return httpUtil.fetchPost(tableManagementUrls.multipleReplace, params)
}
