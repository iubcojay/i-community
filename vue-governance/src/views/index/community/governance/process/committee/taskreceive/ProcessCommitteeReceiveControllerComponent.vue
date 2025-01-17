<template>
  <div class="controller_panel">
    <SideBarComponent v-if="ifDataInit">
      <ProcessCommitteeReceiveLeftComponent
        v-show="ifSideBarShow.ifLeftPanelShow"
        :sup-methods="leftMethods"
        :sup-data="leftData"
        slot="leftPanel"
      ></ProcessCommitteeReceiveLeftComponent>
      <ProcessCommitteeReceiveRightComponent
        v-show="ifSideBarShow.ifRightPanelShow"
        :sup-methods="rightMethods"
        :sup-data="rightData"
        slot="rightPanel"
      ></ProcessCommitteeReceiveRightComponent>
    </SideBarComponent>
  </div>
</template>

<script>
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";
import { mapState } from "vuex";
import ProcessCommitteeReceiveLeftComponent from "@/views/index/community/governance/process/committee/taskreceive/side/ProcessCommitteeReceiveLeftComponent";
import ProcessCommitteeReceiveRightComponent from "@/views/index/community/governance/process/committee/taskreceive/side/ProcessCommitteeReceiveRightComponent";
import * as _ from "lodash";

export default {
  name: "ProcessCommitteeReceiveControllerComponent",

  components: {
    ProcessCommitteeReceiveLeftComponent,
    ProcessCommitteeReceiveRightComponent,
    SideBarComponent,
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false,
      },

      taskList: [],
      ifDataInit: false,
    };
  },

  methods: {
    initComp() {
      this.setSideBarShowStatus(true, false);
      window.myEarth.initPosition();
      this.setTaskList();
    },

    setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
      this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow;
      this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow;
    },

    async setTaskList() {
      let {data: taskList} = await this.$axios.post(
        "/task/getRelatedTaskListByUserId",
        this.$common.packagingAxiosParam({
          userId: this.userInfo.id,
        })
      );
      taskList = taskList.filter((task) => {
        const participantInfo = task.participantInfo.find(
          (participant) => participant.userId === this.userInfo.id
        );

        const supParticipantInfo = task.participantInfo.find(
          (participant) => participant.areaId === this.areaInfo.superAreaId
        );

        task.appointTime = new Date(supParticipantInfo.finishTime);

        return participantInfo.status === 0;
      });
      taskList = _.sortBy(taskList, (task) => {
        return -task.appointTime.getTime();
      });

      this.taskList.splice(0, this.taskList.length);
      this.taskList.push(...taskList);
      this.ifDataInit = true;
    },
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

  watch: {},

  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    window.myEarth.clearEntities();
  },
};
</script>

<style scoped>
.controller_panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
