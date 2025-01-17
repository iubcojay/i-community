const _ = require("lodash")
const uuid = require("uuid");


PARKING_STATUS_ENTER = -1
PARKING_STATUS_STOP = 0
PARKING_STATUS_LEAVE = 1
PARKING_STATUS_ANOMALY = 2

ALARM_TYPE_NONE = 0
ALARM_TYPE_WHISTLE = 1


LIFTER_STATUS_ANOMALY = -1
LIFTER_STATUS_AUTO = 0
LIFTER_STATUS_HAND = 1


function getBaseInfo() {
    const lifterList = [
        {
            id: 1,
            name: '南门-出口',
            status: LIFTER_STATUS_AUTO,
            isRaised: false,
            targetPosition: [11.674, 1.2, -27.968],
            cameraPosition: [10.027, 7.160, -38.576],
        },
        {
            id: 2,
            name: "南门-入口",
            status: LIFTER_STATUS_AUTO,
            isRaised: false,
            targetPosition: [7.793, 1.2, -26.102],
            cameraPosition: [10.027, 7.160, -38.576],
        },
        {
            id: 3,
            name: "北门-出口",
            status: LIFTER_STATUS_AUTO,
            isRaised: false,
            targetPosition: [-38.679, 1.2, 40.297],
            cameraPosition: [-36.653, 9.725, 53.227],
        },
        {
            id: 4,
            name: "北门-入口",
            status: LIFTER_STATUS_AUTO,
            isRaised: false,
            targetPosition: [-34.793, 1.2, 38.326],
            cameraPosition: [-36.653, 9.725, 53.227],
        }

    ]
    const areaData = [
        {
            areaName: "A区",
            areaColor: "#409EFF",
            spaceGroupInfoList: [
                {
                    camera: {
                        position: [18.621, 3.151, -18.463],

                        // rotation: [-0.75 * Math.PI, 0 ,Math.PI]

                    },
                    spaceInfoList: [
                        {
                            name: "A001",
                            position: [
                                20.784,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A002",
                            position: [
                                18.402,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A003",
                            position: [
                                15.974,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [1.370, 5.186, -18.374],

                    },
                    spaceInfoList: [
                        {
                            name: "A004",
                            position: [
                                3.965,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A005",
                            position: [
                                1.562,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A006",
                            position: [
                                -0.787,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-6.856, 5.525, -18.233],

                    },
                    spaceInfoList: [
                        {
                            name: "A007",
                            position: [
                                -4.422,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A008",
                            position: [
                                -6.848,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A009",
                            position: [
                                -9.163,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [18.350, 5.239, -1.849],

                    },
                    spaceInfoList: [
                        {
                            name: "A010",
                            position: [
                                20.747,
                                0,
                                2.156
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A011",
                            position: [
                                18.359,
                                0,
                                2.156
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A012",
                            position: [
                                15.952,
                                0,
                                2.156
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [9.890, 5.239, -1.849],

                    },
                    spaceInfoList: [
                        {
                            name: "A013",
                            position: [
                                12.348,
                                0,
                                2.156
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A014",
                            position: [
                                9.978,
                                0,
                                2.156
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A015",
                            position: [
                                7.607,
                                0,
                                2.156
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [1.570, 5.239, -1.849],

                    },
                    spaceInfoList: [
                        {
                            name: "A016",
                            position: [
                                3.945,
                                0,
                                2.156
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A017",
                            position: [
                                1.575,
                                0,
                                2.156
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A018",
                            position: [
                                -0.815,
                                0,
                                2.156
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-6.870, 5.239, -1.849],

                    },
                    spaceInfoList: [
                        {
                            name: "A019",
                            position: [
                                -4.436,
                                0,
                                2.156
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A020",
                            position: [
                                -6.826,
                                0,
                                2.156
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A021",
                            position: [
                                -9.266,
                                0,
                                2.156
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [17.445, 5.059, 15.224],

                    },
                    spaceInfoList: [
                        {
                            name: "A022",
                            position: [
                                18.245,
                                0,
                                19.06
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A023",
                            position: [
                                16.168,
                                0,
                                19.06
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [10.045, 5.059, 15.224],

                    },
                    spaceInfoList: [
                        {
                            name: "A024",
                            position: [
                                12.369,
                                0,
                                19.06
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A025",
                            position: [
                                9.992,
                                0,
                                19.06
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A026",
                            position: [
                                7.58,
                                0,
                                19.06
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-8.435, 5.059, 15.224],

                    },
                    spaceInfoList: [
                        {
                            name: "A027",
                            position: [
                                -7.087,
                                0,
                                19.06
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "A028",
                            position: [
                                -9.537,
                                0,
                                19.06
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-6.966, 6.118, -5.269],

                    },
                    spaceInfoList: [
                        {
                            name: "A029",
                            position: [
                                -9.256,
                                0,
                                -9.001
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A030",
                            position: [
                                -6.861,
                                0,
                                -9.001
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A031",
                            position: [
                                -4.517,
                                0,
                                -9.001
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [1.654, 6.118, -5.269],

                    },
                    spaceInfoList: [
                        {
                            name: "A032",
                            position: [
                                -0.868,
                                0,
                                -9.001
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A033",
                            position: [
                                1.526,
                                0,
                                -9.001
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A034",
                            position: [
                                3.916,
                                0,
                                -9.001
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [18.334, 6.118, -5.269],

                    },
                    spaceInfoList: [
                        {
                            name: "A035",
                            position: [
                                15.968,
                                0,
                                -9.001
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A036",
                            position: [
                                18.376,
                                0,
                                -9.001
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A037",
                            position: [
                                20.812,
                                0,
                                -9.001
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-6.827, 5.246, 10.813],

                    },
                    spaceInfoList: [
                        {
                            name: "A038",
                            position: [
                                -9.227,
                                0,
                                7.407
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A039",
                            position: [
                                -6.829,
                                0,
                                7.407
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A040",
                            position: [
                                -4.438,
                                0,
                                7.407
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [1.513, 5.246, 10.813],

                    },
                    spaceInfoList: [
                        {
                            name: "A041",
                            position: [
                                -0.874,
                                0,
                                7.407
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A042",
                            position: [
                                1.52,
                                0,
                                7.407
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A043",
                            position: [
                                3.959,
                                0,
                                7.407
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [10.013, 5.246, 10.813],

                    },
                    spaceInfoList: [
                        {
                            name: "A044",
                            position: [
                                7.531,
                                0,
                                7.407
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A045",
                            position: [
                                9.939,
                                0,
                                7.407
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A046",
                            position: [
                                12.368,
                                0,
                                7.407
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [18.433, 5.246, 10.813],

                    },
                    spaceInfoList: [
                        {
                            name: "A047",
                            position: [
                                15.926,
                                0,
                                7.407
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A048",
                            position: [
                                18.334,
                                0,
                                7.407
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "A049",
                            position: [
                                20.796,
                                0,
                                7.407
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                }
            ]
        },
        {
            areaName: "B区",
            areaColor: "#E6A23C",
            spaceGroupInfoList: [
                {
                    camera: {
                        position: [-15.403, 6.410, -18.067],

                    },
                    spaceInfoList: [
                        {
                            name: "B001",
                            position: [
                                -12.876,
                                0,
                                -14.251
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B002",
                            position: [
                                -15.224,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B003",
                            position: [
                                -17.639,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-23.783, 6.410, -18.067],

                    },
                    spaceInfoList: [
                        {
                            name: "B004",
                            position: [
                                -21.235,
                                0,
                                -14.251
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B005",
                            position: [
                                -23.644,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B006",
                            position: [
                                -26.074,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-32.023, 6.410, -18.067],

                    },
                    spaceInfoList: [
                        {
                            name: "B007",
                            position: [
                                -29.641,
                                0,
                                -14.251
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B008",
                            position: [
                                -32.024,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B009",
                            position: [
                                -34.505,
                                0,
                                -14.262
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-15.260, 5.798, -1.827],

                    },
                    spaceInfoList: [
                        {
                            name: "B010",
                            position: [
                                -12.833,
                                0,
                                2.176
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B011",
                            position: [
                                -15.246,
                                0,
                                2.176
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B012",
                            position: [
                                -17.651,
                                0,
                                2.176
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-23.600, 5.798, -1.827],

                    },
                    spaceInfoList: [
                        {
                            name: "B013",
                            position: [
                                -21.24,
                                0,
                                2.176
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B014",
                            position: [
                                -23.646,
                                0,
                                2.176
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B015",
                            position: [
                                -26.05,
                                0,
                                2.176
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-32.060, 5.798, -1.827],

                    },
                    spaceInfoList: [
                        {
                            name: "B016",
                            position: [
                                -29.625,
                                0,
                                2.176
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B017",
                            position: [
                                -32.079,
                                0,
                                2.176
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B018",
                            position: [
                                -34.465,
                                0,
                                2.176
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-15.115, 5.644, 15.251],

                    },
                    spaceInfoList: [
                        {
                            name: "B019",
                            position: [
                                -12.888,
                                0,
                                19.057
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B020",
                            position: [
                                -15.287,
                                0,
                                19.057
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B021",
                            position: [
                                -17.718,
                                0,
                                19.057
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-23.799, 5.575, 14.969],

                    },
                    spaceInfoList: [
                        {
                            name: "B022",
                            position: [
                                -21.458,
                                0,
                                18.703
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B023",
                            position: [
                                -23.862,
                                0,
                                18.703
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B024",
                            position: [
                                -26.265,
                                0,
                                18.703
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-31.948, 5.237, 14.867],

                    },
                    spaceInfoList: [
                        {
                            name: "B025",
                            position: [
                                -29.673,
                                0,
                                18.703
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B026",
                            position: [
                                -32.036,
                                0,
                                18.703
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "B027",
                            position: [
                                -34.439,
                                0,
                                18.703
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                //
                {
                    camera: {
                        position: [-31.809, 4.940, -5.962],

                    },
                    spaceInfoList: [
                        {
                            name: "B028",
                            position: [
                                -34.439,
                                0,
                                -8.972
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B029",
                            position: [
                                -32.018,
                                0,
                                -8.972
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B030",
                            position: [
                                -29.622,
                                0,
                                -8.972
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-23.729, 5.265, -5.822],

                    },
                    spaceInfoList: [
                        {
                            name: "B031",
                            position: [
                                -26.09,
                                0,
                                -8.972
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B032",
                            position: [
                                -23.684,
                                0,
                                -8.972
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B033",
                            position: [
                                -21.323,
                                0,
                                -8.972
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-15.229, 5.265, -5.822],

                    },
                    spaceInfoList: [
                        {
                            name: "B034",
                            position: [
                                -17.662,
                                0,
                                -8.972
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B035",
                            position: [
                                -15.279,
                                0,
                                -8.972
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B036",
                            position: [
                                -12.832,
                                0,
                                -8.972
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-32.301, 5.207, 10.675],

                    },
                    spaceInfoList: [
                        {
                            name: "B037",
                            position: [
                                -34.433,
                                0,
                                7.404
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B038",
                            position: [
                                -32.063,
                                0,
                                7.404
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B039",
                            position: [
                                -29.618,
                                0,
                                7.404
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-23.821, 5.207, 10.675],

                    },
                    spaceInfoList: [
                        {
                            name: "B040",
                            position: [
                                -26.079,
                                0,
                                7.404
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B041",
                            position: [
                                -23.685,
                                0,
                                7.404
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B042",
                            position: [
                                -21.229,
                                0,
                                7.404
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-15.521, 5.207, 10.675],

                    },
                    spaceInfoList: [
                        {
                            name: "B043",
                            position: [
                                -17.662,
                                0,
                                7.404
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B044",
                            position: [
                                -15.246,
                                0,
                                7.404
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B045",
                            position: [
                                -12.827,
                                0,
                                7.404
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-32.258, 4.997, 27.874],

                    },
                    spaceInfoList: [
                        {
                            name: "B046",
                            position: [
                                -34.451,
                                0,
                                23.936
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B047",
                            position: [
                                -32.084,
                                0,
                                23.936
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B048",
                            position: [
                                -29.663,
                                0,
                                23.936
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-23.878, 4.997, 27.874],

                    },
                    spaceInfoList: [
                        {
                            name: "B049",
                            position: [
                                -26.267,
                                0,
                                23.936
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B050",
                            position: [
                                -23.864,
                                0,
                                23.936
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "B051",
                            position: [
                                -21.458,
                                0,
                                23.936
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                }
            ]
        },
        {
            areaName: "充电区",
            areaColor: "#67C23A",
            spaceGroupInfoList: [
                {
                    camera: {
                        position: [-6.663, 6.287, -21.592],

                    },
                    spaceInfoList: [
                        {
                            name: "C001",
                            position: [
                                -4.234,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "C002",
                            position: [
                                -6.641,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "C003",
                            position: [
                                -9.03,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-15.903, 6.287, -21.592],

                    },
                    spaceInfoList: [
                        {
                            name: "C004",
                            position: [
                                -12.687,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "C005",
                            position: [
                                -15.083,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "C006",
                            position: [
                                -17.505,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-24.343, 6.287, -21.592],

                    },
                    spaceInfoList: [
                        {
                            name: "C007",
                            position: [
                                -21.118,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "C008",
                            position: [
                                -23.531,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "C009",
                            position: [
                                -25.91,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-32.783, 6.287, -21.592],

                    },
                    spaceInfoList: [
                        {
                            name: "C010",
                            position: [
                                -29.538,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "C011",
                            position: [
                                -31.969,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "C012",
                            position: [
                                -34.352,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-41.023, 6.287, -21.592],

                    },
                    spaceInfoList: [
                        {
                            name: "C013",
                            position: [
                                -37.994,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "C014",
                            position: [
                                -40.413,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        },
                        {
                            name: "C015",
                            position: [
                                -42.832,
                                0,
                                -25.447
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-45.148, 4.167, -11.174],

                    },
                    spaceInfoList: [
                        {
                            name: "C016",
                            position: [
                                -48.331,
                                0,
                                -12.621
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C017",
                            position: [
                                -48.331,
                                0,
                                -10.211
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-45.148, 4.167, -4.034],

                    },
                    spaceInfoList: [
                        {
                            name: "C018",
                            position: [
                                -48.272,
                                0,
                                -6.578
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C019",
                            position: [
                                -48.272,
                                0,
                                -4.153
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C020",
                            position: [
                                -48.272,
                                0,
                                -1.765
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-42.928, 4.167, 5.326],

                    },
                    spaceInfoList: [
                        {
                            name: "C021",
                            position: [
                                -45.997,
                                0,
                                2.619
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C022",
                            position: [
                                -45.997,
                                0,
                                5.016
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C023",
                            position: [
                                -45.997,
                                0,
                                7.405
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-42.928, 4.167, 13.526],

                    },
                    spaceInfoList: [
                        {
                            name: "C024",
                            position: [
                                -45.997,
                                0,
                                11.001
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C025",
                            position: [
                                -45.997,
                                0,
                                13.411
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C026",
                            position: [
                                -45.997,
                                0,
                                15.823
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-42.928, 4.167, 22.026],

                    },
                    spaceInfoList: [
                        {
                            name: "C027",
                            position: [
                                -45.997,
                                0,
                                19.476
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C028",
                            position: [
                                -45.997,
                                0,
                                21.876
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C029",
                            position: [
                                -45.997,
                                0,
                                24.263
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-42.928, 4.167, 30.406],

                    },
                    spaceInfoList: [
                        {
                            name: "C030",
                            position: [
                                -45.997,
                                0,
                                27.872
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C031",
                            position: [
                                -45.997,
                                0,
                                30.243
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C032",
                            position: [
                                -45.997,
                                0,
                                32.734
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                0.5 * Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-25.566, 5.323, 33.214],

                    },
                    spaceInfoList: [
                        {
                            name: "C033",
                            position: [
                                -28.116,
                                0,
                                36.463
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "C034",
                            position: [
                                -25.786,
                                0,
                                36.463
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "C035",
                            position: [
                                -23.391,
                                0,
                                36.463
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [-17.126, 5.323, 33.214],

                    },
                    spaceInfoList: [
                        {
                            name: "C036",
                            position: [
                                -19.678,
                                0,
                                36.463
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "C037",
                            position: [
                                -17.28,
                                0,
                                36.463
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        },
                        {
                            name: "C038",
                            position: [
                                -14.906,
                                0,
                                36.463
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [29.735, 4.828, -13.338],

                    },
                    spaceInfoList: [
                        {
                            name: "C039",
                            position: [
                                32.729,
                                0,
                                -10.719
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                -0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C040",
                            position: [
                                32.729,
                                0,
                                -13.193
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                -0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C041",
                            position: [
                                32.729,
                                0,
                                -15.534
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                -0.5 * Math.PI
                            ]
                        }
                    ]
                },
                {
                    camera: {
                        position: [29.735, 4.828, -20.798],

                    },
                    spaceInfoList: [
                        {
                            name: "C042",
                            position: [
                                32.729,
                                0,
                                -19.161
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                -0.5 * Math.PI
                            ]
                        },
                        {
                            name: "C043",
                            position: [
                                32.729,
                                0,
                                -21.605
                            ],
                            rotation: [
                                -0.5 * Math.PI,
                                0,
                                -0.5 * Math.PI
                            ]
                        }
                    ]
                }
            ]
        }
    ]

    const lightList = [
        {
            id: 1,
            // name: 'light1',
            title: "A区",
            positionList: [
                [-38.701, 2.2, 39.839],
                [-48.712, 2.2, 39.839],
                [-48.712, 2.2, -21.435],
                [-38.701, 2.2, -21.435],
            ],
            isOpen: false
        },
        {
            id: 2,
            // name: 'light2',
            title: "B区",
            positionList: [
                [-8.234, 2.2, 39.793],
                [-37.991, 2.2, 39.793],
                [-37.991, 2.2, 14.906],
                [-8.234, 2.2, 14.906],
            ],
            isOpen: false
        },
        {
            id: 3,
            // name: 'light3',
            title: "C区",
            positionList: [
                [29.104, 2.2, 21.566],
                [-6.978, 2.2, 21.566],
                [-6.978, 2.2, 15.101],
                [29.104, 2.2, 15.101],
            ],
            isOpen: true
        },
        {
            id: 4,
            // name: 'light4',
            title: "D区",
            positionList: [
                [28.494, 2.2, 13.258],
                [-37.653, 2.2, 13.258],
                [-37.653, 2.2, -2.715],
                [28.494, 2.2, -2.715],

            ],
            isOpen: true
        },
        {
            id: 5,
            // name: 'light5',
            title: "E区",
            positionList: [
                [32.951, 2.2, -3.987],
                [-37.567, 2.2, -3.987],
                [-37.567, 2.2, -21.237],
                [32.951, 2.2, -21.237],

            ],
            isOpen: true
        },
        {
            id: 6,
            // name: 'light6',
            title: "F区",
            positionList: [
                [30.428, 2.2, -22.285],
                [-44.514, 2.2, -22.285],
                [-44.514, 2.2, -28.505],
                [30.428, 2.2, -28.505],
            ],
            isOpen: true
        },
        {
            id: 7,
            // name: 'light6',
            title: "G区",
            positionList: [
                [55.166, 2.2, -29.321],
                [6.029, 2.2, -29.321],
                [6.029, 2.2, -40.280],
                [55.166, 2.2, -40.280],
            ],
            isOpen: true
        },
        {
            id: 8,
            // name: 'light6',
            title: "H区",
            positionList: [
                [-31.940, 2.2, 52.169],
                [-81.317, 2.2, 52.169],
                [-81.317, 2.2, 40.998],
                [-31.940, 2.2, 40.998],
            ],
            isOpen: true
        }
    ]
    return { lifterList, lightList, areaData }
}


function generateCarLicenseTag() {

    const cityList = ["鲁"];
    //车牌号所在地区
    const areaList = ["A", "S", "B", "U", "C", "D", "E", "F", "Y", "G", "V", "H", "J", "K", "L", "M", "N", "P", "Q", "R"]
    //车牌号后5位
    const numberList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    const letterList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "J", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

    const letterNum = Math.floor((Math.random() * 3));
    //区域生成
    const city = _.sample(cityList)
    const area = _.sample(areaList)
    let numList = []

    for (let index = 0; index < letterNum; index++) {
        numList.push(_.sample(letterList))
    }

    for (let index = 0; index < 5 - letterNum; index++) {
        numList.push(_.sample(numberList))
    }
    numList = _.shuffle(numList)
    return city + area + '·' + numList.join('')
}


module.exports = {
    getBaseInfo,
    generateCarLicenseTag,
    PARKING_STATUS: {
        PARKING_STATUS_ENTER,
        PARKING_STATUS_STOP,
        PARKING_STATUS_LEAVE,
        PARKING_STATUS_ANOMALY
    },
    ALARM_TYPE: {
        ALARM_TYPE_NONE,
        ALARM_TYPE_WHISTLE
    },
    LIFTER_TYPE: {
        LIFTER_STATUS_ANOMALY,
        LIFTER_STATUS_AUTO,
        LIFTER_STATUS_HAND
    }
}