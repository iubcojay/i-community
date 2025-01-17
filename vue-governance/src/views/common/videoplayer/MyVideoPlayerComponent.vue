<template>
    <video
            :id="panelId"
            class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9"
            preload="auto"
            width="100%"
            height="100%"
            muted
            :autoplay="false">
        <source :src="url" type="video/mp4"/>
    </video>

</template>

<script>
    export default {
        name: "MyVideoPlayerComponent",
        props:['panelId','url','options'],
        data(){
            return{
                player:undefined
            }
        },
        methods:{
            initVideo() {
                this.player = this.$video(this.panelId, this.options, function () {
                    this.on('loadeddata',function(){
                        this.play();
                    })
                    // player.on('play', function () {
                    //     console.log('开始/恢复播放');
                    // });
                    // player.on('pause', function () {
                    //     console.log('暂停播放');
                    // });
                    this.on('ended', function () {
                        this.play()
                    });
                    // player.on('timeupdate', function() {
                    //     console.log(player.currentTime());
                    // })
                    // player.on('timeupdate', function () {
                    //     // 如果 currentTime() === duration()，则视频已播放完毕
                    //     if (player.duration() != 0 && player.currentTime() === player.duration()) {
                    //         // 播放结束
                    //     }
                    // })


                });
            }
        },

        mounted() {
            this.initVideo()
            this.$emit('getVideoProps',{
                videoPlayer:this.player
            })
        },

        beforeDestroy() {
            this.player.dispose()
        }
    }
</script>

<style scoped>

</style>