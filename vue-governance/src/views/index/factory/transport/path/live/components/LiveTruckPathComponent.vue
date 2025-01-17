<template>
  <div v-if="ready" class="live_truck_path_container">
    <live-truck-component
      v-for="truckInfo of fuelTruckInfoList"
      :key="truckInfo.truckId"
      :truckInfo="truckInfo"
      :delaySecond="ws.delaySecond"
    ></live-truck-component>
  </div>
</template>

<script>
import LiveTruckComponent from "@/views/index/factory/transport/path/live/components/LiveTruckComponent";

import { mapState, mapMutations } from "vuex";

const STATUS_NONE = 0;
const STATUS_RUNNING = 1;
const STATUS_STOP = 2;
const STATUS_ACCIDENT = 3;
export default {
  name: "LiveTruckPathComponent",
  components: {
    LiveTruckComponent,
  },
  props: ["setTruckPathList"],
  data() {
    return {
      wsInterval: 3,
      fuelTruckInfoList: [],
      ready: false,
    };
  },
  computed: {
    ...mapState("factoryAbout", ["ws"]),
    wsConnectInstance() {
      return this.ws.connectInstance;
    },
  },
  methods: {
    ...mapMutations("factoryAbout", ["setDelaySecond"]),
    async initComp() {
      await this.initCesiumClock();
      this.setMessageListener();
      this.ready = true;
    },
    async initCesiumClock() {
      // 获取时间间隔
      const result = await this.$axios.get(
        this.$ServerAddress + "/factory/sand_table/interval"
      );
      if (result.status === 200) {
        this.wsInterval = result.data.interval;
      }
      this.setDelaySecond(this.wsInterval + 0.5);
      const viewer = window.myEarth.viewer;
      let currentTime = Cesium.JulianDate.now();
      let startTime = Cesium.JulianDate.addSeconds(
        currentTime,
        -this.ws.delaySecond,
        new Cesium.JulianDate()
      );

      let stopTime = Cesium.JulianDate.addSeconds(
        startTime,
        9999999 * 60,
        new Cesium.JulianDate()
      );

      viewer.clock.startTime = startTime.clone();
      viewer.clock.stopTime = stopTime.clone();
      viewer.clock.currentTime = startTime.clone();
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
    },
    setMessageListener() {
      this.wsConnectInstance.onmessage = ({ data }) => {
        const messageData = JSON.parse(data);
        const timeStamp = messageData.timeStamp;
        const liveFuelTruckInfoList = messageData.vehicle.filter(
          (info) => info.vehicleType === "fuel_truck"
        );
        this.updateTruckInfoList(timeStamp, liveFuelTruckInfoList);
      };
    },

    updateTruckInfoList(timeStamp, liveFuelTruckInfoList) {
      this.fuelTruckInfoList = this.fuelTruckInfoList.filter((info) =>
        liveFuelTruckInfoList.some(
          (liveFuelInfo) => liveFuelInfo.vehicleId === info.truckId
        )
      );
      liveFuelTruckInfoList.forEach((truckInfo) => {
        let info = this.fuelTruckInfoList.find(
          (info) => info.truckId === truckInfo.vehicleId
        );
        if (info === undefined) {
          this.addTruckInfo(timeStamp, truckInfo);
        } else {
          this.updateTruckInfo(timeStamp, truckInfo);
        }
      });
      this.setTruckPathList(this.fuelTruckInfoList);
    },

    addTruckInfo(timeStamp, truckInfo) {
      this.fuelTruckInfoList.push({
        truckId: truckInfo.vehicleId,
        modelUrl: truckInfo.modelUrl,
        plateNumber: truckInfo.plateNumber,
        thumbnailUrl: truckInfo.thumbnailUrl,
        status: STATUS_NONE,
        positionList: [
          {
            timeStamp,
            position: truckInfo.position,
            status: truckInfo.status,
          },
        ],
      });
    },

    updateTruckInfo(timeStamp, truckInfo) {
      const info = this.fuelTruckInfoList.find(
        (info) => info.truckId === truckInfo.vehicleId
      );
      if (info) {
        info.positionList.push({
          timeStamp,
          position: truckInfo.position,
          status: truckInfo.status,
        });
        if (info.positionList.length > 10) {
          info.positionList.shift();
        }
      }
    },
  },
  mounted() {
    this.initComp();
  },
};
</script>

<style lang="less" scoped>
.live_truck_path_container {
  width: 100%;
  height: 100%;
}
</style>
