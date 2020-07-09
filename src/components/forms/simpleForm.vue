<template>
    <div>
        <a-form
                class="ant-advanced-search-form"
                :form="form">
            <template v-for="(item, index) in formItems">
                <a-form-item v-if="!item.remoteValidate" :label="item.label" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" :extra="formType === 'detail'? null : item.helpText">
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
                        <!-- 渲染带远程搜索功能的下拉框 -->
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
    export default {
        name: "simple-form",
        data() {
            return {
                form:this.$form.createForm(this),
                formItems:[],
                data:{}
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