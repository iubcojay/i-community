<template>
  <div class="side_bar_panel">
    <div class="left_panel">
      <slot name="leftPanel"></slot>
    </div>
    <div class="right_panel">
      <slot name="rightPanel"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideBarComponent",
};
</script>

<style scoped>
.side_bar_panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.left_panel {
  position: absolute;
  top: 90px;
  left: 10px;
  height: calc(100% - 100px);
  width: 500px;
}

.right_panel {
  position: absolute;
  top: 90px;
  right: 10px;
  height: calc(100% - 100px);
  width: 500px;
}
</style>
