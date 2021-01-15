<template>
    <div>
        <a-card class="workBench">
            <el-row class="work-header">
                <el-col :span="24">
                    <div class="work-header-left">
                        <i class="el-icon-user-solid"></i>
                        <div>
                            <span class="greeting">
                                {{greetings}}，
                                <span>{{userInfo.trueName}}</span>
                                ，祝你开心每一天！
                            </span>
                            <div class="work-header-detail">
<!--                                <span>-->
<!--                                    您目前登录的单位是-->
<!--                                    <b>{{chooseRoleInfoList.orgName}}</b>-->
<!--                                </span>-->
<!--                                <span v-if="!isCustomer">-->
<!--                                    您在当前单位的角色是-->
<!--                                    <b>{{chooseRoleInfoList.roleCodes.map(role => role.name).join(',')}}</b>-->
<!--                                </span>-->
                            </div>
                        </div>
                    </div>
                </el-col>
                <!-- <el-col :span="12"></el-col> -->
            </el-row>
        </a-card>
        <a-card title="任务看板">
            <draggable></draggable>
        </a-card>
        <a-card title="常用菜单 / 便捷导航">
            <span v-if="originMenu.length===0">暂无可用菜单</span>
            <div v-else class="menuContain">
                <el-row :gutter="10">
                    <el-col :span="20">
                        <el-link
                            type="primary"
                            v-for="item in commonMenu"
                            class="menuItem"
                            :key="item.id"
                            @click="handleRouteChange(item)"
                        >{{item.name}}</el-link>
                    </el-col>
                    <el-col :span="4">
                        <a-button type="primary" @click="addMenu">编辑常用菜单</a-button>
                    </el-col>
                </el-row>
            </div>
        </a-card>
        <a-card title="工作指南">
            <div ref="chart" style="width:100%;height:376px"></div>
        </a-card>

        <a-modal title="请勾选常用菜单" :visible="visible" @ok="handleOk" @cancel="handleCancel">
            <a-tree
                checkable
                @expand="onExpand"
                :autoExpandParent="autoExpandParent"
                :expandedKeys="expandedKeys"
                v-model="checkedKeys"
                @select="onSelect"
                :selectedKeys="selectedKeys"
                :treeData="treeData"
                @check="check"
            />
        </a-modal>
    </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
import { getMemuList } from "api/loginApi";
import Bus from "@/components/eventBus/eventBus.js";
import draggable from "@/components/draggable/commonDraggable";


// 当前常用菜单
// 可以选择添加
// 添加后保存，以后都能使用
const allowVisitMenu = [
    "roleManage",
    "menuManage",
    "accountSetting",
    "servicerManage"
];


export default {
    data() {
        return {
            originMenu: [],
            commonMenu: [],
            visible: false,
            expandedKeys: [],
            checkedKeys: [],
            selectedKeys: [],
            autoExpandParent: true,
            treeData: [],
            allChildMenu: [],
            help: [
                {
                    title: "快速上手",
                    key: "quickStart"
                },
                {
                    title: "操作手册",
                    key: "operationManual"
                },
                {
                    title: "视频培训",
                    key: "videoTraining"
                }
            ],
            isCustomer:false,


        };
    },
    components: {
        draggable
    },
    mounted() {
        this.getUsualMenu(this.choosenOrg,this.choosenWarehouse)
        if(this.$store.state.user.choosenRole.find(it=>it==='Customer')){
            this.isCustomer = true
        }
        this.getEchartData();
    },
    watch: {
        choosenOrg(n) {
            this.getUsualMenu(n,this.choosenWarehouse)
        },
        choosenWarehouse(warehouse) {
            this.getUsualMenu(this.choosenOrg,warehouse)
        },
    },
    computed: {
        greetings() {
            let time = moment().format("HH");
            const timeSlot = [
                {
                    message: "早上好",
                    first: 6,
                    last: 11
                },
                {
                    message: "中午好",
                    first: 11,
                    last: 13
                },
                {
                    message: "下午好",
                    first: 13,
                    last: 18
                },
                {
                    message: "晚上好",
                    first: 18,
                    last: 24
                },
                {
                    message: "晚上好",
                    first: 0,
                    last: 6
                }
            ];
            return timeSlot.find(it => {
                return time >= it.first && time < it.last;
            }).message;
        },
        menuList() {
            return [];
        },
        ...mapState("user", ["userInfo", "choosenOrg", "choosenWarehouse","chooseRoleInfoList"])
    },
    methods: {
        getEchartData() {
            const chart = this.$refs.chart
            if (chart) {
                const myChart = this.$echarts.init(chart)
                const option = {
                    title: {
                        text: 'ECharts 入门示例'
                    },
                    tooltip: {},
                    legend: {
                        data:['销量']
                    },
                    xAxis: {
                        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                };

                myChart.setOption(option)
                window.addEventListener("resize", function() {
                    myChart.resize()
                })
            }
            this.$on('hook:destroyed',()=>{
                window.removeEventListener("resize", function() {
                    myChart.resize();
                });
            })
        },

        handleRouteChange(item) {
            let params = {
                fieldName: item.id,
                title: item.id,
                value: 0,
                router: item.id,
                params: {
                    createTime: [
                        moment().startOf("day"),
                        moment().endOf("day")
                    ],
                    state: 0
                }
            };

            Bus.$emit("tabOpen", params);
        },
        addMenu() {
            this.visible = true;
        },
        handleOk() {
            this.visible = false;
            this.commonMenu = [];
            this.checkedKeys.forEach(it => {
                let menu = this.allChildMenu.find(data => data.name === it);
                if (menu) {
                    this.commonMenu.push(menu);
                }
            });
        },
        handleCancel() {
            this.visible = false;
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys;
            this.autoExpandParent = false;
        },
        onSelect(selectedKeys, info) {
            this.selectedKeys = selectedKeys;
        },
        check(checkedKeys, e) {
            this.checkedKeys = checkedKeys;
        },
        goToHelp(item) {
            this.$message("敬请期待");
        },
        getUsualMenu(choosenOrg,choosenWarehouse) {
            // getMemuList(choosenOrg,choosenWarehouse)
            //     .then(data => {
            //         if (data && data.length > 0) {
            //             this.originMenu = data;
            //             this.commonMenu = []
            //             allowVisitMenu.forEach(it => {
            //                 data.forEach(Nav => {
            //                     if(Nav.navList){
            //                         Nav.navList.forEach(data => {
            //                             if (it === data.id) {
            //                                 this.commonMenu.push(data);
            //                             }
            //                         });
            //                     }
            //                 });
            //             });
            //
            //             // 往树形结构里添加数据
            //             this.treeData = [];
            //             this.checkedKeys = [];
            //             this.allChildMenu = [];
            //             data.forEach(it => {
            //                 if(it.navList){
            //                     it.navList.forEach(data => {
            //                         this.allChildMenu.push(data);
            //                     });
            //                     let children = it.navList.map(data => {
            //                         return {
            //                             title: data.name,
            //                             key: data.name
            //                         };
            //                     });
            //                     this.treeData.push({
            //                         title: it.name,
            //                         key: it.name,
            //                         children: children
            //                     });
            //                 }
            //             });
            //             this.commonMenu.forEach(it => {
            //                 this.checkedKeys.push(it.name);
            //             });
            //         } else {
            //             this.originMenu = [];
            //         }
            //     })
            //     .catch(e => {
            //         this.commonMenu = [];
            //         this.$message(e);
            //     });
        }
    }
};
</script>

<style lang="less" scoped>
.workBench {
    .workTitle {
        display: block;
        margin-bottom: 0;
        padding-right: 12px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
        font-size: 20px;
        line-height: 32px;
    }
    .work-header {
        margin: 20px 0;
        .work-header-left {
            display: flex;
            align-items: center;
            .el-icon-user,
            .el-icon-user-solid {
                font-size: 40px;
                margin-right: 20px;
            }
            .greeting {
                color: rgba(0, 0, 0, 0.85);
                font-weight: 500;
                font-size: 16px;
                line-height: 28px;
                > span {
                    font-weight: 600;
                }
            }
            .work-header-detail {
                > span {
                    margin: 0 10px;
                }
                > span:nth-child(1) {
                    margin-left: 0;
                }
            }
        }
    }
}
.menuContain {
    .parentMenu {
        font-size: 24px;
        font-weight: 500;
    }
    .menuItem {
        margin: 0 15px;
        cursor: pointer;
    }
}
.notice {
    > p {
        margin: 8px 0;
    }
    .link {
        display: block;
        width: fit-content;
        margin: 8px 0;
    }
}

</style>