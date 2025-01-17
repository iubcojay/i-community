<template>
  <div class="controller_panel">
    <div class="model_switch_panel">
      <el-switch
        v-model="isLightMode"
        active-color="rgb(33, 194, 237)"
        inactive-color="rgb(2, 77, 137)"
      ></el-switch>
      <div
        class="mode_label_panel"
        :style="{'color':isLightMode?'rgb(33, 194, 237)':'rgb(2, 77, 137)'}"
      >{{isLightMode?"控制模式":"普通模式"}}</div>
    </div>

    <SideBarComponent>
      <GarageGovernanceFacilityLightLeftComponent
        v-show="ifSideBarShow.ifLeftPanelShow"
        :sup-methods="leftMethods"
        :sup-data="leftData"
        slot="leftPanel"
      ></GarageGovernanceFacilityLightLeftComponent>
      <GarageGovernanceFacilityLightRightComponent
        v-show="ifSideBarShow.ifRightPanelShow"
        :sup-methods="rightMethods"
        :sup-data="rightData"
        slot="rightPanel"
      ></GarageGovernanceFacilityLightRightComponent>
    </SideBarComponent>
  </div>
</template>

<script>

import SideBarComponent from "@/views/garage.back1/frame/controller/side/SideBarComponent";
import GarageGovernanceFacilityLightLeftComponent from "@/views/garage.back1/governance/facility/light/side/GarageGovernanceFacilityLightLeftComponent";
import GarageGovernanceFacilityLightRightComponent from "@/views/garage.back1/governance/facility/light/side/GarageGovernanceFacilityLightRightComponent";
import * as THREE from "three";

export default {
  name: "GarageGovernanceLightControllerComponent",
  components: {
    SideBarComponent,
    GarageGovernanceFacilityLightLeftComponent,
    GarageGovernanceFacilityLightRightComponent
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false
      },
      isLightMode: false
    };
  },

  methods: {
    initComp() {
      this.setSideBarShowStatus(false, false);
      window.garageScene.garage.toggleCeilingRaise(true);
      this.enterLightMode();
      window.garageScene.resetCamera()
    },

    setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
      this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow;
      this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow;
    },

    enterLightMode() {
      this.isLightMode = true;
    },

    leaveLightMode() {
      this.isLightMode = false;
    }
  },

  computed: {
    leftData() {
      return {};
    },
    leftMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus
      };
    },

    rightData() {
      return {};
    },

    rightMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus
      };
    }
  },

  watch: {
    isLightMode(isLightMode) {
        console.log("变量isL");
        console.log(isLightMode);
        // console
      if (isLightMode) {
        window.garageScene.garage.enterLightFocusMode();
      } else {
        window.garageScene.garage.leaveLightFocusMode();
      }
    }
  },

  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    window.garageScene.garage.leaveLightFocusMode();

  }
};
</script>

<style lang="less" scoped>
.controller_panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .model_switch_panel {
    position: absolute;
    right: 20px;
    top: 100px;
    z-index: 10;
    pointer-events: all;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .mode_label_panel {
      margin-top: 10px;
      font-size: 18px;
      font-weight: 700;
    }
  }
}
</style>
