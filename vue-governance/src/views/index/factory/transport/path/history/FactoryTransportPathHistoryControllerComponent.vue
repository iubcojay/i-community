<template>
  <div class="factory_truck_container">
    <side-bar-component>
      <factory-transport-path-history-left-component
        v-show="ifSideBarShow.ifLeftPanelShow"
        slot="leftPanel"
        :sup-methods="leftMethods"
        :sup-data="leftData"
        ref="leftPanel"
      ></factory-transport-path-history-left-component>
      <factory-transport-path-history-right-component
        v-show="ifSideBarShow.ifRightPanelShow"
        slot="rightPanel"
        :sup-methods="rightMethods"
        :sup-data="rightData"
        ref="rightPanel"
      ></factory-transport-path-history-right-component>
    </side-bar-component>
    <div class="truck_history_path_container">
      <history-truck-path-component
        :historyTruckPathList="historyTruckPathList"
        :showPathId="historyTruckPathSelectedId"
      ></history-truck-path-component>
    </div>
  </div>
</template>

<script>
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";
import FactoryTransportPathHistoryLeftComponent from "@/views/index/factory/transport/path/history/side/FactoryTransportPathHistoryLeftComponent";
import FactoryTransportPathHistoryRightComponent from "@/views/index/factory/transport/path/history/side/FactoryTransportPathHistoryRightComponent";
import HistoryTruckPathComponent from "@/views/index/factory/transport/path/history/components/HistoryTruckPathComponent";

import { mapMutations } from "vuex";

export default {
  name: "FactoryTransportPathHistoryControllerComponent",
  components: {
    SideBarComponent,
    FactoryTransportPathHistoryLeftComponent,
    FactoryTransportPathHistoryRightComponent,
    HistoryTruckPathComponent,
  },
  data() {
    return {
      ifSideBarShow: { ifLeftPanelShow: true, ifRightPanelShow: false },
      truckPathList: [],
      historyTruckPathList: [],
      historyTruckPathSelectedId: -1,
    };
  },
  computed: {
    leftData() {
      return {
        truckPathList: this.truckPathList,
        historyTruckPathList: this.historyTruckPathList,
        historyTruckPathSelectedId: this.historyTruckPathSelectedId,
      };
    },

    leftMethods() {
      return {
        selectPath: this.selectHistoryPath.bind(this),
      };
    },

    rightData() {
      return {
        selectedHistoryTruckPathInfo: this.historyTruckPathList.find(
          (item) => item.id === this.historyTruckPathSelectedId
        ),
      };
    },

    rightMethods() {
      return {};
    },
  },
  methods: {
    ...mapMutations("menuAbout", ["setIfBottomMenuFold"]),
    ...mapMutations("regionAbout", ["setCurrentRegion"]),
    async initPage() {
      this.hindBottomMenu();
      await this.initPosition();
      await this.getHistoryTruckPathList();
    },

    hindBottomMenu() {
      this.setIfBottomMenuFold(true);
    },

    async initPosition() {
      const targetPosition = [2.044715790240727, 0.6404916950536464, 0];
      const height = 2500;
      const angleOffset = [(0 * Math.PI) / 180, (-45 * Math.PI) / 180, 0];
      let duration = 0.5;

      if (this.$store.state.regionAbout.currentRegion.name !== "历下区") {
        duration = 0;
      }
      window.myEarth.flyToPosition(
        targetPosition,
        height,
        angleOffset,
        duration
      );
      this.setCurrentRegion({ name: "factory" });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, duration * 1000);
      });
    },

    setTruckPathList(newTruckPathList) {
      this.truckPathList.splice(0, this.truckPathList.length);
      this.truckPathList.push(...newTruckPathList);
    },

    async getHistoryTruckPathList() {
      const result = await this.$axios.get("/factory/truck/path/list");
      if (result.status === 200) {
        this.historyTruckPathList.push(...result.data);
      }
    },

    selectHistoryPath(id) {
      this.ifSideBarShow.ifRightPanelShow = true;
      this.historyTruckPathSelectedId = id;
    },
  },
  mounted() {
    this.initPage();
  },

  beforeDestroy() {},
};
</script>

<style lang="less" scoped>
.factory_truck_container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  user-select: none;

  .truck_history_path_container {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
}
</style>
