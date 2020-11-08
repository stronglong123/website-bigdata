<template>
    <div>
        <common-list :schema="schema" :tableData="datas" :total="total" :pageName="pageName" @search="doSearch" @rowAction="doAction">
            <template v-slot:leftActions="slotProps">
                <el-button type="primary" size="medium" icon="el-icon-plus" @click="create">新建</el-button>
                <file-uploader  text="批量导入" :action="uploadAction" @complete="uploadFile"></file-uploader>
            </template>
            <template v-slot:rightActions="slotProps">
                <el-link  type="primary" icon="el-icon-download" href="/supplyChain/templates/downloadOwner">下载导入模板</el-link>
            </template>
        </common-list>
    </div>
</template>

<script>
    import commonList from 'components/list/commonList'
    import schema from './listSchema'
    import Bus from 'components/eventBus/eventBus'
    import formSchema from './formSchema'
    const uploadTables = '/aipservice/import/importTable'
    window._CONFIG = {};
    window._CONFIG['domianURL'] = 'http://localhost:8199';
    window._CONFIG['imgDomainURL'] = 'http://localhost:8080/jeecg-boot/sys/common/view';
    export default {
        name: "tableList",
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
                pageName: 'table-list',
            }
        },
        components:{
            commonList,
        },
        mounted() {
            this.doSearch({pageNum:1,pageSize:20});
            //初始化websocket
            this.initWebSocket()
        },
        methods: {
            initWebSocket: function () {
                // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
                // var userId = store.getters.userInfo.id;
                const userId = 1111;
                var url = window._CONFIG['domianURL'].replace("https://","ws://").replace("http://","ws://")+"/websocket/"+userId;
                this.websock = new WebSocket(url);
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen: function () {
                console.log("WebSocket连接成功");
            },
            websocketonerror: function (e) {
                console.log("WebSocket连接发生错误");
            },
            websocketonmessage: function (e) {
                console.log(e)
                var data = eval("(" + e.data + ")");
                console.log(data)
                //处理订阅信息
                if(data.cmd == "topic"){
                    //TODO 系统通知

                }else if(data.cmd == "user"){
                    //TODO 用户消息

                }
            },
            websocketclose: function (e) {
                console.log("connection closed (" + e.code + ")");
            },


            create() {
                this.$router.push({name:'tableAdd'})
            },
            doSearch(params) {
            },
            doAction(params) {
                const type = params.type;
                const data = params.data;
                if (type === 'detail') {
                    this.title = '货主详情';
                    this.formType = 'detail';
                    this.openForm();
                    this.formData = data;
                } else {
                    this.updateStatus(data)
                }
            },
            updateStatus(row) {
                const _data = this.datas.find(record => record.id === row.id);
                _data.state = Number(!_data.state);
                const msg = _data.state === 0 ? '停用' : '启用'
                let params = {params: {"id": _data.id, "state": _data.state}}
            },
            addOwnerList() {
                this.formType = 'create';
                this.openForm()
            },
            openForm() {
                this.formData = {};
                this.formSchema.forEach(item => {
                    if (item.feedback) {
                        item.feedback = false;
                    }
                })
                this.visible = true;
            },
            editForm() {
                this.formType = 'create'
            },
            handleClose() {
                this.visible = false;
            },
            handleSubmit(values) {
                const {cityId} = this.getUserContext();
                values.cityId = cityId;
                let _this = this;
                this.visible = false;
            },
            uploadFile() {
                Bus.$emit('triggerSearch', this.pageName);
            }
        }
    }
</script>

<style scoped>

</style>