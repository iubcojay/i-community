<template>
  <div class="fuel_truck_accident_info_container" :style="positionStyle">
    <div class="header_panel"></div>
    <div class="triangle_panel"></div>
    <div class="main_content_container">
      <div class="plate_number_panel">{{ plateNumber }}</div>
      <div class="detail_container">
        <div class="speed_panel">0km/h</div>
        <div class="status_panel">
          <div class="breath_point"></div>
          故障
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FuelTruckAccidentInfoComponent",
  props: {
    screenPosition: {
      type: Object,
      default() {
        return { left: -1000, top: -1000 };
      },
    },
    plateNumber: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    positionStyle() {
      return {
        left: this.screenPosition.left + "px",
        top: this.screenPosition.top + "px",
      };
    },
  },
};
</script>

<style lang="less" scoped>
.fuel_truck_accident_info_container {
  position: absolute;
  width: 150px;
  height: 80px;
  background: rgba(24, 49, 85, 0.9);
  border-radius: 5px;
  transform: translateX(-50%) translateY(calc(-100% - 35px));
  animation: breathe_shadow 3s infinite;
  --primary-rgb-color: 255, 0, 0;

  @keyframes breathe_shadow {
    0% {
      box-shadow: 0 0 10px 0 rgba(var(--primary-rgb-color), 0.7);
    }
    50% {
      box-shadow: 0 0 20px 10px rgba(var(--primary-rgb-color), 0.4);
    }
    100% {
      box-shadow: 0 0 10px 0 rgba(var(--primary-rgb-color), 0.7);
    }
  }

  @headerHeight: 15px;
  .header_panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: @headerHeight;
    background: rgb(var(--primary-rgb-color));
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .triangle_panel {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 24px;
    height: 10px;
    transform: translateX(-50%) translateY(100%);
    clip-path: polygon(0 0, 50% 100%, 100% 0);
    background: rgba(24, 49, 85, 0.9);
  }

  .main_content_container {
    position: absolute;
    left: 0;
    top: @headerHeight;
    width: 100%;
    height: calc(100% - @headerHeight);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .plate_number_panel {
      font-size: 21px;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: 5px;
    }

    .detail_container {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      width: 100%;

      .speed_panel {
        font-size: 15px;
      }
      .status_panel {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-weight: 700;
        font-size: 15px;

        .breath_point {
          width: 6px;
          aspect-ratio: 1;
          border-radius: 50%;
          margin-right: 5px;
          background: rgb(var(--primary-rgb-color));
        }
      }
    }
  }
}
</style>
