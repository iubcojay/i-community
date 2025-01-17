<template>
  <div class="history_truck_path_table_container">
    <table class="history_path_table">
      <thead>
        <tr>
          <th></th>
          <th>车牌号</th>
          <th>运输货物</th>
          <th>运输时间</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="pathInfo of pathInfoList"
          :class="{ selected: selectedId === pathInfo.id }"
          @click="handleSelect(pathInfo)"
        >
          <td>
            <img
              class="thumbnail_picture"
              :src="$StaticResourceAddress + pathInfo.truckInfo.thumbnailUrl"
            />
          </td>
          <td>{{ pathInfo.truckInfo.plateNumber }}</td>
          <td>石油</td>
          <td>
            <div>{{ getStartTimeStr(pathInfo) }}</div>
            <div>{{ getEndTimeStr(pathInfo) }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "HistoryTruckPathTableComponent",
  props: ["pathInfoList", "selectedId", "selectPath"],
  computed: {},
  methods: {
    getStartTimeStr(pathInfo) {
      return this.$common.dateFormat(
        "YYYY-mm-dd HH:MM:SS",
        new Date(pathInfo.path.at(0).timeStamp)
      );
    },
    getEndTimeStr(pathInfo) {
      return this.$common.dateFormat(
        "YYYY-mm-dd HH:MM:SS",
        new Date(pathInfo.path.at(-1).timeStamp)
      );
    },
    handleSelect(pathInfo) {
      if (this.selectedId !== pathInfo.id) {
        this.selectPath(pathInfo.id);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.history_truck_path_table_container {
  width: 100%;
  height: 100%;

  .history_path_table {
    color: white;
    width: 100%;
    height: fit-content;
    border-collapse: collapse;

    tr {
      border-bottom: 1px solid white;
      &.selected {
        color: var(--lightBlue);
      }

      &:not(.selected) {
        &:hover {
          cursor: pointer;
          background: rgba(255, 255, 255, 0.5);
        }
      }
    }

    th,
    td {
      padding: 10px;
    }

    .thumbnail_picture {
      width: 40px;
      aspect-ratio: 1;
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
