<template>
  <div class="controller_panel">
    <SideBarComponent class="side_bar_panel">
      <ProcessStreetTaskAddLeftComponent
        v-show="ifSideBarShow.ifLeftPanelShow"
        :sup-methods="leftMethods"
        :sup-data="leftData"
        slot="leftPanel"
      ></ProcessStreetTaskAddLeftComponent>
      <ProcessStreetTaskAddRightComponent
        ref="processStreetTaskAddRightComponent"
        v-show="ifSideBarShow.ifRightPanelShow"
        :sup-methods="rightMethods"
        :sup-data="rightData"
        slot="rightPanel"
      ></ProcessStreetTaskAddRightComponent>
    </SideBarComponent>

    <div
      :class="[
        ifOrganizationChartShow
          ? 'organization_chart_mask_panel_show'
          : 'organization_chart_mask_panel_hind',
      ]"
    >
      <transition name="organization-chart">
        <div class="organization_chart_panel" v-if="ifOrganizationChartShow">
          <div
            v-for="position of ['lt', 'lb', 'rb', 'rt', 'l', 'r', 't', 'b']"
            :class="'border_' + position"
            :key="position"
          ></div>
          <div class="title_panel">
            <span class="title_span">任务委派</span>
            <i
              class="iconfont icon-close icon_close"
              @click="handleCloseClick"
            ></i>
          </div>
          <div class="content_panel">
            <appoint-organization-chart-component
              ref="appoint_organization_chart_component"
              v-if="chartAreaList.length > 0"
              :area-info-list="chartAreaList"
              :selected-participant-list="selectedParticipantList"
            ></appoint-organization-chart-component>
          </div>

          <div class="reset_button" @click="handleResetClick">重 置</div>
          <div class="recommend_button" @click="handleRecommendClick">
            智能推荐
          </div>
          <div class="confirm_button" @click="handleConfirmClick">确 定</div>
        </div>
      </transition>
    </div>

    <div class="cesium_poi_panel">
      <appoint-info-pin-component
        v-for="area of subAreaList"
        :area-info="area"
        :selected-participant-list="selectedParticipantList"
        :key="area.id"
      ></appoint-info-pin-component>
    </div>
  </div>
</template>

<script>
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";
import { mapState } from "vuex";
import ProcessStreetTaskAddLeftComponent from "@/views/index/community/governance/process/street/taskadd/side/ProcessStreetTaskAddLeftComponent";
import ProcessStreetTaskAddRightComponent from "@/views/index/community/governance/process/street/taskadd/side/ProcessStreetTaskAddRightComponent";
import AppointInfoPinComponent from "@/views/index/community/common/pin/AppointInfoPinComponent";
import AppointOrganizationChartComponent from '@/views/index/community/governance/process/common/appoint/AppointOrganizationChartComponent'
import * as _ from "lodash";

export default {
  name: "ProcessStreetTaskAddControllerComponent",
  components: {
    ProcessStreetTaskAddRightComponent,
    ProcessStreetTaskAddLeftComponent,
    SideBarComponent,
    AppointInfoPinComponent,
    AppointOrganizationChartComponent,
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false,
      },
      ifOrganizationChartShow: false,
      subAreaList: [],
      chartAreaList: [],
      selectedParticipantList: [],
      taskData: {
        title: "",
        description: "",
        scheduledTime: "",
      },
    };
  },

  computed: {
    ...mapState("userAbout", ["userInfo", "areaInfo"]),
    leftData() {
      return {
        subAreaList: this.subAreaList,
        selectedParticipantList: this.selectedParticipantList,
        taskData: this.taskData,
      };
    },

    leftMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus,
        setOrganizationChartShow: this.setOrganizationChartShow,
      };
    },

    rightData() {
      return {};
    },

    rightMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus,
      };
    },
  },

  methods: {
    initComp() {
      this.setSideBarShowStatus(true, false);
      window.myEarth.initCommunityPosition(this.areaInfo);
      this.setAreaList();
    },

    setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
      this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow;
      this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow;
    },

    async setAreaList() {
      let param = this.$common.packagingAxiosParam({
        id: this.areaInfo.id,
      });

      // 获取下属社区的信息
      const { data: subAreaList } = await this.$axios.post(
        "/area/getSubAreaListById",
        param
      );
      this.subAreaList = _.cloneDeep(subAreaList);
      this.addAreaListToEarth(this.subAreaList);

      // 获取包括自身和下属的社区信息
      const { data: area } = await this.$axios.post("/area/getAreaById", param);
      // root节点添加标记
      area.ifRoot = true;
      this.chartAreaList = _.cloneDeep(subAreaList).map((area) => {
        area.ifRoot = false;
        return area;
      });
      this.chartAreaList.unshift(area);
      // this.test();
    },

    addAreaListToEarth(subAreaList) {
      subAreaList.forEach((area, index) => {
        this.$set(area, "winPos", [0, 0, 0, 0]);
        let areaCesiumObject = JSON.parse(area.cesiumCode);
        areaCesiumObject.show = true;
        areaCesiumObject.color[3] = 0.3;
        window.myEarth.pushEntityToEarth("area_" + area.id, areaCesiumObject);
        window.myEarth.pushEntityToEarth("area_" + area.id + "_pin", {
          xbsjType: "Pin",
          position: this.$common.gridPolygonGetCenter(areaCesiumObject),
          show: false,
        });
        let pin =
          window.myEarth.earth.sceneTree.$refs["area_" + area.id + "_pin"]
            .czmObject;
        let str = `subAreaList.${index}.winPos`;
        XE.MVVM.track(this, str, pin, "winPos");
      });
    },

    setOrganizationChartShow(value) {
      if (value) {
        // 打开组织架构图，同时添加得分评估信息
        this.chartAreaList
          .flatMap((areaInfo) => areaInfo.adminUser)
          .forEach((user) => {
            const recommendScores = this.getUserRecommendScore(
              user,
              this.taskData
            );
            user.recommendFactor = recommendScores;
          });
      }
      this.ifOrganizationChartShow = value;
    },

    getUserRecommendScore(user, task) {
      // let template = {
      //   // 历史任务匹配度
      //   thm: 0.8,
      //   // 历史任务完成率
      //   tcr: 0.95,
      //   // 任务平均响应时间
      //   atrt: 2.5,
      //   // 工龄
      //   seniority: 4,
      //   // 推荐指数
      //   score: 8.2
      // };
      const candidateResultList = [
        {
          thm: 0.8,
          tcr: 0.95,
          atrt: 2.5,
          seniority: 4,
          score: 8.2,
        },
        {
          thm: 0.6,
          tcr: 0.85,
          atrt: 3.1,
          seniority: 3,
          score: 7.5,
        },
        {
          thm: 0.9,
          tcr: 0.92,
          atrt: 2.2,
          seniority: 6,
          score: 8.7,
        },
        {
          thm: 0.4,
          tcr: 0.78,
          atrt: 3.8,
          seniority: 2,
          score: 6.4,
        },
        {
          thm: 0.7,
          tcr: 0.88,
          atrt: 2.9,
          seniority: 5,
          score: 7.8,
        },
        {
          thm: 0.85,
          tcr: 0.96,
          atrt: 2.1,
          seniority: 7,
          score: 9.0,
        },
        {
          thm: 0.75,
          tcr: 0.91,
          atrt: 2.4,
          seniority: 4,
          score: 8.0,
        },
        {
          thm: 0.5,
          tcr: 0.82,
          atrt: 3.4,
          seniority: 3,
          score: 7.2,
        },
        {
          thm: 0.95,
          tcr: 0.98,
          atrt: 1.8,
          seniority: 8,
          score: 9.5,
        },
        {
          thm: 0.65,
          tcr: 0.87,
          atrt: 2.7,
          seniority: 5,
          score: 7.6,
        },
        {
          thm: 0.72,
          tcr: 0.83,
          atrt: 3.2,
          seniority: 2,
          score: 7.1,
        },
        {
          thm: 0.88,
          tcr: 0.94,
          atrt: 2.3,
          seniority: 6,
          score: 8.5,
        },
        {
          thm: 0.55,
          tcr: 0.79,
          atrt: 3.5,
          seniority: 3,
          score: 6.8,
        },
        {
          thm: 0.78,
          tcr: 0.89,
          atrt: 2.8,
          seniority: 5,
          score: 7.9,
        },
        {
          thm: 0.83,
          tcr: 0.97,
          atrt: 2.0,
          seniority: 7,
          score: 8.8,
        },
        {
          thm: 0.71,
          tcr: 0.93,
          atrt: 2.6,
          seniority: 4,
          score: 7.7,
        },
        {
          thm: 0.48,
          tcr: 0.81,
          atrt: 3.3,
          seniority: 3,
          score: 6.5,
        },
        {
          thm: 0.92,
          tcr: 0.99,
          atrt: 1.9,
          seniority: 8,
          score: 9.2,
        },
        {
          thm: 0.63,
          tcr: 0.86,
          atrt: 2.8,
          seniority: 5,
          score: 7.4,
        },
        {
          thm: 0.76,
          tcr: 0.92,
          atrt: 2.5,
          seniority: 6,
          score: 8.3,
        },
      ];

      let result = _.sample(candidateResultList);
      return result;
    },

    handleCloseClick() {
      this.ifOrganizationChartShow = false;
      this.selectedParticipantList.splice(
        0,
        this.selectedParticipantList.length
      );
    },

    handleConfirmClick() {
      this.ifOrganizationChartShow = false;
    },
    handleRecommendClick() {
      this.$refs["appoint_organization_chart_component"].recommendFill();
    },

    handleResetClick() {
      this.selectedParticipantList.splice(
        0,
        this.selectedParticipantList.length
      );
      this.$refs["appoint_organization_chart_component"].graphShader();
      this.$message("重置委派选择");
    },

    test() {
      this.taskData.title = "123";
      this.taskData.description = "123";
      this.taskData.scheduledTime = new Date();
      // test
      this.setOrganizationChartShow(true);
      this.$nextTick(() => {
        this.handleConfirmClick();
      });
    },
  },

  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    window.myEarth.clearEntities();
  },
};
</script>

<style lang="less" scoped>
@lightBlue: rgb(33, 194, 237);
@darkBlue: rgb(24, 49, 85);
.controller_panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  .side_bar_panel {
    position: absolute;
    z-index: 2;
  }

  .organization_chart_mask_panel {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 3;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .organization_chart_panel {
      position: relative;
      height: auto;
      width: auto;
      padding: 10px;
      background: rgba(24, 49, 85, 0.9);
      border-radius: 15px;
      pointer-events: all;

      .corner_border() {
        position: absolute;
        width: 40px;
        height: 40px;
        box-sizing: border-box;
        pointer-events: none;
      }

      .border_rt {
        right: 0;
        top: 0;
        border-radius: 0px 15px 0px 0px;
        border-right: 5px @lightBlue solid;
        border-top: 5px @lightBlue solid;
        .corner_border();
      }

      .border_rb {
        right: 0;
        bottom: 0;
        border-radius: 0px 0px 15px 0px;
        border-right: 5px @lightBlue solid;
        border-bottom: 5px @lightBlue solid;
        .corner_border();
      }

      .border_lt {
        left: 0;
        top: 0;
        border-radius: 15px 0px 0px 0px;
        border-left: 5px @lightBlue solid;
        border-top: 5px @lightBlue solid;
        .corner_border();
      }

      .border_lb {
        left: 0;
        bottom: 0;
        border-radius: 0px 0px 0px 15px;
        border-left: 5px @lightBlue solid;
        border-bottom: 5px @lightBlue solid;
        .corner_border();
      }

      .title_panel {
        width: 1200px;
        height: 35px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        color: white;
        border-bottom: 2px solid white;

        .title_span {
          font-size: 20px;
          margin-left: 10px;
        }

        .icon_close {
          font-size: 20px;
          margin-right: 10px;

          &:hover {
            transform: scale(1.1);
            font-weight: 700;
            cursor: pointer;
          }
        }
      }

      .content_panel {
        width: 1200px;
        height: 600px;
        // background: pink;
      }

      .confirm_button {
        position: absolute;
        right: 20px;
        bottom: 30px;
        background-color: #f3f7fe;
        color: rgb(103, 194, 58);
        border: none;
        border-radius: 8px;
        width: 85px;
        height: 40px;
        transition: 0.3s;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 700;

        &:hover {
          background-color: rgb(103, 194, 58);
          box-shadow: 0 0 0 3px fade(lighten(rgb(103, 194, 58), 25%), 50);
          color: #fff;
          cursor: pointer;
        }
      }

      .recommend_button {
        position: absolute;
        right: 130px;
        bottom: 30px;
        background-color: #f3f7fe;
        color: #3b82f6;
        border: none;
        border-radius: 8px;
        width: 85px;
        height: 40px;
        transition: 0.3s;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 700;

        &:hover {
          background-color: #3b82f6;
          box-shadow: 0 0 0 3px fade(lighten(#3b82f6, 25%), 50);
          color: #fff;
          cursor: pointer;
        }
      }

      .reset_button {
        position: absolute;
        right: 240px;
        bottom: 30px;
        background-color: #f3f7fe;
        color: gray;
        border: none;
        border-radius: 8px;
        width: 85px;
        height: 40px;
        transition: 0.3s;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 700;

        &:hover {
          background-color: gray;
          box-shadow: 0 0 0 3px fade(lighten(gray, 25%), 50);
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
  .organization_chart_mask_panel_show {
    background: rgba(0, 0, 0, 0.3);
    pointer-events: all;
    .organization_chart_mask_panel();
  }

  .organization_chart_mask_panel_hind {
    background: rgba(0, 0, 0, 0);
    pointer-events: none;
    .organization_chart_mask_panel();
  }

  .cesium_poi_panel {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
}

.organization-chart-enter-active {
  animation: scale-in-left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.organization-chart-leave-active {
  animation: scale-in-left 0.2s linear reverse;
}

@keyframes scale-in-left {
  0% {
    transform: scale(0.01);
    transform-origin: 0% 50%;
    opacity: 1;
  }
  100% {
    transform: scale(1);
    transform-origin: 0% 50%;
    opacity: 1;
  }
}
</style>
