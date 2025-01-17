<template>
    <div class="patrol_event_info_panel" v-show="event.visible" :style="positionStyle">
        <div class="left_line_panel">
            <div class="top_line_box top_line_in"></div>
            <div class="bottom_line_box left_line_in"></div>
        </div>
        <div class="content_panel content_panel_in">
            <div class="header_panel">
                <div class="title_panel">{{event.eventInfo.title}}({{$common.dateFormat("YYYY-mm-dd HH:MM:SS", event.time)}})</div>
                <div class="icon_panel">
                    <i class="iconfont icon-close menu_icon" @click="handleCloseClick"></i>
                </div>

            </div>
            <div class="main_panel">
                <div class="description_panel">
                    {{event.eventInfo.description}}
                </div>
                <div class="picture_panel">
                    <el-image :src="event.eventInfo.img" style="height: 100%;width: 100%"></el-image>
                </div>
            </div>
            <div class="panel_border border_lt"></div>
            <div class="panel_border border_lb"></div>
            <div class="panel_border border_rt"></div>
            <div class="panel_border border_rb"></div>
        </div>


    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "PatrolEventComponent",
        props:{
            event: {
                type: Object,
                default: () => {}
            },

        },
        data(){
            return{

            }
        },

        computed:{
            positionStyle(){
                return {left:this.event.winPos[0] + 'px', bottom: this.event.winPos[3] + 'px' }
            },

        },

        methods:{
            handleCloseClick(){
                this.event.visible = false
            }
        },

        mounted() {
            // console.log(event.eventInfo.description)
        }
    }
</script>

<style scoped>
    .patrol_event_info_panel{
        position: absolute;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        width: 600px;
        height: 240px;
        z-index: -1;
        pointer-events: none;
    }

    .left_line_panel{
        width: 100px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .top_line_box{
        height: 50%;
        width: 100%;
        border-bottom: var(--lightBlue) 3px solid;
        box-sizing: border-box;
    }

    .bottom_line_box{
        height: 50%;
        width: 100%;
        border-left: var(--lightBlue) 3px solid;
        box-sizing: border-box;

    }

    .content_panel{
        position: relative;
        height: 100%;
        flex: 1;
        background: rgba(24, 49, 85, 0.8);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }


    .header_panel{
        height: 40px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        pointer-events: all;
        border-bottom: 1px white solid;
    }

    .title_panel{
        height: auto;
        width: auto;
        font-size: 20px;
        color: white;
        font-weight: 700;
        padding-left: 20px;
    }

    .icon_panel{
        height: auto;
        width: auto;
    }



    .menu_icon{
        color: white;
        font-size: 18px;
        font-weight: 700;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .menu_icon:hover{
        color: var(--lightBlue);
        cursor: pointer;
    }

    .main_panel{
        height: 200px;
        width: 100%;
        display: flex;
        flex-direction: row;
    }

    .description_panel{
        flex: 1;
        height: 100%;
        color: white;
        font-size: 18px;
        padding: 10px;
        box-sizing: border-box;
    }

    .picture_panel{
        height: 100%;
        width: 300px;
    }



    .panel_border {
        position: absolute;
        width: 40px;
        height: 40px;
        box-sizing: border-box;
    }

    .border_rt {
        right: 0;
        top: 0;
        border-radius: 0px 8px 0px 0px;
        border-right: 3px var(--lightBlue) solid;
        border-top: 3px var(--lightBlue) solid;
    }

    .border_rb {
        right: 0;
        bottom: 0;
        border-radius: 0px 0px 8px 0px;
        border-right: 3px var(--lightBlue) solid;
        border-bottom: 3px var(--lightBlue) solid;
    }

    .border_lt {
        left: 0;
        top: 0;
        border-radius: 8px 0px 0px 0px;
        border-left: 3px var(--lightBlue) solid;
        border-top: 3px var(--lightBlue) solid;
    }

    .border_lb {
        left: 0;
        bottom: 0;
        border-radius: 0px 0px 0px 8px;
        border-left: 3px var(--lightBlue) solid;
        border-bottom: 3px var(--lightBlue) solid;
    }


    .left_line_in {
        -webkit-animation: left_line_in 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        animation: left_line_in 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }

    @-webkit-keyframes left_line_in {
        0% {
            -webkit-transform: translateY(1000px);
            transform: translateY(1000px);
            opacity: 0;
        }
        100% {
            -webkit-transform: translateY(0);
            transform: translateY(0);
            opacity: 1;
        }
    }
    @keyframes left_line_in {
        0% {
            -webkit-transform: translateY(1000px);
            transform: translateY(1000px);
            opacity: 0;
        }
        100% {
            -webkit-transform: translateY(0);
            transform: translateY(0);
            opacity: 1;
        }
    }

    .top_line_in {
        -webkit-animation: top_line_in 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.3s both;
        animation: top_line_in 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.3s both;
    }

    @-webkit-keyframes top_line_in {
        0% {
            -webkit-transform: translateX(-1000px);
            transform: translateX(-1000px);
            opacity: 0;
        }
        100% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes top_line_in {
        0% {
            -webkit-transform: translateX(-1000px);
            transform: translateX(-1000px);
            opacity: 0;
        }
        100% {
            -webkit-transform: translateX(0);
            transform: translateX(0);
            opacity: 1;
        }
    }

    .content_panel_in {
        -webkit-animation: content_panel_in-left-fwd 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) 0.6s both;
        animation: content_panel_in 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) 0.6s both;
    }


    @-webkit-keyframes content_panel_in {
        0% {
            -webkit-transform: rotateY(100deg);
            transform: rotateY(100deg);
            -webkit-transform-origin: left;
            transform-origin: left;
            opacity: 0;
        }
        100% {
            -webkit-transform: rotateY(0);
            transform: rotateY(0);
            -webkit-transform-origin: left;
            transform-origin: left;
            opacity: 1;
        }
    }
    @keyframes content_panel_in {
        0% {
            -webkit-transform: rotateY(100deg);
            transform: rotateY(100deg);
            -webkit-transform-origin: left;
            transform-origin: left;
            opacity: 0;
        }
        100% {
            -webkit-transform: rotateY(0);
            transform: rotateY(0);
            -webkit-transform-origin: left;
            transform-origin: left;
            opacity: 1;
        }
    }



</style>
