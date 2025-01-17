<template>
    <div id="scene_container" ref="scene_container">

    </div>
</template>

<script>
import MyThreeJsScene from '@/assets/js/threejs/MyThreeJsScene.js'
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";


export default {
    name: "SingleModelThreejsPage",
    props: ['modelUrl', 'modelScale'],
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

          

        },

        setSceneBackground() {
            // this.myThreeJsScene.scene.background = new THREE.Color("rgb(24, 49, 85)");
            // this.myThreeJsScene.scene.environment = new THREE.Color("rgb(24, 49, 85)");
            const cubeTextureLoader = new THREE.CubeTextureLoader();
            const envMapTexture = cubeTextureLoader.load([
                this.$StaticResourceAddress+ "/pisa/px.png",
                this.$StaticResourceAddress+ "/pisa/nx.png",
                this.$StaticResourceAddress+ "/pisa/py.png",
                this.$StaticResourceAddress+ "/pisa/ny.png",
                this.$StaticResourceAddress+ "/pisa/pz.png",
                this.$StaticResourceAddress+ "/pisa/nz.png",
            ]);
            

            // 给场景添加背景
            this.myThreeJsScene.scene.background = envMapTexture;
            // 给场景所有的物体添加默认的环境贴图
            this.myThreeJsScene.scene.environment = envMapTexture;

            console.log(this.myThreeJsScene.scene.background );
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
            let { scene: modelObj } = await this.myThreeJsScene.gltfLoader.loadAsync(this.modelUrl)
          
            modelObj.scale.set(...this.modelScale.split(' '))
            modelObj.position.set(0, 0, 0)
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
  
}
</style>