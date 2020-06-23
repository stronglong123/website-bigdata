/* eslint-disable no-console */

import {register,unregister} from 'register-service-worker'

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)

// const isHttps = Boolean(window.location.protocol === 'https:');(process.env.NODE_ENV === 'production' && isHttps)

if (isLocalhost) {
    register(`${process.env.BASE_URL}sw.js`, {
        ready() {
            console.log(
                '准备完成'
            )
        },
        registered() {
            console.log('注册成功')
        },
        cached() {
            console.log('从缓存中加载')
        },
        updatefound() {
            console.log('正在下载新内容.')
        },
        updated(swReg) {
            console.log('新内容已准备好.')
            Notification.requestPermission().then(result => {
                if (result === 'granted') {
                    swReg.showNotification('当前页面版本不是最新的', {
                        body: '请点击我刷新页面，或者按F5键手动刷新',
                        icon: '/icons/favicon72.png',
                        tag: 'content-update'
                    });
                } else {
                    window.location.href = window.location.protocol+'//'+window.location.hostname;
                }
            })
        },
        offline() {
            console.log('找不到Internet连接。应用程序正在脱机模式下运行')
        },
        error(error) {
            console.error('服务工作者注册过程中出错:', error)
        }
    })
} else {
    unregister()
}