<template>
    <div class="scene_change_panel" @mouseleave="sceneChangeAnimateType = undefined">
        <i class="iconfont icon-change scene_change_menu_icon  hvr-grow-shadow"></i>
        <div class="scene_box">
            <div class="scene_box_header">
                <!-- <div class="triangle_panel"></div> -->
            </div>
            <div class="scene_box_content">
                <div v-for="position of ['tr', 'br', 'tl', 'bl']" :class="['corner_border_' + position]" :key="position">
                </div>
                <div class="scene_panel">
                    <div class="scene_item_panel" :class="{
                        'active_scene_item': sceneInfo.active,
                        'active_scene_item_animate_left': sceneInfo.active && sceneChangeAnimateType === 'left',
                        'active_scene_item_animate_right': sceneInfo.active && sceneChangeAnimateType === 'right'
                    }" v-for="sceneInfo of sceneInfoList" :key="sceneInfo.name">
                        <div class="scene_item_title_panel">{{ sceneInfo.title }}</div>
                        <img :src="sceneInfo.img" />
                    </div>
                </div>
                <div class="mark_panel">
                    <div class="left_arrow_panel" @click="handleSceneChangeArrowClick('left')">
                        <i class="iconfont icon-left"></i>
                    </div>
                    <div class="right_arrow_panel" @click="handleSceneChangeArrowClick('right')">
                        <i class="iconfont icon-right"></i>
                    </div>
                    <div class="center_confirm_panel">
                        <i class="iconfont icon-arrow-right-circle" @click="handleChangeSceneClick()"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "TopBarSceneChangeComponent",
    props:['sceneInfoList','changeScene'],
    data() {
        return {
            sceneChangeAnimateType: undefined,
        }
    },
    methods: {
        handleSceneChangeArrowClick(tag) {
            const len = this.sceneInfoList.length
            let index
            index = this.sceneInfoList.findIndex(item => item.active)
            this.sceneInfoList[index].active = false
            switch (tag) {
                case "left":
                    this.sceneInfoList[(index - 1 + len) % len].active = true
                    this.sceneChangeAnimateType = 'left'
                    break
                case "right":
                   
                    this.sceneInfoList[(index + 1) % len].active = true
                    this.sceneChangeAnimateType = 'right'
                    break
            }
        },

        
        handleChangeSceneClick() {
            const sceneName = this.sceneInfoList.find(item => item.active).name
            this.changeScene(sceneName)
        }
    },

    
   
}
</script>

<style lang="less" scoped>
.scene_change_panel {
    width: auto;
    height: auto;
    padding: 0 10px;
    position: relative;

    &:hover .scene_box {
        display: flex;
        flex-direction: column;
    }

    &:hover .scene_change_menu_icon {
        cursor: pointer;


    }

    .scene_change_menu_icon {
        font-size: 25px;
        color: var(--lightBlue);
        font-weight: 700;
    }

    .scene_box {
        display: none;
        // display: flex;
        // flex-direction: column;
        position: absolute;
        // background-color: red;
        width: 400px;
        height: auto;
        top: 25px;
        right: 0;
        -webkit-animation: scale-in-ver-top 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        animation: scale-in-ver-top 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

        @keyframes scale-in-ver-top {
            0% {
                -webkit-transform: scaleY(0);
                transform: scaleY(0);
                -webkit-transform-origin: 100% 0%;
                transform-origin: 100% 0%;
                opacity: 1;
            }

            100% {
                -webkit-transform: scaleY(1);
                transform: scaleY(1);
                -webkit-transform-origin: 100% 0%;
                transform-origin: 100% 0%;
                opacity: 1;
            }
        }

        .scene_box_header {
            width: 100%;
            height: 10px;
            pointer-events: none;
            position: relative;

            .triangle_panel {
                box-sizing: border-box;
                position: absolute;
                top: 0;
                right: 7px;
                background-color: rgba(24, 49, 85, 1);
                width: 28px;
                height: 100%;
                clip-path: polygon(0 10px,
                        14px 0,
                        28px 10px);

            }


        }

        @border-width: 4px;

        .scene_box_content {
            width: 100%;
            background-color: rgba(24, 49, 85, 0.9);
            height: 250px;
            position: relative;
            border-radius: 10px;
            border-top-right-radius: 0;
            border: @border-width solid rgba(2, 77, 137);


            // @border-width: 3px;
            .corner_border() {
                background-color: rgba(0, 0, 0, 0);
                width: 30px;
                height: 30px;
                position: absolute;
                z-index: 10;

            }


            .corner_border_tr {
                .corner_border();
                right: -@border-width;
                top: -@border-width;
                border-radius: 0px 10px 0px 0px;
                border-right: @border-width var(--lightBlue) solid;
                border-top: @border-width var(--lightBlue) solid;

            }

            .corner_border_br {
                .corner_border();
                right: -@border-width;
                bottom: -@border-width;
                border-radius: 0px 0px 10px 0px;
                border-right: @border-width var(--lightBlue) solid;
                border-bottom: @border-width var(--lightBlue) solid;

            }

            .corner_border_tl {
                .corner_border();
                left: -@border-width;
                top: -@border-width;
                border-radius: 10px 0px 0px 0px;
                border-left: @border-width var(--lightBlue) solid;
                border-top: @border-width var(--lightBlue) solid;
            }

            .corner_border_bl {
                .corner_border();
                left: -@border-width;
                bottom: -@border-width;
                border-radius: 0px 0px 0px 10px;
                border-left: @border-width var(--lightBlue) solid;
                border-bottom: @border-width var(--lightBlue) solid;
            }

            .scene_panel {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0px;
                left: 0px;
                z-index: 1;
                overflow: hidden;

                .scene_item_panel {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;

                    .scene_item_title_panel {
                        position: absolute;
                        font-size: 35px;
                        font-weight: 900;
                        color: white;
                        width: 100%;
                        height: 20%;
                        text-align: center;
                        line-height: 100%;
                        left: 0;
                        top: 20px;
                        /* 设置描边宽度及颜色 默认为字体内外描边 */
                        text-stroke: 0.5px var(--lightBlue);
                        /* 兼容Webkit(Chrome/Safari)内核浏览器的写法 */
                        -webkit-text-stroke: 0.5px var(--lightBlue);

                    }

                    img {
                        height: 100%;
                        width: 100%;
                        object-fit: cover
                    }
                }

                .active_scene_item {
                    z-index: 10;
                }

                .active_scene_item_animate_left {
                    animation: slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
                }

                .active_scene_item_animate_right {

                    animation: slide-in-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
                }

                @keyframes slide-in-left {
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

                @keyframes slide-in-right {
                    0% {
                        -webkit-transform: translateX(1000px);
                        transform: translateX(1000px);
                        opacity: 0;
                    }

                    100% {
                        -webkit-transform: translateX(0);
                        transform: translateX(0);
                        opacity: 1;
                    }
                }




            }

            .mark_panel {
                position: absolute;
                height: 100%;
                width: 100%;
                z-index: 2;
                position: relative;
            }

            &:hover .mark_panel {
                background-color: rgba(0, 0, 0, 0.1);
                cursor: pointer;


                .arrow_panel() {
                    background-color: rgba(255, 255, 255, 0.2);
                    height: 100%;
                    width: 50px;
                    position: absolute;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.4);

                        i {
                            font-size: 50px;
                        }
                    }


                    i {
                        font-size: 40px;
                        color: rgba(255, 255, 255, 0.8);
                    }
                }

                .left_arrow_panel {
                    .arrow_panel();
                    top: 0;
                    left: 0;
                    display: flex;


                }

                .right_arrow_panel {
                    .arrow_panel();
                    top: 0;
                    right: 0;
                }

                .center_confirm_panel {
                    position: absolute;
                    margin: auto;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    i {
                        font-size: 50px;
                        color: rgba(255, 255, 255, 0.8);

                        &:hover {
                            transform: scale(1.2);
                            color: rgba(255, 255, 255, 1);
                        }
                    }

                }
            }
        }
    }
}
</style>