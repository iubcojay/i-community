<template>
  <div> <!-- 添加一个根元素 -->
    <div>
    <folder-panel-component position="left" title="推荐应急方案" height="400px">
      <template slot="menuIcon">
        <i class="iconfont icon-list"></i>
        <i class="iconfont icon-address"></i>
        <i class="iconfont icon-close"></i>
      </template>
      <template slot="content">
        <div class="accident_table_container">
          <table class="accident_table">
            <thead>
            <tr class="header_row_container">
              <td></td>
              <th>任务内容</th>
              <th>操作</th> <!-- 添加新的表头 -->
            </tr>
            </thead>
            <tbody>
            <tr>
              <td class="task-text">!!火情处理!!</td>
              <td>火灾事故现场<br>周围人员疏散</td>
              <td> <!-- 新增的操作列 -->
                <el-button @click="handleSendFireTask" :type="notified2 ? 'success' : 'danger'" :plain="!notified2">
                  {{ notified2 ? '已通知' : '一键通知' }}
                </el-button>
              </td>
            </tr>
            </tbody>
          </table>
          <table class="accident_table">
            <thead>
            <tr class="header_row_container">
              <td></td>
              <th>事故原因</th>
              <!--              <th>起止时间</th>-->
              <th>操作</th> <!-- 添加新的表头 -->
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="accident of accidentList"
                :key="accident.id"
                :class="{ selected: selectedAccidentId === accident.id }"
            >
              <td class="thumbnail_container">
                <img :src="$StaticResourceAddress + accident.thumbnail" />
              </td>
              <td>{{ accident.name }}</td>
              <td> <!-- 新增的操作列 -->
                <el-button
                    @click="panelShow"
                    :type="notified ? 'success' : 'danger'"
                    :plain="!notified"
                >
                  {{ notified ? '已选择' : '选择消防局' }}
                </el-button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </template>
    </folder-panel-component>
    </div>
  </div>
</template>


<script>
import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
import {EventBus} from "@/views/index/community/internet/monitor/common/callFireTruck_bus";
export default {
  name: "FactoryTransportAccidentRecordLeftComponent",
  components: {
    FolderPanelComponent,
  },
  data() {
    return {
      ifShow: false,
      notified: false,
      notified2: false,
      NewTaskId: -1,
      taskData: {
        title: "通知相关人员",
        description: "进行人员疏散、和消防通道的清理",
        scheduledTime: "Fri Jul 12 2024 00:00:00 GMT+0800 (中国标准时间)",
      },
    };
  },
  props: ["supData", "supMethods"],
  computed: {
    accidentList() {
      return this.supData.accidentList;
    },
    selectedAccidentId() {
      return this.supData.selectedAccidentId;
    },
  },
  methods: {
    panelShow(){
      if(!this.notified){
        console.log("消防局选择")
        this.$emit("show")
      }else{
        this.handleSelect();
      }
    },
    handleSendFireTask() {
      this.notified2 = true;
      console.log("sendFireTask");
      const currentTimeStamp = Date.now(); // 获取当前时间戳
      const currentDateTime = new Date(currentTimeStamp-2*60*1000); // 当前时间
      const scheduledDateTime = new Date(currentTimeStamp+2*60*1000); // 计划时间（当前时间加1分钟）

      const createTime = currentDateTime.toISOString(); // ISO格式的创建时间
      const scheduledTime = scheduledDateTime.toString(); // 本地格式的计划时间
      const participantInfo = JSON.stringify([
        { "areaId": 1, "userId": 1, "acceptTime": createTime, "finishTime": createTime, "status": 2 },
        { "areaId": 3, "userId": 5, "acceptTime": null, "finishTime": null, "status": 0 }
      ])
      let param = this.$common.packagingAxiosParam({
        title: "火情处理！！",
        description: "进行人员疏散、和消防通道的清理",
        status: 1,
        createTime: createTime,
        scheduledTime: scheduledTime,
        finishTime: null,
        participantInfo: participantInfo
      });

      this.$axios.post("/task/street/sendFireTask", param)
          .then(({ data }) => {
            this.NewTaskId = data.id;
            this.$message.success("任务下达成功！");
            this.acceptFromStreet()
          })
          .catch(error => {
            console.error("任务下达失败:", error);
            this.$message.error("任务下达失败！");
          });
    },

    acceptFromStreet(){
      this.$axios
          .post(
              "/task/committee/accept",
              this.$common.packagingAxiosParam({
                taskId: this.NewTaskId,
                userId: 5,
              })
          )
          .then((_) => {
            this.appointToCell()}
          )},

    appointToCell(){
      let selectedParticipantList = [{
        "areaId" : 6,
        "userId" : 11,
      }]
      this.$axios.post('/task/committee/appoint',this.$common.packagingAxiosParam({
        taskId: this.NewTaskId,
        userId: 5,
        participantList: JSON.stringify(selectedParticipantList)
      }))
          .then((_) =>{
            this.acceptFromCommittee()
          })},

    acceptFromCommittee(){
      this.$axios
          .post(
              "/task/cell/accept",
              this.$common.packagingAxiosParam({
                taskId: this.NewTaskId,
                userId: 11,
              })
          )
          .then((_) => {
            this.appointToGrid()}
          )},

    appointToGrid(){
      let selectedParticipantList = [
        {"areaId":9,"userId":17},
        {"areaId":10,"userId":22}
      ]
      this.$axios.post('/task/cell/appoint',this.$common.packagingAxiosParam({
            taskId: this.NewTaskId,
            userId: 11,
            participantList: JSON.stringify(selectedParticipantList)
          })
      )
          .then((_) =>{
            this.FinishTask()
          })

    },

    FinishTask(){
      this.$axios.post(
          "/task/grid/finish",
          this.$common.packagingAxiosParam({
            taskId:this.NewTaskId,
            userId:22,
            result:"已到达现场并已完成疏散人群和清理消防通道",
          })
      );},

    handleSelect() {
      // 处理按钮点击事件
      console.log("子组件触发，通知消防局")
      if(!this.notified) this.notified = true; // 设置通知状态为已通知
      EventBus.$emit('triggerTimelineMethod');
    },

    getFormatTimeStr(timestamp) {
      return this.$common.dateFormat(
        "YYYY-mm-dd HH:MM:SS",
        new Date(timestamp)
      );
    },
  },
};
</script>

<style lang="less" scoped>
.task-text {
  font-weight: bold;
  color: red;
}
.accident_table_container {
  width: 100%;
  height: 100%;

  .accident_table {
    color: white;
    width: 100%;
    height: fit-content;
    border-collapse: collapse;

    .header_row_container {
      pointer-events: none;
      text-align: left;
    }

    tr {
      border-bottom: 1px solid white;
      &.selected {
        color: #f56c6c;
        background: rgba(255, 255, 255, 0.2);
      }

      &:not(.selected) {
        &:hover {
          cursor: pointer;
          background: rgba(255, 255, 255, 0.5);
        }
      }
    }

    th, td {
      padding: 10px;
    }
    th:nth-child(1), td:nth-child(1) {
      width: 150px; /* 设置第二列宽度为250px，可以根据需要调整 */
    }

    th:nth-child(2), td:nth-child(2) {
      width: 180px; /* 设置第二列宽度为250px，可以根据需要调整 */
    }

    th:nth-child(3), td:nth-child(3) {
      width: 120px; /* 设置第三列宽度为150px，可以根据需要调整 */
    }

    .thumbnail_container {
      img {
        width: 100px;
        aspect-ratio: 2;
        object-fit: cover;
      }
    }

    .operator_container {
      width: fit-content;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      i {
        font-size: 20px;
        font-weight: 700;
        margin-right: 20px;

        &:hover {
          cursor: pointer;
          color: var(--lightBlue);
        }
      }
    }
  }
}
</style>
