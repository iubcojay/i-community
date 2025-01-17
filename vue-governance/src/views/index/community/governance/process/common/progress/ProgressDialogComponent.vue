<template>
  <div class="progress_mask_panel">
    <transition-group name="progress-panel">
      <div class="table_panel" v-if="showType === 0" key="table">
        <div
          v-for="position of ['lt', 'lb', 'rb', 'rt', 'l', 'r', 't', 'b']"
          :class="'border_' + position"
          :key="position"
        ></div>
        <div class="top_panel">
          <div class="title_panel">进度表格</div>
          <i
            class="iconfont icon-close icon_close"
            @click="handleCloseIconClick"
          ></i>
        </div>
        <div class="content_panel">
            <progress-table-component :task="task"></progress-table-component>
        </div>
      </div>

      <div class="chart_panel" v-if="showType === 1" key="chart">
        <div
          v-for="position of ['lt', 'lb', 'rb', 'rt', 'l', 'r', 't', 'b']"
          :class="'border_' + position"
          :key="position"
        ></div>
        <div class="top_panel">
          <div class="title_panel">进度图</div>
          <i
            class="iconfont icon-close icon_close"
            @click="handleCloseIconClick"
          ></i>
        </div>

        <div class="content_panel">
          <progress-chart-component :task="task"></progress-chart-component>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import ProgressTableComponent from '@/views/index/community/governance/process/common/progress/ProgressTableComponent'
import ProgressChartComponent from '@/views/index/community/governance/process/common/progress/ProgressChartComponent'
export default {
  name: "ProgressDialogComponent",
  components:{ProgressTableComponent,ProgressChartComponent},
  props: {
    showType: {
      default: () => {},
    },
    closeDialog: {
      default: () => {},
    },
    task: {
      default: () => {return {}},
    },
  },

  methods: {
    handleCloseIconClick() {
      this.closeDialog()
      
    },
  },
};
</script>

<style lang="less" scoped>
@lightBlue: rgb(33, 194, 237);
@darkBlue: rgb(24, 49, 85);
.progress_mask_panel {
  width: 100%;
  height: 100%;
  pointer-events: all;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: all;

  .frame_panel() {
    position: relative;
    height: auto;
    width: auto;
    padding: 10px;
    background: rgba(24, 49, 85, 0.9);
    border-radius: 15px;
    pointer-events: all;

    .corner_border() {
      position: absolute;
      width: 40px;
      height: 40px;
      box-sizing: border-box;
      pointer-events: none;
    }

    .border_rt {
      right: 0;
      top: 0;
      border-radius: 0px 15px 0px 0px;
      border-right: 5px @lightBlue solid;
      border-top: 5px @lightBlue solid;
      .corner_border();
    }

    .border_rb {
      right: 0;
      bottom: 0;
      border-radius: 0px 0px 15px 0px;
      border-right: 5px @lightBlue solid;
      border-bottom: 5px @lightBlue solid;
      .corner_border();
    }

    .border_lt {
      left: 0;
      top: 0;
      border-radius: 15px 0px 0px 0px;
      border-left: 5px @lightBlue solid;
      border-top: 5px @lightBlue solid;
      .corner_border();
    }

    .border_lb {
      left: 0;
      bottom: 0;
      border-radius: 0px 0px 0px 15px;
      border-left: 5px @lightBlue solid;
      border-bottom: 5px @lightBlue solid;
      .corner_border();
    }
  }

  .table_panel {
    .frame_panel();
    .top_panel {
      height: 50px;
      width: 1200px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      padding: 0 10px;
      box-sizing: border-box;
      .title_panel {
        font-size: 20px;
        font-weight: 700;
        color: white;
      }

      .icon_close {
        font-size: 18px;
        font-weight: 700;
        color: white;

        &:hover {
          transform: scale(1.1);
          cursor: pointer;
        }
      }
    }

    .content_panel {
      width: 1200px;
      height: 600px;
    }
  }

  .chart_panel {
    .frame_panel();

    .top_panel {
      height: 50px;
      width: 1200px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid white;
      padding: 0 10px;
      box-sizing: border-box;
      .title_panel {
        font-size: 20px;
        font-weight: 700;
        color: white;
      }

      .icon_close {
        font-size: 18px;
        font-weight: 700;
        color: white;

        &:hover {
          transform: scale(1.1);
          cursor: pointer;
        }
      }
    }

    .content_panel {
      width: 1200px;
      height: 600px;
    }
  }

  .progress-panel-enter-active {
    animation: scale-in-top 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .progress-panel-leave-active {
    animation: scale-in-top 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both
      reverse;
  }

  @keyframes scale-in-top {
    0% {
      transform: scale(0.01);
      transform-origin: 50% 0%;
      opacity: 1;
    }
    100% {
      transform: scale(1);
      transform-origin: 50% 0%;
      opacity: 1;
    }
  }
}
</style>
