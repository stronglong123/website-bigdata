const path = require('path')
const devServer = 'http://wms.release.yijiupidev.com/supplyChain'

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    runtimeCompiler: true,
    css: {
        loaderOptions: {
            stylus: {
                'resolve url': true,
                'import': []
            },
            less: {
                javascriptEnabled: true
            },
        }
    },
    productionSourceMap: false,

    configureWebpack: config => {
        config.resolve = {
            extensions: ['.js', '.vue', '.json', ".css"],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src'),
                'common': resolve('src/common'),
                'api': resolve('src/api'),
                'components': resolve('src/components'),
                'pages': resolve('src/pages'),
                'store': resolve('src/store'),
                'images': resolve('src/assets/images'),
                'icons': resolve('src/assets/icons'),
                'vendor': resolve('src/common/vendor'),
            }
        }
    },
    publicPath: '/',
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        portal: {
            entry: 'src/portalEntry.js',
            template: 'public/portal.html',
            filename: 'portal.html',
            chunks: ['chunk-vendors', 'chunk-common', 'portal']
        }
    },
    devServer: {
        host: '127.0.0.1',
        port: 8009,
        proxy: {
            '/aipservice': {
                target: devServer,
                changeOrigin: true,
                ws: true,
                pathRewrite: {'^/aipservice': ''},
            },
        }
    },
    pwa: {
        name: '大数据系统',
        themeColor: '#2196f3',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'no',
        appleMobileWebAppStatusBarStyle: 'black',
        assetsVersion: '',
        iconPaths: {
            favicon32: 'favicon.png',
            favicon16: 'icons/favicon.png',
            appleTouchIcon: 'icons/favicon168.png',
            maskIcon: 'icons/favicon192.png',
            msTileImage: 'icons/favicon144.png'
        },

        // 配置 workbox 插件
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            // InjectManifest 模式下 swSrc 是必填的。
            swSrc: 'public/sw.js',
            importWorkboxFrom: 'disabled', // 决定是否引入workbox
            exclude: [/sw.js$/, /index.\w+.js$/] // 缓存列表排除的文件，可以是文件名或正则
        }
    },
    transpileDependencies: [
        'vue-echarts',
        'resize-detector'
    ],

    lintOnSave: false,
}
