<template>
    <div>
        <a-form
                class="ant-advanced-search-form"
                :form="form"
                v-if="!!formItems.length">
            <template v-for="(item, index) in formItems">
                <a-row type="flex" :gutter="10">
                    <a-col :key="index" :span="24/colsPerRow">
                        <a-form-item v-if="!item.remoteValidate" :label="item.label" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" :extra="formType === 'detail'? null : item.helpText">
                            <template v-if="formType==='detail'">
                                {{item.formatter ? item.formatter.call(item, data[item.name]) : data[item.name]}}
                            </template>
                            <template v-else>
                                <a-input
                                        v-decorator="[`${item.name}`,{rules:item.rules}]"
                                        :placeholder="item.placeholder"
                                        v-if="item.type === 'text'" >
                                </a-input>
                                <a-input-number
                                        v-decorator="[`${item.name}`,{rules:item.rules}]"
                                        :placeholder="item.placeholder"
                                        v-if="item.type === 'number'" >
                                </a-input-number>
                                <!-- 渲染带远程搜索功能的下拉框 -->
                                <a-select
                                        :showSearch = '!!item.dataSource'
                                        allowClear
                                        :placeholder="item.dataSource ? '选择或输入关键字' : '请选择'"
                                        :defaultActiveFirstOption="false"
                                        :showArrow="true"
                                        :filterOption="false"
                                        v-decorator="[`${item.name}`,{rules:item.rules}]"
                                        v-if="item.type === 'select'"
                                        @search="(value) =>item.dataSource && item.dataSource.call(item, value)"
                                        @dropdownVisibleChange="(open) => item.dataSource && item.dataSource.call(item)"
                                >
                                    <template v-if="item.options.length">
                                        <a-select-option v-for="d in item.options" :key="d.key">
                                            <a-tooltip>
                                                <template slot='title'>
                                                    {{d.value}}
                                                </template>
                                                {{d.value}}
                                            </a-tooltip>
                                        </a-select-option>
                                    </template>
                                </a-select>
                            </template>

                        </a-form-item>
                        <a-form-item v-else
                                     :label="item.label"
                                     :label-col="{ span: 4 }"
                                     :wrapper-col="{ span: 16 }"
                                     :extra="formType === 'detail'? null : item.helpText"
                                     :hasFeedback="item.feedback|| false"
                                     :validateStatus = "item.validateStatus || ''">
                            <template v-if="formType==='detail'">
                                {{data[item.name]}}
                            </template>
                            <template v-else>
                                <a-input
                                        v-decorator="[`${item.name}`,{rules:[...item.rules, ...[{validator:remoteValidate(item)}]]}]"
                                        :placeholder="item.placeholder"
                                        v-if="item.type === 'text'" >
                                </a-input>
                            </template>
                        </a-form-item>
                    </a-col>
                </a-row>
            </template>
        </a-form>
        <a-tabs type="card" v-if="!!subTables.length">
            <a-tab-pane :tab="tab.title" v-for="(tab, index) in subTables" :key="index">
                <el-row :gutter="10">
                    <el-col :span="16">
                        <slot name="leftActions" ></slot>
                    </el-col>
                    <el-col :span="8" class="rightActions">
                        <slot name="rightActions"></slot>
                    </el-col>
                </el-row>
                <el-table :data="tab.dataList" height="300" fit size="medium" style="width:100%">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column type="selection" v-if="tab.allowSelect"></el-table-column>
                    <template v-for="col in tab.columns">
                        <template v-if="!!col.slotRender">
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
                                <template v-for="(action,index) in tab.rowActions">
                                    <el-button :key="index" v-if="!action.condition" type="text" @click="() => handleTableAction(action.type, scope.row)">{{action.text}}</el-button>
                                    <el-button :key="index" v-else-if="scope.row[action.condition.key] === action.condition.value" type="text" @click="() => handleTableAction(action.type, scope.row)">{{action.text}}</el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
                <el-pagination
                        @size-change="(val) => {setCurrentTab(tab);handleSizeChange(val)}"
                        @current-change="(val) => {setCurrentTab(tab);handleCurrentChange(val)}"
                        :current-page="tab.pager.pageNum"
                        :page-sizes="pageSizesOptions"
                        :page-size="tab.pager.pageSize || 20"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tab.pager.totalCount">
                </el-pagination>
            </a-tab-pane>
        </a-tabs>
        <a-row type="flex" justify="center">
            <a-col :span="24" :style="{textAlign:'center'}">
                    <el-button v-if="formType==='detail'" @click="editForm">编辑</el-button>
                    <el-button v-else type="primary" @click="submitForm">提交</el-button>
                    <el-button @click="closeForm">取消</el-button>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    export default {
        name: "multiple-form",
        data() {
            return {
                form:this.$form.createForm(this),
                formItems:[],
                subTables:[],
                data:{},
                pageSizesOptions:[10,20,50,100],
                currentTab:''
            }
        },
        props:{
            formSchema: {
                type:Array,
                default:() => []
            },
            formData: {
                type:Object,
                default:()=>{}
            },
            formType:{
                type:String,
                default:'create'
            },
            colsPerRow: {
                type:Number,
                default:2
            },
        },
        created() {
            this.formItems = this.formSchema;
            this.data = this.formData;
        },
        mounted() {
            this.initFormValue();
        },
        watch:{
            formSchema(val) {
                this.formItems = val;
                this.data = {}
            },
            formData(val) {
                this.data = val;
                this.initFormValue();
            },
            formType(val, oVal) {
                if (oVal === 'detail' && val === 'create') {
                    this.initFormValue();
                }
            }
        },
        methods:{
            remoteValidate(item) {
                return (function(rule,value,callback) {
                    item.feedback = true;
                    item.validateStatus = 'validating'
                    item.remoteMethod({id:this.data.id,value:value})
                        .then(data => {
                            if (data) {
                                item.validateStatus = 'success'
                                callback();
                            } else {
                                item.validateStatus = 'warning'
                                callback('校验不通过')
                            }
                        })
                        .catch(e => {
                            item.validateStatus = 'error'
                            callback(`校验失败，原因:${e}`)
                        })
                }).bind(this)
            },
            initFormValue() {
                setTimeout(()=> {
                    this.form.setFieldsValue(this.data)
                }, 0)
            },
            setCurrentTab(tab) {
                this.currentTab = tab;
            },
            submitForm() {
                this.form.validateFields((error, values) => {
                    !error && this.$emit('submit', {...this.data,...values});
                })
            },
            editForm() {
                this.$emit('edit')
            },
            closeForm() {
                this.$emit('close')
            },
            handleTableAction(type, row) {
                this.$emit('rowAction', {type:type, data: row})
            },
            handleSizeChange(val) {
                this.currentTab.pager.pageSize = val
                this.$emit('pagination-change', this.currentTab)
            },
            handleCurrentChange(val) {
                this.currentTab.pager.pageNum = val
                this.$emit('pagination-change', this.currentTab)
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
    .rightActions {
        text-align:right;
    }
</style>