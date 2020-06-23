<template>
    <div style="overflow: hidden;position: relative;" class="body">
        <!-- <div class="headNav">
      <ul>
        <li>首页</li>
        <li>功能</li>
        <li>渠道</li>
        <li>博客</li>
        <li>关于我们</li>
      </ul>
      <el-button plain size="mini" @click="toLogin">已有账号请登录</el-button>
        </div>-->
        <div class="reg-bg">
            <img src="~@/assets/icons/group31.png" alt/>
        </div>
        <div class="register">
            <div v-if="!successReg" class="successReg">
                <div class="title">
                    <span>欢迎注册</span>
                </div>
                <a-form :form="form" class="form">
                    <!-- 公司名称 -->
                    <a-form-item v-bind="formItemLayout" label="公司名称">
                        <a-input
                                v-decorator="[
                'companyName',
                {
                    rules: [
                        {
                            required: true,
                            message: '请输入公司名称'
                        }
                    ],
                },
            ]"
                                placeholder="请输入公司名称"
                                type="text"
                                style="width: 85%"
                        ></a-input>
                    </a-form-item>
                    <!-- 账号 -->
                    <a-form-item v-bind="formItemLayout" label="您的姓名">
                        <a-input
                                v-decorator="[
                'userName',
                {
                    rules: [
                        {
                            required: true,
                            message: '请输入姓名'
                        }
                    ],
                },
            ]"
                                placeholder="请输入姓名"
                                style="width: 85%"
                        ></a-input>
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="公司规模" :extra="msgText">
                        <a-radio-group
                                v-decorator="['enterPriseType',{rules: [{required: true, message: '请选择公司规模'}],},]">
                            <a-radio :value="2">
                                1-50人
                            </a-radio>
                            <a-radio :value="1">
                                50-500人
                            </a-radio>
                            <a-radio :value="3">
                                500人以上
                            </a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="行业类别">
                        <a-select
                                allowClear
                                :placeholder="'请选择'"
                                :defaultActiveFirstOption="false"
                                :showArrow="true"
                                v-decorator="['industryType',{rules: [{required: true, message: '请选择行业类别'}],},]"
                                style="width: 85%"
                                :options="industryTypeEnums"
                        ></a-select>
                    </a-form-item>

                    <!-- 手机号 -->
                    <a-form-item v-bind="formItemLayout" label="手机号">
                        <a-input
                                v-decorator="[
                'mobile',
                {
                    rules: [
                        {
                            required:true,
                            message:'请输入手机号'
                        },
                        {
                            validator: correctPhoneNumber
                        }
                    ],
                },

            ]"
                                placeholder="请输入手机号"
                                type="tel"
                                @focus="refelshImg"
                                style="width: 85%"
                        />
                    </a-form-item>
                    <!-- 验证码 -->
                    <a-form-item v-bind="formItemLayout" label="验证码" class="captcha">
                        <div style="width:85%;">
                            <a-row style="width:100%;">
                                <a-col :span="7" style="padding-right:3px;">
                                    <a-input
                                            v-decorator="[
                        'validateCode',
                        { rules: [{ validator: correctCaptcha}] },
                    ]"
                                            placeholder="请输入短信验证码"
                                            @change="captcheChange"
                                    />
                                </a-col>
                                <a-col :span="6" style="padding:2px 3px;" v-if="showImg">
                                    <el-image
                                            style="width: 100%; height: 100%;margin-top:3px;"
                                            :src="checkUrl"
                                            fit="contain"
                                            @click="refreshCode"
                                    >
                                        <a-spin slot="placeholder"/>
                                        <div slot="error" style="text-align: center;width:100%;">
                                            <i class="el-icon-picture-outline"></i>
                                        </div>
                                    </el-image>
                                </a-col>
                                <a-col :span="11" class="captchaBtn" v-if="showImg">
                                    <a-input-group compact>
                                        <a-input v-model="checkCode" style="width:45%;margin:0 2.5%;"
                                                 placeholder="图片字符"/>
                                        <template>
                                            <a-button style="width:50%;" v-if="captchaStutas" @click="getCaptcha">发送短信
                                            </a-button>
                                            <a-button style="width:50%;padding:0;" v-else disabled>
                                                {{captchaTime}}秒后可重发
                                            </a-button>
                                        </template>
                                    </a-input-group>

                                </a-col>
                            </a-row>
                        </div>
                    </a-form-item>

                    <a-form-item v-bind="formItemLayout" label=" " :colon="false">
                        <a-checkbox
                                v-model="agreement"
                                v-decorator="[
                'agreement',
                {
                    rules:[
                        
                        {
                            validator: checkBox
                        }
                    ]
                }
            ]"
                                :defaultChecked="true"
                        >我已阅读并同意
                        </a-checkbox>
                        <a @click="showModal">《酒批仓配网络服务协议》</a>
                    </a-form-item>

                    <a-form-item v-bind="formItemLayout" label=" " :colon="false">
                        <a-button type="primary" style="width:85%" @click="handleSubmit">注册</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <!-- 注册成功界面 -->
            <div class="welcome" v-else>
                <p>注册成功</p>
                <div class="regMsg">
                    <span style="margin:10px 0;fontSize:16px">你已注册成功!</span>
                    <div>
                        <span style="display:inline;padding:0 20px;">账号是你的手机号:</span>
                        <b style="color:#F56C6C;">{{userName}}</b>
                    </div>
                    <div>
                        <span style="display:inline;padding:0 20px;">密码是你手机号后六位:</span>
                        <b style="color:#F56C6C;">{{password}}</b>
                    </div>
                    <div style="margin:10px 0;fontSize:16px">
                        <b style="color:#409eff;paddingRight:10px;">{{nowSecond}}</b>秒后跳转登录页面。
                    </div>
                </div>
            </div>
            <!-- 手册界面 -->
            <el-dialog title="酒批仓配网络用户使用协议" :visible.sync="argumentState" width="950px" center>
                <userAgreement/>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel" class="btnCancel">取 消</el-button>
                    <el-button @click="handleOk" class="btnConfirm">同意并继续</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {registerUser, getCode} from "api/registerUserApi.js";
    import userAgreement from 'components/operation/userAgreement'

    const baseUrl = '/supplyChain/user/getImageCode'
    export default {
        name: "register",
        data() {
            return {
                formItemLayout: {
                    labelCol: {
                        span: 5
                    },
                    wrapperCol: {
                        span: 19
                    }
                },
                msgText: '我们将根据规模为您开通相应的默认服务',
                // 获取验证码按钮状态
                captchaStutas: true,
                // 再次获取时间
                captchaTime: 60,
                // 是否注册成功
                successReg: false,
                // 当前秒数
                nowSecond: 5,
                // 注册成功后的账号
                userName: "",
                // 注册成功后的密码
                password: "",
                // 手册模态框显示状态
                argumentState: false,
                // 手册选中状态
                agreement: true,
                // 验证码ID
                identifyingCodeId: "",
                checkCode: '',
                checkUrl: baseUrl,
                showImg: false,
                enterTypeEnum: [
                    {value: 1, label: "厂商"},
                    {value: 2, label: "小型经销商"},
                    {value: 3, label: "大型经销商"},
                    {value: 4, label: "零售商超"},
                    {value: 5, label: "电商（销售）"}
                ],
                industryTypeEnums: [
                    {value: 1, label: "零售快消"},
                    {value: 2, label: "零售商超"},
                    {value: 3, label: "美妆日化"},
                    {value: 4, label: "医药医疗"},
                    {value: 5, label: "鞋服时尚"},
                    {value: 6, label: "冷链生鲜"},
                    {value: 7, label: "汽车配件"},
                    {value: 8, label: "家居家电"},
                    {value: 9, label: "第三方物流"},
                    {value: 10, label: "其他"}
                ]
            };
        },
        beforeCreate() {
            this.form = this.$form.createForm(this, {name: "registerUser"});
        },
        components: {
            userAgreement
        },
        methods: {
            //   回到登录页面
            toLogin() {
                this.$router.push({
                    name: "login"
                });
            },
            //   提交表单
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFieldsAndScroll((err, values) => {
                    values.identifyingCodeId = this.identifyingCodeId;
                    if (!err) {
                        //   向后台传递数据
                        registerUser(values)
                            .then(data => {
                                // this.$message("注册成功");
                                this.userName = values.mobile;
                                this.password = values.mobile.slice(5);
                                this.successReg = true;
                                let timeIntval = setInterval(() => {
                                    this.nowSecond--;
                                    if (this.nowSecond === 0) {
                                        clearInterval(timeIntval);
                                        this.$router.push({
                                            name: "login"
                                        });
                                    }
                                }, 1000);
                            })
                            .catch(error => {
                                this.refreshCode()
                                this.$message(error);
                            });
                    }
                });
            },
            refreshCode() {
                this.checkCode = ''
                const timestamp = new Date().getTime()
                this.checkUrl = baseUrl + `?timestamp=${timestamp}`
            },
            // 获取验证码
            getCaptcha() {
                // 发送验证码请求后，返回一个promise
                // getCaptcha().then()
                if (!this.checkCode) {
                    this.$message.info('请先输入图片验证码答案')
                    return
                }
                this.form.validateFields(["mobile"], (err, val) => {
                    if (err) {
                        err.mobile.errors.forEach(err => {
                            this.$message.error(err.message);
                        });
                    } else {
                        getCode({mobileNo: val.mobile, imageCode: this.checkCode})
                            .then(data => {
                                this.identifyingCodeId = data;
                                this.$message.success('验证码发送成功')
                                // this.refreshCode()

                                this.captchaStutas = false;
                                let timeCap = setInterval(() => {
                                    this.captchaTime--;
                                    if (this.captchaTime === 0) {
                                        this.captchaTime = 60;
                                        this.captchaStutas = true;
                                        clearInterval(timeCap);
                                    }
                                }, 1000);
                            })
                            .catch(e => {
                                this.$message.warning(`获取验证码失败：${e}`);
                                this.refreshCode()
                            });
                    }
                });
            },
            // 验证两次密码是否一致
            compareToFirstPassword(rule, value, callback) {
                const form = this.form;
                if (value && value !== form.getFieldValue("password")) {
                    callback("两次密码不一致");
                } else {
                    callback();
                }
            },
            // 验证手机号格式
            correctPhoneNumber(rule, value, callback) {
                if (value === "" || value === undefined) {
                    callback();
                } else if (!/^1[0-9]{10}$/.test(value)) {
                    callback("手机号格式不正确");
                } else {
                    callback();
                }
            },
            correctCaptcha(rule, value, callback) {
                let reg = new RegExp("^[0-9]*$");
                if (!reg.test(value)) {
                    callback('请输入数字验证码');
                } else {
                    if (value.length != 6) {
                        callback('请输入6位数字验证码');
                    } else {
                        callback()
                    }
                }
            },
            // 验证是否选中证书
            checkBox(rule, value = true, callback) {
                if (value === "undefined" || value === false) {
                    callback("必须同意《易久批用户协议》");
                } else {
                    callback();
                }
            },
            // 点击手册
            showModal() {
                this.argumentState = true;
            },
            handleOk(e) {
                this.argumentState = false;
                this.agreement = true;
                this.form.setFieldsValue({
                    agreement: true
                });
            },
            handleCancel(e) {
                this.argumentState = false;
            },
            // 输入框数据改变
            captcheChange(e) {
                // e.target.value = e.target.value.replace(/\D/g, "");
            },
            refelshImg() {
                this.showImg = true
                this.refreshCode()
            }
        }
    };
</script>

<style lang="less">
    .body {
        width: 100vw;
        height: 100vh;

        .headNav {
            width: 100vw;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fafafa;

            > ul {
                list-style-type: none;
                margin: 0;
                padding: 0;

                > li {
                    display: inline-block;
                    margin: 0 10px;
                    cursor: pointer;
                }
            }
        }

        .reg-bg {
            width: 100vw;
            height: 100vh;
            background: url("~@/assets/icons/bgPhoto@2x.png");
            position: absolute;
            left: 0;
            top: 0;
            background-size: 100% 100%;

            > img {
                display: block;
                margin: 30px 40px;
            }
        }

        .register {
            width: 30vw;
            min-width: 600px;
            margin: 150px auto 90px;
            border-top: 0 solid rgb(143, 122, 122);
            overflow: hidden;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            position: relative;

            .successReg {
                .title {
                    height: 60px;
                    line-height: 60px;
                    font-size: 28px;
                    text-align: center;
                    border-bottom: 1px solid #ededed;
                }

                .form {
                    padding: 20px 0;
                }

                .captchaBtn {
                    position: relative;
                    height: 40px;
                    display: flex;
                    align-items: center;

                    > button {
                        position: absolute;
                        right: 0;
                    }
                }
            }

            .welcome {
                > p {
                    font-size: 28px;
                    text-align: center;
                    line-height: 60px;
                    margin: 0;
                    border-bottom: 1px solid #ededed;
                }

                .regMsg {
                    margin: 50px;
                    font-size: 14px;

                    > span {
                        display: block;
                        line-height: 26px;
                    }
                }
            }
        }

        .footer {
            background-color: #201f1f;
            height: calc(100vh - 760px);
            z-index: 99;

            > p {
                text-align: center;
                color: #fff;
                font-size: 20px;
                cursor: pointer;
            }
        }

        .btnCancel {
            width: 122px;
            height: 38px;
            border: 1px solid #e5e5e5;
            background: #ededed;
        }

        .btnConfirm {
            width: 122px;
            height: 38px;
            background: #e53935;
            color: #fff;
            border: 1px solid #e53935;
        }
    }

    .ant-form-item-with-help {
        margin-bottom: 3px !important;
    }

    .ant-row.ant-form-item:not(.ant-form-item-with-help) {
        margin-bottom: 22px !important;
    }

    .captcha:not(.ant-form-item-with-help) {
        height: 42px !important;
    }
</style>
