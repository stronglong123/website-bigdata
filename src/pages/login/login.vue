<template>
    <div class="page-wrap" v-loading.fullscreen.lock="fullscreenLoading">
        <img class="login-bg" src="../../assets/icons/bgPhoto@2x.png" alt/>
<!--        <img class="login-login" src="../../assets/icons/group31.png"/>-->
        <div class="title-header">
<!--            <img src="../../assets/icons/neibu.png"/>-->
            大数据系统
        </div>
        <img class="login-shadow" src="../../assets/icons/shadow.png"/>
        <div class="login-input-block">
            <div class="title">用户登录</div>
            <div class="grid-content bg-purple">
                <el-input
                        style="width: 360px;marginTop: 20px;"
                        placeholder="请输入用户名"
                        prefix-icon="el-icon-mobile-phone"
                        v-model="account"
                ></el-input>
            </div>
            <div class="grid-content bg-purple">
                <el-input
                        style="width: 360px;marginTop: 20px;"
                        placeholder="请输入登陆密码"
                        type="password"
                        prefix-icon="el-icon-edit"
                        v-model="password"
                ></el-input>
            </div>
            <div id="captcha" >
                <a-button type="primary" @click="clickLogin" style="width: 360px">登录</a-button>

                    <!--                <div id="text">行为验证™ 安全组件加载中</div>-->
<!--                <div id="wait" class="show">-->
<!--                    <div class="loading">-->
<!--                        <div class="loading-dot"></div>-->
<!--                        <div class="loading-dot"></div>-->
<!--                        <div class="loading-dot"></div>-->
<!--                        <div class="loading-dot"></div>-->
<!--                    </div>-->
<!--                </div>-->
            </div>
            <div id="area"></div>
            <div class="register">
                <a-checkbox v-model="rememberUser">记住我</a-checkbox>
                <el-link @click="handleRegister" type="danger" icon="el-icon-user">
                    <b>没有账号？点击注册</b>
                </el-link>
            </div>
        </div>
    </div>
</template>


<script>
    import gtInit from "../../assets/gt/gt.js";
    import {mapActions} from "vuex";
    // 获取api
    // import {getcaptchaApi, getValidate} from "api/loginApi";
    // import "../../assets/gt/gt";
    import moment from "moment";

    export default {
        name: "login",
        data() {
            return {
                // 公司名
                corporateName: ``,
                password: ``,
                account: ``,
                fullscreenLoading: false,
                appCode: ``,
                appVersion: ``,
                deviceId: ``,
                deviceOS: ``,
                deviceType: ``,
                userToken: "",
                // 账号过期联系人
                expirePerson: "技术支持",
                // 记住账号
                rememberUser: false,
                validator: null,
                // 极验参数
                geetest_challenge: "",
                geetest_validate: "",
                geetest_seccode: "",
                getFreeCode: "发送验证码"
            };
        },
        created() {
            this.getVersionInfo().then(data => {
                this.appCode = data.appCode;
                this.appVersion = data.appVersion;
                this.deviceId = data.deviceId;
                this.deviceOS = data.deviceOS;
                this.deviceType = data.deviceType;
                this.userToken = data.userToken;
            });

        },
        mounted() {

            // 重新构建验证
            // let self = this;
            // this.initGetCaptcha();
            if (localStorage.getItem("account")) {
                this.account = localStorage.getItem("account");
                this.rememberUser = true;
            } else {
                this.rememberUser = false;
            }
        },
        methods: {
            ...mapActions("user", ["login", "getUserInfo"]),
            ...mapActions("appConfig", ["getVersionInfo"]),
            checkLogin() {
                this.fullscreenLoading = true;
                if (!this.account || !this.password) {
                    this.fullscreenLoading = false;
                    this.$message({type: "info", message: "请输入账号密码"});

                    return false;
                }
                return true;
            },
            clickLogin() {
                let user= {
                    "businessId": "0",
                    "employeeType": 1,
                    "longtime": true,
                    "mobileNo": "15671669918",
                    "orgId": 0,
                    "trueName": "测试",
                    "userId": 117020,
                    "userLoginAuth": [
                        {
                            "orgId": 413,
                            "orgName": "测试",
                            "orgType": 2,
                            "roleCodes": [
                                {
                                    "code": "WarehouseOperative",
                                    "copId": "1",
                                    "createTime": 1575216000000,
                                    "global": true,
                                    "grantOrgType": 3,
                                    "id": "1013",
                                    "lastUpdateTime": 1583424000000,
                                    "name": "仓配运营",
                                    "pid": "0"
                                }
                            ],
                            "warehouseId": 4131
                        }
                    ],
                    "userName": "测试",
                    "usertoken": "726509d0-cf1d-4d39-b051-fae2b76642df"
                }
                this.fullscreenLoading = true;
                this.login({
                    userName: this.account,
                    password: this.password,
                    appCode: this.appCode,
                    appVersion: this.appVersion,
                    deviceId: this.deviceId,
                    deviceOS: this.deviceOS,
                    deviceType: this.deviceType
                })
                    .then(data => {
                        this.fullscreenLoading = false;
                        this.userToken = data.token;
                        this.$store.state.user.token = data.token
                        // 将账号存在localStorage里
                        if (this.rememberUser) {
                            localStorage.setItem("saveUser", true);
                            localStorage.setItem("account", this.account);
                        } else {
                            localStorage.setItem("saveUser", false);
                            localStorage.removeItem("account");
                        }
                        this.$router.replace({name: "homepage"});
                    })
                    .catch(err => {
                        // captchaObj.reset();
                        // this.validator && this.validator.reset();
                        this.fullscreenLoading = false;
                        this.$message.warning(err);
                    });
            },
            // 计算两个日期之间相差多少天
            getSurplusDays(expireDate) {
                // 当前日期
                let nowTime = Date.parse(new Date());
                // 剩余试用天数
                let surplusDays = moment(expireDate).diff(moment(nowTime), "days");
                if (surplusDays <= 7 && surplusDays > 0) {
                    this.$notify({
                        title: "提示",
                        message:
                            "您的账号试用期将于" +
                            surplusDays +
                            "天后结束，如要继续使用，请联系" +
                            this.expirePerson,
                        duration: 0,
                        type: "warning"
                    });
                } else if (surplusDays === 0) {
                    this.$notify({
                        title: "提示",
                        message:
                            "您的账号试用期将于今天结束，如要继续使用，请联系" +
                            this.expirePerson,
                        duration: 0,
                        type: "warning"
                    });
                }
            },
            handleRegister() {
                const {href} = this.$router.resolve({
                    name: `register`
                });
                window.open(href, "_blank");
            },
            // initGetCaptcha() {
            //     let _this = this;
            //     getcaptchaApi()
            //         .then(data => {
            //             let text = document.getElementById("text");
            //             let wait = document.getElementById("wait");
            //             text.style.display = "none";
            //             wait.style.display = "block";
            //             initGeetest(
            //                 {
            //                     gt: data.gt,
            //                     challenge: data.challenge,
            //                     offline: !data.success, // 表示用户后台检测极验服务器是否宕机
            //                     // offline: !!data.success, // 表示用户后台检测极验服务器是否宕机
            //                     // new_captcha: data.new_captcha,
            //                     new_captcha: true,
            //                     product: "popup",
            //                     width: "360px"
            //                 },
            //                 handlerCaptcha
            //             );
            //         })
            //         .catch(e => {
            //             _this.$message.error(e);
            //         });
            //     let handlerCaptcha = function (captchaObj) {
            //         captchaObj.appendTo("#captcha");
            //         captchaObj.onReady(function () {
            //             document.getElementById("wait").style.display = "none";
            //         });
            //         captchaObj.onSuccess(function () {
            //             if (!_this.account || !_this.password) {
            //                 _this.$message({
            //                     type: "info",
            //                     message: "请输入账号密码"
            //                 });
            //                 captchaObj.reset();
            //                 return false;
            //             }
            //             //极验成功 callBack
            //             var result = captchaObj.getValidate();
            //             var picValidatecode =
            //                 result.geetest_challenge +
            //                 "," +
            //                 result.geetest_validate +
            //                 "," +
            //                 result.geetest_seccode;
            //             getValidate(picValidatecode, this.account)
            //                 .then(s => {
            //                     if (!_this.account || !_this.password) {
            //                         _this.$message({
            //                             type: "info",
            //                             message: "请输入账号密码"
            //                         });
            //                         captchaObj.reset();
            //                         return false;
            //                     }
            //                     _this.clickLogin(captchaObj);
            //                 })
            //                 .catch(e => {
            //                     captchaObj.reset();
            //                     _this.$message.error(e);
            //                 });
            //         });
            //         window.gt = captchaObj;
            //     };
            // }
        }
    };
</script>

<style lang="scss" scoped>
    .el-row {
        margin-top: 10px;
    }

    .page-wrap {
        position: relative;
        height: 100%;
        width: 100%;
    }

    .login-bg {
        position: absolute;
        width: 100%;
        height: 900px;
        top: 0;
        left: 0;
        background: url("~@/assets/icons/bgPhoto@2x.png");
    }

    .login-login {
        position: absolute;
        top: 30px;
        left: 40px;
    }

    .login-register {
        display: inline-block;
        font-size: 16px;
        color: #fff;
        position: absolute;
        top: 8px;
        right: 8px;
        cursor: pointer;
    }

    .login-input-block {
        position: absolute;
        background-color: #fff;
        width: 460px;
        height: 320px;
        // height: 480px;
        right: 50%;
        top: 50%;
        // transform: translate(50%, 50%);
        transform: translate(50%, 70%);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
    }

    .title {
        width: 100%;
        padding: 15px;
        font-size: 17px;
        border-bottom: 1px solid #ededed;
        box-sizing: border-box;
        text-align: center;
    }

    .title-header {
        position: absolute;
        left: 50%;
        font-size: 30px;
        color: #fff;
        top: 155px;
        display: flex;
        align-items: center;
        transform: translate(-50%, 0);

        > img {
            margin-right: 8px;
            width: 48px;
            height: 35px;
        }
    }

    .login-shadow {
        right: 50%;
        top: 50%;
        transform: translate(50%, 32%);
        position: absolute;
    }

    /*
         * 滑块验证样式
         */
    #captcha {
        position: relative;
        margin-top: 20px;
    }

    .register {
        width: 360px;
        height: 40px;
        display: flex;
        justify-items: right;
        align-items: center;
        position: relative;

        .el-link {
            position: absolute;
            right: 0;
            cursor: pointer;
        }
    }

    #text {
        height: 42px;
        width: 360px;
        text-align: center;
        border-radius: 2px;
        background-color: #f3f3f3;
        color: #bbbbbb;
        font-size: 14px;
        letter-spacing: 0.1px;
        line-height: 42px;
    }

    #wait {
        display: none;
        height: 42px;
        width: 360px;
        text-align: center;
        border-radius: 2px;
        background-color: #f3f3f3;
    }

    .loading {
        margin: auto;
        width: 70px;
        height: 20px;
    }

    .loading-dot {
        float: left;
        width: 8px;
        height: 8px;
        margin: 18px 4px;
        background: #ccc;

        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;

        opacity: 0;

        -webkit-box-shadow: 0 0 2px black;
        -moz-box-shadow: 0 0 2px black;
        -ms-box-shadow: 0 0 2px black;
        -o-box-shadow: 0 0 2px black;
        box-shadow: 0 0 2px black;

        -webkit-animation: loadingFade 1s infinite;
        -moz-animation: loadingFade 1s infinite;
        animation: loadingFade 1s infinite;
    }

    .loading-dot:nth-child(1) {
        -webkit-animation-delay: 0s;
        -moz-animation-delay: 0s;
        animation-delay: 0s;
    }

    .loading-dot:nth-child(2) {
        -webkit-animation-delay: 0.1s;
        -moz-animation-delay: 0.1s;
        animation-delay: 0.1s;
    }

    .loading-dot:nth-child(3) {
        -webkit-animation-delay: 0.2s;
        -moz-animation-delay: 0.2s;
        animation-delay: 0.2s;
    }

    .loading-dot:nth-child(4) {
        -webkit-animation-delay: 0.3s;
        -moz-animation-delay: 0.3s;
        animation-delay: 0.3s;
    }

    @-webkit-keyframes loadingFade {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            opacity: 0;
        }
    }

    @-moz-keyframes loadingFade {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            opacity: 0;
        }
    }

    @keyframes loadingFade {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            opacity: 0;
        }
    }
</style>