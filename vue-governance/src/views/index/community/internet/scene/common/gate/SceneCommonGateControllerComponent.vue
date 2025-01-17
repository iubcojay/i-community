<template>
  <div class="controller_outer_container">
    <SideBarComponent>
      <SceneCommonGateLeftComponent
        v-show="ifSideBarShow.ifLeftPanelShow"
        slot="leftPanel"
      ></SceneCommonGateLeftComponent>
      <SceneCommonGateRightComponent
        v-show="ifSideBarShow.ifRightPanelShow"
        slot="rightPanel"
      ></SceneCommonGateRightComponent>
    </SideBarComponent>
    <div ref="mainContainer" class="main_container">
      <gate-scene-component></gate-scene-component>
    </div>
  </div>
</template>

<script>
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";
import SceneCommonGateLeftComponent from "@/views/index/community/internet/scene/common/gate/side/SceneCommonGateLeftComponent";
import SceneCommonGateRightComponent from "@/views/index/community/internet/scene/common/gate/side/SceneCommonGateRightComponent";
import GateSceneComponent from "@/views/index/community/internet/scene/common/gate/model/GateSceneComponent";
import { gsap } from "gsap";
export default {
  name: "SceneCommonGateControllerComponent",
  components: {
    SideBarComponent,
    SceneCommonGateLeftComponent,
    SceneCommonGateRightComponent,
    GateSceneComponent,
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false,
      },

      cameraInitialDegreePosition: [117.04396, 36.66049, 253.36],
      cameraInitialDegreeHpr: [350.53, -38.21, 0],
      cameraTargetDegreePosition: [
        117.04375378862724,
        36.66440180721253,
        26.67994418830063,
      ],
      cameraTargetDegreeHpr: [266.46999999153184, -52.16999999996755, 0],
    };
  },
  methods: {
    async initComp() {
      await this.flyToPosition();
      this.loadScene();
    },
    async flyToPosition() {
      return new Promise((resolve) => {
        window.myEarth.viewer.camera.setView({
          destination: window.Cesium.Cartesian3.fromDegrees(
            ...this.cameraInitialDegreePosition
          ),
          orientation: {
            heading: window.Cesium.Math.toRadians(
              this.cameraInitialDegreeHpr[0]
            ),
            pitch: window.Cesium.Math.toRadians(this.cameraInitialDegreeHpr[1]),
            roll: window.Cesium.Math.toRadians(this.cameraInitialDegreeHpr[2]),
          },
        });

        window.myEarth.viewer.camera.flyTo({
          destination: window.Cesium.Cartesian3.fromDegrees(
            ...this.cameraTargetDegreePosition
          ),
          orientation: {
            heading: window.Cesium.Math.toRadians(
              this.cameraTargetDegreeHpr[0]
            ),
            pitch: window.Cesium.Math.toRadians(this.cameraTargetDegreeHpr[1]),
            roll: window.Cesium.Math.toRadians(this.cameraTargetDegreeHpr[2]),
          },
          duration: 3,
          complete: () => {
            resolve();
          },
        });
      });
    },

    loadScene() {
      const mainContainerElement = this.$refs["mainContainer"];
      mainContainerElement.style.pointerEvents = "none";
      gsap.fromTo(
        mainContainerElement,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          onComplete: () => {
            mainContainerElement.style.pointerEvents = "all";
          },
        }
      );
    },
  },
  mounted() {
    this.initComp();
  },
};
</script>

<style lang="less" scoped>
.controller_outer_container {
  width: 100%;
  height: 100%;

  .main_container {
    width: 100%;
    height: 100%;
    pointer-events: all;
    opacity: 0;
  }
}
</style>
