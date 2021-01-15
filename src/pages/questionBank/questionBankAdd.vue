<template>
    <div>
        <a-card title="新增表">
            <a-form class="ant-advanced-search-form" :form="form">
                <a-form-item
                        label="问题"
                        :label-col="formItemLayout.labelCol"
                        :wrapper-col="formItemLayout.wrapperCol"
                >
                    <a-input
                            v-decorator="['question',{rules:[{required:true,message:'表名不能为空'}]}]"
                            placeholder="请填写"
                    ></a-input>
                </a-form-item>
                <a-form-item
                        label="关键词"
                        :label-col="formItemLayout.labelCol"
                        :wrapper-col="formItemLayout.wrapperCol"
                >
                    <a-input v-decorator="['keyWord']" placeholder="请填写"></a-input>
                </a-form-item>
                <a-form-item
                        label="解答"
                        :label-col="formItemLayout.labelCol"
                        :wrapper-col="formItemLayout.wrapperCol"
                >
                    <a-input v-decorator="['answer']" placeholder="请填写"></a-input>
                </a-form-item>
            </a-form>
        </a-card>

        <!-- 提交按钮 -->
        <buttonGroup>
            <div slot="button">
                <el-button size="medium" @click="back">保存</el-button>
                <el-button size="medium" @click="back">返回</el-button>
            </div>
        </buttonGroup>
    </div>
</template>


<script>
    import {createTable} from "api/tableManger";
    import buttonGroup from "components/buttonGroup/buttonGroup";
    import swal from 'sweetalert';

    export default {
        name: "tableList",
        data() {
            return {
                form: this.$form.createForm(this),
                tableInfoList: [],
                selectedRows: [],
                formItemLayout: {
                    labelCol: {span: 4},
                    wrapperCol: {span: 8},
                },
                formTailLayout: {
                    labelCol: {span: 4},
                    wrapperCol: {span: 8, offset: 4},
                },
            }
        },
        components: {
            buttonGroup
        },
        mounted() {
        },
        methods: {
            submitOrder() {
                this.form.validateFields((error, values) => {
                    if (!error) {
                        if (this.tableInfoList.length === 0) {
                            this.$message.info("表字段不能为空");
                            return;
                        }
                        if (this.tableInfoList.some(it => it.editable)) {
                            this.$message.info("请先保存所有表字段信息");
                            return;
                        }
                        let params = [];
                        this.tableInfoList.forEach(it => {
                            params.push({
                                tableName: values.tableName,
                                tableComment: values.tableComment,
                                columnName: it.columnName,
                                type: it.type,
                                isNull: it.isNull,
                                defaultValue: it.defaultValue,
                                comment: it.comment,
                            });
                        });
                        createTable(params).then(data => {
                            // this.$alert(data[0], '表结构', {
                            //     confirmButtonText: '确定',
                            //     center: true
                            // });
                            swal({
                                title: '表结构',
                                text: data[0],
                                button: false,
                            })
                            // this.back();
                        }).catch(e => {
                            this.$message.error(`创建表单失败，原因：${e}`);
                        });
                    }
                });
            },
            insertRow() {
                // 批量添加
                const newRow = {
                    editable: true,
                    type: 'VARCHAR',
                    isNull: 'FALSE',
                    uid: this.tableInfoList.length + 1,
                };
                this.tableInfoList.push(newRow)
            },
            batchDetete() {
                if (!this.selectedRows.length) {
                    this.$message.info("请至少勾选一条数据");
                    return;
                }
                this.selectedRows.forEach(row => {
                    const index = this.tableInfoList.findIndex(
                        it => it.uid === row.uid
                    );
                    if (index !== -1) {
                        this.tableInfoList.splice(index, 1);
                    }
                });
            },
            back() {
                this.$router.go(-1);
            },
            confirm(row) {
                if (!row.columnName) {
                    this.$message.info("请先填写字段名");
                    return;
                }
                if (!row.type) {
                    this.$message.info("请先选择字段属性");
                    return;
                }
                row.editable = false;
            },
            cancel(row, index) {
                this.tableInfoList.splice(index, 1);
            },
            edit(row) {
                if (
                    !this.tableInfoList.find(
                        item => item.uid === row.uid
                    )
                ) {
                    this.tableInfoList.push(row);
                }
                row.editable = true;
            },
            handleSelectionChange(row) {
                this.selectedRows = row;
            },

        }
    }
</script>

<style scoped>

</style>