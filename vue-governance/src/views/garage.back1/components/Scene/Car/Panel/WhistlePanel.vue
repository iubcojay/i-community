<template>
  <div
    class="outer_panel"
    ref="outerPanel"
    :style="position"
    :class="{
      center_outer_panel: location === 'center',
      right_outer_panel: location === 'right',
      left_outer_panel: location === 'left',
    }"
  >
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
            v-for="position of ['lt', 'rt', 'rb', 'lb']"
            :class="['border_corner_' + position]"
            :key="position"
          ></div>
        </div>
      </div>
    </div>
    <div v-show="location !== 'center'" class="guide_line_panel">
      <canvas ref="guideLineCanvas"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  name: "WhistlePanel",
  props: {
    position: { default: { left: 0, bottom: 0 } },
    location: {
      default: "center",
    },
  },
  methods: {
    initComp() {
      this.initGuideLine();
    },
    initGuideLine() {
      this.drawGuideLine();
    },
    drawGuideLine() {
      this.$nextTick(() => {
        const canvas = this.$refs.guideLineCanvas;
        const width = 60;
        const height = 40;
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        const ctx = canvas.getContext("2d");

        // 画线
        ctx.save();
        ctx.strokeStyle = "rgb(2, 77, 137)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(width * 0.5, 0.5 * height);
        ctx.lineTo(width, 0.5 * height);
        ctx.stroke();
        ctx.restore();
      });
    },
  },
  mounted() {
    this.initComp();
  },
};
</script>

<style lang="less" scoped>
.left_outer_panel {
  width: fit-content;
  height: fit-content;
  flex-direction: row;
  transform: translateY(-50%) translateX(-100%);

  .guide_line_panel {
    transform: rotateY(180deg);
  }
}

.center_outer_panel {
  width: fit-content;
  height: fit-content;
  flex-direction: row;
  transform: translateX(-50%) translateY(-50%);
}

.right_outer_panel {
  width: fit-content;
  height: fit-content;
  flex-direction: row-reverse;
  transform: translateY(-50%);
}

.outer_panel {
  position: absolute;
  display: flex;
  @lightBlue: rgb(33, 194, 237);
  @darkBlue: rgb(2, 77, 137);
  @warningRed: red;

  .content_panel {
    width: 120px;
    height: 40px;
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
    width: 60px;
    height: 40px;
    pointer-events: none;
  }
}
</style>
