<template>
  <div class="outer_panel" ref="outerPanel">
    <div class="content_panel">
      <div class="base_info_panel">
        <div class="text_panel">
          <div class="title_panel">
            <span class="title_text_panel">车辆信息</span>
            <div class="title_menu_panel">
              <i
                class="iconfont icon-camera-unlock"
                v-if="!this.ifLock"
                @click="handleMenuIconClick('unlock')"
              ></i>
              <i
                class="iconfont icon-camera-lock icon_lock"
                v-if="this.ifLock"
                @click="handleMenuIconClick('lock')"
              ></i>
              <i class="iconfont icon-close" @click="handleMenuIconClick('close')"></i>
            </div>
          </div>
          <div class="car_info_item">
            <div class="car_info_title">车牌号</div>
            <div class="car_info_content">{{infoData.license}}</div>
          </div>
          <div class="car_info_item">
            <div class="car_info_title">车型</div>
            <div class="car_info_content">{{infoData.type}}</div>
          </div>
          <div class="car_info_item">
            <div class="car_info_title">颜色</div>
            <div class="car_info_content">
              <div class="color_panel" :style="{background:infoData.color}"></div>
            </div>
          </div>
          <div class="car_info_item">
            <div class="car_info_title">车辆状态</div>
            <div
              class="car_info_content"
              v-if="infoData.status === PARKING_STATUS_ENTER"
              style="color:#409EFF"
            >入库</div>
            <div
              class="car_info_content"
              v-if="infoData.status === PARKING_STATUS_LEAVE"
              style="color:#409EFF"
            >出库</div>
            <div
              class="car_info_content"
              v-if="infoData.status === PARKING_STATUS_STOP"
              style="color:#67C23A"
            >停泊</div>
            <div
              class="car_info_content"
              v-if="infoData.status === PARKING_STATUS_ANOMALY"
              style="color:#F56C6C"
            >异常</div>
          </div>
          <div class="car_info_item">
            <div class="car_info_title">停车时长</div>
            <div class="car_info_content" v-if="infoData.stopTime!==0">{{infoData.stopTime}}小时</div>
            <div class="car_info_content" v-else>——</div>
          </div>
        </div>
        <div class="border_panel">
          <div
            v-for="position of ['lt','rt','rb','lb']"
            :class="['border_corner_'+ position]"
            :key="position"
          ></div>
        </div>
      </div>
    </div>
    <div class="guide_line_panel">
      <canvas ref="guideLineCanvas"></canvas>
    </div>
    <div class="bottom_padding_panel"></div>
  </div>
</template>

<script>
import Car from "@/assets/js/threejs/Car";
export default {
  name: "CarBasePanelComponent",
  props: {
    position: {
      default: "center"
    },
    infoData: {},
    closePanel: {
      default: () => {
        return () => {};
      }
    },
    lockCar: {
      default: () => {
        return () => {};
      }
    },
    unlockCar: {
      default: () => {
        return () => {};
      }
    },
    ifLocked: {
      default: false
    }
  },
  data() {
    return {
      PARKING_STATUS_ENTER: Car.PARKING_STATUS_ENTER,
      PARKING_STATUS_STOP: Car.PARKING_STATUS_STOP,
      PARKING_STATUS_LEAVE: Car.PARKING_STATUS_LEAVE,
      PARKING_STATUS_ANOMALY: Car.PARKING_STATUS_ANOMALY,
      ifLock: this.ifLocked
    };
  },
  methods: {
    initComp() {
      this.initGuideLine();
    },
    initGuideLine() {
      switch (this.position) {
        case "left":
          this.$refs.outerPanel.classList.add("left_outer_panel");
          this.drawLeftGuideLine();
          break;
        case "center":
          this.$refs.outerPanel.classList.add("center_outer_panel");
          this.drawCenterGuideLine();
          break;
        case "right":
          this.$refs.outerPanel.classList.add("right_outer_panel");
          this.drawRightGuideLine();
          break;
      }
    },
    drawRightGuideLine() {
      this.$nextTick(() => {
        const canvas = this.$refs.guideLineCanvas;
        const width = 280;
        const height = 50;
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        const ctx = canvas.getContext("2d");

        // 画圆
        ctx.save();
        ctx.fillStyle = "rgb(2, 77, 137)";
        ctx.beginPath();
        ctx.arc(width * 0.75, 0.9 * height, 0.1 * height, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();

        // 画线
        ctx.save();
        ctx.strokeStyle = "rgb(2, 77, 137)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width * 0.75, 0.9 * height);
        ctx.lineTo(width * 0.85, 0.5 * height);
        ctx.lineTo(width, 0.5 * height);
        ctx.stroke();
        ctx.restore();
      });
    },
    drawCenterGuideLine() {
      this.$nextTick(() => {
        const canvas = this.$refs.guideLineCanvas;
        const width = 250;
        const height = 40;

        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        const ctx = canvas.getContext("2d");

        //画线
        ctx.save();
        ctx.strokeStyle = "rgb(2, 77, 137)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width * 0.5, height);
        ctx.lineTo(width * 0.5, 0);
        ctx.stroke();
        ctx.restore();
      });
    },
    drawLeftGuideLine() {
      this.$nextTick(() => {
        const canvas = this.$refs.guideLineCanvas;
        const width = 280;
        const height = 50;
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        const ctx = canvas.getContext("2d");

        // 画圆
        ctx.save();
        ctx.fillStyle = "rgb(2, 77, 137)";
        ctx.beginPath();
        ctx.arc(width * 0.25, 0.9 * height, 0.1 * height, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();

        // 画线
        ctx.save();
        ctx.strokeStyle = "rgb(2, 77, 137)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width * 0.25, 0.9 * height);
        ctx.lineTo(width * 0.15, 0.5 * height);
        ctx.lineTo(0, 0.5 * height);
        ctx.stroke();
        ctx.restore();
      });
    },
    handleMenuIconClick(iconType) {
      switch (iconType) {
        case "close":
          this.closePanel();
          if (this.ifLock) {
            this.unlockCar();
            this.ifLock = false;
            this.$message({
              message: "视角解锁",
              type: "success",
              offset: 90
            });
          }
          break;
        case "unlock":
          this.ifLock = true;
          this.lockCar();
          this.$message({
            message: "视角锁定",
            type: "success",
            offset: 90
          });
          break;
        case "lock":
          this.ifLock = false;
          this.unlockCar();
          this.$message({
            message: "视角解锁",
            type: "success",
            offset: 90
          });
          break;
      }
    }
  },
  mounted() {
    this.initComp();
  }
};
</script>

<style lang="less" scoped>
.left_outer_panel {
  width: 420px;
  height: 100px;
  grid-template-areas:
    "content_panel guide_line_panel "
    "bottom_padding_panel bottom_padding_panel";
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.center_outer_panel {
  width: 250px;
  height: 400px;
  grid-template-areas:
    "content_panel"
    "guide_line_panel "
    "bottom_padding_panel";
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: 4fr 1fr 5fr;
}

.right_outer_panel {
  width: 420px;
  height: 100px;
  grid-template-areas:
    "guide_line_panel content_panel"
    "bottom_padding_panel bottom_padding_panel";
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.outer_panel {
  display: grid;
  @lightBlue: rgb(33, 194, 237);
  @darkBlue: rgb(2, 77, 137);
  @warningRed: red;

  .content_panel {
    grid-area: content_panel;
    .base_info_panel {
      position: relative;
      width: 100%;
      height: 100%;
      background: fade(@darkBlue, 80);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border-radius: 10px;

      .text_panel {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 10px;

        .title_panel {
          width: 100%;
          height: 50px;
          padding-bottom: 5px;
          border-bottom: 2px solid white;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;

          .title_text_panel {
            color: white;
            font-size: 15px;
          }

          .title_menu_panel {
            width: 100px;
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            color: white;
            font-size: 15px;
            font-weight: 500;

            i {
              pointer-events: all;
              margin-left: 5px;
              &:hover {
                color: @lightBlue;
                cursor: pointer;
              }
            }

            .icon_lock {
              color: @lightBlue;
            }
          }
        }

        .car_info_item {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          .car_info_title {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            height: 100%;
            flex: 2;
            color: white;
            font-size: 12px;
          }

          .car_info_content {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            height: 100%;
            flex: 3;
            color: fade(white, 80);
            font-size: 12px;

            .color_panel {
              height: 10px;
              width: 30px;
            }
          }
        }

        .icon_panel {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          margin-right: 5px;

          .icon_whistle {
            font-size: 20px;
            color: white;
            font-weight: 700;
          }
        }
      }
      .border_panel {
        position: absolute;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;

        .border_corner_panel() {
          position: absolute;
          height: 30px;
          aspect-ratio: 1;
          box-sizing: border-box;
          border-width: 3px;
          border-style: solid;
          border-color: @lightBlue;
          border-radius: 0px;
          border-radius: 10px;
        }

        .border_corner_rt {
          .border_corner_panel();
          right: 0;
          top: 0;
          border-bottom-right-radius: 0px;
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
          border-left-width: 0px;
          border-bottom-width: 0px;
        }

        .border_corner_rb {
          .border_corner_panel();
          right: 0;
          bottom: 0;
          border-top-right-radius: 0px;

          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
          border-left-width: 0px;
          border-top-width: 0px;
        }

        .border_corner_lt {
          .border_corner_panel();
          left: 0;
          top: 0;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
          border-bottom-left-radius: 0px;
          border-right-width: 0px;
          border-bottom-width: 0px;
        }

        .border_corner_lb {
          .border_corner_panel();

          left: 0;
          bottom: 0;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
          border-top-left-radius: 0px;
          border-right-width: 0px;
          border-top-width: 0px;
        }
      }
    }
  }

  .guide_line_panel {
    grid-area: guide_line_panel;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .bottom_padding_panel {
    grid-area: bottom_padding_panel;
    pointer-events: none;
  }
}
</style>