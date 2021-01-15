<template>
    <div>
        <common-list :schema="schema" :tableData="datas" :total="total" :pageName="pageName" @search="doSearch"
                     @rowAction="doAction">
            <template v-slot:leftActions="slotProps">
                <el-button type="primary" size="medium" icon="el-icon-plus" @click="create">新建</el-button>
                <!--                <file-uploader  text="批量导入" :action="uploadAction" @complete="uploadFile"></file-uploader>-->
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
    import commonList from 'components/list/commonList'
    import schema from './listSchema'
    import Bus from 'components/eventBus/eventBus'
    import formSchema from './formSchema'
    const uploadTables = '/aipservice/import/importTable'
    import {pageList,insert,update} from 'api/dictionaryApi'
    import simpleForm from 'components/forms/simpleForm'
    import moment from "moment";


    export default {
        name: "dictionaryList",
        data() {
            return {
                schema:schema,
                formSchema,
                datas:[],
                total:0,
                visible:false,
                title:'添加表',
                formType:'create',
                formData:{},
                uploadAction:uploadTables,
                pageName: 'dictionary-list',
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
                }
            },
            handleClose() {
                this.visible = false;
            },
            handleSubmit(data) {
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
            },

            updateData(params){
                update(params).then(data => {
                    this.$message(`操作成功`);
                }).catch(e => {
                        this.$message(`操作不成功，原因:${e}`)
                    }
                )
            },

            uploadFile() {
                Bus.$emit('triggerSearch', this.pageName);
            }
        }
    }
</script>

<style scoped>

</style>