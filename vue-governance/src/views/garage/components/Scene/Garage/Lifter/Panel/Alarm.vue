<template>
  <div class="alarm_outer_panel" ref="alarm_outer_panel" :style="position">
    <div class="alarm_panel">
      <div class="border_panel">
        <div
          v-for="position of ['lt', 'rt', 'rb', 'lb']"
          :class="['border_corner_' + position]"
          :key="position"
        ></div>
      </div>

      <div class="content_panel">
        {{ content }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Alarm",
  props: {
    width: {
      default: 120,
    },
    height: {
      default: 50,
    },
    content: {
      default: "道闸故障",
    },
    position: { default: { left: 0, bottom: 0 } },
  },
  methods: {
    initComp() {
      this.$refs["alarm_outer_panel"].style.width = this.width + "px";
      this.$refs["alarm_outer_panel"].style.height = this.height + "px";
    },
  },
  mounted() {
    this.initComp();
  },
};
</script>

<style lang="less" scoped>
.alarm_outer_panel {
  position: absolute;
  width: 300px;
  height: 100px;
  transform: translateX(-50%) translateY(-50%);
  .alarm_panel {
    @lightBlue: rgb(33, 194, 237);
    @darkBlue: rgb(2, 77, 137);
    @warningRed: red;
    position: absolute;
    background: fade(@darkBlue, 60);
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 8px;
    animation: warning_border infinite 1s ease-in-out alternate-reverse;

    @keyframes warning_border {
      0% {
        box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0);
      }

      100% {
        box-shadow: 0 0 10px 3px @warningRed;
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
        border-width: 4px;
        border-style: solid;
        border-color: @warningRed;
        border-radius: 0px;
        border-radius: 8px;
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

    .content_panel {
      position: absolute;
      left: 10px;
      top: 10px;
      right: 10px;
      bottom: 10px;
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      z-index: 1;
      color: white;
      font-weight: 700;
      font-size: 16px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  }
}
</style>
