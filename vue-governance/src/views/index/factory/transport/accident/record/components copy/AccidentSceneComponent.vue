<template>
  <div class="accident_scene_container">
    <div class="transport_outer_container">
      <transport-component
        v-for="transportInfo of transportInfoList"
        :key="transportInfo.id"
        :transport-info="transportInfo"
      ></transport-component>
    </div>
    <div class="fire_truck_outer_container">
      <fire-truck-component
        v-for="fireTruck of fireTruckInfoList"
        :key="fireTruck.id"
        :fire-truck-info="fireTruck"
        :accidentPosition="accidentPosition"
      ></fire-truck-component>
    </div>
    <div class="time_line_container">
      <time-line-component
        v-if="timelineShow"
        :startTimeStamp="this.interval[0]"
        :endTimeStamp="this.interval[1]"
      ></time-line-component>
    </div>
  </div>
</template>

<script>
import TransportComponent from "@/views/index/factory/transport/accident/record/components/TransportComponent";
import FireTruckComponent from "@/views/index/factory/transport/accident/record/components/FireTruckComponent";
import TimeLineComponent from "@/views/index/factory/transport/accident/record/components/TimeLineComponent";
export default {
  name: "AccidentSceneComponent",
  components: {
    TransportComponent,
    FireTruckComponent,
    TimeLineComponent,
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
      accidentPosition: undefined,
    };
  },
  computed: {
    interval() {
      return this.accidentInfo ? this.accidentInfo.interval : [0, 0];
    },
    timelineShow() {
      return this.accidentInfo !== undefined;
    },
  },
  methods: {
    resetAccidentScene() {
      this.clearScene();
      this.setClock();
      this.initScene();
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
      viewer.clockViewModel.multiplier = 1;
    },
    initScene() {
      this.initVehicles();
      this.setAccidentPosition();
      const process = this.accidentInfo.process;
      process.forEach((step) => {
        this.handleTimeStep(step);
      });
    },
    setAccidentPosition() {
      this.accidentPosition = this.accidentInfo.accidentPosition;
    },
    initVehicles() {
      const relativeVehicles = this.accidentInfo.relativeVehicles;
      relativeVehicles.forEach((vehicle) => {
        switch (vehicle.type) {
          case "transport":
            this.addTransportInfo(vehicle);
            break;
          case "fireTruck":
            this.addFireTruckInfo(vehicle);
            break;
        }
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
      if (!transportInfo) {
        return;
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
          // 如果原地没动
          lastPositionInfo.timestamp = timestamp;
        } else {
          // 正常行驶
          runningInfo.positions.push({
            timestamp,
            position: entity.position,
          });
        }
      } else if (entity.status === "accident") {
        // const runningInfo = transportInfo["running"];
        const accidentInfo = transportInfo["accident"];
        // const lastRunningPositionInfo = runningInfo.positions.at(-1);
        // if (
        //   accidentInfo.interval !== undefined &&
        //   JSON.stringify(lastRunningPositionInfo.position) !==
        //     JSON.stringify(entity.position)
        // ) {
        //   runningInfo.interval[1] = timestamp;
        //   runningInfo.positions.push({
        //     timestamp,
        //     position: entity.position,
        //   });
        // }

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
      if (!fireTruckInfo) {
        return;
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
        // const toInfo = fireTruckInfo["to"];
        const rescueInfo = fireTruckInfo["rescue"];
        // const lastToPositionInfo = toInfo.positions.at(-1);
        // if (
        //   rescueInfo.interval === undefined &&
        //   JSON.stringify(lastToPositionInfo.position) !==
        //     JSON.stringify(entity.position)
        // ) {
        //   toInfo.interval[1] = timestamp;
        //   toInfo.positions.push({
        //     timestamp,
        //     position: entity.position,
        //   });
        // }

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
        ...entity,
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
        ...entity,
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

  .time_line_container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
