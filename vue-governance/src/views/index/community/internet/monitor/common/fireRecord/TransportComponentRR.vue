<template>
  <div class="transport_container">
    <div v-if="status === 'running'" class="transport_running_container">
      <div
        class="transport_running_info_container"
        :style="runningPositionStyle"
      >
        <div class="header_panel"></div>
        <div class="triangle_panel"></div>
        <div class="main_content_container">
          <div class="plate_number_panel">{{ plateNumber }}</div>
          <div class="detail_container">
            <div class="speed_panel">{{ this.runningSpeed }}</div>
            <div class="time_panel">{{ currentTimeText }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="status === 'accident'" class="transport_accident_container">
      <!-- <div class="accident_poi_container" :style="accidentPositionStyle">
        <div ref="accidentIcon" class="content_container">
          <i class="iconfont icon-accident"></i>
          <div ref="accidentContent" class="accident_content">
            危化品油罐车起火
          </div>
        </div>
        <div class="foot_container">
          <div ref="accidentLinePanel" class="line_panel"></div>
        </div>
      </div> -->
      <accident-poi-component
        style="z-index: 2;"
        :position="accidentPositionStyle"
      ></accident-poi-component>
<!--      <public-sentiment-poi-component-->
<!--        style="z-index: 1;"-->
<!--        v-for="publicSentiment of currentSentimentList"-->
<!--        :key="publicSentiment.id"-->
<!--        :position="publicSentiment.screenCartesian2Position"-->
<!--        :info="publicSentiment.info"-->
<!--        :degreePosition="{-->
<!--          lon: publicSentiment.lon,-->
<!--          lat: publicSentiment.lat,-->
<!--          height: 0,-->
<!--        }"-->
<!--        :centerPosition="{-->
<!--          lon: accidentInfo.position[0],-->
<!--          lat: accidentInfo.position[1],-->
<!--          height: 5,-->
<!--        }"-->
<!--      ></public-sentiment-poi-component>-->
    </div>
    <div
      v-else-if="status === 'breakdown'"
      class="transport_breakdown_container"
    >
      <div class="breakdown_poi_container" :style="breakdownPositionStyle">
        <div ref="breakdownIcon" class="content_container">
          <i class="iconfont icon-safe"></i>
          <div ref="breakdownContent" class="breakdown_content">
            危险排除
          </div>
        </div>
        <div class="foot_container">
          <div ref="breakdownLinePanel" class="line_panel"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gsap from "gsap";
import FireEffect from "@/assets/js/cesium/FireEffect";
import AccidentPoiComponent from "./AccidentPoiComponentRR.vue";
import PublicSentimentPoiComponent from "./PublicSentimentPoiComponentRR.vue";
import _ from "lodash";
export default {
  name: "TransportComponent",
  components: { AccidentPoiComponent, PublicSentimentPoiComponent },
  props: ["transportInfo"],
  data() {
    return {
      dataSource: null,
      runningPathEntity: null,
      accidentEntity: null,
      accidentScopeEntity: null,
      breakdownEntity: null,
      renderListenerCallback: null,
      status: "running",
      runningPositionStyle: {
        left: "-1000px",
        top: "-1000px",
      },
      accidentPositionStyle: {
        left: "-1000px",
        top: "-1000px",
      },
      breakdownPositionStyle: {
        left: "-1000px",
        top: "-1000px",
      },
      runningSpeed: "0km/h",
      currentTimeText: "",
      currentSentimentList: [],
    };
  },
  computed: {
    runningInfo() {
      return this.transportInfo.running;
    },
    accidentInfo() {
      return this.transportInfo.accident;
    },
    breakdownInfo() {
      return this.transportInfo.breakdown;
    },
    plateNumber() {
      return this.transportInfo.plateNumber;
    },
    // sentimentList() {
    //   return this.accidentInfo.sentimentList.toSorted(
    //     (sentiment1, sentiment2) => sentiment2.timestamp - sentiment1.timestamp
    //   );
    // },
  },
  methods: {
    // removeBreakdownEntity() {
    //   const entity = viewer.entities.getById("breakdown_model");
    //   if (entity) {
    //    viewer.entities.remove(entity);
    //   }
    // },
    async initComp() {
      await this.initScene();
    },

    // async initScene() {
    //   const dataSource = await this.createDataSource();
    //   const runningPathEntity = this.createRunningPathEntity();
    //   // 获取最后时刻，车辆的朝向
    //   const orientation = runningPathEntity.orientation.getValue(
    //     Cesium.JulianDate.fromDate(new Date(this.runningInfo.interval[1]))
    //   );
    //   const accidentEntity = this.createAccidentEntity(orientation);
    //   const accidentScopeEntity = this.createAccidentScopeEntity();
    //
    //   const breakdownEntity = this.createBreakdownEntity(orientation);
    //
    //   dataSource.entities.add(runningPathEntity);
    //   dataSource.entities.add(accidentEntity);
    //   dataSource.entities.add(accidentScopeEntity);
    //   dataSource.entities.add(breakdownEntity);
    //
    //   this.addRenderListener();
    // },
    async initScene() {
      this.dataSource = await this.createDataSource();
      this.runningPathEntity = this.createRunningPathEntity();
      const orientation = this.runningPathEntity.orientation.getValue(
          Cesium.JulianDate.fromDate(new Date(this.runningInfo.interval[1]))
      );
      this.accidentEntity = this.createAccidentEntity(orientation);
      this.accidentScopeEntity = this.createAccidentScopeEntity();
      this.breakdownEntity = this.createBreakdownEntity(orientation);

      this.dataSource.entities.add(this.runningPathEntity);
      this.dataSource.entities.add(this.accidentEntity);
      this.dataSource.entities.add(this.accidentScopeEntity);
      this.dataSource.entities.add(this.breakdownEntity);

      this.addRenderListener();
    },

    async createDataSource() {
      const viewer = window.myEarth.viewer;
      const dataSource = await viewer.dataSources.add(
        new Cesium.CustomDataSource(this.transportInfo.id)
      );
      return dataSource;
    },

    createRunningPathEntity() {
      const { interval, positions } = this.runningInfo;
      const positionProperty = new Cesium.SampledPositionProperty();
      positionProperty.setInterpolationOptions({
        interpolationDegree: 10,
        interpolationAlgorithm: Cesium.LinearApproximation,
      });

      positions.forEach(({ timestamp, position }) => {
        positionProperty.addSample(
          Cesium.JulianDate.fromDate(
            new Date(timestamp),
            new Cesium.JulianDate()
          ),
          Cesium.Cartesian3.fromDegrees(...position)
        );
      });

      const pathEntity = new Cesium.Entity({
        id: "running_path",
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: new Cesium.JulianDate.fromDate(new Date(interval[0])),
            stop: new Cesium.JulianDate.fromDate(new Date(interval[1])),
          }),
        ]),
        position: positionProperty,
        model: {
          uri: this.$StaticResourceAddress + this.transportInfo.model,
        },
        orientation: new Cesium.VelocityOrientationProperty(positionProperty),
        // path: {
        //   resolution: 1,
        //   material: Cesium.Color.fromCssColorString("rgb(33, 194, 237)"),
        //   width: 5,
        //   // leadTime: 0,
        // },
        // viewFrom: new Cesium.Cartesian3(1000, 1000, 1000),
      });
      return pathEntity;
    },

    createAccidentEntity(orientation) {
      const { interval, position } = this.accidentInfo;
      const modelEntity = new Cesium.Entity({
        id: "accident_model",
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: new Cesium.JulianDate.fromDate(new Date(interval[0])),
            stop: new Cesium.JulianDate.fromDate(new Date(interval[1])),
          }),
        ]),
        position: Cesium.Cartesian3.fromDegrees(...position),
        orientation,
        model: {
          uri: this.$StaticResourceAddress + this.transportInfo.model,
        },
        ellipse: {
          semiMinorAxis: 50,
          semiMajorAxis: 50,
          material: Cesium.Color.RED.withAlpha(0.2),
          outline: true,
          outlineColor: Cesium.Color.RED,
        },
      });
      this.addFireEffect(modelEntity);
      return modelEntity;
    },

    createAccidentScopeEntity() {
      const { interval, position } = this.accidentInfo;
      const scopeEntity = new Cesium.Entity({
        id: "accident_scope",
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: new Cesium.JulianDate.fromDate(new Date(interval[0])),
            stop: new Cesium.JulianDate.fromDate(new Date(interval[1])),
          }),
        ]),
        position: Cesium.Cartesian3.fromDegrees(...position),
        ellipse: {
          semiMinorAxis: new Cesium.CallbackProperty(() => {
            return scopeEntity.warningRadius;
          }, false),
          semiMajorAxis: new Cesium.CallbackProperty(() => {
            return scopeEntity.warningRadius;
          }, false),
          material: Cesium.Color.RED.withAlpha(0.3),
        },
      });
      scopeEntity.warningRadius = 50;
      return scopeEntity;
    },

    createBreakdownEntity(orientation) {
      const { interval, position } = this.breakdownInfo;
      const modelEntity = new Cesium.Entity({
        id: "breakdown_model",
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: new Cesium.JulianDate.fromDate(new Date(interval[0])),
            stop: new Cesium.JulianDate.fromDate(new Date(interval[1])),
          }),
        ]),
        position: Cesium.Cartesian3.fromDegrees(...position),
        orientation,
        model: {
          uri: this.$StaticResourceAddress + this.transportInfo.model,
        },
        ellipse: {
          semiMinorAxis: 50,
          semiMajorAxis: 50,
          material: Cesium.Color.GREEN.withAlpha(0.3),
        },
      });
      return modelEntity;
    },

    addRenderListener() {
      this.renderListenerCallback = this.renderListener.bind(this);
      window.myEarth.viewer.scene.postRender.addEventListener(this.renderListenerCallback);
    },
    // addRenderListener() {
    //   window.myEarth.viewer.scene.postRender.addEventListener(
    //     this.renderListener
    //   );
    // },

    removeRenderListener() {
      if (window.myEarth && window.myEarth.viewer && this.renderListenerCallback) {
        window.myEarth.viewer.scene.postRender.removeEventListener(this.renderListenerCallback);
      }
    },

    renderListener() {
      try {
        this.updateTimeText();
        this.updateRunningSpeed();
        this.updateStatus();
        this.updateRunningPosition();
        this.updateAccidentPosition();
        this.updateBreakdownPosition();
        // this.updateCurrentSentimentList();
      } catch (error) {
        console.error(error);
      }
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
        currentTimestamp > this.runningInfo.interval[0] &&
        currentTimestamp <= this.runningInfo.interval[1]
      ) {
        this.status = "running";
      } else if (
        currentTimestamp > this.accidentInfo.interval[0] &&
        currentTimestamp <= this.accidentInfo.interval[1]
      ) {
        this.status = "accident";
      } else if (
        currentTimestamp > this.breakdownInfo.interval[0] &&
        currentTimestamp <= this.breakdownInfo.interval[1]
      ) {
        this.status = "breakdown";
      } else {
        this.status = "none";
      }
    },

    updateRunningSpeed() {
      const viewer = window.myEarth.viewer;
      const dataSource = viewer.dataSources.getByName(this.transportInfo.id)[0];
      const runningPathEntity = dataSource.entities.getById("running_path");
      const interval = 1;
      const start = runningPathEntity.position.getValue(
        window.myEarth.viewer.clock.currentTime
      );
      const end = runningPathEntity.position.getValue(
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
        this.runningSpeed = `${((distance / interval) * 3.6).toFixed(1)}km/h`;
      }
    },

    updateRunningPosition() {
      const viewer = window.myEarth.viewer;
      const dataSource = viewer.dataSources.getByName(this.transportInfo.id)[0];
      const runningPathEntity = dataSource.entities.getById("running_path");
      const cartesian3Position = runningPathEntity.position.getValue(
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
          this.runningPositionStyle.left = position.x + "px";
          this.runningPositionStyle.top = position.y + "px";
        } else {
          this.runningPositionStyle.left = "-1000px";
          this.runningPositionStyle.top = "-1000px";
        }
      }
    },

    updateAccidentPosition() {
      const viewer = window.myEarth.viewer;
      const dataSource = viewer.dataSources.getByName(this.transportInfo.id)[0];
      const accidentEntity = dataSource.entities.getById("accident_model");
      const cartesian3Position = accidentEntity.position._value;
      // 设置事故车辆屏幕坐标
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
          this.accidentPositionStyle.left = position.x + "px";
          this.accidentPositionStyle.top = position.y + "px";
        } else {
          this.accidentPositionStyle.left = "-1000px";
          this.accidentPositionStyle.top = "-1000px";
        }
      }
    },

    updateBreakdownPosition() {
      const viewer = window.myEarth.viewer;
      const dataSource = viewer.dataSources.getByName(this.transportInfo.id)[0];
      const breakdownEntity = dataSource.entities.getById("breakdown_model");
      const cartesian3Position = breakdownEntity.position._value;
      // 设置事故车辆屏幕坐标
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
          this.breakdownPositionStyle.left = position.x + "px";
          this.breakdownPositionStyle.top = position.y + "px";
        } else {
          this.breakdownPositionStyle.left = "-1000px";
          this.breakdownPositionStyle.top = "-1000px";
        }
      }
    },

    updateCurrentSentimentList() {
      if (this.status === "accident") {
        // 当前时间戳
        const currentTimeStamp = Cesium.JulianDate.toDate(
          window.myEarth.viewer.clock.currentTime
        ).getTime();
        // 清空当前的舆情列表
        this.currentSentimentList.splice(0, this.currentSentimentList.length);
        // 根据当前时间找到合适的舆情列表
        const currentSentimentList = this.sentimentList.find(
          (sentiment) => sentiment.timestamp <= currentTimeStamp
        ).values;

        currentSentimentList.forEach((value) => {
          const sentiment = _.clone(value);
          sentiment.screenCartesian2Position = {
            x: "-1000px",
            y: "-1000px",
          };
          const cartographic = Cesium.Cartographic.fromDegrees(
            sentiment.lon,
            sentiment.lat,
            0
          );
          const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            window.myEarth.viewer.scene,
            Cesium.Cartesian3.fromRadians(
              cartographic.longitude,
              cartographic.latitude,
              cartographic.height
            )
          );

          if (position) {
            sentiment.screenCartesian2Position.x = position.x + "px";
            sentiment.screenCartesian2Position.y = position.y + "px";
          }
          this.currentSentimentList.push(sentiment);
        });

        // this.currentSentimentList.push(...currentSentimentList);
      }

      // const currentSentimentsInfo = sentimentList
      //   .toSort(
      //     (sentiment1, sentiment2) =>
      //       sentiment2.timestamp - sentiment1.timestamp
      //   )

      // console.log(currentSentimentsInfo.values[0].info.text);
      // if (this.status === "accident" && currentSentimentsInfo) {
      //   currentSentimentsInfo.values.forEach((value) => {
      //     const sentiment = _.clone(value);
      //     sentiment.screenCartesian2Position = {
      //       x: "-1000px",
      //       y: "-1000px",
      //     };
      //     const cartographic = Cesium.Cartographic.fromDegrees(
      //       sentiment.lon,
      //       sentiment.lat,
      //       5
      //     );
      //     const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      //       window.myEarth.viewer.scene,
      //       Cesium.Cartesian3.fromRadians(
      //         cartographic.longitude,
      //         cartographic.latitude,
      //         cartographic.height
      //       )
      //     );

      //     if (position) {
      //       sentiment.screenCartesian2Position.x = position.x + "px";
      //       sentiment.screenCartesian2Position.y = position.y + "px";
      //     }
      //     this.publicSentimentList.push(sentiment);
      //   });

      // }
    },

    changeToRunningStatus() {
      this.$nextTick(() => {
        this._fireEffect.particleSystem.show = false;
      });
    },

    changeToAccidentStatus() {
      this.$nextTick(() => {
        const viewer = window.myEarth.viewer;
        const dataSource = viewer.dataSources.getByName(
          this.transportInfo.id
        )[0];
        const accidentEntity = dataSource.entities.getById("accident_scope");
        // const accidentIconElement = this.$refs.accidentIcon;
        // const accidentContentElement = this.$refs.accidentContent;
        // const accidentLinePanelElement = this.$refs.accidentLinePanel;
        this._fireEffect.particleSystem.show = true;
        const tl = gsap.timeline({ delay: 1 });
        tl.fromTo(
          accidentEntity,
          { warningRadius: 0 },
          { warningRadius: 50, duration: 4, repeat: -1 }
        );
        // tl.from(accidentLinePanelElement, { height: 0, duration: 0.5 }, "<");
        // tl.fromTo(
        //   accidentIconElement,
        //   { scale: 3, opacity: 0 },
        //   { scale: 1, opacity: 1 }
        // );
        // tl.fromTo(accidentContentElement, { scaleX: 0 }, { scaleX: 1 });
      });
    },

    changeToBreakdownStatus() {
      this.$nextTick(() => {
        this._fireEffect.particleSystem.show = false;
      });
    },

    changeToNoneStatus() {
      this.$nextTick(() => {
        this._fireEffect.particleSystem.show = false;
      });
    },

    addFireEffect(entity) {
      const { position } = this.accidentInfo;
      this._fireEffect = new FireEffect(
        window.myEarth.viewer,
        Cesium.Cartesian3.fromDegrees(...[position[0], position[1], 1]),
        { endScale: 0.5, maximumParticleLife: 10, particleSize: 10 }
      );
      this._fireEffect.entity = entity;
      this._fireEffect.init();
      this._fireEffect.particleSystem.show = false;
    },

    removeFireEffect() {
      this._fireEffect.remove();
    },

    destroyComp() {
      const viewer = window.myEarth.viewer;
      viewer.dataSources.remove(
        viewer.dataSources.getByName(this.transportInfo.id)[0],
        true
      );
      this.removeFireEffect();
      this.status = "running";
      this.runningPositionStyle = {
        left: "-1000px",
        top: "-1000px",
      };
      this.accidentPositionStyle = {
        left: "-1000px",
        top: "-1000px",
      };
      this.breakdownPositionStyle = {
        left: "-1000px",
        top: "-1000px",
      };
      this.runningSpeed = "0km/h";
      this.currentTimeText = "";

    },

    removeEntities() {
      if (this.dataSource) {
        if (this.runningPathEntity) {
          this.dataSource.entities.remove(this.runningPathEntity);
        }
        if (this.accidentEntity) {
          this.dataSource.entities.remove(this.accidentEntity);
        }
        if (this.accidentScopeEntity) {
          this.dataSource.entities.remove(this.accidentScopeEntity);
        }
        if (this.breakdownEntity) {
          this.dataSource.entities.remove(this.breakdownEntity);
        }
        this.dataSource = null;
      }
    },
  },
  beforeDestroy() {
    this.removeEntities();
    this.removeRenderListener();
    this.destroyComp();
    // this.destroyCesium();
  },

  watch: {
    status(newValue) {
      if (newValue === "running") {
        this.changeToRunningStatus();
      } else if (newValue === "accident") {
        this.changeToAccidentStatus();
      } else if (newValue === "breakdown") {
        this.changeToBreakdownStatus();
      } else {
        this.changeToNoneStatus();
      }
    },
  },

  mounted() {
    this.initComp();
  },
  destroy() {
    this.destroyComp();
  },
};
</script>

<style lang="less" scoped>
.transport_container {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;

  .transport_running_container {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    .transport_running_info_container {
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

  .transport_accident_container {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    .accident_poi_container {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 60px;
      aspect-ratio: 2;
      transform: translateX(-50%) translateY(-100%);

      .content_container {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        background: rgb(245, 108, 108);
        border-radius: 50%;
        border: 5px double white;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 5px;
        box-shadow: 0 0 10px 5px rgba(245, 108, 108, 0.9);
        animation: danger_pulse 1s infinite;

        @keyframes danger_pulse {
          0% {
            box-shadow: 0 0 10px 5px rgba(242, 69, 69, 0.9);
          }
          50% {
            box-shadow: 0 0 20px 10px rgba(242, 69, 69, 0.4);
          }
          100% {
            box-shadow: 0 0 10px 5px rgba(242, 69, 69, 0.9);
          }
        }

        i {
          font-size: 30px;
          color: white;
          font-weight: 1000;
        }

        .accident_content {
          position: absolute;
          width: 70px;
          height: 50px;
          top: 50%;
          transform: translateY(-50%);
          left: calc(100% + 10px);
          font-size: 16px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          color: white;
          text-shadow: 0 0 10px rgba(245, 108, 108, 0.9),
            0 0 20px rgba(245, 108, 108, 0.9), 0 0 30px rgba(245, 108, 108, 0.9);

          transform-origin: left;
        }
      }

      .foot_container {
        width: 100%;
        aspect-ratio: 1;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;
        .line_panel {
          width: 3px;
          height: 100%;
          background: white;
        }
      }
    }
  }

  .transport_breakdown_container {
    .breakdown_poi_container {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 60px;
      aspect-ratio: 2;
      transform: translateX(-50%) translateY(-100%);

      .content_container {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        background: rgb(103, 194, 58);
        border-radius: 50%;
        border: 5px double white;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 5px;
        box-shadow: 0 0 10px 5px rgba(103, 194, 58, 0.9);
        animation: safe_pulse 1s infinite;

        @keyframes safe_pulse {
          0% {
            box-shadow: 0 0 10px 5px rgba(103, 194, 58, 0.9);
          }
          50% {
            box-shadow: 0 0 20px 10px rgba(103, 194, 58, 0.4);
          }
          100% {
            box-shadow: 0 0 10px 5px rgba(103, 194, 58, 0.9);
          }
        }

        i {
          font-size: 30px;
          color: white;
          font-weight: 1000;
        }

        .breakdown_content {
          position: absolute;
          width: 70px;
          height: 50px;
          top: 50%;
          transform: translateY(-50%);
          left: calc(100% + 10px);
          font-size: 16px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          color: white;
          text-shadow: 0 0 10px rgba(103, 194, 58, 0.9),
            0 0 20px rgba(103, 194, 58, 0.9), 0 0 30px rgba(103, 194, 58, 0.9);

          transform-origin: left;
        }
      }

      .foot_container {
        width: 100%;
        aspect-ratio: 1;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;
        .line_panel {
          width: 3px;
          height: 100%;
          background: white;
        }
      }
    }
  }
}
</style>
