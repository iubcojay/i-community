<template>
    <div class="outer_panel" ref="outerPanel">
        <div class="content_list_panel" ref="contentListPanel">
            <div v-for="(videoInfo, index) of showList" class="video_item_panel" :key="index">
                <div class="video_panel">
                    <div class="panel_border border_lb"></div>
                    <div class="panel_border border_rb"></div>
                    <div class="panel_border border_rt"></div>
                    <div class="panel_border border_lt"></div>
                    <div class="video_position_text_panel">{{ videoInfo.position }}</div>
                    <video :src="$StaticResourceAddress + videoInfo.videoUrl" :controls="false" loop autoplay muted
                        class="video_comp"></video>
                    <div class="video_scan_panel">
                        <div class="scan_line"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
export default {
    name: "SideVideoInfiniteScrollComponent",
    props: {
        direction: {
            default: 'up'
        },
        videoList: {},
    },
    data() {
        return {
            intervalId: null,
            showNum: 5,
            showList: [],
            outerHeight: 0,
            speed: 5
        }
    },

    methods: {
        initComp() {
            this.setShowList()
        },
        setShowList() {
            this.$nextTick(() => {

                this.showList = [..._.cloneDeep(this.videoList), ..._.cloneDeep(this.videoList)]
            })
        },

        initStyle() {
            this.$nextTick(() => {
                this.outerHeight = this.$refs['outerPanel'].clientHeight;
                Array.from(this.$refs['contentListPanel'].children).forEach(item => item.style.height = Math.floor(this.outerHeight / this.showNum) + 'px')
                // switch (this.direction) {
                //     case 'up':
                //         this.$refs['contentListPanel'].style.top = 0
                //         break
                //     case 'down':
                //         this.$refs['contentListPanel'].style.bottom = 0
                // }

                document.styleSheets[0].insertRule(
                    `   
                         @keyframes parking_side_bar_scroll_up {
                            0% {
                                top: 0
                            }

                            100% {
                                top: -${this.outerHeight / this.showNum * this.videoList.length}px
                            }
                        }
                    `
                )

                document.styleSheets[0].insertRule(
                    `   
                        @keyframes parking_side_bar_scroll_down {
                            0% {
                                bottom: 0
                            }

                            100% {
                                bottom: -${this.outerHeight / this.showNum * this.videoList.length}px
                            }
                        }
                    `
                )
                this.$refs['contentListPanel'].style.animation = `parking_side_bar_scroll_${this.direction} infinite ${this.videoList.length * this.speed}s linear `
            })
        },

        // activeAutoScroll() {

        //     let step = Math.floor(this.$refs['outerPanel'].clientHeight / this.showNum)
        //     let index = 0
        //     this.intervalId = setInterval(() => {

        //         switch (this.direction) {
        //             case 'up':
        //                 this.$refs['contentListPanel'].style.top = -index * step + 'px'

        //                 break
        //             case 'down':
        //                 this.$refs['contentListPanel'].style.bottom = -index * step + 'px'
        //                 break
        //         }

        //         if (index >= this.videoList.length) {
        //             index = 0
        //         }

        //         index++



        //     }, 1000)
        // }
    },

    watch: {
        showList() {
            this.initStyle()
            // this.activeAutoScroll()
        }
    },


    mounted() {
        this.initComp()
        // console.log(this.videoList);
    },

    beforeDestroy() {
        // this.intervalId && clearInterval(this.intervalId);
        // this.intervalId && clearInterval(this.intervalId);
    },
}
</script>

<style lang="less" scoped>
.outer_panel {

    @lightBlue: rgb(33, 194, 237);
    @darkBlue: rgb(2, 77, 137);

    height: 100%;
    width: 100%;
    position: relative;
    user-select: all;
    overflow: hidden;

    .content_list_panel {
        position: absolute;
        left: 0;
        height: auto;
        width: 100%;

        &:hover {
            cursor: pointer;
            animation-play-state: paused !important;
        }


        .video_item_panel {
            height: 20%;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 10px;

            .video_panel {
                width: 100%;
                height: 100%;
                border: 3px solid @darkBlue;
                border-radius: 5px;
                position: relative;


                .video_scan_panel {
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0);
                    position: absolute;
                    left: 0;
                    top: 0;
                    overflow: hidden;

                    .scan_line {
                        content: "";
                        width: 50px;
                        height: 100%;
                        background-color: @lightBlue;
                        position: absolute;
                        animation: scan_line 4s ease-in-out infinite;
                        
                    }

                    @keyframes scan_line {
                        0%{
                            left: -50px;
                            background: linear-gradient(270deg, @lightBlue, rgba(0, 177, 255, 0))
                        }

                        100%{
                            left: 100% + 50px;
                            background: linear-gradient(270deg, @lightBlue, rgba(0, 177, 255, 0))
                        }
                    }
                }

                .panel_border {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    pointer-events: none;
                }

                .border_rt {
                    right: -3px;
                    top: -3px;
                    border-radius: 0px 5px 0px 0px;
                    border-right: 3px @lightBlue solid;
                    border-top: 3px @lightBlue solid;
                }

                .border_rb {
                    right: -3px;
                    bottom: -3px;
                    border-radius: 0px 0px 5px 0px;
                    border-right: 3px @lightBlue solid;
                    border-bottom: 3px @lightBlue solid;
                }

                .border_lt {
                    left: -3px;
                    top: -3px;
                    border-radius: 5px 0px 0px 0px;
                    border-left: 3px @lightBlue solid;
                    border-top: 3px @lightBlue solid;
                }

                .border_lb {
                    left: -3px;
                    bottom: -3px;
                    border-radius: 0px 0px 0px 5px;
                    border-left: 3px @lightBlue solid;
                    border-bottom: 3px @lightBlue solid;
                }

                .video_position_text_panel {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    height: auto;
                    width: auto;
                    padding: 5px;
                    text-align: right;
                    line-height: 100%;
                    color: white;
                    text-shadow: 0 0 10px #478de0, 0 0 20px #478de0, 0 0 30px #478de0;
                }

                .video_comp {
                    height: 100%;
                    width: 100%;
                    object-fit: fill;
                    // border-radius: 5px;
                }

            }

        }


    }

}
</style>