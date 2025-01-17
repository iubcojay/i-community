<template>
    <div class="video_panel" v-show="monitorInfo.videoVisible" :style="{ left: monitorInfo.winPos[0]-210 + 'px', bottom: monitorInfo.winPos[3] + 15 + 'px' }">
        <div class="panel_border border_lb"></div>
        <div class="panel_border border_rb"></div>
        <div class="panel_border border_rt"></div>
        <div class="panel_border border_lt"></div>
        <div class="header_panel">
            <div class="title_panel">
                <i class="iconfont icon-monitor"></i>
                {{monitorInfo.name}}
                |
                <i class="el-icon-location"></i>
                {{monitorInfo.position}}
            </div>
            <div class="menu_panel">
                <slot></slot>
            </div>
        </div>
        <div class="body_panel">
            <MyVideoPlayerComponent @getVideoProps="getVideoProps" :url="$StaticResourceAddress+monitorInfo.videoUrl" :panelId="'video_'+monitorInfo.id" :options="options"></MyVideoPlayerComponent>
        </div>
        <div class="footer_panel">
            <div class="triangle"></div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import MyVideoPlayerComponent from "@/views/common/videoplayer/MyVideoPlayerComponent";

    export default {
        name: "MonitorVideoComponent",
        components: {MyVideoPlayerComponent},
        props:['monitorInfo'],

        data(){
            return{
                videoPlayer:undefined,
                options:{
                    fluid: true,
                    errorDisplay: false ,
                    loop:true
                }

            }
        },

        methods:{
            getVideoProps(data){
                this.videoPlayer = data.videoPlayer
            }
        },
        watch:{
            'monitorInfo.videoVisible':{
                handler(videoVisible) {
                    if (this.videoPlayer){
                        if (videoVisible===true){
                            this.videoPlayer.play()

                        }else {
                            this.videoPlayer.pause();//暂停
                            this.videoPlayer.currentTime(0);//复位
                        }
                    }
                },
            },
        },

    }
</script>

<style scoped>
    .video_panel{
        position: fixed;
        width: 420px;
        height: auto;
        box-sizing: border-box;
        background-color: rgba(24, 49, 85, 0.9);
        box-shadow: 0 0 10px #478de0, 0 0 10px #478de0, 0 0 10px #478de0;
        border-radius: 10px;
        z-index: 1;
        pointer-events: all;
    }


    .header_panel{
        height: 42px;
        box-sizing: border-box;
        border-bottom: white solid 2px;
        line-height: 40px;
        padding-left: 20px;
        color: white;
        font-size: 14px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .menu_panel{
        display: flex;
        flex-direction: row;
        justify-content: right;
    }


    .menu_panel i:hover{
        cursor: pointer;
        color: var(--lightBlue);

    }

    .menu_panel i{
        margin-right: 15px;

    }

    .body_panel{
        height: auto;
        padding: 10px;
    }


    .footer_panel{
        height: 0px;
        background-color: rgba(0,0,0,0);
    }

    .triangle{
        width: 0px;
        height: 0px;
        margin: auto;
        border-top: 20px solid rgba(30,36,44, 0.8);
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
    }

    .panel_border {
        position: absolute;
        width: 40px;
        height: 40px;
        pointer-events:none;
    }

    .border_rt {
        right: 0;
        top: 0;
        border-radius: 0px 10px 0px 0px;
        border-right: 3px var(--lightBlue) solid;
        border-top: 3px var(--lightBlue) solid;
    }

    .border_rb {
        right: 0;
        bottom: 0;
        border-radius: 0px 0px 10px 0px;
        border-right: 3px var(--lightBlue) solid;
        border-bottom: 3px var(--lightBlue) solid;
    }

    .border_lt {
        left: 0;
        top: 0;
        border-radius: 10px 0px 0px 0px;
        border-left: 3px var(--lightBlue) solid;
        border-top: 3px var(--lightBlue) solid;
    }

    .border_lb {
        left: 0;
        bottom: 0;
        border-radius: 0px 0px 0px 10px;
        border-left: 3px var(--lightBlue) solid;
        border-bottom: 3px var(--lightBlue) solid;
    }


</style>
