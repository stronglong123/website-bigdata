<template>
    <div class="uploader">
    <a-upload name="file" :multiple="false" action="" :accept="acceptTypes"  @change="handleChange" :beforeUpload="customUpload" :showUploadList="false">
        <el-button icon="el-icon-download" size="medium">{{uploadText}}</el-button>
    </a-upload>
        <a-modal
                :title="title"
                :visible="visible"
                :footer="null"
                @cancel="confirmCancel"
                :afterClose = 'cleanProgress'
                :destroyOnClose="true"
                :maskClosable="false"
                :centered="true"
                width="160px"
        >
            <a-progress type="circle" :percent="percent" :width="80" :status="status"/>
        </a-modal>

    </div>
</template>

<script>
    import axios from 'axios'
    import {mapState} from 'vuex'
    export default {
        name: "file-uploader",
        data() {
            return {
                uploadText:'导入',
                acceptTypes:'.xls,.xlsx',
                uploadUrl:'',
                title:'导入中...',
                visible:false,
                percent:0,
                status:'active',
                uploader : null,
            }
        },
        props:{
            text:{
                type:String
            },
            action:{
                type:String,
                required:true
            },
            extra:{
                type:Array,
                required:false
            }
        },
        created() {
            this.uploadText = this.text || this.uploadText;
            this.uploadUrl = this.action;
            const uploadInstance = axios.create({
                baseURL: '',
                headers:{"Content-Type":"multipart/form-data","token":this.token},
                withCredentials:true
            })
            this.uploader = uploadInstance;
        },
        watch: {
            text(val) {
                this.uploadText = val;
            },
            action(val) {
                this.uploadUrl = val;
            }
        },
        computed: {
            ...mapState('user', [
                'token'
            ])
        },
        methods:{
            handleChange() {

            },
            confirmCancel() {
                if (this.percent === 100 || this.status === 'exception') {
                    this.visible = false;
                } else {
                    this.$confirm('导入还未完成, 是否退出?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(()=>this.visible=false);
                }
            },
            customUpload(file, fileList) {
                const formData = new FormData();// 创建form对象
                formData.append('file',file,file.name);
                if (this.extra) {
                    this.extra.forEach(data => {
                        formData.append(data.key,data.value)
                    })
                }
                this.visible = true;
                const timer = setInterval(() => {
                    if (this.percent < 90 ) this.percent += 10;
                },500)
                this.uploader && this.uploader.post(this.uploadUrl,formData).then(response =>{
                    this.percent = 100;
                    this.title = '导入完成'
                    clearInterval(timer);
                    this.visible = false;
                    const responseData = response.data
                    if (responseData.code === 200 || responseData.success) {
                        const {result} = responseData
                        this.$emit('complete',result)
                    } else {
                        this.$message({type:'error',message:`导入异常，原因:${responseData.msg || responseData.message}`})
                    }
                    fileList.splice(0,1)
                }).catch(err => {
                    this.$message({type:'error',message:`导入异常，原因:${err}`})
                    fileList.splice(0,1)
                    clearInterval(timer);
                    this.title='导入失败'
                    this.status = 'exception'
                })
                return false;
            },
            cleanProgress() {
                this.percent = 0;
                this.status = 'active';
                this.title = '导入中...';
            }
        }
    }
</script>

<style scoped>
    .uploader {
        display: inline-flex;
        margin:0 10px;
    }
</style>