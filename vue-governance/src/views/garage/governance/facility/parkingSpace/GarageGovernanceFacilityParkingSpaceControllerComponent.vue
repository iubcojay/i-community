<template>
  <div class="controller_panel">
    <SideBarComponent>
      <GarageGovernanceFacilityParkingSpaceLeftComponent
        v-show="ifSideBarShow.ifLeftPanelShow"
        :sup-methods="leftMethods"
        :sup-data="leftData"
        slot="leftPanel"
      ></GarageGovernanceFacilityParkingSpaceLeftComponent>
      <GarageGovernanceFacilityParkingSpaceRightComponent
        v-show="ifSideBarShow.ifRightPanelShow"
        :sup-methods="rightMethods"
        :sup-data="rightData"
        slot="rightPanel"
      >
      </GarageGovernanceFacilityParkingSpaceRightComponent>
    </SideBarComponent>
  </div>
</template>

<script>
import SideBarComponent from "@/views/garage.back1/frame/controller/side/SideBarComponent";
import GarageGovernanceFacilityParkingSpaceLeftComponent from "@/views/garage.back1/governance/facility/parkingSpace/side/GarageGovernanceFacilityParkingSpaceLeftComponent";
import GarageGovernanceFacilityParkingSpaceRightComponent from "@/views/garage.back1/governance/facility/parkingSpace/side/GarageGovernanceFacilityParkingSpaceRightComponent";
import ParkingSpacePlane from "@/views/garage.back1/utils/ParkingSpacePlane.js";
import * as THREE from "three";

export default {
  name: "GarageGovernanceFacilityParkingSpaceControllerComponent",
  components: {
    SideBarComponent,
    GarageGovernanceFacilityParkingSpaceLeftComponent,
    GarageGovernanceFacilityParkingSpaceRightComponent,
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false,
      },

      areaData: window.garage.getAreaData(),
    };
  },

  methods: {
    initComp() {
      this.setSideBarShowStatus(true, false);
      window.garageScene.resetCamera();
      window.garage.toggleCeilingRaise(true);
      this.addParkingSpaceMask();
    },

    setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
      this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow;
      this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow;
    },

    addParkingSpaceMask() {
      this.parkingSpaceGroup = new THREE.Group();
      this.parkingSpaceGroup.position.set(0, 0, 0);
      window.garageScene.add(this.parkingSpaceGroup);
      this.areaData.forEach(({ spaceGroupInfoList, areaColor }) => {
        spaceGroupInfoList
          .map((item) => item.spaceInfoList)
          .flat()
          .forEach((spaceInfo) => {
            let parkingSpacePlane = new ParkingSpacePlane({
              text: spaceInfo.name,
              backgroundColor: areaColor,
              position: spaceInfo.position,
              rotation: spaceInfo.rotation,
            });
            parkingSpacePlane.plane.position.y += 0.01;
            this.parkingSpaceGroup.add(parkingSpacePlane.plane);
          });
      });
    },
  },

  computed: {
    leftData() {
      return {
        areaData: this.areaData,
      };
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

  destroyed() {
    this.parkingSpaceGroup &&
      window.garageScene.removeModel(null, this.parkingSpaceGroup);
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
