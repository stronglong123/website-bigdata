import axios from 'axios'
import {Loading} from 'element-ui'
import store from '@/store/index'
// import timeOutLogin from '../components/timeOutLogin/timeOutLogin.vue'
axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';        //配置请求头

let loadingInstance;

function triggerLoading() {
    const loadingConfig = {
        lock: true,
        text: '努力加载中...',
        // spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    }

    return {
        open: function() {
            if(store.state.globalSettings.needLoad && !store.state.globalSettings.loading) {
                store.state.globalSettings.loading = true;
                loadingInstance = Loading.service(loadingConfig);
            }
        },
        close: function() {
            if (loadingInstance) {
                store.state.globalSettings.loading = false;
                loadingInstance.close();
            }
        }
    }
}



//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    triggerLoading().open();
    //在发送请求之前做某件事
    // if(config.method  === 'get'){
    //     config.data = qs.stringify(config.data);
    // }
    if (store.state.user.token) {
        config.headers.token = store.state.user.token
    }
    return config;
},(error) =>{
    triggerLoading().close();
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
    triggerLoading().close();
    //对响应数据做些事
    if(res.data){
        let result = res.data;
        if (typeof(result) == 'string') {
            try {
                result = JSON.parse(result);
            }catch(e) {
                result = eval('('+ result +')');
            }
        }
        return Promise.resolve(result);
    }
    return Promise.resolve(res);
}, (error) => {
    triggerLoading().close();
    return Promise.reject(error);
});

//返回一个Promise(发送post请求)
export function fetchPost(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, params,{timeout: 1000 * 60 * 1})
            .then(response => {
                if (response.code === 200 || response.success) {
                    resolve(response.data);
                } else if (response.result === 'success') {
                    resolve(response);
                } else if (response.code === 901) {
                    // const ceateTimeOutLogin = timeOutLogin.$create({
                    //     $props: {
                    //         appConfig:store.state.appConfig,
                    //         resolve:resolve,
                    //         reject:reject,
                    //         url:url,
                    //         params:params,
                    //         method:"post"
                    //     }
                    // })
                    // ceateTimeOutLogin.show()
                    // ceateTimeOutLogin.visible = true
                } else {
                    reject(response.msg || response.message)
                }
            }, err => {
                reject(err.toString());
            })
            .catch((error) => {
                reject(error.toString())
            })
    })
}
////返回一个Promise(发送get请求)
export function fetchGet(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, params)
            .then(response => {
                if (response.code === 200 || response.result === 'success') {
                    resolve(response.data);
                } else if (response.code === 901) {
                    // const ceateTimeOutLogin = timeOutLogin.$create({
                    //     $props: {
                    //         appConfig:store.state.appConfig,
                    //         resolve:resolve,
                    //         reject:reject,
                    //         url:url,
                    //         params:params,
                    //         method:"get"
                    //     }
                    // })
                    // ceateTimeOutLogin.show()
                    // ceateTimeOutLogin.visible = true
                } else {
                    reject(response.message || response.msg)
                }
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export function fetchPut(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, params)
            .then(response => {
                if (response.code === 200 || response.result === 'success') {
                    resolve(response.data);
                } else if (response.code === 901) {
                    // timeOutLogin.$create({
                    //     $props: {
                    //         appConfig:store.state.appConfig,
                    //         resolve:resolve,
                    //         reject:reject,
                    //         url:url,
                    //         params:params
                    //     }
                    // }).show()
                    //
                    // timeOutLogin.$create({
                    //     $props: {
                    //         appConfig:store.state.appConfig,
                    //         resolve:resolve,
                    //         reject:reject,
                    //         url:url,
                    //         params:params
                    //     }
                    // }).visible = true
                } else {
                    reject(response.message)
                }
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export function fetchDelete(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.delete(url, params)
            .then(response => {
                if (response.code === 200 || response.result === 'success') {
                    resolve(response.data);
                } else if (response.code === 901) {
                    // timeOutLogin.$create({
                    //     $props: {
                    //         appConfig:store.state.appConfig,
                    //         resolve:resolve,
                    //         reject:reject,
                    //         url:url,
                    //         params:params
                    //     }
                    // }).show()
                    //
                    // timeOutLogin.$create({
                    //     $props: {
                    //         appConfig:store.state.appConfig,
                    //         resolve:resolve,
                    //         reject:reject,
                    //         url:url,
                    //         params:params
                    //     }
                    // }).visible = true
                } else {
                    reject(response.message)
                }
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export default {
    fetchPost,
    fetchGet,
    fetchPut,
    fetchDelete
}