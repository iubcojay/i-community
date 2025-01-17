<template>
  <div
    class="icon_pin_panel"
    :class="{ infinite_rotation: ifRotation }"
    :style="pinStyle"
  >
    <div class="icon_pin_content">
      <i class="icon_pin_icon iconfont" :class="iconClass"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "FacilityPinComponent",
  props: ["winPos", "iconClass", "ifRotation"],

  mounted() {},
  computed: {
    pinStyle() {
      return {
        left: `${this.winPos[0] - 20}px`,
        bottom: `${this.winPos[3]}px`,
      };
    },
  },
};
</script>

<style lang="less" scoped>
.icon_pin_panel {
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border: double 5px currentColor;
  border-radius: 20px 20px 20px 0;
  transform: rotateZ(-45deg);
  position: absolute;
  box-shadow: 0px 0px 10px rgb(64, 158, 255);
  z-index: 1;
  color: rgb(64, 158, 255);

  .icon_pin_content {
    width: 100%;
    height: 100%;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    transform: rotate(45deg);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .icon_pin_icon {
      font-size: 25px;
    }
  }
}

.infinite_rotation {
  animation: infinite_rotation 3s infinite linear;
}

@keyframes infinite_rotation {
  0% {
    transform: rotateY(0deg) rotateZ(-45deg);
  }

  100% {
    transform: rotateY(360deg) rotateZ(-45deg);
  }
}
</style>
