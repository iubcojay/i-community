<template>
  <div id="garage_container" ref="garage_container"></div>
</template>

<script>
import Vue from "vue";
import MyThreeJsScene from "@/assets/js/threejs/MyThreeJsScene.js";
import Garage from "@/assets/js/threejs/Garage";
import Car from "@/assets/js/threejs/Car";
import GarageAlarmPanelComponent from "@/views/garage.back1/common/panel/GarageAlarmPanelComponent";

import * as THREE from "three";
const uuid = require("uuid");

export default {
  name: "ThreeJsGarageComponent",
  components: {
    GarageAlarmPanelComponent
  },
  data() {
    return {
      alarmInfoList: [],
      askInterval: 2
    };
  },

  methods: {
    initComp() {
      this.initScene();
      this.addGarage();
    },

    initScene() {
      window.myThreeJsScene = new MyThreeJsScene({
        container: this.$refs["garage_container"],
        helperOptions: {
          gridHelper: false,
          axesHelper: false
        },
        draco: {
          open: true,
          url: this.$StaticResourceAddress + "/draco/gltf/"
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

      // 关闭点光源
      window.myThreeJsScene.spotLight.intensity = 0;

      // 关闭环境光
      window.myThreeJsScene.ambientLight.intensity = 0;
    },

    addGarage() {
      const garage = new Garage({
        gltfLoader: window.myThreeJsScene.gltfLoader
      });
      garage.initModel().then(_ => {
        this.$emit("sceneReady");
        garage.addGarageToScene(window.myThreeJsScene);
        garage.toggleCeilingRaise(true);
        // this.upDateGarageScene();
        garage.activeGarage(this.askInterval)
      });
    },
  },

  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    this.upDateGarageSceneIntervalId && clearInterval(this.upDateGarageSceneIntervalId);
    window.myThreeJsScene.clearScene();
    delete window.myThreeJsScene;
  }
};
</script>

<style lang="less" scoped>
#garage_container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: all;

  .info_layer_panel {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: none;
    z-index: 999;
  }
}
</style>
