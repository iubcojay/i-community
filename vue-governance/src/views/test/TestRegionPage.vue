<template>
  <div class="region_outer_container">
    <cesium-earth-component
      @earthReady="ifEarthReady = true"
    ></cesium-earth-component>
  </div>
</template>

<script>
import CesiumEarthComponent from "@/views/common/cesium/CesiumEarthComponent";
import _ from "lodash";
import { gsap } from "gsap";

export default {
  name: "TestRegionPage",
  components: { CesiumEarthComponent },
  data() {
    return {
      ifEarthReady: false,
      regionList: [],
    };
  },
  methods: {
    initPage() {
      this.initPosition();
      this.addRegions();
    },
    initPosition() {
      window.myEarth.flyToPosition(
        [2.0440507659601534, 0.6401498384645479, 0],
        200000,
        [0, (-30 * Math.PI) / 180, 0],
        0
      );
    },

    async addRegions() {
      this.regionList = await this.getRegionList();

      this.regionList.forEach((regionInfo) => {
        // 原生cesium 添加
        regionInfo._entity = new Cesium.Entity({
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(
              regionInfo.bondPositionList
            ),
            extrudedHeight: new Cesium.CallbackProperty(() => {
              return regionInfo.height;
            }, false),
            height: 0,
            material: Cesium.Color.fromCssColorString("rgba(2,77,137,0.5)"),
          },
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(
              regionInfo.bondPositionList
            ),
            material: Cesium.Color.fromCssColorString("rgba(33,194,237)"),
            loop: true,
            width: 2,
          },
        });

        window.myEarth.viewer.entities.add(regionInfo._entity);
      });
      this.activeRegions();
    },

    async getRegionList() {
      // 这是请求阿里DataV上的数据
      const bondJsonUrl = `${this.$StaticResourceAddress}/json/bond/jinan.json`;
      const { data } = await this.$axios.create().get(bondJsonUrl);

      const regionInfoList = [];
      data.features.forEach((regionInfo) => {
        if (regionInfo.type === "Feature") {
          regionInfoList.push({
            name: regionInfo.properties.name,
            center: regionInfo.properties.center.map((angle) =>
              window.myEarth.angle2Radian(angle)
            ),
            bondPositionList: regionInfo.geometry.coordinates[0][0].flat(),
            _entity: null,
            pointerEvent: "mouseout",
            height: 0,
          });
        }
      });
      return regionInfoList;
    },

    activeRegions() {
      const container = document.querySelector(".region_outer_container");

      this._handler = new Cesium.ScreenSpaceEventHandler(
        window.myEarth.scene.canvas
      );

      const viewer = window.myEarth.viewer;
      // 鼠标移入labelEntity提示框
      this._handler.setInputAction((e) => {
        let pickedObject = window.myEarth.viewer.scene.pick(e.endPosition);
        if (
          viewer.scene.pickPositionSupported &&
          Cesium.defined(pickedObject) &&
          pickedObject.id !== ""
        ) {
          container.style.cursor = "pointer";
          this.regionList.forEach((region) => {
            if (region._entity.id === pickedObject.id.id) {
              this.showLabel(e.endPosition, region.name);
              if (region.pointerEvent !== "mouseenter") {
                region.pointerEvent = "mouseenter";
                pickRegion(region);
              }
            } else {
              if (region.pointerEvent !== "mouseout") {
                region.pointerEvent = "mouseout";
                unPickRegion(region);
              }
            }
          });
        } else {
          container.style.cursor = "default";
          this.hiddenLabel();
          this.regionList.forEach((region) => {
            if (region.pointerEvent !== "mouseout") {
              region.pointerEvent = "mouseout";
              unPickRegion(region);
            }
          });
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      const pickedMaxExtrudedHeight = 5000;

      function pickRegion(region) {
        container.style.cursor = "pointer";
        // region._entity.polygon.extrudedHeight = pickedMaxExtrudedHeight;
        gsap.to(region, {
          height: 5000,
          duration: 0.5,
        });
      }

      function unPickRegion(region) {
        gsap.to(region, {
          height: 0,
          duration: 0.5,
        });
      }
    },

    showLabel(endPosition, text) {
      const cartesian = window.myEarth.viewer.scene.pickPosition(endPosition);
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);

      if (!this._labelEntity) {
        this._labelEntity = window.myEarth.viewer.entities.add({
          label: {
            show: false,
            showBackground: true,
            font: "20px monospace",
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(15, 0),
          },
        });
      }

      this._labelEntity.position = cartesian;
      this._labelEntity.label.show = true;
      this._labelEntity.label.text = text;

      this._labelEntity.label.eyeOffset = new Cesium.Cartesian3(
        0.0,
        0.0,
        -cartographic.height *
          (window.myEarth.scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0)
      );
    },

    hiddenLabel() {
      this._labelEntity && (this._labelEntity.label.show = false);
    },

    clearRegions() {
      this._handler && this._handler.destroy();
      window.myEarth.viewer.entities.removeAll();
    },
  },

  watch: {
    ifEarthReady(val) {
      if (val) {
        this.initPage();
      }
    },
  },

  beforeDestroy() {
    this.clearRegions();
  },
};
</script>

<style lang="less" scoped>
.region_outer_container {
  width: 100%;
  height: 100%;
  position: relative;
  .earth_container {
  }
}
</style>
