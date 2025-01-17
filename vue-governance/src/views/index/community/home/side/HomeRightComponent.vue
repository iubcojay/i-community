<template>
  <div class="home_right_panel">
    <div class="home_right_content_panel">
      <ArchPanelComponent style="flex:1;margin-bottom: 10px;width: 80%;position: static" title="社区规模"
                          position="right">
        <template slot="content">

          <div class="statistics_panel">
            <div class="statistics_data_panel">
              <div class=" statistics_data_sub_panel">
                <div class="statistics_img_panel">
                  <el-image :src="$StaticResourceAddress+'/img/home/ground.png'"
                            style="height: 100%;width: 100%"></el-image>
                </div>
                <div class="statistics_text_panel">
                  <div class="statistics_text_title">总面积</div>
                  <div class="statistics_text_content">
                    <countTo :startVal='communityScaleData.totalArea-500' :endVal='communityScaleData.totalArea'
                             :duration='1000' suffix='㎡' :decimals="0"></countTo>
                  </div>
                </div>

              </div>
              <div class=" statistics_data_sub_panel">
                <div class="statistics_img_panel">
                  <el-image :src="$StaticResourceAddress+'/img/home/building.png'"
                            style="height: 100%;width: 100%"></el-image>
                </div>
                <div class="statistics_text_panel">
                  <div class="statistics_text_title">建筑面积</div>
                  <div class="statistics_text_content">
                    <countTo :startVal='communityScaleData.buildingArea-500' :endVal='communityScaleData.buildingArea'
                             :duration='1000' suffix='㎡' :decimals="0"></countTo>
                  </div>
                </div>

              </div>
              <div class=" statistics_data_sub_panel">
                <div class="statistics_img_panel">
                  <el-image :src="$StaticResourceAddress+'/img/home/population.png'"
                            style="height: 100%;width: 100%"></el-image>
                </div>
                <div class="statistics_text_panel">
                  <div class="statistics_text_title">街道人口</div>
                  <div class="statistics_text_content">
                    <countTo :startVal='communityScaleData.peopleNum-2' :endVal='communityScaleData.peopleNum'
                             :duration='1000' suffix='人' :decimals="0"></countTo>
                  </div>
                </div>

              </div>
              <div class=" statistics_data_sub_panel">
                <div class="statistics_img_panel">
                  <el-image :src="$StaticResourceAddress+'/img/home/car.png'"
                            style="height: 100%;width: 100%"></el-image>
                </div>
                <div class="statistics_text_panel">
                  <div class="statistics_text_title">社区车辆</div>
                  <div class="statistics_text_content">
                    <countTo :startVal='communityScaleData.carNum-2' :endVal='communityScaleData.carNum'
                             :duration='1000' suffix='辆' :decimals="0"></countTo>
                  </div>
                </div>

              </div>

            </div>
            <div id="statistics_charts_panel" class="statistics_charts_panel"></div>
          </div>
        </template>
      </ArchPanelComponent>
<!--      <ArchPanelComponent style="margin-bottom: 10px;position: static;width: 80%" title="模型规模"-->
      <!--                          position="right" height="150px">-->
      <!--        <template slot="content">-->
      <!--          <div class="statistics_data_panel" style="height: 100%;align-items: center">-->
      <!--            <div class=" statistics_data_sub_panel">-->
      <!--              <div class="statistics_img_panel">-->
      <!--                <el-image :src="$StaticResourceAddress+'/img/home/mianpian.png'"-->
      <!--                          style="height: 100%;width: 100%"></el-image>-->
      <!--              </div>-->
      <!--              <div class="statistics_text_panel">-->
      <!--                <div class="statistics_text_title">面片数量</div>-->
      <!--                <div class="statistics_text_content">-->
      <!--                  10 亿+-->
      <!--                </div>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--            <div class=" statistics_data_sub_panel">-->
      <!--              <div class="statistics_img_panel">-->
      <!--                <el-image :src="$StaticResourceAddress+'/img/home/grid.png'"-->
      <!--                          style="height: 100%;width: 100%"></el-image>-->
      <!--              </div>-->
      <!--              <div class="statistics_text_panel">-->
      <!--                <div class="statistics_text_title">网格数量</div>-->
      <!--                <div class="statistics_text_content">-->
      <!--                  10 亿+-->
      <!--                </div>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </ArchPanelComponent>-->
      <ArchPanelComponent style="height: 380px;margin-bottom: 10px;width: 80%;position: static" title="告警提示"
                          position="right">
        <template slot="content">
          <VueSeamlessScroll v-if="nextTickFlag" :data="warningTableData" class="warning_panel_warp"
                             :class-option="situationOption">
            <el-table
                ref="taskTable"
                :data="warningTableData"
                :show-header="false"
                :row-style="{height:'50px'}">
              <el-table-column
                  prop="id"
                  width="100">
              </el-table-column>
              <el-table-column
                  prop="detail"
                  min-width="150">
              </el-table-column>
              <el-table-column
                  width="80">
                <template slot-scope="scope">
                  <span style="color: red" v-show="scope.row.status === 0">待处理</span>
                  <span style="color: white" v-show="scope.row.status ===1">已处理</span>
                </template>
              </el-table-column>
            </el-table>
          </VueSeamlessScroll>
        </template>
      </ArchPanelComponent>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import ArchPanelComponent from "@/views/common/InfoPanel/sidepanel/ArchPanelComponent";
import VueSeamlessScroll from 'vue-seamless-scroll'
import CountTo from 'vue-count-to';

export default {
  name: "HomeRightComponent",
  components: {ArchPanelComponent, VueSeamlessScroll, CountTo},
  data() {
    return {
      warningTableData: [
        {
          id: '45622',
          detail: '水管破裂',
          status: 1
        },
        {
          id: '46345',
          detail: '线路故障',
          status: 1
        },
        {
          id: '48834',
          detail: '烟雾报警',
          status: 0
        },
        {
          id: '49092',
          detail: '门禁异常',
          status: 1
        },
        {
          id: '49327',
          detail: '温度过高',
          status: 0
        },
        {
          id: '50123',
          detail: '管道堵塞',
          status: 1
        },
        {
          id: '50356',
          detail: '门禁异常',
          status: 1
        },
      ],
      situationOption: {
        singleHeight: 50,
        waitTime: 3000
      },
      communityScaleData: {
        totalArea: 3850,      // 社区街道范围总面积（单位：亩或其他，示例值）
        buildingArea: 2406,   // 建筑覆盖面积
        peopleNum: 91024,     // 社区居民人数
        carNum: 7528
      },

      nextTickFlag: false
    }
  },
  methods: {
    initComp() {
      this.drawChart()
      this.setDynamicCommunityScaleData()
      this.nextTickCompLoad()
    },

    drawChart() {
      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
        let myChart = this.$echarts.init(document.getElementById("statistics_charts_panel"));
        // 指定图表的配置项和数据
        let option = {
          title: {
            text: '人口变化折线图',
            textStyle: {
              color: 'white'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              axisLine: {
                lineStyle: {
                  color: 'white'
                }
              },
              data: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct']
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: 'white'
                }
              },
              min: 70000
            }
          ],
          series: [
            {
              name: '人口',
              type: 'line',
              stack: 'Total',
              areaStyle: {},
              emphasis: {
                focus: 'series'
              },
              data: [86123,
                87234,
                86789,
                87910,
                88500,
                87800,
                90050,
                90400,
                91024]
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      })

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
        this.communityScaleData.peopleNum += 3
        this.communityScaleData.carNum += 2
      }, 4000)
      setInterval(() => {
        this.communityScaleData.peopleNum -= 5
        this.communityScaleData.carNum -= 2
      }, 7000)
      setInterval(() => {
        this.communityScaleData.peopleNum += 7
        this.communityScaleData.carNum -= 1
      }, 10000)
    }
  },

  computed: {
    ...mapState("userAbout", ['areaInfo']),

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


</style>
