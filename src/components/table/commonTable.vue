<template>
    <div id="components-form-search">
        <div class="search-result-list">
            <el-row :gutter="10">
                <el-col :span="16">
                    <slot name="leftActions" v-bind:rows="selectedRows"></slot>
                </el-col>
                <el-col :span="8" class="rightActions">
                    <slot name="rightActions"></slot>
                </el-col>
            </el-row>
            <el-table :data="dataList" height="300" fit size="medium"  @selection-change="handleSelectionChange" style="width:100%">
                <el-table-column type="index" label="序号"></el-table-column>
                <template v-for="col in columns">
                    <el-table-column
                            type="selection"
                            width="50"
                            v-if="col.type==='selection'">
                    </el-table-column>
                    <template v-else-if="!!col.slotRender">
                        <el-table-column
                                :key="col.key"
                                :property="col.key"
                                :label="col.title"
                                :width="col.width"
                                :fixed="col.fixed"
                                :sortable="col.sortable"
                                :formatter="col.formatter"
                                :show-overflow-tooltip="col.showOverflowTooltip"
                        >
                            <template slot-scope="scope">
                                <span v-html="col.slotRender(scope.row)"></span>
                            </template>
                        </el-table-column>
                    </template>

                    <template v-else-if="col.key !== 'operation'">
                        <el-table-column
                                :key="col.key"
                                :property="col.key"
                                :label="col.title"
                                :width="col.width"
                                :fixed="col.fixed"
                                :sortable="col.sortable"
                                :formatter="col.formatter"
                                :show-overflow-tooltip="col.showOverflowTooltip"
                        >
                        </el-table-column>
                    </template>

                    <el-table-column v-else
                                     :property="col.key"
                                     :label="col.title"
                                     :width="col.width"
                                     :fixed="col.fixed"
                                     :key="col.key"
                    >
                        <template slot-scope="scope">
                            <template v-for="(action,index) in rowActions">
                                <el-button :key="index" v-if="!action.conditions" type="text" @click="() => handleTableAction(action.type, scope.row,scope.$index)">{{action.text}}</el-button>
                                <el-button :key="index" v-else-if="action.conditions.every(condition => condition.value.includes(scope.row[condition.key]))" type="text" @click="() => handleTableAction(action.type, scope.row)">{{action.text}}</el-button>
                            </template>

                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </div>

    </div>
</template>

<script>
    import Bus from 'components/eventBus/eventBus'
    import moment from 'moment'
    export default {
        name: "common-table",
        data() {
            return {
                form:this.$form.createForm(this),
                searchItems:[],
                columns:[],
                dataList:[],
                rowActions:[],
                colSpan:8,
                selectedRows:[],
                pagination:{
                    pageSizesOptions: [10, 20, 50, 100],
                    defaultPageSize: 20,
                    currentPage: 1,
                    total: 0
                },
                moment,
                showSlot:false,
                expand:false,
            }
        },
        props:{
            schema:{
                type:Object,
                required:true
            },
            tableData:{
                type:Array,
                default:()=>[]
            },
            total:{
                type:Number,
                default:0
            },
            initOptions:{
                type:Object
            },
            pageName:{
                type:String
            }
        },
        created() {
            this.searchItems = this.schema.searchItems;
            this.columns = this.schema.columns;
            this.rowActions = this.schema.rowActions;
            this.dataList = this.tableData;
            this.pagination.total = this.total;
            if (this.initOptions) {
                const initKeys = Object.keys(this.initOptions)
                initKeys.forEach(key => {
                    const item = this.searchItems.find(it => it.name === key)
                    if (item) {
                        item.options = this.initOptions[key]
                    }
                })
            }
            this.remoteSearchOptions = this._.debounce(this.remoteSearchOptions,300)
        },
        mounted() {
            Bus.$on('triggerSearch',(type = '')=> {
                console.log('监听父组件查询事件！')
                this.emitSearch(type)
            })
        },
        beforeDestroy() {
            Bus.$off('triggerSearch', this.emitSearch)
        },
        computed:{
            count() {
                return this.searchItems.length > 6 ? (this.expand ? this.searchItems.length : 6) : this.searchItems.length
            }
        },
        watch: {
            schema(val) {
                this.clean();
                this.searchItems = this.schema.searchItems;
                this.columns = this.schema.columns;
                this.rowActions = this.schema.rowActions;
            },
            searchItems:{
                handler(val) {
                },
                deep:true
            },
            tableData(val) {
                this.dataList = [];
                this.dataList = val;
            },
            total(val) {
                this.pagination.total = val;
            },
            initOptions(val) {
                if (val) {
                    const initKeys = Object.keys(val)
                    initKeys.forEach(key => {
                        const item = this.searchItems.find(it => it.name === key)
                        if (item) {
                            this.$set(item,'options',val[key])
                        }
                    })
                }
            }
        },
        methods:{
            remoteSearchOptions(item, value) {
                if (item.dataSource) {
                    const {cityId,userId,orgId,warehouseId} = this.getUserContext()
                    item.dataSource(value, {cityId,userId,orgId,warehouseId}).then(data => {
                        this.$set(item,'options',data)
                    }).catch(e => {
                        console.log(`更新下拉数据失败，原因:${e}`)
                    })
                }
            },
            emitSearch(type) {
                if (type !== this.pageName) return;
                let pageParams = {};
                pageParams.pageNum = this.pagination.currentPage;
                pageParams.pageSize=this.pagination.defaultPageSize;
                this.form.validateFields((error, values) => {
                    if (!error) {
                        this.$emit(`search`,{...values, ...pageParams})
                    }
                })
            },
            handleInput(e) {
                if (e) {
                    e.preventDefault()
                    const val = e.target.value
                    if (val) {
                        this.showSlot = true
                    } else {
                        this.showSlot = false
                    }
                }
            },
            filterOption(input, option) {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            emitEmpty(fieldName) {
                this.form.resetFields([fieldName]);
                this.showSlot = false
            },
            handleReset() {
                this.form.resetFields();
            },
            filter(inputValue, path) {
                return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
            },
            clean() {
                this.searchItems = [];
                this.dataList = [];
                this.columns = [];
                this.pagination.currentPage = 1
                this.pagination.defaultPageSize = 20
                this.pagination.total = 0;
            },
            handleSizeChange(val) {
                this.pagination.defaultPageSize = val
                this.emitSearch(this.pageName)
            },
            handleCurrentChange(val) {
                this.pagination.currentPage = val
                this.emitSearch(this.pageName)
            },
            handleTableAction(type, row,index) {
                this.$emit('rowAction', {type:type, data: row,index:index})
            },
            handleSelectionChange(val) {
                this.selectedRows = val;
                this.$emit('select-change', this.selectedRows)
            },
        }
    }
</script>

<style scoped>
    .ant-advanced-search-form {
        padding: 24px;
        background: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
    }

    .ant-advanced-search-form .ant-form-item {
        display: flex;
    }

    .ant-advanced-search-form .ant-form-item-control-wrapper {
        flex: 1;
    }

    #components-form-search .ant-form {
        max-width: none;
    }
    #components-form-search .search-result-list {
        margin-top: 16px;
        border: 1px dashed #e9e9e9;
        border-radius: 6px;
        background-color: #fff;
        min-height: 200px;
        text-align: left;
        padding-top: 20px;
        padding-left:10px;
        padding-right:10px;
        box-shadow: none;
    }
    #components-form-search .search-result-list .el-row {
        margin-bottom: 10px;
    }

    #components-form-search .search-result-list .rightActions {
        text-align:right;
    }
</style>