<template>
  <div class="region_outer_container">
    <div
        class="region_name_panel"
        v-for="region of regionList"
        :style="{
        left: `${region._screenCenterPosition[0]}px`,
        bottom: `${region._screenCenterPosition[3]}px`,
      }"
        :class="{ selected: region.ifSelected() }"
    >
      {{ region.name }}
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import {gsap} from "gsap";
import * as turf from "@turf/turf";
import {mapMutations} from "vuex";

class Region {
  constructor(regionInfo) {
    this._pointerEvent = "mouseout";
    this._selectedMaxExtrudedHeight = 5000;
    this._selectDuration = 0.5;
    this._lightColor = Cesium.Color.fromCssColorString("rgba(33,194,237,0.8)");
    this._darkColor = Cesium.Color.fromCssColorString("rgba(2,77,137,0.5)");
    this.name = regionInfo.properties.name;

    this.bondPositionList = regionInfo.geometry.coordinates[0][0].flat();
    this._extrudedHeight = 0;
    this._entity = new Cesium.Entity({
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray(this.bondPositionList),
        extrudedHeight: new Cesium.CallbackProperty(() => {
          return this._extrudedHeight;
        }, false),
        height: 0,
        material: this._darkColor,
      },
      polyline: {
        show: new Cesium.CallbackProperty(() => {
          return this._pointerEvent === "mouseout";
        }, false),
        positions: Cesium.Cartesian3.fromDegreesArray(this.bondPositionList),
        material: this._lightColor,
        loop: true,
        width: 2,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            600000
        ),
      },
    });

    this.center = turf.centerOfMass(
        turf.polygon([_.chunk(this.bondPositionList, 2)])
    ).geometry.coordinates;
    this._screenCenterPosition = [];

    const trackResult = window.myEarth.trackPosition(
        [...this.center.map((item) => window.myEarth.angle2Radian(item)), 0],
        this._screenCenterPosition
    );
    this._trackPinId = trackResult.pinId;
    this._unBindTrackFun = trackResult.unBindFun;
  }

  addTo(entities) {
    entities.add(this._entity);
  }

  isSameEntity(entity) {
    return this._entity.id === entity.id;
  }

  select() {
    if (this._pointerEvent !== "mouseenter") {
      this._pointerEvent = "mouseenter";
      gsap.to(this, {
        _extrudedHeight: this._selectedMaxExtrudedHeight,
        duration: this._selectDuration,
      });
      this._entity.polygon.material = this._lightColor;
    }
  }

  unSelect() {
    if (this._pointerEvent !== "mouseout") {
      this._pointerEvent = "mouseout";
      gsap.to(this, {
        _extrudedHeight: 0,
        duration: this._selectDuration,
      });
      this._entity.polygon.material = this._darkColor;
    }
  }

  remove(entities) {
    entities.remove(this._entity);

    window.myEarth.removeEntityFromEarth(this._trackPinId);
  }

  ifSelected() {
    return this._pointerEvent === "mouseenter";
  }
}

export default {
  name: "RegionComponent",
  data() {
    return {
      regionList: [],
      _handler: undefined,
    };
  },
  methods: {
    ...mapMutations("menuAbout", ["setIfBottomMenuFold"]),

    innitPage() {
      this.initPosition();
      this.addRegions();
      this.setIfBottomMenuFold(false);
    },
    initPosition() {
      // window.myEarth.flyToPosition(
      //   [2.0303996965, 0.69696814796, 0],
      //   6000000,
      //   [0, (-90 * Math.PI) / 180, 0],
      //   0
      // );

      //   window.myEarth.flyToPosition(
      //     [2.0440507659601534, 0.6401498384645479, 0],
      //     400000,
      //     [0, (-60 * Math.PI) / 180, 0],
      //     2
      //   );

      window.myEarth.flyToPosition(
          [2.0440507659601534, 0.6401498384645479, 0],
          200000,
          [0, (-60 * Math.PI) / 180, 0],
          1
      );
      this.$store.commit("regionAbout/setCurrentRegion", {
        name: "济南市",
      });
    },

    async initRegionList() {
      const bondJsonUrl = `${this.$StaticResourceAddress}/json/bond/jinan.json`;
      const {data} = await this.$axios.create().get(bondJsonUrl);

      const regionInfoList = [];
      data.features.forEach((regionInfo) => {
        if (regionInfo.type === "Feature") {
          regionInfoList.push(new Region(regionInfo));
        }
      });
      return regionInfoList;
    },

    async addRegions() {
      this.regionList = await this.initRegionList();
      this.regionList.forEach((region) => {
        region.addTo(window.myEarth.viewer.entities);
      });

      this.initHandler();
    },

    initHandler() {
      const container = window.myEarth.scene.canvas;
      this._handler = new Cesium.ScreenSpaceEventHandler(container);
      this._handler.setInputAction((e) => {
        let pickedObject = window.myEarth.viewer.scene.pick(e.endPosition);
        // 处理鼠标样式

        if (Cesium.defined(pickedObject) && pickedObject.id !== "") {
          container.style.cursor = "pointer";
        } else {
          container.style.cursor = "default";
        }

        this.regionList.forEach((region) => {
          if (
              Cesium.defined(pickedObject) &&
              pickedObject.id !== "" &&
              region.isSameEntity(pickedObject.id)
          ) {
            region.select();
          } else {
            region.unSelect();
          }
        });
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      this._handler.setInputAction((e) => {
        let pickedObject = window.myEarth.viewer.scene.pick(e.position);

        // 处理鼠标样式
        if (Cesium.defined(pickedObject) && pickedObject.id !== "") {
          container.style.cursor = "pointer";
        } else {
          container.style.cursor = "default";
        }

        this.regionList.forEach((region) => {
          if (
              Cesium.defined(pickedObject) &&
              pickedObject.id !== "" &&
              region.isSameEntity(pickedObject.id)
          ) {
            this.route2RegionPage(region);
            // 清除鼠标样式
            container.style.cursor = "default";
          }
        });
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    clearRegions() {
      this._handler && this._handler.destroy();
      this.regionList.forEach((region) => {
        region.remove(window.myEarth.viewer.entities);
      });
    },

    route2RegionPage(region) {
      this.$router.push({name: "indexOverviewLand"});
    },
  },
  beforeDestroy() {
    this.clearRegions();
  },
  mounted() {
    this.innitPage();
  },
};
</script>

<style lang="less" scoped>
.region_outer_container {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  pointer-events: none;
  left: 0;
  top: 0;

  .region_name_panel {
    position: absolute;
    width: 100px;
    height: 30px;
    left: -100%;
    bottom: -100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    transform: translateX(-50%) translateY(-50%);
    font-size: 18px;
    font-weight: 1000;
    color: white;

    &.selected {
      animation: region_name_float 0.5s ease-in-out infinite alternate;
      @keyframes region_name_float {
        0% {
          transform: translateX(-50%) translateY(-65%);
        }

        100% {
          transform: translateX(-50%) translateY(-35%);
        }
      }
    }
  }
}
</style>
