<template>
  <div class="path-outer-container">
    <transition>
      <div v-show="infoShow" class="path-info-container" :style="pathInfoPositionStyle">
        <div class="triangle"></div>
        <div class="path-info-content">
          <div class="info-item">
            <span>{{ startDate }}</span>
            <span>{{ startPositionName }}</span>
          </div>
          <i class="iconfont icon-arrow-right"></i>
          <div class="info-item">
            <span>{{ endDate }}</span>
            <span>{{ endPositionName }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {gsap} from "gsap";
import utils from "@/commom";
import ThreeJsMaterial from "@/assets/js/threejs/ThreeJsMaterial";

export default {
  name: "HistoryPath",
  props: ["info"],
  data() {
    return {
      lineWidth: 5,
      cursor: "default",
      mouseScreePosition: {x: -1000, y: -1000},
      infoShow: false
    }
  },
  computed: {
    points() {
      return Cesium.Cartesian3.fromDegreesArrayHeights(this.info.points.flatMap(point => [point.longitude, point.latitude, point.altitude]))
    },
    pathInfoPositionStyle() {
      return {
        left: `${this.mouseScreePosition.x}px`,
        top: `${this.mouseScreePosition.y}px`,
      }
    },
    startDate() {
      return utils.dateFormat("YY/mm/dd HH:MM", this.info.start.date)
    },
    endDate() {
      return utils.dateFormat("YY/MM/dd HH:mm", this.info.end.date)
    },
    startPositionName() {
      return this.info.start.position;
    },
    endPositionName() {
      return this.info.end.position;
    }
  },
  methods: {
    addPathLine() {
      const viewer = window.myEarth.viewer;
      this._pathLineEntity = viewer.entities.add({
        polyline: {
          positions: this.points,
          width: new Cesium.CallbackProperty(() => {
            // 返回一个随时间变化的位置
            return this.lineWidth;
          }, false),
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.1, //设置发光强度
            color: new Cesium.Color(
                Math.random(),
                Math.random(),
                Math.random(),
                1.0
            ),
          }),
          pToGround: true,
        }
      });
    },

    removePathLine() {
      this._pathLineEntity && window.myEarth.viewer.entities.remove(this._pathLineEntity);
    },

    activePath() {
      this._widthTween?.kill();
      this._widthTween = gsap.to(this, {lineWidth: 20, duration: 0.3})
      this.cursor = "pointer";
      this.infoShow = true;
    },

    inactivePath() {
      this._widthTween?.kill();
      this._widthTween = gsap.to(this, {lineWidth: 10, duration: 0.3})
      this.cursor = "default";
      this.infoShow = false;
    },

    addPointerHandler() {
      const viewer = window.myEarth.viewer;
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((movement) => {
        const {endPosition} = movement;
        const pickedObject = viewer.scene.pick(endPosition);  // 检测鼠标移动到的物体
        if (Cesium.defined(pickedObject) && pickedObject.id === this._pathLineEntity) {
          this.activePath();
        } else {
          [this.mouseScreePosition.x, this.mouseScreePosition.y] = [endPosition.x, endPosition.y]
          this.inactivePath();
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      this._pointerHandler = handler;
    },

    removePointerHandler() {
      this._pointerHandler && this._pointerHandler.destroy();
    }
  },
  watch: {
    cursor(value) {
      window.myEarth.viewer._container.style.cursor = value;
    }
  },
  mounted() {
    this.addPathLine();
    this.addPointerHandler();
  },
  beforeDestroy() {
    this.removePathLine();
    this.removePointerHandler();
  }
}
</script>

<style scoped lang="less">
.path-outer-container {
  position: absolute;
  width: 100%;
  height: 100%;

  .path-info-container {
    position: absolute;
    width: 250px;
    height: 50px;
    transform: translateX(-50%) translateY(-100% - 20px) scale(0.8);
    background: rgba(24, 49, 85, 0.9);
    border-radius: 10px;
    box-shadow: 0 0 10px #478de0, 0 0 10px #478de0, 0 0 10px #478de0;
    border: 1px solid white;


    .triangle {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 12px;
      height: 5px;
      transform: translateX(-50%) translateY(100%);
      clip-path: polygon(0 0, 50% 100%, 100% 0);
      background: rgba(24, 49, 85, 0.9);
    }

    .path-info-content {
      width: 100%;
      height: 100%;
      color: white;
      font-size: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .info-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
</style>
