<template>
    <div class="copy-body" v-if="text">
        {{text}}
        <!-- <el-tooltip effect="dark" content="点击复制" placement="right-start"> -->
            <i class="el-icon-document copy-icon" @click="copy"></i>
        <!-- </el-tooltip> -->
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String
        }
    },
    methods: {
        copy() {
            let oInput = document.createElement("input");
            oInput.value = this.text;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象;
            this.$message.success("复制成功");
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.remove();
        }
    }
};
</script>

<style lang="less" scoped>
.copy-body {
    display: inline;
}
.copy-icon {
    color: #409eff;
    margin-left: 10px;
    cursor: pointer;
}
</style>