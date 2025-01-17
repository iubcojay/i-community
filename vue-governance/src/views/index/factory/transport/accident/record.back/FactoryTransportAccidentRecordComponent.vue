<template>
  <div class="transport_accident_container">
    <div class="side_bar_container">
      <side-bar-component>
        <factory-transport-accident-record-left-component
          v-show="ifSideBarShow.ifLeftPanelShow"
          slot="leftPanel"
          :sup-methods="leftMethods"
          :sup-data="leftData"
          ref="leftPanel"
        ></factory-transport-accident-record-left-component>
      </side-bar-component>
    </div>

    <div class="accident_container">
      <accident-scene-component
        v-if="selectedAccident"
        :accident-info="selectedAccident"
      ></accident-scene-component>
    </div>
  </div>
</template>

<script>
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";
import FactoryTransportAccidentRecordLeftComponent from "@/views/index/factory/transport/accident/record/side/FactoryTransportAccidentRecordLeftComponent";
import AccidentSceneComponent from "@/views/index/factory/transport/accident/record/components/AccidentSceneComponent";
export default {
  name: "FactoryTransportAccidentRecordComponent",
  components: {
    SideBarComponent,
    FactoryTransportAccidentRecordLeftComponent,
    AccidentSceneComponent,
  },
  data() {
    return {
      ifSideBarShow: { ifLeftPanelShow: true, ifRightPanelShow: false },
      accidentList: [],
      selectedAccidentId: -1,
    };
  },
  computed: {
    leftData() {
      return {
        accidentList: this.accidentList,
        selectedAccidentId: this.selectedAccidentId,
      };
    },

    leftMethods() {
      return {
        selectAccident: this.selectAccident,
      };
    },

    selectedAccident() {
      return this.accidentList.find(
        (accident) => accident.id === this.selectedAccidentId
      );
    },
  },
  methods: {
    initComp() {
      this.setAccidentList();
      this.initPosition();
    },

    initPosition() {
      const position = Cesium.Cartesian3.fromDegrees(117.1507, 36.67586, 2486);
      const offset = Cesium.HeadingPitchRoll.fromDegrees(0, -50, 0);
      window.myEarth.viewer.camera.flyTo({
        destination: position,
        orientation: offset,
        duration: 1,
      });
    },
    async setAccidentList() {
      const result = await this.$axios.get(
        this.$ServerAddress + "/factory/transport/accident/list"
      );
      if (result.status === 200) {
        this.accidentList.push(...result.data);
      }
    },

    selectAccident(id) {
      this.selectedAccidentId = id;
    },
  },

  mounted() {
    this.initComp();
  },
};
</script>

<style lang="less" scoped>
.transport_accident_container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  user-select: none;

  .side_bar_container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  .accident_container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
}
</style>
