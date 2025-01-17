<template>
  <div class="live_truck_container">
    <live-truck-running-info-component
      v-if="truckInfo.status === 1"
      :screen-position="screenPosition"
      :plate-number="truckInfo.plateNumber"
      :speed="speed"
    ></live-truck-running-info-component>
    <live-truck-stop-info-component
      v-if="truckInfo.status === 2"
      :screen-position="screenPosition"
      :plate-number="truckInfo.plateNumber"
    ></live-truck-stop-info-component>
    <live-truck-accident-info-component
      v-if="truckInfo.status === 3"
      :screen-position="screenPosition"
      :plate-number="truckInfo.plateNumber"
    ></live-truck-accident-info-component>
  </div>
</template>

<script>
const STATUS_NONE = 0;
const STATUS_RUNNING = 1;
const STATUS_STOP = 2;
const STATUS_ACCIDENT = 3;
import LiveTruckRunningInfoComponent from "@/views/index/factory/transport/path/live/components/LiveTruckRunningInfoComponent";
import LiveTruckStopInfoComponent from "@/views/index/factory/transport/path/live/components/LiveTruckStopInfoComponent";
import LiveTruckAccidentInfoComponent from "@/views/index/factory/transport/path/live/components/LiveTruckAccidentInfoComponent";
export default {
  name: "LiveTruckComponent",
  components: {
    LiveTruckRunningInfoComponent,
    LiveTruckStopInfoComponent,
    LiveTruckAccidentInfoComponent,
  },
  props: {
    truckInfo: {
      default: {},
    },
    delaySecond: {
      default: 3.5,
    },
  },
  data() {
    return {
      speed: "0km/h",
      screenPosition: { left: -1000, top: -1000 },
    };
  },
  computed: {
    truckEntityId() {
      return "liv_fuel_truck_" + this.truckInfo.truckId;
    },
  },
  methods: {
    initComp() {
      this.initCesiumTruck();
    },
    initCesiumTruck() {
      this.addRunningTruck();
      this.addTruckPositionListener();
    },

    addRunningTruck() {
      const viewer = window.myEarth.viewer;
      const truckPositionProperty = new Cesium.SampledPositionProperty();
      this._truckPositionProperty = truckPositionProperty;
      truckPositionProperty.setInterpolationOptions({
        interpolationDegree: 10,
        interpolationAlgorithm: Cesium.LinearApproximation,
      });
      this.truckInfo.positionList.forEach((positionInfo) => {
        this.addTruckLiveSamplePosition(
          positionInfo.timeStamp,
          positionInfo.position
        );
      });
      this._truckEntity = viewer.entities.add({
        id: "liv_fuel_truck_" + this.truckInfo.truckId,
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: viewer.clock.startTime,
            stop: viewer.clock.stopTime,
          }),
        ]),
        position: this._truckPositionProperty,
        model: {
          uri: this.$StaticResourceAddress + this.truckInfo.modelUrl,
          //   minimumPixelSize: 64,
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
        viewFrom: new Cesium.Cartesian3(100, 100, 100),
      });
    },

    addTruckPositionListener() {
      window.myEarth.viewer.scene.postRender.addEventListener(
        this.positionListener
      );
    },

    positionListener() {
      const cartesian3Position = this._truckEntity.position.getValue(
        Cesium.JulianDate.addSeconds(
          Cesium.JulianDate.now(),
          -this.delaySecond,
          new Cesium.JulianDate()
        )
      );
      if (cartesian3Position) {
        const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
          cartesian3Position
        );
        cartographic.height = 5;
        const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          window.myEarth.viewer.scene,
          Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
          )
        );
        if (position) {
          this.screenPosition.left = position.x;
          this.screenPosition.top = position.y;
        } else {
          this.screenPosition.left = -1000;
          this.screenPosition.top = -1000;
        }
      }
    },

    handleReceiveNewPointInfo(newPoint) {
      // 当前点
      const currentPoint = this.truckInfo.positionList.at(-2);

      newPoint.status = this.getTruckStatus(newPoint);

      this.addTruckLiveSamplePosition(newPoint.timeStamp, newPoint.position);

      // 计算速度
      if (currentPoint && newPoint) {
        this.computeSpeed(currentPoint, newPoint);
      }

      // 根据当前点和新点更新小车状态
      this.updateTruckStatus(currentPoint, newPoint);
    },

    updateTruckStatus(currentPoint, newPoint) {
      if (this.truckInfo.positionList.length <= 1) {
        this._truckEntity.show = false;
        return;
      }
      this._truckEntity.show = true;

      // 重新启动车辆
      if (newPoint.status === STATUS_RUNNING) {
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
        ).getValue(
          Cesium.JulianDate.fromDate(new Date(currentPoint.timeStamp))
        );
      }

      // 当前位置车辆故障
      if (
        currentPoint.status === STATUS_ACCIDENT &&
        newPoint.status === STATUS_ACCIDENT
      ) {
        this.brokeTruck();
      }
    },
    getTruckStatus(newPoint) {
      if (newPoint.status === STATUS_ACCIDENT) {
        return STATUS_ACCIDENT;
      } else {
        if (this.truckInfo.positionList.length >= 2) {
          const lastPoint = this.truckInfo.positionList.at(-2);
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

    activeTruck() {
      if (this.truckInfo.status !== STATUS_RUNNING) {
        this.truckInfo.status = STATUS_RUNNING;
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
      if (this.truckInfo.status !== STATUS_STOP) {
        this.truckInfo.status = STATUS_STOP;
        if (this._orientation) {
          this._truckEntity.orientation = this._orientation;
        }
        this._truckEntity.path.material = Cesium.Color.fromCssColorString(
          "rgb(230, 162,  60)"
        );
      }
    },

    brokeTruck() {
      if (this.truckInfo.status !== STATUS_ACCIDENT) {
        this.truckInfo.status = STATUS_ACCIDENT;
        if (this._orientation) {
          this._truckEntity.orientation = this._orientation;
        }
        this._truckEntity.path.material = Cesium.Color.fromCssColorString(
          "rgb(245, 108, 108)"
        );
      }
    },

    computeSpeed(point1, point2) {
      const start = Cesium.Cartographic.fromRadians(...point1.position);
      const end = Cesium.Cartographic.fromRadians(...point2.position);
      const ellipsoidGeodesic = new Cesium.EllipsoidGeodesic(start, end);
      const distance = ellipsoidGeodesic.surfaceDistance;
      const interval = Cesium.JulianDate.secondsDifference(
        Cesium.JulianDate.fromDate(
          new Date(point2.timeStamp),
          new Cesium.JulianDate()
        ),
        Cesium.JulianDate.fromDate(
          new Date(point1.timeStamp),
          new Cesium.JulianDate()
        )
      );
      this.speed = `${((distance / interval) * 3.6).toFixed(1)}km/h`;
    },

    addTruckLiveSamplePosition(timeStamp, position) {
      if (this._truckPositionProperty) {
        this._truckPositionProperty.addSample(
          Cesium.JulianDate.fromDate(
            new Date(timeStamp),
            new Cesium.JulianDate()
          ),
          Cesium.Cartesian3.fromRadians(...position)
        );
      }
    },

    clearComp() {
      window.myEarth?.viewer.entities.removeById(this.truckEntityId);
      window.myEarth?.viewer.scene.postUpdate.removeEventListener(
        this.positionListener
      );
    },
  },
  watch: {
    "truckInfo.positionList": {
      handler(newPositionList) {
        const newPositionInfo = newPositionList.at(-1);
        this.handleReceiveNewPointInfo(newPositionInfo);
      },
    },
  },
  mounted() {
    this.initComp();
  },
  beforeDestroy() {
    this.clearComp();
  },
};
</script>

<style lang="less" scoped>
.live_truck_container {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  pointer-events: none;
}
</style>
