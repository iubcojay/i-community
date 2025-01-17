<template>
  <div class="home_left_panel">
    <div class="home_left_content_panel">

      <ArchPanelComponent style="position: static;width: 99.9%" height="50%" title="消防局选择" position="left">
          <template slot="content">
            <div class="accident_table_container">
              <table class="accident_table">
                <thead>
                <tr class="header_row_container">
                  <th>消防局</th>
                  <th>可调用警力</th>
                  <th>操作</th> <!-- 添加新的表头 -->
                </tr>
                </thead>
                <tbody>
                <tr v-for="fireDepartment in supData.fireDepartmentList" :key="fireDepartment.id">
                  <td class="bold-text">{{ fireDepartment.name }}</td>
                  <td :style="{ color: fireDepartment.resource_a <= 3 ? 'red' : 'greenyellow' }">{{ fireDepartment.resource_a }} / {{ fireDepartment.resource_t }} (人)</td>
                  <td>
                    <el-button @click="handleClick(fireDepartment)"
                               :type="fireDepartment.notified ? 'success' : 'danger'"
                               :plain="!fireDepartment.notified"
                               :disabled="!couldBeClick">
                      {{ fireDepartment.notified ? '已通知' : '通知消防局' }}
                    </el-button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </template>
      </ArchPanelComponent>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import ArchPanelComponent from "@/views/common/InfoPanel/sidepanel/ArchPanelComponent";
import MyVideoPlayerComponent from "@/views/common/videoplayer/MyVideoPlayerComponent";
import VueSeamlessScroll from 'vue-seamless-scroll'


export default {
  name: "HomeLeftComponent",
  components: {ArchPanelComponent, MyVideoPlayerComponent, VueSeamlessScroll},
  data() {
    return {
      couldBeClick: true
    }
  },
  props: ["supData", "supMethods"],
  methods: {
    initComp() {
    },
    handleClick(fireDepartment){
      if(fireDepartment.resource_a <= 3){
        this.$message.error("消防局可用警力资源过少，选择失败");
      }else{
        this.$message.success("选择成功！已通知该消防局出警");
        console.log("点击消防局选择按钮")
        this.couldBeClick = false;
        this.$emit('selectFireDepartment')
      }
    }
  },

  mounted() {
    this.initComp()
  }
}
</script>

<style scoped>
.red-font {
  color: red;
}
.bold-text {
  font-weight: bold;
}
.accident_table_container {
  width: 100%;
  height: 100%;

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

    th, td {
      padding: 10px;
    }
    th:nth-child(1), td:nth-child(1) {
      width: 170px; /* 设置第二列宽度为250px，可以根据需要调整 */
    }

    th:nth-child(2), td:nth-child(2) {
      width: 140px; /* 设置第二列宽度为250px，可以根据需要调整 */
    }

    th:nth-child(3), td:nth-child(3) {
      width: 120px; /* 设置第三列宽度为150px，可以根据需要调整 */
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
.home_left_panel {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: left;
}

.home_left_content_panel {
  position: absolute;
  top:420px;
  height: 47%;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  box-sizing: border-box;
}

.home_situation_panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.home_situation_img_panel {
  height: 120px;
  width: 100%;
  margin-bottom: 10px;
}


.home_situation_text_panel {
  color: rgba(255, 255, 255, 0.50);
  flex: 1;
  overflow: hidden;
  font-size: 15px;
}

.activity_panel {
  display: flex;
  flex-direction: row;
  margin: 10px 0px;
}

.activity_img_panel {
  width: 150px;
  height: 80px;
}

.activity_text_panel {
  color: white;
  flex: 1;
  margin-left: 18px;
}

.activity_text_title_panel {
  font-size: 18px;
}

.activity_text_content_panel {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.home_monitor_panel {
  display: flex;
  height: 100%;
  flex-direction: column;
  box-sizing: border-box;

  overflow: hidden;
}

.home_monitor_title_panel {
  height: 25px;
  color: white;
  box-sizing: border-box;
  padding-bottom: 5px;
  border-bottom: white 1px solid;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.monitor_video {
  width: 100%;
  height: 100%;

}

</style>
