<template>
    <div class="outer_panel">
        <div class="wrap_panel">
            <arch-panel-component position="right" height="290px" title="充电进度提示">
                <template slot="content">
                    <div class="parking_status_panel">
                        <div class="power_warning_panel">
                            <div class="power_warning_content_panel">
                                <div class="power_warning_card_panel center_power_warning_card_panel">
                                    <div class="card_title_panel">
                                        <div class="card_title_time_panel">
                                            时间：2032-3-23
                                        </div>
                                        <div class="card_title_status_panel">
                                            未提示
                                        </div>
                                    </div>
                                    <div class="card_content_panel">
                                        <div class="card_content_left_panel">
                                            <div>
                                                车位：A006
                                            </div>
                                            <div>
                                                已装：25KWH
                                            </div>
                                            <div>
                                                计费：15元
                                            </div>

                                        </div>
                                        <div class="card_content_right_panel">
                                            <div class="alarm_warp_panel">
                                                <i class="iconfont icon-alarm"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="power_warning_card_panel left_power_warning_card_panel">
                                    <div class="card_title_panel">
                                        <div class="card_title_time_panel">
                                            时间：2032-3-23
                                        </div>
                                        <div class="card_title_status_panel">
                                            未提示
                                        </div>
                                    </div>
                                    <div class="card_content_panel">
                                        <div class="card_content_left_panel">
                                            <div>
                                                车位：A006
                                            </div>
                                            <div>
                                                已装：25KWH
                                            </div>
                                            <div>
                                                计费：15元
                                            </div>

                                        </div>
                                        <div class="card_content_right_panel">
                                            <div class="alarm_warp_panel">
                                                <i class="iconfont icon-alarm"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="power_warning_card_panel right_power_warning_card_panel">
                                    <div class="card_title_panel">
                                        <div class="card_title_time_panel">
                                            时间：2032-3-23
                                        </div>
                                        <div class="card_title_status_panel" style="color: gray;">
                                            已提示
                                        </div>
                                    </div>
                                    <div class="card_content_panel">
                                        <div class="card_content_left_panel">
                                            <div>
                                                车位：A006
                                            </div>
                                            <div>
                                                已装：25KWH
                                            </div>
                                            <div>
                                                计费：15元
                                            </div>

                                        </div>
                                        <div class="card_content_right_panel">
                                            <div class="alarm_warp_panel">
                                                <i class="iconfont icon-alarm" style="color: gray;"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <!-- <div class="parking_status_panel_line"></div> -->
                        </div>

                        <div class="parking_out_info_panel">
                            <div class="parking_out_info_new_panel">
                                PM08:10 鲁A·A8866 登记出行 付费25
                            </div>
                            <div class="parking_out_info_old_panel">
                                PM08:05 鲁A·A8866 登记出行 付费25
                            </div>
                        </div>
                    </div>
                </template>
            </arch-panel-component>
        </div>
        <div class="wrap_panel">
            <arch-panel-component position="right" height="290px" title="人员轮班表">
                <template slot="content">
                    <div class="staff_scheduling_panel" ref="staff_scheduling_panel"></div>
                </template>
            </arch-panel-component>
        </div>
        <div class="wrap_panel">
            <arch-panel-component position="right" height="290px" title="道闸监控">
                <template slot="content">
                    <div class="monitor_panel">
                        <div class="monitor_title_panel">
                            <div class="monitor_position_panel">
                                <i class="iconfont icon-monitor"></i>
                                <div class="monitor_position_text_panel">北门-出入口</div>
                            </div>
                            <div class="change_icon_panel">
                                <i class="iconfont icon-change"></i>
                            </div>
                        </div>
                        <div class="monitor_content_panel">
                            <div class="monitor_video_panel">
                                <div class="monitor_video_warp_panel">
                                    <video :src="$StaticResourceAddress + '/monitor/garage/garage_car.mp4'" :controls="false" loop
                                        autoplay muted class="monitor_video_comp"></video>

                                </div>
                            </div>
                            <div class="monitor_license_plate_panel">
                                <div class="monitor_license_plate_comp_panel">
                                    <span>鲁A·A8866</span>
                                    
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

export default {
    name: "GarageHomeRightComponent",
    components: { ArchPanelComponent },
    methods: {
        initComp() {
            this.handleHeightCollapse()
            this.drawStaffCharts()

        },

        handleHeightCollapse() {
            this.$nextTick(() => { document.querySelectorAll('.wrap_panel').forEach(element => element.style.height = element.childNodes[0].offsetHeight + 'px') })

        },

        drawStaffCharts() {
            this.$nextTick(() => {
                // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
                let myChart = this.$echarts.init(this.$refs['staff_scheduling_panel']);
                let echarts = this.$echarts

                // 指定图表的配置项和数据
                // let option = {
                //     tooltip: {
                //         trigger: 'axis',
                //         formatter: function (params) {
                //             var tar = params[1];
                //             return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value / (1000 * 60 * 60 * 24) + '天';
                //         }
                //     },
                //     grid: {
                //         top: '0%',
                //         left: '0%',
                //         right: '0%',
                //         bottom: '0%',
                //         containLabel: true
                //     },
                //     yAxis: {
                //         type: 'category',
                //         splitLine: {
                //             show: false
                //         },
                //         data: projectItem
                //     },
                //     xAxis: {
                //         type: 'value',
                //         min: dateMin,
                //         axisLabel: {
                //             color: '#333', // 坐标轴文字颜色
                //             formatter: function (param) {
                //                 console.log(param)
                //                 let date = new Date(param);
                //                 let dateLabel = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                //                 return dateLabel;
                //             }
                //         }
                //     },
                //     series: [{
                //         name: 'Placeholder',
                //         type: 'bar',
                //         stack: 'Total',
                //         itemStyle: {
                //             borderColor: 'transparent',
                //             color: 'transparent'
                //         },
                //         emphasis: {
                //             itemStyle: {
                //                 borderColor: 'transparent',
                //                 color: 'transparent'
                //             }
                //         },
                //         data: projectItemStartValue
                //     },
                //     {
                //         name: '周期',
                //         type: 'bar',
                //         stack: 'Total',
                //         data: projectItemDuringValue
                //     }
                //     ]
                // };

                let option = {

                    grid: {
                        top: "10%",
                        left: "3%",
                        right: "5%",
                        bottom: "3%",
                        containLabel: true
                    },
                    yAxis: {
                        type: "category",
                        splitLine: {
                            "show": false
                        },
                        data: [
                            "王五",
                            "李四",
                            "张三"
                        ],
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: 'white',
                            },

                        },
                        axisLabel: {
                            fontSize: 15
                        }

                    },
                    xAxis: {
                        type: "value",

                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgb(255,255,255)',
                                opacity: 0.5
                            }
                        },


                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: 'white',
                            },

                        },
                        axisLabel: {
                            fontSize: 15,
                            formatter: function (val) {

                                return val % 24 + ':00';
                            }
                        },
                        min: 7,
                        max: 31,
                        interval: 5,
                        position: 'top'



                    },
                    series: [
                        {

                            type: "bar",
                            stack: "Total",
                            itemStyle: {
                                borderColor: "transparent",
                                color: "transparent"
                            },
                            emphasis: {
                                itemStyle: {
                                    borderColor: "transparent",
                                    color: "transparent"
                                }
                            },
                            data: [
                                19,
                                12,
                                7,
                            ],
                            barWidth: 20,
                        },
                        {
                            type: "bar",
                            stack: "Total",
                            data: [
                                12,
                                12,
                                12
                            ],
                            itemStyle: {
                                normal: {
                                    //这里是颜色
                                    color: function (params) {
                                        //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                                        var colorList = [
                                            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                                {
                                                    offset: 0,
                                                    color: 'rgb(232,206,146)'
                                                },
                                                {
                                                    offset: 1,
                                                    color: 'rgb(37,86,115)'
                                                }
                                            ]),

                                            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                                {
                                                    offset: 0,
                                                    color: 'rgb(88,176,220)'
                                                },
                                                {
                                                    offset: 1,
                                                    color: 'rgb(232,206,146)'
                                                }
                                            ]),

                                            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                                {
                                                    offset: 0,
                                                    color: 'rgb(26,84,117)'
                                                },
                                                {
                                                    offset: 1,
                                                    color: 'rgb(88,176,220)'
                                                }
                                            ]),
                                        ];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            },
                            barWidth: 20,
                        }
                    ]
                }

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            })
        }

    },

    mounted() {
        this.initComp();
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
    align-items: flex-end;

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



            .power_warning_panel {
                width: 100%;
                flex: 4;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                box-sizing: border-box;
                margin: 10px 0;
                box-sizing: border-box;
                position: relative;
                padding-bottom: 5px;

                .power_warning_content_panel {
                    width: 100%;
                    height: 100%;
                    position: relative;

                    .power_warning_card_panel {
                        width: 200px;
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        margin: auto 0;
                        border-radius: 10px;
                        background-color: rgb(4, 61, 108);

                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        overflow: hidden;

                        .card_title_panel {
                            height: 25px;
                            width: 100%;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: space-between;
                            background-color: #0d5692;


                            .card_title_time_panel {
                                color: white;
                                font-size: 13px;
                                padding-left: 5px;
                                font-weight: 700;
                            }

                            .card_title_status_panel {
                                color: #E6A23C;
                                font-size: 13px;
                                padding-right: 5px;
                                font-weight: 1000;
                            }
                        }

                        .card_content_panel {
                            width: 100%;
                            flex: 1;
                            // background-color: green;
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                            align-items: center;

                            .card_content_left_panel {
                                height: 100%;
                                flex: 1;
                                color: white;
                                font-size: 15px;
                                padding: 5px;
                                display: flex;
                                flex-direction: column;
                                justify-content: space-around;
                                align-items: flex-start;

                            }

                            .card_content_right_panel {
                                height: 100%;
                                aspect-ratio: 1;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;


                                .alarm_warp_panel {
                                    width: 50px;
                                    height: 50px;
                                    background-color: #0f4c7e;
                                    border-radius: 25px;
                                    text-align: center;
                                    line-height: 50px;
                                    position: relative;


                                    &:hover {
                                        cursor: pointer;
                                    }

                                    .iconfont {
                                        font-size: 30px;
                                        color: #E6A23C;
                                        font-weight: 1000;
                                    }


                                }


                            }

                        }



                    }

                    .center_power_warning_card_panel {
                        height: 100px;
                        left: 0;
                        right: 0;
                        margin: auto auto;
                        z-index: 2;
                        box-shadow: 0 0 3px 3px rgb(4, 61, 108);
                        border: @lightBlue 3px solid;
                    }

                    .left_power_warning_card_panel {
                        height: 90px;
                        left: 0;
                        z-index: 1;
                        opacity: 0.5;
                        border: @lightBlue 1px solid;
                    }

                    .right_power_warning_card_panel {
                        height: 90px;
                        right: 0;
                        z-index: 1;
                        opacity: 0.5;
                        border: @lightBlue 1px solid;
                    }
                }

                .parking_status_panel_line {
                    position: absolute;
                    height: 2px;
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

            .parking_out_info_panel {
                width: 100%;
                flex: 3;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .parking_out_info_new_panel {
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

                .parking_out_info_old_panel {
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

        .staff_scheduling_panel {
            width: 100%;
            height: 100%;
            // background-color: pink;
        }

        .monitor_panel {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .monitor_title_panel {
                height: 30px;
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                border-bottom: white 1px solid;

                .monitor_position_panel {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: auto;

                    .iconfont {
                        color: @lightBlue;
                        font-size: 20px;
                        margin-right: 10px;
                    }

                    .monitor_position_text_panel {
                        color: white;
                        font-size: 15px;
                    }

                }

                .change_icon_panel {
                    color: white;
                    font-size: 20px;
                }
            }

            .monitor_content_panel {
                width: 100%;
                flex: 1;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;


                .monitor_video_panel {
                    height: 100%;
                    flex: 1;
                    box-sizing: border-box;
                    padding: 10px;
                    padding-left: 0;

                    .monitor_video_warp_panel {
                        width: 100%;
                        height: 100%;

                        .monitor_video_comp {
                            width: 100%;
                            height: 100%;
                            object-fit: fill;
                        }
                    }


                }

                .monitor_license_plate_panel {
                    width: 50px;
                    height: 100%;
                    box-sizing: border-box;
                    padding: 10px 0;

                    .monitor_license_plate_comp_panel {
                        width: 100%;
                        height: 100%;
                        background-color: rgb(0, 46, 135);
                        box-sizing: border-box;
                        border: 2px white solid;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        span{
                            writing-mode: vertical-lr;
                            color: white;
                            font-size: 27px;
                            font-weight: 1000;
                        }
                       
                    }
                }
            }
        }

    }
}
</style>