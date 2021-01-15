<template>
    <div>
        <a-card title="文本替换">
            <a-form class="ant-advanced-search-form" :form="form">
                <a-row type="flex" :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                                label="源文本"
                                :label-col="{ span: 6 }"
                                :wrapper-col="{ span: 18 }"
                        >
                            <a-textarea v-decorator="['data']" placeholder="请填写"></a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-card>

        <!-- SKU明细 -->
        <a-card title="替换信息">
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

                <el-table-column property="oldParam" label="默认值" width="200">
                    <template slot-scope="prop">
                        <a-input
                                size="small"
                                v-model="prop.row.oldParam"
                                v-if="prop.row.editable"
                                style="width: 100%"
                        >
                        </a-input>
                        <template v-if="prop.row.oldParam && !prop.row.editable">
                            <div>{{prop.row.oldParam}}</div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column property="newParam" label="描述" width="200">
                    <template slot-scope="prop">
                        <a-input
                                size="small"
                                v-model="prop.row.newParam"
                                v-if="prop.row.editable"
                                style="width: 100%"
                        >
                        </a-input>
                        <template v-if="prop.row.newParam && !prop.row.editable">
                            <div>{{prop.row.newParam}}</div>
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
                <el-button size="medium" @click="back">返回</el-button>
            </div>
        </buttonGroup>
    </div>
</template>


<script>
    import {multipleReplace} from "api/utilManager";
    import buttonGroup from "components/buttonGroup/buttonGroup";
    import swal from 'sweetalert';

    export default {
        name: "utilManager",
        data() {
            return {
                form: this.$form.createForm(this),
                tableInfoList: [],
                selectedRows: [],
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
                            this.$message.info("替换信息不能为空");
                            return;
                        }
                        if (this.tableInfoList.some(it => it.editable)) {
                            this.$message.info("请先保存所有表字段信息");
                            return;
                        }
                        values.replaceList =  this.tableInfoList;
                        multipleReplace(values).then(data => {
                            swal({
                                title:'替换后信息',
                                text:data,
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
                if (!row.oldParam) {
                    this.$message.info("请先填写字段名");
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