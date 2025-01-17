<template>
  <div class="controller_panel">
    <SideBarComponent>
      <GarageGovernanceFacilityLifterLeftComponent
        v-show="ifSideBarShow.ifLeftPanelShow"
        :sup-methods="leftMethods"
        :sup-data="leftData"
        slot="leftPanel"
      ></GarageGovernanceFacilityLifterLeftComponent>
      <GarageGovernanceFacilityLifterRightComponent
        v-show="ifSideBarShow.ifRightPanelShow"
        :sup-methods="rightMethods"
        :sup-data="rightData"
        slot="rightPanel"
      ></GarageGovernanceFacilityLifterRightComponent>
    </SideBarComponent>
  </div>
</template>

<script>
import SideBarComponent from "@/views/garage.back1/frame/controller/side/SideBarComponent";
import GarageGovernanceFacilityLifterLeftComponent from "@/views/garage.back1/governance/facility/lifter/side/GarageGovernanceFacilityLifterLeftComponent";
import GarageGovernanceFacilityLifterRightComponent from "@/views/garage.back1/governance/facility/lifter/side/GarageGovernanceFacilityLifterRightComponent";

export default {
  name: "GarageGovernanceFacilityLifterControllerComponent",
  components: {
    SideBarComponent,
    GarageGovernanceFacilityLifterLeftComponent,
    GarageGovernanceFacilityLifterRightComponent,
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false,
      },
    };
  },

  methods: {
    initComp() {
      this.setSideBarShowStatus(false, true);
      window.garageScene.resetCamera();
    },

    setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
      this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow;
      this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow;
    },
  },

  computed: {
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

  mounted() {
    this.initComp();
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
}
</style>
