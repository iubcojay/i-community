<template>
  <FolderPanelComponent position="right" style="width: 100%;height: fit-content" title="矛盾纠纷">
    <template slot="menuIcon">
      <i class="iconfont icon-list"></i>
      <i class="iconfont icon-address"></i>
      <i class="iconfont icon-close"></i>
    </template>
    <template slot="content">
      <el-table :data="incidents" style="width: 100%" @row-click="handleRowClick">
        <el-table-column
            label="发生日期"
            width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ getFormatDate(scope.row.date) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="title"
            label="纠纷事件"
            min-width="180">
        </el-table-column>
      </el-table>
    </template>
  </FolderPanelComponent>
</template>

<script>
import FolderPanelComponent from "@/views/common/InfoPanel/sidepanel/FolderPanelComponent.vue";
import dayjs from "dayjs";

export default {
  name: "DisputeCommonCheckRightComponent",
  components: {FolderPanelComponent},
  props: ["incidents","highlightIncident"],
  methods: {
    getFormatDate(date) {
      return dayjs(date).format("YYYY-MM-DD")
    },
    handleRowClick(row) {
      this.highlightIncident(row.id)
    }
  },
}

</script>

<style lang="less" scoped>
::v-deep {
  .el-table {
    background: transparent;
    color: white;

    thead {
      color: white;
    }

    tr {
      background-color: transparent;

      th {
        &.el-table__cell {
          background-color: transparent;
        }
      }

      &:hover {
        td {
          &.el-table__cell {
            background-color: var(--darkBlue) !important;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
