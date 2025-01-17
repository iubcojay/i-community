<template>
  <div class="controller_panel">
    <SideBarComponent style="z-index: 2">
      <MonitorCommonBroadcastLeftComponent v-show="ifSideBarShow.ifLeftPanelShow" :sup-methods="leftMethods"
                                           :sup-data="leftData" slot="leftPanel"></MonitorCommonBroadcastLeftComponent>
      <FacilityCommonLeftComponent v-show="ifSideBarShow.ifLeftPanelShow" :sup-methods="leftMethods"
                                   :sup-data="leftData" slot="leftPanel"></FacilityCommonLeftComponent>
      <FacilityCommonRightComponent v-show="ifSideBarShow.ifRightPanelShow" :sup-methods="rightMethods"
                                    :sup-data="rightData" slot="rightPanel"></FacilityCommonRightComponent>
    </SideBarComponent>

    <!--        <IconPinComponent v-if="ifPinAddToEarth"  v-for="monitor of monitorList" :key="'icon_'+monitor.id"-->
    <!--                          :cesium-obj="monitor" :handle-click-function="handlePinClick"></IconPinComponent>-->
    <MonitorVideoComponent v-if="ifPinAddToEarth" v-for="monitorInfo of monitorList" :monitor-info="monitorInfo"
                           :key="'div_'+monitorInfo.id">

      <i class="monitor_icon_close iconfont icon-close" @click="handleCloseIconClick(monitorInfo)"></i>
    </MonitorVideoComponent>


    <IconPinComponent v-if="ifPinAddToEarth" v-for="facility of facilityList" :key="facility.id" :cesium-obj="facility"
                      :handle-click-function="handleFacilityClick"></IconPinComponent>

    <FacilityCommonModelComponent v-if="ifModelMarkShow" :merge-time="mergeTime" initial-position="10 10 10"
                                  :setModelMarkShow="setModelMarkShow" :model-url="currentFacility.modelUrl"
                                  :model-scale="currentFacility.modelScale"></FacilityCommonModelComponent>

    <!--        <FacilityCommonModelComponentThreeJs v-if="ifModelMarkShow"  :setModelMarkShow="setModelMarkShow" :merge-time="2"></FacilityCommonModelComponentThreeJs>-->

  </div>
</template>
<script>
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";

import {mapState} from "vuex";
import FacilityCommonLeftComponent
  from "@/views/index/community/entity/facility/common/side/FacilityCommonLeftComponent";
import FacilityCommonRightComponent
  from "@/views/index/community/entity/facility/common/side/FacilityCommonRightComponent";
import IconPinComponent from "@/views/common/cesium/pinDiv/IconPinComponent";
import FacilityCommonModelComponentVue
  from "@/views/index/community/entity/facility/common/model/FacilityCommonModelComponentVue";
import FacilityCommonModelComponent
  from "@/views/index/community/entity/facility/common/model/FacilityCommonModelComponent";
import MonitorCommonBroadcastLeftComponent
  from "@/views/index/community/internet/monitor/common/broadcast/side/MonitorCommonBroadcastLeftComponent";
import MonitorVideoComponent from "@/views/common/cesium/pinDiv/MonitorVideoComponent.vue";
// import FacilityCommonModelComponent from "@/views/index/community/entity/facility/common/mask/FacilityCommonModelComponent";

const uuid = require('uuid')

export default {
  name: "FacilityCommonControllerComponent",
  components: {
    MonitorVideoComponent,
    MonitorCommonBroadcastLeftComponent,
    FacilityCommonModelComponentVue,
    // FacilityCommonModelComponent,
    FacilityCommonModelComponent,
    FacilityCommonLeftComponent,
    FacilityCommonRightComponent,
    SideBarComponent,
    IconPinComponent
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false,
      },
      ifModelMarkShow: false,
      sampleList: [
        {
          iconClass: 'icon-monitor',
          text: '摄像头',
          color: '#409EFF',
          type: 1
        },
        {
          iconClass: 'icon-hydrant',
          text: '消防栓',
          color: '#F56C6C',
          type: 2,

        },
        {
          iconClass: 'icon-cap',
          text: '井盖',
          color: '#E6A23C',
          type: 3
        },
        {
          iconClass: 'icon-trash-can',
          text: '垃圾桶',
          color: '#67C23A',
          type: 4
        },
      ],
      selectedSampleArray: [1, 2, 3, 4],
      facilityList: [],
      currentFacility: undefined,
      showStatus: -1,
      monitorList: [],
      ifPinAddToEarth: false,
      // ifPinAddToEarth_video: false,
      mergeTime: 3
    }
  },

  methods: {
    initComp() {
      this.setSideBarShowStatus(true, false)
      // console.log("==========================")
      window.myEarth.initPosition()
      this.setFacilityList()
      this.addPinToEarth()
      // this.setMonitorList()
      // this.addPin_MonitorToEarth()
    },
    addPin_MonitorToEarth() {
      this.$nextTick(() => {
        this.monitorList.forEach(
            (monitor, index) => {
              window.myEarth.pushEntityToEarth(`monitor_${monitor.id}`, monitor.cesiumCode)
              let pin = window.myEarth.getEarthObjByRef(`monitor_${monitor.id}`)
              pin.show = false
              // this.$set(monitor, 'pinCesiumObj', pin)
              // this.$set(monitor, 'winPos', [0,0,0,0])
              // this.$set(monitor, 'iconPinShow', false)
              this.$set(monitor, 'videoVisible', false)
              let str = `monitorList.${index}.winPos`
              XE.MVVM.track(this, str, pin, 'winPos')
              // monitor.iconClass = 'icon-monitor'
              // if (monitor.status===1){
              //     monitor.color = '#409EFF'
              // }else {
              //     monitor.color = '#F56C6C'
              // }
            }
        )
        this.ifPinAddToEarth = true

      })
    },

    setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
      this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow
      this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow
    },


    handleCloseIconClick(monitorInfo) {
      // console.log(monitorInfo)
      console.log("摄像头关闭")
      monitorInfo.videoVisible = false
      monitorInfo.iconPinShow = true
      this.setSideBarShowStatus(true, false)
    },
    handlePinClick(monitorInfo) {
      console.log("摄像头")
      if (monitorInfo.status === 1) {
        monitorInfo.videoVisible = true
        monitorInfo.iconPinShow = false
      } else {
        this.$message.error('摄像头故障!')
      }
    },
    setFacilityList() {
      // this.monitorList.push({
      //         id: 1,
      //         name: '512c1b91',
      //         // name: '摄像头1',
      //         // type: 1,
      //         cesiumCode: {
      //             "xbsjType": "Pin",
      //             "name": "图标点",
      //             "position": [
      //                 2.0427989959273742,
      //                 0.6398994542299306,
      //                 10
      //             ],
      //             "pinBuilder": {},
      //             "iframe": {},
      //             "far": 1073741824
      //         },
      //         // imgUrl: '/img/facility/monitor.png',
      //         videoUrl: '/monitor/demo1.mp4',
      //         status: 1,
      //         position: '解放路-十亩园街道十字路口',
      //         // modelUrl:this.$StaticResourceAddress+"/model/facility/security_camera/scene.gltf",
      //         // modelScale:'0.01 0.01 0.01'
      //     },
      //     {
      //         id: 2,
      //         name: '512c1b92',
      //         // name: '摄像头2',
      //         // type: 1,
      //         cesiumCode: {
      //             "xbsjType": "Pin",
      //             "name": "图标点",
      //             "position": [
      //                 2.042796959801885,
      //                 0.6399153976485772,
      //                 10
      //             ],
      //             "pinBuilder": {},
      //             "iframe": {},
      //             "far": 1073741824
      //         },
      //         // imgUrl: '/img/facility/monitor.png',
      //         status: 1,
      //         position: '解放路-青龙街道十字路口',
      //         // modelUrl: this.$StaticResourceAddress + "/model/facility/security_camera/scene.gltf",
      //         // modelScale: '0.01 0.01 0.01'
      //         videoUrl: '/monitor/demo2.mp4',
      //     },
      //
      //     {
      //         id: 3,
      //         name: '512c1b93',
      //         cesiumCode: {
      //             "xbsjType": "Pin",
      //             "name": "图标点",
      //             "position": [
      //                 2.0428017844436885,
      //                 0.6398762124033387,
      //                 10
      //             ],
      //             "pinBuilder": {},
      //             "iframe": {},
      //             "far": 1073741824
      //         },
      //         status: 0,
      //         videoUrl: '/monitor/demo2.mp4',
      //         position: '解放路-后坡街十字路口'
      //     },
      //
      // )
      this.facilityList.push(
          {
            id: 1,
            number: '512c1b91',
            name: '摄像头1',
            type: 1,
            cesiumCode: {
              "xbsjType": "Pin",
              "name": "图标点",
              "position": [
                2.0427989959273742,
                0.6398994542299306,
                10
              ],
              "pinBuilder": {},
              "iframe": {},
              "far": 1073741824
            },
            imgUrl: '/img/facility/monitor.png',
            status: 1,
            position: '解放路-十亩园街道十字路口',
            videoUrl: '/monitor/demo1.mp4',
            description: '解放路-十亩园街道十字路口',
            modelUrl: this.$StaticResourceAddress + "/model/facility/security_camera/scene.gltf",
            modelScale: '0.01 0.01 0.01'
          },
          {
            id: 2,
            number: '512c1b92',
            name: '摄像头2',
            type: 1,
            cesiumCode: {
              "xbsjType": "Pin",
              "name": "图标点",
              "position": [
                2.042796959801885,
                0.6399153976485772,
                10
              ],
              "pinBuilder": {},
              "iframe": {},
              "far": 1073741824
            },
            imgUrl: '/img/facility/monitor2.png',
            status: 1,
            position: '解放路-青龙街道十字路口',
            videoUrl: '/monitor/demo2.mp4',
            description: '解放路-青龙街道十字路口',
            modelUrl: this.$StaticResourceAddress + "/model/facility/security_camera/scene.gltf",
            modelScale: '0.01 0.01 0.01'
          },
          {
            id: 3,
            number: '512c1b93',
            name: '消防栓1',
            type: 2,
            cesiumCode: {
              "xbsjType": "Pin",
              "name": "图标点",
              "position": [
                2.042805847577138,
                0.639899579004719,
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
            modelScale: '0.03 0.03 0.03'
          },
          {
            id: 4,
            number: '512c1b94',
            name: '消防栓2',
            type: 2,
            cesiumCode: {
              "xbsjType": "Pin",
              "name": "图标点",
              "position": [
                2.0428197937895467,
                0.6398997152259233,
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
            modelScale: '0.03 0.03 0.03'
          },
          {
            id: 5,
            number: '512c1b91',
            name: '井盖1',
            type: 3,
            cesiumCode: {
              "xbsjType": "Pin",
              "name": "图标点",
              "position": [
                2.0427756123041068,
                0.6398865813282435,
                10
              ],
              "pinBuilder": {},
              "iframe": {},
              "far": 1073741824
            },
            imgUrl: '/img/facility/cap.png',
            status: 0,
            description: '位于解放路-十亩园街道十字路口',
            modelUrl: this.$StaticResourceAddress + "/model/facility/manhole_cover_scan/scene.gltf",
            modelScale: '0.5 0.5 0.5'
          },
          {
            id: 6,
            number: '512c1b91',
            name: '井盖2',
            type: 3,
            cesiumCode: {
              "xbsjType": "Pin",
              "name": "图标点",
              "position": [
                2.042778123562787,
                0.6399211383203203,
                10
              ],
              "pinBuilder": {},
              "iframe": {},
              "far": 1073741824
            },
            imgUrl: '/img/facility/cap.png',
            status: 1,
            description: '位于解放路-十亩园街道十字路口',
            modelUrl: this.$StaticResourceAddress + "/model/facility/manhole_cover_scan/scene.gltf",
            modelScale: '0.5 0.5 0.5'
          },
          {
            id: 7,
            number: '512c1b91',
            name: '垃圾桶1',
            type: 4,
            cesiumCode: {
              "xbsjType": "Pin",
              "name": "图标点",
              "position": [
                2.0427944087486734,
                0.639928253393474,
                10
              ],
              "pinBuilder": {},
              "iframe": {},
              "far": 1073741824
            },
            imgUrl: '/img/facility/trashcan.png',
            status: 1,
            description: '位于解放路-十亩园街道十字路口',
            modelUrl: this.$StaticResourceAddress + "/model/facility/trash_can/scene.gltf",
            modelScale: '6 6 6'
          },
          {
            id: 8,
            number: '512c1b91',
            name: '垃圾桶2',
            type: 4,
            cesiumCode: {
              "xbsjType": "Pin",
              "name": "图标点",
              "position": [
                2.042801327673157,
                0.639868876217098,
                10
              ],
              "pinBuilder": {},
              "iframe": {},
              "far": 1073741824
            },
            imgUrl: '/img/facility/trashcan.png',
            status: 1,
            description: '位于解放路-十亩园街道十字路口',
            modelUrl: this.$StaticResourceAddress + "/model/facility/trash_can/scene.gltf",
            modelScale: '6 6 6'
          },
          {
            id: 9,
            number: '512c1b93',
            name: '摄像头3',
            type: 1,
            cesiumCode: {
              "xbsjType": "Pin",
              "name": "图标点",
              "position": [
                2.0428017844436885,
                0.6398762124033387,
                10
              ],
              "pinBuilder": {},
              "iframe": {},
              "far": 1073741824
            },
            status: 0,
            imgUrl: '/img/facility/monitor3.png',
            videoUrl: '/monitor/demo2.mp4',
            description: '位于解放路-后坡街十字路口',
            position: '解放路-后坡街十字路口',
          },
      )
      this.facilityList.forEach(
          (facility, index) => {
            if (facility.type === 1)
              this.monitorList.push(facility)
          }
      )
      console.log(this.monitorList)
    },

    addPinToEarth() {
      this.$nextTick(() => {
        this.facilityList.forEach(
            (facility, index) => {
              window.myEarth.pushEntityToEarth(`facility_${facility.id}`, facility.cesiumCode)
              let pin = window.myEarth.getEarthObjByRef(`facility_${facility.id}`)
              pin.show = false

              this.$set(facility, 'pinCesiumObj', pin)
              this.$set(facility, 'winPos', [0, 0, 0, 0])
              this.$set(facility, 'iconPinShow', true)
              // if(facility.type===1)
              // this.$set(facility, 'videoVisible', false)


              let str = `facilityList.${index}.winPos`
              XE.MVVM.track(this, str, pin, 'winPos')

              switch (facility.type) {
                case 1:
                  facility.iconClass = 'icon-monitor'
                  facility.color = '#409EFF'
                  this.$set(facility, 'videoVisible', false)
                  break
                case 2:
                  facility.iconClass = 'icon-hydrant'
                  facility.color = '#F56C6C'
                  break
                case 3:
                  facility.iconClass = 'icon-cap'
                  facility.color = '#E6A23C'
                  break
                case 4:
                  facility.iconClass = 'icon-trash-can'
                  facility.color = '#67C23A'
                  break
              }

            }
        )
        this.ifPinAddToEarth = true

      })
    },

    handleSampleRowClick(type) {
      let index = this.selectedSampleArray.indexOf(type)
      if (index === -1) {
        this.selectedSampleArray.push(type)
      } else {
        this.selectedSampleArray.splice(index, 1)
      }
    },

    handleFacilityClick(facility) {
      // window.myEarth.flyToModelCustom('facility_' + facility.id, 10, [0, -50 * Math.PI / 180, 0], 3)
      this.setCurrentFacility(facility)
      console.log(facility)
      if (facility.iconClass === "icon-monitor") {
        console.log("进入监控界面")
        if (facility.status === 1) {
          // this.$message.error('666')
          facility.videoVisible = true
          // monitor.iconPinShow = false
        } else {
          this.$message.error('摄像头故障!')
        }
      }
      this.setSideBarShowStatus(true, true)
      // this.setModelMarkShow(true)
    },
    handleSwitchChange(monitorInfo) {
      console.log("handleSwitchChange被调用"),
          monitorInfo.iconPinShow = !monitorInfo.videoVisible
    },
    setCurrentFacility(facility) {
      this.currentFacility = facility
    },

    handleShowClassClick(showStatus) {
      this.showStatus = showStatus
    },

    handleShowOptionChange() {
      this.facilityList.forEach(
          facility => {
            if (this.selectedSampleArray.indexOf(facility.type) !== -1 && (this.showStatus === -1 || facility.status === this.showStatus)) {
              facility.iconPinShow = true
            } else {
              facility.iconPinShow = false
            }
          }
      )
    },

    setModelMarkShow(val) {
      this.ifModelMarkShow = val
      if (val) {
        this.setSideBarShowStatus(false, true)
        setTimeout(() => {
          // document.getElementById('earth_container').style.visibility = "hidden"
        }, (this.mergeTime + 2) * 1000)

      } else {
        // document.getElementById('earth_container').style.visibility = "visible"
        this.currentFacility = undefined
        this.setSideBarShowStatus(true, false)
        window.myEarth.initPosition()
      }
    }

  },

  computed: {
    ...mapState("userAbout", ['areaInfo']),
    leftData() {
      return {
        showStatus: this.showStatus,
        selectedSampleArray: this.selectedSampleArray,
        sampleList: this.sampleList,
        monitorList: this.monitorList
      }
    },
    leftMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus,
        handleSampleRowClick: this.handleSampleRowClick,
        handleShowClassClick: this.handleShowClassClick,
        handleSwitchChange: this.handleSwitchChange,
        handleAddressClick: this.handleAddressClick
      }
    },

    // handleAddressClick(monitorInfo) {
    //     window.myEarth.flyToModel('monitor_' + monitorInfo.id)
    // },


    rightData() {
      return {
        currentFacility: this.currentFacility
      }
    },

    rightMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus
      }
    },


  },

  watch: {
    selectedSampleArray() {
      this.handleShowOptionChange()
    },

    showStatus() {
      this.handleShowOptionChange()
    }
  },

  mounted() {
    this.initComp()
  },
  handleSwitchChange(monitorInfo) {
    monitorInfo.iconPinShow = !monitorInfo.videoVisible
  },
  beforeDestroy() {
    window.myEarth.clearEntities()
  }
}
</script>

<style scoped>
.controller_panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
