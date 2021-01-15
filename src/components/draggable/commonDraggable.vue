<template>
    <div>
        <!--使用draggable组件-->
        <div class="itxst">
            <div v-for="list in draggableData" class="col">
                <div class="title">{{list.name}}</div>
                <draggable group="site" animation="300" dragClass="dragClass" ghostClass="ghostClass"
                           chosenClass="chosenClass" @start="onStart" @end="onEnd">
                    <transition-group :name="'flip-list'">
                        <div class="item" v-for="item in list.array" :key="item.id">{{item.name}}</div>
                    </transition-group>
                </draggable>
            </div>

            <!--            <div class="col">-->
            <!--                <draggable class="list-group" element="ul" v-model="list" :options="{group:'site'}" :move="onMove" @start="isDragging=true" @end="isDragging=false">-->
            <!--                    <transition-group type="transition" :name="'flip-list'">-->
            <!--                        <li class="list-group-item" v-for="element in list" :key="element.order">-->
            <!--                            <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>-->
            <!--                            {{element.name}}-->
            <!--                        </li>-->
            <!--                    </transition-group>-->
            <!--                </draggable>-->
            <!--            </div>-->

            <!--            <div class="col">-->
            <!--                <draggable class="list-group" element="ul" v-model="list2" :options="{group:'site'}" :move="onMove" @start="isDragging=true" @end="isDragging=false">-->
            <!--                    <transition-group type="transition" :name="'flip-list'">-->
            <!--                        <li class="list-group-item" v-for="element in list2" :key="element.order">-->
            <!--                            <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>-->
            <!--                            {{element.name}}-->
            <!--                        </li>-->
            <!--                    </transition-group>-->
            <!--                </draggable>-->
            <!--            </div>-->
        </div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'

    const message = [
        "vue.draggable",
        "draggable",
        "component",
        "for",
        "vue.js 2.0",
    ];

    const message2 = [
        "vue.draggable",
        "draggable",
        "component",
        "for",
        "vue.js 2.0",
    ];
    export default {
        name: "commonDraggable",
        components: {
            draggable,
        },
        data() {
            return {
                drag: false,
                //定义要被拖拽对象的数组
                arr1: [
                    {id: 1, name: 'www.itxst.com'},
                    {id: 2, name: 'www.jd.com'},
                    {id: 3, name: 'www.baidu.com'},
                    {id: 3, name: 'www.taobao.com'}
                ],
                arr2: [
                    {id: 1, name: 'www.google.com'},
                    {id: 2, name: 'www.msn.com'},
                    {id: 3, name: 'www.ebay.com'},
                    {id: 4, name: 'www.yahoo.com'}
                ],
                myArray: [
                    {id: 1, name: '拖1'},
                    {id: 2, name: '动2'},
                    {id: 3, name: '我3'},
                ],
                myArray2: [
                    {id: 4, name: '拖4'},
                    {id: 5, name: '动5'},
                    {id: 6, name: '我6'},
                ],
                list: message.map((name, index) => {
                    return {name, order: index + 1, fixed: false};
                }),
                list2: message2.map((name, index) => {
                    return {name, order: index + 1, fixed: false};
                }),
                editable: true,
                isDragging: false,
                delayedDragging: false,
                draggableData: [{
                    name: "国内网站", array: [{id: 1, name: 'www.itxst.com'},
                        {id: 2, name: 'www.jd.com'},
                        {id: 3, name: 'www.baidu.com'},
                        {id: 4, name: 'www.taobao.com'}]
                },{
                    name: "国外网站", array: [{id: 5, name: 'www.google.com'},
                        {id: 6, name: 'www.msn.com'},
                        {id: 7, name: 'www.ebay.com'},
                        {id: 8, name: 'www.yahoo.com'}]
                },{
                    name: "国外网站", array: [{id: 5, name: 'www.google.com'},
                        {id: 6, name: 'www.msn.com'},
                        {id: 7, name: 'www.ebay.com'},
                        {id: 8, name: 'www.yahoo.com'}]
                }],
            };
        },
        watch: {
            isDragging(newValue) {
                if (newValue) {
                    this.delayedDragging = true;
                    return;
                }
                this.$nextTick(() => {
                    this.delayedDragging = false;
                });
            }
        },
        computed: {
            dragOptions() {
                return {
                    animation: 0,
                    group: "description",
                    disabled: !this.editable,
                };
            },
        },
        methods: {
            orderList() {
                this.list = this.list.sort((one, two) => {
                    return one.order - two.order;
                });
            },
            onMove({relatedContext, draggedContext}) {
                const relatedElement = relatedContext.element;
                const draggedElement = draggedContext.element;
                return (
                    (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
                );
            },
            //开始拖拽事件
            onStart() {
                this.drag = true;
            },
            //拖拽结束事件
            onEnd() {
                this.drag = false;
            },
        },
    }
</script>

<style scoped>
    .ghostClass {
        background-color: blue !important;
    }

    .chosenClass {
        background-color: red !important;
        opacity: 1 !important;
    }

    .dragClass {
        background-color: blueviolet !important;
        opacity: 1 !important;
        box-shadow: none !important;
        outline: none !important;
        background-image: none !important;
    }

    .itxst {
        margin: 10px;

    }

    .title {
        padding: 6px 12px;
    }

    .col {
        /*width: 40%;*/
        flex: 1;
        padding: 10px;
        border: solid 1px #eee;
        border-radius: 5px;
        float: left;
    }

    .col + .col {
        margin-left: 10px;
    }

    .item {
        padding: 6px 12px;
        margin: 0px 10px 0px 10px;
        border: solid 1px #eee;
        background-color: #f1f1f1;
    }

    .item:hover {
        background-color: #fdfdfd;
        cursor: move;
    }

    .item + .item {
        border-top: none;
        margin-top: 6px;
    }


    .flip-list-move {
        transition: transform 0.5s;
    }

    .no-move {
        transition: transform 0s;
    }

    .list-group {
        min-height: 20px;
    }

    .list-group-item {
        cursor: move;
    }

    .list-group-item i {
        cursor: pointer;
    }
</style>