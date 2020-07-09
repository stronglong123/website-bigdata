<template>
    <div>
        <a-card title="新增调拨">
            <a-form class="ant-advanced-search-form" :form="form">
                <a-row type="flex" :gutter="10">
                    <a-col :span="6">
                        <a-form-item
                                label="表名"
                                :label-col="{ span: 8 }"
                                :wrapper-col="{ span: 16 }"
                        >
                            <a-input
                                    v-decorator="['tableName',{rules:[{required:true,message:'表名'}]}]"
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
        <a-card title="信息">
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
                    :data="productSkuList"
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
                        <a-input
                                size="small"
                                v-model="prop.row.type"
                                v-if="prop.row.editable"
                                style="width: 100%"
                        >
                        </a-input>
                        <template v-if="prop.row.type && !prop.row.editable">
                            <div>{{prop.row.type}}</div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column property="isNull" label="是否非空" width="170">
                    <template slot-scope="prop">
                        <a-input
                                size="small"
                                v-model="prop.row.isNull"
                                v-if="prop.row.editable"
                                style="width: 100%"
                        >
                        </a-input>
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
                            <el-button type="text" size="small" @click="confirmProductSku(prop.row)">保存</el-button>
                            <el-button type="text" size="small" @click="cancelProductSku(prop.row,prop.$index)">取消</el-button>
                        </template>
                        <template v-else>
                            <el-button type="text" size="small" @click="editProductSku(prop.row)">编辑</el-button>
                            <a-popconfirm
                                    title="确认删除?"
                                    @confirm="() => cancelProductSku(prop.row,prop.$index)"
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

    import buttonGroup from "components/buttonGroup/buttonGroup";

    export default {
        name: "tableList",
        data() {
            return {
                productSkuList: [],
            }
        },
        components: {
            buttonGroup
        },
        mounted() {
        },
        methods: {
            submitOrder() {
                this.back();
            },
            insertRow() {
                // 批量添加
                const newRow = {
                    editable: true,
                    uid: this.productSkuList.length + 1,
                };
                this.productSkuList.push(newRow)
            },
            batchDetete() {
                if (!this.selectedRows.length) {
                    this.$message.info("请至少勾选一条产品信息");
                    return;
                }
                this.selectedRows.forEach(row => {
                    const index = this.productSkuList.findIndex(
                        it => it.productSkuId === row.productSkuId
                    );
                    if (index !== -1) {
                        this.productSkuList.splice(index, 1);
                    }
                });
            },
            back() {
                this.$router.go(-1);
            },
            confirmProductSku(row) {
                row.editable = false;
            },
            cancelProductSku(row, index) {
                this.productSkuList.splice(index, 1);
            },
            editProductSku(row) {
                if (
                    !this.productSkuList.find(
                        item => item.productSkuId === row.productSkuId
                    )
                ) {
                    this.productSkuList.push(row);
                }
                row.editable = true;
            },

        }
    }
</script>

<style scoped>

</style>