<template>
  <div class="outer_panel">
    <div class="wrap_panel">
      <progress-chart-component :task="task"></progress-chart-component>
    </div>
  </div>
</template>

<script>
import ProgressNodeComponent from '@/views/index/community/governance/process/common/progress/ProgressNodeComponent'
import ProgressChartComponent from '@/views/index/community/governance/process/common/progress/ProgressChartComponent'
export default {
  name: "TestNodePage",
  components: { ProgressNodeComponent, ProgressChartComponent },
  data() {
    return {
      // task: {
      //   id: 1,
      //   title: "test1",
      //   description: "123456",
      //   status: 2,
      //   createTime: "2023-06-07T07:58:45.341Z",
      //   scheduledTime: "Fri Jun 30 2023 00:00:00 GMT+0800 (中国标准时间)",
      //   finishTime: "2023-06-07T08:03:35.949Z",
      //   participantInfo: [
      //     {
      //       areaId: 1,
      //       userId: 1,
      //       acceptTime: "2023-06-07T07:58:45.341Z",
      //       finishTime: "2023-06-07T07:58:45.341Z",
      //       status: 2,
      //     },
      //     {
      //       areaId: 3,
      //       userId: 6,
      //       acceptTime: "2023-06-07T08:00:32.030Z",
      //       finishTime: "2023-06-07T08:00:51.211Z",
      //       status: 2,
      //     },
      //     {
      //       areaId: 6,
      //       userId: 12,
      //       acceptTime: "2023-06-07T08:01:24.722Z",
      //       finishTime: "2023-06-07T08:01:43.810Z",
      //       status: 2,
      //     },
      //     {
      //       areaId: 10,
      //       userId: 20,
      //       acceptTime: "2023-06-07T08:02:23.474Z",
      //       finishTime: "2023-06-07T08:03:35.949Z",
      //       status: 2,
      //       plan: "abcdefg",
      //       result: "abcdefg",
      //     },
      //   ],
      // },
      task: {
        id: 4,
        title: "test4",
        description: "123456",
        status: 1,
        createTime: "2023-06-07T07:59:23.091Z",
        scheduledTime: "Fri Jun 30 2023 00:00:00 GMT+0800 (中国标准时间)",
        finishTime: null,
        participantInfo: [
          {
            areaId: 1,
            userId: 1,
            acceptTime: "2023-06-07T07:59:23.091Z",
            finishTime: "2023-06-07T07:59:23.091Z",
            status: 2,
          },
          {
            areaId: 3,
            userId: 6,
            acceptTime: "2023-06-07T08:00:29.111Z",
            finishTime: "2023-06-07T08:00:56.977Z",
            status: 2,
          },
          {
            areaId: 2,
            userId: 4,
            acceptTime: "2023-06-08T09:12:20.280Z",
            finishTime: null,
            status: 1,
          },
          {
            areaId: 4,
            userId: 8,
            acceptTime: null,
            finishTime: null,
            status: 0,
          },
          {
            areaId: 5,
            userId: 9,
            acceptTime: null,
            finishTime: null,
            status: 0,
          },
          {
            areaId: 6,
            userId: 12,
            acceptTime: "2023-06-07T08:01:23.775Z",
            finishTime: "2023-06-07T08:01:50.647Z",
            status: 2,
          },
          {
            areaId: 9,
            userId: 17,
            acceptTime: null,
            finishTime: null,
            status: 0,
            plan: "",
            result: "",
          },
          {
            areaId: 10,
            userId: 22,
            acceptTime: null,
            finishTime: null,
            status: 0,
            plan: "",
            result: "",
          },
          {
            areaId: 11,
            userId: 25,
            acceptTime: null,
            finishTime: null,
            status: 0,
            plan: "",
            result: "",
          },
          {
            areaId: 12,
            userId: 27,
            acceptTime: null,
            finishTime: null,
            status: 0,
            plan: "",
            result: "",
          },
        ],
      },
    };
  },
  methods: {},

  mounted() {},
};
</script>

<style lang="less" scoped>
.outer_panel {
  width: 100%;
  height: 100%;
  background: rgb(44, 64, 96);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .wrap_panel {
    width: 1200px;
    height: 700px;
    border: 2px solid white;
    // background: pink;
  }
}
</style>
