<template>
    <div id="right_bar_panel">
        <div id="right_bar_content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";


    export default {
        name: "RightBarComponent",


    }
</script>

<style scoped>
    #right_bar_panel{
        position: absolute;
        right: 0;
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

    #right_bar_content{
        width: 100%;
        height: 100%;
    }


</style>