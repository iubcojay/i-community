<template>
  <div>
    <FolderPanelComponent title="待分发任务" position="left">
      <template slot="menuIcon">
        <i class="iconfont icon-list"></i>
        <i class="iconfont icon-address"></i>
        <i class="iconfont icon-close"></i>
      </template>
      <template slot="content">
        <div class="task_panel" v-if="taskList.length > 0">
          <div class="list_title_panel">
            <div>任务标题</div>
            <div>接受时间</div>
          </div>
          <div class="task_list_panel">
            <transition-group
              name="task-list"
              @before-leave="handleTaskLeaveTransition"
            >
              <div
                class="task_item_panel"
                :class="{
                  task_item__panel_selected: selectedTask.id === task.id,
                }"
                v-for="task of showTaskList"
                :key="task.id"
                @click="handleTaskItemClick(task)"
              >
                <div class="task_title_panel">
                  <div class="title_panel">
                    <span class="title_span">{{ task.title }}</span>
                  </div>
                </div>
                <div class="accept_time_panel">
                  {{
                    $common.dateFormat("YYYY-mm-dd HH:MM:SS", task.acceptTime)
                  }}
                </div>
              </div>
            </transition-group>
          </div>
          <div class="page_panel">
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

export default {
  name: "ProcessCommitteeDistributionLeftComponent",
  components: { FolderPanelComponent },
  props: ["supData", "supMethods"],
  data() {
    return {
      showTaskList: [],
      currentPageNum: 1,
      pageSize: 5,
      unfoldTaskId: -1,
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

    // showTaskList() {
    //   if ((this.currentPageNum - 1) * this.pageSize >= this.taskList.length) {
    //     this.currentPageNum--;
    //   }
    //   return this.taskList.slice(
    //     (this.currentPageNum - 1) * this.pageSize,
    //     this.currentPageNum * this.pageSize
    //   );
    // },
    selectedTask() {
      return this.supData.selectedTask;
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
    handleTaskLeaveTransition(el) {
      // 判断是翻页导致的还是接受导致的
      if (!this.ifTransitionAnimationPlay) {
        el.style.display = "none";
      }
    },
    handleTaskItemClick(task) {
      this.supMethods.setSelectedTask(task);
    },
    setIfTransitionAnimationPlay(value) {
      this.ifTransitionAnimationPlay = value;
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
    distributeTask(task) {
      this.showTaskList.splice(
        this.showTaskList.findIndex((item) => item.id == task.id),
        1
      );
      setTimeout(() =>{
        this.updateShowTaskList()
      },500)
    },
  },

  mounted() {
    this.initComp();
  },
};
</script>

<style lang="less" scoped>
.task_panel {
  display: flx;
  flex-direction: column;
  justify-content: space-between;
  .list_title_panel {
    height: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    color: white;
    font-weight: 700;
    font-size: 18px;
  }

  .task_list_panel {
    position: relative;
    height: 225px;
    box-sizing: border-box;
    padding: 0 10px;
    overflow: hidden;

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
      min-height: 45px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      color: white;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        cursor: pointer;
      }

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
        height: 45px;
        display: flex;
        box-sizing: border-box;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .title_panel {
          position: relative;
          margin-left: 10px;
          font-size: 18px;
        }
      }
      .accept_time_panel {
      }
    }

    .task_item__panel_selected {
      background: rgba(255, 255, 255, 0.3);
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
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateX(1000px);
    transform: translateX(1000px);
    opacity: 0;
  }
}
</style>
