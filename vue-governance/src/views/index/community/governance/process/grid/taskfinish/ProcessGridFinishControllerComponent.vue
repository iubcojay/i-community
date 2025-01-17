<template>
  <div class="controller_panel">
    <SideBarComponent v-if="ifDataInit">
      <ProcessGridFinishLeftComponent
        ref="processGridReceiveLeftPanel"
        v-show="ifSideBarShow.ifLeftPanelShow"
        :sup-methods="leftMethods"
        :sup-data="leftData"
        slot="leftPanel"
      ></ProcessGridFinishLeftComponent>
      <ProcessGridFinishRightComponent
        v-show="ifSideBarShow.ifRightPanelShow"
        :sup-methods="rightMethods"
        :sup-data="rightData"
        slot="rightPanel"
      ></ProcessGridFinishRightComponent>
    </SideBarComponent>
  </div>
</template>

<script>
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";
import { mapState } from "vuex";
import ProcessGridFinishLeftComponent from "@/views/index/community/governance/process/grid/taskfinish/side/ProcessGridFinishLeftComponent";
import ProcessGridFinishRightComponent from "@/views/index/community/governance/process/grid/taskfinish/side/ProcessGridFinishRightComponent";
import * as _ from "lodash";

export default {
  name: "ProcessGridFinishControllerComponent",

  components: {
    ProcessGridFinishLeftComponent,
    ProcessGridFinishRightComponent,
    SideBarComponent,
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false,
      },

      taskList: [],
      selectedTask: {},
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
      let { data: taskList } = await this.$axios.post(
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

        return participantInfo.status === 1;
      });
      taskList = _.sortBy(taskList, (task) => {
        return -task.appointTime.getTime();
      });

      this.taskList.splice(0, this.taskList.length);
      this.taskList.push(...taskList);
      this.ifDataInit = true;
    },

    setSelectedTask(task) {
      this.selectedTask = task;
    },

    async submitTask(taskId, userId, result) {
      await this.$axios.post(
        "/task/grid/finish",
        this.$common.packagingAxiosParam({
          taskId,
          userId,
          result,
        })
      );
      this.$message.success("任务提交成功！")

      const processGridReceiveLeftPanel = this.$refs[
        "processGridReceiveLeftPanel"
      ];
      // 初始化数据
      this.setSideBarShowStatus(true, false);
      this.selectedTask = {};

      this.taskList.splice(
        this.taskList.findIndex((item) => item.id == taskId),
        1
      );
      // 删除展示列表
      processGridReceiveLeftPanel.deleteShowItem(taskId);
    },
  },

  computed: {
    ...mapState("userAbout", ["userInfo", "areaInfo"]),
    leftData() {
      return {
        taskList: this.taskList,
        selectedTask: this.selectedTask,
      };
    },
    leftMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus,
        setSelectedTask: this.setSelectedTask,
      };
    },

    rightData() {
      return {
        selectedTask: this.selectedTask,
      };
    },

    rightMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus,
        submitTask: this.submitTask,
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
