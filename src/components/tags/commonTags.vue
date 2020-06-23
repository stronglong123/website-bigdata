<template>
    <div style="width:340px">
        <template v-for="(tag, index) in tags">
            <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                <a-tag :key="tag" closable @close="() => handleClose(tag)" color="cyan">
                    {{ `${tag.slice(0, 20)}...` }}
                </a-tag>
            </a-tooltip>
            <a-tag v-else :key="tag" closable @close="() => handleClose(tag)"  color="cyan">
                {{ tag }}
            </a-tag>
        </template>
        <a-input
            v-if="inputVisible"
            ref="input"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            :value="inputValue"
            @change="handleInputChange"
            @blur="handleInputConfirm"
            @keyup.enter="handleInputConfirm"
        />
        <a-tag v-else @click="showInput" style="background: #fff; borderStyle: dashed;">
            <a-icon type="plus" /> 添加
        </a-tag>
    </div>
</template>

<script>
    export default {
        name: "commonTags",
        data() {
            return {
                inputVisible: false,
                inputValue: '',
            };
        },
        props: {
            tags: {
                type: Array,
                default:() => []
            }
        },
        methods: {
            handleClose(removedTag) {
                const tags = this.tags.filter(tag => tag !== removedTag);
                this.tags = tags;
                this.$emit('setTags', tags);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(function() {
                    this.$refs.input.focus();
                });
            },

            handleInputChange(e) {
                this.inputValue = e.target.value;
            },

            handleInputConfirm() {
                if(this.tags && this.tags.length>=8){
                    this.$message.warning("标签数量大支持8个");
                    Object.assign(this, {
                        inputVisible: false,
                        inputValue: '',
                    });
                    return;
                }
                const inputValue = this.inputValue;
                let tags = this.tags;
                if (inputValue && tags.indexOf(inputValue) === -1) {
                    tags = [...tags, inputValue];
                }
                Object.assign(this, {
                    tags,
                    inputVisible: false,
                    inputValue: '',
                });
                this.$emit('setTags', tags);
            },
        },
    }
</script>

<style scoped>

</style>