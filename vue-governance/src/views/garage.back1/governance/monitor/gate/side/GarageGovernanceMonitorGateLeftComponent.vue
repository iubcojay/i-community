<template>
  <div class="outer_panel">
    <folder-panel-component position="left" title="监控列表" height="400px">
      <template slot="content">
        <div class="monitor_list_panel">
          <div
            class="monitor_item_panel"
            v-for="(monitorInfo, index) of gateMonitorList"
            :key="index"
          >
            <div class="left_panel">
              <i class="monitor_icon iconfont icon-monitor"></i>
              <span class="monitor_name">{{ monitorInfo.name }}</span>
            </div>
            <div class="right_panel">
              <i
                class="iconfont icon-address icon_address"
                @click="handlePositionClick(monitorInfo)"
              ></i>
              <div class="switch_panel">
                <input
                  type="checkbox"
                  class="switch-button"
                  :id="'switch-button-' + index"
                  :checked="monitorInfo.ifShow"
                  @change="handelLifterCheckBoxChange(monitorInfo)"
                />
                <label :for="'switch-button-' + index"></label>
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
  name: "GarageGovernanceMonitorGateLeftComponent",
  components: { FolderPanelComponent },
  props: ["supMethods", "supData"],
  data() {
    return {
      gateMonitorList: [],
    };
  },

  methods: {
    initComp() {
      this.setGateMonitorList();
    },

    setGateMonitorList() {
      this.gateMonitorList = this.supData.gateMonitorList;
    },

    handlePositionClick(monitorInfo) {
      window.garageScene.flyTo(monitorInfo.targetPosition, [0, 5, -5]);
    },

    handelLifterCheckBoxChange(monitorInfo) {
      this.gateMonitorList.forEach((monitor) => {
        if (monitor.id == monitorInfo.id) {
          if (monitorInfo.ifShow) {
            monitorInfo.ifShow = false;
            this.supMethods.setSideBarShowStatus(true, false);
          } else {
            monitorInfo.ifShow = true;
            this.supMethods.setSideBarShowStatus(true, true);
          }
        } else {
          monitor.ifShow = false;
        }
      });
    },
  },

  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    this.monitorInfoIntervalId && clearInterval(this.monitorInfoIntervalId);
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

  .monitor_list_panel {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    pointer-events: all;

    .monitor_item_panel {
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

        .monitor_icon {
          color: #409eff;
          font-size: 30px;
          margin: 0 10px;
        }

        .monitor_name {
          font-size: 20px;
          color: white;
        }

        .status_span {
          font-size: 20px;
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
      }

      .right_panel {
        width: auto;
        height: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-right: 10px;

        .icon_address {
          color: white;
          font-size: 20px;
          margin: 0 10px;

          &:hover {
            cursor: pointer;
            transform: scale(1.1);
          }
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
