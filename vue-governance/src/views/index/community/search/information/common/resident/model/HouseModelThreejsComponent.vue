<template>
    <div id="scene_container" ref="scene_container">

    </div>
</template>

<script>
import MyThreeJsScene from '@/assets/js/threejs/MyThreeJsScene.js'
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';


export default {
    name: "HouseModelThreejsComponent",
    methods: {

        initComp() {
            this.initScene()
            this.setSceneBackground()
            // this.addFloor()
            this.addModel()
        },

        initScene() {
            this.myThreeJsScene = new MyThreeJsScene({ 
                container: this.$refs['scene_container'], 
                helperOptions: { gridHelper: false, axesHelper: false },
                draco: {
                    open: true,
                    url: this.$StaticResourceAddress + '/draco/'
                }, 
            })

            this.myThreeJsScene.camera.position.set(0,5,5)

        },

        setSceneBackground() {
            this.myThreeJsScene.scene.background = new THREE.Color("rgb(24, 49, 85)");
            this.myThreeJsScene.scene.environment = new THREE.Color("rgb(24, 49, 85)");
        },

        addFloor() {
            const floor = new THREE.Group()

            const maskGeometry = new THREE.PlaneGeometry(500, 500);
            const makMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color("rgb(24, 49, 85)"),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5,
                roughness: 0.8
            });
            const mask = new THREE.Mesh(maskGeometry, makMaterial);
            mask.position.set(0, 0, 0)
            mask.rotation.set(-Math.PI / 2, 0, 0)
            floor.add(mask)

            const mirrorGeometry = new THREE.PlaneGeometry(500, 500);
            const mirror = new Reflector(mirrorGeometry, {
                clipBias: 0.003,
                textureWidth: window.innerWidth * window.devicePixelRatio,
                textureHeight: window.innerHeight * window.devicePixelRatio,
                color: 0xb5b5b5
            });

            mirror.position.set(0, -0.01, 0)
            mirror.rotation.set(-Math.PI / 2, 0, 0)
            floor.add(mirror)
            // floor.position.set(0,0,0.1)
            this.myThreeJsScene.add(floor);
        },

        async addModel() {
            let { scene:modelObj }  = await this.myThreeJsScene.gltfLoader.loadAsync(this.$StaticResourceAddress+'/model/floor/scene.gltf')

            modelObj.scale.set(1,1,1)
            modelObj.position.set(-1.5,0.1,-3.5)
            this.myThreeJsScene.add(modelObj)
        }

    },

    mounted() {

        this.initComp();
    },

    beforeDestroy() {
        this.myThreeJsScene.clearScene();
    },
}
</script>

<style lang="less" scoped>
#scene_container {
    width: 100%;
    height: 100%;
    background-color: pink;
    position: relative;
}
</style>