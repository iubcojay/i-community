<template>
  <div class="outer_panel">
    <folder-panel-component position="left" title="车位列表" height="400px">
      <template slot="content">
        <div class="parking_space_panel">
          <div class="area_list_panel">
            <div
              class="area_list_item_panel"
              :class="{ area_list_item_active: activeArea === 0 }"
              style="background-color: #409eff;"
              @click="handleAreaItemClick(0)"
            >
              <span class="area_list_item_text_panel">A区</span>
            </div>
            <div
              class="area_list_item_panel"
              :class="{ area_list_item_active: activeArea === 1 }"
              style="background-color: #e6a23c;"
              @click="handleAreaItemClick(1)"
            >
              <span class="area_list_item_text_panel">B区</span>
            </div>
            <div
              class="area_list_item_panel"
              :class="{ area_list_item_active: activeArea === 2 }"
              style="background-color: #67c23a;"
              @click="handleAreaItemClick(2)"
            >
              <span class="area_list_item_text_panel">C区（充电）</span>
            </div>
          </div>
          <div class="space_list_panel">
            <div
              v-for="(group, index) of spaceGroupInfoList"
              class="space_group_item"
              :style="itemColorStyle"
              @click="handleSpaceGroupClick(group)"
              :key="index"
            >
              <span class="space_group_text"
                >{{ group.spaceInfoList[0].name }}~{{
                  group.spaceInfoList[group.spaceInfoList.length - 1].name
                }}</span
              >
            </div>
          </div>
        </div>
      </template>
    </folder-panel-component>
  </div>
</template>

<script>
import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
import _ from "lodash";

export default {
  name: "GarageGovernanceFacilityParkingSpaceLeftComponent",
  components: { FolderPanelComponent },
  props: ["supData"],

  data() {
    return {
      activeArea: 0,
    };
  },

  methods: {
    initComp() {},

    handleAreaItemClick(index) {
      this.activeArea = index;
    },

    handleSpaceGroupClick(group) {
      const targetPosition = group.spaceInfoList.reduce(
        (pre, currentSpaceInfo) => {
          return [
            pre[0] + currentSpaceInfo.position[0],
            pre[1] + currentSpaceInfo.position[1],
            pre[2] + currentSpaceInfo.position[2],
          ];
        },
        [0, 0, 0]
      );

      targetPosition[0] = targetPosition[0] / group.spaceInfoList.length;
      targetPosition[1] = targetPosition[1] / group.spaceInfoList.length;
      targetPosition[2] = targetPosition[2] / group.spaceInfoList.length;

      window.garageScene.flyTo(targetPosition, [0, 5, -5]);
    },
  },

  computed: {
    spaceGroupInfoList() {
      return this.supData.areaData[this.activeArea].spaceGroupInfoList;
    },

    itemColorStyle() {
      let color = "#409EFF";
      switch (this.activeArea) {
        case 0:
          color = "#409EFF";
          break;
        case 1:
          color = "#E6A23C";
          break;

        case 2:
          color = "#67C23A";
          break;
      }

      return { "background-color": color };
    },
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

  .parking_space_panel {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .area_list_panel {
      width: 50px;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      margin-left: 5px;

      .area_list_item_panel {
        width: 100%;
        height: 130px;
        color: white;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        font-weight: 700;
        border: transparent 2px solid;
        border-right: 2px white solid;

        &:hover {
          font-size: 21px;
          cursor: pointer;
        }

        .area_list_item_text_panel {
          writing-mode: vertical-lr;
        }
      }

      .area_list_item_active {
        border: white 2px solid;
        border-right: transparent 2px solid;
      }
    }

    .space_list_panel {
      height: 400px;
      flex: 1;
      border: 2px solid white;
      border-left: 0;
      box-sizing: border-box;
      padding: 5px;
      display: grid;
      justify-content: space-around;
      grid-template-columns: repeat(auto-fill, 30%);
      grid-gap: 10px;

      .space_group_item {
        width: 100%;
        height: 50px;
        margin-bottom: 5px;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border: 1px solid white;
        border-radius: 5px;
        font-size: 16px;

        &:hover {
          // font-size: 18px;
          cursor: pointer;
          transform: scale(1.1);
        }

        .space_group_text {
          color: white;

          font-weight: 700;
        }
      }
    }
  }
}
</style>
