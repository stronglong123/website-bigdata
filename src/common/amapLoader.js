export function amapLoader(key, plugins, v = '1.4.14',uiVersion) {
    return new Promise(function (resolve, reject) {
        if (typeof AMap !== 'undefined') {
            // eslint-disable-next-line no-undef
            resolve(AMap)
            return true
        }
        window.onCallback = function () {
            // eslint-disable-next-line no-undef
            if (window.initAMapUI) {
                window.initAMapUI()
            }
            if (typeof AMap !== 'undefined' && typeof AMapUI !== 'undefined') {
                resolve(AMap,AMapUI)
            } else if (typeof AMap !== 'undefined') {
                resolve(AMap)
            }
        }
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://webapi.amap.com/maps?v=${v}&key=${key}&plugin=${plugins}&callback=onCallback`
        script.onerror = reject
        document.head.appendChild(script)
        if (uiVersion) {
            let uiScript = document.createElement('script')
            uiScript.type = 'text/javascript'
            uiScript.src = `https://webapi.amap.com/ui/1.0/main-async.js?v=${uiVersion}`
            uiScript.onerror = reject
            document.head.appendChild(uiScript)
        }
    })
}