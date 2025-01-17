<template>
    <div class="video_wall_panel" ref="videoWallPanel">
        <div class="fold_button_panel">
            <div class="fold_button" @click="handelUnfoldButtonClick">
                <i class="fold_icon iconfont icon-left"></i>
            </div>

        </div>
        <div class="left_video_panel">
            <SideVideoInfiniteScrollComponent :video-list="videoWall.leftWall" direction="up">
            </SideVideoInfiniteScrollComponent>
        </div>
        <div class="center_video_panel">
            <DisplayVideoComponent v-if="videoWall.centerWall.length > 0" :displayList="videoWall.centerWall"
                :setIsVideoWallFolded="setIsVideoWallFolded">
            </DisplayVideoComponent>
        </div>
        <div class="right_video_panel">
            <SideVideoInfiniteScrollComponent :video-list="videoWall.rightWall" direction="down">
            </SideVideoInfiniteScrollComponent>
        </div>

    </div>
</template>

<script>
import SideVideoInfiniteScrollComponent from '@/views/index/community/internet/monitor/common/parkDetection/video/SideVideoInfiniteScrollComponent'
import CenterVideoWarningComponent from '@/views/index/community/internet/monitor/common/parkDetection/video/CenterVideoWarningComponent'
import DisplayVideoComponent from '@/views/index/community/internet/monitor/common/parkDetection/video/DisplayVideoComponent'
import _ from 'lodash'
export default {

    name: "VideoWallComponent",
    components: { SideVideoInfiniteScrollComponent, CenterVideoWarningComponent, DisplayVideoComponent },
    data() {
        return {
            isVideoWallFolded: false,

            videoList: [
                {
                    position: '解放路街道-区域1',
                    videoUrl: "/monitor/demo1.mp4",

                },
                {
                    position: '解放路街道-区域2',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域3',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域4',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域5',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域6',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域7',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域8',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域9',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域10',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域11',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域12',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域13',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域14',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域15',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域16',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域17',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域18',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域19',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域20',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域21',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域22',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域23',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域24',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域25',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域26',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域27',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域28',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域29',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域30',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域31',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域32',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域33',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域34',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域35',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域36',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域37',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域38',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域39',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域40',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域41',
                    videoUrl: "/monitor/demo1.mp4"
                },
                {
                    position: '解放路街道-区域42',
                    videoUrl: "/monitor/demo1.mp4"
                }
            ],

            videoWall: {
                centerWall: [],
                leftWall: [],
                rightWall: []
            },

            fireRecognitionId: null
        }
    },

    methods: {
        initComp() {
            this.initVideoList()
            this.setVideoWall()
            this.fireRecognition()
        },

        initVideoList() {
            this.videoList.forEach((item, index) => item.id = index)
        },


        setVideoWall() {
            let length = this.videoList.length
            let centerVideoList = _.cloneDeep(_.sampleSize(this.videoList, 16))
            centerVideoList.forEach(item => item.ifWarning = false)
            this.videoWall.centerWall.push(...centerVideoList)
            this.videoWall.leftWall.push(..._.cloneDeep(this.videoList.slice(0, length / 2)))
            this.videoWall.rightWall.push(..._.cloneDeep(this.videoList.slice(length / 2)))
        },
        setIsVideoWallFolded(val) {
            this.isVideoWallFolded = val
        },

        fireRecognition() {
            let originFireList = []
            this.fireRecognitionId = setInterval(() => {

                // 调用接口获取
                const fireList = [{
                    id: 1,
                    position: '解放路街道-区域1',
                    videoUrl: "/monitor/park/park1.mp4",
                    // address: [Cesium.Math.toRadians(117.0441991), Cesium.Math.toRadians(36.6625361), 20]
                    areaPositionList: [
                        2.0428013353577357,
                        0.639890903895401,
                        2.04280141817567,
                        0.6398900947684302,
                        2.042801894580195,
                        0.6398901649147386,
                        2.042801812456653,
                        0.6398909850222244
                    ]
                }, {
                    id: 2,
                    position: '解放路街道-区域2',
                    videoUrl: "/monitor/park/park2.mp4",
                    areaPositionList: [
                        2.0428013353577357,
                        0.639890903895401,
                        2.04280141817567,
                        0.6398900947684302,
                        2.042801894580195,
                        0.6398901649147386,
                        2.042801812456653,
                        0.6398909850222244
                    ]
                },]

                // const fireList = []


                if (!_.isEqual(originFireList.map(item => item.id), fireList.map(item => item.id))) {
                    originFireList = fireList
                    fireList.forEach(item => item.ifWarning = true)
                    const fireIdList = fireList.map(item => item.id)
                    const safeList = this.videoList.filter(item => {
                        if (fireIdList.indexOf(item.id) === -1) {
                            return true
                        } else {
                            return false
                        }
                    })

                    const paddingList = _.cloneDeep(_.sampleSize(safeList, 16 - fireList.length)).map(item => {
                        item.isWarning = false
                        return item
                    })
                    this.videoWall.centerWall = [...fireList, ...paddingList]

                }

                if (originFireList.length === 0) {
                    this.videoWall.centerWall = [..._.cloneDeep(_.sampleSize(this.videoList, 16))]
                }
            }, 5000);
        },

        setIsVideoWallFolded(val) {
            this.isVideoWallFolded = val
        },

        handelUnfoldButtonClick() {
            this.setIsVideoWallFolded(false)

        }


    },

    watch: {
        isVideoWallFolded(isVideoWallFolded) {

            if (isVideoWallFolded) {
                // 折叠

                this.$refs.videoWallPanel.classList.add('panel_fold')
                this.$refs.videoWallPanel.classList.remove('panel_unfold')

            } else {
                // 展开

                this.$refs.videoWallPanel.classList.add('panel_unfold')
                this.$refs.videoWallPanel.classList.remove('panel_fold')

            }
        }
    },

    mounted() {
        this.initComp();

    },
    beforeDestroy() {
        this.fireRecognitionId && clearInterval(this.fireRecognitionId);

    },
}
</script>

<style lang="less" scoped>
.panel_fold {
    animation: fold_animation 1s ease-in-out forwards;
}

.panel_unfold {
    animation: unfold_animation 1s ease-in-out forwards;
}

@keyframes fold_animation {
    0% {
        left: 0;
    }

    100% {
        left: 100%;
    }
}

@keyframes unfold_animation {
    0% {
        left: 100%;
    }

    100% {

        left: 0;
    }
}

.video_wall_panel {

    @lightBlue: rgb(33, 194, 237);
    @darkBlue: rgb(2, 77, 137);

    position: absolute;
    width: 100%;
    left: 0;
    height: calc(100% - 80px);
    bottom: 0;
    transition: left 1s;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(2, 77, 137, 0.6);
    pointer-events: all;

    .fold_button_panel {
        position: absolute;
        height: 100%;
        width: 50px;
        left: -60px;
        top: 0;
        z-index: 99;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        pointer-events: none;

        .fold_button {
            pointer-events: all;
            height: 120px;
            width: 40px;
            background-color: @darkBlue;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 30px 0 0 30px;

            &:hover {
                transform: scale(1.1);
                cursor: pointer;
            }

            .fold_icon {
                color: white;
                font-size: 30px;
                font-weight: 500;
            }
        }



    }

    .left_video_panel {
        height: 100%;
        flex: 1;

    }

    .center_video_panel {
        height: 100%;
        flex: 4;
        position: relative;

    }

    .right_video_panel {
        height: 100%;
        flex: 1;

    }

}
</style>