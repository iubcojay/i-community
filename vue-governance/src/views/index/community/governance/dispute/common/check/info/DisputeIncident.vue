<template>
  <div class="dispute-incident-outer-container" :style="positionStyle">
    <div class="icon-pin-container">
      <i class="icon_pin_icon iconfont icon-dispute"></i>
    </div>
    <div class="detect-outer-container">
      <div class="line-container"></div>
      <div ref="disputeIncidentContainer" class="detect-content-container">
        <div class="panel_border border_lb"></div>
        <div class="panel_border border_rb"></div>
        <div class="panel_border border_rt"></div>
        <div class="panel_border border_lt"></div>
        <div class="header_panel">
          <i class="iconfont icon-dispute"></i>
          {{ title }}
        </div>
        <div class="body-panel">
          <div>{{ description }}</div>
          <div class="incident-img">
            <img :src="img" alt="dispute img">
          </div>
          <div style="color: var(--lightBlue)">{{ result }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/commom";
import {gsap} from "gsap"

export default {
  name: "DisputeIncident",
  components: {},
  props: ["incident", "isFocus"],
  data() {
    return {
      screePosition: {x: -1000, y: -1000}
    }
  },
  computed: {
    degreePosition() {
      return this.incident.position;
    },
    positionStyle() {
      return {
        left: `${this.screePosition.x}px`,
        top: `${this.screePosition.y}px`,
      }
    },
    title() {
      return this.incident.title;
    },
    img() {
      return this.incident.img;
    },
    description() {
      return this.incident.description;
    },
    result() {
      return this.incident.result;
    },

  },
  methods: {
    bindPosition() {
      const viewer = window.myEarth.viewer;
      // 开启监听器
      this._unBindPostRender = viewer.scene.postRender.addEventListener(() => {
        const {longitude, latitude, altitude} = this.degreePosition;
        const ellipsoid = viewer.scene.globe.ellipsoid;
        const cartographic = Cesium.Cartographic.fromDegrees(longitude, latitude, altitude);
        const cartesian3 = ellipsoid.cartographicToCartesian(cartographic);
        const pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian3);
        ([this.screePosition.x, this.screePosition.y] = [pick.x, pick.y])
      });
    },
    unBindPosition() {
      this._unBindPostRender && this._unBindPostRender();
    },
    highlight() {
      const container = this.$refs.disputeIncidentContainer;
      container.classList.add("animate__animated", "animate__heartBeat")
      setTimeout(() => {
        container.classList.remove("animate__animated", "animate__heartBeat")
      }, 1000)
    }
  },
  mounted() {
    this.bindPosition();
  },
  beforeDestroy() {
    this.unBindPosition();
  },

  watch: {
    isFocus: {
      immediate: false,
      handler(val) {
        if (val) {
          this.highlight();
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.dispute-incident-outer-container {
  user-select: none;
  position: absolute;
  transform: translateX(-50%) translateY(-100%) scale(0.6);
  height: 0px;
  width: 0px;

  .icon-pin-container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 10;
    border: 5px double #478de0;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0 0 10px #478de0, 0 0 10px #478de0, 0 0 10px #478de0;

    .icon_pin_icon {
      font-size: 25px;
      color: #478de0;
    }
  }

  .detect-outer-container {
    position: absolute;
    width: fit-content;
    height: fit-content;
    left: 15px;
    bottom: 15px;
    z-index: 1;
    display: flex;
    flex-direction: row;
    color: white;

    .line-container {
      position: relative;
      width: 50px;
      height: 330px;
      background: #478de0;
      clip-path: polygon(0 calc(100% - 2px), 2px 100%, 100% calc(60% + 2px), 100% calc(60% - 2px));
      z-index: 10;
    }

    .detect-content-container {
      position: relative;
      width: fit-content;
      height: fit-content;
      box-sizing: border-box;
      background-color: rgba(24, 49, 85, 0.9);
      box-shadow: 0 0 10px #478de0, 0 0 10px #478de0, 0 0 10px #478de0;
      border-radius: 6px;
      pointer-events: all;

      .header_panel {
        height: 28px;
        box-sizing: border-box;
        border-bottom: white solid 2px;
        line-height: 40px;
        padding-left: 10px;
        color: white;
        font-size: 14px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
      }

      .menu_panel {
        display: flex;
        flex-direction: row;
        justify-content: right;
      }

      .body-panel {
        width: fit-content;
        height: 280px;
        padding: 10px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .incident-img {
          width: 400px;
          height: 150px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .panel_border {
        position: absolute;
        width: 24px;
        height: 24px;
        pointer-events: none;
      }

      .border_rt {
        right: 0;
        top: 0;
        border-radius: 0px 6px 0px 0px;
        border-right: 3px var(--lightBlue) solid;
        border-top: 3px var(--lightBlue) solid;
      }

      .border_rb {
        right: 0;
        bottom: 0;
        border-radius: 0px 0px 6px 0px;
        border-right: 3px var(--lightBlue) solid;
        border-bottom: 3px var(--lightBlue) solid;
      }

      .border_lt {
        left: 0;
        top: 0;
        border-radius: 6px 0px 0px 0px;
        border-left: 3px var(--lightBlue) solid;
        border-top: 3px var(--lightBlue) solid;
      }

      .border_lb {
        left: 0;
        bottom: 0;
        border-radius: 0px 0px 0px 6px;
        border-left: 3px var(--lightBlue) solid;
        border-bottom: 3px var(--lightBlue) solid;
      }
    }
  }

}
</style>
