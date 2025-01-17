<template>
  <div class="factory_home_container">
    <!-- <canvas class="test_canvas" width="500px" height="500px"></canvas> -->
    <!-- <div
      class="road_card"
      v-show="roadCardInfo.show"
      :style="{
        left: roadCardInfo.position.left,
        top: roadCardInfo.position.top,
      }"
    >
      <div class="card_content">
        {{ roadCardInfo.content }}
      </div>
    </div> -->
    <area-poi-component
      v-for="area of areaList"
      :key="area.id"
      :areaName="area.name"
      :positionArray="area._screenCenterPosition"
      :mouseenterHandle="area.handleMouseenter"
      :mouseleaveHandle="area.handleMouseleave"
    ></area-poi-component>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { gsap } from "gsap";
import * as turf from "@turf/turf";
import _ from "lodash";
import { v1 } from "uuid";
import AreaPoiComponent from "./components/AreaPoiComponent.vue";
import h337 from "heatmap.js";
import { random } from "gsap";

class CesiumArea {
  constructor(name, radianPositionArray) {
    this.id = v1();
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

  addTo(entities) {
    entities.add(this._entity);
  }

  removeFrom(entities) {
    entities.remove(this._entity);
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
  constructor(viewer, info) {
    this.pointList = info.pointList;
    this._viewer = viewer;
    this.heatMapCanvasContainer = undefined;
    this._heatMapEntity = undefined;
    this.init();
  }

  init() {
    this.initHeatMap();
  }

  initHeatMap() {
    const minLongitude = _.minBy(this.pointList, (point) => point.lon).lon;
    const maxLongitude = _.maxBy(this.pointList, (point) => point.lon).lon;
    const minLatitude = _.minBy(this.pointList, (point) => point.lat).lat;
    const maxLatitude = _.maxBy(this.pointList, (point) => point.lat).lat;
    const containerWidth = 600;
    const containerHeigh = 400;
    const radius = 150;
    const padding = radius;
    this.heatMapCanvasContainer = document.createElement("div");
    this.heatMapCanvasContainer.style.cssText = `
    position: absolute;
    width: ${containerWidth + 2 * padding}px;
    height: ${containerHeigh + 2 * padding}px;
    visibility: hidden;
    `;

    document.body.append(this.heatMapCanvasContainer);
    const canvasPoints = this.pointList.map((point) => ({
      // 将数据点经纬度等比例设置成矩形中的x y坐标 值为原始数据的值
      x: Math.floor(
        ((point.lat - minLatitude) / (maxLatitude - minLatitude)) *
          containerWidth +
          padding
      ),
      y: Math.floor(
        ((point.lon - minLongitude) / (maxLongitude - minLongitude)) *
          containerHeigh +
          padding
      ),
      value: Math.floor(point.effectFactor),
    }));

    const heatmapInstance = h337.create({
      container: this.heatMapCanvasContainer,
      gradient: {
        "0.00": "rgb(2, 77, 137)",
        "0.25": "rgb(33, 194, 237)",
        "0.5": "rgb(103,194,58)",
        "0.75": "rgb(230,162,60)",
        "1": "rgb(245,108,108)",
      },
      radius: radius,
    });

    // 新建热力图实例并传入设置好的数据
    heatmapInstance.setData({
      max: 100,
      data: canvasPoints,
    });

    this._heatMapEntity = new Cesium.Entity({
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(
          minLongitude,
          minLatitude,
          maxLongitude,
          maxLatitude
        ),
        material: new Cesium.ImageMaterialProperty({
          image: this.heatMapCanvasContainer.querySelector("canvas"),
          transparent: true,
        }),
      },
    });
  }

  add() {
    this._viewer.entities.add(this._heatMapEntity);
  }

  remove() {
    this._viewer.entities.remove(this._heatMapEntity);
    document.body.removeChild(this.heatMapCanvasContainer);
  }

  flyTo() {
    this._viewer.zoomTo(this._heatMapEntity);
  }
}


export default {
  name: "FactoryHomeControllerComponent",
  components: { AreaPoiComponent },
  data() {
    return {
      roadInfoList: [
        {
          name: "工业南路",
          positionArray: [
            [2.044772320708131, 0.6406877654508059, 0],
            [2.0447738603605115, 0.6406583936452214, 0],
            [2.0447635874196584, 0.6406298829971, 0],
            [2.044755248851863, 0.6406161622361117, 0],
            [2.044735409399834, 0.6405966996165962, 0],
            [2.0446980828074186, 0.6405592451625082, 0],
            [2.0446671228936943, 0.6405289989269227, 0],
            [2.0446219933331826, 0.6404835865655899, 0],
            [2.044602103421697, 0.6404666103396086, 0],
            [2.044571166651954, 0.6404512901555122, 0],
            [2.0442894595916075, 0.6403162175117677, 0],
          ],
          width: 20,
        },
        {
          name: "炼化路",
          positionArray: [
            [2.044699538293948, 0.640631158290352, 0],
            [2.044701131268307, 0.6406060168353254, 0],
            [2.0447166968281305, 0.6405783432334375, 0],
            [2.0447147113364, 0.6404792649770665, 0],
            [2.0447148361750234, 0.6404530595041903, 0],
            [2.0447142742719873, 0.6404225226047967, 0],
            [2.044713709158163, 0.6403832271235028, 0],
            [2.044706945271468, 0.6402704583151023, 0],
          ],
          width: 10,
        },
        {
          name: "世纪大道",
          positionArray: [
            [2.04434123464437, 0.6403400898349575, 0],
            [2.044434412685482, 0.6403378643806408, 0],
            [2.0445061029232092, 0.6403400898349575, 0],
            [2.044595536873257, 0.6403422485451353, 0],
            [2.0446542664437555, 0.6403364060587607, 0],
            [2.044710890433329, 0.6403286940494212, 0],
            [2.0448083191629047, 0.6403280083628548, 0],
            [2.0449010387373754, 0.6403262288718157, 0],
            [2.0449970569222096, 0.6403272770179438, 0],
          ],
          width: 20,
        },
        {
          name: "凤凰路",
          positionArray: [
            [2.0444911917990156, 0.6405999510949354, 0],
            [2.044508172421066, 0.6402995980410907, 0],
            [2.044516650149993, 0.6402493396477498, 0],
          ],
          width: 20,
        },
        {
          name: "刘智远路",
          positionArray: [
            [2.0445972650733646, 0.640464054499708, 0],
            [2.0445978645666, 0.6404257844808059, 0],
            [2.044597917976257, 0.6403811614987969, 0],
            [2.044597422683894, 0.6403422249500581, 0],
            [2.044596505579334, 0.6403380734342226, 0],
            [2.0445962691503956, 0.6402558986100326, 0],
          ],
          width: 10,
        },
      ],

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

      publicSentimentInfoList: [],
      publicSentimentList: [],
    };
  },

  methods: {
    ...mapMutations("menuAbout", ["setIfBottomMenuFold"]),
    ...mapMutations("regionAbout", ["setCurrentRegion"]),
    initPage() {
      this.hindBottomMenu();
      this.initPosition();
      this.initAreaList();
      this.initPublicSentimentInfoList();
      this.addPublicSentimentList();
    },
    initPosition() {
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
    },
    hindBottomMenu() {
      this.setIfBottomMenuFold(true);
    },

    initRoadList() {
      this.roadList = this.roadInfoList.map((roadInfo) => {
        const road = new CesiumRoad(
          roadInfo.name,
          roadInfo.positionArray,
          roadInfo.width
        );
        road.addTo(window.myEarth.viewer.entities);
        return road;
      });
    },

    initAreaList() {
      this.areaList = this.areaInfoList.map((areaInfo) => {
        const area = new CesiumArea(areaInfo.name, areaInfo.positions);
        area.addTo(window.myEarth.viewer.entities);
        return area;
      });
    },
  

    // 初始化舆论数据（伪造）
    initPublicSentimentInfoList() {
      const rectangleRadianPositionList = [
        [
          2.0445845831227167,
          0.6405482384125223,
          2.044583125940411,
          0.6403664336204417,
          2.0448100868240253,
          0.6403606380909849,
          2.0448169516599917,
          0.6405492561345559,
        ],
      ];

      const rectangleDegreePositionList = rectangleRadianPositionList.map(
        (positionArray) =>
          positionArray.map((number) => (number * 180) / Math.PI)
      );

      const maxEffectFactor = 100;
      const minEffectFactor = 0;
      const pointNumber = 500;

      this.publicSentimentInfoList = rectangleDegreePositionList.map(
        (positionArray) => ({
          title: "舆情",
          pointList: generateRadomSentimentList(
            _.chunk(positionArray, 2),
            pointNumber,
            maxEffectFactor,
            minEffectFactor
          ),
        })
      );

      function generateRadomSentimentList(
        positionArray,
        n,
        maxValue,
        minValue
      ) {
        const maxLongitude = _.maxBy(
          positionArray,
          (position) => position[0]
        )[0];
        const minLongitude = _.minBy(
          positionArray,
          (position) => position[0]
        )[0];
        const maxLatitude = _.maxBy(
          positionArray,
          (position) => position[1]
        )[1];
        const minLatitude = _.minBy(
          positionArray,
          (position) => position[1]
        )[1];
        const result = [];

        for (let i = 0; i < n; i++) {
          result.push({
            lon: Math.random() * (maxLongitude - minLongitude) + minLongitude,
            lat: Math.random() * (maxLatitude - minLatitude) + minLatitude,
            effectFactor:
              (0.7 * maxValue - minValue) * Math.random() + minValue,
            details: "太恐怖了！",
          });
        }
        return result;
      }
    },

    addPublicSentimentList() {
      console.log(this.publicSentimentList);
      this.publicSentimentList = this.publicSentimentInfoList.map(
        (publicSentimentInfo) => {
          const publicSentiment = new PublicSentiment(
            window.myEarth.viewer,
            publicSentimentInfo
          );

          publicSentiment.add();
          return publicSentiment;
        }
      );
    },

  
    removePublicSentimentList() {
      this.publicSentimentList.forEach((publicSentiment) =>
        publicSentiment.remove()
      );
    },
  },

  mounted() {
    this.initPage();
  },

  beforeDestroy() {
    this.removePublicSentimentList();
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

  // .area_poi_outer_container {
  //   position: absolute;
  //   width: auto;
  //   height: auto;
  //   transform: translateX(-50%);
  //   pointer-events: all;
  //   &:hover {
  //     cursor: pointer;
  //     animation: float_up_down 1s ease-in-out infinite alternate-reverse;

  //     @keyframes float_up_down {
  //       0% {
  //         transform: translateX(-50%) translateY(-5%);
  //       }
  //       100% {
  //         transform: translateX(-50%) translateY(5%);
  //       }
  //     }
  //   }

  //   .area_poi_inner_container {
  //     width: auto;
  //     height: auto;
  //     color: white;

  //     .text_panel {
  //       width: auto;
  //       height: 30px;
  //       display: flex;
  //       flex-direction: row;
  //       justify-content: center;
  //       align-items: center;
  //       font-weight: 700;
  //       font-size: 22;
  //       padding: 0px 10px;
  //       text-shadow: 0 0 10px #478de0, 0 0 20px #478de0, 0 0 30px #478de0;
  //     }

  //     .icon_pin_panel {
  //       width: auto;
  //       height: 20px;
  //       display: flex;
  //       flex-direction: row;
  //       justify-content: center;
  //       align-items: center;
  //       i {
  //         font-size: 27 px;
  //         font-weight: 700;
  //       }
  //     }
  //   }
  // }

  .test_canvas {
    position: absolute;
    left: 50px;
    top: 100px;
    // transform: rotate(180deg);
    background: rgb(23, 130, 160);
  }
}
</style>
