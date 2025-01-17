<template>
  <div class="outer_panel">
    <FolderPanelComponent title="待接受任务" position="left">
      <template slot="menuIcon">
        <i class="iconfont icon-list"></i>
        <i class="iconfont icon-address"></i>
        <i class="iconfont icon-close"></i>
      </template>
      <template slot="content">
        <div class="task_panel" v-if="taskList.length > 0">
          <div class="task_list_panel" ref="taskListPanel">
            <transition-group
              name="task-list"
              @before-leave="handleTaskLeaveTransition"
            >
              <div
                class="task_item_panel"
                v-for="task of showTaskList"
                :key="task.id"
              >
                <div
                  class="task_title_panel"
                  @click="handleTaskTitleClick(task)"
                >
                  <div class="title_panel">
                    <i
                      class="iconfont icon-down icon_down"
                      :class="{ icon_reverse: unfoldTaskId === task.id }"
                    ></i>
                    <span class="title_span">{{ task.title }}</span>
                  </div>
                  <div
                    class="accept_button"
                    @click.stop="handleAcceptClick(task)"
                  >
                    接 受
                  </div>
                </div>
                <transition name="task-content">
                  <div
                    class="task_content_panel"
                    v-if="unfoldTaskId === task.id"
                  >
                    <div class="task_content_item_panel">
                      <div class="task_content_key_panel">具体内容</div>
                      <div class="task_content_value_panel">
                        <p class="task_description_panel">
                          {{ task.description }}
                        </p>
                      </div>
                    </div>
                    <div class="task_content_item_panel">
                      <div class="task_content_key_panel">下发时间</div>
                      <div class="task_content_value_panel">
                        {{
                          $common.dateFormat(
                            "YYYY-mm-dd HH:MM:SS",
                            new Date(task.appointTime)
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
            </transition-group>
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
  name: "ProcessCellReceiveLeftComponent",
  components: { FolderPanelComponent },
  props: ["supData", "supMethods"],
  data() {
    return {
      showTaskList: [],
      currentPageNum: 1,
      pageSize: 5,
      unfoldTaskId: -1,
      // 是否执行过渡动画
      ifTransitionAnimationPlay: false,
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
      this.ifTransitionAnimationPlay = false;
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

    handleAcceptClick(task) {
      this.$axios
        .post(
          "/task/cell/accept",
          this.$common.packagingAxiosParam({
            taskId: task.id,
            userId: this.userInfo.id,
          })
        )
        .then((_) => {
          this.$message.success("任务已接受！");
          // 开启动画
          this.ifTransitionAnimationPlay = true;
          this.taskList.splice(
            this.taskList.findIndex((item) => item.id == task.id),
            1
          );
          // 先展示删除动画
          this.showTaskList.splice(
            this.showTaskList.findIndex((item) => item.id == task.id),
            1
          );
          // 延迟动画结束后更新列表
          setTimeout(() => {
            this.updateShowTaskList();
          }, 500);
        });
    },

    handleTaskLeaveTransition(el) {
      if (!this.ifTransitionAnimationPlay) {
        el.style.display = "none";
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
            background: rgba(255, 255, 255, 0.6);
            cursor: pointer;
          }

          .title_panel {
            position: relative;
            margin-left: 10px;
            font-size: 18px;

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

          .accept_button {
            margin-right: 10px;
            background-color: #f3f7fe;
            color: #3b82f6;
            border: none;
            border-radius: 8px;
            width: 60px;
            height: 30px;
            transition: 0.3s;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            font-weight: 500;

            &:hover {
              background-color: #3b82f6;
              box-shadow: 0 0 0 5px #3b83f65f;
              color: #fff;
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
