import httpUtil from "@/common/httpUtil";
import baseConfig from './baseConfig'
import axios from 'axios'

const userUrl = {
    loginInfo: baseConfig.basePrefix + '/user/loginInfo',  //登录接口，获取用户信息
    clearCookie: baseConfig.basePrefix + '/user/clearCookie',  //登出接口

}

//登陆接口

export function login(params = {}) {
    return httpUtil.fetchPost(userUrl.loginInfo, params)
}

export function clearCookie(params = {}) {
    return httpUtil.fetchPost(userUrl.clearCookie, params)
}

