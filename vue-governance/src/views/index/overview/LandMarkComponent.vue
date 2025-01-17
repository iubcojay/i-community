<template>
  <div class="overview_outer_panel">
    <scene-poi-component
      v-for="scenePOI of scenePOIList"
      v-show="scenePOI.ifShow"
      :id="scenePOI.id"
      :key="scenePOI.id"
      :text="scenePOI.info.title"
      :path="scenePOI.path"
      :position="{ x: scenePOI.winPos[0], y: scenePOI.winPos[3] }"
      :ifActive="scenePOI.ifActive"
      :clickHandler="handlePOIClick"
    ></scene-poi-component>
    <div class="side_bar_panel">
      <div
        v-for="scenePOI of scenePOIList"
        :key="scenePOI.info.name"
        class="scene_item_panel"
        @mouseenter="activePoi(scenePOI.id)"
        @mouseleave="deactivatePoi(scenePOI.id)"
        @click="handlePOIClick(scenePOI.id)"
      >
        <div class="description_panel">
          <div class="title_panel">{{ scenePOI.info.title }}</div>
          <div class="position_panel">
            <i class="iconfont icon-address"></i>
            <span>{{ scenePOI.info.positionStr }}</span>
          </div>
        </div>
        <div class="img_panel">
          <img :src="scenePOI.info.thumbnail" />
        </div>
      </div>
    </div>
    <div class="back_button" @click="handleBackClick">
      <i class="iconfont icon-left"></i>
      <span>返回</span>
    </div>
    <div class="material_container"></div>
  </div>
</template>

<script>
import ScenePoiComponent from "@/views/index/overview/components/ScenePoiComponent";
import { v1 } from "uuid";
import { mapMutations } from "vuex";
import * as turf from "@turf/turf";
import _ from "lodash";
import ThreeJsMaterial from "@/assets/js/threejs/ThreeJsMaterial.js";
import * as THREE from "three";
import { gsap } from "gsap";

class scenePOI {
  constructor(scenePOIInfo) {
    this.info = scenePOIInfo;
    this.id = v1();
    this.winPos = [-100, -100, -100, -100];
    this.ifActive = false;
    this.path = `/index/${scenePOIInfo.name}`;
    this.ifShow = false;
  }

  trackWinPosition() {
    window.myEarth.trackPosition(this.info.position, this.winPos);
  }

  show() {
    this.ifShow = true;
  }
}

class Road {
  constructor(viewer, roadInfo) {
    this.id = v1();
    this._viewer = viewer;
    this.name = roadInfo.properties.name;
    this.roadLineStringList =
      roadInfo.geometry.type === "MultiLineString"
        ? roadInfo.geometry.coordinates
        : [roadInfo.geometry.coordinates];
    this._entityCollection = new Cesium.EntityCollection();
    this.initEntities();
  }

  initEntities() {
    this.roadLineStringList.forEach((roadLineString) => {
      const cartesian3PositionArray = Cesium.Cartesian3.fromDegreesArray(
        roadLineString.flat()
      );
      this._entityCollection.add({
        polyline: {
          positions: cartesian3PositionArray,
          material: ThreeJsMaterial.getTwinkleMaterial({
            startColor: "rgba(2,77,137,0.5)",
            endColor: "rgba(33,194,237,1)",
          }).cesiumMaterial,
          width: 0.5,
        },
      });
    });
  }

  add() {
    this._entityCollection.values.forEach((entity) =>
      this._viewer.entities.add(entity)
    );
  }

  remove() {
    this._entityCollection.values.forEach((entity) =>
      this._viewer.entities.remove(entity)
    );
  }

  isSubEntity(entity) {
    return this._entityCollection.values.includes(
      (subEntity) => subEntity.id === entity.id
    );
  }
}

export default {
  name: "LandMarkComponent",
  components: {
    ScenePoiComponent,
  },
  data() {
    return {
      chinaRadianPosition: [2.0303996965, 0.69696814796, 0],
      lichengRadianPosition: [2.0440507659601534, 0.6401498384645479, 0],
      scenePOIList: [],
      roadList: [],
    };
  },

  methods: {
    ...mapMutations("menuAbout", ["setIfBottomMenuFold"]),
    ...mapMutations("tipAbout", ["setIfLoadingTip"]),

    async initComp() {
      this.initData();
      this.setIfBottomMenuFold(false);
      await this.initScene();
      this.initRoads();
    },

    initData() {
      this.initScenePOIList();
    },

    initScenePOIList() {
      const scenePOIInfoList = [
        {
          name: "school",
          title: "山东大学齐鲁软件学院",
          positionStr: "山东省济南市历城区舜华路中段1500号",
          position: [2.044362194751343, 0.6399695117713349, 0],
          thumbnail:
            this.$StaticResourceAddress + "/img/thumbnails/scene/school.jpg",
        },
        {
          name: "community",
          title: "解放路街道",
          positionStr: "山东省济南市历下区",
          position: [2.042793850105076, 0.6398969081167519, 0],
          thumbnail:
            this.$StaticResourceAddress + "/img/thumbnails/scene/street.png",
        },
        {
          name: "factory",
          title: "中国石油石化公司",
          positionStr: "山东省济南市历下区工业南路26号",
          position: [2.0447348912310606, 0.6405024481698904, 0],
          thumbnail:
            this.$StaticResourceAddress + "/img/thumbnails/scene/factory.png",
        },
      ];
      this.scenePOIList.push(
        ...scenePOIInfoList.map((scenePOIInfo) => new scenePOI(scenePOIInfo))
      );

      this.scenePOIList.forEach((scenePOI) => {
        scenePOI.trackWinPosition();
      });
    },

    async initScene() {
      // if (this.$store.state.regionAbout.currentRegion.name !== "济南市") {
      //   // 视角从中国移入历下区上空
      //   window.myEarth.flyToPosition(
      //     this.chinaRadianPosition,
      //     1000000,
      //     [0, (-90 * Math.PI) / 180, 0],
      //     0
      //   );
      // }
      let delaySeconds = 2;
      window.myEarth.flyToPosition(
        this.lichengRadianPosition,
        50000,
        [0, (-90 * Math.PI) / 180, 0],
        delaySeconds
      );

      setTimeout(() => {
        window.myEarth.flyToPosition(
          this.lichengRadianPosition,
          15000,
          [0, (-50 * Math.PI) / 180, 0],
          1
        );
        this.scenePOIList.forEach((scenePOI) => {
          scenePOI.show();
        });
      }, delaySeconds * 1000);

      this.$store.commit("regionAbout/setCurrentRegion", {
        name: "历下区",
      });
      window.myEarth.setMinMaxZoomDistance(10, 60000);

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, (delaySeconds + 1) * 1000);
      });
    },

    activePoi(id) {
      this.scenePOIList.find((scenePOI) => scenePOI.id === id).ifActive = true;
    },

    deactivatePoi(id) {
      this.scenePOIList.find((scenePOI) => scenePOI.id === id).ifActive = false;
    },

    async handlePOIClick(scenePoiId) {
      const clickedPoi = this.scenePOIList.find(
        (scenePoi) => scenePoi.id === scenePoiId
      );
      await this.clearRoads();
      this.$router
        .push({
          path: clickedPoi.path,
        })
        .then(() => {});
    },

    async handleBackClick() {
      await this.clearRoads();
      this.$router.push({
        path: "/index/region",
      });
    },

    async initRoads() {
      this.setIfLoadingTip({ show: true, message: "路网加载中" });
      const { data } = await this.$axios.get(
        this.$StaticResourceAddress + "/json/road/roads2.json"
      );
      const roadInfoList = data.features;
      roadInfoList.forEach((roadInfo) => {
        const road = new Road(window.myEarth.viewer, roadInfo);
        this.roadList.push(road);
        road.add();
      });
      this.setIfLoadingTip({ show: false, message: "" });
    },

    async clearRoads() {
      this.setIfLoadingTip({ show: true, message: "场景加载中" });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.roadList.forEach((road) => {
            road.remove();
          });
          this.roadList = [];
          this.setIfLoadingTip({ show: false, message: "" });
          resolve();
        }, 500);
      });
    },
  },

  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    window.myEarth.clearEntities();
    // this.clearRoads();
  },
};
</script>

<style lang="less" scoped>
.overview_outer_panel {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  pointer-events: none;
  left: 0;
  top: 0;
  background: rgba(24, 49, 85, 0.1);

  .side_bar_panel {
    width: 300px;
    height: auto;
    position: absolute;
    right: 10px;
    top: 10px;

    .scene_item_panel {
      width: 100%;
      height: 100px;
      margin-bottom: 10px;
      background: linear-gradient(
        135deg,
        rgba(2, 77, 137, 0.9),
        rgba(255, 255, 255, 0)
      );
      display: flex;
      flex-direction: row;
      align-items: center;
      box-sizing: border-box;
      padding: 5px 10px;
      border-radius: 10px;
      pointer-events: all;
      transition: 0.3s ease-in-out;
      &:hover {
        cursor: pointer;
        transform: scale(1.1) translateX(-5%);
      }

      .description_panel {
        flex: 1;
        height: 90%;

        .title_panel {
          font-size: 15px;
          color: white;
          margin-bottom: 10px;
        }
        .position_panel {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          display: flex;
          flex-direction: row;
          align-items: center;

          i {
            margin-right: 5px;
          }
        }
      }

      .img_panel {
        width: 120px;
        height: 90%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.7;
        }
      }
    }
  }

  .back_button {
    position: absolute;
    left: 20px;
    top: 20px;
    width: 150px;
    height: 50px;
    background: linear-gradient(
      135deg,
      rgba(2, 77, 137, 0.9),
      rgba(255, 255, 255, 0)
    );
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: white;
    pointer-events: all;
    transition: 0.3s ease;

    &:hover {
      cursor: pointer;
      transform: scale(1.05);
      background: linear-gradient(
        135deg,
        rgb(2, 66, 118),
        rgba(255, 255, 255, 0)
      );
    }

    i {
      font-size: 20px;
      font-weight: 1000;
      margin: 0 10px;
    }
    span {
      font-size: 18px;
      font-weight: 700;
    }
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
