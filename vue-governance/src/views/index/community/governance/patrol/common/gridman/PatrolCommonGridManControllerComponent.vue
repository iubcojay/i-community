<template>
  <div style="height: 100%; width: 100%;">
    <SideBarComponent style="z-index: 4;">
      <PatrolCommonGridManLeftComponent
        v-show="ifSideBarShow.ifLeftPanelShow"
        :sup-methods="leftMethods"
        :sup-data="leftData"
        slot="leftPanel"
      ></PatrolCommonGridManLeftComponent>
      <PatrolCommonGridManRightComponent
        v-show="ifSideBarShow.ifRightPanelShow"
        slot="rightPanel"
      ></PatrolCommonGridManRightComponent>
    </SideBarComponent>
    <div class="bottom_panel" v-if="currentPatrol">
      <div class="time_line_panel">
        <div class="time_line_menu">
          <div class="panel_border border_rt"></div>
          <i
            class="iconfont icon-restart time_line_menu_icon"
            @click="handleRestartClick"
          ></i>
          <i
            class="iconfont icon-fast-forward time_line_menu_icon"
            :style="{
              color: this.playSpeed === 1 ? 'white' : 'rgb(33, 194, 237)',
            }"
            @click="handleFastForwardIconClick"
          ></i>
          <i
            class="iconfont time_line_menu_icon"
            :class="{ 'icon-play': !playing, 'icon-pause': playing }"
            @click="playing = !playing"
          ></i>
          <i
            class="iconfont icon-close time_line_menu_icon"
            @click="handleCloseIconClick"
          ></i>
        </div>
        <div class="time_line_bar">
          <div class="time_line_side_label">
            {{ currentFirstPointInfo.time.toTimeString().split(" ")[0] }}
          </div>
          <el-slider
            style="flex: 1;"
            v-model="currentDistance"
            :min="currentFirstPointInfo.distance"
            :max="currentLastPointInfo.distance"
            :step="0.1"
            :format-tooltip="currentDToTime"
          ></el-slider>
          <div class="time_line_side_label">
            {{ currentLastPointInfo.time.toTimeString().split(" ")[0] }}
          </div>
          <div class="panel_border border_lt"></div>
          <div class="panel_border border_lb"></div>
          <div class="panel_border border_rb"></div>
        </div>
      </div>
    </div>
    <IconPinComponent
      style="pointer-events: none; z-index: 1;"
      v-if="currentPatrol"
      :cesium-obj="gridManModelInfo.pinInformation"
      :handle-click-function="() => {}"
    ></IconPinComponent>
    <PatrolEventComponent
      style="z-index: 2;"
      v-for="eventInfo of currentEventList"
      :event="eventInfo"
      :key="eventInfo.id"
    ></PatrolEventComponent>
  </div>
</template>

<script>
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";
import PatrolCommonGridManLeftComponent from "@/views/index/community/governance/patrol/common/gridman/side/PatrolCommonGridManLeftComponent";
import PatrolCommonGridManRightComponent from "@/views/index/community/governance/patrol/common/gridman/side/PatrolCommonGridManRightComponent";

import { mapState } from "vuex";
import IconPinComponent from "@/views/common/cesium/pinDiv/IconPinComponent";
import PatrolEventComponent from "@/views/common/cesium/pinDiv/PatrolEventComponent";
const uuid = require("uuid");
export default {
  name: "PatrolCommonGridManControllerComponent",
  components: {
    PatrolEventComponent,
    SideBarComponent,
    PatrolCommonGridManLeftComponent,
    PatrolCommonGridManRightComponent,
    IconPinComponent,
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false,
      },
      gridManModelInfo: {
        gridManJson: {
          xbsjType: "Model",
          name: "网格员模型",
          url: `${this.$StaticResourceAddress}/model/Cesium_Man.glb`,
          distanceDisplayCondition: [0, 5000],
          xbsjScale: [1, 1, 1],
          xbsjPosition: [
            2.042808311625229,
            0.6398711287508331,
            3.549038070208769,
          ],
          xbsjRotation: [
            -3.225572812759239,
            0.07547450774018534,
            -0.0031936288779385092,
          ],
          allowPicking: false,
        },
        gridManCesiumObj: undefined,
        pinCesiumObj: undefined,
        pinInformation: {
          iconClass: "icon-user",
          winPos: [0, 0, 0, 0],
          iconPinShow: true,
          color: "#409EFF",
        },
      },
      playing: false,
      playSpeed: 1,
      patrolList: [],
      currentPatrol: undefined,
      currentDistance: 0,
      currentFirstPointInfo: undefined,
      currentLastPointInfo: undefined,
      currentEventList: [],
      _uw1: undefined,
      _uw2: undefined,
      _currentDUnbind: undefined,
    };
  },
  methods: {
    initComp() {
      this.setSideBarShowStatus(true, false);
      window.myEarth.initPosition();
      this.addGridManCesiumModel();
      this.setPatrolList();
    },
    setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
      this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow;
      this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow;
    },

    setPatrolList() {
      this.patrolList.push({
        name: "059a4531",
        date: "2024-12-12",
        description: "日常巡检",
        positionList: [
          {
            position: [
              2.0428106395625525,
              0.6398809845347612,
              6.9347766501046175,
            ],
            time: new Date("2024-12-12 08:00:00"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428097745993328,
              0.639880929582771,
              6.934913524133739,
            ],
            time: new Date("2024-12-12 08:00:10"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428090053272148,
              0.6398808650600603,
              6.9061145611759205,
            ],
            time: new Date("2024-12-12 08:00:20"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428081544058845,
              0.6398807977446839,
              6.886199354477249,
            ],
            time: new Date("2024-12-12 08:00:30"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428072931829915,
              0.639880731284214,
              6.872853604669615,
            ],
            time: new Date("2024-12-12 08:00:40"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428065200143117,
              0.6398806652609551,
              6.841526412581877,
            ],
            time: new Date("2024-12-12 08:00:50"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428057576433765,
              0.639880603117375,
              6.785857936018133,
            ],
            time: new Date("2024-12-12 08:01:00"),
            eventInfo: {
              title: "井盖破裂",
              description: "2024年7月12日发现编号为e16d554e的井盖发生破裂",
              img:
                this.$StaticResourceAddress +
                "/img/facility/event/2023-1-1-event1.jpg",
            },
          },
          {
            position: [2.042805040623688, 0.6398805426709, 6.690375780233664],
            time: new Date("2024-12-12 08:01:10"),
            eventInfo: undefined,
          },
          {
            position: [2.042804291897335, 0.6398804889693748, 6.50149739466465],
            time: new Date("2024-12-12 08:01:20"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428034762188294,
              0.6398804292678275,
              6.240910184423743,
            ],
            time: new Date("2024-12-12 08:01:30"),
            eventInfo: undefined,
          },

          {
            position: [
              2.0428026341186047,
              0.6398803651047174,
              6.078391102866232,
            ],
            time: new Date("2024-12-12 08:01:40"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428019033404876,
              0.6398803025457207,
              6.034665924704381,
            ],
            time: new Date("2024-12-12 08:01:50"),
            eventInfo: undefined,
          },
          {
            position: [
              2.042801507834024,
              0.6398797083247825,
              6.150721646609477,
            ],
            time: new Date("2024-12-12 08:02:00"),
            eventInfo: undefined,
          },

          {
            position: [
              2.0428016035612844,
              0.6398788928078627,
              6.226652685707443,
            ],
            time: new Date("2024-12-12 08:02:10"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428016988638937,
              0.6398781403515008,
              6.286144888734137,
            ],
            time: new Date("2024-12-12 08:02:20"),
            eventInfo: undefined,
          },

          {
            position: [2.042801795966966, 0.63987731484935, 6.348862290451485],
            time: new Date("2024-12-12 08:02:30"),
            eventInfo: undefined,
          },
          {
            position: [
              2.042801920102173,
              0.6398765795845198,
              6.410847021135858,
            ],
            time: new Date("2024-12-12 08:02:40"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428020017359305,
              0.6398758205225408,
              6.472722035572954,
            ],
            time: new Date("2024-12-12 08:02:50"),
            eventInfo: {
              title: "垃圾桶未及时清理",
              description: "2024年7月12日发现垃圾桶垃圾装满，没有及时清理",
              img:
                this.$StaticResourceAddress +
                "/img/facility/event/2023-1-1-event2.jpg",
            },
          },
          {
            position: [2.042802090459973, 0.6398751057684512, 6.51384901062041],
            time: new Date("2024-12-12 08:03:00"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428021936311116,
              0.6398742440647089,
              6.567044238159931,
            ],
            time: new Date("2024-12-12 08:03:10"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428023023259545,
              0.6398732996475374,
              6.6284744777928095,
            ],
            time: new Date("2024-12-12 08:03:20"),
            eventInfo: undefined,
          },
        ],
      });

      this.patrolList.push({
        name: "bfe46b7c",
        date: "2024-12-15",
        description: "日常巡检",
        positionList: [
          {
            position: [
              2.0428001723269817,
              0.6398867180349161,
              5.608246421028501,
            ],
            time: new Date("2024-12-15 08:00:00"),
            eventInfo: undefined,
          },
          {
            position: [
              2.042800257678951,
              0.6398859257090012,
              5.680701140191062,
            ],
            time: new Date("2024-12-15 08:00:10"),
            eventInfo: undefined,
          },
          {
            position: [2.042800343781251, 0.6398851474966181, 5.72916803745467],
            time: new Date("2024-12-15 08:00:20"),
            eventInfo: {
              title: "井盖破裂",
              description: "2024年7月15日发现编号为e16d554e的井盖发生破裂",
              img:
                this.$StaticResourceAddress +
                "/img/facility/event/2023-1-1-event1.jpg",
            },
          },
          {
            position: [
              2.0428003999887085,
              0.6398845382128457,
              5.779361598573186,
            ],
            time: new Date("2024-12-15 08:00:30"),
            eventInfo: undefined,
          },
          {
            position: [
              2.042800494563144,
              0.6398838065711132,
              5.828914523774737,
            ],
            time: new Date("2024-12-15 08:00:40"),
            eventInfo: undefined,
          },
          {
            position: [2.04280057820222, 0.6398830205788739, 5.883531897532786],
            time: new Date("2024-12-15 08:00:50"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428006601400175,
              0.6398823148911796,
              5.9614955254186714,
            ],
            time: new Date("2024-12-15 08:01:00"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428007296779147,
              0.6398816820442258,
              6.02041747975082,
            ],
            time: new Date("2024-12-15 08:01:10"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428008140899734,
              0.6398809897351422,
              6.0845569294976976,
            ],
            time: new Date("2024-12-15 08:01:20"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428008993205067,
              0.6398803203173302,
              6.14169550926216,
            ],
            time: new Date("2024-12-15 08:01:30"),
            eventInfo: undefined,
          },

          {
            position: [
              2.042800955261131,
              0.6398796876041138,
              6.199004836660633,
            ],
            time: new Date("2024-12-15 08:01:40"),
            eventInfo: {
              title: "垃圾桶未及时清理",
              description: "2024年7月15日发现垃圾桶垃圾装满，没有及时清理",
              img:
                this.$StaticResourceAddress +
                "/img/facility/event/2023-1-1-event2.jpg",
            },
          },
          {
            position: [
              2.0428010248771633,
              0.639879030414327,
              6.252531489507608,
            ],
            time: new Date("2024-12-15 08:01:50"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428010970431556,
              0.6398783516355365,
              6.301508834368888,
            ],
            time: new Date("2024-12-15 08:02:00"),
            eventInfo: undefined,
          },

          {
            position: [
              2.0428011876766123,
              0.6398776847766797,
              6.353375466932387,
            ],
            time: new Date("2024-12-15 08:02:10"),
            eventInfo: undefined,
          },
          {
            position: [
              2.0428012751221774,
              0.6398770191664112,
              6.411448692396468,
            ],
            time: new Date("2024-12-15 08:02:20"),
            eventInfo: undefined,
          },
        ],
      });

      this.patrolList.forEach(({ positionList }) => {
        let length = positionList.length;
        for (let i = 1; i <= length; i++) {
          let tempPointList = [];
          positionList.slice(0, i).forEach((item) => {
            tempPointList.push(item.position);
          });
          let pathCesiumJson = {
            xbsjType: "Path",
            name: "网格员巡检路线片段",
            positions: tempPointList,
            playing: true,
          };
          let ref = "path_" + uuid.v1();
          window.myEarth.pushEntityToEarth(ref, pathCesiumJson);
          setTimeout(() => {
            this.$set(
              positionList[i - 1],
              "distance",
              window.myEarth.getEarthObjByRef(ref).length
            );
            window.myEarth.removeEntityFromEarth(ref);
          }, 500);
        }
      });
    },

    addGridManCesiumModel() {
      window.myEarth.pushEntityToEarth(
        "model_grid_man",
        this.gridManModelInfo.gridManJson
      );
      this.gridManModelInfo.gridManCesiumObj = window.myEarth.getEarthObjByRef(
        "model_grid_man"
      );
      this.gridManModelInfo.gridManCesiumObj.show = false;
      let pinCesiumJson = {
        xbsjType: "Pin",
        name: "图标点",
        position: [0, 0, 0],
        pinBuilder: {},
        iframe: {},
        far: 1073741824,
        show: false,
      };
      window.myEarth.pushEntityToEarth("pin_gridMan", pinCesiumJson);
      this.gridManModelInfo.pinCesiumObj = window.myEarth.getEarthObjByRef(
        "pin_gridMan"
      );
    },

    setCurrentPatrol(patrol) {
      this.currentPatrol = patrol;
    },

    getNearPathKeyPoints(positionList, currentDistance) {
      let nearPoints = [];
      for (let i = 0; i < positionList.length - 1; i++) {
        let prePoint = positionList[i];
        let nextPoint = positionList[i + 1];
        if (
          currentDistance === positionList[positionList.length - 1].distance
        ) {
          nearPoints.push(
            positionList[positionList.length - 2],
            positionList[positionList.length - 1]
          );
          break;
        }
        if (
          prePoint.distance <= currentDistance &&
          currentDistance < nextPoint.distance
        ) {
          nearPoints.push(prePoint, nextPoint);
          break;
        }
      }
      return nearPoints;
    },

    handleRestartClick() {
      this.currentDistance = 0;
      this.playing = true;
    },

    currentDToTime(val) {
      let [prePoint, nextPoint] = this.getNearPathKeyPoints(
        this.currentPatrol.positionList,
        val
      );
      const duringTime = nextPoint.time - prePoint.time;
      const duringDistance = nextPoint.distance - prePoint.distance;
      Date.prototype.clone = function () {
        return new Date(this.valueOf());
      };
      const currentTime = prePoint.time.clone();
      const currentSeconds =
        prePoint.time.getSeconds() +
        Math.round(
          (((val - prePoint.distance) / duringDistance) * duringTime) / 1000
        );
      currentTime.setSeconds(currentSeconds);
      return currentTime.toTimeString().split(" ")[0];
    },

    handleCloseIconClick() {
      this.currentPatrol = undefined;

      window.myEarth.initPosition();
    },

    handleFastForwardIconClick() {
      if (this.playSpeed === 1) {
        this.playSpeed = 4;
      } else {
        this.playSpeed = 1;
      }
    },
  },

  computed: {
    ...mapState("userAbout", ["areaInfo"]),
    leftData() {
      return {
        patrolList: this.patrolList,
        currentPatrol: this.currentPatrol,
      };
    },
    leftMethods() {
      return {
        setCurrentPatrol: this.setCurrentPatrol,
      };
    },

    rightData() {
      return {};
    },

    rightMethods() {
      return {};
    },
  },

  watch: {
    currentPatrol(patrol) {
      window.myEarth.removeEntityFromEarth("path_patrol_grid_man");
      this.gridManModelInfo.gridManCesiumObj.show = false;
      this.currentFirstPointInfo = undefined;
      this.currentLastPointInfo = undefined;
      this.currentEventList.forEach((event) => {
        window.myEarth.removeEntityFromEarth("pin_patrol_event" + event.id);
      });
      this.currentEventList = [];
      this._uw1 = this._uw1 && this._uw1();
      this._uw2 = this._uw2 && this._uw2();
      this._currentDUnbind = this._currentDUnbind && this._currentDUnbind();
      if (patrol) {
        //添加事件列表
        this.currentEventList = [];
        patrol.positionList.forEach((positionInfo) => {
          if (positionInfo.eventInfo) {
            let eventId = uuid.v1();
            this.currentEventList.push({
              id: eventId,
              eventInfo: positionInfo.eventInfo,
              position: positionInfo.position,
              time: positionInfo.time,
              winPos: [0, 0, 0, 0],
              distance: positionInfo.distance,
              visible: false,
            });

            let pinCesiumJson = {
              xbsjType: "Pin",
              name: "图标点",
              position: [0, 0, 0],
              pinBuilder: {},
              iframe: {},
              far: 1073741824,
              show: false,
            };
            pinCesiumJson.position[0] = positionInfo.position[0];
            pinCesiumJson.position[1] = positionInfo.position[1];
            pinCesiumJson.position[2] = positionInfo.position[2];
            window.myEarth.pushEntityToEarth(
              "pin_patrol_event" + eventId,
              pinCesiumJson
            );
            let str = `currentEventList.${
              this.currentEventList.length - 1
            }.winPos`;
            XE.MVVM.track(
              this,
              str,
              window.myEarth.getEarthObjByRef("pin_patrol_event" + eventId),
              "winPos"
            );
          }
        });

        this.currentLastPointInfo = this.currentPatrol.positionList[
          this.currentPatrol.positionList.length - 1
        ];
        this.currentFirstPointInfo = this.currentPatrol.positionList[0];
        this.gridManModelInfo.gridManCesiumObj.show = true;
        let pathCesiumJson = {
          xbsjType: "Path",
          name: "网格员巡检路线",
          positions: [],
          loop: false,
          currentSpeed: 1,
          loopPlay: false,
          show: true,
          playing: true,
          alwaysAlongThePath: true,
        };
        patrol.positionList.forEach((positionData) => {
          pathCesiumJson.positions.push(positionData.position);
        });

        window.myEarth.pushEntityToEarth(
          "path_patrol_grid_man",
          pathCesiumJson
        );
        let gridManPathCesiumObj = window.myEarth.getEarthObjByRef(
          "path_patrol_grid_man"
        );
        window.myEarth.flyToModel("path_patrol_grid_man");
        XE.MVVM.bind(this, "playing", gridManPathCesiumObj, "playing");
        this.playing = false;

        // currentPosition 当前相机位置，形式如：[0, 0, 0] 该数组中的元素分别表示经度（单位弧度）、纬度（单位弧度）、高度（单位米）。 注意该属性，为只读属性！
        this._uw1 = XE.MVVM.watch(
          gridManPathCesiumObj,
          "currentPosition",
          (position) => {
            let gridManCesiumObjPosition = [...position];
            this.gridManModelInfo.gridManCesiumObj.xbsjPosition = gridManCesiumObjPosition;
            this.gridManModelInfo.pinCesiumObj.position = gridManCesiumObjPosition;
            this.gridManModelInfo.pinCesiumObj.position[2] += 2;
            this.gridManModelInfo.pinInformation.winPos = this.gridManModelInfo.pinCesiumObj.winPos;
            let currentDistance = gridManPathCesiumObj.currentD;
            let [prePoint, nextPoint] = this.getNearPathKeyPoints(
              patrol.positionList,
              currentDistance
            );
            let speed =
              ((nextPoint.distance - prePoint.distance) /
                (nextPoint.time - prePoint.time)) *
              1000;
            gridManPathCesiumObj.currentSpeed = speed * this.playSpeed;
            this.currentEventList.forEach((event) => {
              if (event.distance <= currentDistance) {
                event.visible = true;
              } else {
                event.visible = false;
              }
            });
          }
        );

        // currentRotation 当前相机姿态，形式如：[0, 0, 0] 该数组中的元素分别表示偏航角（单位弧度）、俯仰角（单位弧度）、翻转角（单位弧度）。 注意该属性，为只读属性！
        this._uw2 = XE.MVVM.watch(
          gridManPathCesiumObj,
          "currentRotation",
          (rotation) => {
            let cp = [...rotation];
            this.gridManModelInfo.gridManCesiumObj.xbsjRotation = [
              cp[0] - Math.PI * 0.5,
              cp[1],
              cp[2],
            ];
          }
        );

        this._currentDUnbind = XE.MVVM.bind(
          this,
          "currentDistance",
          gridManPathCesiumObj,
          "currentD"
        );

        setTimeout(() => {
          this.playing = true;
        }, 1000);
      }
    },

    playing(val) {
      if (val) {
        this.gridManModelInfo.gridManCesiumObj
          .nativeModel()
          .activeAnimations.addAll({
            loop: Cesium.ModelAnimationLoop.REPEAT,
          });
      } else {
        this.gridManModelInfo.gridManCesiumObj
          .nativeModel()
          .activeAnimations.removeAll();
      }
    },
  },

  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    window.myEarth.clearEntities();
    this._uw1 = this._uw1 && this._uw1();
    this._uw2 = this._uw2 && this._uw2();
    this._currentDUnbind = this._currentDUnbind && this._currentDUnbind();
  },
};
</script>

<style scoped>
.bottom_panel {
  position: absolute;
  left: 0;
  bottom: 100px;
  width: 100%;
  height: 120px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  pointer-events: all;
  z-index: 3;
  user-select: none;
}

.time_line_panel {
  position: relative;
  width: 700px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.time_line_menu {
  position: relative;
  height: 40px;
  width: auto;
  display: flex;
  flex-direction: row;
  justify-content: right;
  align-items: center;
  background-color: rgba(24, 49, 85, 0.8);
  border-radius: 8px 8px 0px 0px;
  padding: 0 10px;
}

.time_line_bar {
  position: relative;
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgba(24, 49, 85, 0.8);
  border-radius: 8px 0px 8px 8px;
}

.time_line_side_label {
  width: 100px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.panel_border {
  position: absolute;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
}

.border_rt {
  right: 0;
  top: 0;
  border-radius: 0px 8px 0px 0px;
  border-right: 3px var(--lightBlue) solid;
  border-top: 3px var(--lightBlue) solid;
}

.border_rb {
  right: 0;
  bottom: 0;
  border-radius: 0px 0px 8px 0px;
  border-right: 3px var(--lightBlue) solid;
  border-bottom: 3px var(--lightBlue) solid;
}

.border_lt {
  left: 0;
  top: 0;
  border-radius: 8px 0px 0px 0px;
  border-left: 3px var(--lightBlue) solid;
  border-top: 3px var(--lightBlue) solid;
}

.border_lb {
  left: 0;
  bottom: 0;
  border-radius: 0px 0px 0px 8px;
  border-left: 3px var(--lightBlue) solid;
  border-bottom: 3px var(--lightBlue) solid;
}

.time_line_menu_icon {
  height: 40px;
  width: 40px;
  font-size: 18px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 3px;
  font-weight: 700;
}

.time_line_menu_icon:hover {
  color: var(--lightBlue);
  cursor: pointer;
}
</style>
