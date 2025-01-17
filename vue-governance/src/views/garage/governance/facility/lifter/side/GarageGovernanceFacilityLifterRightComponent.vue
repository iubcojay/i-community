<template>
  <div class="outer_panel">
    <folder-panel-component position="right" title="道闸列表" height="400px">
      <template slot="content">
        <div class="lifter_list_panel">
          <div
            class="lifter_info_item_panel"
            v-for="(lifterInfo, index) of lifters"
            :key="index"
          >
            <div class="left_panel">
              <i
                class="lifter_icon iconfont icon-lifter"
                :style="{ color: getLifterIconColor(lifterInfo) }"
              ></i>
              <span
                class="lifter_name"
                @click="handlePositionClick(lifterInfo)"
                >{{ lifterInfo.name }}</span
              >
              <span
                v-if="lifterInfo.status === LIFTER_STATUS_AUTO"
                class="status_span auto_span"
                >(自动)</span
              >
              <span
                v-if="lifterInfo.status === LIFTER_STATUS_HAND"
                class="status_span hand_span"
                >(手动)</span
              >
              <span
                v-if="lifterInfo.status === LIFTER_STATUS_ANOMALY"
                class="status_span broken_span"
                >(手动)</span
              >
              <i
                class="auto_icon iconfont icon-auto"
                :class="{
                  active: lifterInfo.status === LIFTER_STATUS_AUTO,
                  broken: lifterInfo.status === LIFTER_STATUS_ANOMALY,
                }"
                @click="
                  lifterInfo.status === LIFTER_STATUS_HAND &&
                    handleStatusClick(lifterInfo.id, LIFTER_STATUS_AUTO)
                "
              ></i>
              <i
                class="hand_icon iconfont icon-hand"
                :class="{
                  active: lifterInfo.status !== LIFTER_STATUS_AUTO,
                }"
                @click="
                  lifterInfo.status === LIFTER_STATUS_AUTO &&
                    handleStatusClick(lifterInfo.id, LIFTER_STATUS_HAND)
                "
              ></i>
            </div>
            <div class="right_panel">
              <span
                class="status_span"
                :class="{
                  open: lifterInfo.isRaised,
                  close: !lifterInfo.isRaised,
                }"
                >{{ lifterInfo.isRaised ? "ON" : "OFF" }}</span
              >
              <transition name="switch-panel">
                <div
                  class="switch_panel"
                  v-show="lifterInfo.status !== LIFTER_STATUS_AUTO"
                >
                  <input
                    type="checkbox"
                    class="switch-button"
                    :id="'switch-button-' + index"
                    :checked="lifterInfo.isRaised"
                    @change="handelLifterCheckBoxChange(lifterInfo)"
                  />
                  <label :for="'switch-button-' + index"></label>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </template>
    </folder-panel-component>
  </div>
</template>

<script>
import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
import {
  LIFTER_STATUS_ANOMALY,
  LIFTER_STATUS_AUTO,
  LIFTER_STATUS_HAND,
} from "@/views/garage.back1/utils/Lifter.js";
import { mapState } from "vuex";

export default {
  name: "GarageGovernanceFacilityLifterRightComponent",
  components: { FolderPanelComponent },

  data() {
    return {
      LIFTER_STATUS_ANOMALY,
      LIFTER_STATUS_AUTO,
      LIFTER_STATUS_HAND,
    };
  },
  computed: {
    ...mapState("garageAbout", ["lifters"]),
  },

  methods: {
    async initComp() {
      window.garage.toggleCeilingRaise(true);
    },

    handlePositionClick(lifterInfo) {
      window.garageScene.flyTo(lifterInfo.targetPosition, [0, 5, -5]);
    },

    getLifterIconColor(lifterInfo) {
      switch (lifterInfo.status) {
        case LIFTER_STATUS_AUTO:
          return "#67C23A";

        case LIFTER_STATUS_HAND:
          return "#409EFF";

        case LIFTER_STATUS_ANOMALY:
          return "#F56C6C";
      }
    },

    handleStatusClick(lifterId, status) {
      this.$axios.post("/garage/lifter/status/set", {
        id: lifterId,
        status,
      });
    },

    handelLifterCheckBoxChange(lifterInfo) {
      if (!lifterInfo.isRaised) {
        // 升
        this.$axios.get(`/garage/lifter/up/${lifterInfo.id}`);
      } else {
        // 降
        this.$axios.get(`/garage/lifter/down/${lifterInfo.id}`);
      }
    },
  },

  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    this.lifterInfoIntervalId && clearInterval(this.lifterInfoIntervalId);
  },
};
</script>

<style lang="less" scoped>
.outer_panel {
  height: 100%;
  width: 100%;
  pointer-events: none;
  @lightBlue: rgb(33, 194, 237);
  @darkBlue: rgb(2, 77, 137);

  .lifter_list_panel {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    pointer-events: all;

    .lifter_info_item_panel {
      height: 60px;
      width: 100%;
      box-sizing: border-box;
      border-radius: 5px;
      border: solid 2px @lightBlue;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 5px 0;
      overflow: hidden;

      .left_panel {
        width: auto;
        height: auto;
        display: flex;
        flex-direction: row;
        align-items: center;

        .lifter_icon {
          color: #409eff;
          font-size: 30px;
          margin: 0 10px;
        }

        .lifter_name {
          font-size: 20px;
          color: white;

          &:hover {
            cursor: pointer;
            transform: scale(1.1);
          }
        }

        .status_span {
          font-size: 20px;
        }

        .auto_span {
          color: #67c23a;
        }

        .hand_span {
          color: #409eff;
        }

        .broken_span {
          color: #f56c6c;
        }

        .auto_icon {
          margin-left: 10px;
          font-size: 22px;
          color: gray;
          &:hover {
            cursor: pointer;
            transform: scale(1.1);
          }
        }

        .auto_icon.active {
          color: #67c23a;
          animation: icon_rotation infinite 5s linear;
          &:hover {
            cursor: default;
          }

          @keyframes icon_rotation {
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

        .auto_icon.broken {
          pointer-events: none;
          color: #f56c6c;
        }

        .hand_icon {
          margin-left: 10px;
          font-size: 20px;
          color: gray;
          font-weight: 700;
          &:hover {
            cursor: pointer;
            transform: scale(1.1);
          }
        }

        .hand_icon.active {
          color: #409eff;

          animation: icon_hang infinite 0.5s linear alternate-reverse;
          &:hover {
            cursor: default;
          }

          @keyframes icon_hang {
            0% {
              transform: translateY(1px);
            }

            100% {
              transform: translateY(-1px);
            }
          }
        }
      }

      .right_panel {
        width: auto;
        height: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-right: 10px;

        .status_span.open {
          color: #67c23a;
          font-size: 20px;
          margin: 0 5px;
        }

        .status_span.close {
          color: #e6a23c;
          font-size: 20px;
          margin: 0 5px;
        }

        .switch-panel-enter-active {
          animation: switch_panel_show 0.5s;

          @keyframes switch_panel_show {
            0% {
              width: 0;
            }

            100% {
              width: 55px;
            }
          }
        }

        .switch-panel-leave-active {
          animation: switch_panel_leave 0.5s;

          @keyframes switch_panel_leave {
            0% {
              width: 55px;
            }

            100% {
              width: 0;
            }
          }
        }

        .switch_panel {
          width: 55px;

          .switch-button {
            display: none;
            /*隐藏表单元素*/
          }

          .switch-button + label {
            /*+选择器选择紧跟“+”左边选择器的第一个元素*/
            display: inline-block;
            position: relative;
            transition: all 0.3s;
            width: 45px;
            height: 24px;
            border-radius: 15px;
            background-color: @darkBlue;
            margin: 0 5px;

            &:hover {
              cursor: pointer;
            }
          }

          .switch-button:checked + label {
            /*选中表单后的样式，:checked表示checkbox被选中后的状态*/
            background-color: @lightBlue;
          }

          .switch-button + label::before {
            /*使用伪元素生成一个按钮*/
            content: "";
            display: block;
            height: 20px;
            width: 20px;
            position: absolute;
            border-radius: 20px;
            left: 2px;
            top: 2px;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
            transition: all 0.3s;
          }

          .switch-button:checked + label::before {
            /*checkbox选中时按钮的样式*/
            left: 22px;
            transition: all 0.2s linear;
          }
        }
      }
    }
  }
}
</style>
