<template>
  <div class="transport_accident_container">
    <div class="side_bar_container">
      <side-bar-component>
        <factory-transport-accident-record-left-component
            v-show="ifSideBarShow.ifLeftPanelShow"
            slot="leftPanel"
            :sup-methods="leftMethods"
            :sup-data="leftData"
            @show="handleShow"
            ref="leftPanel"
        ></factory-transport-accident-record-left-component>
        <HomeLeftControllerComponent
            v-show="ifShow2"
            :sup-data="leftData"
            @selectFireDepartment="callFireTruck"
            slot="leftPanel">
        </HomeLeftControllerComponent>
        <HomeRightRightControllerComponent
            v-show="true"
            slot="right_right_Panel"
            :accident-info="selectedAccident"
        >
        </HomeRightRightControllerComponent>
      </side-bar-component>
    </div>
    <div class="accident_container">
      <accident-scene-component ref="accidentScene"
          v-show="selectedAccident"
          :accident-info="selectedAccident"
      ></accident-scene-component>
      <IconFireDepartment v-if="ifPinAddToEarth" v-for="fireDepartment of fireDepartmentList" :key="fireDepartment.id" :cesium-obj="fireDepartment" :fireDepartment="fireDepartment"></IconFireDepartment>
    </div>
    <!--修改部分-->
    <div class="transport_accident_container">
      <div class="side_bar_container">
        <SideBarComponent>
          <SwitchToRecord
              v-show="ifShow"
              :ifShow="this.ifShow"
              @close="handleClose"
              slot="rightPanel"
          >
          </SwitchToRecord>
        </SideBarComponent>
      </div>
    </div>
<!--    出警确认通知-->
    <div class="transport_accident_container">
      <div class="side_bar_container">
        <SideBarComponent>
          <TaskConfirm
              v-show="ifShow3"
              :ifShow="this.ifShow3"
              @close="handleClose3"
              slot="rightPanel"
          >
          </TaskConfirm>
        </SideBarComponent>
      </div>
    </div>
  </div>
</template>

<script>
import SideBarComponent from "@/views/index/community/internet/monitor/common/fireTruckSaveMe/side/SideBarComponent";
import FactoryTransportAccidentRecordLeftComponent
  from "@/views/index/community/internet/monitor/common/fireTruckSaveMe/side/FactoryTransportAccidentRecordLeftComponent";
import AccidentSceneComponent
  from "@/views/index/community/internet/monitor/common/fireTruckSaveMe/AccidentSceneComponentCCC.vue";
import HomeRightRightControllerComponent
  from "@/views/index/community/internet/monitor/common/fireTruckSaveMe/side/HomeRightRightComponent";
import HomeLeftControllerComponent
  from "@/views/index/community/internet/monitor/common/fireTruckSaveMe/side/HomeLeftComponent";
import SwitchToRecord from "@/views/index/community/internet/monitor/common/fireTruckSaveMe/popUp/SwitchToRecord.vue";
import {ref} from "vue";
import {mapMutations, mapState} from "vuex";
import TaskConfirm from "@/views/index/community/internet/monitor/common/fireTruckSaveMe/popUp/TaskConfirm.vue";
import IconFireDepartment
  from "@/views/index/community/internet/monitor/common/fireTruckSaveMe/side/IconFireDepartment.vue";

export default {
  name: "FactoryTransportAccidentRecordComponent",
  components: {
    IconFireDepartment,
    TaskConfirm,
    SwitchToRecord,
    SideBarComponent,
    FactoryTransportAccidentRecordLeftComponent,
    AccidentSceneComponent,
    HomeRightRightControllerComponent, HomeLeftControllerComponent
  },
  data() {
    return {
      isFirstTimeCheck: true,
      ifShow: false,
      ifShow2: false,
      ifShow3: false,
      ifSideBarShow: {ifLeftPanelShow: true, ifRightPanelShow: false},
      accidentList: [],
      accidentId: -1,
      selectedAccidentId: -1,
      fireDepartmentList: [{
        id: 1,
        number: '512c1b93',
        name: '十亩园消防中队',
        type: 2,
        cesiumCode: {
          "xbsjType": "Pin",
          "name": "图标点",
          "position": [
            2.042799707577138,
            0.639912579004719,
            10
          ],
          "pinBuilder": {},
          "iframe": {},
          "far": 1073741824,
        },
        imgUrl: '/img/facility/hydrant.png',
        status: 0,
        description: '位于解放路-十亩园街道十字路口',
        modelUrl: this.$StaticResourceAddress + "/model/facility/fire_hydrant/scene.gltf",
        modelScale: '0.03 0.03 0.03',
        resource_a: 13,
        resource_t: 18,
        notified: false
      },
        {
          id: 2,
          number: '512c1b94',
          name: '解放路消防中队',
          type: 2,
          cesiumCode: {
            "xbsjType": "Pin",
            "name": "图标点",
            "position": [
              2.0428267937895467,
              0.6399327152259233,
              10
            ],
            "pinBuilder": {},
            "iframe": {},
            "far": 1073741824
          },
          imgUrl: '/img/facility/hydrant.png',
          status: 0,
          description: '位于解放路-十亩园街道十字路口',
          modelUrl: this.$StaticResourceAddress + "/model/facility/fire_hydrant/scene.gltf",
          modelScale: '0.03 0.03 0.03',
          resource_a: 2,
          resource_t: 13,
          notified: false
        }
        ],
      ifPinAddToEarth: false,
      ifScShow: false
    };
  },
  computed: {
    ...mapState({
      currentTime: state => state.fireTimeAbout.currentTime, // 指定模块名
      lastProcessTimestamp: state => state.fireTimeAbout.lastProcessTimestamp // 指定模块名
    }),
    leftData() {
      return {
        accidentList: this.accidentList,
        selectedAccidentId: this.selectedAccidentId,
        fireDepartmentList: this.fireDepartmentList
      };
    },

    leftMethods() {
      return {
        selectAccident: this.selectAccident,
        // callFireTruck: this.callFireTruck,
      };
    },

    selectedAccident() {
      return this.accidentList.find(
          (accident) => accident.id === this.selectedAccidentId
      );
    },
  },
  methods: {
    ...mapMutations('fireTimeAbout', { // 指定模块名
      updateCurrentTime: 'updateCurrentTime',
      updateLastProcessTimestamp: 'updateLastProcessTimestamp',
      updateFireTruckBackTimestamp: 'updateFireTruckBackTimestamp'
    }),
    // setFireDepartmentList() {
    //   this.fireDepartmentList.push(
    //   )
    // },
    addPinToEarth() {
      this.$nextTick(() => {
        this.fireDepartmentList.forEach(
            (fireDepartment, index) => {
              window.myEarth.pushEntityToEarth(`fireDepartment_${fireDepartment.id}`, fireDepartment.cesiumCode)
              let pin = window.myEarth.getEarthObjByRef(`fireDepartment_${fireDepartment.id}`)
              pin.show = false

              this.$set(fireDepartment, 'pinCesiumObj', pin)
              this.$set(fireDepartment, 'winPos', [0, 0, 0, 0])
              this.$set(fireDepartment, 'iconPinShow', true)
              // if(fireDepartment.type===1)
              // this.$set(fireDepartment, 'videoVisible', false)


              let str = `fireDepartmentList.${index}.winPos`
              XE.MVVM.track(this, str, pin, 'winPos')

              switch (fireDepartment.type) {
                case 1:
                  fireDepartment.iconClass = 'icon-monitor'
                  fireDepartment.color = '#409EFF'
                  break
                case 2:
                  fireDepartment.iconClass = 'icon-hydrant'
                  fireDepartment.color = '#F56C6C'
                  break
                case 3:
                  fireDepartment.iconClass = 'icon-cap'
                  fireDepartment.color = '#E6A23C'
                  break
                case 4:
                  fireDepartment.iconClass = 'icon-trash-can'
                  fireDepartment.color = '#67C23A'
                  break
              }
            }
        )
        this.ifPinAddToEarth = true
      })
    },
    initComp() {
      this.isFirstTimeCheck = true;
      // this.setFireDepartmentList();
      this.setAccidentList();
      this.setNewTimeStamp();
      this.initPosition();
      this.startTimer();
      this.addPinToEarth()
      // this.autoSelectAccident();
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.checkOut();
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    handleClose() {
      this.ifShow = false;  // 将 ifShow 设为 false，隐藏弹窗
    },
    handleClose3() {
      this.ifShow3 = false;  // 将 ifShow 设为 false，隐藏弹窗
    },
    handleShow(){
      console.log("消防局显现")
      console.log(this.ifShow2)
      this.ifShow2 = !this.ifShow2;
      console.log(this.ifShow2)
    },
    callFireTruck() {
      this.ifShow2 = false
      console.log("父组件监听方法")
      this.$refs.leftPanel.handleSelect();
      // 生成 1 到 3 秒之间的随机时间
      const randomDelay = Math.random() * 2000 + 1000; // 生成 1000 到 3000 毫秒之间的随机数
      // 设置延迟执行
      setTimeout(() => {
        this.ifShow3 = true;
      }, randomDelay);
    },
    initPosition() {

      // window.myEarth.flyToPosition(
      //     targetPosition,
      //     height,
      //     angleOffset,
      //     duration
      // );
      window.myEarth.initPosition('community')
      // this.setCurrentRegion({ name: "factory" });
      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, duration * 1000);
      // });
      // const position = Cesium.Cartesian3.fromDegrees(117.1507, 36.67586, 2486);
      // const offset = Cesium.HeadingPitchRoll.fromDegrees(0, -50, 0);
      // window.myEarth.viewer.camera.flyTo({
      //   destination: position,
      //   orientation: offset,
      //   duration: 1,
      // });
    },
    async setAccidentList() {
      const result = await this.$axios.get(
          this.$ServerAddress + "/factory/transport/accident/list"
      );
      if (result.status === 200) {
        this.accidentId = result.data[0].id;
        this.accidentList.push(...result.data);
        this.selectedAccidentId = this.accidentId;
      }
    },

    async setNewTimeStamp() {
      const result = await this.$axios.get(
          this.$ServerAddress + "/task/street/getNewTimeStamp"
      );
      console.log(result.data[0].lastProcessTimestamp)
      console.log(result.data[0].fireTruckBackTimestamp)
      if (result.status === 200) {
        this.updateLastProcessTimestamp(result.data[0].lastProcessTimestamp);
        this.updateFireTruckBackTimestamp(result.data[0].fireTruckBackTimestamp);
      }
    },

    selectAccident(id) {
      this.selectedAccidentId = id;
    },
    autoSelectAccident() {
      console.log(this.accidentList)
      // console.log(this.accidentList.get[0])
      this.selectedAccidentId = this.accidentList.id;
      console.log(this.selectedAccidentId)
    },

    checkOut() {
      // console.log(this.currentTime)
      // console.log(this.lastProcessTimestamp)
      // console.log(this.currentTime >= this.lastProcessTimestamp)
      if(this.currentTime >= this.lastProcessTimestamp && this.isFirstTimeCheck){
        this.ifShow=true;
        this.isFirstTimeCheck = false;
      }
    },
    resetTime(){
      this.updateCurrentTime(0);
      console.log("reset: ",this.currentTime)
    }
  },

  mounted() {
    this.initComp();
  },
  destroyed() {
    this.stopTimer();
    this.resetTime();
  }
};
</script>

<style lang="less" scoped>
.transport_accident_container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  user-select: none;

  .side_bar_container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  .accident_container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
}
</style>
