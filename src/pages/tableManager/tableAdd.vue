<template>
    <div>
        <a-card title="新增表">
            <a-form class="ant-advanced-search-form" :form="form">
                <a-row type="flex" :gutter="10">
                    <a-col :span="6">
                        <a-form-item
                                label="表名"
                                :label-col="{ span: 8 }"
                                :wrapper-col="{ span: 16 }"
                        >
                            <a-input
                                    v-decorator="['tableName',{rules:[{required:true,message:'表名不能为空'}]}]"
                                    placeholder="请填写"
                            ></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :span="6">
                        <a-form-item
                                label="表描述"
                                :label-col="{ span: 8 }"
                                :wrapper-col="{ span: 16 }"
                        >
                            <a-input v-decorator="['tableComment']" placeholder="请填写"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-card>

        <!-- SKU明细 -->
        <a-card title="字段信息">
            <el-row :gutter="10" style="margin-bottom:10px;">
                <el-col :span="14">
                    <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="medium"
                            @click="insertRow"
                    >添加
                    </el-button>
                    <el-button size="medium" @click="batchDetete">批量删除</el-button>
                </el-col>
            </el-row>
            <el-table
                    :data="tableInfoList"
                    @selection-change="handleSelectionChange"
                    fit
                    size="medium"
                    height="300"
                    style="width:100%"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column property="columnName" label="字段名" width="170">
                    <template slot-scope="prop">
                        <a-input
                                size="small"
                                v-model="prop.row.columnName"
                                v-if="prop.row.editable"
                                style="width: 100%"
                        >
                        </a-input>
                        <template v-if="prop.row.columnName && !prop.row.editable">
                            <div>{{prop.row.columnName}}</div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column property="type" label="字段属性" width="170">
                    <template slot-scope="prop">
                        <a-select
                                v-if="prop.row.editable"
                                size="small"
                                allowClear
                                placeholder="请选择"
                                :defaultActiveFirstOption="false"
                                :showArrow="true"
                                :filterOption="false"
                                v-model="prop.row.type"
                                :options="typeOptions"
                                style="width:100%;"
                        />
                        <template v-if="prop.row.type && !prop.row.editable">
                            <div>{{prop.row.type}}</div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column property="isNull" label="是否非空" width="170">
                    <template slot-scope="prop">
                        <a-select
                                v-if="prop.row.editable"
                                v-model="prop.row.isNull"
                                size="small"
                                allowClear
                                placeholder="请选择"
                                :defaultActiveFirstOption="false"
                                :showArrow="true"
                                :filterOption="false"
                                :options="nullOptions"
                                style="width:100%;"
                        />
                        <template v-if="prop.row.isNull && !prop.row.editable">
                            <div>{{prop.row.isNull}}</div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column property="defaultValue" label="默认值" width="170">
                    <template slot-scope="prop">
                        <a-input
                                size="small"
                                v-model="prop.row.defaultValue"
                                v-if="prop.row.editable"
                                style="width: 100%"
                        >
                        </a-input>
                        <template v-if="prop.row.defaultValue && !prop.row.editable">
                            <div>{{prop.row.defaultValue}}</div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column property="comment" label="描述" width="170">
                    <template slot-scope="prop">
                        <a-input
                                size="small"
                                v-model="prop.row.comment"
                                v-if="prop.row.editable"
                                style="width: 100%"
                        >
                        </a-input>
                        <template v-if="prop.row.comment && !prop.row.editable">
                            <div>{{prop.row.comment}}</div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="prop">
                        <template v-if="prop.row.editable">
                            <el-button type="text" size="small" @click="confirm(prop.row)">保存</el-button>
                            <el-button type="text" size="small" @click="cancel(prop.row,prop.$index)">取消
                            </el-button>
                        </template>
                        <template v-else>
                            <el-button type="text" size="small" @click="edit(prop.row)">编辑</el-button>
                            <a-popconfirm
                                    title="确认删除?"
                                    @confirm="() => cancel(prop.row,prop.$index)"
                            >
                                <el-button type="text" size="small">删除</el-button>
                            </a-popconfirm>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </a-card>

        <!-- 提交按钮 -->
        <buttonGroup>
            <div slot="button">
                <el-button size="medium" type="primary" @click="submitOrder">提交</el-button>
                <el-button size="medium" @click="back">保存</el-button>
                <el-button size="medium" @click="back">返回</el-button>
            </div>
        </buttonGroup>
    </div>
</template>


<script>
    import {createTable} from "api/tableManger";
    import buttonGroup from "components/buttonGroup/buttonGroup";

    export default {
        name: "tableList",
        data() {
            return {
                form: this.$form.createForm(this),
                tableInfoList: [],
                selectedRows: [],
                typeOptions: [{value: 'VARCHAR', label: '字符串'},
                    {value: 'BOOLEAN', label: '布尔'},
                    {value: 'TINYINT', label: '短数值'},
                    {value: 'INTEGER', label: '数值'},
                    {value: 'BIGINT', label: '序列'},
                    {value: 'DATE', label: '时间日期'},
                ],
                nullOptions: [{value: 'TRUE', label: '是'}, {value: 'FALSE', label: '否'}],
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
                            this.$alert(data[0], '表结构', {
                                confirmButtonText: '确定',
                                center: true
                            });
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