<template>
    <div class="model_panel">
        <!-- <div class="back_button" @click="handleBackBtnClick">
            <i class="iconfont icon-left" style="margin-right: 10px"></i>
            返 回
        </div> -->
        <GarageThreeJsSceneComponent :close-iframe="closeIframe"></GarageThreeJsSceneComponent>
    </div>
</template>

<script>
import gsap from 'gsap'
import GarageThreeJsSceneComponent from '@/views/index/community/internet/garage/common/model/GarageThreeJsSceneComponent'
import { mapMutations} from "vuex";


export default {
    name: "GarageCommonModelMaskComponent",
    components: {GarageThreeJsSceneComponent},

    props: {
        mergeTime: {
            type: Number,
            default: () => {
                return 5
            },
        },

        setModelMarkShow: {}
    },
    data() {
        return {
        }
    },
    methods: {

        ...mapMutations('menuAbout',['setIfMenuShow']),

        initComp() {
            this.compShow()
            this.setIfMenuShow(false)
        },

        compShow() {
            setTimeout(()=>{
                gsap.to(".model_panel", { opacity: 1, duration: 3 })
            },(this.mergeTime-2)*1000)
           
        },

        compExit() {
            return gsap.to(".model_panel", { opacity: 0, duration: 1 });
        },

        closeIframe() {
            this.compExit().then(
                () => {
                    this.setModelMarkShow(false)
                    this.$router.push({ path: '/index/internet/monitor/common/broadcast'}).catch(err => { console.log(err) })
                    
                }
            )
        },
    },
    mounted() {
        this.initComp()
    },
    beforeDestroy () {
        this.setModelMarkShow(false)
        this.setIfMenuShow(true)
    },
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

.back_button {
    position: absolute;
    left: 10px;
    top: 90px;
    font-size: 22px;
    color: white;
    width: 120px;
    height: 60px;
    z-index: 1;
    background-color: var(--lightBlue);
    opacity: 0.8;
    border-radius: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 10px;


}

.back_button:hover {
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
