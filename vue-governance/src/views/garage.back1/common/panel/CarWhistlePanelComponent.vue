<template>
  <div class="outer_panel" ref="outerPanel">
    <div class="content_panel">
      <div class="left_line_panel"></div>
      <div class="whistle_panel">
        <div class="text_panel">
          <div class="icon_panel">
            <i class="iconfont icon-whistle icon_whistle"></i>
          </div>
          <span>持续鸣笛</span>
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
  name: "CarWhistlePanelComponent",
  props: {
    position: {
      default: "center"
    }
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
        const height = 40;
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        const ctx = canvas.getContext("2d");


        // 画线
        ctx.save();
        ctx.strokeStyle = "rgb(2, 77, 137)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width * 0.75, height);
        ctx.lineTo(width * 0.85, 0.5 * height);
        ctx.lineTo( width, 0.5 * height);
        ctx.stroke();
        ctx.restore();
      });
    },
    drawCenterGuideLine() {
      this.$nextTick(() => {
        const canvas = this.$refs.guideLineCanvas;
        const width = 120;
        const height = 25;

        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        const ctx = canvas.getContext("2d");

        // 画圆
        // ctx.save();
        // ctx.fillStyle = "rgb(2, 77, 137)";
        // ctx.beginPath();
        // ctx.arc(width * 0.5, 0.9 * height, 0.1 * height, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.restore();

        // 画线
        // ctx.save();
        // ctx.strokeStyle = "rgb(2, 77, 137)";
        // ctx.lineWidth = 3;
        // ctx.beginPath();
        // ctx.moveTo(width * 0.5, 0.9 * height);
        // ctx.lineTo(width * 0.5, 0.01 * height);
        // ctx.stroke();
        // ctx.restore();
      });
    },
    drawLeftGuideLine() {
       this.$nextTick(() => {
        const canvas = this.$refs.guideLineCanvas;
        const width = 280;
        const height = 40;
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
  height: 80px;
  grid-template-areas:
    "content_panel guide_line_panel "
    "bottom_padding_panel bottom_padding_panel";
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  grid-template-rows:  minmax(0, 1fr)  minmax(0, 1fr);
}

.center_outer_panel {
  width: 120px;
  height: 120px;
  grid-template-areas:
    "content_panel"
    "guide_line_panel "
    "bottom_padding_panel";
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
}

.right_outer_panel {
  width: 420px;
  height: 80px;
  grid-template-areas:
    "guide_line_panel content_panel"
    "bottom_padding_panel bottom_padding_panel";
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
}

.outer_panel {
  display: grid;
  @lightBlue: rgb(33, 194, 237);
  @darkBlue: rgb(2, 77, 137);
  @warningRed: red;

  .content_panel {
    grid-area: content_panel;
    .whistle_panel {
      position: relative;
      width: 100%;
      height: 100%;
      background: fade(@darkBlue, 80);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border-radius: 5px;

      animation: warning_border infinite 1s ease-in-out alternate-reverse;

      @keyframes warning_border {
        0% {
          box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0);
        }

        100% {
          box-shadow: 0 0 10px 3px @warningRed;
        }
      }

      .text_panel {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-weight: 700;
        color: white;

        .icon_panel {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          margin-right: 5px;

          .icon_whistle {
            font-size: 18px;
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
          height: 30%;
          aspect-ratio: 1;
          box-sizing: border-box;
          border-width: 2px;
          border-style: solid;
          border-color: @warningRed;
          border-radius: 0px;
          border-radius: 5px;
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