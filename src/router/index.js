import Vue from 'vue'
import Router from 'vue-router'
import loginRouter from './login/login'
import homeRouter from './login/homepage'
import store from '@/store/index'
import singlePageRouter from "./singleWindow/singlePage";

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
    // mode : 'history',
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        ...loginRouter,
        ...homeRouter,
        ...singlePageRouter
    ]
})

const noPermissionPages = ['forbidden','login','register','homepage','myWorkbench','manageState','authorize','forbiddenAu']

async function checkPermission(to,from,next) {
    const {userId} = store.state.user.userInfo
    const orgId = store.state.user.chooseRoleInfoList.warehouseId || store.state.user.chooseRoleInfoList.orgId
    const pageName = to.name
    try{
        const permission = await store.dispatch('userPermission/getPagePermission', {userId, orgId, pageName})
        if(to.name==='storeReportManager'){
            next()
        }else if (!permission || !permission.canVisit) {
            next('/forbidden')
        } else {
            next();
        }
    } catch(e) {
        next('/forbidden')
    }

}

router.beforeEach((to, from, next) => {
    // 按原先的逻辑，先跳转到login页面，
    // 在login页面判断是否有cookie，在进行单点登录
    const freePages = ['login', 'register','changePassword']
    if(!store.state.user.token){
        if(freePages.includes(to.name)){
            next()
        }else{
            next('/login');
        }
    }else{
        next()
        // if(noPermissionPages.includes(to.name)){
        //     next()
        // }else{
        //     checkPermission(to,from,next)
        // }
    }
});

Vue.use(Router)

export default router;