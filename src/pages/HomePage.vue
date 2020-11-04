<template>
    <div id="homepage">
        <el-container
                style="position: fixed;top:0;bottom:0;width:100%;"
                v-loading="menuLoading"
        >
            <!-- v-if="isLogin" -->
            <el-header class="header-wrap">
                <div class="header-logo">
<!--                    <img v-if="!imgSrc && themeTitle==='默认'" src="../assets/icons/logo_red.png" class="logoImage"/>-->
                    <img v-if="!imgSrc && themeTitle!='默认' && themeTitle!='极简红'" src="../assets/icons/logo_white.png"
                         class="logoImage"/>
                    <img v-if="!imgSrc && themeTitle==='极简红'" src="../assets/icons/logo_red.png" class="logoImage"/>
                    <img v-if="imgSrc" :src="imgSrc" style="border-radius: 4.5px;"/>
                    <span class="menu-header">{{companyLogoName}}</span>

                </div>
                <div class="header-module-menu">
                    <template v-if="hasMenu">
                        <div
                                class="module-menu-block"
                                :class="{selected:index === curIndex}"
                                @click="()=>selectModule(index)"
                                v-for="(menu,index) in roleModules"
                                :key="index"
                        >
                            <span> <a-icon :type="menu.icon" theme="filled"/>{{' '+ menu.title}}</span>
                        </div>
                    </template>

                    <div class="module-menu-block"
                    >
                        <a-popover placement="bottom" @visibleChange="(visible) => {visible && renderQrCode()}">
                            <template slot="content">
                                <el-tabs :value="1" type='border-card' tab-position="left" stretch
                                         style="height: 200px;">
                                    <el-tab-pane label="移动点货(安卓)" :name="1">
                                        <div id="qrcode1"></div>
                                    </el-tab-pane>
                                    <el-tab-pane label="移动点货(IOS)" :name="2">
                                        <div id="qrcode2"></div>
                                    </el-tab-pane>
                                    <el-tab-pane label="移动配送(安卓)" :name="3">
                                        <div id="qrcode3"></div>
                                    </el-tab-pane>
                                    <el-tab-pane label="移动配送(IOS)" :name="4">
                                        <div id="qrcode4"></div>
                                    </el-tab-pane>
                                </el-tabs>
                            </template>
                            <template slot="title">
                                请扫描下载点货和配送应用
                            </template>
                            <span> <a-icon type="mobile" theme="filled"/> 移动应用</span>
                        </a-popover>
                    </div>
                    <div class="module-menu-block"

                    >
                        <a-dropdown>
                            <span><a-icon type="question-circle" theme="filled"/> 帮助</span>
                            <a-menu slot="overlay">
                                <a-menu-item @click="handleHelpClick" key="quickStart">快速上手</a-menu-item>
                                <a-menu-item @click="handleHelpClick" key="operationManual">操作手册</a-menu-item>
                                <a-menu-item @click="handleHelpClick" key="videoTraining">视频培训</a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </div>
                    <!-- 主题 -->
                    <div class="module-menu-block"

                    >
                        <a-dropdown>
                            <span><a-icon type="skin" theme="filled"/> 换肤</span>
                            <a-menu slot="overlay">
                                <a-menu-item v-for="item in themeList" :key="item.title" @click="changeTheme(item)">
                                    {{item.title}}
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </div>
                </div>
                <div class="main-content-header">
                    <div class="top-bar" :style="{color:currentTheme.headFontColor}">
                        <span class="welcomeUser">{{userInfo.trueName}}, 你好</span>
                        <el-dropdown @command="changeRole" trigger="click" :style="{color:currentTheme.headFontColor}">
              <span class="el-dropdown-link">
                {{`${chooseRoleInfoList.orgName}`}}
                <i
                        class="el-icon-arrow-down el-icon--right"
                ></i>
              </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                        command="changePassword"
                                >
                                    <a-icon type="setting"/>
                                    修改密码
                                </el-dropdown-item>
                                <el-dropdown-item
                                        command="exit"
                                >
                                    <a-icon type="logout"/>
                                    退出登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </el-header>

            <!--侧边栏导航菜单-->
            <el-container class="coverMenu">
                <el-aside
                        :class="!asideCollapse?'menu-wrap aside-navs-expand':'menu-wrap aside-navs-shrink'"
                        :style="{backgroundColor:currentTheme.menuBackGroundcolor}"
                >
                    <div class="aside-control">
                        <a-icon :type="menuClass" @click="()=>{this.asideCollapse = !this.asideCollapse}"/>
                    </div>
                    <el-menu
                            :collapse="asideCollapse"
                            :collapse-transition="true"
                            :unique-opened="true"
                            background-color="rgb(3,22,38)"
                            text-color="#fff"
                            active-text-color="#fff"
                            :default-active="defaultActive"
                            :default-openeds="defaultOpenedMenus"
                            class="newMenu"
                    >
                        <el-submenu v-for="item in pageMenus" :index="'' + item.id" :key="item.id"
                                    @click.native="handleMenuClick(item)"
                        >
                            <template slot="title">
                                <i class="iconfont icon-dingdan" v-if="item.id=='inStockManage'"></i>
                                <i class="iconfont icon-chanpin" v-if="item.id=='outStockManage'"></i>
                                <i class="iconfont icon-renyuan" v-if="item.id=='OwnerManage'"></i>
                                <a-icon type="project" v-if="item.id=='waveManage'"></a-icon>
                                <a-icon type="ordered-list" v-if="item.id=='seedManage'"></a-icon>
                                <a-icon type="line-chart" v-if="item.id=='storeReport'"/>
                                <a-icon type="hdd" v-if="item.id=='inventoryCheck'"/>
                                <i class="iconfont icon-cangkucangchu" v-if="item.id=='warehouseManage'"></i>
                                <i class="el-icon-document" v-if="item.id=='documentManage'"></i>
                                <i class="iconfont icon-jichushujuguanli" v-if="item.id=='BaseDataManage'"></i>
                                <i class="iconfont icon-config" v-if="item.id=='baseInfoManage'"></i>
                                <i class="iconfont icon-config" v-if="item.id=='sysSetting'"></i>
                                <i class="el-icon-location-outline" v-if="item.id=='AttendanceManage'"></i>
                                <i class="iconfont icon-icon" v-if="item.id=='serviceManage'"></i>
                                <i class="el-icon-date" v-if="item.id=='attendance'"></i>
                                <a-icon class="iconfont" type="reconciliation"
                                        v-if="item.id=='warehouseOperationManage'"/>
                                <a-icon type="printer" v-if="item.id=='printModule'"/>
                                <a-icon type="solution" class="iconfont" v-if="item.id=='dataReport'"/>
                                <a-icon type="team" v-if="item.id == 'adminUserManage'"/>
                                <i class="el-icon-box" v-if="item.id=='transManager'"/>
                                <i class="el-icon-truck" v-if="item.id == 'vehicleManage'"/>
                                <i class="el-icon-copy-document" v-if="item.id == 'transAreaManage'"/>
                                <a-icon type="global" v-if="item.id == 'logisticsManage'"/>
                                <i class="el-icon-first-aid-kit" v-if="item.id == 'auditManage'"/>
                                <i class="el-icon-tickets" v-if="item.id === 'orderManage'"/>
                                <i class="el-icon-s-tools" v-if="item.id === 'integrateConfig'"/>
                                <a-icon type="clock-circle" v-if="item.id=='warehousePerform'"/>
                                <i class="el-icon-receiving" v-if="item.id === 'eorderConfig'"/>
                                <a-icon type="pay-circle" v-if="item.id=='receivables'"/>
                                <a-icon type="check-circle" v-if="item.id=='orderConfirm'"/>
                                <a-icon type="apartment" v-if="item.id=='transferManger'"/>
                                <span
                                        slot="title"
                                >{{(antdItems.includes(item.id)? ' ':'') +item.text}}</span>
                            </template>
                            <el-menu-item-group v-for="itemNav in item.navList" :key="itemNav.id"
                            >
                                <el-menu-item :key="`${item.id}-${itemNav.id}`"
                                              :index="item.id+'-'+itemNav.id"
                                              @click="handleMenuClick(itemNav,item)"
                                >{{itemNav.name}}
                                </el-menu-item>
                                <!-- v-if="itemNav.id!=='storeReportManager'" -->
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main :class="asideCollapse?'main-contents-expand':'main-contents-shrink'">
                    <el-tabs
                            v-model="editableTabsValue"
                            closable
                            @edit="handleTabsEdit"
                            @tab-click="handleTabsClick"
                    >
                        <el-tab-pane
                                :key="item.name"
                                v-for="(item, index) in editableTabs"
                                :label="item.title"
                                :name="item.name"
                        ></el-tab-pane>
                    </el-tabs>
                    <transition>
                        <keep-alive>
                            <router-view v-if="$route.meta.keepalive" class="main-content-box"></router-view>
                        </keep-alive>
                    </transition>
                    <transition>
                        <router-view v-if="!$route.meta.keepalive" class="main-content-box"></router-view>
                    </transition>
                </el-main>
            </el-container>

            <!--主内容区-->
        </el-container>
        <!-- 修改密码 -->
        <a-modal
                title="修改密码"
                :visible="changePasswordVisible"
                :footer='null'
                :closable='false'
                destroyOnClose
        >
            <!--            <changePassword-->
            <!--               @changeSuccess='changeSuccess' -->
            <!--               @cancle='cancle'-->
            <!--            ></changePassword>-->
        </a-modal>
        <vstyle>
            <!-- 顶部header样式覆盖 -->
            .header-wrap{
            background-color: {{currentTheme.headBackGroundColor}};
            }

            .logoImage{
            width:32px;
            height:32px;
            background-color:{{currentTheme.headBackGroundColor}}
            }

            .header-wrap .header-module-menu .module-menu-block{
            background-color: {{currentTheme.headBackGroundColor}};
            color:{{currentTheme.headFontColor}};
            }

            .header-module-menu .module-menu-block.selected{
            background-color: {{currentTheme.headBackColor+'!important'}};
            color: {{currentTheme.headHoverColor+'!important'}};
            }

            .header-module-menu .module-menu-block:hover{
            background-color: {{currentTheme.headBackColor + '!important'}};
            color: {{currentTheme.headHoverColor + '!important'}};
            }


            .top-bar {
            color: {{currentTheme.headFontColor}};
            }

            .top-bar .el-dropdown{
            color: {{currentTheme.headFontColor}};
            }

            <!-- 左侧菜单样式覆盖 -->
            .menu-wrap{
            background-color: {{currentTheme.menuBackGroundcolor}};
            }

            .menu-wrap .aside-control i{
            color: {{currentTheme.menuFontColor}} !important;
            }
            <!-- .el-menu-item.is-active{
                color:{{currentTheme.activeFontColor}} !important
            } -->

            .el-menu,
            .el-menu-item {
            background-color: {{currentTheme.menuBackGroundcolor}} !important;
            }
            .el-menu-item.is-active {
            background-color: {{currentTheme.activeMenuColor}} !important;
            color: {{currentTheme.activeFontColor}} !important;
            }

            .el-tabs__active-bar{
            background-color: {{currentTheme.tabsColor}} !important;
            }

            .el-tabs .el-tabs__header .el-tabs__nav .el-tabs__item.is-active, .el-tabs .el-tabs__header .el-tabs__nav
            .el-tabs__item:hover{
            color: {{currentTheme.tabsColor}} !important;
            }

            .menu-header{
            color:{{currentTheme.logoColor}} !important;
            }

            .welcomeUser{
            color:{{currentTheme.userColor}} !important;
            }

            .el-dropdown-link.el-dropdown-selfdefine{
            color:{{currentTheme.userColor}} !important;
            }


            .el-submenu__title {
            background-color: {{currentTheme.menuBackGroundcolor}} !important;
            color: {{currentTheme.menuFontColor}} !important;
            }

            .el-submenu__title i:nth-child(1) {
            color: {{currentTheme.menuFontColor}} !important;
            }
            .el-menu-item {
            color: {{currentTheme.menuFontColor}} !important;
            }
            .el-menu-item i:not(.iconfont):nth-child(1) {
            color: {{currentTheme.menuFontColor}} !important;
            }
            .el-submenu__title:hover,
            .el-menu-item:not(.is-active):hover {
            color: {{currentTheme.menuFontHoverColor}} !important;
            background-color: {{currentTheme.menuHoverColor}} !important;
            }
            .el-submenu__title i:not(.iconfont):nth-child(1),
            .el-menu-item i:not(.iconfont):nth-child(1){
            width: 20px;
            font-size: 18px;
            }
            .el-submenu__title:hover i,
            .el-menu-item:not(.is-active):hover i{
            color: {{currentTheme.menuFontHoverColor}} !important;
            }
            .el-menu-item-group__title {
            padding: 0;
            }
            <!-- 中间内容部分边框 -->
            .main-contents-shrink {
            box-shadow: {{currentTheme.boxShadow}};
            }

            .main-contents-expand {
            box-shadow: {{currentTheme.boxShadow}};
            }

            .menu-wrap .el-menu .el-submenu {
            border-top: 1px solid {{currentTheme.menuTopBorder}};
            }

            .aside-navs-expand {
            box-shadow: {{currentTheme.boxShadow}};
            }

            .aside-navs-shrink {
            box-shadow: {{currentTheme.boxShadow}};
            }
        </vstyle>
    </div>
</template>

<script>
    import {mapState, mapActions, mapMutations} from 'vuex';
    import Bus from '@/components/eventBus/eventBus.js'
    import {getMemuList, clearCookie} from "../api/loginApi";
    import QRCode from 'qrcodejs2'
    import menuGroups from './routerGroup'
    import theme from '../assets/css/theme.js'
    import {menu} from '../mock/menu.js'
    // import changePassword from './setting/changePassword'


    const antdItems = ['waveManage', 'seedManage', 'storeReport', 'inventoryCheck', 'printModule', 'adminUserManage', 'logisticsManage', 'warehousePerform', 'receivables', 'orderConfirm', 'transferManger']
    const moduleMenus = [
        {
            icon: 'book',
            title: '今日工作',
            menus: menuGroups.myWorks
        },
        {
            icon: 'home',
            title: '我的计划',
            menus: menuGroups.myWarehouse
        },
        {
            icon: 'fund',
            title: '数据收集',
            menus: menuGroups.storeReports
        },
        {
            icon: 'setting',
            title: '系统设置',
            menus: menuGroups.sysSettings
        }
    ]

    export default {
        name: "homepage",
        data() {
            return {
                roleList: menu,
                editableTabsValue: "1空页面",
                editableTabs: [
                    {
                        title: "新标签页",
                        name: "1空页面"
                    }
                ],
                tabIndex: 1,
                menuLoading: false,
                asideCollapse: false,
                antdItems,
                // 当前激活菜单index
                defaultActive: "",
                defaultOpenedMenus: [],
                activeParams: null,
                // 当前页面路由属性
                routerList: [],
                // defaultActive列表
                defaultActiveList: [],
                // 所有的tab标签的index
                allTabIndex: [],
                defaultCityLength: 5,
                filterName: '',
                rfQrCoder: null,
                roleModules: moduleMenus,
                curIndex: 0,
                oriOrg: '',
                themeList: [],
                currentTheme: {},
                themeTitle: '',
                refList: [],
                moduleMenuBlock: 'moduleMenuBlock',
                // 统计报表菜单
                storeReportManagerList: [],
                changePasswordVisible: false,
                roleCodes: [],
                hasMenu: true,
                searchKey: '',
                trueMenu: [],
                oldRouterPath: '',
                companyLogoName: '大数据系统',
                imgSrc: '',
                allowRefesh: true
            };
        },
        components: {
            // changePassword
        },
        computed: {
            rfDownloadUrl() {
                const {envNo} = this.getUserContext()
                if (envNo === 0) {
                    return 'http://yjp-appdownload.ufile.ucloud.com.cn/pda_tianchao.apk'
                } else {
                    return 'http://yjp-appdownload.ufile.ucloud.com.cn/pda.apk'
                }
            },

            rfDownloadUrlIOS() {
                const {envNo} = this.getUserContext()
                if (envNo === 0) {
                    return 'itms-services://?action=download-manifest&url=https://publish.yijiupi.com/pda_tianchao.plist'
                } else {
                    return 'itms-services://?action=download-manifest&url=https://publish.yijiupi.com/pda.plist'
                }
            },
            ypsDownloadUrl() {
                const {envNo} = this.getUserContext()
                if (envNo === 0) {
                    return 'http://yjp-appdownload.ufile.ucloud.com.cn/delivery_tianchao.apk'
                } else {
                    return 'http://yjp-appdownload.ufile.ucloud.com.cn/EJPDeliver.apk'
                }
            },
            ypsDownloadUrlIOS() {
                const {envNo} = this.getUserContext()
                if (envNo === 0) {
                    return 'itms-services://?action=download-manifest&url=https://publish.yijiupi.com/delivery_tianchao.plist'
                } else {
                    return 'itms-services://?action=download-manifest&url=https://publish.yijiupi.com/EJPTerminal.plist'
                }
            },
            isLogin() {
                return !!this.token;
            },
            menuClass() {
                return this.asideCollapse ? 'menu-unfold' : 'menu-fold'
            },
            roleCities() {
                return this.userInfo.userLoginAuth.filter(it => !this.filterName || it.orgName.indexOf(this.filterName) !== -1).filter((it, index) => index < this.defaultCityLength)
            },
            pageMenus() {
                if (this.curIndex >= this.roleModules.length) {
                    this.curIndex = 0
                }
                const curModule = this.roleModules[this.curIndex]
                if (!curModule) {
                    return []
                }
                const menuNames = curModule.menus.map(it => it.name)
                return this.roleList.filter(it => it.navList && it.navList.some(nav => {
                    let navArr = nav.id.split('/')
                    return menuNames.includes(navArr[0])
                }))
            },
            ...mapState('user', [
                'token',
                'userInfo',
                'choosenRole',
                'choosenOrg',
                'choosenWarehouse',
                'chooseRoleInfoList',
                'serviceId'
            ])
        },
        mounted() {
            const {cityId, orgId, warehouseId, orgType} = this.getUserContext()
            this.themeList = theme
            this.currentTheme = theme[0].themeData
            this.themeTitle = theme[0].title
            this.routerList = this.$router.options.routes.find(it => it.name === 'homepage').children
            // 判断
            this.oriOrg = {orgId: this.choosenOrg, warehouseId: this.choosenWarehouse}
            this.changeRole({orgId: this.choosenOrg, warehouseId: this.choosenWarehouse});
            Bus.$on('changeLogoName', this.getLogo)
            // this.getLogo()

            Bus.$on("tabClose", this.closeTab);
            Bus.$on("handleTabsEdit", this.handleTabsEdit);
            Bus.$on("tabOpen", this.openTab)
            // 登录超时，修改vuex里的数据
            Bus.$on('changeVuexData', this.changeVuexData)
            // 修改菜单
            // Bus.$on('getMenuList',this.getMenuList)
            // forbidden页面返回去除tab页

            Bus.$on('handleCloseTab', () => {
                // 1.用户直接输入的路由，这个时候不会添加tab页，点击返回返回上一个有权限的页面
                // 2.用户点击菜单，这个时候会添加tab页，点击返回返回上一个有权限的页面，并删除tab页
                this.$router.push({
                    path: this.oldRouterPath
                })
            })

            Bus.$on('updataUser', () => {
                this.allowRefesh = false
                this.changeRole(this.oriOrg)
            })
        },
        beforeDestroy() {
            Bus.$off('tabClose', this.closeTab)
            Bus.$off("handleTabsEdit", this.handleTabsEdit);
            Bus.$off("tabOpen", this.openTab)

            Bus.$off("changeVuexData", this.changeVuexData)
            // Bus.$off("getMenuList", this.getMenuList)
        },
        watch: {
            editableTabsValue(newValue) {
                if (newValue) {
                    let newValueArr = newValue.split('/')
                    if (this.activeParams) {
                        if (newValueArr.length > 1) {
                            this.$router.push({path: `/${newValue}`, params: this.activeParams});
                        } else {
                            this.$router.push({name: newValue, params: this.activeParams});
                        }
                        this.activeParams = null //用完立即重置参数，避免污染其他页面
                    } else {
                        if (newValueArr.length > 1) {
                            this.$router.push({path: `/${newValue}`});
                        } else {
                            this.$router.push({name: newValue});
                        }
                    }
                }
            },
            roleList: {
                handler(val) {
                    const roleMenus = this._.flatten(this.roleList.map(it => it.navList || []))
                    this.roleModules = moduleMenus.filter(module => module.menus.some(menu => roleMenus.some(it => {
                        let idArr = it.id.split('/')
                        return it.id.split('/')[0] === menu.name
                    })))
                },
                deep: true
            },
            '$route': 'handleRouteChange',
            searchKey(val) {
                this.searchRole(val)
            },
            pageMenus(val = []) {
                // this.defaultOpenedMenus = val.map(menu => menu.id)
                if (val.length) {
                    this.defaultOpenedMenus = [val[0].id]
                }
            }
        },
        methods: {
            getLogo() {
                const {cityId, warehouseId} = this.getUserContext()
                let timer = setInterval(() => {
                    if (typeof this.serviceId == 'number') {
                        clearInterval(timer)
                        // getLogo(cityId).then(data=>{
                        //     if(data.imagList&&data.imagList.length){
                        //         this.imgSrc = data.imagList[0].cloudSrc
                        //     }
                        //     if(data.logoName){
                        //         this.companyLogoName = data.logoName + '仓库管理系统'
                        //     }else{
                        //         this.companyLogoName = '仓库管理系统'
                        //     }
                        //     getVariableValue({variableKey:'companySystemLabel',companyId:this.serviceId,orgId:cityId,warehouseId})
                        //         .then(res => {
                        //             if(res && res.variableDataObject){
                        //                 if(data.logoName){
                        //                     this.companyLogoName = data.logoName + res.variableDataObject
                        //                 }else{
                        //                     this.companyLogoName = res.variableDataObject
                        //                 }
                        //             }
                        //         })
                        // }).catch(e=>{
                        //     this.$message.error(e)
                        // })
                    }
                }, 200);
            },
            changeSuccess() {
                this.changePasswordVisible = false
            },
            cancle() {
                this.changePasswordVisible = false
            },
            changeTheme(theme) {
                this.themeTitle = theme.title
                this.currentTheme = theme.themeData
            },
            selectModule(index) {
                this.curIndex = index
            },
            renderQrCode() {
                if (!this.rfQrCoder) {
                    setTimeout(() => {
                        this.rfQrCoder = new QRCode('qrcode1', {
                            width: 160,
                            height: 160,
                            text: this.rfDownloadUrl,
                            useSVG: false
                        })
                        new QRCode('qrcode2', {
                            width: 160,
                            height: 160,
                            text: this.rfDownloadUrlIOS,
                            useSVG: false
                        })
                        new QRCode('qrcode3', {
                            width: 160,
                            height: 160,
                            text: this.ypsDownloadUrl,
                            useSVG: false
                        })
                        new QRCode('qrcode4', {
                            width: 160,
                            height: 160,
                            text: this.ypsDownloadUrlIOS,
                            useSVG: false
                        })
                    }, 0)
                }
            },
            searchRole(value) {
                this.filterName = value
            },
            expandAside() {
                this.asideCollapse = false;
            },
            shrinkAside() {
                this.asideCollapse = true;
            },
            logOut() {
                clearCookie()
                this.$router.push({name: 'login'});
                this.logout()
            },
            //根据选中的角色找到对应的权限ID
            findAuthIdRole(code) {
                let findRole = this.userInfo.userLoginAuth.find(
                    item => item.orgId == code
                );
                this.updateChooseRoleInfoList(findRole);
            },
            //点击标签页
            handleTabsClick(e) {
                let index = this.roleModules.findIndex(it => {
                    return it.menus.some(data => {
                        return data.name === e.name.split('/')[0]
                    })
                })
                if (index >= 0) {
                    this.selectModule(index)
                }
                this.defaultActive = this.defaultActiveList.find(it => {
                    return it.split('-')[1] === e.name
                })
            },
            closeTab(tabName) {
                this.handleTabsEdit(tabName, 'remove')
            },
            openTab(item) {
                // 这里需往tab的数组里添加数据
                // 使点击tab可以使菜单跳到指定位置--------------------------------------------------------
                const {router, params} = item
                const tab = this.routerList.find(it => it.name === router)
                if (tab) {
                    this.activeParams = params
                    this.editableTabsValue = ''
                    const title = tab.meta.title || tab.title
                    this.handleTabsEdit({name: router, title: title}, 'add')
                }
            },
            //添加或者删除标签页
            handleTabsEdit(targetName, action) {
                if (action === "add") {
                    if (this.editableTabsValue == "1空页面") {
                        this.editableTabs.pop(1);
                        this.editableTabs.push({
                            name: targetName.name,
                            title: targetName.title
                        });
                        this.editableTabsValue = targetName.name;
                    } else {
                        this.editableTabsValue = targetName.name;

                        if (
                            !this.editableTabs.some(it => it.name === this.editableTabsValue)
                        ) {
                            this.editableTabs.push({
                                name: targetName.name,
                                title: targetName.title
                            });
                            let selectMainMenu = this.roleList.find(it => {
                                return it.navList.find(menu => {
                                    return menu.id === this.editableTabsValue
                                })
                            })
                            if (!this.defaultActiveList.some(it => it === selectMainMenu.id + '-' + this.editableTabsValue)) {
                                this.defaultActiveList.push(selectMainMenu.id + '-' + this.editableTabsValue);
                            }
                            this.handleTabsClick({name: this.editableTabsValue})
                        }
                    }
                    this.defaultActive = this.allTabIndex.find(it => it.indexOf(targetName.name) !== -1);
                }
                if (action === "remove") {
                    let tabs = this.editableTabs;
                    let delIndex = tabs.findIndex(it => {
                        return it.name === targetName
                    })

                    let WorkIndex = this.roleModules.findIndex(it => {
                        return it.menus.some(data => {
                            return data.name === tabs[delIndex - 1].name.split('/')[0]
                        })
                    })
                    if (WorkIndex >= 0) {
                        this.selectModule(WorkIndex)
                    }
                    if (delIndex - 1 >= 0) {
                        this.defaultActive = this.defaultActiveList[delIndex - 1]
                    }
                    let activeName = this.editableTabsValue;
                    if (activeName === targetName) {
                        tabs.forEach((tab, index) => {
                            if (tab.name === targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeName = nextTab.name;
                                }
                            }
                        });
                    }
                    this.editableTabsValue = activeName;
                    const index = tabs.findIndex(tab => tab.name === targetName)
                    this.editableTabs.splice(index, 1);

                    // this.defaultActive = ''
                    if (this.editableTabs.length === 0) {
                        const {warehouseId} = this.getUserContext()
                        if (!!warehouseId) {
                            const itemNav = {name: '工作看板', id: 'myWorkbench'}
                            const item = {name: '工作台', id: 'workbench'}
                            this.handleMenuClick(itemNav, item)
                        } else {
                            const itemNav = {name: '用户信息', id: 'manageState'}
                            const item = {name: '用户信息', id: 'workbench'}
                            this.handleMenuClick(itemNav, item)
                        }
                    }
                }
            },
            //点击菜单项
            handleMenuClick(itemNav, item) {
                event && event.stopPropagation();
                //如果菜单是需要在新窗口中打开，则不走下面的tab打开逻辑
                //先在homepage的子路由中寻找
                let router = this.routerList.find(it => {
                    let idArr = itemNav.id.split('/')
                    return idArr[0] === it.name
                })
                //没有则找顶层路由
                if (!router) {
                    router = this.$router.options.routes.find(it => it.name === itemNav.id)
                }
                //还没有，则什么都不做（实际上更好的方式是打开404页面）
                if (!router) return
                //判断该页面是不是需要在新窗口中打开，如果是，则打开新窗口并结束逻辑
                if (router.meta.windowOpen) {
                    const {href} = this.$router.resolve({
                        name: router.name
                    });
                    window.open(href, "_blank");
                    return
                }
                // 此处修改路由tab页
                if (item && itemNav) {
                    if (
                        !this.defaultActiveList.some(it => it === item.id + "-" + itemNav.id)
                    ) {
                        this.defaultActiveList.push(item.id + "-" + itemNav.id);
                    }
                }
                //切换选中的标签页
                //先看已打开的标签页中有没有
                // event && event.stopPropagation();
                let index = this.editableTabs.findIndex(
                    item => item.name === itemNav.id
                );
                //有的话切换
                if (index !== -1) {
                    this.editableTabsValue = itemNav.id;
                } else {
                    //判断当前所在页面是不是空页面(空页面的title属性都是“新标签页”,name属性都是数字加“空页面”)
                    //如果是空页面直接替换当前页面
                    let isAtEmptyPage = this.editableTabsValue.indexOf('空页面') !== -1;
                    if (isAtEmptyPage) {
                        let currentIndex = this.editableTabs.findIndex(
                            item => item.name === this.editableTabsValue
                        );
                        this.editableTabs[currentIndex] = {
                            title: itemNav.name,
                            name: itemNav.id
                        };
                    } else {
                        this.editableTabs.push({
                            title: itemNav.name,
                            name: itemNav.id
                        });
                    }
                    this.editableTabsValue = itemNav.id;
                }
            },
            handleHelpClick({key}) {
                if (key !== 'operationManual') {
                    this.$message('敬请期待');
                    return
                }
                // if(key === 'quickStart'){
                //     this.$message('敬请期待');
                //     return
                // }
                const {href} = this.$router.resolve({
                    name: key
                });
                window.open(href, "_blank");
            },
            // //获取菜单接口
            changeRole(selectRole) {
                if (selectRole === 'exit') {
                    this.logOut()
                    return;
                }
                if (selectRole === 'changePassword') {
                    this.changePasswordVisible = true
                    return;
                }
                if (this.oriOrg === selectRole && this.allowRefesh) {
                    return
                }
                let _this = this;
                // this.menuLoading = true
                this.oriOrg = selectRole
                //2.vuex修改，切换到新角色
                const {orgId, warehouseId} = selectRole;
                if(!this.userInfo||!this.userInfo.userLoginAuth){
                    return
                }
                const chooseRole = this.userInfo.userLoginAuth.find(role => role.warehouseId === warehouseId && role.orgId === orgId)
                if (!chooseRole) return
                const roleCodes = chooseRole.roleCodes.map(it => it.code)
                this.roleCodes = roleCodes
                this.updateOriginRole(roleCodes);
                this.updateUserRole(roleCodes);
                this.updateChooseRoleInfoList(chooseRole);
                this.updateUserOrg(orgId)
                this.updateUserWarehouse(warehouseId)
                this.getLogo()
                // findParentOrgBy(orgId).then(data => {
                //     this.updateServiceId(data)
                // }).catch(e => {
                //
                // })
                if (this.allowRefesh) {
                    getMemuList(orgId, warehouseId).then(data => {
                        _this.menuLoading = false;
                        if (data && data.length) {
                            const {roleCodes, orgId, cityId} = this.getUserContext()
                            let codes = []
                            roleCodes.forEach(it => {
                                codes.push(it.code)
                            })
                            const params = {
                                cityId: cityId,
                                codes: codes
                            }
                            _this.roleList = data;
                            _this.allTabIndex = []
                            data.forEach(subMenu => {
                                if (subMenu.navList && subMenu.navList.length) {
                                    subMenu.navList.forEach(menu => {
                                        _this.allTabIndex.push(subMenu.id + '-' + menu.id)
                                    })
                                }
                            })

                        } else {
                            _this.hasMenu = false;
                            _this.roleList = [];
                            this.$message.info('当前角色没有可用的菜单')
                        }
                    }).catch(e => {
                        _this.hasMenu = false;
                        _this.menuLoading = false;
                        _this.roleList = [];
                    })
                    this.closeAllTabs()
                    if (!!warehouseId) {
                        const {warehouseId, cityId} = this.getUserContext()
                        this.getProductionDateSetting(warehouseId)
                        this.getWarehouseWorkTime(cityId)
                        const itemNav = {name: '工作看板', id: 'myWorkbench'}
                        const item = {name: '用户信息', id: 'workbench'}
                        this.handleMenuClick(itemNav, item)
                    } else {
                        const itemNav = {name: '用户信息', id: 'manageState'}
                        const item = {name: '用户信息', id: 'workbench'}
                        this.handleMenuClick(itemNav, item)
                    }
                }
                this.allowRefesh = true
            },
            closeAllTabs() {
                this.editableTabs.splice(0, this.editableTabs.length);
                this.defaultActive = ''
                this.editableTabsValue = 'homepage';
            },
            // 点击浏览器返回tab切换
            handleRouteChange(newVal, oldVal) {
                this.oldRouterPath = oldVal.path
                let toActiveMenuName = this.defaultActiveList.find(it => {
                    return it.split('-')[1] === newVal.name
                })
                if (toActiveMenuName) {
                    this.defaultActive = toActiveMenuName
                    this.editableTabsValue = newVal.name
                }
            },
            getMenuList(data) {
                const {roleCodes, orgId, cityId} = this.getUserContext()
                this.trueMenu = []
                // 使用递归处理
                // this.getTrueMenu(0,data)
                // 使用定时器处理,请求时间比较少
                // --------------------------------------------
                let storeMenu = []
                let codes = []
                roleCodes.forEach(it => {
                    codes.push(it.code)
                })
                const params = {
                    cityId: cityId,
                    codes: codes
                }
                // 获取到了菜单
                // getTrueReportList(params).then(it => {
                //     this.storeReportManagerList = it
                // }).catch(e => {
                //     this.$message.error(e)
                // })
            },
            changeVuexData(val) {
                this.updateUserToken(val)
            },
            ...mapActions('user', ['logout']),
            ...mapActions('warehouseConfig', ['getProductionDateSetting', 'getWarehouseWorkTime']),
            ...mapMutations('user', [
                'updateUserRole',
                'updateOriginRole',
                'updateUserOrg',
                'updateUserWarehouse',
                'setRoleInfoList',
                'updateChooseRoleInfoList',
                'updateUserToken',
                'updateServiceId'
            ])
        }
    }
</script>

<style lang="scss">
    .aside-navs-expand {
        width: 272px !important;
        z-index: 2;
        box-shadow: 1px 0 5px rgba(3, 22, 38, 0.8);
        transition: all 0.2s;
    }

    .aside-navs-shrink {
        width: 64px !important;
        z-index: 2;
        box-shadow: 1px 0 5px rgba(3, 22, 38, 0.8);
        transition: all 0.2s;
    }

    .main-contents-shrink {
        width: calc(100% - 272px);
        background-color: #f0f2f5;
        transition: all 0.2s;
    }

    .main-contents-expand {
        width: calc(100% - 64px);
        background-color: #f0f2f5;
        transition: all 0.2s;
    }

    .main-content-box {
        height: calc(100vh - 118px);
        overflow-y: scroll;
    }

    /**
 * 页脚通用样式
 */
    .footer {
        text-align: center;
        border-top: 1px solid #eee;
        margin: 5px;
        padding: 20px;
    }

    /**
     * 主内容区 main 样式
     */
    .el-main {
        padding: 0;
    }

    /**
     * 左侧边栏 aside 样式
     */
    .menu-wrap {
        width: 100%;
        min-height: 100vh;
        font-family: pingFangSC-Regular, sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        background-color: rgb(3, 22, 38);

        .aside-control {
            text-align: right;
            height: 30px;
            line-height: 30px;
            vertical-align: middle;
            padding-right: 22px;

            i {
                color: #fff;
                font-size: 20px;
                cursor: pointer;
            }
        }

        .el-menu {
            border-right: 0;

            .el-submenu {
                border-top: 1px solid #000;
            }
        }

        .newMenu {
            // height: calc(100vh - 160px);
            height: calc(100vh - 94px);
            overflow: auto;
        }

        .newMenu::-webkit-scrollbar {
            width: 5px;
            height: 10px;
        }

        .newMenu::-webkit-scrollbar-track {
            background: rgb(239, 239, 239);
            border-radius: 2px;
        }

        .newMenu::-webkit-scrollbar-thumb {
            background: #bfbfbf;
            border-radius: 10px;
        }

        .newMenu::-webkit-scrollbar-corner {
            background: #179a16;
        }
    }

    /**
     * 页面头部通用样式
     */
    .header-wrap {
        height: 64px !important;
        line-height: 64px;
        overflow: hidden;
        background-color: #06223e;
        color: #fff;
        font-size: 14px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        > i {
            font-size: 20px;
            margin-right: 20px;
        }

        .header-logo {
            display: flex;
            align-items: center;
            width: 272px;

            > img {
                margin-right: 15px;
                position: relative;
                right: 4px;
                width: 32px;
                height: 32px;
            }

            .menu-header {
                height: 55px;
                color: #efefef;
                font-size: 18px;
                text-align: center;
                line-height: 55px;
                font-family: pingFangSC-Medium, sans-serif;
            }
        }

        .header-module-menu {
            display: flex;
            flex-grow: 1;
            align-items: center;
            font-size: 16px;
            font-family: 微软雅黑;

            .module-menu-block {
                display: flex;
                align-items: center;
                margin: 0 8px;
                padding: 0 5px;
                height: 36px;
                border-radius: 4px;
            }

            .module-menu-block.selected, .module-menu-block:hover {
                cursor: pointer;
                background-color: #fff;
                color: #000;
                transition: color 0.3s linear, background-color 0.3s linear;
            }
        }

        .main-content-header {
            /*background-color: #fff;*/
            color: #efefef;
            margin-bottom: 2px;

            .top-bar {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                .el-dropdown {
                    min-width: 150px;
                    margin: 0 30px;
                    color: #efefef;

                    .el-dropdown-link {
                        cursor: pointer;
                    }
                }

                .cancel {
                    color: #eafff8;
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }

    }

    @media screen and (max-width: 1024px) {
        .header-wrap .header-logo {
            width: 220px;
        }
        .header-wrap .header-module-menu {
            font-size: 12px;
        }
        .header-wrap .header-module-menu .module-menu-block {
            padding: 0 3px;
            margin: 0;
        }
    }


    @media screen and (min-width: 1024px) and (max-width: 1100px) {
        .header-wrap .header-logo {
            width: 220px;
        }
        .header-wrap .header-module-menu {
            font-size: 12px;
            // margin-right: 35px;
            margin: 0;
            justify-content: space-around;
            margin: 0 8px;
        }
        .header-wrap .header-module-menu .module-menu-block {
            padding: 0 3px;
            margin: 0;
        }
    }

    @media screen and (min-width: 1100px) and (max-width: 1340px) {
        .header-wrap .header-logo {
            width: 200px;
        }
        .header-wrap .header-module-menu {
            font-size: 15px;
            margin: 0 11px;
            justify-content: space-around;
        }
        .header-wrap .header-module-menu .module-menu-block {
            padding: 0 3px;
            margin: 0;
        }
    }

</style>
<style lang="scss">
    // element ui 全局样式表
    @import "../assets/fonts/PingFang.css";
    @import "../assets/css/common.less";

    .el-tabs--top {
        .el-tabs__item.is-closable {
            color: #666;
        }

        .el-tabs__item.is-closable:hover {
            .el-icon-close {
                opacity: 1;
            }
        }

        .el-icon-close {
            opacity: 0;
            position: absolute;
            top: 20px;
        }

    }

</style>