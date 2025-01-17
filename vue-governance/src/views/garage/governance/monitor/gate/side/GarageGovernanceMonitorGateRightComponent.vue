<template>
  <div class="outer_panel">
    <folder-panel-component position="right" title="实时监控" height="400px">
      <template slot="content">
        <div class="content_panel">
          <div class="video_panel">
            <div v-if="loading" class="scan_line"></div>
            <video
              v-if="currentMonitorInfo"
              :src="currentMonitorInfo.monitorUrl"
              :controls="false"
              loop
              autoplay
              muted
              class="display_video_comp"
            ></video>
          </div>
          <div class="detect_info_panel">
            <div class="detect_info_item">
              <div class="detect_info_item_key">车牌：</div>
              <div class="detect_info_item_value">
                <i
                  v-if="loading"
                  class="iconfont icon-loading icon_loading"
                ></i>
                <span v-else>{{ detectInfo.plate }}</span>
              </div>
            </div>
            <div class="detect_info_item">
              <div class="detect_info_item_key">颜色：</div>
              <div class="detect_info_item_value">
                <i
                  v-if="loading"
                  class="iconfont icon-loading icon_loading"
                ></i>
                <span v-else>{{ detectInfo.color }}</span>
              </div>
            </div>
            <div class="detect_info_item">
              <div class="detect_info_item_key">车型：</div>
              <div class="detect_info_item_value">
                <i
                  v-if="loading"
                  class="iconfont icon-loading icon_loading"
                ></i>
                <span v-else>{{ detectInfo.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </folder-panel-component>
  </div>
</template>

<script>
import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
export default {
  name: "GarageGovernanceMonitorGateRightComponent",
  components: { FolderPanelComponent },
  props: ["supData", "supMethods"],
  data() {
    return {
      gateMonitorList: [],
      currentMonitorInfo: undefined,
      detectInfo: {
        plate: "",
        color: "",
        type: "",
      },
      loading: false,
    };
  },
  methods: {
    setGateMonitorList() {
      this.gateMonitorList = this.supData.gateMonitorList;
    },

    playAnimation() {
      if (!this.loading) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          if (this.detectInfo.plate === "未知") {
            this.$message({
              message: "光线不足，识别失败",
              type: "warning",
            });
          }
        }, 5000);
      }
    },
  },
  watch: {
    gateMonitorList: {
      deep: true,

      handler(newVal) {
        this.currentMonitorInfo = newVal.find(
          (monitorInfo) => monitorInfo.ifShow
        );

        // 灯光打开则显示亮的视频，否则显示暗的视频
        const lightList = window.myThreeJsScene.garage.lightList;
        const light1 = lightList.find((light) => light.title === "F区");
        const light2 = lightList.find((light) => light.title === "G区");
        if (this.currentMonitorInfo) {
          if (light1.isOpen && light2.isOpen) {
            this.currentMonitorInfo.monitorUrl =
              window.PLATFORM_CONFIG.StaticResourceAddress +
              "/monitor/garage/garage_south_enter_light.mp4";
            this.detectInfo = {
              plate: "苏B·M2089",
              color: "黑色",
              type: "轿车",
            };
          } else {
            this.currentMonitorInfo.monitorUrl =
              window.PLATFORM_CONFIG.StaticResourceAddress +
              "/monitor/garage/garage_south_enter_dark.mp4";
            this.detectInfo = {
              plate: "未知",
              color: "未知",
              type: "未知",
            };
          }
        }
        this.playAnimation();
      },
    },
  },

  mounted() {
    this.setGateMonitorList();
  },
};
</script>

<style lang="less" scoped>
.outer_panel {
  height: 100%;
  width: 100%;
  @lightBlue: rgb(33, 194, 237);
  @darkBlue: rgb(2, 77, 137);
  pointer-events: none;
  .content_panel {
    height: 100%;
    width: 100%;
    position: relative;

    .video_panel {
      height: 220px;
      width: 100%;
      position: relative;

      .scan_line {
        width: 50px;
        height: 100%;
        background-color: @lightBlue;
        position: absolute;
        z-index: 10;
        left: -50px;
        animation: scan_line 5s ease-in-out infinite;
      }

      @keyframes scan_line {
        0% {
          left: -20px;
          background: linear-gradient(270deg, @lightBlue, rgba(0, 177, 255, 0));
        }

        50% {
          left: 100% + 20px;
          background: linear-gradient(270deg, @lightBlue, rgba(0, 177, 255, 0));
        }
        51% {
          left: 100% + 20px;
          background: linear-gradient(90deg, @lightBlue, rgba(0, 177, 255, 0));
        }

        100% {
          left: -20px;
          background: linear-gradient(90deg, @lightBlue, rgba(0, 177, 255, 0));
        }
      }

      .display_video_comp {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: fill;
        z-index: 1;
      }
    }

    .detect_info_panel {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      box-sizing: border-box;
      border: 3px solid @lightBlue;
      padding: 0 10px;

      .detect_info_item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        font-size: 20px;
        color: white;

        .detect_info_item_key {
          font-size: 20px;
          font-weight: 700;
        }

        .detect_info_item_value {
          font-size: 18px;
          color: fade(white, 80);
          display: flex;
          flex-direction: row;
          align-items: center;

          .icon_loading {
            font-size: 18px;
            animation: loading_rotation infinite 5s linear;
          }

          @keyframes loading_rotation {
            0% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(180deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }
        }
      }
    }
  }
}
</style>
