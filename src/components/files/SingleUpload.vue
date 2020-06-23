<template>
    <div class="clearfix">
        <input type="hidden" v-model="imgUrl" />
        <a-upload
            :action="action"
            listType="picture-card"
            :fileList="fileList"
            :disabled='disabled'
            @preview="handlePreview"
            @change="handleChange"
            :remove="handleRemove"
            :beforeUpload="customUpload"
        >
            <div v-if="fileList.length < size && mode !== 'view'">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
            </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="图片预览" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script>
import axios from "axios";
import httpUtil from "@/common/httpUtil";
import { compress } from "@/common/utils/compress";
import * as upLoadService from "@/common/utils/uploadFile";
export default {
    name: "single-upload",
    data() {
        return {
            imgUrl: "",
            previewVisible: false,
            previewImage: "",
            fileList: [],
            urls: [],
            uploadFiles: [],
            slice: null
        };
    },
    props: {
        value: {
            // type:[Array,String],
            default: () => []
        },
        type: {
            type: String,
            default: "multiple"
        },
        action: {
            type: String,
            required: true
        },
        removeAction: {
            type: String
        },
        extra: {
            type: Array,
            default: () => []
        },
        files: {
            type: Array,
            default: () => []
        },
        mode: {
            type: String,
            default: ""
        },
        disabled:{
            type:Boolean,
            default:false
        },
        isSameWH:{
            type:Boolean,
            default:false
        }
    },
    created() {
        const uploadInstance = axios.create({
            baseURL: "",
            headers: {
                "Content-Type": "multipart/form-data",
                token: this.$store.state.user.token
            },
            withCredentials: true
        });
        this.uploader = uploadInstance;
    },
    computed: {
        size() {
            return this.type === "multiple" ? 5 : 1;
        }
    },
    mounted() {
        this.initFiles(this.value);
    },
    watch: {
        value(val) {
            this.initFiles(val);
        },
        files(files = []) {
            this.uploadFiles = files;
        }
    },
    methods: {
        initFiles(value) {
            if (this.type === "multiple") {
                if(value && value.length){
                    this.urls = value.map(v => v.cloudSrc);
                    this.uploadFiles = value;
                    this.fileList = value.map(v => {
                        return {
                            status: "done",
                            url: v.cloudSrc,
                            uid: v.id
                        };
                    });
                }
            } else {
                if (value) {
                    this.imgUrl = value;
                    this.uploadFiles = [value];
                    this.fileList = [{ status: "done", url: value, uid: "-1" }];
                } else {
                    this.uploadFiles = [];
                    this.fileList = [];
                }
            }
        },
        handleCancel() {
            this.previewVisible = false;
        },
        handleRemove(file) {
            if (this.mode === "view") {
                return false;
            } else if (!this.removeAction) {
                return true;
            } else {
                return new Promise((resolve, reject) => {
                    const { uid, url } = file;
                    httpUtil
                        .fetchPost(this.removeAction, {
                            id: uid,
                            cloudSrc: url
                        })
                        .then(data => {
                            resolve(true);
                            this.$emit('remove',uid)
                        })
                        .catch(err => {
                            this.$message.error(`删除图片失败，原因:${err}`);
                            reject(err);
                        });
                });
            }
        },
        handlePreview(file) {
            this.previewImage = file.url || file.thumbUrl;
            this.previewVisible = true;
        },
        customUpload(file, fileList) {
            // console.log(file);
            // console.log(fileList);
            // var that = this;
            // that.slice = File.prototype.slice;

            // compress(file, function(newFile) {
            //     newFile.name = file.name;
            //     newFile.lastModified = file.lastModified;
            //     var fileReader = new FileReader();
            //     var spark = new SparkMD5.ArrayBuffer();
            //     that.sliceSize = newFile.size;
            //     var currentChunk = 0;

            //     // 每块文件读取完毕之后的处理
            //     fileReader.onload = function(e) {
            //         // 每块交由sparkMD5进行计算
            //         spark.append(e.target.result);
            //         that.contentMd5 = spark.end();
            //         that._upLoadImg(that.contentMd5, newFile);
            //     };

            //     // 处理单片文件的上传
            //     function loadNext() {
            //         var start = currentChunk * that.sliceSize;
            //         var end =
            //             start + that.sliceSize >= newFile.size
            //                 ? newFile.size
            //                 : start + that.sliceSize;

            //         fileReader.readAsArrayBuffer(
            //             that.slice.call(newFile, start, end)
            //         );
            //     }
            //     loadNext();
            // });
            // return true;

            
            var imgText = file.name.substring(file.name.lastIndexOf(".") + 1);
            const imgFiles = ["jpg", "png"];
            const isLt2M = file.size / 1024 / 1024 < 10;
            if (imgFiles.findIndex(it => it === imgText) === -1) {
                this.$message({
                    message: "上传文件只能是 jpg、png格式!",
                    type: "warning"
                });
                fileList.splice(-1);
                return false;
            }
            if (!isLt2M) {
                this.$message({
                    message: "上传文件大小不能超过10M!",
                    type: "warning"
                });
                fileList.splice(-1);
                return false;
            }

            let img_url = window.URL.createObjectURL(file);
            let img = new Image();
            img.src = img_url
            img.onload = e=>{
                let width = img.width
                let height = img.height
                if(this.isSameWH){
                    if(width!==height){
                        this.$message({
                            message: "图片上传的尺寸不符，请上传宽高相等的图片",
                            type: "warning"
                        });
                        fileList.splice(-1);
                        this.fileList = []
                        return false
                    }
                }
                const formData = new FormData(); // 创建form对象
                formData.append("file", file, file.name);
                if (this.extra) {
                    this.extra.forEach(data => {
                        formData.append(data.key, data.value);
                    });
                }
                this.uploader &&
                    this.uploader
                        .post(this.action, formData)
                        .then(response => {
                            // this.uploader.post(this.action,formData).then(response =>{
                            const responseData = response.data;
                            if (responseData.code === 200 || responseData.success) {
                                const { data } = responseData;
                                this.uploadFiles.push(data[0]);
                                const uploadedFile = this.fileList.find(
                                    file => file.name === data[0].fileName
                                );
                                uploadedFile.uid = data[0].id;
                                uploadedFile.url = data[0].cloudSrc;
                                this.$emit("complete", data[0]);
                            } else {
                                this.$message({
                                    type: "error",
                                    message: `上传失败，原因:${responseData.message}`
                                });
                            }
                        })
                        .catch(err => {
                            this.$message({
                                type: "error",
                                message: `上传失败，原因:${err}`
                            });
                        });
            }


            // const formData = new FormData(); // 创建form对象
            // formData.append("file", file, file.name);
            // if (this.extra) {
            //     this.extra.forEach(data => {
            //         formData.append(data.key, data.value);
            //     });
            // }
            // this.uploader &&
            //     this.uploader
            //         .post(this.action, formData)
            //         .then(response => {
            //             // this.uploader.post(this.action,formData).then(response =>{
            //             const responseData = response.data;
            //             if (responseData.code === 200 || responseData.success) {
            //                 const { data } = responseData;
            //                 this.uploadFiles.push(data[0]);
            //                 const uploadedFile = this.fileList.find(
            //                     file => file.name === data[0].fileName
            //                 );
            //                 uploadedFile.uid = data[0].id;
            //                 uploadedFile.url = data[0].cloudSrc;
            //                 this.$emit("complete", data[0]);
            //             } else {
            //                 this.$message({
            //                     type: "error",
            //                     message: `上传失败，原因:${responseData.message}`
            //                 });
            //             }
            //         })
            //         .catch(err => {
            //             this.$message({
            //                 type: "error",
            //                 message: `上传失败，原因:${err}`
            //             });
            //         });
            // return true;
        },
        //上传文件
        // _upLoadImg(md5File, file) {
        //     console.log(md5File)
        //     console.log(file)
        //     let name = md5File + "." + file.name.split(".")[1];
        //     let params = {
        //         contentMd5: md5File,
        //         contentType: file.type,
        //         key: name,
        //         date: "",
        //         putPolicy: "",
        //         method: "PUT",
        //         fileType: 0,
        //         category:1,
        //         originalFilename:file.name
        //     };
        //     console.log(params)
        //     upLoadService
        //         .getAuthorization(params)
        //         .then(
        //             res => {
        //                 console.log(res)
        //                 console.log(JSON.parse(JSON.stringify(res)))
        //                 if (res) {
        //                     // res.data = JSON.parse(JSON.stringify(res));
        //                     // res.data = JSON.parse(JSON.stringify(res.headers));
        //                     res = JSON.parse(JSON.stringify(res));
        //                     res.contentMd5 = md5File;
        //                     res.file = file;
        //                     console.log(res)
        //                     upLoadService.upLoadImg(
        //                         res,
        //                         this._uploadSuccess
        //                     );
        //                 }
        //             },
        //             err => {
        //                 console.log(err);
        //             }
        //         )
        //         .catch(err => {
        //             console.log(err);
        //         });
        // },
        // _uploadSuccess(url) {
        //     console.log(url)
        //     // this.imgUrls.push(url);
        //     //图片信息
        //     // console.log(this.imgUrls, this.currentNum);
        //     // if (this.imgUrls.length == this.currentNum) {
        //     //     //发送图片地址
        //     //     bus.$emit("uploadImgUrls", this.imgUrls);
        //     // }
        // },
        handleChange({ file, fileList }) {
            this.fileList = fileList;
            if (file.status === "done") {
                this.imgUrl = file.response.url;
                this.urls.push(file.response.url);
                if (this.type === "multiple") {
                    this.$emit("change", this.urls);
                } else {
                    this.$emit("change", this.imgUrl);
                }
            } else if (file.status === "removed") {
                this.imgUrl = "";
                const index = this.uploadFiles.findIndex(
                    item =>
                        item.fileName === file.name ||
                        item.cloudSrc === file.url
                );
                if (index !== -1) {
                    this.uploadFiles.splice(index, 1);
                }
                if (this.type === "multiple") {
                    this.$emit("change", this.uploadFiles);
                } else {
                    this.$emit("change", this.imgUrl);
                }
            }
        }
    }
};
</script>

<style scoped>
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
</style>