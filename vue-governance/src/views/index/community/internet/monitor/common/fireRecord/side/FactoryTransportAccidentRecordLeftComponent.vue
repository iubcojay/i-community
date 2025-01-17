<template>
  <folder-panel-component position="left" title="事故列表" height="400px">
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
              <th>事故原因</th>
              <th>起止时间</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="accident of accidentList"
              :key="accident.id"
              :class="{ selected: selectedAccidentId === accident.id }"
              @click="handleSelect(accident)"
            >
              <td class="thumbnail_container">
                <img :src="$StaticResourceAddress + accident.thumbnail" />
              </td>
              <td>{{ accident.name }}</td>
              <td>
                <div>{{ getFormatTimeStr(accident.interval[0]-1000*60*14) }}</div>
                <div>{{ getFormatTimeStr(accident.interval[1]) }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </folder-panel-component>

</template>

<script>
import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent";
import {mapState} from "vuex";
export default {
  name: "FactoryTransportAccidentRecordLeftComponent",
  components: {
    FolderPanelComponent,
  },
  props: ["supData", "supMethods"],
  computed: {
    accidentList() {
      return this.supData.accidentList;
    },
    selectedAccidentId() {
      return this.supData.selectedAccidentId;
    },
    ...mapState({
      fireAccidentTime: state => state.fireTimeAbout.fireAccidentTime // 指定模块名
    }),
  },
  methods: {
    handleSelect(accident) {
      this.supMethods.selectAccident(accident.id);
    },
    getFireAccidentTime(){
      return this.fireAccidentTime;
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

<style lang="less">
.accident_table_container {
  width: 100%;
  height: 100%;
  position: relative;
  //z-index: 1000;
  pointer-events: auto; /* 确保启用鼠标事件 */

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

    th,
    td {
      padding: 10px;
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
