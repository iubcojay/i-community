<template>
  <div class="scene_outer_panel">
    <ControllerComponent>
      <router-view></router-view>
    </ControllerComponent>
    <MenuBarComponent
      v-if="ifMenuListInit"
      v-show="ifMenuShow"
      :menu-list="baseData.menuItemList"
    ></MenuBarComponent>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ControllerComponent from "@/views/index/frame/controller/ControllerComponent";
import MenuBarComponent from "@/views/index/frame/menu/MenuBarComponent";

export default {
  name: "SceneComponent",
  components: {
    ControllerComponent,
    MenuBarComponent,
  },
  props: ["sceneName"],
  data() {
    return {
      baseDataList: [
        {
          scene: "community",
          title: "解放路街道",
          menuItemList: [],
          img: require("@/assets/img/community.png"),
          cesiumObj: {
            xbsjType: "Tileset",
            name: "解放路社区",
            url:
              this.$StaticResourceAddress +
              "/model/jiefanglu50_50/tileset.json",
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
          },
        },
        {
          scene: "school",
          title: "齐鲁软件学院",
          menuItemList: [],
          img: require("@/assets/img/school.png"),
          cesiumObj: {
            xbsjType: "Tileset",
            name: "school",
            url: this.$StaticResourceAddress + "/model/school/tileset.json",
            xbsjPosition: [
              2.044362194751343,
              0.6399695117713349,
              -76.43756864173793,
            ],
            maximumScreenSpaceError: 64,
            maximumMemoryUsage: 2000,
            xbsjUseOriginTransform: false,
            xbsjClippingPlanes: {},
            xbsjCustomShader: {},
          },
        },
      ],

      routerInfoList: [
        // community
        {
          scene: "community",
          menuList: [
            [],
            [
              {
                text: "社区治理",
                iconClass: "icon-manage",
                defaultPath:
                  "/index/community/governance/process/street/taskAdd",
                subList: [
                  {
                    text: "社区巡查",
                    subList: [
                      {
                        text: "网格员巡查",
                        path:
                          "/index/community/governance/patrol/common/gridMan",
                      },
                      {
                        text: "无人机巡航",
                        path: "/index/community/governance/patrol/common/drone",
                      },
                    ],
                  },
                  {
                    text: "社区工作",
                    subList: [
                      {
                        text: "下发任务",
                        path:
                          "/index/community/governance/process/street/taskAdd",
                      },
                      {
                        text: "任务进度",
                        path:
                          "/index/community/governance/process/street/progress",
                      },
                    ],
                  },
                ],
              },
              {
                text: "多源信息",
                iconClass: "icon-data-search",
                defaultPath:
                  "/index/community/search/information/common/resident",
                subList: [
                  {
                    text: "统计信息",
                    subList: [],
                  },
                  {
                    text: "详细信息",
                    subList: [
                      {
                        text: "居民查询",
                        path:
                          "/index/community/search/information/common/resident",
                      },
                      {
                        text: "房屋查询",
                        path:
                          "/index/community/search/information/common/building",
                      },
                    ],
                  },
                ],
              },
              {
                text: "智慧管控",
                iconClass: "icon-nerve",
                defaultPath:
                  "/index/community/internet/monitor/common/broadcast",
                subList: [
                  {
                    text: "地下车库",
                    // path: '/index/community/internet/garage/common',
                    path: "/garage/home",
                    subList: [],
                  },
                  {
                    text: "社区监控",
                    subList: [
                      {
                        text: "路口监控",
                        path:
                          "/index/community/internet/monitor/common/broadcast",
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
                    ],
                  },
                ],
              },
              {
                text: "设施管理",
                iconClass: "icon-fix",
                defaultPath: "/index/community/entity/facility/common",
                subList: [
                  {
                    text: "线路设施",
                    subList: [
                      {
                        text: "水管",
                        path: "",
                      },
                      {
                        text: "电缆",
                        path: "",
                      },
                      {
                        text: "光缆",
                        path: "",
                      },
                      {
                        text: "天然气",
                        path: "",
                      },
                    ],
                  },
                  {
                    text: "公共设施",
                    path: "/index/community/entity/facility/common",
                    subList: [],
                  },
                ],
              },
            ],
            [
              {
                text: "社区治理",
                iconClass: "icon-manage",
                defaultPath:
                  "/index/community/governance/process/committee/taskReceive",
                subList: [
                  {
                    text: "社区巡查",
                    subList: [
                      {
                        text: "网格员巡查",
                        path: "/index/community/process/street/taskAdd",
                      },
                      {
                        text: "无人机巡航",
                        path: "/index/community/patrol/common/drone",
                      },
                    ],
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
                text: "多源信息",
                iconClass: "icon-data-search",
                defaultPath:
                  "/index/community/governance/information/common/resident",
                subList: [
                  {
                    text: "统计信息",
                    subList: [],
                  },
                  {
                    text: "详细信息",
                    subList: [
                      {
                        text: "居民查询",
                        path:
                          "/index/community/governance/information/common/resident",
                      },
                      {
                        text: "房屋查询",
                        path:
                          "/index/community/governance/information/common/building",
                      },
                    ],
                  },
                ],
              },
              {
                text: "智慧管控",
                iconClass: "icon-nerve",
                defaultPath:
                  "/index/community/internet/monitor/common/broadcast",
                subList: [
                  {
                    text: "社区监控",
                    subList: [
                      {
                        text: "实时监控",
                        path:
                          "/index/community/internet/monitor/common/broadcast",
                      },
                    ],
                  },
                ],
              },
              {
                text: "设施管理",
                iconClass: "icon-fix",
                defaultPath: "/index/community/entity/facility/common",
                subList: [
                  {
                    text: "线路设施",
                    subList: [
                      {
                        text: "水管",
                        path: "",
                      },
                      {
                        text: "电缆",
                        path: "",
                      },
                      {
                        text: "光缆",
                        path: "",
                      },
                      {
                        text: "天然气",
                        path: "",
                      },
                    ],
                  },
                  {
                    text: "公共设施",
                    path: "/index/community/entity/facility/common",
                    subList: [],
                  },
                ],
              },
            ],
            [
              {
                text: "社区治理",
                iconClass: "icon-manage",
                defaultPath:
                  "/index/community/governance/process/cell/taskReceive",
                subList: [
                  {
                    text: "社区巡查",
                    subList: [
                      {
                        text: "网格员巡查",
                        path: "/index/community/process/street/taskAdd",
                      },
                      {
                        text: "无人机巡航",
                        path: "/index/community/patrol/common/drone",
                      },
                    ],
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
                text: "多源信息",
                iconClass: "icon-data-search",
                defaultPath:
                  "/index/community/search/information/common/resident",
                subList: [
                  {
                    text: "统计信息",
                    subList: [],
                  },
                  {
                    text: "详细信息",
                    subList: [
                      {
                        text: "居民查询",
                        path:
                          "/index/community/search/information/common/resident",
                      },
                      {
                        text: "房屋查询",
                        path:
                          "/index/community/search/information/common/building",
                      },
                    ],
                  },
                ],
              },
              {
                text: "智慧管控",
                iconClass: "icon-nerve",
                defaultPath:
                  "/index/community/internet/monitor/common/broadcast",
                subList: [
                  {
                    text: "社区监控",
                    subList: [
                      {
                        text: "实时监控",
                        path:
                          "/index/community/internet/monitor/common/broadcast",
                      },
                    ],
                  },
                ],
              },
              {
                text: "设施管理",
                iconClass: "icon-fix",
                defaultPath: "/index/community/entity/facility/common",
                subList: [
                  {
                    text: "线路设施",
                    subList: [
                      {
                        text: "水管",
                        path: "",
                      },
                      {
                        text: "电缆",
                        path: "",
                      },
                      {
                        text: "光缆",
                        path: "",
                      },
                      {
                        text: "天然气",
                        path: "",
                      },
                    ],
                  },
                  {
                    text: "公共设施",
                    path: "/index/community/entity/facility/common",
                    subList: [],
                  },
                ],
              },
            ],
            [
              {
                text: "社区治理",
                iconClass: "icon-manage",
                defaultPath:
                  "/index/community/governance/process/grid/taskReceive",
                subList: [
                  {
                    text: "社区巡查",
                    subList: [
                      {
                        text: "网格员巡查",
                        path: "",
                      },
                      {
                        text: "无人机巡航",
                        path: "/index/community/governance/patrol/common/drone",
                      },
                    ],
                  },
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
                        path:
                          "/index/community/governance/process/grid/taskFinish",
                      },
                    ],
                  },
                ],
              },
              {
                text: "多源信息",
                iconClass: "icon-data-search",
                defaultPath:
                  "/index/community/governance/information/common/resident",
                subList: [
                  {
                    text: "统计信息",
                    subList: [],
                  },
                  {
                    text: "详细信息",
                    subList: [
                      {
                        text: "居民查询",
                        path:
                          "/index/community/governance/information/common/resident",
                      },
                      {
                        text: "房屋查询",
                        path:
                          "/index/community/governance/information/common/building",
                      },
                    ],
                  },
                ],
              },
              {
                text: "智慧管控",
                iconClass: "icon-nerve",
                defaultPath:
                  "/index/community/internet/monitor/common/broadcast",
                subList: [
                  {
                    text: "社区监控",
                    subList: [
                      {
                        text: "实时监控",
                        path:
                          "/index/community/internet/monitor/common/broadcast",
                      },
                    ],
                  },
                ],
              },
              {
                text: "设施管理",
                iconClass: "icon-fix",
                defaultPath: "/index/community/internet/facility/common",
                subList: [
                  {
                    text: "线路设施",
                    subList: [
                      {
                        text: "水管",
                        path: "",
                      },
                      {
                        text: "电缆",
                        path: "",
                      },
                      {
                        text: "光缆",
                        path: "",
                      },
                      {
                        text: "天然气",
                        path: "",
                      },
                    ],
                  },
                  {
                    text: "公共设施",
                    path: "/index/community/entity/facility/common",
                    subList: [],
                  },
                ],
              },
            ],
          ],
        },
        // school
        {
          scene: "school",
          menuList: [
            [],
            [
              {
                text: "社区治理",
                iconClass: "icon-manage",
                defaultPath: "/index/school/home",
                subList: [],
              },
              {
                text: "多源信息",
                iconClass: "icon-data-search",
                // defaultPath: '/index/search/information/common/resident',
                subList: [],
              },
              {
                text: "智慧管控",
                iconClass: "icon-nerve",
                // defaultPath: '/index/internet/monitor/common/broadcast',
                subList: [],
              },
              {
                text: "设施管理",
                iconClass: "icon-fix",
                // defaultPath: '/index/entity/facility/common',
                subList: [],
              },
            ],
            [
              {
                text: "社区治理",
                iconClass: "icon-manage",
                defaultPath: "/index/school/home",
                subList: [],
              },
              {
                text: "多源信息",
                iconClass: "icon-data-search",
                // defaultPath: '/index/search/information/common/resident',
                subList: [],
              },
              {
                text: "智慧管控",
                iconClass: "icon-nerve",
                // defaultPath: '/index/internet/monitor/common/broadcast',
                subList: [],
              },
              {
                text: "设施管理",
                iconClass: "icon-fix",
                // defaultPath: '/index/entity/facility/common',
                subList: [],
              },
            ],
            [
              {
                text: "社区治理",
                iconClass: "icon-manage",
                defaultPath: "/index/school/home",
                subList: [],
              },
              {
                text: "多源信息",
                iconClass: "icon-data-search",
                // defaultPath: '/index/search/information/common/resident',
                subList: [],
              },
              {
                text: "智慧管控",
                iconClass: "icon-nerve",
                // defaultPath: '/index/internet/monitor/common/broadcast',
                subList: [],
              },
              {
                text: "设施管理",
                iconClass: "icon-fix",
                // defaultPath: '/index/entity/facility/common',
                subList: [],
              },
            ],
            [
              {
                text: "社区治理",
                iconClass: "icon-manage",
                defaultPath: "/index/school/home",
                subList: [],
              },
              {
                text: "多源信息",
                iconClass: "icon-data-search",
                // defaultPath: '/index/search/information/common/resident',
                subList: [],
              },
              {
                text: "智慧管控",
                iconClass: "icon-nerve",
                // defaultPath: '/index/internet/monitor/common/broadcast',
                subList: [],
              },
              {
                text: "设施管理",
                iconClass: "icon-fix",
                // defaultPath: '/index/entity/facility/common',
                subList: [],
              },
            ],
          ],
        },
      ],

      ifMenuListInit: false,
      ifMenuBarVisible: true,
    };
  },
  computed: {
    ...mapState("userAbout", ["userInfo", "areaInfo"]),
    ...mapState("menuAbout", ["ifMenuShow"]),
    baseData() {
      return this.baseDataList.find((item) => item.scene === this.sceneName);
    },
    routerList() {
      return this.routerInfoList.find((item) => item.scene === this.sceneName)
        .menuList;
    },
  },

  methods: {
    initComponent() {
      document.title = "社会治理数字孪生平台";
      this.initBaseData();
      this.initScene();
    },

    initBaseData() {
      const power = this.userInfo.power;
      this.baseData.menuItemList.push(...this.routerList[power]);
      this.ifMenuListInit = true;
    },

    initScene() {
      window.myEarth.pushEntityToEarth(
        "tileset_" + this.sceneName,
        this.baseData.cesiumObj
      );
    },
  },

  mounted() {
    this.initComponent();
  },

  beforeDestroy() {
    window.myEarth.removeEntityFromEarth("tileset_" + this.sceneName);
  },
};
</script>

<style lang="less" scoped>
.scene_outer_panel {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  cursor: default;
}
</style>
