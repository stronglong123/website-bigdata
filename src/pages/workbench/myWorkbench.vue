<template>
    <div style="height:90vh;overflow: auto;">
        <div class="ant-advanced-search-form">
            <el-row :gutter="20" type="flex" justify="space-between" align="middle">
                <el-col :span="8">工作概况</el-col>
                <el-col :span="16" style="text-align: right;">
                    <div :style="{ marginRight: '16px',display:'inline-block'}">
                        <a-radio-group v-model="indicatorRange" buttonStyle="solid">
                            <a-radio-button value="day">今天</a-radio-button>
                            <a-radio-button value="week">本周</a-radio-button>
                            <a-radio-button value="month">本月</a-radio-button>
                            <a-radio-button value="year">全年</a-radio-button>
                        </a-radio-group>
                    </div>
                    <a-range-picker v-model="dateRange" :allowClear="false"></a-range-picker>
                </el-col>
            </el-row>
            <div class="indicator-content">
                <index-component :indexes="inboundIndexes" :loading="valueLoading" @click="handleIndicatorRouter"></index-component>
                <index-component :indexes="putawayIndexes" bg-color="#2EC25B" :loading="valueLoading" @click="handleIndicatorRouter"></index-component>
                <index-component :indexes="outboundIndexes" bg-color="#F9CD14"
                                 :loading="valueLoading" @click="handleIndicatorRouter"></index-component>
            </div>
        </div>

        <div class="ant-advanced-search-form">
            <el-row :gutter="20" type="flex">
                <el-col :span="8"></el-col>
                <el-col :span="16" style="text-align: right;">
                    <div :style="{ marginRight: '16px',display:'inline-block'}">
                        <a-radio-group v-model="reportRange" buttonStyle="solid">
                            <a-radio-button value="week">本周</a-radio-button>
                            <a-radio-button value="month">本月</a-radio-button>
                            <a-radio-button value="year">全年</a-radio-button>
                        </a-radio-group>
                    </div>
                    <a-range-picker v-model="reportDate" :allowClear="false" ></a-range-picker>
                </el-col>
            </el-row>
            <v-chart ref="storeIndicatorsChart" :options="options" manual-update/>
        </div>

        <div class="ant-advanced-search-form">
            <el-row :gutter="20" type="flex" justify="space-between" align="middle">
                <el-col :span="8">员工业绩</el-col>
                <el-col :span="16" style="text-align: right;">
                    <div :style="{ marginRight: '16px',display:'inline-block'}">
                        <a-radio-group v-model="employeeRange" buttonStyle="solid">
                            <a-radio-button value="day">今天</a-radio-button>
                            <a-radio-button value="week">本周</a-radio-button>
                            <a-radio-button value="month">本月</a-radio-button>
                            <a-radio-button value="year">全年</a-radio-button>
                        </a-radio-group>
                    </div>
                    <a-range-picker v-model="employeeDate" :allowClear="false"></a-range-picker>
                </el-col>
            </el-row>
            <div class="employee-content">
                <el-table :data="employeeData" height="300" fit size="medium" style="width:100%" row-key="employeeId">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column
                            property="employeeName"
                            label="姓名"
                            width="120"
                    >
                    </el-table-column>
                    <el-table-column
                            property="employeeTypeStr"
                            label="工种"
                    >
                    </el-table-column>
                    <el-table-column
                            property="inboundNum"
                            label="收货量"
                    >
                        <template slot-scope="scope">
                            {{scope.row.packageTakeCount || 0}}大件{{scope.row.unitTakeCount || 0}}小件
                        </template>
                    </el-table-column>
                    <el-table-column
                            property="putawayNum"
                            label="上架量"
                    >
                        <template slot-scope="scope">
                            {{scope.row.packagePutawayCount || 0}}大件{{scope.row.unitPutawayCount || 0}}小件
                        </template>
                    </el-table-column>
                    <el-table-column
                            property="fillNum"
                            label="补货量"
                    >
                        <template slot-scope="scope">
                            {{scope.row.packageReplenishmentCount || 0}}大件{{scope.row.unitReplenishmentCount || 0}}小件
                        </template>
                    </el-table-column>
                    <el-table-column
                            property="pickNum"
                            label="拣货量"
                    >
                        <template slot-scope="scope">
                            {{scope.row.packagePickingCount || 0}}大件{{scope.row.unitPickingCount || 0}}小件
                        </template>
                    </el-table-column>
                    <el-table-column
                            property="sowNum"
                            label="播种量"
                    >
                        <template slot-scope="scope">
                            {{scope.row.packageSowCount || 0}}大件{{scope.row.unitSowCount || 0}}小件
                        </template>
                    </el-table-column>
                    <el-table-column
                            property="checkNum"
                            label="复核量"
                    >
                        <template slot-scope="scope">
                            {{scope.row.packageReCheckCount || 0}}大件{{scope.row.unitReCheckCount || 0}}小件
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import ECharts from 'vue-echarts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/dataZoom'
    import IndexComponent from "./indexComponent";
    import moment from 'moment'
    import Bus from "@/components/eventBus/eventBus.js"
    import {inboundIndexes, putawayIndexes, outboundIndexes} from "./indicators";
    import {getTaskIndicators,getStoreIndicators,getWorkerIndicators} from 'api/workbenchApi'

    const getDateStr = function (days = 7) {
        const dateArr = []
        Array.from({length: days}, (v, k) => k).reverse().forEach(num => {
            dateArr.push(moment().subtract(num, 'days').format('YYYY-MM-DD'))
        })
        return dateArr
    }

    const options = {
        title: {
            text: '仓库吞吐量统计表',
            subtext: '累计吞吐量：10,000'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['总吞吐', '库存量', '入库量', '出库量',]
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: getDateStr()
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                fieldName:'outStockCount',
                name: '出库量',
                type: 'line',
                smooth: true,
                areaStyle: {},
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                fieldName:'inStockCount',
                name: '入库量',
                type: 'line',
                smooth: true,
                areaStyle: {},
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                fieldName:'inventoryCount',
                name: '库存量',
                type: 'line',
                smooth: true,
                areaStyle: {},
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                fieldName:'totalCount',
                name: '总吞吐',
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                data: [320, 332, 301, 334, 390, 330, 320]
            },
        ]
    };
    export default {
        name: "my-workbench",
        components: {
            IndexComponent,
            'v-chart': ECharts
        },
        data() {
            return {
                options,
                inboundIndexes,
                putawayIndexes,
                outboundIndexes,
                indicatorRange: 'day',
                dateRange: [moment().startOf('day'), moment().endOf('day')],
                reportRange: 'week',
                reportDate: [moment().startOf('week'), moment().endOf('day')],
                employeeRange: 'day',
                employeeDate: [moment().startOf('day'), moment().endOf('day')],
                employeeData: [],
                valueLoading: false
            }
        },
        mounted() {
            this.renderTaskIndicators(this.dateRange)
            this.renderStoreIndicators(this.reportDate)
            this.renderWorkerIndicators(this.employeeDate)

        },
        watch: {
            indicatorRange(val) {
                this.dateRange = [moment().startOf(val), moment().endOf('day')]
            },
            dateRange(val) {
                this.inboundIndexes.forEach(it => it.params && (it.params.businessTime = val))
                this.putawayIndexes.forEach(it => it.params && (it.params.createTime = val))
                this.outboundIndexes.forEach(it => it.params && (it.params.orderCreateTime = val))
                this.renderTaskIndicators(val)
            },
            reportRange(val) {
                this.reportDate = [moment().startOf(val), moment().endOf('day')]
            },
            reportDate(val) {
                if (val) {
                    this.renderStoreIndicators(val)
                }
            },
            employeeRange(val) {
                this.employeeDate = [moment().startOf(val), moment().endOf('day')]
            },
            employeeDate(val) {
                if (val) {
                    this.renderWorkerIndicators(val)
                }
            },
            chooseRoleInfoList(val) {
                this.renderTaskIndicators(this.dateRange)
                this.renderStoreIndicators(this.reportDate)
                this.renderWorkerIndicators(this.employeeDate)
            },
        },
        methods: {
            handleIndicatorRouter(item) {
                Bus.$emit('tabOpen',item)
            },
            renderTaskIndicators(dateRange = []) {
                if (dateRange.length === 2) {
                    const {warehouseId} = this.getUserContext()
                    const startTime = moment(dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
                    const endTime = moment(dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
                    this.disableLoading()
                    this.valueLoading = true
                    getTaskIndicators({warehouseId,startTime,endTime}).then(data => {
                        this.inboundIndexes.forEach(it => it.value = data[it.fieldName] || 0)
                        this.putawayIndexes.forEach(it => it.value = data[it.fieldName])
                        this.outboundIndexes.forEach(it => it.value = data[it.fieldName])
                        this.valueLoading = false
                        this.enableLoading()
                    }).catch(e => {
                        this.valueLoading = false
                        this.enableLoading()
                    })
                }
            },

            renderStoreIndicators(dateRange = []) {
                if (dateRange.length === 2) {
                    const {warehouseId} = this.getUserContext()
                    const startTime = moment(dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
                    const endTime = moment(dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
                    getStoreIndicators({warehouseId,startTime,endTime}).then(data => {
                        const xAxisArr = data.map(it => it.statisticsTime)
                        this.options.xAxis[0].data = xAxisArr
                        const {series} = this.options
                        series.forEach(it => {
                            it.data = []
                            const {fieldName} = it
                            data.forEach(record => {
                                it.data.push(record[fieldName] || 0)
                            })
                        })
                        this.$refs.storeIndicatorsChart.mergeOptions(this.options)
                    }).catch(e => {
                        // this.$message.error(`库存指标查询失败，原因:${e}`)
                    })
                }
            },
            renderWorkerIndicators(dateRange = []) {
                if (dateRange.length === 2) {
                    const {warehouseId} = this.getUserContext()
                    const startTime = moment(dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
                    const endTime = moment(dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
                    getWorkerIndicators({warehouseId,startTime,endTime}).then(data => {
                        if (data && data.length) {
                            this.employeeData = data
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-row {
        height: 36px;
        margin-bottom: 16px;
    }

    .ant-advanced-search-form {
        padding: 16px;
        background: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        margin: 10px 0;
        .indicator-params {

        }
        .indicator-content {
            display: flex;
            justify-content: space-between;
        }
    }

    .echarts {
        width: 98%;
        height: 360px;
    }
</style>