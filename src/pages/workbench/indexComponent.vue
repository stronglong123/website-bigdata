<template>
    <div class="index-comp-cls" :style="{backgroundColor:bgColor}">
        <template v-for="(block,index) in indexes">
            <div class="index-block" :key="index" @click="() => openPage(block)">
                <a-spin v-if="loading">
                    <a-icon slot="indicator" type="loading" style="font-size: 36px;height:54px;line-height:54px;vertical-align:middle;color:#ffffff;" spin />
                </a-spin>
                <div style="font-size:36px;color:#ffffff;" v-else>
                    {{block.value}}
                </div>
                <div style="font-size:20px;color:#ffffff;overflow: hidden;">
                    {{block.title}}
                </div>
            </div>
            <div class="index-divider" v-if="block.total" :key="index"></div>
        </template>

    </div>
</template>

<script>

    export default {
        name: "index-component",
        data() {
            return {}
        },
        props: {
            indexes: {
                type: Array,
                required: true
            },
            bgColor: {
                type: String,
                default: '#1790FF'
            },
            loading: {
                type: Boolean,
                default: false
            }
        },
        watch:{
            indexes:{
                handler(val) {

                },
                deep:true
            }
        },
        methods: {
            openPage(item) {
                this.$emit('click',item)
            }
        }
    }
</script>

<style scoped>
    .index-comp-cls {
        padding: 5px;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        display: inline-flex;
        justify-items: center;
        justify-content: space-between;
        align-items: center;
        height: 106px;
        margin-right: 20px;
    }

    .index-block:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }

    .index-block {
        height: 100%;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 20px;
        padding: 6px;
    }

    .index-divider {
        width: 1px;
        height: 80%;
        border-right: 2px dotted #ffffff;
    }
    .loading-cls {
        height:36px;
    }
</style>