import httpUtil from "@/common/httpUtil";
import baseConfig from './baseConfig'
import axios from 'axios'

const userUrl = {
    UALogin: '/UA/user/login',    //UA登录接口，主要为了获取token
    loginInfo: baseConfig.supplyChainUrl + '/user/newloginInfo',  //供应链登录接口，获取用户信息
    getMenuByRole: baseConfig.supplyChainUrl + '/user/menu', //获取菜单
}

export function login(params = {}) {
    return httpUtil.fetchPost(userUrl.UALogin, params)
}
//登陆接口
export function getLoginInfo(params = {}) {
    return httpUtil.fetchPost(userUrl.loginInfo, params);
}

export function getMemuList(orgId = '', warehouseId = '') {
    return httpUtil.fetchGet(userUrl.getMenuByRole, { params: { orgId: orgId, warehouseId: warehouseId } })
}

export function getcaptchaApi() {
    let url = baseConfig.supplyChainUrl + '/getCheck?mobilePhone=' + (new Date()).getTime()
    return new Promise((resolve, reject) => {
        axios.get(url, { timeout: 1000 * 60 * 1 }).then(response => {
            if(response){
                resolve(response)
            }
        }, err => {
            reject(err.toString());
        }).catch((error) => {
            reject(error.toString())
        })
    })
}

export function getValidate(q,w){
    let url = baseConfig.supplyChainUrl + '/validateCode?picValidatecode=' + q + '&mobilePhone=' + w
    return new Promise((resolve, reject) => {
        axios.get(url, { timeout: 1000 * 60 * 1 }).then(response => {
            if(response){
                resolve(response)
            }
        }, err => {
            reject(err.toString());
        }).catch((error) => {
            reject(error.toString())
        })
    })
}
