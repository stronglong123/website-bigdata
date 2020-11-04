<template>
    <div>
        <common-list :schema="schema" :tableData="datas" :total="total" :pageName="pageName" @search="doSearch" @rowAction="doAction">
            <template v-slot:leftActions="slotProps">
                <el-button type="primary" size="medium" icon="el-icon-plus" @click="create">新建</el-button>
            </template>
        </common-list>
        <a-modal
                :title="title"
                :visible="visible"
                :footer="null"
                @cancel="visible = false"
                :maskClosable="false"
                :destroyOnClose="true"
        >
            <simple-form
                    :formSchema="formSchema"
                    :formType="formType"
                    :formData="formData"
                    @close="handleClose"
                    @submit="handleSubmit"
            ></simple-form>
        </a-modal>
    </div>
</template>

<script>
    import {pageList,insert,update} from 'api/projectManger'
    import commonList from 'components/list/commonList'
    import schema from './listSchema'
    import Bus from 'components/eventBus/eventBus'
    import formSchema from './formSchema'
    const uploadTables = '/aipservice/import/importTable'
    import simpleForm from 'components/forms/simpleForm'
    import moment from 'moment'

    export default {
        name: "tableList",
        data() {
            return {
                schema:schema,
                formSchema,
                datas:[],
                total:0,
                visible:false,
                title:'添加任务',
                formType:'create',
                formData:{},
                uploadAction:uploadTables,
                pageName: 'table-list',
                moment,
            }
        },
        components:{
            commonList,
            simpleForm,
        },
        mounted() {
            this.doSearch({pageNum:1,pageSize:20});
        },
        methods: {
            create() {
                this.visible =true;
            },
            doSearch(params) {
                pageList(params).then(data => {
                    let dataList = data.dataList;
                    const pager = data.pager;
                    if (dataList && dataList.length) {
                        this.datas = dataList;
                        this.total = pager.recordCount;
                    } else {
                        this.datas = [];
                        this.total = 0;
                    }
                }).catch((error) => {
                    this.$message.error(error);
                });
            },
            doAction(params) {
                const type = params.type;
                const data = params.data;
                // if (type === 'detail') {
                //     this.title = '货主详情';
                //     this.formType = 'detail';
                //     this.openForm();
                //     this.formData = data;
                // } else {
                //     this.updateStatus(data)
                // }
            },
            updateStatus(row) {
                const _data = this.datas.find(record => record.id === row.id);
                _data.state = Number(!_data.state);
                const msg = _data.state === 0 ? '停用' : '启用';
                let params = {params: {"id": _data.id, "state": _data.state}}
                update(params).then(data => {
                  this.$message(`${msg}成功`);
                }).catch(e => {
                          _data.state = Number(!_data.state);
                          this.$message(`${msg}不成功，原因:${e}`)
                        }
                )
            },
            handleClose(){
                this.visible = false
            },
            handleSubmit(data) {
                data.deadTime = moment(data.deadTime).format('YYYY-MM-DD HH:mm:ss');
                console.info(data)
                insert(data).then(data => {
                    this.$message('操作成功')
                    this.visible = false
                    Bus.$emit('triggerSearch', this.pageName)
                }).catch(err => {
                    this.$message.error(`操作失败，原因:${err}`)
                })
                this.visible = false;
            },
        }
    }
</script>

<style scoped>

</style>