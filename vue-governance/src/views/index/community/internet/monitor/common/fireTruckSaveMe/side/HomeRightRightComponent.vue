<template>
  <div class="home_right_panel">
    <div class="home_right_content_panel">
      <ArchPanelComponent style="height: 380px;margin-bottom: 10px;width: 99%;position: static" title="告警提示"
                          position="right">
        <template slot="content">
          <el-table
              ref="taskTable"
              :data="warningTableData"
              :show-header="false"
              :row-style="{height:'50px',width:'700px'}">
            <el-table-column
                prop="id"
                width="100">
              <!--              <template v-slot="scope">-->
              <!--                <span :class="{'highlight': scope.row.number > 300}"></span>-->
              <!--              </template>-->
            </el-table-column>
            <el-table-column
                prop="detail"
                width="130">
              <!--              <template v-slot="scope">-->
              <!--                <span :class="{'highlight': scope.row.number > 300}"></span>-->
              <!--              </template>-->
            </el-table-column>
            <el-table-column
                prop="number"
                min-width="60">
              <template v-slot="scope">
                <span :class="{'highlight': scope.row.number > scope.row.status}">
                <countTo :startVal='scope.row.number' :endVal='scope.row.number' :duration='1000' suffix=''
                         :decimals="0"></countTo>
                </span>
              </template>
            </el-table-column>
            <el-table-column
                prop="unit"
                width="80">
            </el-table-column>
          </el-table>
        </template>
      </ArchPanelComponent>

    </div>

  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import ArchPanelComponent from "@/views/common/InfoPanel/sidepanel/ArchPanelComponent";
import VueSeamlessScroll from 'vue-seamless-scroll'
import CountTo from 'vue-count-to';

export default {
  name: "HomeRightRightComponent",
  components: {ArchPanelComponent, VueSeamlessScroll, CountTo},

  data() {
    return {
      currentTimeStamp: 1720182021000,
      playing: false,
      warningTableData: [
        {
          id: '传感器1',
          detail: '烟雾浓度',
          status: 5,
          number: 7,
          unit: 'obs/m'
        },
        {
          id: '',
          detail: '温度',
          status: 60,
          number: 70,
          unit: '°C'
        },
        {
          id: '传感器2',
          detail: '烟雾浓度',
          status: 5,
          number: 5.7,
          unit: 'obs/m'
        },
        {
          id: '',
          detail: '温度',
          status: 60,
          number: 64,
          unit: '°C'
        },
        {
          id: '传感器3',
          detail: '烟雾浓度',
          status: 5,
          number: 4.7,
          unit: 'obs/m'
        },
        {
          id: '',
          detail: '温度',
          status: 60,
          number: 58,
          unit: '°C'
        },

      ],
      situationOption: {
        singleHeight: 50,
        waitTime: 3000
      },
      communityScaleData: {
        totalArea: 2560,
        buildingArea: 1823,
        peopleNum: 152364,
        carNum: 523
      },
      nextTickFlag: false
    }
  },
  computed: {
    ...mapState("userAbout", ['areaInfo']),
    ...mapState({
      currentTime: state => state.fireTimeAbout.currentTime, // 指定模块名
      fireTruckBackTimestamp: state => state.fireTimeAbout.fireTruckBackTimestamp // 指定模块名
    }),

  },
  methods: {
    initComp() {
      this.nextTickCompLoad()
      this.startTimer()
    },

    nextTickCompLoad() {
      this.$nextTick(
          () => {
            this.nextTickFlag = true
          }
      )
    },

    setDynamicCommunityScaleData() {
      setInterval(() => {
        this.communityScaleData.peopleNum += 50
        this.communityScaleData.carNum += 20
      }, 4000)
      setInterval(() => {
        this.communityScaleData.peopleNum -= 100
        this.communityScaleData.carNum -= 40
      }, 8000)
      setInterval(() => {
        //rescue
        if (this.currentTime < this.fireTruckBackTimestamp) {
          //smoke
          // console.log("arescue")
          for (let i = 0; i < this.warningTableData.length; i += 2) {
            let addNumber = Math.random() < 0.5 ? Math.random() : -Math.random();
            this.warningTableData[i].number += addNumber;

            if (this.warningTableData[i].number > 10)
              this.warningTableData[i].number = (10 - Math.random());
            else if (this.warningTableData[i].number < 6)
              this.warningTableData[i].number = (6 + Math.random());
          }
          //temperature
          for (let i = 1; i < this.warningTableData.length; i += 2) {
            let addNumber = Math.random() < 0.5 ? Math.random() * 10 : Math.random() * (-10);
            this.warningTableData[i].number += addNumber;

            if (this.warningTableData[i].number > 100)
              this.warningTableData[i].number = (100 - Math.random() * 10);
            else if (this.warningTableData[i].number < 70)
              this.warningTableData[i].number = (70 + Math.random() * 10);

          }

        }
        if (this.currentTime > this.fireTruckBackTimestamp) {
          // console.log("aok")
          for (let i = 0; i < this.warningTableData.length; i += 2) {
            let addNumber = Math.random() < 0.5 ? Math.random() : -Math.random();
            this.warningTableData[i].number += addNumber;

            if (this.warningTableData[i].number > 4)
              this.warningTableData[i].number = (4 - Math.random());
            else if (this.warningTableData[i].number < 1)
              this.warningTableData[i].number = (1 + Math.random());
          }
          //temperature
          for (let i = 1; i < this.warningTableData.length; i += 2) {
            let addNumber = Math.random() < 0.5 ? Math.random() : Math.random() ;
            this.warningTableData[i].number += addNumber;

            if (this.warningTableData[i].number > 40)
              this.warningTableData[i].number = (40 - Math.random() );
            else if (this.warningTableData[i].number < 38)
              this.warningTableData[i].number = (38 + Math.random() );

          }
        }
      }, 4000)
      setInterval(() => {
        if (this.currentTime < this.fireTruckBackTimestamp) {
          for (let i = 0; i < this.warningTableData.length; i += 2) {
            let addNumber = Math.random() < 0.5 ? 2 * Math.random() : -2 * Math.random();
            this.warningTableData[i].number += addNumber;
            this.warningTableData[i].number += 1;

            if (this.warningTableData[i].number > 10)
              this.warningTableData[i].number = (10 - Math.random() * 2);
            else if (this.warningTableData[i].number < 6)
              this.warningTableData[i].number = (6 + Math.random() * 2);
          }
          for (let i = 1; i < this.warningTableData.length; i += 2) {
            let addNumber = Math.random() < 0.5 ? 2 * Math.random() * 10 : -2 * Math.random() * 10;
            this.warningTableData[i].number += addNumber;
            this.warningTableData[i].number += 8;

            if (this.warningTableData[i].number > 100)
              this.warningTableData[i].number = (100 - Math.random() * 12);
            else if (this.warningTableData[i].number < 70)
              this.warningTableData[i].number = (70 + Math.random() * 12);
          }
        }
        if (this.currentTime > this.fireTruckBackTimestamp) {
          for (let i = 0; i < this.warningTableData.length; i += 2) {
            let addNumber = Math.random() < 0.5 ? Math.random() : -Math.random();
            this.warningTableData[i].number += addNumber;

            if (this.warningTableData[i].number > 4)
              this.warningTableData[i].number = (4 - Math.random());
            else if (this.warningTableData[i].number < 1)
              this.warningTableData[i].number = (1 + Math.random());
          }
          //temperature
          for (let i = 1; i < this.warningTableData.length; i += 2) {
            let addNumber = Math.random() < 0.5 ? Math.random() : Math.random() ;
            this.warningTableData[i].number += addNumber;

            if (this.warningTableData[i].number > 40)
              this.warningTableData[i].number = (40 - Math.random() );
            else if (this.warningTableData[i].number < 38)
              this.warningTableData[i].number = (38 + Math.random() );

          }
        }
      }, 6000)
    },

    ...mapMutations('fireTimeAbout', { // 指定模块名
      updateCurrentTime: 'updateCurrentTime'
    }),


    startTimer() {
      this.timer = setInterval(() => {
        this.checkout();
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    checkout() {

      this.setDynamicCommunityScaleData();

    },
  },
  mounted() {
    this.initComp()


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
  width: 90%;
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

.statistics_panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.statistics_data_panel {
  height: 150px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}

.statistics_data_sub_panel {
  width: 50%;
  height: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;

}

.statistics_img_panel {
  width: 40px;
  height: 40px;
}

.statistics_text_panel {
  flex: 1;
  height: 40px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}

.statistics_text_title {
  font-size: 15px;
}

.statistics_text_content {
  font-size: 22px;
}

.statistics_charts_panel {
  flex: 1;
}

.highlight {
  color: red;
}


</style>
