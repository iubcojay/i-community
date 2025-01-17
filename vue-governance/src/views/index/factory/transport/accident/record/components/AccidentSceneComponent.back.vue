<template>
  <div class="accident_scene_container">
    <div class="transport_outer_container">
      <transport-component
        v-for="transportInfo of transportInfoList"
        :key="transportInfo.id"
        :transport-info="transportInfo"
      ></transport-component>
    </div>
    <!-- <div class="fire_truck_outer_container">
      <fire-truck-component
        v-for="fireTruck of fireTruckInfoList"
        :key="fireTruck.id"
        :fire-truck-info="fireTruck"
      ></fire-truck-component>
    </div> -->
  </div>
</template>

<script>
import TransportComponent from "@/views/index/factory/transport/accident/record/components/TransportComponent";
import FireTruckComponent from "@/views/index/factory/transport/accident/record/components/FireTruckComponent";
export default {
  name: "AccidentSceneComponent",
  components: {
    TransportComponent,
    FireTruckComponent,
  },
  props: ["accidentInfo"],
  data() {
    return {
      // transportModelUrl:
      //   this.$StaticResourceAddress + "/model/factory/car/fuel_truck1.glb",
      // fireTruckModelUrl:
      //   this.$StaticResourceAddress + "/model/factory/car/fire_truck.glb",

      transportInfoList: [],
      fireTruckInfoList: [],
    };
  },
  methods: {
    resetAccidentScene() {
      this.clearScene();
      this.setClock();
      this.initScene();
      window.myEarth.viewer.clock.shouldAnimate = true;
      window.myEarth.viewer.clockViewModel.multiplier = 500;
    },
    setClock() {
      const startTimestamp = this.accidentInfo.interval[0];
      const endTimestamp = this.accidentInfo.interval[1];
      const viewer = window.myEarth.viewer;
      let startTime = Cesium.JulianDate.fromDate(new Date(startTimestamp));
      let stopTime = Cesium.JulianDate.fromDate(new Date(endTimestamp));
      viewer.clock.startTime = startTime.clone();
      viewer.clock.stopTime = stopTime.clone();
      viewer.clock.currentTime = startTime.clone();
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
      viewer.clock.shouldAnimate = false;
    },
    initScene() {
      const process = this.accidentInfo.process;
      process.forEach((step) => {
        this.handleTimeStep(step);
      });
    },
    handleTimeStep(step) {
      const entities = step.entities;
      const timestamp = step.timestamp;
      // 添加已有的车辆
      for (let entity of entities) {
        switch (entity.type) {
          case "transport":
            this.updateTransportInfo(entity, timestamp);
            break;
          case "fireTruck":
            this.updateFireTruckInfo(entity, timestamp);
            break;
        }
      }
    },

    updateTransportInfo(entity, timestamp) {
      let transportInfo = this.transportInfoList.find(
        (transport) => transport.id === entity.id
      );
      // 初始化
      if (transportInfo === undefined) {
        transportInfo = this.addTransportInfo(entity);
      }
      // 更新信息

      if (entity.status === "running") {
        const runningInfo = transportInfo["running"];
        if (runningInfo.interval === undefined) {
          runningInfo.interval = [timestamp, timestamp];
        } else {
          runningInfo.interval[1] = timestamp;
        }
        const lastPositionInfo = runningInfo.positions.at(-1);
        if (
          lastPositionInfo !== undefined &&
          JSON.stringify(lastPositionInfo.position) ===
            JSON.stringify(entity.position)
        ) {
          lastPositionInfo.timestamp = timestamp;
        } else {
          runningInfo.positions.push({
            timestamp,
            position: entity.position,
          });
        }
      } else if (entity.status === "accident") {
        const runningInfo = transportInfo["running"];
        const accidentInfo = transportInfo["accident"];
        const lastRunningPositionInfo = runningInfo.positions.at(-1);
        if (
          accidentInfo.interval === undefined &&
          JSON.stringify(lastRunningPositionInfo.position) !==
            JSON.stringify(entity.position)
        ) {
          runningInfo.interval[1] = timestamp;
          runningInfo.positions.push({
            timestamp,
            position: entity.position,
          });
        }

        if (accidentInfo.interval === undefined) {
          accidentInfo.interval = [timestamp, timestamp];
        } else {
          accidentInfo.interval[1] = timestamp;
        }

        accidentInfo.position = entity.position;
      } else {
        const breakdownInfo = transportInfo["breakdown"];

        if (breakdownInfo.interval === undefined) {
          breakdownInfo.interval = [timestamp, timestamp];
        } else {
          breakdownInfo.interval[1] = timestamp;
        }
        breakdownInfo.position = entity.position;
      }
    },
    updateFireTruckInfo(entity, timestamp) {
      let fireTruckInfo = this.fireTruckInfoList.find(
        (fireTruck) => fireTruck.id === entity.id
      );

      // 初始化
      if (fireTruckInfo === undefined) {
        fireTruckInfo = this.addFireTruckInfo(entity);
      }

      // 更新信息
      if (entity.status === "to") {
        const toInfo = fireTruckInfo["to"];
        if (toInfo.interval === undefined) {
          toInfo.interval = [timestamp, timestamp];
        } else {
          toInfo.interval[1] = timestamp;
        }
        const lastPositionInfo = toInfo.positions.at(-1);
        if (
          lastPositionInfo !== undefined &&
          JSON.stringify(lastPositionInfo.position) ===
            JSON.stringify(entity.position)
        ) {
          lastPositionInfo.timestamp = timestamp;
        } else {
          toInfo.positions.push({
            timestamp,
            position: entity.position,
          });
        }
      } else if (entity.status === "rescue") {
        const toInfo = fireTruckInfo["to"];
        const rescueInfo = fireTruckInfo["rescue"];
        const lastToPositionInfo = toInfo.positions.at(-1);
        if (
          rescueInfo.interval === undefined &&
          JSON.stringify(lastToPositionInfo.position) !==
            JSON.stringify(entity.position)
        ) {
          toInfo.interval[1] = timestamp;
          toInfo.positions.push({
            timestamp,
            position: entity.position,
          });
        }

        if (rescueInfo.interval === undefined) {
          rescueInfo.interval = [timestamp, timestamp];
        } else {
          rescueInfo.interval[1] = timestamp;
        }
        rescueInfo.position = entity.position;
      } else {
        const backInfo = fireTruckInfo["back"];
        if (backInfo.interval === undefined) {
          backInfo.interval = [timestamp, timestamp];
        } else {
          backInfo.interval[1] = timestamp;
        }
        const lastPositionInfo = backInfo.positions.at(-1);
        if (
          lastPositionInfo !== undefined &&
          JSON.stringify(lastPositionInfo.position) ===
            JSON.stringify(entity.position)
        ) {
          lastPositionInfo.timestamp = timestamp;
        } else {
          backInfo.positions.push({
            timestamp,
            position: entity.position,
          });
        }
      }
    },

    addTransportInfo(entity) {
      const transportInfo = {
        id: entity.id,
        plateNumber: entity.plateNumber,
        running: {
          interval: undefined,
          positions: [],
        },
        accident: {
          interval: undefined,
          position: undefined,
        },
        breakdown: {
          interval: undefined,
          position: undefined,
        },
      };
      this.transportInfoList.push(transportInfo);
      return transportInfo;
    },

    addFireTruckInfo(entity) {
      const fireTruckInfo = {
        id: entity.id,
        to: {
          interval: undefined,
          positions: [],
        },
        rescue: {
          interval: undefined,
          position: undefined,
        },
        back: {
          interval: undefined,
          positions: [],
        },
      };
      this.fireTruckInfoList.push(fireTruckInfo);
      return fireTruckInfo;
    },

    clearScene() {
      this.transportInfoList.splice(0, this.transportInfoList.length);
      this.fireTruckInfoList.splice(0, this.transportInfoList.length);
    },
  },
  beforeDestroy() {
    this.clearScene();
  },
  watch: {
    accidentInfo: {
      immediate: true,
      handler(newValue) {
        if (newValue !== undefined && newValue !== null) {
          this.resetAccidentScene();
        }
      },
    },
  },
};
</script>

<style lang="less" scoped>
.accident_scene_container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .transport_outer_container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .fire_truck_outer_container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
