// import {login, getLoginInfo} from "../../api/loginApi";
// import {findParentOrgBy} from 'api/roleManageApi'
import moment from 'moment'

const state = {
    checkState: false,
    token:'',
    userInfo:{},
    choosenRole:[],
    choosenOrg:'',
    choosenWarehouse:'',
    roleInfoList:[],
    originRole:[],
    chooseRoleInfoList:{},
    promptDate:null,
    installedApp:false,
    serviceId:''
}

const mutations = {
    clearUserInfo : (state) => {
      state.checkState = false;
      state.token = '';
      state.userInfo = {};
      state.choosenRole = [];
      state.roleInfoList = [];
      state.originRole = [];
      state.chooseRoleInfoList = {};
      state.serviceId = ''
    },
    updateUserToken : (state, token) => {
        if (token) {
            state.token = token.token;
        }
    },
    updateUserInfo : (state, user) => {
        state.userInfo = user;
    },
    updateUserRole : (state,role) => {
        state.choosenRole = role;
    },
    updateUserWarehouse : (state,role) => {
        state.choosenWarehouse = role
    },
    updateUserOrg : (state,orgId) => {
        state.choosenOrg = orgId
    },
    updateRoleInfoList : (state, roleList) => {
        state.roleInfoList = roleList;
    },
    updateOriginRole : (state, originRole) => {
        state.originRole = originRole;
    },
    updateChooseRoleInfoList : (state, roleList) => {
       if (roleList) {
           state.chooseRoleInfoList = roleList;
           state.choosenRole = roleList.roleCodes.map(it => it.code)
       }
    },
    updateInstalledState : (state, choice) => {
        state.promptDate = moment()
        state.installedApp = choice
    },
    updateServiceId : (state, serviceId) => {
        state.serviceId = serviceId
    }
}

const actions = {
    login : ({commit}, user) => {
        return new Promise((resolve, reject) => {
            // login(user)
            //     .then(res => {
            //         commit('updateUserToken',res);
            //         resolve(res);
            //     },err=>{
            //         reject(err);
            //     }).catch(err => {
            //     reject(err);
            // })
        })
    },
    getUserInfo : ({commit}, params) => {
        return new Promise((resolve, reject) => {
            // getLoginInfo(params)
            //     .then(res => {
            //         const roleList = res.userLoginAuth;
            //         commit('updateUserInfo',res);
            //         if (roleList && roleList.length) {
            //             const {roleCodes,orgId,warehouseId} = roleList[0];
            //             const codes = roleCodes.map(it => it.code)
            //             commit('updateRoleInfoList', roleList);
            //             commit('updateChooseRoleInfoList', roleList[0])
            //             commit('updateUserOrg',orgId)
            //             commit('updateUserWarehouse',warehouseId)
            //             commit('updateUserRole', codes);
            //             commit('updateOriginRole',codes);
            //             findParentOrgBy(orgId).then(data => {
            //                 commit('updateServiceId',data)
            //             }).catch(e => {
            //
            //             })
            //         }
            //         resolve(res);
            //     },err=>{
            //         reject(err);
            //     }).catch(err => {
            //     reject(err);
            // })
        })
    },

    getUserInfoSelf:({commit}, params) => {
        return new Promise((resolve, reject) => {
            // getLoginInfo(params)
            //     .then(res => {
            //         const roleList = res.userLoginAuth;
            //         // commit('updateUserInfo',res);
            //         if (roleList && roleList.length) {
            //             const {roleCodes,orgId,warehouseId} = roleList[0];
            //             const codes = roleCodes.map(it => it.code)
            //             commit('updateRoleInfoList', roleList);
            //             // commit('updateChooseRoleInfoList', roleList[0])
            //             commit('updateUserOrg',orgId)
            //             commit('updateUserRole', codes);
            //             commit('updateOriginRole',codes);
            //
            //             // commit('updateUserWarehouse',warehouseId)
            //         }
            //         resolve(res);
            //     },err=>{
            //         reject(err);
            //     }).catch(err => {
            //     reject(err);
            // })
        })
    },

    confirmPromptChoice : ({commit}, choice) => {
        commit('updateInstalledState',choice)
    },

    logout: ({commit}) => {
        return new Promise((resolve, reject) => {
            commit('clearUserInfo');
            resolve(true);
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}