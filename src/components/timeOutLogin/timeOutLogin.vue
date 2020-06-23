<template>
    <div v-loading.fullscreen.lock="fullscreenLoading">
        <a-modal
            title="登录超时，重新登陆"
            :visible="visible"
            :footer="null"
            :closable="true"
            :maskClosable="false"
            :keyboard="false"
            destroyOnClose
            style="margin-top:140px;"
            @cancel="closeModal"
        >
            <div class="login-input-block">
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

                <div id="timeOutCaptcha">
                    <div id="text">行为验证™ 安全组件加载中</div>
                    <div id="wait" class="show">
                        <div class="loading">
                            <div class="loading-dot"></div>
                            <div class="loading-dot"></div>
                            <div class="loading-dot"></div>
                            <div class="loading-dot"></div>
                        </div>
                    </div>
                </div>
                <!-- <div id="timeOutCaptcha"></div> -->
            </div>
        </a-modal>
    </div>
</template>

<script>
import gtInit from "../../assets/gt/gt.js";
// import { getcaptchaApi, getValidate } from "api/loginApi";
import {
    login,
    getLoginInfo,
    getcaptchaApi,
    getValidate
} from "../../api/loginApi";
// import {fetchPost,fetchGet} from '../../common/httpUtil'
import httpUtil from "@/common/httpUtil";
import Bus from "@/components/eventBus/eventBus.js";

import axios from "axios";

import moment from "moment";
export default {
    name: "timeOutLogin",
    props: {
        appConfig: {
            type: Object
        },
        resolve: {
            type: Function
        },
        reject: {
            type: Function
        },
        url: {
            required: true
        },
        params: {
            required: true
        },
        method: {
            type: String
        }
    },
    data() {
        return {
            visible: true,
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
            fetchMethod: ""
        };
    },
    created() {
        this.fetchMethod = this.method;
        this.methodtoUpperCase();
        const {
            deviceId,
            deviceOS,
            appCode,
            appVersion,
            deviceType
        } = this.appConfig;
        this.deviceId = deviceId;
        this.deviceOS = deviceOS;
        this.appCode = appCode;
        this.appVersion = appVersion;
        this.deviceType = deviceType;
        this.account = localStorage.getItem("account");
    },
    mounted() {
        let self = this;
        this.initGetCaptcha();
        // jigsaw.init(document.getElementById("timeOutCaptcha"), function() {
        //     self.clickOutLogin();
        // });
    },
    methods: {
        clearForm() {
            // this.account =''
            this.password = "";
        },
        checkOutLogin() {
            if (!this.account || !this.password) {
                this.fullscreenLoading = false;
                this.$message({ type: "info", message: "请输入账号密码" });
                return false;
            }
            return true;
        },
        clickOutLogin(captchaObj) {
            // this.checkOutLogin() &&
                login({
                    account: this.account,
                    password: this.password,
                    appCode: this.appCode,
                    appVersion: this.appVersion,
                    deviceId: this.deviceId,
                    deviceOS: this.deviceOS,
                    deviceType: this.deviceType
                })
                    .then(getToken => {
                        this._store.state.user.token = getToken.token;
                        Bus.$emit("changeVuexData", getToken);
                        this.userToken = getToken.token;
                        getLoginInfo({ userToken: this.userToken })
                            .then(data => {
                                const roleList = data.userLoginAuth;
                                this._store.state.user.userInfo = data;
                                const { resolve, reject } = this;
                                if (roleList && roleList.length) {
                                    const { roleCodes, orgId } = roleList[0];
                                    const codes = roleCodes.map(it => it.code);
                                    // 修改vuex里面的数据
                                    this._store.state.user.roleInfoList = roleList;
                                    if (roleList[0]) {
                                        // this._store.state.user.chooseRoleInfoList = roleList[0]
                                        this._store.state.user.choosenRole = roleList[0].roleCodes.map(
                                            it => it.code
                                        );
                                    }
                                    // this._store.state.user.choosenOrg = orgId
                                    this._store.state.user.choosenRole = codes;
                                    this._store.state.user.originRole = codes;
                                }
                                // 发送请求
                                httpUtil[`fetch${this.fetchMethod}`](
                                    this.url,
                                    this.params
                                )
                                    .then(data => {
                                        // httpUtil[`fetch${this.fetchMethod}`](this.url, this.params).then(data=>{
                                        resolve(data);
                                    })
                                    .catch(e => {
                                        reject(e);
                                    });
                                this.visible = false;
                                this.clearForm();
                            })
                            .catch(e => {
                                captchaObj.reset();
                                this.$message.warning(e);
                            });
                    })
                    .catch(err => {
                        captchaObj.reset();
                        this.$message.warning(err);
                    });
            this.fullscreenLoading = false;
        },
        closeModal() {
            this.visible = false;
            this.reject();
        },
        methodtoUpperCase() {
            this.fetchMethod = this.fetchMethod.split("");
            this.fetchMethod[0] = this.fetchMethod[0].toUpperCase();
            this.fetchMethod = this.fetchMethod.join("");
        },
        initGetCaptcha() {
            let _this = this;
            getcaptchaApi()
                .then(data => {
                    let text = document.getElementById("text");
                    let wait = document.getElementById("wait");
                    text.style.display = "none";
                    wait.style.display = "block";
                    initGeetest(
                        {
                            gt: data.gt,
                            challenge: data.challenge,
                            offline: !data.success, // 表示用户后台检测极验服务器是否宕机
                            // new_captcha: data.new_captcha,
                            new_captcha: true,
                            product: "popup",
                            width: "360px"
                        },
                        handlerCaptcha
                    );
                })
                .catch(e => {
                    captchaObj.reset();
                    _this.$message.error(e);
                });
            let handlerCaptcha = function(captchaObj) {
                captchaObj.appendTo("#timeOutCaptcha");
                captchaObj.onReady(function() {
                    document.getElementById("wait").style.display = "none";
                });
                captchaObj.onSuccess(function() {
                    //极验成功 callBack
                    var result = captchaObj.getValidate();
                    var picValidatecode =
                        result.geetest_challenge +
                        "," +
                        result.geetest_validate +
                        "," +
                        result.geetest_seccode;
                    getValidate(picValidatecode, this.account)
                        .then(s => {
                            if (!_this.account || !_this.password) {
                                _this.$message({
                                    type: "info",
                                    message: "请输入账号密码"
                                });
                                captchaObj.reset();
                                return false;
                            }
                            _this.clickOutLogin(captchaObj);
                        })
                        .catch(e => {
                            captchaObj.reset();
                            _this.$message.error(e);
                        });
                });
                window.gt = captchaObj;
            };
        }
    },
    watch: {
        visible(n, o) {
            if (n === true) {
                let timeOutCaptcha = document.getElementById("timeOutCaptcha");
                let self = this;
                // this.initGetCaptcha();
                if(window.gt){
                    gt.reset();
                }
                // jigsaw.init(timeOutCaptcha, function() {
                //     self.clickOutLogin();
                // });
                if (localStorage.getItem("saveUser")) {
                    this.account = localStorage.getItem("account");
                }
            }
        },
        method(n, o) {
            this.fetchMethod = n;
            this.methodtoUpperCase();
        }
    }
};
</script>

<style lang="less" scoped>
.login-input-block {
    background-color: #fff;
    margin: 30px 0;
    width: 460px;
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border-radius: 5px;
}
/*
     * 滑块验证样式
     */
#timeOutCaptcha {
    position: relative;
    margin-top: 20px;
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