<template>
    <div>
        <a-card :class="{isForbiddenAu:isForbiddenAu}">
            <div class="authorityCard">
                <div class="stop">
                    <div></div>
                </div>
                <p>403</p>
                <p>没有权限</p>
                <p>您暂时没有权限访问该页面</p>
                <p>建议您检查一下再试</p>
                <el-button type="warning" size="medium" @click="goBack">返回上一页</el-button>
            </div>
        </a-card>
    </div>
</template>

<script>
import Bus from 'components/eventBus/eventBus'
export default {
    data() {
        return {
            isForbiddenAu: false
        }
    },
    methods:{
        goBack(){
            Bus.$emit('handleCloseTab')
        }
    },
    mounted(){
        const route = this.$route.name
        if(route === 'forbiddenAu'){
            this.isForbiddenAu = true
        }
    }
};
</script>

<style lang="scss" scoped>
.isForbiddenAu{
    height: 95vh;
}
.authorityCard {
    text-align: center;
    padding: 50px 0;
    .stop {
        border-radius: 50%;
        width: 150px;
        height: 150px;
        margin: 0 auto;
        border: 6px solid #e95a4a;
        display: flex;
        justify-content: center;
        align-items: center;
        > div {
            width: 70%;
            height: 10px;
            background-color: #e95a4a;
            border-radius: 2px;
        }
    }
    > p {
        margin: 0;
        &:nth-child(2) {
            font-size: 140px;
        }
        &:nth-child(3) {
            font-size: 25px;
        }
        &:nth-child(4) {
            margin-top: 15px;
            margin-bottom: 5px;
        }
        &:nth-child(5) {
            margin-bottom: 15px;
        }
    }
}
</style>