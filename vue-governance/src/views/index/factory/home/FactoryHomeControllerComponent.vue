<template>
  <div class="factory_home_container">
    <div class="material_container"></div>
    <area-poi-component
      v-for="area of areaList"
      :key="area.id"
      :areaName="area.name"
      :positionArray="area._screenCenterPosition"
      :mouseenterHandle="area.handleMouseenter"
      :mouseleaveHandle="area.handleMouseleave"
    ></area-poi-component>
    <public-sentiment-poi-component
      v-for="publicSentiment of publicSentimentCollection.values"
      :show="publicSentiment.poiShow"
      :key="publicSentiment.id"
      :position="publicSentiment.screenCartesian2Position"
      :info="publicSentiment.info"
      style="z-index: 1;"
    ></public-sentiment-poi-component>
    <accident-poi-component
      v-if="accident"
      style="z-index: 2;"
      :position="accident.screenCartesian2Position"
    ></accident-poi-component>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import * as turf from "@turf/turf";
import _ from "lodash";
import { v1 } from "uuid";
import AreaPoiComponent from "./components/AreaPoiComponent.vue";
import PublicSentimentPoiComponent from "./components/PublicSentimentPoiComponent.vue";
import AccidentPoiComponent from "./components/AccidentPoiComponent.vue";
import ThreeJsMaterial from "@/assets/js/threejs/ThreeJsMaterial";
import PublicSentimentServer from "@/views/index/factory/home/server/PublicSentimentServer";

class CesiumArea {
  constructor(viewer, name, radianPositionArray) {
    this.id = v1();
    this._viewer = viewer;
    this.name = name;
    this.cartesianPositionList = Cesium.Cartesian3.fromRadiansArray(
      radianPositionArray
    );
    const [
      centerPosition,
      screenCenterPosition,
      trackPinId,
      unBindTrackFun,
    ] = this.getScreenCenterPosition(radianPositionArray);
    this.centerPosition = centerPosition;
    this._screenCenterPosition = screenCenterPosition;
    this._trackPinId = trackPinId;
    this._unBindTrackFun = unBindTrackFun;
    this._entity = undefined;
    this._selected = false;

    this._minWallHeight = 0;
    this._maxWallHeight = 40;
    this._wallHeight = this._minWallHeight;

    this.materialRgbColor = [255, 255, 0];
    this.createEntity();
  }

  add() {
    this._viewer.entities.add(this._entity);
  }

  remove() {
    this._viewer.entities.remove(this._entity);
  }

  isSameEntity(entity) {
    return this._entity.id === entity.id;
  }

  createEntity() {
    const loopCartesianPositionList = _.clone(this.cartesianPositionList);
    loopCartesianPositionList.push(loopCartesianPositionList[0]);
    this._entity = new Cesium.Entity({
      // polygon: {
      //   hierarchy: loopCartesianPositionList,
      //   height: 0,
      //   show: new Cesium.CallbackProperty(() => this._selected, false),
      //   material: Cesium.Color.fromCssColorString(
      //     `rgba(${this.materialRgbColor[0]},${this.materialRgbColor[1]},${this.materialRgbColor[2]},0.5)`
      //   ),
      // },
      polyline: {
        positions: loopCartesianPositionList,
        width: 2.0,
        material: Cesium.Color.fromCssColorString(
          `rgba(${this.materialRgbColor[0]},${this.materialRgbColor[1]},${this.materialRgbColor[2]},0.7)`
        ),
        clampToGround: true,
        show: new Cesium.CallbackProperty(() => {
          return this._selected;
        }, false),
      },
      wall: {
        positions: loopCartesianPositionList,
        minimumHeights: new Array(loopCartesianPositionList.length).fill(
          this._minWallHeight
        ),
        maximumHeights: new Array(loopCartesianPositionList.length).fill(
          this._maxWallHeight
        ),
        material: new Cesium.ImageMaterialProperty({
          image: new Cesium.CallbackProperty(() => {
            return this.getCurrentCanvasMaterial(
              window.myEarth.viewer.clock.currentTime.secondsOfDay
            );
          }, false),
          transparent: true,
        }),
        show: new Cesium.CallbackProperty(() => {
          return this._selected;
        }, false),
      },
    });
  }

  getScreenCenterPosition(radianPositionArray) {
    // 分组坐标并让其闭环
    const loopRadianPositionArray = _.chunk(radianPositionArray, 2);
    loopRadianPositionArray.push([
      radianPositionArray[0],
      radianPositionArray[1],
    ]);
    const centerPosition = turf.centerOfMass(
      turf.polygon([loopRadianPositionArray])
    ).geometry.coordinates;

    const screenCenterPosition = [];
    const {
      pinId: trackPinId,
      unBindFun: unBindTrackFun,
    } = window.myEarth.trackPosition(
      [...centerPosition, 20],
      screenCenterPosition
    );

    return [centerPosition, screenCenterPosition, trackPinId, unBindTrackFun];
  }

  handleMouseenter = () => {
    if (!this._selected) {
      this._selected = true;
    }
  };

  handleMouseleave = () => {
    if (this._selected) {
      this._selected = false;
    }
  };

  getCurrentCanvasMaterial(time) {
    const canvas = document.createElement("canvas");
    // const canvas = document.querySelector(".test_canvas");
    const height = canvas.height;
    const width = canvas.width;

    const maxTransparent = 1;

    const stayTimeRatio = 0.7;

    const ctx = canvas.getContext("2d");
    const speedFactor = 2;
    const rectOffset = height - ((time % speedFactor) / speedFactor) * height;

    // 绘制自下而上的矩形
    const moveGnt = ctx.createLinearGradient(0, 0, 0, height);
    moveGnt.addColorStop(
      0,
      `rgba(${this.materialRgbColor[0]},${this.materialRgbColor[1]},${this.materialRgbColor[2]},${maxTransparent})`
    );
    moveGnt.addColorStop(
      1,
      `rgba(${this.materialRgbColor[0]},${this.materialRgbColor[1]},${this.materialRgbColor[2]},0)`
    );
    ctx.fillStyle = moveGnt;
    ctx.fillRect(0, rectOffset, width, height);

    // 绘制弥留之际的矩形
    const currentRatio = rectOffset / height;
    if (currentRatio >= stayTimeRatio) {
      const dyingGnt = ctx.createLinearGradient(0, 0, 0, height);
      dyingGnt.addColorStop(
        0,
        `rgba(${this.materialRgbColor[0]},${this.materialRgbColor[1]},${
          this.materialRgbColor[2]
        },${
          (currentRatio - stayTimeRatio) *
          (maxTransparent / (1 - stayTimeRatio))
        })`
      );

      dyingGnt.addColorStop(
        1,
        `rgba(${this.materialRgbColor[0]},${this.materialRgbColor[1]},${this.materialRgbColor[2]},0)`
      );
      ctx.fillStyle = dyingGnt;
      ctx.fillRect(0, 0, width, height);
    }
    return canvas;
  }
}

class PublicSentiment {
  constructor(viewer, { id, lon, lat, info }) {
    this.id = `public_sentiment_${id}`;
    this._viewer = viewer;
    this.lon = lon;
    this.lat = lat;
    this.info = info;
    this.cartesian3Position = Cesium.Cartesian3.fromDegrees(lon, lat);
    this.screenCartesian2Position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      this._viewer.scene,
      this.cartesian3Position
    );
    this.listenerRemoveCallBack = () => {};
    this.poiShow = false;
  }

  add() {
    this.listenerRemoveCallBack = this._viewer.camera.changed.addEventListener(
      () => {
        this.screenCartesian2Position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          this._viewer.scene,
          this.cartesian3Position
        );
      }
    );
  }

  remove() {
    this.listenerRemoveCallBack();
  }
}

class PublicSentimentArcLine {
  constructor(
    viewer,
    cartesian3StartPoint,
    cartesian3EndPoint,
    publicSentimentId
  ) {
    this.id = v1();
    this._viewer = viewer;
    this.cartesian3StartPoint = cartesian3StartPoint;
    this.cartesian3EndPoint = cartesian3EndPoint;
    this.publicSentimentId = publicSentimentId;
    this._material = undefined;
    this._entity = undefined;
    this.initMaterial();
    this.initEntity();
  }

  initMaterial() {
    const threeJsMaterial = ThreeJsMaterial.getFlowMaterial({
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      activeColor: "rgba(33, 194, 237,0.8)",
      duration: 2,
    });
    this._material = threeJsMaterial.cesiumMaterial;
  }

  initEntity() {
    const radianStartPoint = this._viewer.scene.globe.ellipsoid.cartesianToCartographic(
      this.cartesian3StartPoint
    );
    const radianEndPoint = this._viewer.scene.globe.ellipsoid.cartesianToCartographic(
      this.cartesian3EndPoint
    );
    const degreeStartPoint = {
      lon: (radianStartPoint.longitude * 180) / Math.PI,
      lat: (radianStartPoint.latitude * 180) / Math.PI,
      height: radianStartPoint.height,
    };

    const degreeEndPoint = {
      lon: (radianEndPoint.longitude * 180) / Math.PI,
      lat: (radianEndPoint.latitude * 180) / Math.PI,
      height: radianEndPoint.height,
    };

    const degreePointList = getArcLineDegreePointList({
      height: 100,
      num: 100,
      startPoint: degreeStartPoint,
      endPoint: degreeEndPoint,
    });

    this._entity = new Cesium.Entity({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(
          degreePointList.flatMap((degreePoint) => [
            degreePoint.lon,
            degreePoint.lat,
            degreePoint.height,
          ])
        ),
        width: 3,
        material: this._material,
      },
    });

    function getArcLineDegreePointList(options) {
      // 方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
      const h = options.height && options.height > 50 ? options.height : 50;
      const L =
        Math.abs(options.startPoint.lon - options.endPoint.lon) >
        Math.abs(options.startPoint.lat - options.endPoint.lat)
          ? Math.abs(options.startPoint.lon - options.endPoint.lon)
          : Math.abs(options.startPoint.lat - options.endPoint.lat);
      const num = options.num && options.num > 50 ? options.num : 50;
      const result = [];
      let dlt = L / num;
      if (
        Math.abs(options.startPoint.lon - options.endPoint.lon) >
        Math.abs(options.startPoint.lat - options.endPoint.lat)
      ) {
        //以 lon 为基准
        const dellat = (options.endPoint.lat - options.startPoint.lat) / num;
        if (options.startPoint.lon - options.endPoint.lon > 0) {
          dlt = -dlt;
        }
        for (let i = 0; i < num; i++) {
          const tempH =
            h -
            (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * h) /
              Math.pow(L, 2);
          const lon = options.startPoint.lon + dlt * i;
          const lat = options.startPoint.lat + dellat * i;
          result.push({ lon, lat, height: tempH });
        }
      } else {
        //以 lat 为基准
        let dellon = (options.endPoint.lon - options.startPoint.lon) / num;
        if (options.startPoint.lat - options.endPoint.lat > 0) {
          dlt = -dlt;
        }
        for (let i = 0; i < num; i++) {
          const tempH =
            h -
            (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * h) /
              Math.pow(L, 2);
          const lon = options.startPoint.lon + dellon * i;
          const lat = options.startPoint.lat + dlt * i;
          result.push({ lon, lat, height: tempH });
        }
      }
      // 落地
      result.push({
        lon: options.endPoint.lon,
        lat: options.endPoint.lat,
        height: options.endPoint.height,
      });
      return result;
    }
  }

  async addToViewer(duration = 500) {
    const completePositionList = this._entity.polyline.positions._value;
    const showPositionList = [];
    const interval = 50;
    const loopTimes = Math.ceil(duration / interval);
    const eachAddNumber = Math.floor(completePositionList.length / loopTimes);
    let loopIndex = 0;
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (showPositionList.length >= completePositionList.length) {
          clearInterval(timer);
          resolve();
        }
        showPositionList.push(
          ...completePositionList.slice(
            loopIndex * eachAddNumber,
            (loopIndex + 1) * eachAddNumber
          )
        );
        loopIndex++;
      }, interval);
      this._entity.polyline.positions = new Cesium.CallbackProperty(
        () => showPositionList
      );

      this._viewer.entities.add(this._entity);
    });
  }

  removeFromViewer() {
    this._viewer.entities.remove(this._entity);
  }
}

class PublicSentimentCollection {
  constructor(viewer, centerDegreePositionArray) {
    this._viewer = viewer;
    this.values = [];
    this.centerCartesian3Position = Cesium.Cartesian3.fromDegrees(
      ...centerDegreePositionArray
    );
    this.publicSentimentArcLineList = [];
  }

  addToViewer() {
    this.values.forEach((publicSentiment) => publicSentiment.add());
    this.publicSentimentArcLineList.forEach((publicSentimentArcLine) => {
      publicSentimentArcLine.addToViewer();
    });
  }

  removeFromViewer() {
    this.values.forEach((publicSentiment) => publicSentiment.remove());
    this.publicSentimentArcLineList.forEach((publicSentimentArcLine) =>
      publicSentimentArcLine.removeFromViewer()
    );
  }

  async add(publicSentimentInfo) {
    const publicSentiment = new PublicSentiment(
      this._viewer,
      publicSentimentInfo
    );
    publicSentiment.add();
    this.values.push(publicSentiment);
    const publicSentimentArcLine = new PublicSentimentArcLine(
      this._viewer,
      this.centerCartesian3Position,
      publicSentiment.cartesian3Position,
      publicSentiment.id
    );
    this.publicSentimentArcLineList.push(publicSentimentArcLine);
    await publicSentimentArcLine.addToViewer();
    publicSentiment.poiShow = true;
  }

  remove(publicSentimentId) {
    const publicSentiment = this.values.find(
      (publicSentiment) => publicSentiment.id === publicSentimentId
    );
    const publicSentimentArcLine = this.publicSentimentArcLineList.find(
      (publicSentimentArcLine) =>
        publicSentimentArcLine.publicSentimentId == publicSentimentId
    );

    publicSentiment.poiShow = false;
    publicSentimentArcLine.removeFromViewer();

    setTimeout(() => {
      publicSentiment.remove();
      this.values.splice(
        this.values.findIndex(
          (publicSentiment) => publicSentiment.id === publicSentimentId
        ),
        1
      );
      this.publicSentimentArcLineList.splice(
        this.publicSentimentArcLineList.findIndex(
          (publicSentimentArcLine) =>
            publicSentimentArcLine.publicSentimentId === publicSentimentId
        ),
        1
      );
    }, 600);
  }

  async update(publicSentimentInfoList) {
    const preAddPublicSentimentInfoList = publicSentimentInfoList.filter(
      (info) => {
        return (
          this.values.findIndex(
            (publicSentiment) =>
              publicSentiment.id === `public_sentiment_${info.id}`
          ) === -1
        );
      }
    );

    const preRemovePublicSentimentList = this.values.filter(
      (publicSentiment) => {
        return (
          publicSentimentInfoList.findIndex(
            (info) => publicSentiment.id === `public_sentiment_${info.id}`
          ) === -1
        );
      }
    );

    for (const publicSentiment of preRemovePublicSentimentList) {
      this.remove(publicSentiment.id);
    }

    for (const publicSentimentInfo of preAddPublicSentimentInfoList) {
      this.add(publicSentimentInfo);
    }
  }
}

class Accident {
  constructor(viewer, lon, lat, radius = 30) {
    this.id = v1();
    this._viewer = viewer;
    this.lon = lon;
    this.lat = lat;
    this.radius = radius;
    this.cartesian3Position = Cesium.Cartesian3.fromDegrees(lon, lat);
    this.screenCartesian2Position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      this._viewer.scene,
      this.cartesian3Position
    );
    this.listenerRemoveCallBack = () => {};
    this._circleEntity = undefined;
    this.initEntity();
  }

  initEntity() {
    this._circleEntity = new Cesium.Entity({
      position: this.cartesian3Position,
      ellipse: {
        // 半短轴（画圆：半短轴和半长轴一致即可）
        semiMinorAxis: this.radius,
        // 半长轴
        semiMajorAxis: this.radius,
        // 填充色
        material: Cesium.Color.RED.withAlpha(0.5),
        // 是否有边框
        outline: true,
        // 边框颜色
        outlineColor: Cesium.Color.WHITE,
        // 边框宽度
        outlineWidth: 4,
      },
    });
  }

  add() {
    this.listenerRemoveCallBack = this._viewer.camera.changed.addEventListener(
      () => {
        this.screenCartesian2Position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          this._viewer.scene,
          this.cartesian3Position
        );
      }
    );
    this._viewer.entities.add(this._circleEntity);
  }

  remove() {
    this.listenerRemoveCallBack();
    this._viewer.entities.remove(this._circleEntity);
  }
}

export default {
  name: "FactoryHomeControllerComponent",
  components: {
    AreaPoiComponent,
    PublicSentimentPoiComponent,
    AccidentPoiComponent,
  },
  data() {
    return {
      areaInfoList: [
        {
          name: "山东省济南市历元学校",
          positions: [
            2.0447196754517862,
            0.6405488151087156,
            2.0447198234047876,
            0.6405166482807261,
            2.0447580583288443,
            0.6405165496868759,
            2.0447581514614646,
            0.640548420693166,
          ],
        },
        {
          name: "济炼体育馆",
          positions: [
            2.0446932591901934,
            0.640518820301016,
            2.044693156066491,
            0.6404922211855039,
            2.044713405108401,
            0.6404920319467273,
            2.0447136893392237,
            0.6405188974865947,
          ],
        },
        {
          name: "中国石油化工股份有限公司",
          positions: [
            2.0447226679108472,
            0.6405046044428809,
            2.044740020638187,
            0.6405044799433247,
            2.0447400603572223,
            0.6405082450857519,
            2.044755858021858,
            0.640507869193418,
            2.0447557094794915,
            0.6404850080505264,
            2.0447185973789255,
            0.6404855538236454,
            2.0447186661685173,
            0.6404908083113154,
            2.0447227770906076,
            0.6404907152645907,
          ],
        },
        {
          name: "东盛花园",
          positions: [
            2.0446637266401098,
            0.6404323159520732,
            2.044698998162996,
            0.6404324045325811,
            2.0446986853560034,
            0.6404373386923605,
            2.0446842977515693,
            0.6404376709533641,
            2.044683997387735,
            0.6404673197185937,
            2.0446678481819216,
            0.6404675616676495,
            2.044667397390023,
            0.6404808536546258,
            2.0446923302527997,
            0.6404811958854647,
            2.044692614905067,
            0.6405199461353857,
            2.044713452313931,
            0.6405197248684885,
            2.0447142937530085,
            0.6405535949025092,
            2.0447006379414288,
            0.6405534853844559,
            2.044660793404031,
            0.640510737861484,
            2.044660683312328,
            0.6404823909697163,
            2.044631915566046,
            0.6404817098685689,
            2.0446324672273364,
            0.6404586139880305,
            2.0446634036620077,
            0.6404580031391871,
          ],
        },
        {
          name: "东篱花园",
          positions: [
            2.0446513257280374,
            0.6406321155563475,
            2.0446973807620314,
            0.6406318180665819,
            2.044698885840353,
            0.6406036847349537,
            2.044711610650962,
            0.6405830924934833,
            2.0446615492643163,
            0.6405322074251085,
            2.044646916174983,
            0.6405422364491556,
            2.0446426440586043,
            0.6405997713438348,
            2.044654879213681,
            0.6406009259725078,
          ],
        },
        {
          name: "山东联友化工工程公司",
          positions: [
            2.044720125255272,
            0.6405729560285373,
            2.0447197324653006,
            0.6405507337212297,
            2.0447557931465434,
            0.6405504206133911,
            2.0447565872011295,
            0.6406078035477356,
            2.0447512380271053,
            0.6406078412041855,
          ],
        },
        {
          name: "加油站",
          positions: [
            2.0447155798086043,
            0.6405923956666498,
            2.044718764432394,
            0.6405886367838914,
            2.0447340470453574,
            0.6406036038637258,
            2.044729466865733,
            0.6406061007011803,
          ],
        },
        {
          name: "济南市义和小学",
          positions: [
            2.044626549927335,
            0.6404660347104718,
            2.044626858419078,
            0.6404512523216448,
            2.0446413526000677,
            0.6404509250595767,
            2.0446412490801418,
            0.6404557637018302,
            2.044642355000571,
            0.6404558127053815,
            2.0446424610080167,
            0.6404580061894132,
            2.0446328280054225,
            0.640458277202872,
            2.044632481799275,
            0.6404660212433302,
          ],
        },
      ],
      areaList: [],
      publicSentimentCollection: { getValue: () => [] },
      accident: undefined,
    };
  },

  methods: {
    ...mapMutations("menuAbout", ["setIfBottomMenuFold"]),
    ...mapMutations("regionAbout", ["setCurrentRegion"]),
    async initPage() {
      this.hindBottomMenu();
      await this.initPosition();
      this.initAreaList();
      this.addAreaList();
      this.beginAccidentStory();
    },

    async initPosition() {
      const targetPosition = [2.044715790240727, 0.6404916950536464, 0];
      const height = 2500;
      const angleOffset = [(0 * Math.PI) / 180, (-45 * Math.PI) / 180, 0];
      let duration = 0.5;

      if (this.$store.state.regionAbout.currentRegion.name !== "历下区") {
        duration = 0;
      }
      window.myEarth.flyToPosition(
        targetPosition,
        height,
        angleOffset,
        duration
      );
      this.setCurrentRegion({ name: "factory" });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, duration * 1000);
      });
    },

    hindBottomMenu() {
      this.setIfBottomMenuFold(true);
    },

    initAreaList() {
      this.areaList = this.areaInfoList.map((areaInfo) => {
        const area = new CesiumArea(
          window.myEarth.viewer,
          areaInfo.name,
          areaInfo.positions
        );
        return area;
      });
    },

    addAreaList() {
      this.areaList.forEach((area) => area.add());
    },

    removeAreaList() {
      this.areaList.forEach((area) => {
        area.remove();
      });
    },

    removePublicSentimentCollection() {
      this.publicSentimentCollection?.removeFromViewer();
    },

    removeAccident() {
      this.accident?.remove();
    },

    beginAccidentStory() {
      this.publicSentimentCollection = new PublicSentimentCollection(
        window.myEarth.viewer,
        [117.153734, 36.7025275, 15]
      );
      this.publicSentimentCollection.addToViewer();
      setTimeout(() => {
        this.addAccident();
      }, 1000);

      setTimeout(() => {
        this.startPublicSentiment();
      }, 4000);
    },

    addAccident() {
      this.accident = new Accident(
        window.myEarth.viewer,
        117.153734,
        36.7025275
      );
      this.accident.add();
    },

    startPublicSentiment() {
      const publicSentimentServer = new PublicSentimentServer();
      const update = () => {
        const newPublicSentimentInfoList = publicSentimentServer.getShowPublicSentimentList();
        this.publicSentimentCollection.update(newPublicSentimentInfoList);
      };
      update();
      this._storyTimer = setInterval(() => {
        update();
      }, 5000);
    },
  },

  mounted() {
    this.initPage();
  },

  beforeDestroy() {
    this.removeAreaList();
    this.removePublicSentimentCollection();
    this.removeAccident();
    this._storyTimer & clearInterval(this._storyTimer);
  },
};
</script>

<style lang="less" scoped>
.factory_home_container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  user-select: none;
  // background: pink;

  .road_card {
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    padding: 5px;
    color: white;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    font-size: 18px;
    font-weight: 700;
    transform: translateX(10px) translateY(-100%);
  }

  .test_canvas {
    position: absolute;
    left: 50px;
    top: 100px;
    // transform: rotate(180deg);
    background: rgb(23, 130, 160);
  }

  .material_container {
    position: absolute;
    left: 50px;
    top: 100px;
    z-index: 99;
    pointer-events: all;
  }
}
</style>
