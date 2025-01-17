<template>
    <div class="controller_panel">
        <SideBarComponent>
            <MonitorCommonBroadcastLeftComponent v-show="ifSideBarShow.ifLeftPanelShow" :sup-methods="leftMethods"
                                         :sup-data="leftData" slot="leftPanel"></MonitorCommonBroadcastLeftComponent>
            <MonitorCommonBroadcastRightComponent v-show="ifSideBarShow.ifRightPanelShow" slot="rightPanel"></MonitorCommonBroadcastRightComponent>
        </SideBarComponent>

        <IconPinComponent v-if="ifPinAddToEarth"  v-for="monitor of monitorList" :key="'icon_'+monitor.id"
                          :cesium-obj="monitor" :handle-click-function="handlePinClick"></IconPinComponent>
        <MonitorVideoComponent v-if="ifPinAddToEarth" v-for="monitorInfo of monitorList" :monitor-info="monitorInfo"
                               :key="'div_'+monitorInfo.id">

            <i class="monitor_icon_close iconfont icon-close" @click="handleCloseIconClick(monitorInfo)"></i>
        </MonitorVideoComponent>

    </div>
</template>

<script>
    import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";

    import {mapState} from "vuex";
    import MonitorCommonBroadcastLeftComponent
        from "@/views/index/community/internet/monitor/common/broadcast/side/MonitorCommonBroadcastLeftComponent";
    import MonitorCommonBroadcastRightComponent
        from "@/views/index/community/internet/monitor/common/broadcast/side/MonitorCommonBroadcastRightComponent";
    import IconPinComponent from "@/views/common/cesium/pinDiv/IconPinComponent";
    import MonitorVideoComponent from "@/views/common/cesium/pinDiv/MonitorVideoComponent";


    export default {
        name: "MonitorCommonBroadcastControllerComponent",
        components: {
            MonitorCommonBroadcastRightComponent,
            MonitorCommonBroadcastLeftComponent,
            SideBarComponent,
            IconPinComponent,
            MonitorVideoComponent
        },
        data() {
            return {
                ifSideBarShow: {
                    ifLeftPanelShow: false,
                    ifRightPanelShow: false
                },
                monitorList: [],
                ifPinAddToEarth:false
            }
        },

        methods: {
            initComp() {
                this.setSideBarShowStatus(true, false)
                window.myEarth.initPosition()
                this.setMonitorList()
                this.addPinToEarth()
            },


            setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
                this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow
                this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow
            },

            setMonitorList() {
                this.monitorList.push(
                    {
                        id: 1,
                        name: '512c1b91',
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
                        status: 1,
                        videoUrl: '/monitor/demo1.mp4',
                        position: '解放路-十亩园街道十字路口'
                    },
                    {
                        id: 2,
                        name: '512c1b92',
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
                        status: 1,
                        videoUrl: '/monitor/demo2.mp4',
                        position: '解放路-青龙街道十字路口'
                    },
                    {
                        id: 3,
                        name: '512c1b93',
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
                        videoUrl: '/monitor/demo2.mp4',
                        position: '解放路-后坡街十字路口'
                    },
                    {
                        id: 4,
                        name: '512c1b94',
                        cesiumCode: {
                            "xbsjType": "Pin",
                            "name": "图标点",
                            "position": [
                                2.0427688622855023,
                                0.6399294384284517,
                                10
                            ],
                            "pinBuilder": {},
                            "iframe": {},
                            "far": 1073741824
                        },
                        status: 1,
                        videoUrl: '/monitor/demo1.mp4',
                        position: '解放路-历山路十字路口'
                    },
                )

            },

            addPinToEarth() {
                this.$nextTick(()=>{
                    this.monitorList.forEach(
                        (monitor, index) => {
                            window.myEarth.pushEntityToEarth(`monitor_${monitor.id}`, monitor.cesiumCode)
                            let pin = window.myEarth.getEarthObjByRef(`monitor_${monitor.id}`)
                            pin.show = false
                            this.$set(monitor, 'pinCesiumObj', pin)
                            this.$set(monitor, 'winPos', [0,0,0,0])
                            this.$set(monitor, 'iconPinShow', true)
                            this.$set(monitor, 'videoVisible', false)
                            let str = `monitorList.${index}.winPos`
                            XE.MVVM.track(this, str, pin, 'winPos')
                            monitor.iconClass = 'icon-monitor'
                            if (monitor.status===1){
                                monitor.color = '#409EFF'
                            }else {
                                monitor.color = '#F56C6C'
                            }
                        }
                    )
                    this.ifPinAddToEarth = true

                })
            },


            handleAddressClick(monitorInfo) {
                window.myEarth.flyToModel('monitor_' + monitorInfo.id)
            },

            handleSwitchChange(monitorInfo){
                monitorInfo.iconPinShow = !monitorInfo.videoVisible
            },

            handlePinClick(monitorInfo){
                if (monitorInfo.status === 1){
                    monitorInfo.videoVisible = true
                    monitorInfo.iconPinShow = false
                }else {
                    this.$message.error('摄像头故障!')
                }


            },

            handleCloseIconClick(monitorInfo){
                monitorInfo.videoVisible = false
                monitorInfo.iconPinShow = true
            }
        },

        computed: {
            ...mapState("userAbout", ['areaInfo']),
            leftData() {
                return{
                    monitorList:this.monitorList
                }
            },
            leftMethods() {
                return {
                    setSideBarShowStatus: this.setSideBarShowStatus,
                    handleSwitchChange:this.handleSwitchChange,
                    handleAddressClick:this.handleAddressClick
                }
            },



        },

        watch:{

        },

        mounted() {
            this.initComp()
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
