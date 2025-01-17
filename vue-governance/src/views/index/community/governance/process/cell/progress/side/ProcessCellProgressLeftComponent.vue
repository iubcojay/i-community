<template>
    <div class="outer_panel">
      <FolderPanelComponent title="任务列表" position="left">
        <template slot="menuIcon">
          <i class="iconfont icon-list"></i>
          <i class="iconfont icon-address"></i>
          <i class="iconfont icon-close"></i>
        </template>
        <template slot="content">
          <div class="task_panel" v-if="taskList.length > 0">
            <div class="task_list_panel" ref="taskListPanel">
              <div
                class="task_item_panel"
                v-for="task of showTaskList"
                :key="task.id"
              >
                <div class="task_title_panel" @click="handleTaskTitleClick(task)">
                  <div class="title_panel">
                    <i
                      class="iconfont icon-down icon_down"
                      :class="{ icon_reverse: unfoldTaskId === task.id }"
                    ></i>
                    <span class="title_span">{{ task.title }}</span>
                    <div
                      :class="{
                        handing_tag: task.status === 1,
                        finish_tag: task.status === 2,
                      }"
                    ></div>
                  </div>
                  <div class="operation_panel">
                    <i
                      class="iconfont icon-progress operation_icon"
                      @click.stop="handleOperationIconClick(task, 'chart')"
                    ></i>
                    <i
                      class="iconfont icon-table operation_icon"
                      @click.stop="handleOperationIconClick(task, 'table')"
                    ></i>
                  </div>
                </div>
                <transition name="task-content">
                  <div class="task_content_panel" v-if="unfoldTaskId === task.id">
                    <div class="task_content_item_panel">
                      <div class="task_content_key_panel">具体内容</div>
                      <div class="task_content_value_panel">
                        <p class="task_description_panel">
                          {{ task.description }}
                        </p>
                      </div>
                    </div>
                    <div class="task_content_item_panel">
                      <div class="task_content_key_panel">创建时间</div>
                      <div class="task_content_value_panel">
                        {{
                          $common.dateFormat(
                            "YYYY-mm-dd HH:MM:SS",
                            new Date(task.createTime)
                          )
                        }}
                      </div>
                    </div>
                    <div class="task_content_item_panel">
                      <div class="task_content_key_panel">截止时间</div>
                      <div class="task_content_value_panel">
                        {{
                          $common.dateFormat(
                            "YYYY-mm-dd HH:MM:SS",
                            new Date(task.scheduledTime)
                          )
                        }}
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="page_panel" v-if="totalPageNum > 1">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="this.taskList.length"
                :page-count="10"
                :page-size="pageSize"
                :current-page="currentPageNum"
                :hide-on-single-page="true"
                @current-change="handleCurrentPageChange"
              ></el-pagination>
            </div>
          </div>
          <div class="no_data_panel" v-else>
            <i class="iconfont icon-no-data icon_no_data"></i>
            <span class="no_data_span">暂无数据</span>
          </div>
        </template>
      </FolderPanelComponent>
    </div>
  </template>
  
  <script>
  import { mapState } from "vuex";
  import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
  import * as _ from "lodash";
  
  export default {
    name: "ProcessCellProgressLeftComponent",
    components: { FolderPanelComponent },
    props: ["supData", "supMethods"],
    data() {
      return {
        showTaskList: [],
        currentPageNum: 1,
        pageSize: 5,
        unfoldTaskId: -1,
      };
    },
    computed: {
      ...mapState("userAbout", ["userInfo", "areaInfo"]),
      taskList() {
        return this.supData.taskList;
      },
      totalPageNum() {
        return Math.ceil(this.taskList.length / this.pageSize);
      },
    },
  
    methods: {
      initComp() {
        this.updateShowTaskList();
      },
  
      handleCurrentPageChange(pageNum) {
        this.currentPageNum = pageNum;
        this.updateShowTaskList();
      },
      handleTaskTitleClick(task) {
        if (this.unfoldTaskId === task.id) {
          this.unfoldTaskId = -1;
        } else {
          this.unfoldTaskId = task.id;
        }
      },
  
      updateShowTaskList() {
        if ((this.currentPageNum - 1) * this.pageSize >= this.taskList.length) {
          this.currentPageNum--;
        }
  
        this.showTaskList = this.taskList.slice(
          (this.currentPageNum - 1) * this.pageSize,
          this.currentPageNum * this.pageSize
        );
      },
  
      handleOperationIconClick(task, option) {
        switch (option) {
          case "chart":
            this.supMethods.showChart(task);
            break;
          case "table":
            this.supMethods.showTable(task);
            break;
        }
      },
    },
    mounted() {
      this.initComp();
    },
  };
  </script>
  
  <style lang="less" scoped>
  .outer_panel {
    width: 100%;
    height: 100%;
  
    .task_panel {
      display: flx;
      flex-direction: column;
      justify-content: space-between;
  
      .task_list_panel {
        position: relative;
        min-height: 300px;
        box-sizing: border-box;
        padding: 0 10px;
  
        &::before {
          content: "";
          position: absolute;
          left: 10px;
          top: 0px;
          height: 1px;
          width: calc(100% - 20px);
          background: white;
          z-index: 1;
        }
  
        .task_item_panel {
          position: relative;
          min-height: 60px;
          display: flex;
          flex-direction: column;
          color: white;
  
          &::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0px;
            height: 1px;
            width: 100%;
            background: white;
          }
  
          .task_title_panel {
            height: 60px;
            display: flex;
            box-sizing: border-box;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
  
            &:hover {
              cursor: pointer;
              .title_span {
                transform: scale(1.1);
              }
            }
  
            .title_panel {
              position: relative;
              margin-left: 10px;
              font-size: 18px;
              display: flex;
              flex-direction: row;
              align-items: center;
  
              .status_tag {
                width: 50px;
                height: 25px;
                margin-left: 10px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                font-size: 12px;
                border-radius: 5px;
              }
  
              .handing_tag {
                .status_tag();
                color: #409eff;
                border: 1px solid #d9ecff;
                background-color: #ecf5ff;
  
                &::after {
                  content: "进行中";
                }
              }
  
              .finish_tag {
                .status_tag();
                background-color: #f0f9eb;
                border-color: #e1f3d8;
                color: #67c23a;
  
                &::after {
                  content: "已完成";
                }
              }
  
              .icon_down {
                position: absolute;
                top: 0;
                bottom: 0;
                margin: auto 0px;
                width: 15px;
                height: 15px;
                font-size: 18px;
                font-weight: 700;
              }
  
              .icon_reverse {
                transform: rotate(180deg);
              }
  
              .title_span {
                margin-left: 20px;
              }
            }
  
            .operation_panel {
              width: auto;
              height: 100%;
              display: flex;
              flex-direction: row-reverse;
              align-items: center;
  
              .operation_icon {
                font-size: 20px;
                font-weight: 700;
                color: white;
                margin: 0 5px;
  
                &:hover {
                  color: rgb(33, 194, 237);
                  transform: scale(1.1);
                  cursor: pointer;
                }
              }
            }
          }
  
          .task_content_panel {
            height: auto;
            margin: 0 10px;
            overflow: hidden;
            margin-left: 25px;
            border-top: 1px solid rgba(255, 255, 255, 0.225);
            .task_content_item_panel {
              min-height: 25px;
              display: flex;
              flex-direction: row;
              margin: 5px 0;
  
              .task_content_key_panel {
                font-size: 15px;
                margin-right: 10px;
                width: 80px;
              }
  
              .task_content_value_panel {
                flex: 1;
                overflow: hidden;
                .task_description_panel {
                  width: 100%;
                  overflow-wrap: break-word;
                }
              }
            }
          }
        }
      }
  
      .page_panel {
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }
    }
  
    .no_data_panel {
      color: white;
      height: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .icon_no_data {
        font-size: 100px;
        margin-bottom: 30px;
      }
  
      .no_data_span {
        font-size: 20px;
      }
    }
  }
  
  .task-content-enter-active {
    animation: unfold 0.3s linear both;
  }
  
  .task-content-leave-active {
    animation: unfold 0.3s linear both reverse;
  }
  
  @keyframes unfold {
    from {
      height: 0px;
    }
    to {
      height: 100px;
    }
  }
  
  .task-list-leave-active {
    animation: slide-out-right 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
  }
  
  @keyframes slide-out-right {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(1000px);
      opacity: 0;
    }
  }
  </style>
  