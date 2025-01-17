<template>
  <div class="weather_outer_panel">
    <div class="controller_panel">
      <div class="shadow_panel">
        <div
          class="shadow_button"
          :class="{ button_active: ifShadowEnable }"
          @click="ifShadowEnable = !ifShadowEnable"
        >
          阴 影
        </div>
        <el-time-select
          class="time_picker"
          v-model="currentTime"
          :picker-options="{
            start: '00:00',
            step: '01:00',
            end: '23:00',
          }"
          placeholder="选择时间"
          :readonly="ifFastTime"
          :clearable="false"
          @change="initClock"
        >
        </el-time-select>
        <div
          class="skip_button"
          :class="{ button_active: ifFastTime }"
          @click="ifFastTime = !ifFastTime"
        >
          时 间 快 进
        </div>
      </div>
      <div class="weather_panel">
        <div
          class="weather_button"
          :class="{ button_active: weatherStatus === -1 }"
          @click="weatherStatus = -1"
        >
          晴
        </div>
        <div
          class="weather_button"
          :class="{ button_active: weatherStatus === 0 }"
          @click="weatherStatus = 0"
        >
          雨
        </div>
        <div
          class="weather_button"
          :class="{ button_active: weatherStatus === 1 }"
          @click="weatherStatus = 1"
        >
          雪
        </div>
        <div
          class="weather_button"
          :class="{ button_active: weatherStatus === 2 }"
          @click="weatherStatus = 2"
        >
          雾
        </div>
      </div>
    </div>
    <div id="earth_container" class="earth_container"></div>
  </div>
</template>

<script>
import MyEarth from "@/assets/js/cesium/MyEarth";

export default {
  name: "TestWeatherPage",
  data() {
    return {
      ifShadowEnable: false,
      ifFastTime: false,
      currentTime: "8:00",
      weatherStatus: -1,
    };
  },
  methods: {
    initComp() {
      this.initEarth();
      this.initStatus();
      this.initShadow();
      this.initClock();
      this.turnSunny();
    },

    initEarth() {
      this.myEarth = new MyEarth("earth_container");
      const cesiumObj = {
        xbsjType: "Tileset",
        name: "解放路社区",
        url:
          this.$StaticResourceAddress + "/model/jiefanglu_shadow/tileset.json",
        // maximumScreenSpaceError: 16,
        xbsjPosition: [2.042793850105076, 0.6398969081167519, 20],
        xbsjUseOriginTransform: false,
        xbsjClippingPlanes: {},
        xbsjCustomShader: {},
      };
      this.myEarth.pushEntityToEarth("street_tile_model", cesiumObj);

      this.myEarth.scene.screenSpaceCameraController.maximumZoomDistance = 5000;
    },

    initShadow() {
      const viewer = this.myEarth.viewer;
      // 开启光照
      viewer.scene.globe.enableLighting = true;
      viewer.scene.sun.intensity = 0.5;
    },

    initClock() {
      const currentDate = this.dateStr2Date(this.currentTime);
      this.myEarth.viewer.clock.startTime = Cesium.JulianDate.fromDate(
        currentDate,
        new Cesium.JulianDate()
      );
      this.myEarth.viewer.clock.stopTime = Cesium.JulianDate.addDays(
        currentDate,
        1,
        new Cesium.JulianDate()
      );
      this.myEarth.viewer.clock.currentTime = this.myEarth.viewer.clock.startTime;
      this.myEarth.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      this.myEarth.viewer.clock.multiplier = 0;

      this.myEarth.viewer.clock.onTick.addEventListener((event) => {
        const currentTime = Cesium.JulianDate.toDate(
          event.currentTime,
          new Cesium.JulianDate()
        );
        const hours = currentTime.getHours();
        if (Number(hours) !== this.currentTime.split(":")[0]) {
          this.currentTime = `${hours}:00`;
        }
      });
    },

    initStatus() {
      this.ifShadowEnable = true;
    },

    addShadow() {
      this.myEarth.viewer.shadows = true;
    },

    removeShadow() {
      this.myEarth.viewer.shadows = false;
    },

    fastTime() {
      this.myEarth.viewer.clock.multiplier = 5000;
    },

    unFastTime() {
      this.myEarth.viewer.clock.multiplier = 0;
    },

    clearWeather() {
      this.myEarth.viewer.scene.sun.intensity = 0.5;
      this.myEarth.earth.weather.rainPostProcess.enabled = false;
      this.myEarth.earth.weather.snowPostProcess.enabled = false;
      this.myEarth.earth.weather.snowPostProcess.alpha = 0;
      this.myEarth.earth.weather.fogPostProcess.enabled = false;
    },

    turnSunny() {
      this.clearWeather();
      this.myEarth.viewer.scene.sun.intensity = 0.5;
    },

    turnRain() {
        this.clearWeather();
        this.myEarth.viewer.scene.sun.intensity = 0.2;
        this.myEarth.earth.weather.rainPostProcess.enabled = true;
      
    },

    turnSnow() {
        this.clearWeather();
        this.myEarth.viewer.scene.sun.intensity = 0.3;
        this.myEarth.earth.weather.snowPostProcess.enabled = true;
        this.myEarth.earth.weather.snowPostProcess.alpha = 0.5;
    },

    turnFog() {
        this.clearWeather();
        this.myEarth.viewer.scene.sun.intensity = 0.5;
        this.myEarth.earth.weather.fogPostProcess.enabled = true;
        this.myEarth.earth.weather.fogPostProcess.strength = 0.35
    },



    dateStr2Date(str) {
      let hour = Number(str.split(":")[0]);
      let currentTime = new Date();
      currentTime.setHours(hour);
      currentTime.setMinutes(0);
      currentTime.setSeconds(0);
      currentTime.setMilliseconds(0);
      return currentTime;
    },

    Date2DateStr(date) {
      let hour = date.getHours();
      return `${hour}:00`;
    },

    destroyEarth() {
      this.myEarth && this.myEarth.destroyEarth();
    },
  },

  watch: {
    ifShadowEnable: {
      immediate: false,
      handler(newValue) {
        if (newValue) {
          this.addShadow();
        } else {
          this.removeShadow();
        }
      },
    },
    ifFastTime: {
      immediate: false,
      handler(newValue) {
        if (newValue) {
          this.fastTime();
        } else {
          this.unFastTime();
        }
      },
    },
    weatherStatus: {
      immediate: false,
      handler(newValue) {
        switch (newValue) {
          case -1:
            this.turnSunny();
            break;
          case 0:
            this.turnRain();
            break;
          case 1:
            this.turnSnow();
            break;
          case 2:
            this.turnFog();
            break;
        }
      },
    },
  },
  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    this.destroyEarth();
  },
};
</script>

<style lang="less" scoped>
.weather_outer_panel {
  position: relative;
  width: 100%;
  height: 100%;

  .controller_panel {
    position: absolute;
    right: 20px;
    top: 20px;
    height: auto;
    width: 400px;
    background: rgba(0, 0, 0, 0.6);
    z-index: 2;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 15px;

    .common_button {
      width: 80px;
      height: 40px;
      background: white;
      color: black;
      border-radius: 10px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-weight: 500;
      user-select: none;

      &:hover {
        cursor: pointer;
      }
    }

    .button_active {
      background: rgb(30, 159, 255) !important;
      color: white !important;
      font-weight: 700 !important;
    }

    .shadow_panel {
      width: 100%;
      height: 60px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .shadow_button {
        .common_button();
        width: 80px;
      }

      .skip_button {
        .common_button();
        width: 120px;
      }

      .time_picker {
        width: 150px;
        font-size: 16px;
        font-weight: 700;
      }
    }

    .weather_panel {
      width: 100%;
      height: 60px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .weather_button {
        .common_button();
        width: 80px;
      }
    }
  }

  .earth_container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
}
</style>
