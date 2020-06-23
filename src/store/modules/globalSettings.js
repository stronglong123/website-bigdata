const state = {
    loading:false,
    needLoad:true,
    envNo:0
}

const mutations = {
    disableLoading: (state) => state.needLoad = false,
    enableLoading: (state) => state.needLoad = true,
    updateEnvConfig:(state,envConfig) => {
        if(envConfig){
            const {variableDataObject} = envConfig
            if (variableDataObject) {
                state.envNo = +variableDataObject
            }
        }
    }
}

const actions = {
    disableFullScreenLoading : ({commit}) => commit('disableLoading'),
    enableFullScreenLoading : ({commit}) => commit('enableLoading'),
    getEnvConfig:({commit}) => {
        return new Promise((resolve, reject) => {
            // getVariableValue({variableKey:'envName',companyId:'0'})
            //     .then(res => {
            //         commit('updateEnvConfig',res);
            //         resolve(res);
            //     },err=>{
            //         reject(err);
            //     }).catch(err => {
            //     reject(err);
            // })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}