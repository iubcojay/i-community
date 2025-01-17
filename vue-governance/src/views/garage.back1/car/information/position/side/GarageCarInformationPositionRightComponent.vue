<template>
  <div class="outer_panel">
    <ArchPanelComponent position="right" height="500px">
      <template slot="content">
        <div class="content_panel">
          <div class="search_panel">
            <input
              type="text"
              class="text_input"
              v-model="searchKeyword"
              placeholder="请输入车牌号"
              @input="handleSearch"
            />
            <i class="iconfont icon-search icon_search"></i>
          </div>
          <div class="license_panel">
            <div
              class="license_list_panel"
              :class="{ active: selectedId === id }"
              v-for="{ carInfoList, group, id, ifHighLight } of areaCarInfoList"
              :key="id"
            >
              <div
                class="license_list_title_panel"
                @click="handleGroupTileClick(id)"
                :class="{ highlight: ifHighLight }"
              >
                <!-- <i class="iconfont icon-down icon_down"></i> -->
                <span v-if="id < 4">{{ group }}区</span>
                <span v-else>{{ group }}</span>
              </div>
              <div class="license_content_panel pretty_scrollbar">
                <div class="license_warp_panel">
                  <div
                    class="license_item_panel"
                    :class="{ highlight: carInfo.ifHighLight }"
                    v-for="carInfo of carInfoList"
                    :key="carInfo.license"
                    @click="handleLicenseClick(carInfo)"
                  >
                    {{ carInfo.license }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </ArchPanelComponent>
  </div>
</template>

<script>
import ArchPanelComponent from "@/views/common/InfoPanel/sidepanel/ArchPanelComponent";
import { mapActions } from "vuex";
export default {
  name: "GarageCarInformationPositionRightComponent",
  props: ["supData", "supMethods"],
  data() {
    return {
      searchKeyword: "",
      selectedId: 1,
      areaCarInfoList: [],
      targetCar: undefined,
    };
  },
  components: { ArchPanelComponent },
  computed: {
    // areaCarInfoList() {
    //   this.supData.areaCarInfoList.forEach(areaCarInfo => {
    //   });
    //   return this.supData.areaCarInfoList;
    // }
  },
  methods: {
    ...mapActions("garageAbout", ["setCarBaseInfoShow"]),
    handleSearch(ifAutoUnfold = true) {
      this.areaCarInfoList.forEach((areaCarInfo) => {
        let hightLightFlag = false;
        areaCarInfo.carInfoList.forEach((carInfo) => {
          if (
            this.searchKeyword !== "" &&
            carInfo.license.includes(this.searchKeyword)
          ) {
            carInfo.ifHighLight = true;
            hightLightFlag = true;
          } else {
            carInfo.ifHighLight = false;
          }
        });
        if (hightLightFlag) {
          areaCarInfo.ifHighLight = true;
        } else {
          areaCarInfo.ifHighLight = false;
        }
      });

      if (ifAutoUnfold) {
        // 打开包含关键字的第一个组
        for (const areaCarInfo of this.areaCarInfoList) {
          if (areaCarInfo.ifHighLight) {
            this.selectedId = areaCarInfo.id;
            break;
          }
        }
      }
    },

    handleGroupTileClick(id) {
      this.selectedId = id;
    },

    handleLicenseClick(carInfo) {
      this.setCarBaseInfoShow({ id: carInfo.id, option: true });
      const carGroup = window.garageScene.scene.getObjectByName("carGroup");
      const carModel = carGroup.getObjectByName(`car_${carInfo.id}`);
      if (carModel) {
        window.garageScene.flyToModel(carModel, [0, 20, 20]);
      } else {
        this.$message.error("该车辆已不在库中！");
      }
    },
  },
  watch: {
    "supData.areaCarInfoList": {
      handler(newAreaCarInfoList) {
        this.areaCarInfoList = newAreaCarInfoList;
        //跟新之后重新搜索一次，延续高亮效果
        this.handleSearch(false);
      },
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.outer_panel {
  position: absolute;
  width: 90%;
  height: 100%;
  top: 0;
  right: 0;
  @lightBlue: rgb(33, 194, 237);
  @darkBlue: rgb(2, 77, 137);

  .content_panel {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .search_panel {
      width: 100%;
      height: 50px;
      border-radius: 5px;
      box-sizing: border-box;
      border: 1px solid white;
      background: fade(white, 30);
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;

      .text_input {
        height: 80%;
        width: 80%;
        background: none;
        outline: none;
        border: none;
        font-size: 23px;
        color: white;
        font-weight: 700;

        &::placeholder {
          font-size: 18px;
          color: fade(white, 50);
        }
      }

      .icon_search {
        font-size: 25px;
        color: white;
        font-weight: 700;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .license_panel {
      width: 100%;
      flex: 1;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      .license_list_panel {
        width: 100%;
        height: auto;
        box-sizing: border-box;
        border: 2px white solid;

        .license_list_title_panel {
          height: 40px;
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          color: white;
          font-size: 20px;
          font-weight: 700;
          padding-left: 20px;
          box-sizing: border-box;
          background: fade(gray, 40);
          cursor: pointer;

          &.highlight {
            color: @lightBlue;
          }

          &:hover {
            background: fade(gray, 60);
          }

          .icon_down {
            margin-right: 15px;
            font-size: 24px;
          }
        }
        .license_content_panel {
          width: 100%;
          height: 0px;
          overflow: auto;
          transition: height 0.5s;

          .license_warp_panel {
            display: grid;
            align-items: center;
            justify-items: center;
            box-sizing: border-box;
            padding: 10px;
            width: 100%;
            height: auto;
            grid-template-columns: 1fr 1fr 1fr;
            column-gap: 10px;
            row-gap: 10px;
            .license_item_panel {
              background: rgb(0, 46, 135);
              width: 120px;
              height: 55px;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              color: white;
              font-weight: 700;
              font-size: 18px;
              border: 2px solid white;
              cursor: pointer;
              transition: all 0.3s;
              &:hover {
                transform: scale(1.1);
              }

              &.highlight {
                border: 2px solid @lightBlue;
              }
            }
          }
        }
      }

      .license_list_panel.active {
        .license_content_panel {
          height: 200px;
          border-top: 2px solid white;
        }
      }
    }
  }
}
</style>
