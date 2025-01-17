<template>
  <div class="test_pin_outer_panel">
    <!-- <AccidentPoiComponent /> -->
    <PublicSentimentPoiComponent :show="true" />
  </div>
</template>

<script>
import PublicSentimentPoiComponent from "@/views/index/factory/home/components/PublicSentimentPoiComponent";
import AccidentPoiComponent from "../index/factory/home/components/AccidentPoiComponent.vue";
export default {
  name: "TestPinPage",
  components: { PublicSentimentPoiComponent, AccidentPoiComponent },
};
</script>

<style lang="less" scoped>
.test_pin_outer_panel {
  position: relative;
  width: 100%;
  height: 100%;
  background: burlywood;
}
</style>
