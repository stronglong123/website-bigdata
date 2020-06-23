<template>
    <div>
        <el-row  class="portal-menu" style="width:100%;height:60px;" type="flex" align="center">
            <el-col :span="12">&nbsp;</el-col>
            <el-col :span="12">
                <el-menu :default-active="defaultActive" mode="horizontal" >
                    <el-menu-item index="homepage">首页</el-menu-item>
                    <el-menu-item index="product">产品</el-menu-item>
                    <el-menu-item index="schema">方案</el-menu-item>
                    <el-menu-item index="about">关于我们</el-menu-item>
                    <el-menu-item index="join">加入我们</el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
        <div class="portal-banner">
            <div class="banner-content">
                <div style="font-size:48px;" class="text-shinning">SaaS WMS</div>
                <div style="font-size:24px">您的仓库管理利器，解决库存管理烦恼</div>
                <div >
                    <el-button type="primary" @click="directTo('login')">登 录</el-button>
                    <el-button @click="directTo('register')">注 册</el-button>
                </div>
            </div>
        </div>
        <div class="content-center" style="margin:80px 0;color:rgba(51,51,51,1);font-size:32px;">
           系统特征
        </div>
        <div class="feature-intro">
            <div class="intro-block">
                <div class="intro-layout intro-bg-layout">
                 &nbsp;
                </div>
                <div class="intro-title">
                    SAAS化架构
                </div>
                <div class="intro-text">
                    云端SAAS化部署极速构建企业应用多层级管理体系,多仓库、多货主、多渠道协同管理。
                </div>
            </div>
            <div class="intro-block">
                <div class="intro-layout intro-bg-setting">
                    &nbsp;
                </div>
                <div class="intro-title">
                    灵活的配置和策略
                </div>
                <div class="intro-text">
                    开放式规则引擎，灵活工作流配置，根据客户/仓库特征，按需配置上架、拣货、补货等策略。
                </div>
            </div>
            <div class="intro-block">
                <div class="intro-layout intro-bg-equipment">
                    &nbsp;
                </div>
                <div class="intro-title">
                    多种设备集成
                </div>
                <div class="intro-text">
                    PDA、电子标签、变拣边分小车、标签打印机、便携式蓝牙打印机、多设备硬件集成方案。
                </div>
            </div>
            <div class="intro-block">
                <div class="intro-layout intro-bg-warehouse">
                    &nbsp;
                </div>
                <div class="intro-title">
                    自定义仓库作业流程
                </div>
                <div class="intro-text">
                    针对仓库、物流渠道服务可自定义仓库作业流程，满足灵活操作需要。

                </div>
            </div>
            <div class="intro-block">
                <div class="intro-layout intro-bg-barcode">
                    &nbsp;
                </div>
                <div class="intro-title">
                    条码化管理
                </div>
                <div class="intro-text">
                    商品、库位、作业单据实行条码化管理，满足快速作业需要。

                </div>
            </div>
        </div>
        <div class="sample-intro">
            <div class="sample-title">最优的订单分组、最短的拣货路径</div>
            <div class="sample-text">
                WMS系统可以由用户根据配置，生成不同的拣货模式，支持目前所有主流拣选模式。这些模式可以基于货主，订单类型，订单结构特征等进行灵活配置可以根据客户配置出更多的拣货模式，而不需要客户化。
            </div>
            <div class="sample-items">
                <div class="items-block">
                    按单拣货
                </div>
                <div class="items-block">
                    汇总拣货
                </div>
                <div class="items-block">
                    分区拣货
                </div>
                <div class="items-block">
                    边拣边分
                </div>
                <div class="items-block">
                    RF拣货
                </div>
                <div class="items-block">
                    语音拣货
                </div>
            </div>
            <div class="sample-image">

            </div>
        </div>
        <div class="portal-footer">
            <div class="footer-links">
                <!-- <ul class="links-block">
                    <li class="link-index">关于我们</li>
                    <li class="link-items">关于酒批</li>
                    <li class="link-items">联系酒批</li>
                    <li class="link-items">酒批文化</li>
                </ul>
                <ul  class="links-block">
                    <li class="link-index">新手入门</li>
                    <li class="link-items">如何注册</li>
                    <li class="link-items">购物流程</li>
                </ul>
                <ul  class="links-block">
                    <li class="link-index">批发服务</li>
                    <li class="link-items">售后服务</li>
                    <li class="link-items">退换流程</li>
                </ul>
                <ul  class="links-block">
                    <li class="link-index">支付/配送</li>
                    <li class="link-items">配送方式</li>
                    <li class="link-items">配送细则</li>
                    <li class="link-items">付款方式</li>
                </ul>
                <ul  class="links-block">
                    <li class="link-index">帮助中心</li>
                    <li class="link-items">常见问题</li>
                    <li class="link-items">忘记密码</li>
                    <li class="link-items">订单处理</li>
                </ul> -->
                <ul class="links-block" v-for="item in linkData" :key="item.title">
                    <li class="link-index">{{item.title}}</li>
                    <li class="link-items" v-for="li in item.childLink" :key="li.title" @click="directTo(li.path,li)">{{li.title}}</li>
                </ul>
            </div>
            <div class="footer-banner">
                <span>易久批电子商务有限公司 © 2016-{{thisYear}} yijiupi.com All Rights Reserved 京ICP备14053473号-1</span>
                <span>全国客服电话:400-0199-197</span>
            </div>
            <el-dialog title="酒批仓配网络用户使用协议" :visible.sync="argumentState" width="950px" center>
                <userAgreement/>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import linkData from './linkData'
    import userAgreement from 'components/operation/userAgreement'
    export default {
        name: "home",
        data() {
            return {
                defaultActive:'homepage',
                path:process.env.BASE_URL,
                linkData:linkData,
                argumentState:false,
                thisYear:new Date().getFullYear()
            }
        },
        components:{
            userAgreement
        },
        methods:{
            directTo(routerName,li) {
                if(li.components){
                    this.argumentState = true
                    return false
                }
                if(routerName){
                    const href = this.path + 'index.html#/' + routerName
                    window.open(href,'_blank')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .portal-menu{
        color:rgba(37,124,247,1);
        background: rgba(255,255,255,1);
    }
    .portal-banner {
        height:640px;
        background: url("~@/assets/images/icon_bg.png") no-repeat;
        -webkit-background-size: cover;
        background-size: cover;
        position: relative;
        display: flex;
        align-items: center;
        justify-content:center;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(255,255,255,1);
        .banner-content{
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index:998;
            div {
                margin:20px;
                button {
                    position:relative;
                    width:140px;
                    height:44px;
                    margin: 0 15px;
                    font-size:16px;
                    font-family:PingFang-SC-Medium,PingFang-SC;
                    transition: all 0.2s ease;
                }
                button:hover{
                    transform: scale(1.1);
                }
            }
        }
    }
    /*.portal-banner::after{*/
        /*position: absolute;*/
        /*top: 0;*/
        /*left: 0;*/
        /*content: "";*/
        /*background-color: #E0CCA8;*/
        /*animation: shinning 4s ease-in-out infinite;*/
        /*width: 100%;*/
        /*height: 100%;*/
    /*}*/

    .text-shinning{
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
        backface-visibility: hidden;

        -webkit-perspective: 1000;
        -moz-perspective: 1000;
        -ms-perspective: 1000;
        perspective: 1000;
        animation:shinning 3s ease-in-out infinite;
    }

    @keyframes shinning {
        0% {

        }
        50% {
            text-shadow: 0 0 5px #E0CCA8;
        }
        100% {

        }
    }

    .el-menu.el-menu--horizontal {
        border-bottom: none;
    }
    .el-menu-item {
        font-size:16px;
    }
    .content-center {
        width:98vw;
        text-align:center;
    }
    .feature-intro {
        display: flex;
        width:98vw;
        align-items: center;
        justify-content: center;
        margin-bottom:100px;
        .intro-block {
            display: flex;
            flex-direction: column;
            align-items: center;
            width:212px;
            padding:20px;
            margin:0 20px;
            background: rgba(255,255,255,1);
        }
    }
    .intro-layout {
        height: 42px;
        width:52px;
        margin-bottom: 32px;
    }
    .intro-bg-layout {
        background: url("~@/assets/images/layout.png");
    }
    .intro-bg-setting {
        background: url("~@/assets/images/config.png");
    }
    .intro-bg-equipment {
        background: url("~@/assets/images/equipment.png");
    }
    .intro-bg-warehouse {
        background: url("~@/assets/images/warehouse.png");
    }
    .intro-bg-barcode {
        background: url("~@/assets/images/barcode.png");
    }
    .intro-title {
        font-size:16px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        margin-bottom: 20px;
    }
    .intro-text {
        color:rgba(128,128,128,1);
        font-size:14px;
        font-family:PingFang-SC-Regular,PingFang-SC;
        margin-bottom: 20px;
        letter-spacing: 2px;
        height:88px;
    }
    .sample-intro {
        background: #ffffff;
        padding:80px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .sample-title {
        font-size:32px;
        color:rgba(51,51,51,1);
    }
    .sample-text {
        margin-top:80px;
        font-size:14px;
        color:rgba(128,128,128,1);
        max-width: 1140px;
        text-align: left;
    }
    .sample-items {
        display: flex;
        justify-content: space-around;
        margin-top:30px;
        max-width:1160px;
        .items-block {
            text-align: center;
            width:173px;
            height:40px;
            line-height: 40px;
            vertical-align: middle;
            background: url("~@/assets/images/icon_xuxian.png");
            margin:0 10px;
        }
    }
    .sample-image {
        background: url("~@/assets/images/location_group.png");
        width:910px;
        height:296px;
        margin-top:60px;
    }
    .portal-footer {
        position:static;
        bottom: 0px;
        height:264px;
        display: flex;
        align-items: center;
        flex-direction: column;
        background: #30343E;
        .footer-links {
            max-width:1160px;
            min-width: 60vw;
            height:186px;
            display: flex;
            justify-content: space-around;
            font-size:14px;
            .links-block {
                list-style: none;
                display: inline-block;
                padding:26px 0;
                li.link-index {
                    margin-bottom: 20px;
                    color:#FFFFFF;
                }
                li.link-items {
                    margin-bottom: 15px;
                    cursor: pointer;
                    color:#999999;
                }
            }
        }
        .footer-banner {
            height:78px;
            width:100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #292C33;
            color:#808080;
            font-size:14px;
            span {
                margin:0 52px;
            }
        }
    }

</style>