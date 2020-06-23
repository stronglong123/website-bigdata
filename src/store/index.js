import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import appConfig from './modules/appConfig'
import globalSettings from './modules/globalSettings'
import userPermission from './modules/userPermission'

Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        user,
        appConfig,
        globalSettings,
        userPermission,
    },
    plugins: [createPersistedState({
        storage: window.sessionStorage,
        reducer(val) {
            return {
                user: val.user,
                appConfig: val.appConfig,
                globalSettings: val.globalSettings,
            }
        }
    })]
})

export default store