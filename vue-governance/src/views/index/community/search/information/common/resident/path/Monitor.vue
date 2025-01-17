<template>
  <div class="monitor-outer-container" :style="positionStyle">
    <div class="icon-pin-container">
      <i class="icon_pin_icon iconfont icon-monitor"></i>
    </div>
    <div class="detect-outer-container">
      <div class="line-container"></div>
      <div class="detect-content-container">
        <div class="panel_border border_lb"></div>
        <div class="panel_border border_rb"></div>
        <div class="panel_border border_rt"></div>
        <div class="panel_border border_lt"></div>
        <div class="header_panel">
          <div class="title_panel">
            <i class="iconfont icon-monitor"></i>
            {{ info.name }}
            -
            {{ resident.name }}
          </div>
        </div>
        <div class="body-panel">
          <el-tabs tab-position="right" type="border-card" style="width: fit-content;height: 150px">
            <el-tab-pane v-for="shoot of shoots" :key="shoot.id" :label="shoot.date">
              <img :src="shoot.img" class="shoot-img"/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/commom";

export default {
  name: "Monitor",
  components: {},
  props: ["info", "resident"],
  data() {
    return {
      screePosition: {x: -1000, y: -1000}
    }
  },
  computed: {
    degreePosition() {
      return this.info.degreePosition;
    },
    positionStyle() {
      return {
        left: `${this.screePosition.x}px`,
        top: `${this.screePosition.y}px`,
      }
    },
    name() {
      return this.info.name;
    },
    shoots() {
      return this.info.shoots.map(shoot => ({
        ...shoot,
        date: utils.dateFormat("YY/MM/dd HH:mm", shoot.date),
      }))
    }
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
    }
  },
  mounted() {
    this.bindPosition();
  },
  beforeDestroy() {
    this.unBindPosition();
  }
}
</script>

<style scoped lang="less">
.monitor-outer-container {
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
      height: 200px;
      background: #478de0;
      clip-path: polygon(0 calc(100% - 2px), 2px 100%, 100% calc(60% + 2px), 100% calc(60% - 2px));
      z-index: 10;
    }

    .detect-content-container {
      position: relative;
      width: fit-content;
      height: 200px;
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
        justify-content: space-between;
        align-items: center;
      }

      .menu_panel {
        display: flex;
        flex-direction: row;
        justify-content: right;
      }

      .body-panel {
        width: fit-content;
        padding: 10px;

        ::v-deep {

          .el-tabs {
            width: fit-content;
            display: flex;
            flex-direction: row;
            background: transparent;
            border: none;
            gap: 10px;

            .el-tabs--border-card {
              background: transparent;
              border: none;
              box-shadow: none;
            }

            .el-tabs__header {
              border: none;
              width: 120px;
              font-size: 12px;
              background-color: transparent;
              margin: 0;
              order: 2;

              .el-tabs__nav-wrap {
                &.is-scrollable {
                  padding: 12px 0;
                }

                .el-tabs__nav-next {
                  line-height: 12px;
                  height: 12px;
                  font-size: 12px;

                  &:hover {
                    color: var(--lightBlue);
                  }
                }

                .el-tabs__nav-prev {
                  line-height: 12px;
                  height: 12px;
                  font-size: 12px;

                  &:hover {
                    color: var(--lightBlue);
                  }
                }

                .el-tabs__item {
                  line-height: 20px;
                  height: 25px;
                  font-size: 12px;
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                  border: none;
                  margin: 0;
                  padding: 0;
                  color: white;

                  &.is-active {
                    background-color: var(--lightBlue);
                  }
                }
              }
            }

            .el-tabs__content {
              order: 1;
              padding: 0;

              .el-tab-pane {
                height: fit-content;
              }
            }
          }
        }

        .shoot-img {
          width: 200px;
          height: 150px;
          border-radius: 8px;
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
