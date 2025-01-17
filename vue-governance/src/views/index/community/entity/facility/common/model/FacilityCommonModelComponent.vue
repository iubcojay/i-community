<template>
    <div class="model_panel">
        <div class="back_button" @click="handleBackBtnClick">
            <i class="iconfont icon-left" style="margin-right: 10px"></i>
            返 回</div>
        <!-- <SingleModelPage
                :model-url="modelUrl"
                :model-scale="modelScale"
                :orbit-controls-option="{
                    target:'0 0 0',
                    enablePan:false,
                    initialPosition: initialPosition,
                    maxDistance: 50,
                    minPolarAngle:0,
                    maxPolarAngle:80
                }"
        ></SingleModelPage> -->

        <SingleModelThreejsPage :model-url="modelUrl" :model-scale="modelScale"></SingleModelThreejsPage>
        

    </div>
</template>

<script>
    import gsap from 'gsap'
    import SingleModelPage from "@/views/common/threejs/SingleModelPage";
    import SingleModelThreejsPage from "@/views/index/community/entity/facility/common/model/SingleModelThreejsPage"


    export default {
        name: "FacilityCommonModelComponent",
        components: {SingleModelPage,SingleModelThreejsPage},

        props: {
            mergeTime: {
                type: Number,
                default: () => {
                    return 2
                },
            },
            initialPosition:{
                type:String,
                default: () => {
                    return "10 8 0"
                },
            },
            modelUrl:{
              type:String
            },
            modelScale:{
                type:String,
                default:()=>{
                    return '1 1 1'
                }
            },
            setModelMarkShow:{}
        },
        data(){
            return{
                orbitControlsOption:{
                    target:'0 0 0',
                    enablePan:false,
                    initialPosition: this.initialPosition,
                    maxDistance: 50,
                    minPolarAngle:0,
                    maxPolarAngle:80
                }
            }
        },
        methods: {
            initComp() {
                this.compShow()
            },

            compShow() {
                gsap.to(".model_panel", {opacity: 1, duration: this.mergeTime});

            },

            compExit() {
                return gsap.to(".model_panel", {opacity: 0, duration:1});
            },

            handleBackBtnClick(){
                this.compExit().then(
                    ()=>{
                        this.setModelMarkShow(false)
                    }
                )
            },
        },
        mounted() {
            this.initComp()
        },

        beforeDestroy(){
            this.setModelMarkShow(false)
        }
    }
</script>

<style scoped>
    .model_panel {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: all;

    }

    .back_button{
        position: absolute;
        left: 10px;
        top: 90px;
        font-size: 22px;
        color: white;
        width: 120px;
        height: 60px;
        z-index: 1;
        background-color:var(--lightBlue);
        opacity: 0.8;
        border-radius: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 0 10px;


    }

    .back_button:hover{
        transform: scale(1.1);
        cursor: pointer;
        opacity: 1;
    }

    .iframe_container {
        width: 100%;
        height: 100%;
    }

    .iframe-box {
        height: 100%;
        width: 100%;
    }


</style>
