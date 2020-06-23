<template>
    <div class="reader">
        <a-upload name="file" :multiple="false" action="" :accept="acceptTypes"  @change="handleChange" :beforeUpload="customUpload" :showUploadList="false">
            <el-button icon="el-icon-upload2"  size="medium">{{uploadText}}</el-button>
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
    import XLSX from 'xlsx'

    export default {
        name: "file-reader",
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
        },
        created() {
            this.uploadText = this.text || this.uploadText;
        },
        watch: {
            text(val) {
                this.uploadText = val;
            },
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
                const fileReader = new FileReader();
                fileReader.onload = (ev) => {
                    try {
                        const data = ev.target.result;
                        const workbook = XLSX.read(data, {
                            type: 'binary'
                        });
                        const jsonResult = []
                        for (let sheet in workbook.Sheets) {
                            jsonResult.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                        }
                        this.$emit('upload-complete', jsonResult)
                    } catch (e) {
                        this.$message.warning('文件类型不正确！');
                        return false;
                    }
                }
                fileReader.readAsBinaryString(file);
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
    .reader {
        display: inline-flex;
        margin:0 10px;
    }
</style>