<template>
  <div>
    <div
      :style="{
        left: positionArray[0] + 'px',
        bottom: positionArray[3] + 'px',
      }"
      class="area_poi_outer_container"
      @mouseenter="mouseenterHandle"
      @mouseleave="mouseleaveHandle"
    >
      <div class="area_poi_inner_container">
        <div class="text_panel">
          {{ areaName }}
        </div>
        <div class="icon_pin_panel">
          <i class="iconfont icon-address icon_address"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AreaPoiComponent",
  props: ["areaName", "positionArray", "mouseenterHandle", "mouseleaveHandle"],
};
</script>

<style lang="less" scoped>
.area_poi_outer_container {
  position: absolute;
  width: auto;
  height: auto;
  transform: translateX(-50%);
  pointer-events: all;
  &:hover {
    cursor: pointer;
    animation: float_up_down 1s ease-in-out infinite alternate-reverse;

    @keyframes float_up_down {
      0% {
        transform: translateX(-50%) translateY(-5%);
      }
      100% {
        transform: translateX(-50%) translateY(5%);
      }
    }
  }

  .area_poi_inner_container {
    width: auto;
    height: auto;
    color: white;

    .text_panel {
      width: auto;
      height: 30px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-weight: 700;
      font-size: 22;
      padding: 0px 10px;
      text-shadow: 0 0 10px #478de0, 0 0 20px #478de0, 0 0 30px #478de0;
    }

    .icon_pin_panel {
      width: auto;
      height: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      i {
        font-size: 27 px;
        font-weight: 700;
      }
    }
  }
}
</style>
