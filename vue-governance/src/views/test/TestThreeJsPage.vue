<template>
  <div id="scene_container" ref="scene_container"></div>
</template>

<script>
import MyThreeJsScene from "@/assets/js/threejs/MyThreeJsScene.js";
import Garage from "@/assets/js/threejs/Garage";
import * as THREE from "three";
import { HTMLMesh } from "three/examples/jsm/interactive/HTMLMesh";
import ParkingSpacePlane from "@/assets/js/threejs/ParkingSpacePlane";
import Car from "@/assets/js/threejs/Car";
import ThreeJsGarageComponent from "@/views/garage.back1/common/ThreeJsGarageComponent";
import { getChildByName } from "@/assets/js/threejs/threejsUtils";
import { gsap } from "gsap";
const _ = require("lodash");
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

export default {
  name: "TestThreeJsPage",
  methods: {
    initComp() {
      this.initScene();
      // this.addGarage();
      // this.addPlane()
      // this.addCar()

      this.addRectAreaLight();
    },

    initScene() {
      this.myThreeJsScene = new MyThreeJsScene({
        container: this.$refs["scene_container"],
        helperOptions: {
          gridHelper: true,
          axesHelper: true
        },
        draco: {
          open: true,
          url: this.$StaticResourceAddress + "/draco/"
        },
        cameraOptions: {
          position: [-6.689614341938231, 39.98548073770579, -50.91144959218385],
          rotation: [
            -2.4758222840462705,
            -0.10297057258288292,
            -3.0610378516722863
          ]
        }
      });

      // 调试
      window.myThreeJsScene = this.myThreeJsScene;
      // console.log(this.myThreeJsScene);
    },

    addGarage() {
      const garage = new Garage({
        gltfLoader: this.myThreeJsScene.gltfLoader
      });
      garage.initModel().then(_ => {
        garage.addGarageToScene(window.myThreeJsScene);
        garage.toggleCeilingRaise(true);
        this.controlLights();
      });
    },

    addCar() {
      const car = new Car({
        gltfLoader: this.myThreeJsScene.gltfLoader,
        carType: "van",
        color: new THREE.Color("pink")
      });
      car.initModel().then(() => {
        car.addCarToScene(this.myThreeJsScene);
      });
    },

    addPlane() {
      const geometry = new THREE.PlaneGeometry(10, 10);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide
      });
      const plane = new THREE.Mesh(geometry, material);
      this.myThreeJsScene.camera.add(plane);
      // this.myThreeJsScene.scene.add(plane)
      plane.position.set(0, 0, -15);
      plane.rotation.set(0, 0, 0);
    },

    controlLights() {
      this.myThreeJsScene.garage.enterLightFocusMode();
      // setTimeout(()=>{
      //   this.myThreeJsScene.garage.leaveLightFocusMode();
      // },3000)
    },

    addRectAreaLight() {
      this.myThreeJsScene.ambientLight.intensity = 0;
      this.myThreeJsScene.spotLight.intensity = 0;
      const geometry = new THREE.BoxGeometry(10, 10, 10);
      const material = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(0,0,0)
      this.myThreeJsScene.scene.add(cube);
      // gsap.to(cube.position,{x:10,y:0,z:0,duration:1})


      const light = new THREE.RectAreaLight(new THREE.Color("red"), 1, 5, 10);
      light.position.set(0, 6, 0);
      // light.rotation.set(0.5*Math.PI,0.5*Math.PI,0.5*Math.PI)
      light.lookAt(0, 0, 0);
      light.rotation.set(-0.5*Math.PI,0,-0.5*Math.PI)
      const helper = new RectAreaLightHelper(light);
      this.myThreeJsScene.add(light);
      this.myThreeJsScene.scene.add(helper);
    }
  },

  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    this.myThreeJsScene.clearScene();
  }
};
</script>

<style lang="less" scoped>
#scene_container {
  width: 100%;
  height: 100%;
  background-color: pink;
  background-color: rgb(75, 75, 75);

  .test_button {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 999;
  }
}
</style>
