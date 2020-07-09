<template>
  <div>
    <common-list :schema="schema" :tableData="datas" :total="total" :pageName="pageName" @search="doSearch" @rowAction="doAction">
      <template v-slot:leftActions="slotProps">
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="addOwnerList">添加</el-button>
        <file-uploader  text="批量导入" :action="uploadAction" @complete="uploadFile"></file-uploader>
      </template>
      <template v-slot:rightActions="slotProps">
        <el-link  type="primary" icon="el-icon-download" href="/supplyChain/templates/downloadOwner">下载导入模板</el-link>
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
              @edit="editForm"
      ></simple-form>
    </a-modal>
  </div>
</template>

<script>
  import commonList from 'components/list/commonList'
  import simpleForm from 'components/forms/simpleForm'
  import schema from './listSchema'
  import Bus from 'components/eventBus/eventBus'
  import formSchema from './formSchema'
  // import {listOwners,addOwner,getOwnerById,checkOwnerCode,changeStatus} from 'api/ownerApi'
  const uploadOwners = '/supplyChain/productOwner/upload'
  export default {
    name: "owner-list",
    data() {
      return {
        schema:schema,
        formSchema,
        datas:[],
        total:0,
        visible:false,
        title:'添加货主',
        formType:'create',
        formData:{},
        uploadAction:uploadOwners,
        pageName: 'owner-list',
      }
    },
    components:{
      commonList,
      simpleForm
    },
    mounted() {
      this.initUploadAction();
      this.doSearch({pageNum:1,pageSize:20});
    },
    methods: {
      initUploadAction(){
        const {cityId} = this.getUserContext();
        this.uploadAction = this.uploadAction+"?cityId="+cityId;
      },
      doSearch(params) {
        const {cityId} = this.getUserContext();
        params.cityId = cityId;
        // listOwners(params).then(data => {
        //   let dataList = data.dataList;
        //   const pager = data.pager;
        //   if (dataList && dataList.length) {
        //     this.datas = dataList;
        //     this.total = pager.recordCount;
        //   }else{
        //     this.datas = [];
        //     this.total=0;
        //   }
        //
        // }).catch((error) => {
        //   this.$message.warning(error);
        // });
      },
      doAction(params) {
        const type = params.type;
        const data = params.data;
        if (type === 'detail') {
          this.title='货主详情';
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
        // changeStatus(params).then(data => {
        //   this.$message(`${msg}成功`);
        // }).catch(e => {
        //           _data.state = Number(!_data.state);
        //           this.$message(`${msg}不成功，原因:${e}`)
        //         }
        // )
      },
      addOwnerList(){
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
        let _this =this;
        this.visible = false;
        // if (!values.id) {
        //   values.state = 1;
        //   addOwner(values).then(data => {
        //     values= data;
        //     values.index = this.datas.length + 1;
        //     _this.datas.unshift(values);
        //     _this.$message("添加成功")
        //   }).catch((error) => {
        //     _this.$message.warning(error);
        //   });
        // } else {
        //   addOwner(values).then(data => {
        //     const index = _this.datas.findIndex(d => d.id === data.id)
        //     if (index !== -1) {
        //       _this.datas.splice(index,1,values)
        //     }
        //     _this.$message("修改成功")
        //   }).catch((error) => {
        //     _this.$message.warning(error);
        //   });
        // }
      },
      uploadFile(){
        Bus.$emit('triggerSearch', this.pageName);
      }
    }
  }
</script>

<style scoped>

</style>