<template>
    <div id="left_bar_panel">
        <div id="left_bar_content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";


    export default {
        name: "LeftBarComponent",

    }
</script>

<style scoped>
    #left_bar_panel{
        position: absolute;
        left: 0;
        top: 0px;
        width: 500px;
        height: 100%;
        background-color: rgba(0,0,0,0);
        /*background-color: pink;*/
        z-index: 9;
        box-sizing: border-box;
        padding-top: 80px;
        user-select: none;
        pointer-events: none;
    }

    #left_bar_content{
        width: 100%;
        height: 100%;
    }


</style>