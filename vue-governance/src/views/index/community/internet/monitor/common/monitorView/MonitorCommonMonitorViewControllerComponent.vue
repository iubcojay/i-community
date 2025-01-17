<template>
    <div class="controller_panel">
        <VideoWallComponent></VideoWallComponent>
    </div>
</template>

<script>

import VideoWallComponent from '@/views/index/community/internet/monitor/common/fireDetection/video/VideoWallComponent'

export default {
    name: "MonitorCommonFireDetectionControllerComponent",
    components:{VideoWallComponent,},
    methods: {
        initComp() {
            window.myEarth.initPosition('community')
        }
    },

    mounted () {
        this.initComp();
    },

}
</script>

<style lang="less" scoped>
.controller_panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
</style>