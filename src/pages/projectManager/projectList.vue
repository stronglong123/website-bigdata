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
                searchParams:{},
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
                this.formType ='create';
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
                this.searchParams =params;
            },
            doAction(params) {
                console.info(params);
                const type = params.type;
                let data = params.data;
                if (type == 'edit') {
                    this.formType ='edit';
                    this.visible = true;
                    this.formData = data;
                    return;
                }
                let state;
                if(type=='start'){
                    state = 2
                }else if(type=='complete'){
                    state = 3
                }else if(type=='test'){
                    state = 4
                }else if(type=='release'){
                    state = 5
                }else if(type=='pre'){
                    state = 6
                }else if(type=='product'){
                    state = 7
                }else if(type=='invalid'){
                    state = -1
                }
                this.updateStatus(data,state);
            },
            updateStatus(row, state) {
                if (!state&&state!=0 ) {
                    this.$message(`状态不能为空`);
                    return;
                }
                const _data = this.datas.find(record => record.id === row.id);
                _data.state = Number(state);
                let params = {"id": _data.id, "state": state}
                this.updateData(params);
            },
            updateData(params){
                update(params).then(data => {
                    this.$message(`操作成功`);
                }).catch(e => {
                        this.$message(`操作不成功，原因:${e}`)
                    }
                )
            },

            handleClose(){
                this.visible = false
            },
            handleSubmit(data) {
                data.deadTime = moment(data.deadTime).format('YYYY-MM-DD HH:mm:ss');
                console.info(data);
                if (this.formType == 'create'){
                    this.createData(data);
                }else{
                    this.updateData(data);
                }
                this.visible = false;
                this.doSearch(this.searchParams)
            },
            createData(data){
                insert(data).then(data => {
                    this.$message('操作成功')
                    this.visible = false
                    Bus.$emit('triggerSearch', this.pageName)
                }).catch(err => {
                    this.$message.error(`操作失败，原因:${err}`)
                })
            }
        }
    }
</script>

<style scoped>

</style>