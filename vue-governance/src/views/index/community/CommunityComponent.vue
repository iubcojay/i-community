<template>
  <scene-component
      menuTitle="智慧社区综合治理平台"
      :userMenuList="userMenuList"
      :position="areaInfo.name"
      :username="userInfo.username"
  ></scene-component>
</template>

<script>
import SceneComponent from "@/views/index/frame/scene/SceneComponent";
import {mapState} from "vuex";

export default {
  name: "CommunityComponent",
  components: {
    SceneComponent,
  },
  data() {
    return {
      // community
      menuList: [
        [
          {
            text: "社区概况",
            iconClass: "icon-home",
            defaultPath: "/index/community/home",
            subList: [
              {
                text: "模型信息",
                path: "/index/community/other/model_info",
                subList: [],
              },
              {
                text: "人员信息",
                path: "/index/community/search/information/common/resident",
                subList: [],
              }
            ]
          },
          {
            text: "社区治理",
            iconClass: "icon-manage",
            defaultPath: "/index/community/governance/process/street/taskAdd",
            subList: [
              {
                text: "矛盾纠纷",
                subList: [
                  {
                    text: "调解进度",
                    path: "/index/community/governance/dispute/common/check",
                  }
                ],
              },
              {
                text: "社区巡检记录",
                path: "/index/community/governance/patrol/common/gridMan",
                subList: [],
              },
              {
                text: "任务派发",
                path: "/index/community/governance/process/street/taskAdd",
                subList: [],
              },
              {
                text: "任务列表",
                path: "/index/community/governance/process/street/progress",
                subList: [],
              },

            ],
          },
          {
            text: "社区监控",
            iconClass: "icon-data-search",
            defaultPath: "/index/community/entity/facility/common",
            subList: [
              {
                text: "设备管理",
                path: "/index/community/entity/facility/common",
                subList: [
                  // {
                  //   text: "设备状态信息",
                  //   path: "/index/community/entity/facility/common",
                  // },
                  // {
                  //   text: "摄像头监控画面展示",
                  //   path: "/index/community/internet/monitor/common/broadcast",
                  // },
                ],
              },
              {
                text: "地下车库",
                subList: [],
                path: "/garage/home",
              },
              { //补充
                text: "事故回放",
                subList: [],
                path: "/index/community/internet/monitor/common/fireRecord",
              },
              {
                text: "实时监控",
                subList: [
                  {
                    text: "监控查看",
                    subList: [],
                    path: "/index/community/internet/monitor/common/monitorView"
                  },
                  {
                    text: "火灾检测",
                    path:
                        "/index/community/internet/monitor/common/fireDetection",
                  },
                  {
                    text: "违停检测",
                    path:
                        "/index/community/internet/monitor/common/parkDetection",
                  },
                  {
                    text: "无人机巡航",
                    path: "/index/community/governance/patrol/common/drone",
                  },
                ],
              },
              // {
              //     text: "重点人员监管",
              //     subList: [],
              //     path:"",
              // }

            ],
          },
        ],
        [
          {
            text: "社区概况",
            iconClass: "icon-home",
            defaultPath: "/index/community/home",
            subList: [
              {
                text: "模型信息",
                path: "/index/community/other/model_info",
                subList: [],
              },
              {
                text: "人员信息",
                path: "/index/community/search/information/common/resident",
                subList: [],
              }
            ]
          },
          {
            text: "社区治理",
            iconClass: "icon-manage",
            defaultPath: "/index/community/governance/process/committee/taskReceive",
            subList: [
              {
                text: "社区巡检记录",
                path: "/index/community/governance/patrol/common/gridMan",
                subList: [],
              },
              {
                text: "社区工作",
                subList: [
                  {
                    text: "接受任务",
                    path:
                        "/index/community/governance/process/committee/taskReceive",
                  },
                  {
                    text: "下发任务",
                    path:
                        "/index/community/governance/process/committee/taskDistribution",
                  },
                  {
                    text: "任务进度",
                    path:
                        "/index/community/governance/process/committee/progress",
                  },
                ],
              },
            ],
          },
          {
            text: "社区监控",
            iconClass: "icon-data-search",
            defaultPath: "/index/community/entity/facility/common",
            subList: [
              {
                text: "设备管理",
                path: "/index/community/entity/facility/common",
                subList: [],
              },
              {
                text: "地下车库",
                subList: [],
                path: "/index/community/governance/information/common/resident",
              },
              {
                text: "事故回放",
                subList: [],
                path: "/index/community/internet/monitor/common/fireRecord",
              },
            ],
          },
        ],
        // [
        //     {
        //         text: "社区治理",
        //         iconClass: "icon-manage",
        //         defaultPath:
        //             "/index/community/governance/process/committee/taskReceive",
        //         subList: [
        //             {
        //                 text: "社区巡检记录",
        //                 path: "/index/community/governance/patrol/common/gridMan",
        //                 subList: [],
        //             },
        //             {
        //                 text: "社区工作",
        //                 subList: [
        //                     {
        //                         text: "接受任务",
        //                         path:
        //                             "/index/community/governance/process/committee/taskReceive",
        //                     },
        //                     {
        //                         text: "下发任务",
        //                         path:
        //                             "/index/community/governance/process/committee/taskDistribution",
        //                     },
        //                     {
        //                         text: "任务进度",
        //                         path:
        //                             "/index/community/governance/process/committee/progress",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         text: "多源信息",
        //         iconClass: "icon-data-search",
        //         defaultPath: "/index/community/search/information/common/resident",
        //         subList: [
        //             // {
        //             //     text: "统计信息",
        //             //     subList: [],
        //             // },
        //             {
        //                 text: "详细信息",
        //                 subList: [
        //                     {
        //                         text: "居民查询",
        //                         path:
        //                             "/index/community/governance/information/common/resident",
        //                     },
        //                     {
        //                         text: "房屋查询",
        //                         path:
        //                             "/index/community/governance/information/common/building",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         text: "智慧管控",
        //         iconClass: "icon-nerve",
        //         defaultPath: "/index/community/internet/monitor/common/broadcast",
        //         subList: [
        //             {
        //                 text: "社区监控",
        //                 subList: [
        //                     {
        //                         text: "实时监控",
        //                         path: "/index/community/internet/monitor/common/broadcast",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         text: "设施管理",
        //         iconClass: "icon-fix",
        //         defaultPath: "/index/community/entity/facility/common",
        //         subList: [
        //             {
        //                 text: "线路设施",
        //                 subList: [
        //                     {
        //                         text: "水管",
        //                         path: "",
        //                     },
        //                     {
        //                         text: "电缆",
        //                         path: "",
        //                     },
        //                     {
        //                         text: "光缆",
        //                         path: "",
        //                     },
        //                     {
        //                         text: "天然气",
        //                         path: "",
        //                     },
        //                 ],
        //             },
        //             {
        //                 text: "公共设施",
        //                 path: "/index/community/entity/facility/common",
        //                 subList: [],
        //             },
        //         ],
        //     },
        // ],
        [
          {
            text: "社区概况",
            iconClass: "icon-home",
            defaultPath: "/index/community/home",
            subList: [
              {
                text: "模型信息",
                path: "/index/community/other/model_info",
                subList: [],
              },
              {
                text: "人员信息",
                path: "/index/community/search/information/common/resident",
                subList: [],
              }
            ]
          },
          {
            text: "社区治理",
            iconClass: "icon-manage",
            defaultPath: "/index/community/governance/process/cell/taskReceive",
            subList: [
              {
                text: "社区巡检记录",
                path: "/index/community/governance/patrol/common/gridMan",
                subList: [],
              },
              {
                text: "社区工作",
                subList: [
                  {
                    text: "接受任务",
                    path:
                        "/index/community/governance/process/cell/taskReceive",
                  },
                  {
                    text: "下发任务",
                    path:
                        "/index/community/governance/process/cell/taskDistribution",
                  },
                  {
                    text: "任务进度",
                    path:
                        "/index/community/governance/process/cell/progress",
                  },
                ],
              },
            ],
          },
          {
            text: "社区监控",
            iconClass: "icon-data-search",
            defaultPath: "/index/community/entity/facility/common",
            subList: [
              {
                text: "设备管理",
                path: "/index/community/entity/facility/common",
                subList: [],
              },
              {
                text: "地下车库",
                subList: [],
                path: "/index/community/governance/information/common/resident",
              },
              {
                text: "事故回放",
                subList: [],
                path: "/index/community/internet/monitor/common/fireRecord",
              },
            ],
          },
        ],
        // [
        //     {
        //         text: "社区治理",
        //         iconClass: "icon-manage",
        //         defaultPath: "/index/community/governance/process/cell/taskReceive",
        //         subList: [
        //             {
        //                 text: "社区巡查",
        //                 subList: [
        //                     {
        //                         text: "网格员巡查",
        //                         path: "/index/community/process/street/taskAdd",
        //                     },
        //                     {
        //                         text: "无人机巡航",
        //                         path: "/index/community/patrol/common/drone",
        //                     },
        //                 ],
        //             },
        //             {
        //                 text: "社区工作",
        //                 subList: [
        //                     {
        //                         text: "接受任务",
        //                         path:
        //                             "/index/community/governance/process/cell/taskReceive",
        //                     },
        //                     {
        //                         text: "下发任务",
        //                         path:
        //                             "/index/community/governance/process/cell/taskDistribution",
        //                     },
        //                     {
        //                         text: "任务进度",
        //                         path: "/index/community/governance/process/cell/progress",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         text: "多源信息",
        //         iconClass: "icon-data-search",
        //         defaultPath: "/index/community/search/information/common/resident",
        //         subList: [
        //             {
        //                 text: "统计信息",
        //                 subList: [],
        //             },
        //             {
        //                 text: "详细信息",
        //                 subList: [
        //                     {
        //                         text: "居民查询",
        //                         path: "/index/community/search/information/common/resident",
        //                     },
        //                     {
        //                         text: "房屋查询",
        //                         path: "/index/community/search/information/common/building",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         text: "智慧管控",
        //         iconClass: "icon-nerve",
        //         defaultPath: "/index/community/internet/monitor/common/broadcast",
        //         subList: [
        //             {
        //                 text: "社区监控",
        //                 subList: [
        //                     {
        //                         text: "实时监控",
        //                         path: "/index/community/internet/monitor/common/broadcast",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         text: "设施管理",
        //         iconClass: "icon-fix",
        //         defaultPath: "/index/community/entity/facility/common",
        //         subList: [
        //             {
        //                 text: "线路设施",
        //                 subList: [
        //                     {
        //                         text: "水管",
        //                         path: "",
        //                     },
        //                     {
        //                         text: "电缆",
        //                         path: "",
        //                     },
        //                     {
        //                         text: "光缆",
        //                         path: "",
        //                     },
        //                     {
        //                         text: "天然气",
        //                         path: "",
        //                     },
        //                 ],
        //             },
        //             {
        //                 text: "公共设施",
        //                 path: "/index/community/entity/facility/common",
        //                 subList: [],
        //             },
        //         ],
        //     },
        // ],
        [
          {
            text: "社区概况",
            iconClass: "icon-home",
            defaultPath: "/index/community/home",
            subList: [
              {
                text: "模型信息",
                path: "/index/community/other/model_info",
                subList: [],
              },
              {
                text: "人员信息",
                path: "/index/community/search/information/common/resident",
                subList: [],
              }
            ]
          },
          {
            text: "社区治理",
            iconClass: "icon-manage",
            defaultPath: "/index/community/governance/process/grid/taskReceive",
            subList: [
              {
                text: "社区工作",
                subList: [
                  {
                    text: "接受任务",
                    path:
                        "/index/community/governance/process/grid/taskReceive",
                  },
                  {
                    text: "提交任务",
                    path: "/index/community/governance/process/grid/taskFinish",
                  },
                ],
              },
            ],
          },
          {
            text: "社区监控",
            iconClass: "icon-data-search",
            defaultPath: "/index/community/entity/facility/common",
            subList: [
              {
                text: "设备管理",
                path: "/index/community/entity/facility/common",
                subList: [],
              },
              {
                text: "地下车库",
                subList: [],
                path: "/index/community/governance/information/common/resident",
              },
              {
                text: "事故回放",
                subList: [],
                path: "/index/community/internet/monitor/common/fireRecord",
              },
            ],
          },
        ],

        // [
        //     {
        //         text: "社区治理",
        //         iconClass: "icon-manage",
        //         defaultPath: "/index/community/governance/process/grid/taskReceive",
        //         subList: [
        //             {
        //                 text: "社区巡查",
        //                 subList: [
        //                     {
        //                         text: "网格员巡查",
        //                         path: "",
        //                     },
        //                     {
        //                         text: "无人机巡航",
        //                         path: "/index/community/governance/patrol/common/drone",
        //                     },
        //                 ],
        //             },
        //             {
        //                 text: "社区工作",
        //                 subList: [
        //                     {
        //                         text: "接受任务",
        //                         path:
        //                             "/index/community/governance/process/grid/taskReceive",
        //                     },
        //                     {
        //                         text: "提交任务",
        //                         path: "/index/community/governance/process/grid/taskFinish",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         text: "多源信息",
        //         iconClass: "icon-data-search",
        //         defaultPath:
        //             "/index/community/governance/information/common/resident",
        //         subList: [
        //             {
        //                 text: "统计信息",
        //                 subList: [],
        //             },
        //             {
        //                 text: "详细信息",
        //                 subList: [
        //                     {
        //                         text: "居民查询",
        //                         path:
        //                             "/index/community/governance/information/common/resident",
        //                     },
        //                     {
        //                         text: "房屋查询",
        //                         path:
        //                             "/index/community/governance/information/common/building",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         text: "智慧管控",
        //         iconClass: "icon-nerve",
        //         defaultPath: "/index/community/internet/monitor/common/broadcast",
        //         subList: [
        //             {
        //                 text: "社区监控",
        //                 subList: [
        //                     {
        //                         text: "实时监控",
        //                         path: "/index/community/internet/monitor/common/broadcast",
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        //     {
        //         text: "设施管理",
        //         iconClass: "icon-fix",
        //         defaultPath: "/index/community/internet/facility/common",
        //         subList: [
        //             {
        //                 text: "线路设施",
        //                 subList: [
        //                     {
        //                         text: "水管",
        //                         path: "",
        //                     },
        //                     {
        //                         text: "电缆",
        //                         path: "",
        //                     },
        //                     {
        //                         text: "光缆",
        //                         path: "",
        //                     },
        //                     {
        //                         text: "天然气",
        //                         path: "",
        //                     },
        //                 ],
        //             },
        //             {
        //                 text: "公共设施",
        //                 path: "/index/community/entity/facility/common",
        //                 subList: [],
        //             },
        //         ],
        //     },
        // ],
      ],

      userMenuList: [],
      tilesetRef: "tileset_community",
    };
  },
  computed: {
    ...mapState("userAbout", ["userInfo", "areaInfo"]),
  },
  methods: {
    initComp() {
      this.initUserMenuList();
      this.initTilesetModel();
      this.initPosition();
      this.restrictZoomDistance();
    },
    initUserMenuList() {
      const power = this.userInfo.power;
      this.userMenuList = this.menuList[power - 1];
    },
    restrictZoomDistance() {
      window.myEarth.setMinMaxZoomDistance(10, 700);
    },

    initPosition() {
      if (this.$store.state.regionAbout.currentRegion.name === "历下区") {
        // 视角从中国移入历下区上空

        window.myEarth.flyToPosition(
            [2.042793850105076, 0.6398969081167519, 0],
            700,
            [(0 * Math.PI) / 180, (-45 * Math.PI) / 180, 0],
            0.5
        );
      } else {
        window.myEarth.flyToPosition(
            [2.0440507659601534, 0.6401498384645479, 0],
            80000,
            [0, (-90 * Math.PI) / 180, 0],
            0
        );
      }

      this.$store.commit("regionAbout/setCurrentRegion", {
        name: "community",
      });
    },

    initTilesetModel() {
      window.myEarth.pushEntityToEarth(this.tilesetRef, {
        xbsjType: "Tileset",
        name: "解放路社区",
        url: this.$StaticResourceAddress + "/model/jiefanglu50_50/tileset.json",
        // "maximumScreenSpaceError": 16,
        maximumScreenSpaceError: 256,
        // "maximumMemoryUsage": 512,
        maximumMemoryUsage: 2000,
        // "dynamicScreenSpaceError": true,
        xbsjPosition: [
          2.042793850105076,
          0.6398969081167519,
          -44.292701710019195,
          // -50.17252211621494
        ],
        xbsjUseOriginTransform: false,
        xbsjClippingPlanes: {},
        xbsjCustomShader: {},
      });
    },
  },
  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    window.myEarth.restoreEarth();
  },
};
</script>

<style lang="less" scoped></style>
