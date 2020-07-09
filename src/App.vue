<template>
    <div id="app">
        <a-locale-provider :locale="zh_CN">
            <router-view></router-view>
        </a-locale-provider>
    </div>

</template>

<script>
    import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
    import moment from "moment";
    import "moment/locale/zh-cn";
    // import HelloWorld from './pages/HelloWorld.vue'
    import {mapState} from "vuex";

    moment.locale("zh-cn");
    export default {
        name: 'App',
        components: {
        },
        data() {
            return {
                prompt: false,
                deferred: null,
                zh_CN,
                kernel: null,
                verson: null
            };
        },
        created() {
            const _this = this;

            function getBrowser(n) {
                var ua = navigator.userAgent.toLowerCase(),
                    s,
                    name = "",
                    ver = 0;
                //探测浏览器
                (s = ua.match(/msie ([\d.]+)/))
                    ? _set("ie", _toFixedVersion(s[1]))
                    : (s = ua.match(/firefox\/([\d.]+)/))
                    ? _set("firefox", _toFixedVersion(s[1]))
                    : (s = ua.match(/chrome\/([\d.]+)/))
                        ? _set("chrome", _toFixedVersion(s[1]))
                        : (s = ua.match(/opera.([\d.]+)/))
                            ? _set("opera", _toFixedVersion(s[1]))
                            : (s = ua.match(/version\/([\d.]+).*safari/))
                                ? _set("safari", _toFixedVersion(s[1]))
                                : 0;

                function _toFixedVersion(ver, floatLength) {
                    ver = ("" + ver).replace(/_/g, ".");
                    floatLength = floatLength || 1;
                    ver = String(ver).split(".");
                    ver = ver[0] + "." + (ver[1] || "0");
                    ver = Number(ver).toFixed(floatLength);
                    return ver;
                }

                function _set(bname, bver) {
                    name = bname;
                    ver = bver;
                }

                return n == "n" ? name : n == "v" ? ver : name + ver;
            }

            this.kernel = getBrowser("n"); // 所获得的就是浏览器所用内核。
            this.verson = getBrowser("v"); // 所获得的就是浏览器的版本号。

            if (this.pushPrompt && this.prompt && !this.browser) {
                if (this.kernel != "chrome") {
                    this.$notify({
                        title: "提示",
                        message: "建议更换成谷歌浏览器,本系统部分特性无法生效！",
                        type: "warning"
                    });
                } else {
                    if (Number(this.verson) < 45) {
                        this.$notify({
                            title: "提示",
                            message: "浏览器版本过低,本系统部分特性无法生效！",
                            type: "warning"
                        });
                    }
                }
            }

            window.addEventListener("beforeinstallprompt", function (e) {
                // 存储事件
                _this.deferred = e;
                _this.prompt = true;
                // 阻止默认事件
                e.preventDefault();
                return false;
            });
        },
        computed: {
            ...mapState("user", ["promptDate", "installedApp"]),
            pushPrompt() {
                const now = moment().subtract(7, "days");
                return (
                    !this.installedApp &&
                    (!this.promptDate || now.isAfter(this.promptDate))
                );
            },
            browser() {
                if (this.kernel != "chrome") {
                    return false;
                } else {
                    if (Number(this.verson) < 45) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    .app-prompt {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
        background: #ffffff;
        box-shadow: 0 0 3px #dcdfe6;
        width: 100%;
        height: 48px;
        display: inline-flex;
        justify-content: flex-end;
        align-items: center;

        div {
            margin: 0 20px;
            padding: 0 10px;
        }

        .app-notice {
            font-family: pingFangSC-Medium, sans-serif;
            color: #4eb4f5;
            font-size: 16px;
        }
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: height 2s ease;
    }

    /*#app {*/
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    /*-webkit-font-smoothing: antialiased;*/
    /*-moz-osx-font-smoothing: grayscale;*/
    /*text-align: center;*/
    /*color: #2c3e50;*/
    /*margin-top: 60px;*/
    /*}*/
</style>