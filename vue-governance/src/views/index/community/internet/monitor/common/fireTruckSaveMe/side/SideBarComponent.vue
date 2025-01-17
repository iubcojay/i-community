<!--<template>-->
<!--  <div class="side_bar_panel">-->
<!--    <div class="left_panel">-->
<!--      <slot name="leftPanel"></slot>-->
<!--    </div>-->
<!--    <div class="right_panel">-->
<!--      <slot name="rightPanel"></slot>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: "SideBarComponent",-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.side_bar_panel {-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  pointer-events: none;-->
<!--}-->

<!--.left_panel {-->
<!--  position: absolute;-->
<!--  top: 90px;-->
<!--  left: 10px;-->
<!--  height: calc(100% - 100px);-->
<!--  width: 500px;-->
<!--}-->

<!--.right_panel {-->
<!--  position: absolute;-->
<!--  top: 100px;-->
<!--  right: 800px;-->
<!--  height: calc(100%);-->
<!--  width: 500px;-->
<!--  background-color: #0d5692;-->
<!--}-->
<!--</style>-->
<template>
  <div class="side_bar_panel">
    <div class="left_panel">
      <slot name="leftPanel"></slot>
    </div>
    <div class="right_panel">
      <slot name="rightPanel"></slot>
    </div>
    <div class="right_right_panel">
      <slot name="right_right_Panel"></slot>
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
  top: 250px;
  right: 800px;
  height: calc(50%);
  width: 500px;
}
.right_right_panel {
  position: absolute;
  top: 90px;
  right: 10px;
  height: calc(100% - 100px);
  width: 500px;
}
</style>
