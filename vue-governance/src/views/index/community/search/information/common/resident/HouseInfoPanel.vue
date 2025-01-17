<template>
    <div class="house_info_panel" v-show="houseData.visible" :style="positionStyle">
        <div class="panel_border border_lb"></div>
        <div class="panel_border border_rb"></div>
        <div class="panel_border border_rt"></div>
        <div class="panel_border border_lt"></div>

        <div class="panel_header">
            <div class="panel_title">{{panelTitle}}</div>
            <div class="icon_panel">
                <i class="iconfont icon-list house_info_panel_icon"
                   :style="{color:status===0?'rgb(33, 193, 236)':'white'}" @click="status=0"></i>
                <i class="iconfont icon-electricity house_info_panel_icon"
                   :style="{color:status===1?'rgb(33, 193, 236)':'white'}" @click="status=1"></i>
                <!--不允许查看房屋内部结构-->
<!--                <i class="iconfont icon-model house_info_panel_icon" @click="handleModelIconClick"></i>-->
<!--                <i class="iconfont icon-vr house_info_panel_icon" @click="handleVrIconClick"></i>-->
                <i class="iconfont icon-close house_info_panel_icon" @click="handleCloseIconClick"></i>
            </div>
        </div>
        <div class="panel_body" style="color: white">
            <div v-show="status===0" class="panel_body_content resident_list_panel">
                <div class="resident_list_content_panel">
                    <table style="width: 100%;border-collapse: collapse;">
                        <tr v-for="resident of houseData.memberList"
                            style="height: 40px;border-bottom: 1px solid white">
                            <td style="width: 100px">{{resident.name}}</td>
                            <td style="width: 50px">{{resident.identity}}</td>
                            <td style="width: 50px">{{resident.sex}}</td>
                            <td style="width: 50px">{{resident.national}}</td>
                            <td>{{resident.idNumber}}</td>
                        </tr>
                    </table>

                </div>
            </div>
            <div v-show="status===1" class="panel_body_content electricity_water_graph_panel">
                <div id="electricity_water_graph" class="content_panel"></div>

            </div>
        </div>
        <div class="panel_footer">
            <div class="footer_circle"></div>
        </div>
        <el-dialog title="室内模型" width="1000px" :visible.sync="ifHouseModelDialogShow" append-to-body
                   :close-on-click-modal="false" :modal="false">
            <div style="width: 100%;height: 600px;position: relative">
                <div class="panel_border border_lb"></div>
                <div class="panel_border border_rb"></div>
                <div class="panel_border border_rt"></div>
                <div class="panel_border border_lt"></div>
                <div class="dialog_header">
                    <div class="dialog_title">
                        房屋内部模型
                    </div>
                    <i class="dialog_close_icon iconfont icon-close" @click="modelLoaded= ifHouseModelDialogShow=false"></i>
                </div>
                <div style="width: 100%;height: 550px">
<!--                    <EmbeddedModelComponent v-if="ifHouseModelDialogShow" :model-url="$StaticResourceAddress+'/model/floor/scene.gltf'" html-url="/static/aframe/html/embeddedModelPage.html"></EmbeddedModelComponent>-->
                    <!-- <SingleModelPage
                            :model-url="$StaticResourceAddress+'/model/floor/scene.gltf'"
                            :orbit-controls-option="{
                                target: '0 0 0',
                                enablePan:false,
                                initialPosition: '0 7 10',
                                maxDistance: 10,
                                minPolarAngle:0,
                                maxPolarAngle:80,
                            }"
                            model-position="-1.5 0.1 -3.5"
                            :if-floor-show="false"

                    ></SingleModelPage> -->
                    <HouseModelThreejsComponent></HouseModelThreejsComponent>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="室内模型"  modal="false" fullscreen :visible.sync="ifVrModelDialogShow" append-to-body
                   :close-on-click-modal="false" destroy-on-close :modal="false">
            <div style="width: 100%;height:100%;position: relative">
                <div class="vr_dialog_header">
                    <i class="vr_close_icon iconfont icon-close" @click="ifVrModelDialogShow = false" ></i>
                </div>
                <div style="width: 100%;height: 100%">
                    <VrHouseComponent v-if="ifVrModelDialogShow"></VrHouseComponent>
                </div>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    import VrHouseComponent from "@/views/common/threejs/VrHouseComponent";
    // import SingleModelPage from "@/views/common/threejs/SingleModelPage";
    import HouseModelThreejsComponent from "@/views/index/community/search/information/common/resident/model/HouseModelThreejsComponent"

    export default {
        name: "HouseInfoPanel",
        components: {HouseModelThreejsComponent, VrHouseComponent},
        props: {
            houseData: {
                type: Object,
                default: () => {
                },
            },

            supCompPosition: {
                default: () => 'left'
            }
        },
        data() {
            return {
                status: 0,

                ifHouseModelDialogShow: false,

                ifVrModelDialogShow: false,

                modelLoaded: false,
                orbitControlsOption:{
                    target:'0 0 0',
                    enablePan:false,
                    initialPosition: '0 7 7',
                    maxDistance: 50,
                    minPolarAngle:0,
                    maxPolarAngle:80
                }

            }
        },

        computed: {
            positionStyle() {
                if (this.supCompPosition === 'left') {
                    return {left: this.houseData.winPos[0] - 650 + 'px', bottom: this.houseData.winPos[3] + 80 + 'px'}
                } else {
                    return {right: this.houseData.winPos[2] + 150 + 'px', bottom: this.houseData.winPos[3] + 80 + 'px'}
                }
            },

            panelTitle() {
                switch (this.status) {
                    case 0:

                        return '住户信息'
                    case 1:
                        return '水电使用情况(周)'
                }
            },

            modelList() {

                return [{
                    cesiumCode: this.houseData.houseModelCesiumCode
                }]

            },


        },

        methods: {
            handleCloseIconClick() {
                this.houseData.visible = false
            },


            drawGraph() {
                this.$nextTick(
                    () => {
                        let graph = this.$echarts.getInstanceByDom(
                            document.getElementById("electricity_water_graph")
                        );
                        if (graph === null || graph === undefined) {
                            graph = this.$echarts.init(document.getElementById("electricity_water_graph"));
                        }

                        let option = {
                            title: {
                                // text: '水电使用情况（周）',
                                // textStyle:{
                                //     color:'white'
                                // }
                            },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: { // 鼠标移动覆盖 显示横坐标虚线
                                    type: 'shadow',
                                },
                                formatter: ""
                            },
                            grid: {
                                top: 60,
                                right: 40,
                                bottom: 30,
                                left: 40
                            },
                            legend: {
                                top: 0,
                                left: 'left',
                                data: ['用水量', '用电量'],
                                textStyle: {
                                    color: 'white'
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    splitLine: {show: false},
                                    axisTick: {show: false},
                                    data: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
                                    axisLine: {
                                        lineStyle: {
                                            color: 'white'
                                        }
                                    }
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '用水量/吨',
                                    splitLine: {show: false},
                                    axisLine: {
                                        lineStyle: {
                                            color: 'white'
                                        },
                                        show: true

                                    },

                                    axisLabel: {
                                        show: true,
                                        showMinLabel: true,
                                        showMaxLabel: true,
                                        formatter: function (value) {
                                            return value;
                                        }
                                    },

                                },
                                {
                                    type: 'value',
                                    name: '用电量/度',
                                    splitLine: {show: false},
                                    axisLine: {
                                        lineStyle: {
                                            color: 'white'
                                        },
                                        show: true

                                    },

                                    axisLabel: {   //调整左侧Y轴刻度， 直接按对应数据显示
                                        show: true,
                                        showMinLabel: true,
                                        showMaxLabel: true,
                                        formatter: function (value) {
                                            return value;
                                        }
                                    }
                                }
                            ],
                            series: [
                                {
                                    name: '用水量',
                                    type: 'line',
                                    smooth: true,
                                    yAxisIndex: 0,
                                    data: [0.3, 0.5, 0.4, 0.1, 0.8, 0.9, 0.7],
                                    // itemStyle: {normal: {label: {show: true}}},
                                },
                                {
                                    name: '用电量',
                                    type: 'line',
                                    smooth: true,
                                    yAxisIndex: 1,
                                    data: [9, 12, 9, 6, 14, 15, 17],
                                    // itemStyle: {normal: {label: {show: true}}},
                                }
                            ]
                        }

                        graph.clear()
                        graph.setOption(option);
                    }
                )


            },

            handleModelIconClick() {
                this.ifHouseModelDialogShow = true
                // this.$nextTick(()=>{
                //     // window.myEarth.pushEntityToEarth('house_'+this.houseData.id,this.houseData.houseModelCesiumCode)
                //     // window.myEarth.flyToModel('house_'+this.houseData.id)
                //     // this.cameraAttach('house_'+this.houseData.id)
                // })
            },

            handleVrIconClick(){
                this.ifVrModelDialogShow = true
            },


            // getCommonProps(data) {
            //     this._earth = data._earth
            //     this._viewer = data._viewer
            //     window.myEarth.pushEntityToEarth = data.pushEntityToEarth
            //     window.myEarth.flyToModel = data.flyToModel
            //     window.myEarth.getEarthObjByRef = data.getEarthObjByRef
            //     window.myEarth.removeEntityFromEarth = data.removeEntityFromEarth
            //     window.myEarth.clearEntities = data.clearModels
            //     this.clearAllModels = data.clearAllModels
            //     window.myEarth.destroyEarth = data.destroyEarth
            //     window.myEarth.getEarthModelList = data.getEarthModelList
            //     window.myEarth.flyToPosition = data.flyToPosition
            //     this.cameraAttach= data.cameraAttach
            //
            // },

            handleDialogCloseIconClick(){
                this.ifHouseModelDialogShow = false
            }

        },

        mounted() {

        },


        watch: {
            status: {
                handler(newVal) {
                    switch (newVal) {
                        case 0:
                            break
                        case 1:
                            this.drawGraph()
                            break
                    }
                }
            },
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


    .house_info_panel {
        position: fixed;
        height: auto;
        box-sizing: border-box;
        background-color: rgba(24, 49, 85, 0.9);
        box-shadow: 0 0 10px #478de0, 0 0 10px #478de0, 0 0 10px #478de0;
        border-radius: 10px;
        z-index: 1;
        pointer-events: all;
        /*overflow: hidden;*/
    }

    .panel_header {
        height: 40px;
        background-color: rgba(24, 49, 85, 0.9);
        border-bottom: 2px white solid;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-radius: 10px 10px 0 0;
    }

    .panel_title {
        color: white;
        line-height: 30px;
        font-size: 15px;
        padding-left: 10px;
    }

    .icon_panel {
        line-height: 30px;
        color: white;
    }

    .house_info_panel_icon {
        margin-right: 10px;
        margin-left: 10px;
        font-size: 15px;
    }

    .house_info_panel_icon:hover {
        color: var(--lightBlue);
        cursor: pointer;
    }

    .panel_body {
        background-color: rgba(24, 49, 85, 0.9);
        width: 500px;
        height: 300px;
        color: white;
        border-radius: 0px 0px 10px 10px;
    }


    .panel_footer {
        position: absolute;
        width: 400px;
        height: 80px;
        left: 250px;
        bottom: -80px;
        background: linear-gradient(11deg, rgba(0, 0, 0, 0) 49%, rgba(24, 49, 85, 0.9) 49%, rgba(24, 49, 85, 0.9) 51%, rgba(0, 0, 0, 0) 51%);
        pointer-events: none;
    }

    .footer_circle {
        width: 14px;
        height: 14px;
        background-color: rgba(24, 49, 85, 0.9);
        border-radius: 7px;
        position: absolute;
        right: -7px;
        bottom: -7px;
    }

    .panel_body_content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .content_panel {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    .resident_list_content_panel {
        width: 96%;
        height: 100%;
        box-sizing: border-box;
        margin: 10px 0;
        padding: 10px;
        border: 2px solid white;
    }

    .panel_border {
        position: absolute;
        width: 40px;
        height: 40px;
        pointer-events: none;
        z-index: 10;
    }

    .border_rt {
        right: 0;
        top: 0;
        border-radius: 0px 10px 0px 0px;
        border-right: 3px var(--lightBlue) solid;
        border-top: 3px var(--lightBlue) solid;
    }

    .border_rb {
        right: 0;
        bottom: 0;
        border-radius: 0px 0px 10px 0px;
        border-right: 3px var(--lightBlue) solid;
        border-bottom: 3px var(--lightBlue) solid;
    }

    .border_lt {
        left: 0;
        top: 0;
        border-radius: 10px 0px 0px 0px;
        border-left: 3px var(--lightBlue) solid;
        border-top: 3px var(--lightBlue) solid;
    }

    .border_lb {
        left: 0;
        bottom: 0;
        border-radius: 0px 0px 0px 10px;
        border-left: 3px var(--lightBlue) solid;
        border-bottom: 3px var(--lightBlue) solid;
    }

    /deep/ .el-dialog{
        opacity: 1;
        background-color:  rgb(24,49,85);
        border-radius: 10px;
    }

    /deep/ .el-dialog__header{
        display: none;
    }

    /deep/ .el-dialog__body {
        padding: 0;
        color: #606266;
        font-size: 14px;
        word-break: break-all;
        border-radius: 10px;
        overflow: hidden;
        height:100%
    }


    .dialog_header{
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        color: white;
    }

    .dialog_title{
        margin-left: 20px;
        font-size: 20px;
    }
    .dialog_close_icon{
        font-size: 20px;
        margin-right: 20px;
    }

    .dialog_close_icon:hover{
        color: var(--lightBlue);
        cursor: pointer;
    }

    .vr_dialog_header{
        position: absolute;
        top:0;
        left: 0;
        height: 50px;
        width:100%;
        z-index: 1;
        background: rgba(0,0,0,0);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: right;
    }

    .vr_close_icon{
        color: white;
        font-size: 30px;
        font-weight: 700;
        margin-right: 20px;
    }

    .vr_close_icon:hover{
        transform: scale(1.2);
        cursor: pointer;
    }

</style>
