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
import SideVideoInfiniteScrollComponent from '@/views/index/community/internet/monitor/common/fireDetection/video/SideVideoInfiniteScrollComponent'
import CenterVideoWarningComponent from '@/views/index/community/internet/monitor/common/fireDetection/video/CenterVideoWarningComponent'
import DisplayVideoComponent from '@/views/index/community/internet/monitor/common/fireDetection/video/DisplayVideoComponent'
import _ from 'lodash'
export default {

    name: "VideoWallComponent",
    components: { SideVideoInfiniteScrollComponent, CenterVideoWarningComponent, DisplayVideoComponent },
    data() {
        return {
            isVideoWallFolded: false,

            videoList: [
                {
                    position: '幸福小区-1幢',
                    videoUrl: "/monitor/house.mp4",

                },
                {
                    position: '幸福小区-2幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-3幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-4幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-5幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-6幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-7幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-8幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-9幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-10幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-11幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-12幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-13幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-14幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-15幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-16幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-17幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-18幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-19幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-20幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-21幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-1幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-2幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-3幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-4幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-5幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-6幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-7幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-8幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-9幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-10幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-11幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-12幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-13幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-14幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-15幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-16幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-17幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-18幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-19幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-20幢',
                    videoUrl: "/monitor/house.mp4"
                },
                {
                    position: '幸福小区-21幢',
                    videoUrl: "/monitor/house.mp4"
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
                    position: '幸福小区-1幢',
                    videoUrl: "/monitor/fire/fire1.mp4",
                    address: [Cesium.Math.toRadians(117.0441991), Cesium.Math.toRadians(36.6625361), 20]
                }, {
                    id: 2,
                    position: '幸福小区-2幢',
                    videoUrl: "/monitor/fire/fire2.mp4",
                    address: [Cesium.Math.toRadians(117.0441991), Cesium.Math.toRadians(36.6625361), 20]
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