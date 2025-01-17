<template>
  <div class="scene_poi_outer_panel" :style="positionStyle">
    <div class="light_panel">
      <div
        class="text_panel"
        :class="{ active_text_panel: ifActive }"
        @click="clickHandler(id)"
      >
        {{ text }}
      </div>
      <div class="icon_pin_panel">
        <i class="iconfont icon-address icon_address"></i>
      </div>
    </div>
    <div class="shadow_panel"></div>
  </div>
</template>

<script>
export default {
  name: "ScenePoiComponent",
  props: ["id", "text", "position", "ifActive", "clickHandler"],

  computed: {
    positionStyle() {
      return {
        left: this.position.x + "px",
        bottom: this.position.y + "px",
      };
    },
  },
};
</script>

<style lang="less" scoped>
.scene_poi_outer_panel {
  position: absolute;
  min-width: 150px;
  height: 100px;
  transform: translateX(-50%);
  animation: glowingText 2s infinite reverse;
  z-index: 1;
  pointer-events: all;

  @keyframes glowingText {
    0% {
      text-shadow: 0 0 5px #478ce050, 0 0 10px #478ce050, 0 0 15px #478ce050;
    }
    50% {
      text-shadow: 0 0 10px #478de0, 0 0 20px #478de0, 0 0 30px #478de0;
    }
    100% {
      text-shadow: 0 0 5px #478ce050, 0 0 10px #478ce050, 0 0 15px #478ce050;
    }
  }

  .light_panel {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 100%;
    transform: translate(-50%, -50%);

    .text_panel {
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: white;
      font-weight: bold;
      font-size: 25px;
      white-space: nowrap;
      transition: 0.2s;

      &:hover {
        cursor: pointer;
        .active_text_panel();
      }
    }

    .active_text_panel {
      animation: up_down 0.5s ease-in-out infinite alternate;

      @keyframes up_down {
        0% {
          transform: scale(1.1) translateY(3px);
        }

        100% {
          transform: scale(1.1) translateY(-3px);
        }
      }
    }

    .icon_pin_panel {
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .icon_address {
        color: white;
        font-size: 40px;
        font-weight: bold;
      }
    }
  }
}
</style>
