<template>
  <div class="history_truck_path_container">
    <history-truck-component
      v-for="pathInfo of historyTruckPathList"
      v-if="pathInfo.id === showPathId"
      :key="pathInfo.id"
      :pathInfo="pathInfo"
    ></history-truck-component>
  </div>
</template>

<script>
import HistoryTruckComponent from "@/views/index/factory/transport/path/history/components/HistoryTruckComponent";
export default {
  name: "HistoryTruckPathComponent",
  components: { HistoryTruckComponent },
  props: ["historyTruckPathList", "showPathId"],
  mounted() {},
};
</script>

<style lang="less" scoped>
.history_truck_path_container {
  position: relative;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
}
</style>
