<template>
    <div class="controller_panel">
      <SideBarComponent class="side_panel" v-if="ifDataInit">
        <ProcessStreetProgressLeftComponent
          v-show="ifSideBarShow.ifLeftPanelShow"
          :sup-methods="leftMethods"
          :sup-data="leftData"
          slot="leftPanel"
        ></ProcessStreetProgressLeftComponent>
        <ProcessStreetProgressRightComponent
          v-show="ifSideBarShow.ifRightPanelShow"
          :sup-methods="rightMethods"
          :sup-data="rightData"
          slot="rightPanel"
        ></ProcessStreetProgressRightComponent>
      </SideBarComponent>
      <div class="progress_panel" v-show="progressShowStatus.ifMaskShow">
        <ProgressDialogComponent
          :show-type="progressShowStatus.showType"
          :close-dialog="closeDialog"
          :task="selectedTask"
        ></ProgressDialogComponent>
      </div>
      <grid-man-path-component
        v-if="gridManPath.ifShow"
        :participant="gridManPath.participant"
        :closeTimeLine="closeTimeLine"
      ></grid-man-path-component>
    </div>
  </template>
  
  <script>
  import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";
  
  import { mapState } from "vuex";
  import ProcessStreetProgressLeftComponent from '@/views/index/community/governance/process/street/progress/side/ProcessStreetProgressLeftComponent'
  import ProcessStreetProgressRightComponent from '@/views/index/community/governance/process/street/progress/side/ProcessStreetProgressRightComponent'
  import ProgressDialogComponent from '@/views/index/community/governance/process/common/progress/ProgressDialogComponent'
  import GridManPathComponent from '@/views/index/community/governance/process/common/progress/GridManPathComponent'
  
  export default {
    name: "ProcessCommitteeProgressControllerComponent",
    components: {
      ProcessStreetProgressRightComponent,
      ProcessStreetProgressLeftComponent,
      SideBarComponent,
      ProgressDialogComponent,
      GridManPathComponent,
    },
    provide() {
      return {
        showGridManPath: this.showGridManPath,
      };
    },
    data() {
      return {
        ifSideBarShow: {
          ifLeftPanelShow: false,
          ifRightPanelShow: false,
        },
        ifDataInit: false,
        gridManPath: {
          ifShow: false,
          pathInfo: [],
        },
        taskList: [],
        selectedTask: {},
        // -1都不展示，0展示图表，1展示流程图
        progressShowStatus: {
          ifMaskShow: false,
          showType: -1,
        },
      };
    },
  
    computed: {
      ...mapState("userAbout", ["userInfo", "areaInfo"]),
      leftData() {
        return {
          taskList: this.taskList,
        };
      },
      leftMethods() {
        return {
          setSideBarShowStatus: this.setSideBarShowStatus,
          showTable: this.showTable,
          showChart: this.showChart,
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
  
      bottomMethods() {
        return {};
      },
    },
  
    methods: {
      initComp() {
        this.setSideBarShowStatus(true, false);
        window.myEarth.initCommunityPosition(this.areaInfo);
        this.setTaskList();
      },
  
      setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
        this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow;
        this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow;
      },
  
      setTaskList() {
        this.$axios
          .post(
            "/task/getRelatedTaskListByUserId",
            this.$common.packagingAxiosParam({
              userId: this.userInfo.id,
            })
          )
          .then(({ data }) => {
            this.taskList = _.sortBy(data, (task) => {
              return task.status;
            });
            this.taskList = _.sortBy(this.taskList, (task) => {
              return -new Date(task.createTime).getTime();
            });
  
            this.ifDataInit = true;
          });
      },
  
      showTable(task) {
        this.closeTimeLine()
        this.selectedTask = task;
        this.progressShowStatus.ifMaskShow = true;
        this.progressShowStatus.showType = 0;
      },
  
      showChart(task) {
        this.closeTimeLine()
        this.selectedTask = task;
        this.progressShowStatus.ifMaskShow = true;
        this.progressShowStatus.showType = 1;
      },
  
      closeDialog() {
        this.progressShowStatus.showType = -1;
        setTimeout(() => {
          this.progressShowStatus.ifMaskShow = false;
        }, 200);
      },
  
      showGridManPath(participant) {
        this.gridManPath.participant = participant;
        this.closeDialog();
        this.gridManPath.ifShow = true;
        window.myEarth.initCommunityPosition(participant.area)
      },
  
      closeTimeLine() {
        this.gridManPath.ifShow = false;
        this.gridManPath.participant = {};
        window.myEarth.initCommunityPosition(this.areaInfo)
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
  .controller_panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  
    .side_panel {
      position: absolute;
      z-index: 2;
    }
  
    .progress_panel {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 3;
    }
  }
  </style>
  