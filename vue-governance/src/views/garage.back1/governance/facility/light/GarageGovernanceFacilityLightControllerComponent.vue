<template>
  <div class="controller_panel">
    <div class="model_switch_panel">
      <el-switch
        :value="lightMode"
        active-color="rgb(33, 194, 237)"
        inactive-color="rgb(2, 77, 137)"
        @change="handleSwitchChange"
      ></el-switch>
      <div
        class="mode_label_panel"
        :style="{
          color: lightMode ? 'rgb(33, 194, 237)' : 'rgb(2, 77, 137)',
        }"
      >
        {{ lightMode ? "控制模式" : "普通模式" }}
      </div>
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
import { mapState, mapActions } from "vuex";

export default {
  name: "GarageGovernanceLightControllerComponent",
  components: {
    SideBarComponent,
    GarageGovernanceFacilityLightLeftComponent,
    GarageGovernanceFacilityLightRightComponent,
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false,
      },
    };
  },
  computed: {
    ...mapState("garageAbout", ["lights", "lightMode"]),
    leftData() {
      return {};
    },
    leftMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus,
      };
    },

    rightData() {
      return {};
    },

    rightMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus,
      };
    },
  },

  methods: {
    ...mapActions("garageAbout", ["setLightMode"]),
    initComp() {
      this.setSideBarShowStatus(false, false);
      window.garage.toggleCeilingRaise(true);
      setTimeout(() => {
        this.enterLightMode();
      }, 1000);

      window.garageScene.resetCamera();
    },

    setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
      this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow;
      this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow;
    },

    handleSwitchChange() {
      if (this.lightMode) {
        this.leaveLightMode();
      } else {
        this.enterLightMode(false);
      }
    },

    enterLightMode() {
      if (!this.lightMode) {
        this.setLightMode(true);
      }
    },

    leaveLightMode() {
      if (this.lightMode) {
        this.setLightMode(false);
      }
    },
  },

  mounted() {
    this.initComp();
  },

  destroyed() {
    this.leaveLightMode();
  },
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
