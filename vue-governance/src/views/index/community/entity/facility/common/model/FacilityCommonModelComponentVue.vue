<template>
    <div class="model_panel">
        <div class="back_button" @click="handleBackBtnClick">
            <i class="iconfont icon-left" style="margin-right: 10px"></i>
            返 回</div>

        <a-scene id="scene" vr-mode-ui="enabled: false" background="color: rgb(24, 49, 85)">
            <a-assets id="assets" @loaded="modelLoaded = true">
                <a-asset-item id="gltf" :src="$StaticResourceAddress+'/model/parking_garage/scene.gltf'"></a-asset-item>
<!--                <a-asset-item id="gltf" :src="modelUrl"></a-asset-item>-->
            </a-assets>
            <a-entity destroy-as-remove position="0 0 0">
<!--                <a-gltf-model v-if="modelLoaded" id="model" src="#gltf" position="0 0 0" :scale="modelScale"></a-gltf-model>-->
                <a-gltf-model v-if="modelLoaded" id="model" src="#gltf" position="0 0 0" scale="10 10 10"></a-gltf-model>
                <a-entity position="0 -0.001 0">
                    <a-plane rotation="-90 0 0" position="0 0 0" width="500" height="500" color="rgb(24, 49, 85)" material="transparent:true;opacity:0.85;roughness:0.8"></a-plane>
                    <a-entity rotation="-90 0 0"  position="0 -0.1 0" aframe-my-mirror></a-entity>
                </a-entity>
            </a-entity>
            <a-entity destroy-as-remove camera look-controls="enabled: false" :orbit-controls="orbitControlsOption"></a-entity>
            <a-entity destroy-as-remove light = "type: ambient; intensity: 0.5;"></a-entity>
            <a-entity destroy-as-remove light="type: spot; angle: 60;target: #model; intensity: 1;" position="500 500 500"></a-entity>
            <a-entity destroy-as-remove light="type: spot; angle: 60;target: #model; intensity: 1;" position="-500 500 -500"></a-entity>
        </a-scene>
    </div>
</template>

<script>
    import gsap from 'gsap'


    export default {
        name: "FacilityCommonModelComponentVue",
        data(){
            return{
                modelLoaded: false,
                "orbit-controls-option":{
                    target:'0 0 0',
                    enablePan:false,
                    initialPosition: this.initialPosition,
                    maxDistance: 50,
                    minPolarAngle:0,
                    maxPolarAngle:80
                },
                sceneObject3D: undefined
            }
        },
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
        computed:{
            orbitControlsOption(){
                return {
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
                // const entityList = document.querySelector('#scene').querySelectorAll('a-entity')
                // entityList.forEach(
                //     entity=>{
                //         entity.destroy()
                //     }
                // )

                // document.querySelector('#scene').destroy()

                // console.log( AFRAME.scenes[0].systems)
                // AFRAME.scenes[0].systems.material.Object.keys(textureCache).then(function (texture) {
                //     texture.dispose();
                // });


                function clearScene(){
                    // 从scene中删除模型并释放内存
                    if(myObjects.length > 0){
                        for(var i = 0; i< myObjects.length; i++){
                            var currObj = myObjects[i];

                            // 判断类型
                            if(currObj instanceof THREE.Scene){
                                var children = currObj.children;
                                for(var i = 0; i< children.length; i++){
                                    deleteGroup(children[i]);
                                }
                            }else{
                                deleteGroup(currObj);
                            }
                            scene.remove(currObj);
                        }
                    }
                }

                // 删除group，释放内存
                function deleteGroup(object) {
                    if (object.isMesh){
                        object.geometry.dispose(); // 删除几何体
                        object.material.dispose(); // 删除材质
                    }else if(object.isGroup){
                        object.children.forEach(item=>{
                            deleteGroup(item)
                        })
                    }
                }

                document.querySelector('#scene').object3D.children.forEach(
                    item=>{
                        deleteGroup(item)
                    }
                )
                console.log();


                this.compExit().then(
                    ()=>{
                        this.setModelMarkShow(false)
                    }
                )
            }
        },
        mounted() {

            this.initComp()
        },

        beforeDestroy() {

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


</style>
