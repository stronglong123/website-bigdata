<template>
    <div class="handleedit" id="edit">
        <slot name="button"></slot>
    </div>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    mounted() {
        // setTimeout(() => {
        //     let edit = document.getElementById("edit");
        //     // 组件高度
        //     let selfHeight = edit.offsetHeight;
        //     // 获取上一个兄弟节点，并获取高度
        //     let card = edit.previousElementSibling;
        //     let height = card.offsetHeight;
        //     let top = card.offsetTop;
        //     let width = window.getComputedStyle(card).width;
        //     // 获取屏幕高度
        //     let documentHeight = document.documentElement.clientHeight;

        //     if (height + top + selfHeight > documentHeight) {
        //         edit.style.width = width;
        //         edit.style.position = "fixed";
        //         edit.style.bottom = "0px";
        //     }
        // }, 500);
    }
};
</script>

<style lang="scss" scoped>
.handleedit {
    z-index: 99;
    text-align: center;
    padding: 5px 0;
    position: sticky;
    bottom: 0;
}
</style>