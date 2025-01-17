<template>
  <folder-panel-component position="left" :title="title" height="400px">
    <template slot="menuIcon">
      <i class="title_icon iconfont icon-clock"></i>
      <i class="title_icon iconfont icon-calendar"></i>
      <i class="title_icon iconfont icon-close"></i>
    </template>
    <template slot="content">
      <div class="factory_truck_left_container">
        <div class="history_container">
          <history-truck-path-table-component
            :pathInfoList="supData.historyTruckPathList"
            :selectedId="supData.historyTruckPathSelectedId"
            :selectPath="supMethods.selectPath"
          ></history-truck-path-table-component>
        </div>
      </div>
    </template>
  </folder-panel-component>
</template>

<script>
import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
import HistoryTruckPathTableComponent from "@/views/index/factory/transport/path/history/components/HistoryTruckPathTableComponent";
const STATUS_LIVE = 0;
const STATUS_HISTORY = 1;
export default {
  name: "FactoryTransportPathHistoryLeftComponent",
  components: {
    FolderPanelComponent,
    HistoryTruckPathTableComponent,
  },
  props: ["supData", "supMethods"],
  data() {
    return {
      STATUS_LIVE,
      STATUS_HISTORY,
    };
  },
  computed: {
    title() {
      return this.supData.status === STATUS_LIVE
        ? "实时路线列表"
        : "历史路线列表";
    },
    truckPathList() {
      return this.supData.truckPathList;
    },
  },
  methods: {
    changeStatus(status) {
      this.supMethods.changeStatus(status);
    },
  },
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

  .history_container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
}
</style>
