<template>
  <div class="outer_panel">
    <div class="side_list_panel">
      <div
        class="side_item_panel"
        v-for="videoInfo of sideVideoList.slice(0, sideVideoList.length / 2)"
        :key="videoInfo.id"
      >
        <video
          :src="$StaticResourceAddress + videoInfo.videoUrl"
          :controls="false"
          loop
          autoplay
          muted
          class="side_video_comp"
        ></video>
        <div class="position_text_panel">{{ videoInfo.position }}</div>
      </div>
    </div>
    <div class="center_panel">
      <div
        v-if="displayVideoList[index]"
        v-for="(position, index) of ['left_top', 'left_bottom', 'right_top', 'right_bottom']"
        :class="'center_' + position + '_panel'"
        :key="position"
      >
        <div
          class="video_warp_panel"
          :class="{ warning_animation: displayVideoList[index].ifWarning }"
        >
          <video
            :src="$StaticResourceAddress + displayVideoList[index].videoUrl"
            :controls="false"
            loop
            autoplay
            muted
            class="display_video_comp"
          ></video>
          <div class="position_text_panel">{{ displayVideoList[index].position }}</div>
          <div
            v-if="displayVideoList[index].ifWarning"
            class="position_mask_panel"
            @click="handleAddressClick(displayVideoList[index])"
          >
            <i class="icon_position iconfont icon-address"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="side_list_panel">
      <div
        class="side_item_panel"
        v-for="videoInfo of sideVideoList.slice(sideVideoList.length / 2)"
        :key="videoInfo.id"
      >
        <video
          :src="$StaticResourceAddress + videoInfo.videoUrl"
          :controls="false"
          loop
          autoplay
          muted
          class="side_video_comp"
        ></video>
        <div class="position_text_panel">{{ videoInfo.position }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "DisplayVideoComponent",
  props: ["displayList", "setIsVideoWallFolded"],

  methods: {
    handleAddressClick(videoInfo) {
      this.setIsVideoWallFolded(true);
      // window.myEarth.flyToPosition(videoInfo.address, 40)

      window.myEarth.removeEntityFromEarth("polygon_parking_area");
      window.myEarth.removeEntityFromEarth("pin_parking_area");

      // 加入监控区域
      let areaStr = {
        xbsjType: "Polygon",
        positions: videoInfo.areaPositionList,
        height: 5.5998584318532485,
        extrudedHeight: null,
        color: [1, 0.9882352941176471, 0, 0.49],
        outline: {
          show: false
        }
      };

      window.myEarth.pushEntityToEarth("polygon_parking_area", areaStr);
      let cartesian3Positions = Cesium.Cartesian3.fromRadiansArray(
        videoInfo.areaPositionList
      );

      //中心点(弧度数组)
      let areaCenterPosition = Object.values(
        Cesium.Cartographic.fromCartesian(
          Cesium.BoundingSphere.fromPoints(cartesian3Positions).center
        )
      );
      areaCenterPosition[2] = areaStr.height + 1;

      window.myEarth.pushEntityToEarth("pin_parking_area", {
        xbsjType: "Pin",
        position: areaCenterPosition,
        pinBuilder: {
          makiIcon: "car"
        },
        iframe: {},
        far: 1073741824
      });

      window.myEarth.flyToModel("polygon_parking_area");
    }
  },

  computed: {
    displayVideoList() {
      let displayVideoList = this.displayList.filter(item => item.ifWarning);
      let paddingNum = 4 - displayVideoList.length;
      if (paddingNum < 0) {
        displayVideoList = _.sampleSize(displayVideoList, 4);
      } else if (paddingNum > 0) {
        const safeList = this.displayList.filter(item => !item.ifWarning);

        let paddingList = _.sampleSize(safeList, paddingNum);
        displayVideoList = [...displayVideoList, ...paddingList];
      }

      return displayVideoList;
    },

    sideVideoList() {
      let displayVideoIdList = this.displayVideoList.map(item => item.id);

      let sideVideoList = this.displayList.filter(item => {
        if (displayVideoIdList.indexOf(item.id) === -1) {
          return true;
        } else {
          return false;
        }
      });
      return sideVideoList;
    }
  }
};
</script>

<style lang="less" scoped>
@lightBlue: rgb(33, 194, 237);
@darkBlue: rgb(2, 77, 137);
@warningRed: red;

.outer_panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .side_list_panel {
    width: 100%;
    height: 120px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .side_item_panel {
      height: 100%;
      position: relative;
      flex: 1;
      box-sizing: border-box;
      border: 1px solid @darkBlue;

      .side_video_comp {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }

      .position_text_panel {
        position: absolute;
        right: 0;
        bottom: 0;
        width: auto;
        height: auto;
        font-size: 15px;
        color: white;
        text-shadow: 0 0 10px #478de0, 0 0 20px #478de0, 0 0 30px #478de0;
      }
    }
  }

  .center_panel {
    width: 100%;
    flex: 1;
    position: relative;

    .center_video_panel {
      width: 50%;
      height: 50%;
      position: absolute;
      box-sizing: border-box;
      border: 3px solid @darkBlue;

      .video_warp_panel {
        height: 100%;
        width: 100%;
        position: relative;

        .display_video_comp {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: fill;
        }

        .position_text_panel {
          height: 100%;
          width: auto;
          position: absolute;
          writing-mode: vertical-lr;
          font-size: 25px;
          color: white;
          font-weight: 500;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          left: 15px;
          top: 0;
          text-shadow: 0 0 10px #478de0, 0 0 20px #478de0, 0 0 30px #478de0;
        }

        .position_mask_panel {
          position: absolute;
          height: 100%;
          width: 100%;
          left: 0;
          top: 0;
          z-index: 999;
          // background-color: rgba(0, 0, 0, 0.5);
          opacity: 0;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;

          &:hover {
            cursor: pointer;
          }

          .icon_position {
            font-size: 60px;
            color: white;
            font-weight: 700;
          }
        }

        &:hover .position_mask_panel {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.5);
        }
      }

      .warning_animation {
        animation: warning_border infinite 1s ease-in-out alternate-reverse;
      }

      @keyframes warning_border {
        0% {
          box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0);
        }

        100% {
          box-shadow: 0 0 20px 5px @warningRed;
        }
      }
    }

    .center_left_top_panel {
      .center_video_panel();
      left: 0;
      top: 0;
    }

    .center_left_bottom_panel {
      .center_video_panel();
      left: 0;
      bottom: 0;
    }

    .center_right_top_panel {
      .center_video_panel();
      right: 0;
      top: 0;
    }

    .center_right_bottom_panel {
      .center_video_panel();
      right: 0;
      bottom: 0;
    }
  }
}
</style>