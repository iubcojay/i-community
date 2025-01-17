<!--</style>-->
<template>
  <div class="home_right_panel">
    <div class="home_right_content_panel">
      <ArchPanelComponentCCC style="flex:1;margin-bottom: 10px;width: 80%;position: static;color: red" title="告警提示" position="left">
        <template slot="content">
          <div class="statistics_panel">
            <div class="statistics_charts_panel" style="color: pink;font-size: 25px">
              传感器数据异常！！前往处理
            </div>
            <div class="statistics_charts_panel" style="color: pink">
              <el-button style="" type="primary" @click="handleFireProblem()">前往处理</el-button>
            </div>
          </div>
        </template>
      </ArchPanelComponentCCC>
    </div>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
// src/views/index/community/internet/monitor/common/ArchPanelComponentCCC.vue
import ArchPanelComponentCCC from "@/views/index/community/internet/monitor/common/ArchPanelComponentEEE.vue";
import VueSeamlessScroll from 'vue-seamless-scroll'
import CountTo from 'vue-count-to';

export default {
  name: "HomeRightComponent",
  components: {ArchPanelComponentCCC, VueSeamlessScroll,CountTo},
  data() {
    return {
      nextTickFlag:false,
      // ifshow: this.ifShow
    }
  },
  methods: {
    ...mapMutations('fireTimeAbout', { // 指定模块名
      updateFireAccidentTime: 'updateFireAccidentTime'
    }),
    handleFireProblem(){
      // console.log(this.ifShow)
      // 存事件点击时当前时间
      const currentTimeStamp = Date.now(); // 获取当前时间戳
      // console.log(currentTimeStamp)
      this.updateFireAccidentTime(currentTimeStamp);
      // const ccurrentTimeStamp = JSON.stringify(currentTimeStamp)
      console.log(currentTimeStamp)
      this.$emit('close');  // 触发 close 事件，通知父组件更新 ifShow
      // 向后端传递 currentTimeStamp 参数
      this.$axios.post("/task/street/updateAccidentTimeStamp", { timeStamp: currentTimeStamp }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(({ data }) => {
            console.log("update success");
          })
          .catch(error => {
            console.error("更新失败:", error);
          });
      this.$router
          .replace({
            path: "/index/community/internet/monitor/common/fireTruckSaveMe",
            // path: "/index/community/internet/monitor/common/fireRecord",
          })
    }
  },

  computed: {
    ...mapState("userAbout", ['areaInfo']),
    ...mapState({
      fireAccidentTime: state => state.fireTimeAbout.fireAccidentTime // 指定模块名
    }),
  },
  mounted() {
    // this.initComp()
  }
}
</script>

<style scoped>
/deep/ .el-table {
  background-color: rgba(0, 0, 0, 0);
}

/deep/ .el-table tr {
  background-color: rgba(0, 0, 0, 0);
  color: white;
}

/deep/ .el-table th.el-table__cell {
  background-color: rgba(0, 0, 0, 0);
  font-size: 15px;
}

/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

/deep/ .el-table__expanded-cell {
  background-color: rgba(0, 0, 0, 0)
}

/deep/ .el-table__expand-icon {
  color: white;
}

.home_right_panel {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: right;
}

.home_right_content_panel {
  height: 100%;
  width:99%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  box-sizing: border-box;
}



.warning_panel_warp {
  height: 300px;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
}

.statistics_panel{
  height: 100%;
  display: flex;
  flex-direction: column;
}

.statistics_data_panel{
  height: 150px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}

.statistics_data_sub_panel{
  width: 50%;
  height: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;

}

.statistics_img_panel{
  width:40px;
  height: 40px;
}

.statistics_text_panel{
  flex: 1;
  height: 40px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}

.statistics_text_title{
  font-size: 15px;
}

.statistics_text_content{
  font-size: 22px;
}

.statistics_charts_panel{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}



</style>
