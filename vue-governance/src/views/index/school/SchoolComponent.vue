<template>
<!--  <scene-component-->
  <!--      menuTitle="智慧社区综合治理平台"-->
  <!--      :userMenuList="userMenuList"-->
  <!--      position="齐鲁软件学院"-->
  <!--      :username="userInfo.username"-->
  <!--  ></scene-component>-->
  <!--  -->
  <scene-component
      menuTitle="智慧社区综合治理平台"
      :userMenuList="userMenuList"
      position=""
      :username="userInfo.username"
  ></scene-component>
</template>

<script>
import SceneComponent from "@/views/index/frame/scene/SceneComponent";
import {mapMutations, mapState} from "vuex";

export default {
  name: "SchoolComponent",
  components: {
    SceneComponent,
  },
  data() {
    return {
      // community
      menuList: [
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

      userMenuList: [],
      tilesetRef: "tileset_school",
    };
  },
  computed: {
    ...mapState("userAbout", ["userInfo", "areaInfo"]),
  },
  methods: {
    ...mapMutations("menuAbout", ["setIfBottomMenuFold"]),
    initComp() {
      this.initUserMenuList();
      this.initTilesetModel();
      this.restrictZoomDistance();
      this.setIfBottomMenuFold(true);
    },
    initUserMenuList() {
      const power = this.userInfo.power;
      this.userMenuList = [];
      this.userMenuList.push(...this.menuList[power - 1]);
    },
    restrictZoomDistance() {
      window.myEarth.setMinMaxZoomDistance(10, 700);
    },

    initTilesetModel() {
      window.myEarth.pushEntityToEarth(this.tilesetRef, {
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
      });
    },


  },
  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    window.myEarth.clearEntities();
  },
};
</script>

<style lang="less" scoped></style>
