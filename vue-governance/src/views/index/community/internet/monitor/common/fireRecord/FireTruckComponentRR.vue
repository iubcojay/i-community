<template>
  <div class="fire_truck_outer_container">
    <div
        class="fire_board_container"
        :style="{ ...truckPositionStyle, ...colorStyle }"
    >
      <div class="header_panel"></div>
      <div class="triangle_panel"></div>
      <div class="main_content_container">
        <div class="plate_number_panel">{{ tip }}</div>
        <div class="detail_container">
          <div class="speed_panel">{{ this.speed }}</div>
          <!--          <div class="time_panel">{{ currentTimeText }}</div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WaterGunEffect from "@/assets/js/cesium/WaterGunEffect";

export default {
  name: "FireTruckComponent",
  props: ["fireTruckInfo", "accidentPosition"],
  data() {
    return {
      status: "to",
      truckPositionStyle: {
        left: "-1000px",
        top: "-1000px",
      },

      speed: "0km/h",
      currentTimeText: "",
      colorsDict: {
        to: "255, 0, 0",
        rescue: "230,162, 60",
        back: "103,194, 58",
      },
    };
  },
  computed: {
    toInfo() {
      return this.fireTruckInfo.to;
    },
    rescueInfo() {
      return this.fireTruckInfo.rescue;
    },
    backInfo() {
      return this.fireTruckInfo.back;
    },
    colorStyle() {
      return {
        "--primary-rgb-color": this.colorsDict[this.status],
      };
    },
    tip() {
      switch (this.status) {
        case "to":
          return "赶往现场";
        case "rescue":
          return "救援中";
        case "back":
          return "返回总队";
      }
    },
  },
  methods: {
    async initComp() {
      await this.initScene();
    },

    async initScene() {
      const dataSource = await this.createDataSource();
      const toPathEntity = this.createToPathEntity();
      // 获取最后时刻，车辆的朝向
      const orientation = toPathEntity.orientation.getValue(
          Cesium.JulianDate.fromDate(new Date(this.toInfo.interval[1]))
      );
      const rescueEntity = this.createRescueEntity(orientation);
      const backPathEntity = this.createBackPathEntity();

      dataSource.entities.add(toPathEntity);
      dataSource.entities.add(rescueEntity);
      dataSource.entities.add(backPathEntity);

      this.addRenderListener();
    },

    async createDataSource() {
      const viewer = window.myEarth.viewer;
      const dataSource = await viewer.dataSources.add(
          new Cesium.CustomDataSource(this.fireTruckInfo.id)
      );
      return dataSource;
    },

    createToPathEntity() {
      const {interval, positions} = this.toInfo;
      const positionProperty = new Cesium.SampledPositionProperty();
      positionProperty.setInterpolationOptions({
        interpolationDegree: 10,
        interpolationAlgorithm: Cesium.LinearApproximation,
      });

      positions.forEach(({timestamp, position}) => {
        positionProperty.addSample(
            Cesium.JulianDate.fromDate(
                new Date(timestamp),
                new Cesium.JulianDate()
            ),
            Cesium.Cartesian3.fromDegrees(...position)
        );
      });

      const pathEntity = new Cesium.Entity({
        id: "to_path",
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: new Cesium.JulianDate.fromDate(new Date(interval[0])),
            stop: new Cesium.JulianDate.fromDate(new Date(interval[1])),
          }),
        ]),
        position: positionProperty,
        model: {
          uri: this.$StaticResourceAddress + this.fireTruckInfo.model,
        },
        orientation: new Cesium.VelocityOrientationProperty(positionProperty),
        // path: {
        //   resolution: 1,
        //   material: Cesium.Color.fromCssColorString("rgb(255, 0, 0 )"),
        //   width: 5,
        //   leadTime: 0,
        //   // trailTime: 60,
        // },
        // viewFrom: new Cesium.Cartesian3(1000, 1000, 1000),
      });
      return pathEntity;
    },

    createRescueEntity(orientation) {
      const {interval, position} = this.rescueInfo;
      const modelEntity = new Cesium.Entity({
        id: "rescue_model",
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: new Cesium.JulianDate.fromDate(new Date(interval[0])),
            stop: new Cesium.JulianDate.fromDate(new Date(interval[1])),
          }),
        ]),
        position: Cesium.Cartesian3.fromDegrees(...position),
        orientation,
        model: {
          uri: this.$StaticResourceAddress + this.fireTruckInfo.model,
        },
      });
      this.addWaterGunEffect(modelEntity);
      return modelEntity;
    },

    createBackPathEntity() {
      const {interval, positions} = this.backInfo;
      const positionProperty = new Cesium.SampledPositionProperty();
      positionProperty.setInterpolationOptions({
        interpolationDegree: 10,
        interpolationAlgorithm: Cesium.LinearApproximation,
      });

      positions.forEach(({timestamp, position}) => {
        positionProperty.addSample(
            Cesium.JulianDate.fromDate(
                new Date(timestamp),
                new Cesium.JulianDate()
            ),
            Cesium.Cartesian3.fromDegrees(...position)
        );
      });

      const pathEntity = new Cesium.Entity({
        id: "back_path",
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: new Cesium.JulianDate.fromDate(new Date(interval[0])),
            stop: new Cesium.JulianDate.fromDate(new Date(interval[1])),
          }),
        ]),
        position: positionProperty,
        model: {
          uri: this.$StaticResourceAddress + this.fireTruckInfo.model,
        },
        orientation: new Cesium.VelocityOrientationProperty(positionProperty),
        // path: {
        //   resolution: 1,
        //   material: Cesium.Color.fromCssColorString("rgb(33, 194, 237)"),
        //   leadTime: 0,
        //   // trailTime: 60,
        // },
        // viewFrom: new Cesium.Cartesian3(1000, 1000, 1000),
      });
      return pathEntity;
    },

    addRenderListener() {
      window.myEarth.viewer.scene.postRender.addEventListener(
          this.renderListener
      );
    },

    removeRenderListener() {
      window.myEarth?.viewer.scene.postRender.removeEventListener(
          this.renderListener
      );
    },

    renderListener() {
      this.updateTimeText();
      this.updateSpeed();
      this.updateStatus();
      this.updateTruckPosition();
    },

    updateTimeText() {
      const currentDate = Cesium.JulianDate.toDate(
          window.myEarth.viewer.clock.currentTime
      );
      this.currentTimeText = this.$common.dateFormat("HH:MM:SS", currentDate);
    },

    updateStatus() {
      const currentTimestamp = Cesium.JulianDate.toDate(
          window.myEarth.viewer.clock.currentTime
      ).getTime();
      if (
          currentTimestamp > this.toInfo.interval[0] &&
          currentTimestamp <= this.toInfo.interval[1]
      ) {
        this.status = "to";
      } else if (
          currentTimestamp > this.rescueInfo.interval[0] &&
          currentTimestamp <= this.rescueInfo.interval[1]
      ) {
        this.status = "rescue";
      } else if (
          currentTimestamp > this.backInfo.interval[0] &&
          currentTimestamp <= this.backInfo.interval[1]
      ) {
        this.status = "back";
      } else {
        console.log(
            "================================================================"
        );
        console.log(this.toInfo.interval);
        console.log(this.rescueInfo.interval);
        console.log(this.backInfo.interval);
        console.log(currentTimestamp);
        console.log(
            "================================================================"
        );
        this.status = "none";
      }
    },

    updateSpeed() {
      const viewer = window.myEarth.viewer;
      const dataSource = viewer.dataSources.getByName(this.fireTruckInfo.id)[0];
      const toPathEntity = dataSource.entities.getById("to_path");
      const backPathEntity = dataSource.entities.getById("back_path");
      const interval = 1;
      let start;
      let end;
      switch (this.status) {
        case "to":
          start = toPathEntity.position.getValue(
              window.myEarth.viewer.clock.currentTime
          );
          end = toPathEntity.position.getValue(
              Cesium.JulianDate.addSeconds(
                  window.myEarth.viewer.clock.currentTime,
                  1,
                  new Cesium.JulianDate()
              )
          );
          break;
        case "rescue":
          this.speed = `${0}km/h`;
          return;
        case "back":
          start = backPathEntity.position.getValue(
              window.myEarth.viewer.clock.currentTime
          );
          end = backPathEntity.position.getValue(
              Cesium.JulianDate.addSeconds(
                  window.myEarth.viewer.clock.currentTime,
                  1,
                  new Cesium.JulianDate()
              )
          );
          break;
      }

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

    updateTruckPosition() {
      const viewer = window.myEarth.viewer;
      const dataSource = viewer.dataSources.getByName(this.fireTruckInfo.id)[0];
      const toPathEntity = dataSource.entities.getById("to_path");
      const rescueModelEntity = dataSource.entities.getById("rescue_model");
      const backPathEntity = dataSource.entities.getById("back_path");
      let cartesian3Position;
      let cartographic;
      let cartesian2Position;
      switch (this.status) {
        case "to":
          cartesian3Position = toPathEntity.position.getValue(
              window.myEarth.viewer.clock.currentTime
          );
          if (cartesian3Position) {
            cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
                cartesian3Position
            );
            cartographic.height = 5;
            cartesian2Position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                window.myEarth.viewer.scene,
                Cesium.Cartesian3.fromRadians(
                    cartographic.longitude,
                    cartographic.latitude,
                    cartographic.height + 7
                )
            );
          }
          break;
        case "rescue":
          cartesian3Position = rescueModelEntity.position._value;
          if (cartesian3Position) {
            cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
                cartesian3Position
            );
            cartographic.height = 5;
            cartesian2Position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                window.myEarth.viewer.scene,
                Cesium.Cartesian3.fromRadians(
                    cartographic.longitude,
                    cartographic.latitude,
                    cartographic.height + 7
                )
            );
          }
          // console.log(cartesian2Position);
          break;
        case "back":
          cartesian3Position = backPathEntity.position.getValue(
              window.myEarth.viewer.clock.currentTime
          );
          if (cartesian3Position) {
            cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
                cartesian3Position
            );
            cartographic.height = 5;
            cartesian2Position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                window.myEarth.viewer.scene,
                Cesium.Cartesian3.fromRadians(
                    cartographic.longitude,
                    cartographic.latitude,
                    cartographic.height + 7
                )
            );
          }
          break;
      }

      if (cartesian2Position) {
        this.truckPositionStyle.left = cartesian2Position.x + "px";
        this.truckPositionStyle.top = cartesian2Position.y + "px";
      } else {
        this.truckPositionStyle.left = "-1000px";
        this.truckPositionStyle.top = "-1000px";
      }
    },

    changeToToStatus() {
      this.$nextTick(() => {
        this._waterGunEffect.particleSystem.show = false;
      });
    },

    changeToRescueStatus() {
      this.$nextTick(() => {
        this._waterGunEffect.particleSystem.show = true;
      });
    },

    changeToBackStatus() {
      this.$nextTick(() => {
        this._waterGunEffect.particleSystem.show = false;
      });
    },

    changeToNoneStatus() {
      this.$nextTick(() => {
        this._waterGunEffect.particleSystem.show = false;
        this.truckPositionStyle = {
          left: "-1000px",
          top: "-1000px",
        };
        this.speed = "0km/h";
        this.currentTimeText = "";
      });
    },

    addWaterGunEffect(entity) {
      const {position} = this.rescueInfo;
      this._waterGunEffect = new WaterGunEffect(
          window.myEarth.viewer,
          Cesium.Cartesian3.fromDegrees(...[position[0], position[1], 1])
      );
      this._waterGunEffect.entity = entity;
      this._waterGunEffect.init();
      this._waterGunEffect.particleSystem.show = false;
    },

    removeWaterGunEffect() {
      this._waterGunEffect.remove();
    },

    destroyComp() {
      const viewer = window.myEarth.viewer;
      viewer.dataSources.remove(
          viewer.dataSources.getByName(this.fireTruckInfo.id)[0],
          true
      );
      this.removeWaterGunEffect();
      this.status = "to";
      this.truckPositionStyle = {
        left: "-1000px",
        top: "-1000px",
      };
      this.speed = "0km/h";
      this.currentTimeText = "";
    },
  },

  watch: {
    status(newValue) {
      if (newValue === "to") {
        this.changeToToStatus();
      } else if (newValue === "rescue") {
        this.changeToRescueStatus();
      } else if (newValue === "back") {
        this.changeToBackStatus();
      } else {
        this.changeToNoneStatus();
      }
    },
  },

  mounted() {
    this.initComp();
  },
  beforeDestroy() {
    this.destroyComp();
    this.removeRenderListener();
  },
};
</script>

<style lang="less" scoped>
.fire_truck_outer_container {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;

  .fire_board_container {
    position: absolute;
    width: 150px;
    height: 80px;
    background: rgba(24, 49, 85, 0.9);
    border-radius: 5px;
    transform: translateX(-50%) translateY(calc(-100% - 10px));
    animation: breathe_shadow 3s infinite;

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
