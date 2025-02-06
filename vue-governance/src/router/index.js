import Vue from 'vue'
import VueRouter from "vue-router"
// import axios from "axios";
import store from "@/store";
import * as _ from "lodash";
import common from '../commom'
import LoginPage from "@/views/entrance/LoginPage";
import IndexPage from "@/views/index/IndexPage";

import RegionComponent from '@/views/index/overview/RegionComponent'
import LandMarkComponent from '@/views/index/overview/LandMarkComponent'

// 引入社区页面
// #region
import CommunityComponent from '@/views/index/community/CommunityComponent';
import HomeControllerComponent from "@/views/index/community/home/HomeControllerComponent";
import PatrolCommonDroneControllerComponent
    from "@/views/index/community/governance/patrol/common/drone/PatrolCommonDroneControllerComponent";
import FacilityCommonControllerComponent
    from "@/views/index/community/entity/facility/common/FacilityCommonControllerComponent";
import MonitorCommonBroadcastControllerComponent
    from "@/views/index/community/internet/monitor/common/broadcast/MonitorCommonBroadcastControllerComponent";
import InformationCommonResidentControllerComponent
    from "@/views/index/community/search/information/common/resident/InformationCommonResidentControllerComponent";
import ProcessStreetProgressControllerComponent
    from "@/views/index/community/governance/process/street/progress/ProcessStreetProgressControllerComponent";
import ProcessStreetTaskAddControllerComponent
    from "@/views/index/community/governance/process/street/taskadd/ProcessStreetTaskAddControllerComponent";
import ProcessCommitteeProgressControllerComponent
    from "@/views/index/community/governance/process/committee/progress/ProcessCommitteeProgressControllerComponent";
import ProcessCommitteeReceiveControllerComponent
    from "@/views/index/community/governance/process/committee/taskreceive/ProcessCommitteeReceiveControllerComponent";
import ProcessCommitteeDistributionControllerComponent
    from "@/views/index/community/governance/process/committee/taskdis/ProcessCommitteeDistributionControllerComponent";
import ProcessCellReceiveControllerComponent
    from "@/views/index/community/governance/process/cell/taskreceive/ProcessCellReceiveControllerComponent";
import ProcessCellProgressControllerComponent
    from "@/views/index/community/governance/process/cell/progress/ProcessCellProgressControllerComponent";
import ProcessCellDistributionControllerComponent
    from "@/views/index/community/governance/process/cell/taskdis/ProcessCellDistributionControllerComponent";
import ProcessGridReceiveControllerComponent
    from "@/views/index/community/governance/process/grid/taskreceive/ProcessGridReceiveControllerComponent";
import ProcessGridFinishControllerComponent
    from "@/views/index/community/governance/process/grid/taskfinish/ProcessGridFinishControllerComponent";
import PatrolCommonGridManControllerComponent
    from "@/views/index/community/governance/patrol/common/gridman/PatrolCommonGridManControllerComponent";
import MonitorCommonFireDetectionControllerComponent
    from "@/views/index/community/internet/monitor/common/fireDetection/MonitorCommonFireDetectionControllerComponent";
import MonitorCommonMonitorViewControllerComponent
    from "@/views/index/community/internet/monitor/common/monitorView/MonitorCommonMonitorViewControllerComponent";
import MonitorCommonParkDetectionControllerComponent
    from "@/views/index/community/internet/monitor/common/parkDetection/MonitorCommonParkDetectionControllerComponent";
import SceneCommonGateControllerComponent
    from '@/views/index/community/internet/scene/common/gate/SceneCommonGateControllerComponent'

// #endregion

import SchoolComponent from '@/views/index/school/SchoolComponent';
import SchoolHomeControllerComponent from "@/views/index/school/home/SchoolHomeControllerComponent";

// 引入工厂页面
import FactoryComponent from '@/views/index/factory/FactoryComponent'
import FactoryTransportPathHistoryControllerComponent
    from '@/views/index/factory/transport/path/history/FactoryTransportPathHistoryControllerComponent'
import FactoryTransportPathLiveControllerComponent
    from '@/views/index/factory/transport/path/live/FactoryTransportPathLiveControllerComponent'
import FactoryTransportAccidentRecordComponent
    from '@/views/index/factory/transport/accident/record/FactoryTransportAccidentRecordComponent'

// 引入车库页面
// #region
import GaragePage from '@/views/garage.back1/GaragePage'
import GarageHomeControllerComponent from '@/views/garage.back1/home/GarageHomeControllerComponent'
import GarageGovernanceFacilityLifterControllerComponent
    from '@/views/garage.back1/governance/facility/lifter/GarageGovernanceFacilityLifterControllerComponent'
import GarageGovernanceFacilityParkingSpaceControllerComponent
    from '@/views/garage.back1/governance/facility/parkingSpace/GarageGovernanceFacilityParkingSpaceControllerComponent'
import GarageGovernanceFacilityLightControllerComponent
    from '@/views/garage.back1/governance/facility/light/GarageGovernanceFacilityLightControllerComponent'
import GarageCarInformationPositionControllerComponent
    from '@/views/garage.back1/car/information/position/GarageCarInformationPositionControllerComponent'
import GarageGovernanceMonitorGateControllerComponent
    from '@/views/garage.back1/governance/monitor/gate/GarageGovernanceMonitorGateControllerComponent'
// #endregion

// 引入测试页面
// #region
import TestThreeJsPage from "@/views/test/TestThreeJsPage";
import TestClockPage from '@/views/test/TestClockPage'
import TestPanelPage from '@/views/test/TestPanelPage'
import TestNodePage from '@/views/test/TestNodePage'
import TestPinPage from '@/views/test/TestPinPage'
import TestImagePage from '@/views/test/TestImagePage'
import TestWeatherPage from '@/views/test/TestWeatherPage'
import TestRegionPage from '@/views/test/TestRegionPage'
// #endregion

import AdminPage from '@/views/admin/AdminPage'
import AdminFacilityInfoComponent from '@/views/admin/facility/info/AdminFacilityInfoComponent'
import AdminCommunityGeometryImageryComponent from '@/views/admin/geometry/AdminCommunityGeometryImageryComponent'
import AccidentSceneComponentCCC
    from "@/views/index/community/internet/monitor/common/fireTruckSaveMe/AccidentSceneComponentCCC.vue";
import AccidentSceneComponent
    from "@/views/index/community/internet/monitor/common/fireTruckSaveMe/AccidentSceneComponentCCC.vue";
import FactoryTransportAccidentRecordComponentCCC
    from "@/views/index/community/internet/monitor/common/fireTruckSaveMe/FactoryTransportAccidentRecordComponentCCC";
import FactoryTransportAccidentRecordComponentRR
    from "@/views/index/community/internet/monitor/common/fireRecord/FactoryTransportAccidentRecordComponentRR";
import DisputeCommonCheckControllerComponent
    from "@/views/index/community/governance/dispute/common/check/DisputeCommonCheckControllerComponent.vue";
import ModelInfoControllerComponent from "@/views/index/community/other/model-info/ModelInfoControllerComponent.vue";
import SchoolSuperviseControllerComponent from "@/views/index/school/supervise/SchoolSuperviseControllerComponent.vue";

Vue.use(VueRouter)

let routes = [
    // login路由
    {
        path: '/login',
        name: 'login',
        component: LoginPage
    },
    // test路由
    {
        path: '/test',
        name: 'test',
        component: {render: (e) => e("router-view")},
        children: [
            {
                path: "/test/three",
                name: "testThree",
                component: TestThreeJsPage,

            },
            {
                path: "/test/clock",
                name: "testClock",
                component: TestClockPage,

            },
            {
                path: "/test/panel",
                name: "testPanel",
                component: TestPanelPage,

            },
            {
                path: "/test/node",
                name: "testNode",
                component: TestNodePage,
            },
            {
                path: "/test/pin",
                name: "testPin",
                component: TestPinPage,
            },
            {
                path: "/test/image",
                name: "testImage",
                component: TestImagePage,
            },
            {
                path: "/test/weather",
                name: "testWeather",
                component: TestWeatherPage,
            },
            {
                path: "/test/region",
                name: "testRegion",
                component: TestRegionPage,
            },
        ]


    },

    // admin路由
    {
        path: '/admin',
        name: 'admin',
        component: AdminPage,
        redirect: "/admin/community/geometry/imagery",
        children: [
            {
                path: "/admin/community",
                name: "adminCommunity",
                component: {render: (e) => e("router-view")},
                children: [
                    {
                        path: "/admin/community/facility",
                        name: "adminCommunityFacility",
                        component: {render: (e) => e("router-view")},
                        children: [
                            {
                                path: "/admin/community/facility/info",
                                name: "adminCommunityFacilityInfo",
                                component: AdminFacilityInfoComponent,

                            },

                        ]
                    },
                    {
                        path: "/admin/community/geometry",
                        name: "adminCommunityGeometry",
                        component: {render: (e) => e("router-view")},
                        children: [
                            {
                                path: "/admin/community/geometry/imagery",
                                name: "adminCommunityGeometryImagery",
                                component: AdminCommunityGeometryImageryComponent,

                            },

                        ]
                    }
                ]
            },
        ]

    },

    // Cesium路由
    {
        path: '/index',
        name: 'index',
        component: IndexPage,
        redirect: '/index/region',
        // redirect: '/index/school/home',
        children: [
            {
                path: "/index/region",
                name: "indexOverviewRegion",
                component: RegionComponent
            },
            {
                path: "/index/land",
                name: "indexOverviewLand",
                component: LandMarkComponent
            },
            // 解放路社区
            {
                path: "/index/community",
                name: "indexCommunity",
                component: CommunityComponent,
                redirect: '/index/community/home',
                children: [
                    // home
                    {
                        path: "/index/community/home",
                        name: "indexHome",
                        component: HomeControllerComponent
                    },

                    // other
                    {
                        path: "/index/community/other",
                        name: "indexOther",
                        component: {render: (e) => e("router-view")},
                        children: [
                            {
                                path: "/index/community/other/model_info",
                                name: "indexOtherModelInfo",
                                component: ModelInfoControllerComponent
                            },
                        ]
                    },

                    // entity
                    {
                        path: "/index/community/entity",
                        name: "indexEntity",
                        component: {render: (e) => e("router-view")},
                        children: [
                            {
                                path: "/index/community/entity/facility",
                                name: "indexFacility",
                                component: {render: (e) => e("router-view")},
                                children: [
                                    {
                                        path: "/index/community/entity/facility/common",
                                        name: "indexFacilityCommon",
                                        component: FacilityCommonControllerComponent,
                                        children: []
                                    },
                                ]
                            },
                        ]
                    },
                    // governance
                    {
                        path: "/index/community/governance",
                        name: "indexGovernance",
                        component: {render: (e) => e("router-view")},
                        children: [
                            {
                                path: "/index/community/governance/process",
                                name: "indexProcess",
                                component: {render: (e) => e("router-view")},
                                children: [
                                    {
                                        path: "/index/community/governance/process/street",
                                        name: "indexProcessStreet",
                                        component: {render: (e) => e("router-view")},
                                        children: [
                                            {
                                                path: "/index/community/governance/process/street/progress",
                                                name: "indexProcessStreetProgress",
                                                component: ProcessStreetProgressControllerComponent
                                            },
                                            {
                                                path: "/index/community/governance/process/street/taskAdd",
                                                name: "indexProcessStreetTaskAdd",
                                                component: ProcessStreetTaskAddControllerComponent
                                            },
                                        ]
                                    },


                                    {
                                        path: "/index/community/governance/process/committee",
                                        name: "indexProcessCommittee",
                                        component: {render: (e) => e("router-view")},
                                        children: [
                                            {
                                                path: "/index/community/governance/process/committee/progress",
                                                name: "indexProcessCommitteeProgress",
                                                component: ProcessCommitteeProgressControllerComponent
                                            },
                                            {
                                                path: "/index/community/governance/process/committee/taskReceive",
                                                name: "indexProcessCommitteeTaskReceive",
                                                component: ProcessCommitteeReceiveControllerComponent
                                            },
                                            {
                                                path: "/index/community/governance/process/committee/taskDistribution",
                                                name: "indexProcessCommitteeTaskDistribution",
                                                component: ProcessCommitteeDistributionControllerComponent
                                            },

                                        ]
                                    },

                                    {
                                        path: "/index/community/governance/process/cell",
                                        name: "indexProcessCell",
                                        component: {render: (e) => e("router-view")},
                                        children: [

                                            {
                                                path: "/index/community/governance/process/cell/taskReceive",
                                                name: "indexProcessCellTaskReceive",
                                                component: ProcessCellReceiveControllerComponent
                                            },
                                            {
                                                path: "/index/community/governance/process/cell/progress",
                                                name: "indexProcessCellProgress",
                                                component: ProcessCellProgressControllerComponent
                                            },
                                            {
                                                path: "/index/community/governance/process/cell/taskDistribution",
                                                name: "indexProcessCellTaskDistribution",
                                                component: ProcessCellDistributionControllerComponent
                                            },
                                        ]
                                    },


                                    {
                                        path: "/index/community/governance/process/grid",
                                        name: "indexProcessGrid",
                                        component: {render: (e) => e("router-view")},
                                        children: [

                                            {
                                                path: "/index/community/governance/process/grid/taskReceive",
                                                name: "indexProcessGridTaskReceive",
                                                component: ProcessGridReceiveControllerComponent
                                            },
                                            {
                                                path: "/index/community/governance/process/grid/taskFinish",
                                                name: "indexProcessGridTaskFinish",
                                                component: ProcessGridFinishControllerComponent
                                            },
                                        ]
                                    },

                                ]
                            },
                            {
                                path: "/index/community/governance/patrol",
                                name: "indexPatrol",
                                component: {render: (e) => e("router-view")},
                                children: [
                                    {
                                        path: "/index/community/governance/patrol/common",
                                        name: "indexProcessCommon",
                                        component: {render: (e) => e("router-view")},
                                        children: [
                                            {
                                                path: "/index/community/governance/patrol/common/drone",
                                                name: "indexPatrolCommonDrone",
                                                component: PatrolCommonDroneControllerComponent
                                            },
                                            {
                                                path: "/index/community/governance/patrol/common/gridMan",
                                                name: "indexPatrolCommonGridMan",
                                                component: PatrolCommonGridManControllerComponent
                                            },
                                        ]
                                    },
                                ]
                            },
                            {
                                path: "/index/community/governance/dispute",
                                name: "indexDispute",
                                component: {render: (e) => e("router-view")},
                                children: [
                                    {
                                        path: "/index/community/governance/dispute/common",
                                        name: "indexDisputeCommon",
                                        component: {render: (e) => e("router-view")},
                                        children: [
                                            {
                                                path: "/index/community/governance/dispute/common/check",
                                                name: "indexDisputeCommonCheck",
                                                component: DisputeCommonCheckControllerComponent
                                            }
                                        ]
                                    },
                                ]
                            },
                        ]
                    },

                    // internet
                    {
                        path: "/index/community/internet",
                        name: "indexInternet",
                        component: {render: (e) => e("router-view")},
                        children: [
                            {
                                path: "/index/community/internet/monitor",
                                name: "indexMonitor",
                                component: {render: (e) => e("router-view")},
                                children: [
                                    {
                                        path: "/index/community/internet/monitor/common",
                                        name: "indexMonitorCommon",
                                        component: {render: (e) => e("router-view")},
                                        children: [
                                            {
                                                path: "/index/community/internet/monitor/common/broadcast",
                                                name: "indexMonitorCommonBroadcast",
                                                component: MonitorCommonBroadcastControllerComponent
                                            },
                                            {
                                                path: "/index/community/internet/monitor/common/monitorView",
                                                name: "indexMonitorCommonMonitorView",
                                                component: MonitorCommonMonitorViewControllerComponent
                                            },
                                            {
                                                path: "/index/community/internet/monitor/common/fireDetection",
                                                name: "indexMonitorCommonFireDetection",
                                                component: MonitorCommonFireDetectionControllerComponent
                                            },
                                            {
                                                path: "/index/community/internet/monitor/common/parkDetection",
                                                name: "indexMonitorCommonParkDetection",
                                                component: MonitorCommonParkDetectionControllerComponent
                                            },
                                            {
                                                path: "/index/community/internet/monitor/common/fireTruckSaveMe",
                                                name: "indexMonitorCommonFireTruckSaveMe",
                                                component: FactoryTransportAccidentRecordComponentCCC
                                            },
                                            {
                                                path: "/index/community/internet/monitor/common/fireRecord",
                                                name: "indexMonitorCommonFireRecord",
                                                component: FactoryTransportAccidentRecordComponentRR
                                            },
                                        ]
                                    },
                                ]
                            },

                            {
                                path: "/index/community/internet/scene",
                                name: "indexScene",
                                component: {render: (e) => e("router-view")},
                                children: [
                                    {
                                        path: "/index/community/internet/scene/common",
                                        name: "indexSceneCommon",
                                        component: {render: (e) => e("router-view")},
                                        children: [
                                            {
                                                path: "/index/community/internet/scene/common/gate",
                                                name: "indexSceneCommonGateControllerComponent",
                                                component: SceneCommonGateControllerComponent
                                            },
                                        ]
                                    },
                                ]
                            },
                        ]
                    },

                    // search
                    {
                        path: "/index/community/search",
                        name: "indexSearch",
                        component: {render: (e) => e("router-view")},
                        children: [{
                            path: "/index/community/search/information",
                            name: "indexInformation",
                            component: {render: (e) => e("router-view")},
                            children: [
                                {
                                    path: "/index/community/search/information/common",
                                    name: "indexInformationCommon",
                                    component: {render: (e) => e("router-view")},
                                    children: [
                                        {
                                            path: "/index/community/search/information/common/resident",
                                            name: "indexInformationCommonResident",
                                            component: InformationCommonResidentControllerComponent
                                        },
                                    ]
                                },
                            ]
                        },]
                    },


                ]

            },

            // 学校
            {
                path: "/index/school",
                name: "indexSchool",
                component: SchoolComponent,
                redirect: '/index/school/supervise',
                children: [
                    {
                        path: "/index/school/home",
                        name: "indexSchoolHome",
                        component: SchoolHomeControllerComponent,
                        redirect: '/index/school/supervise',
                    },
                    {
                        path: "/index/school/supervise",
                        name: "indexSchoolSupervise",
                        component: SchoolSuperviseControllerComponent,
                    },


                ]
            },

            // 化工厂
            {
                path: "/index/factory",
                name: "indexFactory",
                component: FactoryComponent,
                redirect: '/index/factory/transport/path/live',
                children: [
                    // {
                    //     path: "/index/factory/home",
                    //     name: "indexFactoryHome",
                    //     component: FactoryHomeControllerComponent,
                    // },
                    // {
                    //     path: "/index/factory/car",
                    //     name: "indexFactoryCar",
                    //     component: FactoryCarControllerComponent,
                    // },
                    {
                        path: "/index/factory/transport",
                        name: "indexFactoryTransport",
                        component: {render: (e) => e("router-view")},
                        redirect: '/index/factory/transport/path/live',
                        children: [
                            {
                                path: "/index/factory/transport/path",
                                name: "indexFactoryTransportPath",
                                component: {render: (e) => e("router-view")},
                                redirect: '/index/factory/transport/path/live',
                                children: [
                                    {
                                        path: "/index/factory/transport/path/live",
                                        name: "indexFactoryTransportPathLive",
                                        component: FactoryTransportPathLiveControllerComponent,
                                    },
                                    {
                                        path: "/index/factory/transport/path/history",
                                        name: "indexFactoryTransportPathHistory",
                                        component: FactoryTransportPathHistoryControllerComponent,
                                    },
                                ]
                            },
                            {
                                path: "/index/factory/transport/accident",
                                name: "indexFactoryTransportAccident",
                                component: {render: (e) => e("router-view")},
                                redirect: '/index/factory/transport/path/live',
                                children: [
                                    {
                                        path: "/index/factory/transport/accident/record",
                                        name: "indexFactoryTransportAccidentRecord",
                                        component: FactoryTransportAccidentRecordComponent,
                                    }
                                ]
                            }
                        ]
                    },
                ]
            },

        ]
    },

    // 车库路由
    {
        path: "/garage",
        name: "garage",
        component: GaragePage,
        children: [
            {
                path: "/garage/home",
                name: "garageHome",
                component: GarageHomeControllerComponent,

            },
            {
                path: "/garage/governance",
                name: "garageGovernance",
                component: {render: (e) => e("router-view")},
                children: [
                    {
                        path: "/garage/governance/facility",
                        name: "garageGovernanceFacility",
                        component: {render: (e) => e("router-view")},
                        children: [
                            {
                                path: "/garage/governance/facility/lifter",
                                name: "garageGovernanceFacilityLifter",
                                component: GarageGovernanceFacilityLifterControllerComponent,

                            },
                            {
                                path: "/garage/governance/facility/light",
                                name: "garageGovernanceFacilityLight",
                                component: GarageGovernanceFacilityLightControllerComponent,

                            },
                            {
                                path: "/garage/governance/facility/parkingSpace",
                                name: "garageGovernanceFacilityParkingSpace",
                                component: GarageGovernanceFacilityParkingSpaceControllerComponent,

                            },
                        ]
                    },
                    {
                        path: "/garage/governance/monitor",
                        name: "garageGovernanceMonitor",
                        component: {render: (e) => e("router-view")},
                        children: [
                            {
                                path: "/garage/governance/monitor/gate",
                                name: "garageGovernanceMonitorGate",
                                component: GarageGovernanceMonitorGateControllerComponent,

                            },

                        ]
                    },
                ]
            },
            {
                path: "/garage/car",
                name: "garageCar",
                component: {render: (e) => e("router-view")},
                children: [
                    {
                        path: "/garage/car/information",
                        name: "garageCarInformation",
                        component: {render: (e) => e("router-view")},
                        children: [
                            {
                                path: "/garage/car/information/position",
                                name: "garageCarInformationPosition",
                                component: GarageCarInformationPositionControllerComponent
                            },
                        ]
                    },
                ]
            },

        ]
    },
]

const router = new VueRouter({
    mode: 'hash',
    routes: routes
})

router.beforeEach(async (to, from, next) => {
    //各级权限可访问的路由名列表(0-管理员，1-街道，2-居委会，3-网格管理员，4-网格员,5-无需检查权限)
    let lists = [
        //0-管理员
        [/^admin$/, /^admin/],

        //1-街道
        [/^index$/, /^indexHome$/, /^indexOther[\s\S]*$/, /^index[\s\S]*Street/, /^index[\s\S]*Common/, /^indexSchool/, /^garage/, /^indexOverview/, /^indexFactory/],

        //2-居委会
        [/^index$/, /^indexHome$/, /^indexOther[\s\S]*$/, /^indexProcessCommittee/, /^index[\s\S]*Common/, /^indexSchool/, /^indexOverview/, /^indexFactory/, /^garage/],

        //3-网格管理员
        [/^index$/, /^indexHome$/, /^indexOther[\s\S]*$/, /^indexProcessCell/, /^index[\s\S]*Common/, /^indexSchool/, /^indexOverview/, /^indexFactory/, /^garage/],

        //4-网格员
        [/^index$/, /^indexHome$/, /^indexOther[\s\S]*$/, /^indexProcessGrid/, /^index[\s\S]*Common/, /^indexSchool/, /^indexOverview/, /^indexFactory/, /^garage/],

        //5-无需检查权限
        [/^login$/, /^test/]
    ]

    if (_.last(lists).findIndex(reg => reg.test(to.name)) === -1) {
        // 非free页面、
        // 浏览器存储的token
        let token = localStorage.getItem('community_token')

        if (!token || _.isEmpty(token)) {
            // token不存在则直接跳转登录界面
            next({name: "login"})

        } else {
            // 根据token获取用户信息
            let params = common.packagingAxiosParam({token})
            let {data: userInfo} = await Vue.prototype.$axios.post('/user/getUserByToken', params)

            if (!userInfo) {
                // 用户信息不存在跳转登录界面
                next({name: "login"})
            } else {

                // 根路径重定向
                if (to.path === "/") {
                    if (userInfo.power === 0) {
                        // 跳转管理员主页
                        next({name: "admin"})
                    } else {
                        // 跳转用户主页
                        next({name: "index"})
                    }
                } else if (lists[userInfo.power].findIndex(reg => reg.test(to.name)) === -1) {
                    //访问页面无权限跳转登录界面
                    next({name: "login"})
                } else {
                    //有权限放行
                    //更新vuex中的值
                    store.commit('userAbout/setUserInfo', userInfo)
                    store.commit('userAbout/setAreaInfo', userInfo.area)

                    next()
                }
            }
        }
    } else {
        // free页面
        next()
    }
})


export default router
