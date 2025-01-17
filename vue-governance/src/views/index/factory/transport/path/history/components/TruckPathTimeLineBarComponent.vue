<template>
  <div class="time_line_bar_container">
    <div class="main_container">
      <div class="bar_container">
        <div class="top_container">
          <div class="top_time_container">{{ startTimeStr }}</div>
          <div class="top_time_container">{{ endTimeStr }}</div>
        </div>
        <div
          class="slide_track_wrapper"
          @mousedown="handleMousedown"
          @mouseup="handleMouseup"
          @mousemove="handleMousemove"
          @mouseleave="handleMouseleave"
          @mouseenter="handleMouseenter"
        >
          <div class="slide_track">
            <div class="slider" :style="{ left: sliderOffset }"></div>
            <div
              class="track_fill_panel"
              :style="{ width: sliderOffset }"
            ></div>
          </div>
        </div>
        <div class="bottom_container">
          <div class="bottom_time_container">{{ currentTimestampStr }}</div>
          <div
            v-if="!playing"
            class="play_button"
            @click.stop="handlePlayClick"
          >
            <i class="iconfont icon-play"></i>
          </div>
          <div
            v-if="playing"
            class="pause_button"
            @click.stop="handlePauseClick"
          >
            <i class="iconfont icon-pause"></i>
          </div>
          <div class="stop_button">
            <i class="iconfont icon-stop" @click.stop="handleStopClick"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TruckPathTimeLineBarComponent",
  props: ["startTime", "endTime"],
  data() {
    return {
      progress: 0,
      ifDrag: false,
      cancelDragTimer: undefined,
      playing: false,
      playIntervalTimer: undefined,
    };
  },
  computed: {
    sliderOffset() {
      return `${this.progress * 100}%`;
    },

    startTimeStr() {
      return this.$common.dateFormat("HH:MM:SS", new Date(this.startTime));
    },
    endTimeStr() {
      return this.$common.dateFormat("HH:MM:SS", new Date(this.endTime));
    },
    currentTimestamp() {
      return (
        this.startTime.getTime() +
        (this.endTime.getTime() - this.startTime.getTime()) * this.progress
      );
    },
    currentTimestampStr() {
      return this.$common.dateFormat(
        "HH:MM:SS",
        new Date(this.currentTimestamp)
      );
    },
  },
  methods: {
    handleMousedown(event) {
      const truckElement = event.target;
      this.changeProgress(event.offsetX / truckElement.offsetWidth);
      this.ifDrag = true;
      this.$emit("change", this.currentTimestamp);
    },
    handleMouseup() {
      clearTimeout(this.cancelDragTimer);
      this.ifDrag = false;
    },
    handleMousemove(event) {
      clearTimeout(this.cancelDragTimer);
      if (this.ifDrag) {
        const truckElement = event.target;
        this.changeProgress(event.offsetX / truckElement.offsetWidth);
        this.$emit("change", this.currentTimestamp);
      }
    },
    handleMouseleave(event) {
      this.cancelDragTimer = setTimeout(() => {
        this.ifDrag = false;
      }, 500);
    },

    handleMouseenter(event) {
      clearTimeout(this.cancelDragTimer);
    },

    changeProgress(progress) {
      if (progress >= 1) {
        this.progress = 1;
        this.playing = false;
        clearInterval(this.playIntervalTimer);
        this.$emit("pause", this.currentTimestamp);
      } else {
        this.progress = progress;
      }
    },

    handlePlayClick() {
      this.playing = true;
      const interval = 100;
      this.playIntervalTimer = setInterval(() => {
        this.changeProgress(
          this.progress +
            interval / (this.endTime.getTime() - this.startTime.getTime())
        );
      }, interval);
      this.$emit("play", this.currentTimestamp);
    },

    handlePauseClick() {
      this.playing = false;
      clearInterval(this.playIntervalTimer);
      this.$emit("pause", this.currentTimestamp);
    },

    handleStopClick() {
      this.playing = false;
      clearInterval(this.playIntervalTimer);
      this.changeProgress(0);
      this.$emit("stop", this.currentTimestamp);
    },

    resetData() {
      this.progress = 0;
      this.playing = false;
      clearInterval(this.playIntervalTimer);
      this.playIntervalTimer = undefined;
      this.$emit("stop");
    },
  },
  beforeDestroy() {
    this.resetData();
  },
};
</script>

<style lang="less" scoped>
.time_line_bar_container {
  width: 100%;
  height: fit-content;
  color: white;

  .main_container {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .bar_container {
      width: 100%;
      height: fit-content;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 0 10px;

      .top_container {
        height: fit-content;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .top_time_container {
          font-size: 12px;
          pointer-events: none;
        }
      }

      .bottom_container {
        height: fit-content;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .bottom_time_container {
          font-weight: 700;
          font-size: 16px;
          pointer-events: none;
        }

        .play_button {
          margin-left: auto;
          height: 100%;
          width: fit-content;
          i {
            font-size: 18px;
          }

          &:hover {
            cursor: pointer;
            color: var(--lightBlue);
          }
        }

        .pause_button {
          margin-left: auto;
          height: 100%;
          width: fit-content;
          i {
            font-size: 18px;
          }
          &:hover {
            cursor: pointer;
            color: var(--lightBlue);
          }
        }

        .stop_button {
          margin-left: 10px;
          height: 100%;
          width: fit-content;
          i {
            font-size: 18px;
          }
          &:hover {
            cursor: pointer;
            color: var(--lightBlue);
          }
        }
      }

      .slide_track_wrapper {
        width: 100%;
        height: 30px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &:hover {
          cursor: pointer;
          .slide_track {
            .slider {
              opacity: 1;
            }
          }
        }

        .slide_track {
          position: relative;
          width: 100%;
          height: 6px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.5);

          .slider {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%) translateX(-50%);
            height: 12px;
            aspect-ratio: 1;
            z-index: 2;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            background: white;
            border-radius: 50%;
          }

          .track_fill_panel {
            position: absolute;
            height: 100%;
            width: 0;
            border-radius: 2px;
            left: 0;
            top: 0;
            background: var(--lightBlue);
            z-index: 1;
            pointer-events: none;
          }
        }
      }
    }
  }
}
</style>
