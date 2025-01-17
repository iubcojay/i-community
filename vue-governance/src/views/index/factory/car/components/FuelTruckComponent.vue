<template>
  <div class="fuel_truck_container">
    <fuel-truck-running-info-component
      v-if="truckStatus === 1"
      :screen-position="screenPosition"
      :plate-number="truckInfo.plateNumber"
      :speed="speed"
    ></fuel-truck-running-info-component>
    <fuel-truck-stop-info-component
      v-if="truckStatus === 2"
      :screen-position="screenPosition"
      :plate-number="truckInfo.plateNumber"
    ></fuel-truck-stop-info-component>
    <fuel-truck-accident-info-component
      v-if="truckStatus === 3"
      :screen-position="screenPosition"
      :plate-number="truckInfo.plateNumber"
    ></fuel-truck-accident-info-component>
  </div>
</template>

<script>
import FuelTruckRunningInfoComponent from "@/views/index/factory/car/components/FuelTruckRunningInfoComponent";
import FuelTruckStopInfoComponent from "@/views/index/factory/car/components/FuelTruckStopInfoComponent";
import FuelTruckAccidentInfoComponent from "@/views/index/factory/car/components/FuelTruckAccidentInfoComponent";
import WSUtil from "@/assets/js/ws/WSUtil.js";

const STATUS_NONE = 0;
const STATUS_RUNNING = 1;
const STATUS_STOP = 2;
const STATUS_ACCIDENT = 3;
export default {
  name: "FuelTruckComponent",
  components: {
    FuelTruckRunningInfoComponent,
    FuelTruckStopInfoComponent,
    FuelTruckAccidentInfoComponent,
  },
  props: ["truckInfo"],
  data() {
    return {
      pointList: [],
      truckStatus: STATUS_NONE,
      wsInterval: 3,
      delay: 0.5,
      screenPosition: { left: -1000, top: -1000 },
      speed: "0km/s",
    };
  },
  computed: {
    cesiumEntityId() {
      return `truck_${this.truckInfo.id}`;
    },
    delaySecond() {
      return this.wsInterval + this.delay;
    },
  },
  methods: {
    async initComp() {
      await this.setWsInterval();
      this.initTruck();
      await this.initWebSocket();
    },

    async setWsInterval() {
      const result = await this.$axios.get(
        this.$ServerAddress + "/factory/ws/interval"
      );
      if (result.status === 200) {
        this.wsInterval = result.data.interval;
      }
    },

    initTruck() {
      this.initCesiumClock();
      this.addRunningTruck();
      this.addTruckPositionListener();
    },

    initCesiumClock() {
      const viewer = window.myEarth.viewer;
      let currentTime = Cesium.JulianDate.now();
      let startTime = Cesium.JulianDate.addSeconds(
        currentTime,
        -this.delaySecond,
        new Cesium.JulianDate()
      );

      let stopTime = Cesium.JulianDate.addSeconds(
        startTime,
        9999999 * 60,
        new Cesium.JulianDate()
      );

      viewer.clock.startTime = startTime.clone();
      viewer.clock.stopTime = stopTime.clone();
      viewer.clock.currentTime = startTime.clone();
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
    },

    addRunningTruck() {
      const viewer = window.myEarth.viewer;
      const truckPositionProperty = new Cesium.SampledPositionProperty();
      this._truckPositionProperty = truckPositionProperty;
      truckPositionProperty.setInterpolationOptions({
        interpolationDegree: 10,
        interpolationAlgorithm: Cesium.LinearApproximation,
      });
      this._truckEntity = viewer.entities.add({
        id: this.cesiumEntityId,
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: viewer.clock.startTime,
            stop: viewer.clock.stopTime,
          }),
        ]),
        position: this._truckPositionProperty,
        model: {
          uri: this.truckInfo.modelUrl,
          minimumPixelSize: 64,
        },
        orientation: new Cesium.VelocityOrientationProperty(
          this._truckPositionProperty
        ),
        path: {
          resolution: 1,
          material: Cesium.Color.fromCssColorString("rgb(103, 194,  58)"),
          width: 5,
          leadTime: 0,
        },
      });
    },

    addTruckPositionListener() {
      window.myEarth.viewer.scene.postUpdate.addEventListener(
        this.positionListener
      );
    },

    positionListener() {
      const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        window.myEarth.viewer.scene,
        this._truckEntity.position.getValue(
          Cesium.JulianDate.addSeconds(
            Cesium.JulianDate.now(),
            -this.delaySecond,
            new Cesium.JulianDate()
          )
        )
      );
      if (position) {
        this.screenPosition.left = position.x;
        this.screenPosition.top = position.y;
      }
    },

    async initWebSocket() {
      const wsUtil = new WSUtil(this.$WSAddress + "/factory/truck");
      const ws = await wsUtil.create();
      this._ws = ws;
      ws.onmessage = ({ data }) => {
        this.handleReceivePointMessage(JSON.parse(data));
      };
      ws.send(
        JSON.stringify({
          tag: "begin",
          data: { truckId: this.truckInfo.id },
        })
      );
    },

    handleReceivePointMessage(newPoint) {
      // 当前点
      const currentPoint = this.pointList.at(-1);

      // 加入新点
      newPoint.julianDate = Cesium.JulianDate.fromDate(
        new Date(newPoint.timeStamp)
      );
      newPoint.status = this.getTruckStatus(newPoint);
      this.pointList.push(newPoint);
      this._truckPositionProperty.addSample(
        newPoint.julianDate,
        Cesium.Cartesian3.fromRadians(...newPoint.position)
      );

      // 计算速度
      if (currentPoint && newPoint) {
        this.computeSpeed(currentPoint, newPoint);
      }

      // 根据当前点和新点更新小车状态
      this.updateTruckStatus(currentPoint, newPoint);
    },

    updateTruckStatus(currentPoint, newPoint) {
      if (this.pointList.length <= 1) {
        this._truckEntity.show = false;
        return;
      }
      this._truckEntity.show = true;

      // 重新启动车辆
      if (
        currentPoint.status !== STATUS_RUNNING &&
        newPoint.status === STATUS_RUNNING
      ) {
        this.activeTruck();
      }

      // 停车
      if (
        currentPoint.status !== STATUS_STOP &&
        newPoint.status === STATUS_STOP
      ) {
        this.stopTruck();
      }

      // 车辆持续运行时，记录车辆朝向
      if (
        currentPoint.status === STATUS_RUNNING &&
        newPoint.status === STATUS_RUNNING
      ) {
        this._orientation = new Cesium.VelocityOrientationProperty(
          this._truckPositionProperty
        ).getValue(currentPoint.julianDate);
      }

      // 当前位置车辆故障
      if (
        currentPoint.status === STATUS_ACCIDENT &&
        newPoint.status === STATUS_ACCIDENT
      ) {
        this.brokeTruck();
      }
    },

    activeTruck() {
      if (this.truckStatus !== STATUS_RUNNING) {
        this.truckStatus = STATUS_RUNNING;
        setTimeout(() => {
          this._truckEntity.orientation = new Cesium.VelocityOrientationProperty(
            this._truckPositionProperty
          );
        }, 500);
        this._truckEntity.path.material = Cesium.Color.fromCssColorString(
          "rgb(103, 194,  58)"
        );
      }
    },

    stopTruck() {
      if (this.truckStatus !== STATUS_STOP) {
        this.truckStatus = STATUS_STOP;
        if (this._orientation) {
          this._truckEntity.orientation = this._orientation;
        }
        this._truckEntity.path.material = Cesium.Color.fromCssColorString(
          "rgb(230, 162,  60)"
        );
      }
    },

    brokeTruck() {
      if (this.truckStatus !== STATUS_ACCIDENT) {
        this.truckStatus = STATUS_ACCIDENT;
        if (this._orientation) {
          this._truckEntity.orientation = this._orientation;
        }
        this._truckEntity.path.material = Cesium.Color.fromCssColorString(
          "rgb(245, 108, 108)"
        );
      }
    },

    getTruckStatus(newPoint) {
      if (newPoint.status === "accident") {
        return STATUS_ACCIDENT;
      } else {
        if (this.pointList.length >= 2) {
          const lastPoint = this.pointList.at(-1);
          if (
            JSON.stringify(lastPoint.position) ===
            JSON.stringify(newPoint.position)
          ) {
            return STATUS_STOP;
          } else {
            return STATUS_RUNNING;
          }
        } else {
          return STATUS_NONE;
        }
      }
    },

    computeSpeed(point1, point2) {
      const start = Cesium.Cartographic.fromRadians(...point1.position);
      const end = Cesium.Cartographic.fromRadians(...point2.position);
      const ellipsoidGeodesic = new Cesium.EllipsoidGeodesic(start, end);
      const distance = ellipsoidGeodesic.surfaceDistance;
      const interval = Cesium.JulianDate.secondsDifference(
        point2.julianDate,
        point1.julianDate
      );
      this.speed = `${(((distance / interval) * 3.6) / 4).toFixed(1)}km/h`;
    },

    clearModel() {
      window.myEarth?.viewer.entities.removeById(this.cesiumEntityId);
      window.myEarth?.viewer.scene.postUpdate.removeEventListener(
        this.positionListener
      );
    },

    closeWs() {
      if (this._ws) {
        this._ws.close();
      }
    },

    destroyComp() {
      this.clearModel();
      this.closeWs();
    },
  },
  mounted() {
    this.initComp();
  },
  beforeDestroy() {
    this.destroyComp();
  },
};
</script>

<style lang="less" scoped>
.fuel_truck_container {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  pointer-events: none;
}
</style>
