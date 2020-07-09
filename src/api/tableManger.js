import httpUtil from "@/common/httpUtil";
import baseConfig from './baseConfig'
import {fetchGet} from "../common/httpUtil";

const accountManagementUrls = {
    register: baseConfig.supplyChainUrl + '/user/registerUser', // 注册接口
    getCode:baseConfig.supplyChainUrl + '/user/identifyingCode', // 获取验证码
    validateCode:baseConfig.supplyChainUrl + '/user/validateCode', //校验验证码
    getRegisterPhoneCode:baseConfig.supplyChainUrl + '/user/getRegisterPhoneCode', //获取手机验证码

}

// 用户注册接口
export function registerUser(params = {}) {
    return httpUtil.fetchPost(accountManagementUrls.register, params)
}

// 获取验证码
export function getCode(params){
    return httpUtil.fetchPost(accountManagementUrls.getCode,params)
}

// 校验验证码
export function validateCode(params){
    return httpUtil.fetchPost(accountManagementUrls.validateCode,params)
}

// 校验验证码
export function getRegisterPhoneCode(params = ''){
    return httpUtil.fetchGet(accountManagementUrls.getRegisterPhoneCode +`/${params}`)
}