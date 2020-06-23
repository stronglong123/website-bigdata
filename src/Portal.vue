<template>
    <div id="app">
        <component :is="current"></component>
    </div>
</template>

<script>
    export default {
        name: 'portal',
        data() {
            return {
                current: 'home'
            }
        },
        components: {
            'home': () => import("pages/portal/Home")
        }
    }

</script>

<style>
    #app {
        margin-top: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        background:rgba(247,247,247,1);
    }
</style>
