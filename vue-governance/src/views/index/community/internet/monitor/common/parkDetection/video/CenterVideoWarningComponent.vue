<template>
    <div class="outer_panel">
        

        <div v-if="waringVideoList[index]" v-for="(position, index) of ['left_top', 'left_bottom', 'right_top', 'right_bottom']"
            :class="'center_' + position + '_panel'" :key="position">
            <div class="center_video_content_panel" :class="{ warning_animation: waringVideoList[index].ifWarning}">
                <div class="border_lb"
                    :class="{ panel_border_normal: !waringVideoList[index].ifWarning, panel_border_warning: waringVideoList[index].ifWarning }">
                </div>
                <div class="border_rb"
                    :class="{ panel_border_normal: !waringVideoList[index].ifWarning, panel_border_warning: waringVideoList[index].ifWarning }">
                </div>
                <div class="border_rt"
                    :class="{ panel_border_normal: !waringVideoList[index].ifWarning, panel_border_warning: waringVideoList[index].ifWarning }">
                </div>
                <div class="border_lt"
                    :class="{ panel_border_normal: !waringVideoList[index].ifWarning, panel_border_warning: waringVideoList[index].ifWarning }">
                </div>

                <video :src="$StaticResourceAddress + waringVideoList[index].videoUrl" :controls="false" loop autoplay
                    muted class="video_comp"></video>
                <div class="position_text_panel">{{  waringVideoList[index].position }}</div>

                <div v-if="waringVideoList[index].ifWarning" class="mask_panel">
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CenterVideoWarningComponent",
    props: ['waringVideoList']
}
</script>

<style lang="less" scoped>
.outer_panel {
    height: 100%;
    width: 100%;



    @lightBlue: rgb(33, 194, 237);
    @darkBlue: rgb(2, 77, 137);
    @warningRed: red;


    .center_video_panel {
        width: 50%;
        height: 50%;
        position: absolute;
        box-sizing: border-box;
       

        .center_video_content_panel {
            width: 100%;
            height: 100%;
            position: relative;
            box-sizing: border-box;

            border-radius: 10px;
            border: solid 5px @darkBlue;

            .panel_border_normal {
                position: absolute;
                width: 30px;
                height: 30px;
                pointer-events: none;
                border-width: 0;
                border-radius: 0;
                border-color: @lightBlue;
                border-style: solid;

            }

            .panel_border_warning {
                position: absolute;
                width: 30px;
                height: 30px;
                pointer-events: none;
                border-width: 0;
                border-radius: 0;
                border-color: @warningRed;
                border-style: solid;

            }

            .border_rt {
                right: -5px;
                top: -5px;
                border-top-right-radius: 10px;
                border-right-width: 5px;
                border-top-width: 5px;
            }

            .border_rb {
                right: -5px;
                bottom: -5px;
                border-bottom-right-radius: 10px;
                border-right-width: 5px;
                border-bottom-width: 5px;
            }

            .border_lt {
                left: -5px;
                top: -5px;
                border-top-left-radius: 10px;
                border-left-width: 5px;
                border-top-width: 5px;
            }

            .border_lb {
                left: -5px;
                bottom: -5px;
                border-bottom-left-radius: 10px;
                border-left-width: 5px;
                border-bottom-width: 5px;
            }


            .video_comp {
                height: 100%;
                width: 100%;
                object-fit: fill;
            }

            .position_text_panel{
                height: 100%;
                width: auto;
                position: absolute;
                writing-mode: vertical-lr;
                font-size: 25px;
                color: white;
                font-weight: 500;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                // background-color: pink;
                left: 15px;
                top: 0;
                text-shadow: 0 0 10px #478de0, 0 0 20px #478de0, 0 0 30px #478de0;
            }

            .mask_panel{
                position: absolute;
                height: 100%;
                width: 100%;
                left: 0;
                top: 0;
                background-color: rgba(0,0,0,0.5);
                z-index: 999;
                visibility: hidden;
                &:hover{
                    cursor: pointer;
                }
            }

            &:hover .mask_panel{
                visibility: visible;
            }

        }

        .warning_animation {
            animation: warning_border infinite 1s ease-in-out alternate-reverse;
        }

        @keyframes warning_border {
            0% {
                box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0);
            }

            100% {
                box-shadow: 0 0 20px 5px @warningRed;
            }
        }
    }

    .center_left_top_panel {
        .center_video_panel();
        left: 0;
        top: 0;
        padding: 50px 10px 10px 30px;

    }

    .center_left_bottom_panel {
        .center_video_panel();
        left: 0;
        bottom: 0;
        padding: 10px 10px 50px 30px;
    }

    .center_right_top_panel {
        .center_video_panel();
        right: 0;
        top: 0;
        padding: 50px 30px 10px 10px;
    }

    .center_right_bottom_panel {
        .center_video_panel();
        right: 0;
        bottom: 0;
        padding: 10px 30px 50px 10px;
    }




}
</style>