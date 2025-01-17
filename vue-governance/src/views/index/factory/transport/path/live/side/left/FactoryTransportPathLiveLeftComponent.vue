<template>
  <folder-panel-component position="left" title="实时路线列表" height="400px">
    <template slot="menuIcon">
      <i class="title_icon iconfont icon-clock"></i>
      <i class="title_icon iconfont icon-calendar"></i>
      <i class="title_icon iconfont icon-close"></i>
    </template>
    <template slot="content">
      <div class="factory_truck_left_container">
        <div class="live_container">
          <live-truck-path-table-component
            :truckPathList="truckPathList"
          ></live-truck-path-table-component>
        </div>
      </div>
    </template>
  </folder-panel-component>
</template>

<script>
import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
import LiveTruckPathTableComponent from "@/views/index/factory/transport/path/live/components/LiveTruckPathTableComponent";
export default {
  name: "FactoryTransportPathLiveLeftComponent",
  components: {
    FolderPanelComponent,
    LiveTruckPathTableComponent,
  },
  props: ["supData", "supMethods"],
  data() {
    return {};
  },
  computed: {
    truckPathList() {
      return this.supData.truckPathList;
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.title_icon {
  color: white;
  &.active {
    color: var(--lightBlue) !important;
    &:hover {
      cursor: default !important;
    }
  }
}

.factory_truck_left_container {
  width: 100%;
  height: 300px;
  position: relative;
  .live_container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
}
</style>
