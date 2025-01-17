<template>
  <div class="controller_panel">
    <SideBarComponent v-if="ifDataReady">
      <GarageGovernanceMonitorGateLeftComponent
        v-if="ifSideBarShow.ifLeftPanelShow"
        :sup-methods="leftMethods"
        :sup-data="leftData"
        slot="leftPanel"
      ></GarageGovernanceMonitorGateLeftComponent>
      <GarageGovernanceMonitorGateRightComponent
        v-if="ifSideBarShow.ifRightPanelShow"
        :sup-methods="rightMethods"
        :sup-data="rightData"
        slot="rightPanel"
      ></GarageGovernanceMonitorGateRightComponent>
    </SideBarComponent>
  </div>
</template>

<script>
import SideBarComponent from "@/views/garage.back1/frame/controller/side/SideBarComponent";
import GarageGovernanceMonitorGateLeftComponent from "@/views/garage.back1/governance/monitor/gate/side/GarageGovernanceMonitorGateLeftComponent";
import GarageGovernanceMonitorGateRightComponent from "@/views/garage.back1/governance/monitor/gate/side/GarageGovernanceMonitorGateRightComponent";

export default {
  name: "GarageGovernanceMonitorGateControllerComponent",
  components: {
    SideBarComponent,
    GarageGovernanceMonitorGateLeftComponent,
    GarageGovernanceMonitorGateRightComponent
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false
      },
      gateMonitorList: [],
      ifDataReady: false
    };
  },

  methods: {
    initComp() {
      this.setSideBarShowStatus(true, false);
      this.getGateMonitorList();
      window.garageScene.resetCamera();
    },

    setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
      this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow;
      this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow;
    },

    getGateMonitorList() {
        console.log(window.myThreeJsScene);
      this.gateMonitorList = window.garageScene.garage.getGateMonitorList();
      this.gateMonitorList.forEach(monitor => {
        this.$set(monitor, "ifShow", false);
      });
      this.ifDataReady = true;
    }
  },

  computed: {
    leftData() {
      return {
        gateMonitorList: this.gateMonitorList
      };
    },
    leftMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus
      };
    },

    rightData() {
      return {
        gateMonitorList: this.gateMonitorList
      };
    },

    rightMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus
      };
    }
  },

  mounted() {
    this.initComp();
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
}
</style>
