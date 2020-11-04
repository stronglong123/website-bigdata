<template>
    <div>
        <a-form
                class="ant-advanced-search-form"
                :form="form">
            <template v-for="(item, index) in formItems">
                <a-form-item :key="index" v-if="!item.remoteValidate" :label="item.label" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" :extra="formType === 'detail'? null : item.helpText">
                    <template v-if="formType==='detail'">
                        {{item.formatter ? item.formatter.call(item, data[item.name]) : data[item.name]}}
                    </template>
                    <template v-else>
                        <a-input
                                v-decorator="[`${item.name}`,{rules:item.rules}]"
                                :placeholder="item.placeholder"
                                v-if="item.type === 'text'"
                                @change="(e) => handleTextChange(item,e)"
                        >
                        </a-input>
                        <a-input-number
                                v-decorator="[`${item.name}`,{rules:item.rules}]"
                                :placeholder="item.placeholder"
                                v-if="item.type === 'number'" >
                        </a-input-number>
                        <!-- 渲染日期范围选择 -->
                        <a-range-picker
                                allowClear
                                :placeholder="[`${item.label}起`,`${item.label}止`]"
                                v-decorator="[`${item.name}`,{rules:[{type:'array'}],initialValue:item.defaultValue}]"
                                showTime
                                :getCalendarContainer="bindParentNode"
                                :ranges="{'今天':[moment().startOf('day'),moment().endOf('day')],'本月':[moment().startOf('month'),moment().endOf('day')],'一个月内':[moment().subtract(30, 'day'),moment().endOf('day')],'三个月内':[moment().subtract(90, 'day'),moment().endOf('day')]}"
                                v-if="item.type === 'date'"
                                style="width:100%;"
                        >
                        </a-range-picker>


                        <a-date-picker
                                allowClear
                                :placeholder="item.placeholder"
                                v-decorator="[`${item.name}`,{rules:item.rules}]"
                                showTime
                                :getCalendarContainer="bindParentNode"
                                v-if="item.type === 'singleDate'"
                                style="width:100%;"
                        >
                        </a-date-picker>

                        <!-- 渲染带远程搜索功能的下拉框 -->
                        <a-select
                                showSearch
                                allowClear
                                :placeholder="item.label"
                                :defaultActiveFirstOption="false"
                                :showArrow="true"
                                :filterOption="false"
                                v-decorator="[`${item.name}`,{rules:item.rules,initialValue:item.defaultValue === undefined ? '' : item.defaultValue}]"
                                v-if="item.type === 'remoteSelect'"
                                :disabled='item.disabled'
                                :getPopupContainer="bindParentNode"
                                @search="(value) =>remoteSearchOptions(item, value)"
                                @dropdownVisibleChange="(open) => open && remoteSearchOptions(item,'')"
                                @select="(value,option)=>value && handleSelect(item,value)"
                                :options="item.options || []"
                                style="width:100%;"
                        >
                        </a-select>

                        <a-select
                                :showSearch = '!!item.dataSource'
                                allowClear
                                :placeholder="item.dataSource ? '选择或输入关键字' : '请选择'"
                                :defaultActiveFirstOption="false"
                                :showArrow="true"
                                :filterOption="false"
                                v-decorator="[`${item.name}`,{rules:item.rules,initialValue:item.defaultValue === undefined ? '' : item.defaultValue}]"
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
                             :label-col="{ span: 5 }"
                             :wrapper-col="{ span: 16 }"
                             :extra="formType === 'detail'? null : item.helpText"
                             :hasFeedback="item.feedback|| false"
                             :validateStatus = "item.validateStatus || ''"
                             :key="index">
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
            </template>
            <a-form-item :wrapper-col="{ span: 12, offset: 8 }">
                <el-button v-if="formType==='detail'" @click="editForm">编辑</el-button>
                <el-button v-else type="primary" @click="submitForm">提交</el-button>
                <el-button @click="closeForm">取消</el-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: "simple-form",
        data() {
            return {
                form:this.$form.createForm(this),
                formItems:[],
                data:{},
                moment,
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
            }
        },
        created() {
            this.formItems = this.formSchema;
            this.data = this.formData || {};
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
                this.data = val || {};
                this.initFormValue();
            },
            formType(val, oVal) {
                if (oVal === 'detail' && val === 'create') {
                    this.initFormValue();
                }
            }
        },
        methods:{
            bindParentNode(parentNode){
                return parentNode.parentNode || document.body;
            },
            handleSelect(item, value) {
                if (item.select) {
                    const {cityId, userId, orgId, warehouseId} = this.getUserContext()
                    item.select(value, {cityId, userId, orgId, warehouseId})
                }

            },
            remoteSearchOptions(item, value) {
                let parentValue = null
                if (item.parentItem) {
                    parentValue = this.form.getFieldValue(item.parentItem)
                    if (parentValue === undefined || parentValue === null || parentValue === '') {
                        this.$set(item, 'options', [])
                        this.$message.info(`请先输入${item.label}`)
                        return
                    }
                }
                if (item.dataSource) {
                    const {cityId, userId, orgId, warehouseId,serviceId,orgType,orgName} = this.getUserContext()
                    item.dataSource(value, {cityId, userId, orgId, warehouseId,serviceId,orgType,orgName},parentValue).then(data => {
                        this.$set(item, 'options', data)
                    }).catch(e => {
                        this.$message.error(e)
                    })
                }
            },
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
            handleTextChange(item,e) {
                if (item.refField) {
                    const value = e.target.value
                    const targetValue = item.refFn ? item.refFn(value) : value
                    const fieldValueObj = {}
                    fieldValueObj[item.refField] = targetValue
                    this.form.setFieldsValue(fieldValueObj)
                }
            },
        }
    }
</script>

<style scoped>

</style>