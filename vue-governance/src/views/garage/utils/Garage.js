import * as THREE from 'three';
import Vue from 'vue';
import { getChildByName, removeModel } from '@/assets/js/threejs/threejsUtils.js'
import { gsap } from 'gsap';
const _ = require('lodash');
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import GarageAlarmPanelComponent from '@/views/garage.back1/common/panel/GarageAlarmPanelComponent'
import LightInfoPanelComponent from '@/views/garage.back1/common/panel/LightInfoPanelComponent'
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import GarageInfoService from "@/assets/js/service/GarageInfoService";
import Car from "@/assets/js/threejs/Car";
export default class Garage {

    constructor({ scene }) {
        this.scene = scene;
        this.isCeilingRaised = -1

        this.lifterList = [
            {
                id: 1,
                name: '南门-出口',
                status: Garage.LIFTER_STATUS_AUTO,
                isRaised: false,
                targetPosition: [11.674, 1.2, -27.968],
                cameraPosition: [10.027, 7.160, -38.576],
            },
            {
                id: 2,
                name: "南门-入口",
                status: Garage.LIFTER_STATUS_AUTO,
                isRaised: false,
                targetPosition: [7.793, 1.2, -26.102],
                cameraPosition: [10.027, 7.160, -38.576],
            },
            {
                id: 3,
                name: "北门-出口",
                status: Garage.LIFTER_STATUS_AUTO,
                isRaised: false,
                targetPosition: [-38.679, 1.2, 40.297],
                cameraPosition: [-36.653, 9.725, 53.227],
            },
            {
                id: 4,
                name: "北门-入口",
                status: Garage.LIFTER_STATUS_AUTO,
                isRaised: false,
                targetPosition: [-34.793, 1.2, 38.326],
                cameraPosition: [-36.653, 9.725, 53.227],
            }

        ]
        this.areaData = [
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

        this.lightList = [
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

        this.gateMonitorList = [
            {
                id: 1,
                name: '南门-出口',
                targetPosition: [11.674, 1.2, -27.968],
                cameraPosition: [10.027, 7.160, -38.576],
                monitorUrl: window.PLATFORM_CONFIG.StaticResourceAddress + '/monitor/garage/garage_south_enter_light.mp4'

            },
            {
                id: 2,
                name: "南门-入口",
                targetPosition: [7.793, 1.2, -26.102],
                cameraPosition: [10.027, 7.160, -38.576],
                monitorUrl: window.PLATFORM_CONFIG.StaticResourceAddress + '/monitor/garage/garage_south_enter_light.mp4'
            },
            {
                id: 3,
                name: "北门-出口",
                targetPosition: [-38.679, 1.2, 40.297],
                cameraPosition: [-36.653, 9.725, 53.227],
                monitorUrl: window.PLATFORM_CONFIG.StaticResourceAddress + '/monitor/garage/garage_south_enter_light.mp4'
            },
            {
                id: 4,
                name: "北门-入口",
                targetPosition: [-34.793, 1.2, 38.326],
                cameraPosition: [-36.653, 9.725, 53.227],
                monitorUrl: window.PLATFORM_CONFIG.StaticResourceAddress + '/monitor/garage/garage_south_enter_light.mp4'
            }
        ]

        this.animations = null
        // 是否进入灯光控制模式
        this.ifLightFocusMode = false

        console.log("先初始化了garageInfoService");
        this.garageInfoService = new GarageInfoService()

    }

    initModel() {
        let { modelObj, animations } = window.garageModelPool["garage"];
        this.animations = animations
        this.modelObj = modelObj.clone()
        this.formModel(this.modelObj)
        this.addLight()
        this.addBasePlane()
        this.toggleCeilingRaise(true);
        this.actions = this.initAnimation(this.animations, this.scene.animationMixer)
        this.scene.add(this.modelObj)
        this.scene.garage = this

    }

    initAnimation(animations, animationMixer) {
        return animations.map(animation => {
            const action = animationMixer.clipAction(animation, this.modelObj)
            action.name = animation.name
            // 只执行一次
            action.loop = THREE.LoopOnce
            // 执行结束保持结束状态
            action.clampWhenFinished = true
            return action
        })
    }

    addBasePlane() {
        const geometry = new THREE.PlaneGeometry(200, 200);
        const material = new THREE.MeshStandardMaterial({ color: new THREE.Color('rgb(12,12,12)'), side: THREE.DoubleSide });
        const basePlane = new THREE.Mesh(geometry, material);
        basePlane.name = "base_plane"
        basePlane.position.set(0, -0.1, 0)
        basePlane.rotation.set(0.5 * Math.PI, 0, 0)
        this.modelObj.add(basePlane);
    }

    addLight() {
        this.addAmbientLight()
        this.addRectAreaLightList()
    }

    addAmbientLight() {
        this.ambientLight = new THREE.AmbientLight('rgb(100, 100, 100)', 0.1); // soft white light
        this.ambientLight.name = "ambientLight"
        this.modelObj.add(this.ambientLight);
    }

    addRectAreaLightList() {
        const LightSourceGroup = new THREE.Group()
        LightSourceGroup.name = "LightSourceGroup"
        this.lightList.forEach(lightInfo => {
            // 平面光源
            const width = Math.max(...lightInfo.positionList.map(position => position[0])) - Math.min(...lightInfo.positionList.map(position => position[0]))
            const height = Math.max(...lightInfo.positionList.map(position => position[2])) - Math.min(...lightInfo.positionList.map(position => position[2]))
            const intensity = 1.5;
            const position = [
                lightInfo.positionList.reduce((pre, cur) => { return pre + cur[0] / lightInfo.positionList.length }, 0),
                10,
                lightInfo.positionList.reduce((pre, cur) => { return pre + cur[2] / lightInfo.positionList.length }, 0)
            ]
            const rectLight = new THREE.RectAreaLight(new THREE.Color("white"), intensity, width, height);
            rectLight.position.set(...position);
            rectLight.rotation.set(-0.5 * Math.PI, 0, -0.5 * Math.PI)
            rectLight.name = "light_source_" + lightInfo.id
            rectLight.lookAt(position[0], 0, position[2]);
            LightSourceGroup.add(rectLight)
            const helper = new RectAreaLightHelper(rectLight)
            helper.visible = false
            this.modelObj.add(helper)

        })

        this.modelObj.add(LightSourceGroup)
    }

    // clean model
    formModel(modelObj) {
        modelObj.traverse(child => {
            if (child.name.includes('light_')) {
                child.name = 'light'
            }

            if (child.name.includes('shelfGroup_')) {
                child.name = 'shelfGroup'
            }
            if (child.name.includes('lightPipe_')) {
                child.name = 'lightPipe'
            }
        })
    }


    toggleCeilingRaise(val) {
        if (_.isUndefined(val)) {
            const raiseHeight = 70
            const ceiling = getChildByName(this.modelObj, 'ceilingGroup')
            if (this.isCeilingRaised < 0) {
                this.isCeilingRaised = 0
                gsap.to(ceiling.position, { y: ceiling.position.y + raiseHeight, duration: 2, onComplete: () => { this.isCeilingRaised = 1 } })

            } else if (this.isCeilingRaised > 0) {
                this.isCeilingRaised = 0
                gsap.to(ceiling.position, { y: ceiling.position.y - raiseHeight, duration: 2, onComplete: () => { this.isCeilingRaised = -1 } })
            }
        } else {
            if (!(val === true && this.isCeilingRaised === 1 || val === false && this.isCeilingRaised === -1)) {
                this.toggleCeilingRaise(undefined)
            }
        }
    }

    playAnimationByName(actionName) {
        this.actions.find(action => action.name === actionName).setDuration(0.5).play()
    }

    stopAnimationByName(actionName) {
        this.actions.find(action => action.name === actionName).stop()
    }

    getLifterInfoList() {
        return _.cloneDeep(this.lifterList)
    }

    clearGarage(basicThreeJsScene) {
        if (this.modelObj) {
            basicThreeJsScene.removeModel(null, this.modelObj)
            this.animations.forEach(animation => {
                basicThreeJsScene.animationMixer.uncacheClip(animation)
            })
        }

        this.carList.forEach(car => {
            car.clearCar()
        })
    }

    addLifterBrokenInfoPanelByLifterId(lifterId, width = 150, height = 50) {
        // 删除旧的alarmInfoPanel
        if (!getChildByName(this.modelObj, 'lifter_broken_panel_' + lifterId)) {
            this.removeLifterBrokenInfoPanelByLifterId(lifterId)
            const lifter = this.lifterList.find(lifter => lifter.id === lifterId)
            const AlarmPanelComponent = Vue.extend(GarageAlarmPanelComponent)
            const alarmPanelElement = new AlarmPanelComponent({
                propsData: { height, width, content: lifter.name + "起落杆自动检测故障" }
            }).$mount().$el
            const alarmInfoPanel = new CSS2DObject(alarmPanelElement);
            alarmInfoPanel.name = 'lifter_broken_panel_' + lifterId
            alarmInfoPanel.position.set(lifter.targetPosition[0], lifter.targetPosition[1] + 5, lifter.targetPosition[2]);
            this.modelObj.add(alarmInfoPanel);
        }
    }

    removeLifterBrokenInfoPanelByLifterId(lifterId) {
        const originModel = getChildByName(this.modelObj, 'lifter_broken_panel_' + lifterId)
        if (originModel) {
            removeModel(this.modelObj, originModel)
        }
    }

    enterLightFocusMode() {
        if (!this.ifLightFocusMode) {
            this.ifLightFocusMode = true;
            // 实时灯信息
            // console.log(this)
            const lightInfoList = this.garageInfoService.getLightInfoList();
            // const lightInfoList = window.garageScene.garage.garageInfoService.getLightInfoList();
            // 车库模型中灯模型的组
            // const lightGroup = getChildByName(this.modelObj, "lightGroup")

            // 线框组
            const lineGroup = new THREE.Group()
            lineGroup.name = "lineGroup"

            // 灯信息灯信息标签组
            const lightInfoGroup = new THREE.Group()
            lightInfoGroup.name = "lightInfoGroup"

            // 车库模型透明
            this.modelObj.traverse(child => {
                const material = child.material
                if (material) {
                    material.transparent = true;
                    // material.opacity = 0.05
                    gsap.to(material, { opacity: 0.05, duration: 1 })
                }
            })

            // 加入线框、灯信息标签
            lightInfoList.forEach(lightInfo => {
                // 加入线框
                const material = new THREE.LineBasicMaterial({
                    color: lightInfo.isOpen ? new THREE.Color('white') : new THREE.Color('black'),
                });

                const points = [];
                lightInfo.positionList.forEach(position => {
                    const vector = new THREE.Vector3(...position);
                    points.push(vector);
                });

                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.LineLoop(geometry, material);
                line.name = 'light_area_line_' + lightInfo.id
                lineGroup.add(line);

                // 加入灯信息标签
                const LightInfoPanelElement = Vue.extend(LightInfoPanelComponent)
                const lightInfoPanelElement = new LightInfoPanelElement({
                    propsData: {
                        content: lightInfo.title, isOpen: lightInfo.isOpen, changeFunc: () => {
                            this.garageInfoService.toggleLightById(lightInfo.id)

                        }
                    }
                }).$mount().$el
                const lightInfoPanel = new CSS2DObject(lightInfoPanelElement);
                lightInfoPanel.position.set(
                    lightInfo.positionList.reduce((pre, cur) => { return pre + cur[0] / lightInfo.positionList.length }, 0),
                    5,
                    lightInfo.positionList.reduce((pre, cur) => { return pre + cur[2] / lightInfo.positionList.length }, 0)
                );
                lightInfoPanel.name = 'light_info_' + lightInfo.id
                lightInfoGroup.add(lightInfoPanel);

            });

            // lightGroup.add(lineGroup)
            // lightGroup.add(lightInfoGroup)
            gsap.to(lineGroup.position, { x: 0, y: 4, z: 0, duration: 2 });
            this.modelObj.add(lineGroup)
            lineGroup.add(lightInfoGroup)
        }

    }
    activeGarage(updateInterval) {
        this.updateInterval = updateInterval
        const updateFunction = () => {
            const newGarageInfo = this.garageInfoService.getNewGarageInfo(new Date())
            console.log(newGarageInfo);
            // this.updateCarInfo(newGarageInfo)
            // this.updateLifterInfo(newGarageInfo)
            this.updateLightInfo(newGarageInfo)
        }
        updateFunction()
        this.updateIntervalId = setInterval(() => {
            updateFunction()
        }, updateInterval * 1000)
    }
    updateLifterInfo(newGarageInfo) {
        this.lifterList = newGarageInfo.lifter
        newGarageInfo.lifter.forEach(lifterInfo => {
            // 如果道闸故障，添加标签
            if (lifterInfo.status === Garage.LIFTER_STATUS_ANOMALY) {
                this.addLifterBrokenInfoPanelByLifterId(lifterInfo.id);
            } else {
                this.removeLifterBrokenInfoPanelByLifterId(lifterInfo.id);
            }

            if (lifterInfo.isRaised) {
                this.raiseLifterById(lifterInfo.id);
            } else {
                this.descendLifterById(lifterInfo.id);
            }
        });
    }

    // 更新灯光信息
    updateLightInfo(newGarageInfo) {
        this.lightList = newGarageInfo.light
        newGarageInfo.light.forEach(lightInfo => {
            lightInfo.isOpen
                ? this.openLightByLightId(lightInfo.id)
                : this.closeLightByLightId(lightInfo.id);
        });
    }
    updateCarInfo(newGarageInfo) {
        const originCarList = this.carList;
        // 删除不存在的车辆
        _.remove(originCarList, originCar => {
            if (!newGarageInfo.car.find(newCarInfo => newCarInfo.id === originCar.id)) {
                originCar.clearCar(window.myThreeJsScene);
                return true;
            }
        })

        // 更新车辆状态
        newGarageInfo.car.forEach(newCarInfo => {
            let originCar = originCarList.find(
                originCarInfo => originCarInfo.id === newCarInfo.id
            );
            // 如果是新车,添加车辆模型
            if (!originCar) {
                originCar = new Car({
                    carType: newCarInfo.type,
                    color: new THREE.Color(newCarInfo.color),
                    id: newCarInfo.id,
                    gltfLoader: window.myThreeJsScene.gltfLoader,
                    license: newCarInfo.license
                });
                originCar.initModel().then(() => {
                    originCar.addCarToScene(window.myThreeJsScene);
                    // 加入场景时先将车辆隐藏
                    originCar.modelObj.visible = false;
                });

                this.carList.push(originCar);
            }

            // 合并出入库历史轨迹
            const pathInfoList = _.concat(
                newCarInfo.enterPathInfoList,
                newCarInfo.leavePathInfoList
            );
            const targetPathInfo = _.nth(pathInfoList, -1);
            const currentPathInfo = _.nth(pathInfoList, -2);

            // 设置车辆信息
            originCar.parkingStatus = newCarInfo.parkingStatus;
            originCar.isForwarded = targetPathInfo.isForwarded;
            originCar.parkingSpaceNumber = newCarInfo.parkingSpaceNumber;

            // 设置车辆出入库轨迹
            originCar.enterPathInfoList = newCarInfo.enterPathInfoList;
            originCar.leavePathInfoList = newCarInfo.leavePathInfoList;

            // 如果车辆模型已经加载，设置车辆位置
            if (originCar.modelObj) {
                // 车辆模型加载成功
                switch (originCar.parkingStatus) {
                    // 车辆处于停车状态,直接将车辆放置到对应位置
                    case Car.PARKING_STATUS_STOP:
                        originCar.moveTo(currentPathInfo, currentPathInfo.isForwarded, 0);
                        originCar.moveTo(targetPathInfo, originCar.isForwarded, 0);
                        originCar.wheelStop();
                        // 计算车辆停入车位
                        break;

                    // 入库状态
                    case Car.PARKING_STATUS_ENTER:
                        if (newCarInfo.enterPathInfoList.length === 1) {
                            originCar.moveTo(targetPathInfo, undefined, 0);
                        } else {
                            originCar.moveAlongPath({
                                positionInfoList: pathInfoList,
                                startIndex: -2,
                                durationFixFactor: 1.1,
                                smoothFactor: Math.round(this.updateInterval * 5)
                            });
                        }
                        break;
                    // 出库状态
                    case Car.PARKING_STATUS_LEAVE:
                        if (newCarInfo.leavePathInfoList.length === 1) {
                            originCar.moveTo(targetPathInfo, undefined, 0);
                        } else {
                            originCar.moveAlongPath({
                                positionInfoList: pathInfoList,
                                startIndex: -2,
                                durationFixFactor: 1.1,
                                smoothFactor: Math.round(this.updateInterval * 5)
                            });
                        }
                        break;
                    case Car.PARKING_STATUS_ANOMALY: // 车辆异常
                        originCar.wheelStop();
                        break;
                }
                originCar.alarmType = newCarInfo.alarmType
                originCar.modelObj.visible = true;
            }
        });
    }


    leaveLightFocusMode() {
        if (this.ifLightFocusMode) {
            this.ifLightFocusMode = false
            // 所有组件透明度复原
            this.modelObj.traverse(child => {
                const material = child.material
                if (material) {
                    material.transparent = true;
                    gsap.to(material, { opacity: 1, duration: 0.5 })
                }
            })

            // 删除线框和标签信息
            removeModel(this.modelObj, getChildByName(this.modelObj, 'lineGroup'))
        }
    }

    // 打开灯（仅模型）
    openLightByLightId(lightId) {
        console.log("打开了灯光")
        // 点亮线框
        // const lightGroup = getChildByName(this.modelObj, "lightGroup")
        const lineGroup = getChildByName(this.modelObj, "lineGroup")
        if (lineGroup) {
            const lightAreaLine = getChildByName(lineGroup, 'light_area_line_' + lightId)
            lightAreaLine.material.color = new THREE.Color('white')
        }

        //点亮点光源
        const LightSourceGroup = getChildByName(this.modelObj, 'LightSourceGroup')
        const lightSource = getChildByName(LightSourceGroup, 'light_source_' + lightId)
        if (lightSource) {

            lightSource.intensity = 1.5
        }

    }

    // 关闭灯（仅模型）
    closeLightByLightId(lightId) {
        // 关闭线框
        // const lightGroup = getChildByName(this.modelObj, "lightGroup")
        const lineGroup = getChildByName(this.modelObj, "lineGroup")
        if (lineGroup) {
            const lightAreaLine = getChildByName(lineGroup, 'light_area_line_' + lightId)
            lightAreaLine.material.color = new THREE.Color('black')
        }

        // 熄灭光源
        const LightSourceGroup = getChildByName(this.modelObj, 'LightSourceGroup')
        const lightSource = getChildByName(LightSourceGroup, 'light_source_' + lightId)
        if (lightSource) {
            lightSource.intensity = 0
        }
    }

    getLifterList() {
        return _.cloneDeep(this.lifterList)
    }

    getCarList() {
        return _.cloneDeep(this.carList)
    }

    getLightList() {
        return _.cloneDeep(this.lightList)
    }

    getAreaData() {
        return _.cloneDeep(this.areaData)
    }

    getGateMonitorList() {
        return _.cloneDeep(this.gateMonitorList)
    }

    setLifterMode(lifterId, status) {
        this.garageInfoService.setLifterMode(lifterId, status)
    }

    setLifterStatus(lifterId, isRaise) {
        this.garageInfoService.setLifterStatus(lifterId, isRaise)
    }

    toggleLightById(lightId, option) {
        this.garageInfoService.toggleLightById(lightId, option)
    }


    destroyGarage() {
        if (this.modelObj) {
            this.scene.removeModel(this.scene.scene, this.modelObj)
        }
    }

}
