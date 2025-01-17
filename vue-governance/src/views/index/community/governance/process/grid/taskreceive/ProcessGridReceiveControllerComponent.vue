<template>
  <div class="controller_panel">
    <SideBarComponent v-if="ifDataInit">
      <ProcessGridReceiveLeftComponent
        ref="processGridReceiveLeftPanel"
        v-show="ifSideBarShow.ifLeftPanelShow"
        :sup-methods="leftMethods"
        :sup-data="leftData"
        slot="leftPanel"
      ></ProcessGridReceiveLeftComponent>
      <ProcessGridReceiveRightComponent
        v-show="ifSideBarShow.ifRightPanelShow"
        :sup-methods="rightMethods"
        :sup-data="rightData"
        slot="rightPanel"
      ></ProcessGridReceiveRightComponent>
    </SideBarComponent>
  </div>
</template>

<script>
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";
import { mapState } from "vuex";
import ProcessGridReceiveLeftComponent from "@/views/index/community/governance/process/grid/taskreceive/side/ProcessGridReceiveLeftComponent";
import ProcessGridReceiveRightComponent from "@/views/index/community/governance/process/grid/taskreceive/side/ProcessGridReceiveRightComponent";
import * as _ from "lodash";

export default {
  name: "ProcessGridReceiveControllerComponent",

  components: {
    ProcessGridReceiveLeftComponent,
    ProcessGridReceiveRightComponent,
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

        return participantInfo.status === 0;
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
      if(task.title === "火情处理！！")
          this.receiveTask(task.id, this.userInfo.id, "进行人员疏散、和消防通道的清理")
    },

    async receiveTask(taskId, userId, plan) {
      await this.$axios.post(
        "/task/grid/accept",
        this.$common.packagingAxiosParam({
          taskId,
          userId,
          plan,
        })
      );
      this.$message.success("任务接受成功！")

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
        receiveTask: this.receiveTask,
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
