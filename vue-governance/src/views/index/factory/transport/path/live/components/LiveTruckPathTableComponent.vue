<template>
  <div class="live_truck_path_table_container">
    <table class="live_path_table">
      <thead>
        <tr>
          <th></th>
          <th>车牌号</th>
          <th>运输货物</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="truckPathInfo of truckPathList">
          <td>
            <img
              class="thumbnail_picture"
              :src="$StaticResourceAddress + truckPathInfo.thumbnailUrl"
            />
          </td>
          <td>{{ truckPathInfo.plateNumber }}</td>
          <td>石油</td>
          <td>
            <div
              v-if="truckPathInfo.status === STATUS_RUNNING"
              class="running_panel"
            >
              行驶中
            </div>
            <div
              v-else-if="truckPathInfo.status === STATUS_STOP"
              class="stop_panel"
            >
              停止
            </div>
            <div
              v-else-if="truckPathInfo.status === STATUS_ACCIDENT"
              class="accident_panel"
            >
              故障
            </div>
          </td>
          <td>
            <div class="operator_container">
              <i class="iconfont icon-show"></i>
              <i
                v-if="trackTruckId !== truckPathInfo.truckId"
                class="iconfont icon-camera-unlock"
                @click="trackTruckId = truckPathInfo.truckId"
              ></i>
              <i
                v-else
                class="iconfont icon-camera-lock"
                @click="trackTruckId = -1"
              ></i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from "vuex";

const STATUS_NONE = 0;
const STATUS_RUNNING = 1;
const STATUS_STOP = 2;
const STATUS_ACCIDENT = 3;
export default {
  name: "LiveTruckPathTableComponent",
  props: ["truckPathList"],
  data() {
    return {
      STATUS_NONE,
      STATUS_RUNNING,
      STATUS_STOP,
      STATUS_ACCIDENT,
      showMap: {},
      trackTruckId: -1,
    };
  },
  computed: {
    ...mapState("factoryAbout", ["ws"]),
  },
  methods: {
    initComp() {
      // this.addTrackListener();
    },

    // addTrackListener() {
    //   window.myEarth.viewer.scene.postUpdate.addEventListener(
    //     this.trackListener
    //   );
    // },

    // removeTrackListener() {
    //   window.myEarth?.viewer.scene.postUpdate.removeEventListener(
    //     this.trackListener
    //   );
    // },

    // trackListener() {
    //   const viewer = window.myEarth.viewer;
    //   if (this.trackTruckId !== -1) {
    //     const entityId = "liv_fuel_truck_" + this.trackTruckId;
    //     const entity = window.myEarth.viewer.entities.getById(entityId);
    //     const cartesian3Position = entity.position.getValue(
    //       Cesium.JulianDate.addSeconds(
    //         Cesium.JulianDate.now(),
    //         -this.ws.delaySecond,
    //         new Cesium.JulianDate()
    //       )
    //     );
    //     const heading = Cesium.Math.toRadians(45.0);
    //     const pitch = Cesium.Math.toRadians(-20.0);
    //     const range = 100.0;
    //     viewer.camera.lookAt(
    //       cartesian3Position,
    //       new Cesium.HeadingPitchRange(heading, pitch, range)
    //     );
    //     viewer.scene.postUpdate.addEventListener(this.positionListener);
    //   }
    // },

    // trackTruck(truckId) {
    //   const viewer = window.myEarth.viewer;
    //   const entityId = "liv_fuel_truck_" + truckId;
    //   const entity = window.myEarth.viewer.entities.getById(entityId);

    //   const cartesian3Position = entity.position.getValue(
    //     Cesium.JulianDate.addSeconds(
    //       Cesium.JulianDate.now(),
    //       -this.ws.delaySecond,
    //       new Cesium.JulianDate()
    //     )
    //   );
    //   const heading = Cesium.Math.toRadians(-50.0);
    //   const pitch = Cesium.Math.toRadians(-20.0);
    //   const range = 100.0;
    //   viewer.camera.lookAt(
    //     cartesian3Position,
    //     new Cesium.HeadingPitchRange(heading, pitch, range)
    //   );
    //   viewer.scene.postUpdate.addEventListener(this.positionListener);
    // },

    // unTrack() {
    //   window.myEarth.viewer.trackedEntity = undefined;
    // },

    async trackTruck(newTruckId) {
      const entityId = "liv_fuel_truck_" + newTruckId;
      const entity = window.myEarth.viewer.entities.getById(entityId);
      // await window.myEarth.viewer.flyTo(entity, { duration: 1.5 });
      window.myEarth.viewer.trackedEntity = entity;
    },

    unTrack() {
      window.myEarth.viewer.trackedEntity = undefined;
    },
  },

  watch: {
    trackTruckId(newTruckId) {
      if (newTruckId === -1) {
        this.unTrack();
      } else {
        this.trackTruck(newTruckId);
      }
    },
  },
  mounted() {
    this.initComp();
  },
  beforeDestroy() {
    // this.removeTrackListener();
    window.myEarth.viewer.trackedEntity = undefined;
  },
};
</script>

<style lang="less" scoped>
.live_truck_path_table_container {
  width: 100%;
  height: 100%;

  .live_path_table {
    color: white;
    width: 100%;
    height: fit-content;
    border-collapse: separate;
    border-spacing: 0px 10px;

    th {
      text-align: left;
      border-bottom: 1px solid rgb(139, 138, 138);
      padding-bottom: 10px;
    }

    td {
      border-bottom: 1px solid rgb(139, 138, 138);
    }

    .thumbnail_picture {
      width: 40px;
      aspect-ratio: 1;
    }

    .operator_container {
      width: fit-content;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      i {
        font-size: 20px;
        font-weight: 700;
        margin-right: 20px;

        &:hover {
          cursor: pointer;
          color: var(--lightBlue);
        }
      }
    }

    .running_panel {
      color: rgb(103, 194, 58);
      font-weight: 700;
      margin-right: 15px;
    }
    .stop_panel {
      color: rgb(230, 162, 60);
      font-weight: 700;
      margin-right: 15px;
    }
    .accident_panel {
      color: rgb(245, 108, 108);
      font-weight: 700;
      margin-right: 15px;
    }
  }
}
</style>
