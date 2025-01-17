<template>
  <div class="time_line_outer_container">
    <div class="time_line_panel">
      <div class="time_line_menu">
        <div class="panel_border border_rt"></div>
        <i
          class="iconfont icon-restart time_line_menu_icon"
          @click="handleRestartClick"
        ></i>
        <i
          class="iconfont icon-fast-forward time_line_menu_icon"
          :class="{ active: isMultiplier }"
          @click="handleMultiplierClick"
        ></i>
        <i
          class="iconfont time_line_menu_icon"
          :class="{ 'icon-play': !playing, 'icon-pause': playing }"
          @click="handlePlayClick"
        ></i>
      </div>
      <div class="time_line_bar">
        <div class="time_line_side_label">{{ startTimeStr }}</div>
        <div class="time_line_wrapper_container">
          <el-slider
            v-model="currentTimeStamp"
            :min="startTimeStamp"
            :max="endTimeStamp"
            :format-tooltip="formatDate"
            @input="handleSlideChange"
            :show-tooltip="false"
          ></el-slider>
        </div>

        <div class="time_line_side_label">{{ endTimeStr }}</div>
        <div class="panel_border border_lt"></div>
        <div class="panel_border border_lb"></div>
        <div class="panel_border border_rb"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "TimeLineComponent",
  props: ["startTimeStamp", "endTimeStamp"],
  data() {
    return {
      playing: false,
      currentTimeStamp: this.startTimeStamp,
      multiplier: 1,
    };
  },
  computed: {
    startTimeStr() {
      return this.formatDate(this.startTimeStamp-1000*60*14);
    },
    endTimeStr() {
      return this.formatDate(this.endTimeStamp);
    },
    ...mapState({
      fireAccidentTime: state => state.fireTimeAbout.fireAccidentTime // 指定模块名
    }),
    isMultiplier() {
      return this.multiplier !== 1;
    },
  },
  methods: {
    initComp() {
      this.addRenderListener();
    },
    getFireAccidentStartTime(){
      const fireAccidentStartTime = this.formatDate(this.fireAccidentTime)
      console.log(fireAccidentStartTime)
      return fireAccidentStartTime;
    },
    getFireAccidentEndTime(){
      const fireAccidentEndTime = this.formatDate(this.fireAccidentTime+this.startTimeStamp-this.endTimeStamp)
      console.log(fireAccidentEndTime)
      return fireAccidentEndTime;
    },
    addRenderListener() {
      window.myEarth.viewer.scene.postRender.addEventListener(
        this.renderListener
      );
    },

    removeRenderListener() {
      window.myEarth?.viewer.scene.postUpdate.removeEventListener(
        this.renderListener
      );
    },

    renderListener() {
      this.updateCurrentTimeStamp();
    },

    updateCurrentTimeStamp() {
      if (this.playing) {
        this.currentTimeStamp = Cesium.JulianDate.toDate(
          window.myEarth.viewer.clock.currentTime
        ).getTime();
      }
    },

    formatDate(timeStamp) {
      return this.$common.dateFormat("HH:MM:SS", new Date(timeStamp));
    },

    handleSlideChange(value) {
      window.myEarth.viewer.clock.currentTime = Cesium.JulianDate.fromDate(
        new Date(value)
      );
    },

    handleRestartClick() {
      this.playing = true;
      window.myEarth.viewer.clock.currentTime = Cesium.JulianDate.fromDate(
        new Date(this.startTimeStamp)
      );
    },

    handlePlayClick() {
      this.playing = !this.playing;
    },

    handleMultiplierClick() {
      if (this.multiplier === 1) {
        this.multiplier = 3;
        window.myEarth.viewer.clockViewModel.multiplier = 3;
      } else {
        this.multiplier = 1;
        window.myEarth.viewer.clockViewModel.multiplier = 1;
      }
    },
  },
  mounted() {
    this.initComp();
  },

  destroyed() {
    this.removeRenderListener();
  },
  watch: {
    playing: {
      immediate: true,
      handler(newValue) {
        window.myEarth.viewer.clock.shouldAnimate = newValue;
      },
    },
  },
};
</script>

<style lang="less" scoped>
.time_line_outer_container {
  position: relative;
  height: 100%;
  width: 100%;
  pointer-events: none;

  .time_line_panel {
    position: absolute;
    bottom: 120px;
    left: 50%;
    width: 1000px;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    transform: translateX(-50%);
    pointer-events: all;

    .time_line_menu {
      position: relative;
      height: 40px;
      width: auto;
      display: flex;
      flex-direction: row;
      justify-content: right;
      align-items: center;
      background-color: rgba(24, 49, 85, 0.8);
      border-radius: 8px 8px 0px 0px;
      padding: 0 10px;

      .time_line_menu_icon {
        height: 40px;
        width: 40px;
        font-size: 18px;
        color: white;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin: 0 3px;
        font-weight: 700;

        &:hover {
          color: var(--lightBlue);
          cursor: pointer;
        }

        &.active {
          color: var(--lightBlue);
        }
      }
    }

    .time_line_bar {
      position: relative;
      width: 100%;
      height: 60px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background-color: rgba(24, 49, 85, 0.8);
      border-radius: 8px 0px 8px 8px;
      overflow: hidden;

      .time_line_side_label {
        width: fit-content;
        height: fit-content;
        color: white;
        font-weight: 700;
        font-size: 18px;
        margin: 0px 20px;
      }

      .time_line_wrapper_container {
        flex: 1;
        height: fit-content;
      }
    }

    .panel_border {
      position: absolute;
      width: 20px;
      height: 20px;
      box-sizing: border-box;
    }

    .border_rt {
      right: 0;
      top: 0;
      border-radius: 0px 8px 0px 0px;
      border-right: 3px var(--lightBlue) solid;
      border-top: 3px var(--lightBlue) solid;
    }

    .border_rb {
      right: 0;
      bottom: 0;
      border-radius: 0px 0px 8px 0px;
      border-right: 3px var(--lightBlue) solid;
      border-bottom: 3px var(--lightBlue) solid;
    }

    .border_lt {
      left: 0;
      top: 0;
      border-radius: 8px 0px 0px 0px;
      border-left: 3px var(--lightBlue) solid;
      border-top: 3px var(--lightBlue) solid;
    }

    .border_lb {
      left: 0;
      bottom: 0;
      border-radius: 0px 0px 0px 8px;
      border-left: 3px var(--lightBlue) solid;
      border-bottom: 3px var(--lightBlue) solid;
    }
  }
}
</style>
