<template>
    <div class="building_info_panel" v-show="building.visible" :style="{ left: building.winPos[0]-75 + 'px', bottom: building.winPos[3] + 'px' }">
       <div class="building_name_panel">
           {{building.name}}
       </div>
        <div class="panel_footer">
            <div class="triangle"></div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "BuildingInfoComponent",
        props:['building'],


    }
</script>

<style scoped>
    .building_info_panel{
        position: absolute;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        width: 150px;
        height: 50px;
        z-index: -1;


    }
    .building_name_panel{
        height: 40px;
        background-color: rgba(24, 49, 85, 0.9);
        color: white;
        line-height: 40px;
        text-align: center;
        letter-spacing: 5px;
        font-size: 18px;
        font-weight: 700;
        border-top: 2px solid white;
        border-left: 2px solid white;
        border-right: 2px solid white;
    }

    .panel_footer{
        height: 10px;
        background-color: rgba(0,0,0,0);
    }


    .triangle{
        width: 0px;
        height: 0px;
        margin: auto;
        border-top: 10px solid rgba(30,36,44, 0.8);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;

    }

</style>