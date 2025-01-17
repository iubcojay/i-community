<template>
    <div class="container">
        <iframe  class="iframe-box" :src="$TreeJsServerAddress+'/views/SingleModelPage.html'" frameborder="0"></iframe>
    </div>
</template>

<script>
    export default {
        name: "SingleModelPage",
        props:{
            modelUrl:{
                type:String
            },
            orbitControlsOption:{
                type:Object,
                default:()=>{
                    return{
                        target: '0 0 0',
                        enablePan:false,
                        initialPosition: '0 10 10',
                        maxDistance: 20,
                        minPolarAngle:0,
                        maxPolarAngle:80,
                    }
                }
            },
            modelScale:{
                type:String,
                default:()=>{
                    return "1 1 1"
                }
            },
            modelPosition:{
                type: String,
                default:()=>{
                    return "0 0 0"
                }
            },
            ifFloorShow:{
                type: Boolean,
                default:()=>{
                    return true
                }
            }

        },
        data(){
            return{
                iframeWindow:undefined,
            }
        },
        methods: {
            initComp() {
                this.setIframeWindow()
                this.deliverProps()
            },

            setIframeWindow(){
                this.iframeWindow = document.querySelector('.iframe-box').contentWindow
            },

            deliverProps(){
                window.addEventListener('message',({data:dataStr})=>{
                    const data = JSON.parse(dataStr)
                    if (data.type === 'subWindowReady'){
                        this.iframeWindow.postMessage(JSON.stringify({
                            type: 'threeJsParameters',
                            data:{
                                modelUrl:this.modelUrl,
                                modelScale: this.modelScale,
                                orbitControlsOption:this.orbitControlsOption,
                                modelPosition:this.modelPosition,
                                ifFloorShow:this.ifFloorShow,
                            }
                        }), '*')
                    }
                })
            },
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