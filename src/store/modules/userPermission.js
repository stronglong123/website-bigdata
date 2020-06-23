// import {getPagePermission} from '../../api/configApi'

const state = {
    permissions: []
}

const getters = {
    getPermission: (state) => (userId, orgId, pageName) => {
        return state.permissions.find(permission => permission.userId === userId && permission.orgId === orgId && permission.pageName === pageName)
    }
}

const mutations = {
    addPermissions:(state,data) => {
        // const {userId,orgId,pageName} = data
        // if(data.pageName==="storeReportManager"){
        //     data.canVisit = true
        // }
        // const index = state.permissions.findIndex(permission => permission.userId === userId && permission.orgId === orgId && permission.pageName === pageName)
        // const timestamp = new Date().getTime()
        // if (index === -1) {
        //     state.permissions.push({...data,timestamp})
        // } else {
        //     state.permissions.splice(index,1,{...data,timestamp})
        // }
    }
}

const actions = {
    async getPagePermission({commit,state},params) {
        const {userId,orgId,pageName} = params
        if (userId === undefined || orgId === undefined || pageName === undefined) {
            return null
        }
        const permission = state.permissions.find(permission => permission.userId === userId && permission.orgId === orgId && permission.pageName === pageName)
        const timestamp = new Date().getTime()
        //已记录过权限，并且在5分钟之内，不用重新获取权限
        if (permission && permission.timestamp + 5 * 60 * 1000 > timestamp) {
            const {canVisit,actionPermission} = permission
            return {canVisit,actionPermission}
        } else {
            try{
                const data = await getPagePermission(params)
                if (data) {
                    (pageName!== 'forbidden') && commit('addPermissions',{...params,...data})
                    return data
                } else {
                    return null
                }
            }catch (e) {
                return null
            }
        }
    }
}

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}