<template>
  <div class="area_name_pin_outer_panel" :style="positionStyle">
    <div class="text_panel">{{areaInfo.name}}</div>
  </div>
</template>

<script>
export default {
  name: "AreaNamePinComponent",
  props: ["areaInfo"],
  computed: {
    positionStyle() {
      return {
        left: this.areaInfo.winPos[0] - 100 + "px",
        bottom: this.areaInfo.winPos[3] + "px"
      };
    }
  },
};
</script>

<style lang="less" scoped>
.area_name_pin_outer_panel {
  width: 200px;
  height: 80px;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: rgba(24, 49, 85, 0.8);
  border-radius: 15px;

  &::before {
    content: "";
    position: absolute;
    border: 12px solid;
    border-color: rgba(24, 49, 85, 0.8) transparent transparent transparent;
    bottom: -24px;
    left: 100px - 12px;
  }

  .text_panel {
    font-size: 23px;
    color: white;
    font-weight: 700;
  }
}
</style>