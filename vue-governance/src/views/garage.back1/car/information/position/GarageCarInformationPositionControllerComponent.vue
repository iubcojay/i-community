<template>
  <div class="controller_panel">
    <SideBarComponent>
      <GarageCarInformationPositionLeftComponent
        v-show="ifSideBarShow.ifLeftPanelShow"
        :sup-methods="leftMethods"
        :sup-data="leftData"
        slot="leftPanel"
      ></GarageCarInformationPositionLeftComponent>
      <GarageCarInformationPositionRightComponent
        v-show="ifSideBarShow.ifRightPanelShow"
        :sup-methods="rightMethods"
        :sup-data="rightData"
        slot="rightPanel"
      ></GarageCarInformationPositionRightComponent>
    </SideBarComponent>
  </div>
</template>

<script>
import SideBarComponent from "@/views/garage.back1/frame/controller/side/SideBarComponent";
import GarageCarInformationPositionLeftComponent from "@/views/garage.back1/car/information/position/side/GarageCarInformationPositionLeftComponent";
import GarageCarInformationPositionRightComponent from "@/views/garage.back1/car/information/position/side/GarageCarInformationPositionRightComponent";
import Car from "@/assets/js/threejs/Car";
import { mapState } from "vuex";

export default {
  components: {
    SideBarComponent,
    GarageCarInformationPositionLeftComponent,
    GarageCarInformationPositionRightComponent,
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false,
      },
      focusCarInfo: {
        id: undefined,
        license: undefined,
        type: undefined,
        color: undefined,
      },
    };
  },
  computed: {
    ...mapState("garageAbout", ["cars"]),
    areaCarInfoList() {
      const areaCarInfoList = [
        {
          id: 1,
          group: "A",
          carInfoList: [],
        },
        {
          id: 2,
          group: "B",
          carInfoList: [],
        },
        {
          id: 3,
          group: "C",
          carInfoList: [],
        },
        {
          id: 4,
          group: "行驶",
          carInfoList: [],
        },
      ];

      this.cars.forEach((carInfo) => {
        if (carInfo.parkingStatus === Car.PARKING_STATUS_STOP) {
          areaCarInfoList
            .find((item) => item.group === carInfo.parkingSpaceNumber[0])
            .carInfoList.push(carInfo);
        } else {
          _.last(areaCarInfoList).carInfoList.push(carInfo);
        }
      });
      return areaCarInfoList;
    },

    leftData() {
      return {
        areaCarInfoList: this.areaCarInfoList,
        focusCarInfo: this.focusCarInfo,
      };
    },
    leftMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus,
      };
    },

    rightData() {
      return {
        areaCarInfoList: this.areaCarInfoList,
      };
    },

    rightMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus,
        setFocusCarInfo: this.setFocusCarInfo,
      };
    },
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

    setFocusCarInfo(carInfo) {
      this.focusCarInfo.id = carInfo.id;
      this.focusCarInfo.license = carInfo.license;
      this.focusCarInfo.type = carInfo.type;
      this.focusCarInfo.color = carInfo.color;
    },
  },

  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    this.updateCarListIntervalId && clearInterval(this.updateCarListIntervalId);
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
