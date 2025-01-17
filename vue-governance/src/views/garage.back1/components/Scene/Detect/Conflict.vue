<template>
  <div class="outer_panel" ref="outerPanel" :style="position">
    <div class="content_panel">
      <div class="header">
        矛盾冲突
      </div>
      <div class="main">
        <div class="conflict_content">{{ info.content }}</div>
        <div class="car_list_container">
          <div
            class="car_item_container"
            v-for="car of info.cars"
            v-if="car.id"
          >
            <div class="car_info_item">
              <div class="car_info_title">车牌号</div>
              <div class="car_info_content">{{ car.license }}</div>
            </div>
            <div class="car_info_item">
              <div class="car_info_title">车型</div>
              <div class="car_info_content">{{ car.type }}</div>
            </div>
            <div class="car_info_item">
              <div class="car_info_title">颜色</div>
              <div class="car_info_content">
                <div
                  class="color_panel"
                  :style="{ background: car.color }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="border_panel">
        <div
          v-for="position of ['lt', 'rt', 'rb', 'lb']"
          :class="['border_corner_' + position]"
          :key="position"
        ></div>
      </div>
    </div>
    <div class="guide_line_panel">
      <canvas ref="guideLineCanvas"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseInfo",
  props: {
    position: { default: { left: 0, bottom: 0 } },
    info: {},
  },
  data() {
    return {};
  },
  methods: {
    initComp() {
      this.initGuideLine();
    },
    initGuideLine() {
      this.drawCenterGuideLine();
    },

    drawCenterGuideLine() {
      this.$nextTick(() => {
        const canvas = this.$refs.guideLineCanvas;
        const width = 400;
        const height = 70;

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
  },

  mounted() {
    this.initComp();
  },
};
</script>

<style lang="less" scoped>
.outer_panel {
  position: absolute;
  left: 0;
  right: 0;
  height: fit-content;
  width: fit-content;
  @lightBlue: rgb(33, 194, 237);
  @darkBlue: rgb(2, 77, 137);
  @warningRed: red;
  transform: translateX(-50%);

  .content_panel {
    position: relative;
    width: 400px;
    height: fit-content;
    background: fade(@darkBlue, 80);
    padding: 0px;
    color: white;

    animation: warning_border infinite 1s ease-in-out alternate-reverse;

    @keyframes warning_border {
      0% {
        box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0);
      }

      100% {
        box-shadow: 0 0 10px 3px @warningRed;
      }
    }

    .header {
      height: 20px;
      border-bottom: 1px solid white;
      padding: 10px;
      font-weight: 700;
    }

    .main {
      height: auto;
      width: auto;
      padding: 10px;

      .conflict_content {
        height: 25px;
        line-height: 25px;
      }

      .car_list_container {
        width: auto;
        height: auto;
        display: flex;
        flex-direction: row;
        .car_item_container {
          height: fit-content;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;

          .car_info_item {
            width: 100%;
            height: fit-content;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;

            .car_info_title {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;
              height: 100%;
              flex: 2;
              color: white;
              font-size: 14px;
              font-weight: 700;
            }

            .car_info_content {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;
              height: 100%;
              flex: 3;
              color: fade(white, 80);
              font-size: 14px;

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
      }
    }

    .border_panel {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;

      .border_corner_panel() {
        position: absolute;
        height: 30px;
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

  .guide_line_panel {
    width: 400px;
    height: 70px;
    pointer-events: none;
  }
}
</style>
