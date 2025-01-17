<template>
  <div class="progress_detail_outer_panel">
    <div
      v-for="position of ['lt', 'lb', 'rb', 'rt', 'l', 'r', 't', 'b']"
      :class="'border_' + position"
      :key="position"
    ></div>
    <div class="progress_detail_header_panel">
      <div class="title_panel">住户走访进度</div>
      <i
        class="iconfont icon-close icon_close"
        @click="handleCloseIconClick"
      ></i>
    </div>
    <div class="progress_detail_content_panel pretty_scrollbar">
      <div
        class="building_item_panel"
        v-for="buildingInfo of showInfoList"
        :key="buildingInfo.id"
      >
        <div class="title_panel" @click="handleBuildingClick(buildingInfo.id)">
          {{ buildingInfo.name }}
        </div>
        <transition name="interview-content">
          <div
            class="content_panel"
            v-show="currentDetailStatus.currentBuildingId === buildingInfo.id"
          >
            <div class="unit_header_panel">
              <div
                v-for="unitInfo of currentBuildingInfo.infoList"
                class="unit_item_panel"
                :key="unitInfo.id"
                :class="{
                  finish_status: ifUnitFinish(unitInfo),
                  pending_status: !ifUnitFinish(unitInfo),
                  selected_box:
                    currentDetailStatus.currentUnitId === unitInfo.id,
                  unselected_box:
                    currentDetailStatus.currentUnitId !== unitInfo.id,
                }"
                @click="handleUnitClick(unitInfo.id)"
              >
                {{ unitInfo.name }}
              </div>
            </div>
            <div class="unit_content_panel">
              <div class="group_panel pretty_scrollbar">
                <div
                  v-for="groupInfo of currentUnitInfo.infoList"
                  class="group_item"
                  :class="{
                    finish_status: ifGroupFinish(groupInfo),
                    pending_status: !ifGroupFinish(groupInfo),
                    selected_box:
                      currentDetailStatus.currentGroupId === groupInfo.id,
                    unselected_box:
                      currentDetailStatus.currentGroupId !== groupInfo.id,
                  }"
                  :key="groupInfo.id"
                  @click="handleGroupClick(groupInfo.id)"
                >
                  {{ groupInfo.name }}
                </div>
              </div>
              <div class="room_panel pretty_scrollbar">
                <el-popover
                  v-for="roomInfo of currentGroupInfo.infoList"
                  :key="roomInfo.id"
                  placement="bottom"
                  trigger="hover"
                  :open-delay="0"
                  :close-delay="0"
                  :disabled="roomInfo.remark ===null || roomInfo.remark===undefined || roomInfo.remark===''"
                  :content="roomInfo.remark"
                >
                  <div
                    slot="reference"
                    class="room_item"
                    :class="{
                      finish_status: roomInfo.status === 2,
                      abnormal_status: roomInfo.status === 1,
                      pending_status: roomInfo.status === 0,
                    }"
                    :key="roomInfo.id"
                  >
                    <span> {{ roomInfo.houseNumber }}</span>
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressDetailComponent",
  props: ["interviewInfo", "closeDetailPanel"],
  data() {
    return {
      currentDetailStatus: {
        currentBuildingId: 1,
        currentUnitId: 1,
        currentGroupId: 1,
      },
    };
  },
  computed: {
    showInfoList() {
      return this.interviewInfo.map((buildingInfo) => {
        return {
          id: buildingInfo.id,
          name: buildingInfo.name,
          infoList: buildingInfo.progress.map((unitInfo, index) => {
            // 每组层数
            const groupFloorNumber = 5;
            // n层一组
            const groupList = _.chunk(unitInfo, groupFloorNumber);

            return {
              id: index + 1,
              name: `第${index + 1}单元`,
              infoList: groupList.map((groupInfo, index) => {
                let lastFloor = (index + 1) * groupFloorNumber;
                lastFloor -= groupFloorNumber - groupInfo.length;
                return {
                  id: index + 1,
                  name: `${index * groupFloorNumber + 1}-${lastFloor}层`,
                  infoList: _.flattenDeep(groupInfo),
                };
              }),
            };
          }),
        };
      });
    },

    currentBuildingInfo() {
      return this.showInfoList.find(
        (buildingInfo) =>
          buildingInfo.id === this.currentDetailStatus.currentBuildingId
      );
    },

    currentUnitInfo() {
      return this.currentBuildingInfo.infoList.find(
        (unitInfo) => unitInfo.id === this.currentDetailStatus.currentUnitId
      );
    },

    currentGroupInfo() {
      return this.currentUnitInfo.infoList.find(
        (groupInfo) => groupInfo.id === this.currentDetailStatus.currentGroupId
      );
    },
  },

  methods: {
    handleCloseIconClick() {
      this.closeDetailPanel();
    },
    handleBuildingClick(buildingId) {
      this.currentDetailStatus.currentBuildingId = buildingId;
      setTimeout(() => {
        this.currentDetailStatus.currentUnitId = 1;
        this.currentDetailStatus.currentGroupId = 1;
      }, 200);
    },

    handleUnitClick(unitId) {
      this.currentDetailStatus.currentUnitId = unitId;
      this.currentDetailStatus.currentGroupId = 1;
    },
    handleGroupClick(groupId) {
      this.currentDetailStatus.currentGroupId = groupId;
    },

    ifGroupFinish(groupInfo) {
      return _.every(groupInfo.infoList, (roomInfo) => roomInfo.status === 2);
    },

    ifUnitFinish(unitInfo) {
      return _.every(unitInfo.infoList, (groupInfo) =>
        this.ifGroupFinish(groupInfo)
      );
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
@lightBlue: rgb(33, 194, 237);
@darkBlue: rgb(24, 49, 85);
.progress_detail_outer_panel {
  position: relative;
  width: 450px;
  height: 500px;
  background: rgba(24, 49, 85, 0.95);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .corner_border() {
    position: absolute;
    width: 30px;
    height: 30px;
    box-sizing: border-box;
    pointer-events: none;
  }

  .border_rt {
    right: 0;
    top: 0;
    border-radius: 0px 10px 0px 0px;
    border-right: 3px @lightBlue solid;
    border-top: 3px @lightBlue solid;
    .corner_border();
  }

  .border_rb {
    right: 0;
    bottom: 0;
    border-radius: 0px 0px 10px 0px;
    border-right: 3px @lightBlue solid;
    border-bottom: 3px @lightBlue solid;
    .corner_border();
  }

  .border_lt {
    left: 0;
    top: 0;
    border-radius: 10px 0px 0px 0px;
    border-left: 3px @lightBlue solid;
    border-top: 3px @lightBlue solid;
    .corner_border();
  }

  .border_lb {
    left: 0;
    bottom: 0;
    border-radius: 0px 0px 0px 10px;
    border-left: 3px @lightBlue solid;
    border-bottom: 3px @lightBlue solid;
    .corner_border();
  }

  .progress_detail_header_panel {
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid white;
    margin: 0 10px;

    .title_panel {
      color: white;
      font-size: 20px;
      font-weight: 700;
    }

    .icon_close {
      font-size: 20px;
      font-weight: 700;
      color: white;
      &:hover {
        cursor: pointer;
        transform: scale(1.2);
      }
    }
  }

  .progress_detail_content_panel {
    flex: 1;
    box-sizing: border-box;
    padding: 0 10px;

    .building_item_panel {
      height: auto;
      border: 2px solid white;
      margin: 10px 0;
      border-radius: 10px;
      overflow: hidden;

      .title_panel {
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 20px;
        color: white;
        box-sizing: border-box;
        font-weight: 700;
        padding-left: 10px;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
        }
      }

      .content_panel {
        height: 300px;
        .unit_header_panel {
          height: 40px;
          display: flex;
          flex-direction: row;
          box-sizing: border-box;
          padding: 0 5px;

          .unit_item_panel {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            color: white;
            box-sizing: border-box;
            font-size: 18px;

            &:hover {
              font-size: 20px;
              cursor: pointer;
            }
          }
        }

        .unit_content_panel {
          height: 260px;
          display: flex;
          flex-direction: row;

          .group_panel {
            width: 120px;
            height: 100%;

            .group_item {
              height: 50px;
              margin: 10px 5px;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              color: white;
              font-size: 18px;

              &:hover {
                cursor: pointer;
                font-size: 20px;
              }
            }
          }

          .room_panel {
            flex: 1;
            height: 100%;
            display: grid;
            grid-template-columns: repeat(3, 87px);
            grid-gap: 12px;
            box-sizing: border-box;
            padding: 10px;
            grid-auto-rows: 45px;

            .room_item {
              height: 45px;
              width: 87px;
              position: relative;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              font-size: 18px;
              color: white;
              border: 2px solid white;

              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }

      .interview-content-enter-active {
        animation: scale-in-ver-top 0.3s linear both;
      }

      .interview-content-leave-active {
        animation: scale-in-ver-top 0.3s linear both reverse;
      }

      @keyframes scale-in-ver-top {
        0% {
          height: 0;
        }
        100% {
          height: 300px;
        }
      }
    }
  }
}

.finish_status {
  background: rgba(103, 194, 58, 0.8);
}

.abnormal_status {
  background: rgba(230, 162, 60, 0.8);
}

.pending_status {
  background: rgba(144, 147, 153, 0.8);
}

.selected_box {
  border: 2px solid rgb(33, 194, 237);
}

.unselected_box {
  border: 2px solid white;
}


</style>
