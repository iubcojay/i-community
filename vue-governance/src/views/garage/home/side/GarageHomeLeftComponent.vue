<template>
    <div class="outer_panel">
        <div class="wrap_panel">
            <arch-panel-component position="left" height="290px" title="停车情况">
                <template slot="content">
                    <div class="parking_status_panel">
                        <div class="parking_number_panel">
                            <div class="parking_icon_panel">
                                <div class="parking_icon_img"
                                    :style="{ background: 'url(' + $StaticResourceAddress + '/img/icon/parking.png)', 'background-size': '100% 100%' }">
                                </div>
                            </div>
                            <div class="parking_number_item_panel">
                                <div class="parking_number_item_title_panel">
                                    <i class="iconfont icon-arrow-down" style="color:#67C23A;"></i>
                                    <div class="parking_number_item_title_text_panel">空位</div>
                                </div>

                                <div class="parking_number_item_number_panel">
                                    <countTo :startVal='parkingData.spareNumber - 10' :endVal='parkingData.spareNumber'
                                        :duration='1000' :decimals="0"></countTo>
                                </div>
                            </div>
                            <div class="parking_number_item_panel">
                                <div class="parking_number_item_title_panel">
                                    <i class="iconfont icon-arrow-down" style="color:#E6A23C;"></i>
                                    <div class="parking_number_item_title_text_panel">普通</div>
                                </div>

                                <div class="parking_number_item_number_panel">
                                    <countTo :startVal='parkingData.normalNumber - 10' :endVal='parkingData.normalNumber'
                                        :duration='1000' :decimals="0"></countTo>
                                </div>
                            </div>
                            <div class="parking_number_item_panel ">
                                <div class="parking_number_item_title_panel">
                                    <i class="iconfont icon-arrow-down" style="color:#409EFF;"></i>
                                    <div class="parking_number_item_title_text_panel">充电</div>
                                </div>

                                <div class="parking_number_item_number_panel">
                                    <countTo :startVal='parkingData.energyNumber - 10' :endVal='parkingData.energyNumber'
                                        :duration='1000' :decimals="0"></countTo>
                                </div>
                            </div>
                            <div class="parking_status_panel_line"></div>
                        </div>

                        <div class="parking_enter_info_panel">
                            <div class="parking_enter_info_new_panel">
                                PM08:10 鲁A·A8866 登记进入 开始计费
                            </div>
                            <div class="parking_enter_info_old_panel">
                                PM08:05 鲁A·A8866 登记进入 开始计费
                            </div>
                        </div>
                    </div>
                </template>
            </arch-panel-component>
        </div>
        <div class="wrap_panel">
            <arch-panel-component position="left" height="290px" title="能源消耗分析">
                <template slot="content">
                    <div class="energy_chart_panel" ref="energy_chart_panel">

                    </div>
                </template>
            </arch-panel-component>
        </div>
        <div class="wrap_panel">
            <arch-panel-component position="left" height="290px" title="消防设备检修">
                <template slot="content">
                    <div class="facility_overhaul_panel">
                        <div class="facility_overhaul_title_panel">
                            <div class="arrow_panel">
                                <div class="item_panel">
                                    <i class="iconfont icon-hydrant"></i>
                                    <div class="text_panel">消防类</div>
                                    <div class="number_panel">
                                        <countTo :startVal='facilityData.fireProtectionNumber - 5' :endVal='facilityData.fireProtectionNumber'
                                        :duration='1000' :decimals="0"></countTo>
                                    </div>
                                </div>
                                <div class="item_panel">
                                    <i class="iconfont icon-alarm-light"></i>
                                    <div class="text_panel">报警类</div>
                                    <div class="number_panel">
                                        <countTo :startVal='facilityData.alarmNumber - 5' :endVal='facilityData.alarmNumber'
                                        :duration='1000' :decimals="0"></countTo>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="facility_overhaul_content_panel">
                            <div class="left_title_panel">设备告警</div>
                            <div class="right_content_panel">
                                <div class="facility_list_panel" ref="facility_list_panel">
                                    <div v-for="item of [...facilityList, ...facilityList]" class="facility_item_panel"
                                        
                                        :class="{ facility_item_panel_normal: item.status === 1, facility_item_panel_alarm: item.status === 0 }">
                                        <div class="facility_item_id_panel">{{ item.id }}</div>
                                        <div class="facility_item_name_panel">{{ item.name }}</div>
                                        <div class="facility_item_status_panel">{{ item.status === 1 ? "正常" : "报警" }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

            </arch-panel-component>
        </div>
    </div>
</template>

<script>
import ArchPanelComponent from '@/views/common/InfoPanel/sidepanel/ArchPanelComponent'
import CountTo from 'vue-count-to';
export default {
    name: "GarageHomeLeftComponent",
    components: { ArchPanelComponent, CountTo },
    data() {
        return {
            parkingData: {
                spareNumber: 59,
                normalNumber: 40,
                energyNumber: 20
            },

            facilityData: {
                fireProtectionNumber: 19,
                alarmNumber: 26
            },

            dynamicFacilityDataId: null,

            dynamicParkingDataId: null,

            facilityList: [
                { id: 'A001', name: "烟雾报警器", status: 1 },
                { id: 'A002', name: "烟雾报警器", status: 1 },
                { id: 'A003', name: "烟雾报警器", status: 0 },
                { id: 'A004', name: "烟雾报警器", status: 1 },
                { id: 'A005', name: "烟雾报警器", status: 1 },
                { id: 'A006', name: "烟雾报警器", status: 0 },
                { id: 'A007', name: "烟雾报警器", status: 1 },
            ]
        }
    },
    methods: {
        initComp() {
            this.handleHeightCollapse()
            this.setDynamicParkingData()
            this.setDynamicFacilityData()
            this.drawEnergyChart()
            this.setAlarmListScroll()
           
        },

        handleHeightCollapse() {
            this.$nextTick(() => { document.querySelectorAll('.wrap_panel').forEach(element => element.style.height = element.childNodes[0].offsetHeight + 'px') })
        },

        setDynamicParkingData() {
            let index = 0
            this.dynamicParkingDataId = setInterval(() => {
                if (index === 0) {
                    this.parkingData.spareNumber += 10
                    this.parkingData.normalNumber += 10
                    this.parkingData.energyNumber += 5
                    index = 1
                } else if (index === 1) {
                    this.parkingData.spareNumber -= 10
                    this.parkingData.normalNumber -= 10
                    this.parkingData.energyNumber -= 5

                    index = 0
                }
            }, 3000)
        },

        setDynamicFacilityData() {
            let index = 0
            this.dynamicFacilityDataId = setInterval(() => {
                if (index === 0) {
                    this.facilityData.fireProtectionNumber += 5
                    this.facilityData.alarmNumber += 5

                    index = 1
                } else if (index === 1) {
                    this.facilityData.fireProtectionNumber -= 5
                    this.facilityData.alarmNumber -= 5
                    index = 0
                }
            }, 3000)
        },



        drawEnergyChart() {
            this.$nextTick(() => {
                // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
                let myChart = this.$echarts.init(this.$refs['energy_chart_panel']);
                // 指定图表的配置项和数据
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },

                    legend: {
                        show: true,
                        left: 'right',
                        textStyle: {
                            color: '#FFF',     // 文字的颜色
                            fontStyle: 'normal',    // 文字字体的风格（'normal'，无样式；'italic'，斜体；'oblique'，倾斜字体） 
                            fontWeight: 'normal',    // 文字字体的粗细（'normal'，无样式；'bold'，加粗；'bolder'，加粗的基础上再加粗；'lighter'，变细；数字定义粗细也可以，取值范围100至700）
                            fontSize: '15',    // 文字字体大小
                            lineHeight: '50',    // 行高 ）


                        },

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
                            data: ['外监控', '内监控', '电闸机', '充电桩'],
                            nameTextStyle: {
                                color: "white"
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: 'white',
                                },

                            },
                            axisLabel: {
                                fontSize: 15
                            }

                        }
                    ],
                    yAxis: [
                        {
                            axisLabel: {
                                formatter: function (val) {

                                    return val * 100 + "%";
                                }
                            },
                            nameTextStyle: {
                                color: "white"
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: 'white',
                                },

                            },



                        }
                    ],
                    series: [
                        {
                            name: "上月",
                            type: 'bar',
                            stack: 'Ad',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [0.1, 0.2, 0.2, 0.5],
                            itemStyle: {
                                color: 'rgb(2, 77, 137)'
                            },

                            barWidth: 30,
                        },
                        {
                            name: "本月",
                            type: 'bar',
                            stack: 'Ad',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [0.1, 0.2, 0.2, 0.5],

                            itemStyle: {
                                color: 'rgb(33, 194, 237)'
                            },
                            barWidth: 30,
                        },


                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            })

        },

        setAlarmListScroll() {
            this.$nextTick(() => {

                this.outerHeight = this.$refs['facility_list_panel'].clientHeight;
                let offSet = outerHeight / 4
                document.styleSheets[0].insertRule(
                    `   
                         @keyframes garage_home_scroll_up {
                            0% {
                                top: 0
                            }

                            100% {
                                top: -${offSet}px
                            }
                        }
                    `
                )
                this.$refs['facility_list_panel'].style.animation = `garage_home_scroll_up infinite ${this.facilityList.length * 2}s linear `
            })

        }

    },

    mounted() {
        this.initComp();
    },

    beforeDestroy() {
        this.dynamicParkingDataId && clearInterval(this.dynamicParkingDataId);
        this.dynamicFacilityDataId && clearInterval(this.dynamicFacilityDataId);
    },
}
</script>

<style lang="less" scoped>
.outer_panel {
    @lightBlue: rgb(33, 194, 237);
    @darkBlue: rgb(2, 77, 137);

    height: 100%;
    width: 100%;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    .wrap_panel {
        position: relative;
        width: 75%;
        height: auto;
        // overflow: hidden;
        // height: 300px;
        // background-color: gray;

        .parking_status_panel {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;



            .parking_number_panel {
                width: 100%;
                flex: 4;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                box-sizing: border-box;
                margin: 10px 0;
                box-sizing: border-box;
                padding-top: 5px;
                padding-bottom: 25px;
                position: relative;

                .parking_icon_panel {
                    height: 100%;
                    aspect-ratio: 1;
                    display: flex;
                    flex-direction: column;

                    .parking_icon_img {
                        height: 100%;
                        width: 100%;


                    }


                }

                .parking_number_item_panel {
                    height: 100%;
                    aspect-ratio: 1;

                    display: flex;
                    flex-direction: column;


                    .parking_number_item_title_panel {

                        width: 100%;
                        flex: 2;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;

                        .iconfont {
                            font-size: 20px;
                            color: orange;
                            font-weight: 700;
                            margin-right: 5px;
                        }

                        .parking_number_item_title_text_panel {
                            color: white;
                            font-size: 20px;
                            font-weight: 700;

                        }

                    }

                    .parking_number_item_number_panel {

                        width: 100%;
                        flex: 3;
                        font-size: 40px;
                        font-weight: 700;
                        color: white;
                        text-align: center;
                        line-height: 100%;
                        text-shadow: 4px 4px 1px @darkBlue;
                    }



                }

                .parking_status_panel_line {
                    position: absolute;
                    height: 5px;
                    width: 90%;
                    background: linear-gradient(90deg, rgba(33, 194, 237, 0) 0%, rgba(33, 194, 237, 1) 50%, rgba(33, 194, 237, 0) 100%);
                    // background-color: pink;
                    border-radius: 100px 100px 0 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    margin: 0 auto;
                }
            }

            .parking_enter_info_panel {
                width: 100%;
                flex: 4;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .parking_enter_info_new_panel {
                    width: 300px;
                    height: 25px;
                    margin: 5px 0px;
                    border: 4px solid transparent;
                    border-radius: 50px;
                    border: 3px solid @lightBlue;
                    font-size: 15px;
                    font-weight: 700;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    color: white;

                }

                .parking_enter_info_old_panel {
                    width: 250px;
                    height: 20px;
                    margin: 5px 0px;
                    border: 4px solid transparent;
                    border-radius: 50px;
                    border: 3px solid @darkBlue;
                    font-size: 12px;
                    font-weight: 700;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    opacity: 0.7;
                }
            }
        }

        .energy_chart_panel {
            width: 100%;
            height: 100%;
            // background-color: pink;
        }
    }

    .facility_overhaul_panel {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .facility_overhaul_title_panel {
            width: 100%;
            flex: 1;
            // background-color: gray;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .arrow_panel {
                // background-color: pink;
                width: 100%;
                height: 80%;
                clip-path: polygon(30px 0,
                        0 50%,
                        30px 100%,
                        calc(100% - 30px) 100%,
                        100% 50%,
                        calc(100% - 30px) 0);
                background: linear-gradient(90deg, rgba(33, 194, 237, 0.5) 0%, rgba(2, 77, 137, 0.5) 20%, rgba(2, 77, 137, 0.5) 80%, rgba(33, 194, 237, 0.5) 100%);
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;

                .item_panel {
                    height: 50px;
                    width: auto;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    // background-color: pink;
                    margin: 0 10px;

                    .iconfont {
                        font-size: 30px;
                        color: @lightBlue;
                        font-weight: 500;

                    }

                    .text_panel {
                        color: white;
                        font-size: 15px;
                        font-weight: 700;
                        margin-left: 5px;
                        margin-right: 10px;
                    }

                    .number_panel {
                        font-size: 25px;
                        font-weight: 1000;
                        color: white;
                        text-shadow: 3px 3px 1px @darkBlue;
                    }

                }


            }


        }

        .facility_overhaul_content_panel {
            width: 100%;
            flex: 2;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            .left_title_panel {
                font-size: 20px;
                writing-mode: vertical-lr;
                letter-spacing: 4px;
                font-weight: 700;
                color: white;
            }

            .right_content_panel {
                height: 100%;
                flex: 1;
                position: relative;
                overflow: hidden;

                .facility_list_panel {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    // animation:scroll 5s infinite linear;



                    // @keyframes scroll {
                    //     100%{
                    //         top: -100%;
                    //     }
                    // }

                    .facility_item_panel {
                        height: auto;
                        height: 25px;
                        margin: 15px 0;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-around;
                        align-items: center;
                        color: white;
                        font-size: 18px;
                        font-weight: 1000;
                    }

                    .facility_item_panel_normal {
                        background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 15%, @darkBlue 50%, rgba(255, 255, 255, 0) 85%, rgba(255, 255, 255, 0) 100%);

                    }

                    .facility_item_panel_alarm {
                        background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 15%, rgba(230, 162, 60, 1) 50%, rgba(255, 255, 255, 0) 85%, rgba(255, 255, 255, 0) 100%);

                    }
                }



            }

        }
    }
}
</style>