<template>
  <div class="resident-path-outer-container">
    <Monitor v-for="monitorInfo of monitorInfos" :info="monitorInfo" :key="monitorInfo.id" :resident="resident"/>
    <HistoryPath v-for="path of pathInfos" :info="path" :key="path.id"/>
  </div>
</template>

<script>
import Monitor from "./Monitor";
import HistoryPath from "./HistoryPath.vue"
import {v1 as uuid} from "uuid";
import dayjs from "dayjs"

export default {
  name: "ResidentPath",
  components: {Monitor, HistoryPath},
  props: ["resident"],
  data() {
    return {
      monitorInfos: [],
      pathInfos: [],
    }
  },
  methods: {
    initCamera() {
      const viewer = window.myEarth.viewer;
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(117.04295, 36.66281, 392),  // 目标位置
        orientation: {
          heading: Cesium.Math.toRadians(357),  // 视角方向（朝北）
          pitch: Cesium.Math.toRadians(-65),  // 俯仰角度（视线向下 45 度）
          roll: 0  // 滚动角度
        },
        duration: 2,  // 飞行的持续时间，单位为秒
      });
    },

    async getMonitorInfo() {
      const days = [
        dayjs().subtract(0, 'day').set('hour', 10).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
        dayjs().subtract(1, 'day').set('hour', 14).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
        dayjs().subtract(2, 'day').set('hour', 8).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
        dayjs().subtract(3, 'day').set('hour', 20).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
      ]
      const images = []
      this.monitorInfos = [
        {
          id: uuid(),
          name: "社区东1门",
          degreePosition: {longitude: 117.0435003, latitude: 36.6644274, altitude: 10.22},
          shoots: [
            {
              id: uuid(),
              date: dayjs().subtract(0, 'day').set('hour', 10).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate1.png"
            },
            {
              id: uuid(),
              date: dayjs().subtract(1, 'day').set('hour', 14).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate2.png"
            },
            {
              id: uuid(),
              date: dayjs().subtract(2, 'day').set('hour', 8).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate1.png"
            },
            {
              id: uuid(),
              date: dayjs().subtract(3, 'day').set('hour', 20).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate2.png"
            },
          ]
        },
        {
          id: uuid(),
          name: "社区东2门",
          degreePosition: {longitude: 117.0435802, latitude: 36.6637564, altitude: 10.22},
          shoots: [
            {
              id: uuid(),
              date: dayjs().subtract(0, 'day').set('hour', 10).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate2.png"
            },
            {
              id: uuid(),
              date: dayjs().subtract(1, 'day').set('hour', 14).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate1.png"
            },
            {
              id: uuid(),
              date: dayjs().subtract(2, 'day').set('hour', 8).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate2.png"
            },
            {
              id: uuid(),
              date: dayjs().subtract(3, 'day').set('hour', 20).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate1.png"
            },
          ]
        },
        {
          id: uuid(),
          name: "社区北门",
          degreePosition: {longitude: 117.0425595, latitude: 36.6651898, altitude: 10.22},
          shoots: [
            {
              id: uuid(),
              date: dayjs().subtract(0, 'day').set('hour', 10).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate2.png"
            },
            {
              id: uuid(),
              date: dayjs().subtract(1, 'day').set('hour', 14).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate1.png"
            },
            {
              id: uuid(),
              date: dayjs().subtract(2, 'day').set('hour', 8).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate2.png"
            },
            {
              id: uuid(),
              date: dayjs().subtract(3, 'day').set('hour', 20).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate1.png"
            },
          ]
        },
        {
          id: uuid(),
          name: "居民楼 A3 幢",
          degreePosition: {longitude: 117.0425400, latitude: 36.6635975, altitude: 10.22},
          shoots: [
            {
              id: uuid(),
              date: dayjs().subtract(0, 'day').set('hour', 10).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate1.png"
            },
            {
              id: uuid(),
              date: dayjs().subtract(1, 'day').set('hour', 14).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate2.png"
            },
            {
              id: uuid(),
              date: dayjs().subtract(2, 'day').set('hour', 8).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate1.png"
            },
            {
              id: uuid(),
              date: dayjs().subtract(3, 'day').set('hour', 20).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              img: this.$StaticResourceAddress + "/monitor/path/gate2.png"
            },
          ]
        },
      ]
    },

    async getPathInfo() {
      this.pathInfos = [
        {
          id: uuid(),
          start: {
            position: "居民楼 A3 幢",
            date: dayjs().set('hour', 10).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
          },
          end: {
            position: "社区北门",
            date: dayjs().set('hour', 10).set('minute', 10).set('second', 0).set('millisecond', 0).toDate(),
          },
          points: [
            {longitude: 117.0425400, latitude: 36.6635975, altitude: 5.22},
            {longitude: 117.0427160, latitude: 36.6636197, altitude: 5.22},
            {longitude: 117.0425595, latitude: 36.6651898, altitude: 5.22},
          ]
        },
        {
          id: uuid(),
          start:
              {
                position: "居民楼 A3 幢",
                date:
                    dayjs().set('hour', 16).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              }
          ,
          end: {
            position: "社区东2门",
            date:
                dayjs().set('hour', 16).set('minute', 10).set('second', 0).set('millisecond', 0).toDate()
          }
          ,
          points: [
            {longitude: 117.0425400, latitude: 36.6635975, altitude: 5.22},
            {longitude: 117.0427160, latitude: 36.6636197, altitude: 5.22},
            {longitude: 117.0427255, latitude: 36.6637237, altitude: 5.22},
            {longitude: 117.0435802, latitude: 36.6637564, altitude: 10.22},
          ]
        }
        ,
        {
          id: uuid(),
          start:
              {
                position: "社区东1门",
                date:
                    dayjs().set('hour', 14).set('minute', 0).set('second', 0).set('millisecond', 0).toDate(),
              }
          ,
          end: {
            position: "居民楼 A3 幢",
            date:
                dayjs().set('hour', 14).set('minute', 10).set('second', 0).set('millisecond', 0).toDate(),
          }
          ,
          points: [
            {longitude: 117.0435003, latitude: 36.6644274, altitude: 5.22},
            {longitude: 117.0426500, latitude: 36.6643768, altitude: 5.22},
            {longitude: 117.0427160, latitude: 36.6636197, altitude: 5.22},
            {longitude: 117.0425400, latitude: 36.6635975, altitude: 5.22}
          ]
        }
        ,
      ]
    },

    async initData() {
      this.initCamera();
      await this.getMonitorInfo();
      await this.getPathInfo();
    }
  },
  watch: {
    resident() {
      this.initData();
    }
  }
  ,
  mounted() {
    this.initData();
  }
}
</script>

<style scoped lang="less">
.resident-path-outer-container {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
