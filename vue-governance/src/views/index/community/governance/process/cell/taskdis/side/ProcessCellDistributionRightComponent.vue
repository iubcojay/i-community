<template>
    <div>
      <FolderPanelComponent title="组织架构" position="right">
        <template slot="menuIcon">
          <i class="iconfont icon-list"></i>
          <i class="iconfont icon-address"></i>
          <i class="iconfont icon-close"></i>
        </template>
        <template slot="content">
          <div class="task_info_panel">
            <div class="task_title_panel">
              <div class="title_panel">任务标题</div>
              <div class="content_panel">{{ task.title }}</div>
            </div>
            <div class="task_description_panel">
              <div class="title_panel">任务描述</div>
              <div class="content_panel">{{ task.description }}</div>
            </div>
            <div class="task_other_info_panel">
              <div class="title_panel">任务信息</div>
              <div class="content_panel">
                <div class="info_item_panel">
                  <div class="key_panel"><i class="iconfont icon-address key_icon"></i>下发单位</div>
                  <div class="value_panel">{{ task.appointAreaName }}</div>
                </div>
                <div class="info_item_panel">
                  <div class="key_panel"><i class="iconfont icon-user key_icon"></i>下发人</div>
                  <div class="value_panel">{{ task.appointUsername }}</div>
                </div>
                <div class="info_item_panel">
                  <div class="key_panel"><i class="iconfont icon-date key_icon"></i>下发时间</div>
                  <div class="value_panel">
                    {{
                      task.appointTime &&
                      $common.dateFormat("YYYY-mm-dd", task.appointTime)
                    }}
                  </div>
                </div>
                <div class="info_item_panel">
                  <div class="key_panel"><i class="iconfont icon-date key_icon"></i>接受时间</div>
                  <div class="value_panel">
                    {{
                      task.appointTime &&
                      $common.dateFormat("YYYY-mm-dd", task.acceptTime)
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div class="appoint_button_group_panel">
              <div class="appoint_button" @click="handleAppointBtnClick">
                <i class="iconfont icon-progress icon_progress"></i>
                <span>任 务 委 派</span>
              </div>
  
              <div
                class="confirm_button"
                @click="handleConfirmClick"
                :class="{
                  confirm_button_active:
                    supData.selectedParticipantList.length > 0,
                  confirm_button_disable:
                    supData.selectedParticipantList.length <= 0,
                }"
              >
                <span>任 务 下 发</span>
              </div>
            </div>
          </div>
        </template>
      </FolderPanelComponent>
    </div>
  </template>
  
  <script>
  import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
  import { mapState } from "vuex";
  import AreaArchitectureComponent from "@/views/common/InfoPanel/antV/AreaArchitectureComponent";
  
  export default {
    name: "ProcessCellDistributionRightComponent",
    components: { FolderPanelComponent, AreaArchitectureComponent },
    props: ["supData", "supMethods"],
    computed: {
      ...mapState("userAbout", ["userInfo", "areaInfo"]),
      task() {
        return this.supData.selectedTask;
      },
    },
    methods: {
      handleAppointBtnClick() {
        this.supMethods.setOrganizationChartShow(true);
      },
  
      handleConfirmClick() {
          if (this.supData.selectedParticipantList.length > 0) {
            this.supMethods.submitTask(this.task,this.supData.selectedParticipantList)
          }
          
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
  .task_info_panel {
    width: 100%;
    height: 400px;
    /* background: pink; */
  
    .task_title_panel {
      position: relative;
      padding: 10px;
      border: 2px solid white;
      margin: 10px 0;
      border-radius: 10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
  
      .title_panel {
        position: absolute;
        color: white;
        font-size: 17px;
        font-weight: 700;
        height: 20px;
        margin-bottom: 10px;
        top: -10px;
        left: 20px;
        background-color: rgb(24, 49, 85);
      }
  
      .content_panel {
        font-size: 18px;
        color: white;
        padding: 10px 0;
        height: 20px;
        width: 100%;
        overflow-wrap: break-word;
      }
    }
  
    .task_description_panel {
      position: relative;
      padding: 10px;
      border: 2px solid white;
      margin: 10px 0;
      border-radius: 10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
  
      .title_panel {
        position: absolute;
        color: white;
        font-size: 17px;
        font-weight: 700;
        height: 20px;
        margin-bottom: 10px;
        top: -10px;
        left: 20px;
        background-color: rgb(24, 49, 85);
      }
  
      .content_panel {
        font-size: 18px;
        color: white;
        height: 100px;
        width: 100%;
        overflow-wrap: break-word;
      }
    }
  
    .task_other_info_panel {
      position: relative;
      padding: 10px;
      border: 2px solid white;
      margin: 10px 0;
      border-radius: 10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
  
      .title_panel {
        position: absolute;
        color: white;
        font-size: 17px;
        font-weight: 700;
        height: 20px;
        margin-bottom: 10px;
        top: -10px;
        left: 20px;
        background-color: rgb(24, 49, 85);
      }
  
      .content_panel {
        width: 100%;
        height: 120px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-gap: 5px;
  
        .info_item_panel {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          color: white;
          .key_panel {
            font-size: 18px;
            font-weight: 700;
            margin-right: 15px;
  
            .key_icon{
              font-size: 18px;
              margin-right: 5px;
            }
          }
  
          .value_panel {
            font-size: 18px;
            color: whitesmoke;
            text-decoration:underline
          }
        }
      }
    }
    .appoint_button_group_panel {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .appoint_button {
        height: 35px;
        flex: 1;
        color: white;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        font-size: 20px;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.3);
        color: rgb(33, 194, 237);
        border: 2px solid white;
        transition: all 0.3s;
        margin-right: 5px;
        &:hover {
          background: rgba(33, 194, 237, 0.2);
          color: white;
          border: 2px solid rgb(33, 194, 237);
          cursor: pointer;
        }
  
        .icon_progress {
          font-size: 20px;
          margin-right: 10px;
        }
      }
  
      .confirm_button {
        height: 35px;
        flex: 1;
        color: white;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        font-size: 20px;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.3);
        border: 2px solid white;
        transition: all 0.3s;
        margin-left: 5px;
      }
  
      .confirm_button_active {
        .confirm_button();
        color: rgb(103, 194, 58);
        &:hover {
          background: rgba(103, 194, 58, 0.2);
          color: white;
          border: 2px solid rgb(103, 194, 58);
          cursor: pointer;
        }
      }
  
      .confirm_button_disable {
        .confirm_button();
        color: gainsboro;
        &:hover {
          background: rgba(255, 255, 255, 0.3);
          cursor: not-allowed;
        }
      }
    }
  }
  </style>
  