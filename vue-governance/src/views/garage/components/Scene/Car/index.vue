<template>
  <div id="car_container" ref="car_container">
    <WhistlePanel
      v-show="whistleShow"
      :position="panelPositionStyle"
      :location="whistlePanelLocation"
    />
    <BaseInfo
      v-show="baseInfoShow"
      :baseInfo="baseInfo"
      :position="panelPositionStyle"
      :lockCar="lockCar"
      :unlockCar="unlockCar"
    />
  </div>
</template>

<script>
import { _ } from "lodash";
import WhistlePanel from "./Panel/WhistlePanel.vue";
import Car, {
  carTypeChineseNameDictionary,
  PARKING_STATUS_ENTER,
  PARKING_STATUS_STOP,
  PARKING_STATUS_LEAVE,
  PARKING_STATUS_ANOMALY,
  ALARM_TYPE_WHISTLE,
} from "@/views/garage.back1/utils/Car.js";
import BaseInfo from "./Panel/BaseInfo.vue";
import { Color } from "three";
import { mapState } from "vuex";
export default {
  components: {
    WhistlePanel,
    BaseInfo,
  },
  props: ["info"],
  data() {
    return {
      position: undefined,
      originInfo: undefined,
      screenPosition: { left: 0, bottom: 0 },
    };
  },
  computed: {
    ...mapState("garageAbout", ["carBaseInfoVisibleMap"]),
    alarmType() {
      return this.info.alarmType;
    },
    panelPositionStyle() {
      return {
        left: this.screenPosition.left + "px",
        bottom: this.screenPosition.bottom + "px",
      };
    },
    whistleShow() {
      return this.alarmType === ALARM_TYPE_WHISTLE;
    },

    baseInfoShow() {
      return this.carBaseInfoVisibleMap[this.info.id];
    },
    whistlePanelLocation() {
      return this.baseInfoShow ? "right" : "center";
    },

    baseInfo() {
      const info = this.info;
      return {
        id: info.id,
        license: info.license,
        type: carTypeChineseNameDictionary[info.type],
        color: "#" + new Color(info.color).getHexString(),
        status: info.parkingStatus,
        stopTime:
          info.parkingStatus === PARKING_STATUS_STOP
            ? Math.round(
                (new Date().getTime() - info.enterPathInfoList[0].timeStamp) /
                  (24 * 60 * 60 * 1000)
              )
            : 0,

        ifLocked: this.garageScene?.ifLockedModel(this._car.modelObj)
          ? true
          : false,
      };
    },
  },

  methods: {
    initComp() {
      this.addCar();
    },
    destroyComp() {
      this.removeCar();
    },

    async addCar() {
      const car = new Car({
        id: this.info.id,
        scene: window.garageScene,
        type: this.info.type,
        color: this.info.color,
        license: this.info.license,
      });
      this._car = car;
      this.originInfo = this.info;
      this.updatePosition();
      this.addPositionListener();
    },

    removeCar() {
      this.removePositionListener();
      this._car?.destroyCar();
    },

    updatePosition() {
      if (!this._car) {
        return;
      }
      const car = this._car;
      const { parkingStatus, enterPathInfoList, leavePathInfoList } = this.info;

      // 初始化位置前先隐藏模型
      car.modelObj.visible = false;

      // 合并出入库历史轨迹
      const pathInfoList = [...enterPathInfoList, ...leavePathInfoList];
      const targetPathInfo = pathInfoList.at(-1);
      const currentPathInfo = pathInfoList.at(-2);

      if (pathInfoList.length < 2) {
        return;
      }

      switch (parkingStatus) {
        // 车辆处于停车状态,直接将车辆放置到对应位置
        case PARKING_STATUS_STOP:
          car.moveTo(currentPathInfo, currentPathInfo.isForwarded, 0);
          car.moveTo(targetPathInfo, currentPathInfo.isForwarded, 0);
          car.wheelStop();
          break;

        // 入库状态
        case PARKING_STATUS_ENTER:
          if (enterPathInfoList.length === 1) {
            car.moveTo(targetPathInfo, undefined, 0);
          } else {
            car.moveAlongPath({
              positionInfoList: pathInfoList,
              startIndex: -2,
              durationFixFactor: 1.1,
              smoothFactor: 10,
            });
          }
          break;
        // 出库状态
        case PARKING_STATUS_LEAVE:
          if (leavePathInfoList.length === 1) {
            car.moveTo(targetPathInfo, undefined, 0);
          } else {
            car.moveAlongPath({
              positionInfoList: pathInfoList,
              startIndex: -2,
              durationFixFactor: 1.1,
              smoothFactor: 10,
            });
          }
          break;
        case PARKING_STATUS_ANOMALY: // 车辆异常
          car.moveTo(currentPathInfo, currentPathInfo.isForwarded, 0);
          car.moveTo(targetPathInfo, currentPathInfo.isForwarded, 0);
          car.wheelStop();
          break;
      }
      car.modelObj.visible = true;
    },

    addPositionListener() {
      if (!window.garageScene) {
        return;
      }

      window.garageScene.addRenderFunc(this.vectorPosition2ScreenPosition);
    },

    removePositionListener() {
      window.garageScene.removeRenderFunc(this.vectorPosition2ScreenPosition);
    },

    vectorPosition2ScreenPosition() {
      if (this._car) {
        const vector = this._car.modelObj.position.clone();
        vector.y += 2;
        this.screenPosition = window.garageScene.vector32Screen(vector);
      }
    },

    lockCar() {
      this._car.lockCar();
    },

    unlockCar() {
      this._car.unlockCar();
      window.garageScene.resetCamera();
    },
  },

  mounted() {
    this.initComp();
  },

  destroyed() {
    this.destroyComp();
  },

  watch: {
    info(value) {
      const originPathInfoList = [
        ...this.originInfo.enterPathInfoList,
        ...this.originInfo.leavePathInfoList,
      ];
      const currentPathInfoList = [
        ...value.enterPathInfoList,
        ...value.leavePathInfoList,
      ];

      if (
        this.originInfo.parkingStatus === PARKING_STATUS_STOP ||
        this.originInfo.parkingStatus === PARKING_STATUS_ANOMALY ||
        JSON.stringify(originPathInfoList) !==
          JSON.stringify(currentPathInfoList)
      ) {
        this.updatePosition();
      }
      this.originInfo = value;
    },
  },
};
</script>

<style lang="less" scoped>
#car_container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
</style>
