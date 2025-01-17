<template>
    <div class="container">
        <iframe class="iframe-box" :src="$TreeJsServerAddress + '/views/garage/index.html'" frameborder="0" loading="lazy"></iframe>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: "GarageThreeJsSceneComponent",
    props: ['closeIframe'],
    data() {
        return {
            iframeWindow: undefined,
        }
    },
    methods: {
        initComp() {
            this.setIframeWindow()
            this.deliverProps()
        },

        setIframeWindow() {
            this.iframeWindow = document.querySelector('.iframe-box').contentWindow
        },

        deliverProps() {
            window.addEventListener('message', ({ data: dataStr }) => {
                if (typeof dataStr === "string") {
                    const data = JSON.parse(dataStr)
                    switch (data.type) {
                        case 'subWindowReady':
                            this.iframeWindow.postMessage(JSON.stringify({
                                type: 'baseInfo',
                                data: {
                                    userInfo: this.userInfo,
                                    areaInfo: this.areaInfo,
                                }
                            }), '*')
                            break
                        case 'exit':
                            this.closeIframe()
                            break
                    }
                }

            })
        },
    },

    computed: {
        ...mapState('userAbout', ['userInfo', 'areaInfo'])
    },

    mounted() {
        this.initComp()
    },

}
</script>

<style scoped>
.container {
    width: 100%;
    height: 100%;
}

.iframe-box {
    height: 100%;
    width: 100%;
}
</style>
