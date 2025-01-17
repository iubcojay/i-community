<template>
  <div class="progress_outer_table_panel pretty_scrollbar">
    <div class="wrap_panel">
      <div class="table_header">
        <div class="table_header_item">执行时间</div>
        <div class="table_header_item">环节名称</div>
        <div class="table_header_item">负责人</div>
        <div class="table_header_item">具体行为</div>
        <div class="table_header_item">备注</div>
      </div>
      <div class="table_item" v-for="data in tableData" :key="$uuid.v1()">
        <div class="table_content_item">{{ $common.dateFormat("YYYY-mm-dd HH:MM:SS", data.time) }}</div>
        <div class="table_content_item">
          {{ data.progressName }}
        </div>
        <div class="table_content_item">
          {{ data.leaderName }}
        </div>
        <div class="table_content_item">{{ data.behavior }}</div>
        <div class="table_content_item">{{ data.remark }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as _ from "lodash";

export default {
  name: "ProgressTableComponent",
  props: {
    task: {
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      tableData: [],
    };
  },

  methods: {
    async initTableData() {
      // 将参与者列表的用户地区信息填充完整
      let filledParticipantList = [];
      console.log(this.task)
      let participantList = _.cloneDeep(this.task.participantInfo);
      for (let participant of participantList) {
        const {data: area} = await this.$axios.post(
            "/area/getAreaById",
            this.$common.packagingAxiosParam({id: participant.areaId})
        );
        const {data: user} = await this.$axios.post(
            "/user/getUserById",
            this.$common.packagingAxiosParam({id: participant.userId})
        );
        filledParticipantList.push({
          area,
          user,
          ...participant,
        });
      }

      this.tableData = _.sortBy(filledParticipantList.flatMap((participant) => {
        let data = {};
        switch (participant.area.type) {
            // 街道
          case 1:
            (() => {
              const subParticipant = filledParticipantList.filter(
                  (p) => p.area.superAreaId === participant.area.id
              );
              data = {
                time: new Date(participant.acceptTime),
                progressName: `创建任务`,
                leaderName: participant.user.username,
                behavior: this.behaviorGenerator(
                    1,
                    participant,
                    subParticipant
                ),
                remark: "无",
              };
            })();
            break;

            // 居委会
          case 2:
            (() => {
              data = [];
              // 添加接受任务信息
              if (participant.status >= 1) {
                const supParticipant = filledParticipantList.find(
                    (p) => p.area.id === participant.area.superAreaId
                );
                data.push({
                  time: new Date(participant.acceptTime),
                  progressName: `接受任务`,
                  leaderName: participant.user.username,
                  behavior: this.behaviorGenerator(
                      3,
                      participant,
                      supParticipant
                  ),
                  remark: "无",
                });
              }

              // 下发任务
              if (participant.status === 2) {
                const subParticipant = filledParticipantList.filter(
                    (p) => p.area.superAreaId === participant.area.id
                );
                data.push({
                  time: new Date(participant.finishTime),
                  progressName: `下发任务`,
                  leaderName: participant.user.username,
                  behavior: this.behaviorGenerator(
                      2,
                      participant,
                      subParticipant
                  ),
                  remark: "无",
                });
              }
            })();
            break;

            // 网格管理员
          case 3:
            (() => {
              data = [];
              // 添加接受任务信息
              if (participant.status >= 1) {
                const supParticipant = filledParticipantList.find(
                    (p) => p.area.id === participant.area.superAreaId
                );
                data.push({
                  time: new Date(participant.acceptTime),
                  progressName: `接受任务`,
                  leaderName: participant.user.username,
                  behavior: this.behaviorGenerator(
                      3,
                      participant,
                      supParticipant
                  ),
                  remark: "无",
                });
              }

              // 下发任务
              if (participant.status === 2) {
                const subParticipant = filledParticipantList.filter(
                    (p) => p.area.superAreaId === participant.area.id
                );
                data.push({
                  time: new Date(participant.finishTime),
                  progressName: `下发任务`,
                  leaderName: participant.user.username,
                  behavior: this.behaviorGenerator(
                      2,
                      participant,
                      subParticipant
                  ),
                  remark: "无",
                });
              }
            })();

            break;

            // 网格员
          case 4:
            (() => {
              data = [];
              // 添加接受任务信息
              if (participant.status >= 1) {
                const supParticipant = filledParticipantList.find(
                    (p) => p.area.id === participant.area.superAreaId
                );
                if (participant.plan === "") {
                  console.log(participant)
                  data.push({
                        time: new Date(participant.acceptTime),
                        progressName: `接受任务`,
                        leaderName: participant.user.username,
                        behavior: this.behaviorGenerator(
                            3,
                            participant,
                            supParticipant
                        ),
                        remark: "无",
                      }
                  );
                } else {
                  data.push({
                    time: new Date(participant.acceptTime),
                    progressName: `接受任务`,
                    leaderName: participant.user.username,
                    behavior: this.behaviorGenerator(
                        3,
                        participant,
                        supParticipant
                    ),
                    remark: "调研计划：" + participant.plan,
                  });
                }
              }


              // 完成任务
              if (participant.status === 2) {
                data.push({
                  time: new Date(participant.finishTime),
                  progressName: `完成任务`,
                  leaderName: participant.user.username,
                  behavior: this.behaviorGenerator(4, participant),
                  remark: "任务反馈：" + participant.result,
                });
              }
            })();
            break;
        }
        return data;
      }), data => data.time.getTime());
    },

    // 生成具体行为字符串
    behaviorGenerator(option, leader, ...args) {
      let resultStr = "";
      switch (option) {
          // 创建行为
        case 1:
          (() => {
            let subParticipantList = args[0];
            let subParticipantStr = subParticipantList
                .map((subParticipant) => {
                  return this.getCompleteUserName(
                      subParticipant.area,
                      subParticipant.user
                  );
                })
                .join("、");
            resultStr = `${this.getCompleteUserName(
                leader.area,
                leader.user
            )}创建任务，并将任务下发给${subParticipantStr}`;
          })();
          break;

          // 下发行为
        case 2:
          (() => {
            let subParticipantList = args[0];
            let subParticipantStr = subParticipantList
                .map((subParticipant) => {
                  return this.getCompleteUserName(
                      subParticipant.area,
                      subParticipant.user
                  );
                })
                .join("、");
            resultStr = `${this.getCompleteUserName(
                leader.area,
                leader.user
            )}将任务下发给${subParticipantStr}`;
          })();
          break;

          // 接受行为
        case 3:
          (() => {
            const supParticipant = args[0];
            resultStr = `${this.getCompleteUserName(
                leader.area,
                leader.user
            )}接受${this.getCompleteUserName(
                supParticipant.area,
                supParticipant.user
            )}下发的任务`;
          })();
          break;

          // 完成行为
        case 4:
          (() => {
            resultStr = `${this.getCompleteUserName(
                leader.area,
                leader.user
            )}完成任务`;
          })();
          break;
      }
      return resultStr;
    },

    getCompleteUserName(area, user) {
      return `${area.name}${user.username}`;
    },
  },

  mounted() {
    this.initTableData();
  },
};
</script>

<style lang="less" scoped>
.progress_outer_table_panel {
  height: 100%;
  width: 100%;

  .wrap_panel {
    height: auto;
    width: 100%;

    .table_header {
      height: 50px;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid white;

      .table_header_item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        color: white;
        font-size: 20px;
        font-weight: 700;
        height: 100%;
        margin-right: 15px;

        &:nth-child(1) {
          width: 180px;
        }

        &:nth-child(2) {
          width: 100px;
        }

        &:nth-child(3) {
          width: 100px;
        }

        &:nth-child(4) {
          flex: 1;
        }

        &:nth-child(5) {
          flex: 1;
        }
      }
    }

    .table_item {
      min-height: 60px;
      padding: 10px 0;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid white;

      &:hover {
        cursor: pointer;
        background: rgba(255, 255, 255, 0.3);
      }

      .table_content_item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        color: white;
        font-size: 17px;
        font-weight: 500;
        height: 100%;
        margin-right: 15px;

        &:nth-child(1) {
          width: 180px;
        }

        &:nth-child(2) {
          width: 100px;
        }

        &:nth-child(3) {
          width: 100px;
        }

        &:nth-child(4) {
          flex: 1;
        }

        &:nth-child(5) {
          flex: 1;
        }
      }
    }
  }
}
</style>
