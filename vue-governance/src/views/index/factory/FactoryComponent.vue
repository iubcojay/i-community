<template>
  <scene-component
    v-if="ready"
    menuTitle="智慧社区综合治理平台"
    :userMenuList="userMenuList"
    position="中国石化"
    :username="userInfo.username"
  ></scene-component>
</template>

<script>
import SceneComponent from "@/views/index/frame/scene/SceneComponent";
import WSUtil from "@/assets/js/ws/WSUtil.js";
import { mapState, mapMutations } from "vuex";
export default {
  name: "FactoryComponent",
  components: {
    SceneComponent,
  },
  data() {
    return {
      // community
      menuList: new Array(4).fill([
        {
          text: "运输监管",
          iconClass: "icon-manage",
          defaultPath: "/index/factory/transport/path",
          subList: [
            {
              text: "事故分析",
              subList: [
                {
                  text: "事故重现",
                  path: "/index/factory/transport/accident/record",
                },
              ],
            },
            {
              text: "车辆跟踪",
              subList: [
                {
                  text: "历史轨迹",
                  path: "/index/factory/transport/path/history",
                },
                {
                  text: "实时轨迹",
                  path: "/index/factory/transport/path/live",
                },
              ],
            },
          ],
        },
      ]),
      userMenuList: [],
      ready: false,
    };
  },
  computed: {
    ...mapState("userAbout", ["userInfo", "areaInfo"]),
  },
  methods: {
    ...mapMutations("menuAbout", ["setIfBottomMenuFold"]),
    ...mapMutations("factoryAbout", ["setWsConnectInstance"]),
    initComp() {
      this.initUserMenuList();
      this.restrictZoomDistance();
      this.connectSandTable();
      this.hindBottomMenu();
    },
    initUserMenuList() {
      const power = this.userInfo.power;
      this.userMenuList = [];
      this.userMenuList = this.menuList[power - 1];
    },
    restrictZoomDistance() {
      window.myEarth.setMinMaxZoomDistance(10, 5000);
    },

    // 建立ws链接
    async connectSandTable() {
      const wsUtil = new WSUtil(this.$WSAddress + "/factory/sand_table");
      const ws = await wsUtil.create();
      ws.send(
        JSON.stringify({
          tag: "begin",
        })
      );
      this.setWsConnectInstance({ instance: ws });
      this.ready = true;
    },

    hindBottomMenu() {
      this.setIfBottomMenuFold(true);
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
