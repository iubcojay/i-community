<template>
  <div class="history_truck_container">
    <div class="fuel_truck_running_info_container" :style="positionStyle">
      <div class="header_panel"></div>
      <div class="triangle_panel"></div>
      <div class="main_content_container">
        <div class="plate_number_panel">{{ truckInfo.plateNumber }}</div>
        <div class="detail_container">
          <div class="speed_panel">{{ this.speed }}</div>
          <div class="time_panel">{{ currentTimeStr }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HistoryTruckComponent",
  props: ["pathInfo"],
  data() {
    return {
      speed: "0km/h",
      screenPosition: { left: -1000, top: -1000 },
      currentTimeStr: "",
    };
  },
  computed: {
    truckInfo() {
      return this.pathInfo.truckInfo;
    },
    startTimeStamp() {
      return this.pathInfo.path.at(0).timeStamp;
    },
    endTimeStamp() {
      return this.pathInfo.path.at(-1).timeStamp;
    },
    entityId() {
      return "history_truck_path_" + this.pathInfo.id;
    },
    positionStyle() {
      return {
        left: this.screenPosition.left + "px",
        top: this.screenPosition.top + "px",
      };
    },
  },
  methods: {
    initComp() {
      this.initCesiumClock();
      this.addTruck();
      this.addTruckPositionListener();
    },
    initCesiumClock() {
      const viewer = window.myEarth.viewer;
      let startTime = Cesium.JulianDate.fromDate(new Date(this.startTimeStamp));
      let stopTime = Cesium.JulianDate.fromDate(new Date(this.endTimeStamp));
      viewer.clock.startTime = startTime.clone();
      viewer.clock.stopTime = stopTime.clone();
      viewer.clock.currentTime = startTime.clone();
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
      viewer.clock.shouldAnimate = false;
    },
    addTruck() {
      const viewer = window.myEarth.viewer;
      const truckPositionProperty = new Cesium.SampledPositionProperty();
      this._truckPositionProperty = truckPositionProperty;
      truckPositionProperty.setInterpolationOptions({
        interpolationDegree: 10,
        interpolationAlgorithm: Cesium.LinearApproximation,
      });
      this.pathInfo.path.forEach((positionInfo) => {
        this.addTruckSamplePosition(
          positionInfo.timeStamp,
          positionInfo.position
        );
      });
      this._truckEntity = viewer.entities.add({
        id: this.entityId,
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: viewer.clock.startTime,
            stop: viewer.clock.stopTime,
          }),
        ]),
        position: this._truckPositionProperty,
        model: {
          uri: this.$StaticResourceAddress + this.truckInfo.modelUrl,
        },
        orientation: new Cesium.VelocityOrientationProperty(
          this._truckPositionProperty
        ),
        path: {
          resolution: 1,
          material: Cesium.Color.fromCssColorString("rgb(33, 194, 237)"),
          width: 5,
        },
        viewFrom: new Cesium.Cartesian3(1000, 1000, 1000),
      });
    },

    addTruckSamplePosition(timeStamp, position) {
      if (this._truckPositionProperty) {
        this._truckPositionProperty.addSample(
          Cesium.JulianDate.fromDate(
            new Date(timeStamp),
            new Cesium.JulianDate()
          ),
          Cesium.Cartesian3.fromDegrees(...position)
        );
      }
    },

    positionListener() {
      const cartesian3Position = this._truckEntity.position.getValue(
        window.myEarth.viewer.clock.currentTime
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

      this.updateTime();
      this.updateSpeed();
    },

    addTruckPositionListener() {
      window.myEarth.viewer.scene.postRender.addEventListener(
        this.positionListener
      );
    },

    updateTime() {
      const currentDate = Cesium.JulianDate.toDate(
        window.myEarth.viewer.clock.currentTime
      );
      this.currentTimeStr = this.$common.dateFormat("HH:MM:SS", currentDate);
    },

    updateSpeed() {
      const interval = 1;
      const start = this._truckEntity.position.getValue(
        window.myEarth.viewer.clock.currentTime
      );
      const end = this._truckEntity.position.getValue(
        Cesium.JulianDate.addSeconds(
          window.myEarth.viewer.clock.currentTime,
          1,
          new Cesium.JulianDate()
        )
      );

      if (start && end) {
        const startCartographic = Cesium.Cartographic.fromCartesian(start);
        const endCartographic = Cesium.Cartographic.fromCartesian(end);
        const ellipsoidGeodesic = new Cesium.EllipsoidGeodesic(
          startCartographic,
          endCartographic
        );
        const distance = ellipsoidGeodesic.surfaceDistance;
        this.speed = `${((distance / interval) * 3.6).toFixed(1)}km/h`;
      }
    },

    removeTruck() {
      window.myEarth?.viewer.entities.removeById(this.entityId);
      window.myEarth?.viewer.scene.postUpdate.removeEventListener(
        this.positionListener
      );
    },
    destroyComp() {
      this.removeTruck();
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
.history_truck_container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  .fuel_truck_running_info_container {
    position: absolute;
    width: 150px;
    height: 80px;
    background: rgba(24, 49, 85, 0.9);
    border-radius: 5px;
    transform: translateX(-50%) translateY(calc(-100% - 10px));
    animation: breathe_shadow 3s infinite;
    --primary-rgb-color: 33, 194, 237;

    @keyframes breathe_shadow {
      0% {
        box-shadow: 0 0 10px 0 rgba(var(--primary-rgb-color), 0.7);
      }
      50% {
        box-shadow: 0 0 20px 10px rgba(var(--primary-rgb-color), 0.4);
      }
      100% {
        box-shadow: 0 0 10px 0 rgba(var(--primary-rgb-color), 0.7);
      }
    }

    @headerHeight: 15px;
    .header_panel {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: @headerHeight;
      background: rgb(var(--primary-rgb-color));
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }

    .triangle_panel {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 24px;
      height: 10px;
      transform: translateX(-50%) translateY(100%);
      clip-path: polygon(0 0, 50% 100%, 100% 0);
      background: rgba(24, 49, 85, 0.9);
    }

    .main_content_container {
      position: absolute;
      left: 0;
      top: @headerHeight;
      width: 100%;
      height: calc(100% - @headerHeight);
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .plate_number_panel {
        font-size: 21px;
        font-weight: 700;
        letter-spacing: 2px;
        margin-bottom: 5px;
      }

      .detail_container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 100%;

        .speed_panel {
          font-size: 15px;
        }
        .time_panel {
          display: flex;
          flex-direction: row;
          align-items: center;

          @keyframes breathe {
            0% {
              transform: scale(1);
              background: rgba(var(--primary-rgb-color), 0.5);
            }
            50% {
              transform: scale(1.3);
              background: rgba(var(--primary-rgb-color), 1);
            }
            100% {
              transform: scale(1);
              background: rgba(var(--primary-rgb-color), 0.5);
            }
          }
          font-weight: 700;
          font-size: 15px;
        }
      }
    }
  }
}
</style>
