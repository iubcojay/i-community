<template>
  <div class="index_garage_panel">
    <ControllerComponent v-if="garageReady">
      <router-view></router-view>
    </ControllerComponent>
    <MenuBarComponent :menu-list="menuList"></MenuBarComponent>
    <Scene></Scene>
  </div>
</template>

<script>
import MenuBarComponent from "@/views/garage.back1/frame/menu/MenuBarComponent";
import ControllerComponent from "@/views/garage.back1/frame/controller/ControllerComponent";
import Scene from "./components/Scene/index";
import { mapState } from "vuex";

export default {
  name: "GaragePage",
  components: { MenuBarComponent, ControllerComponent, Scene },
  data() {
    return {
      ifSceneInit: false,
      ifMenuListInit: true,

      menuList: [
        {
          text: "信息统计",
          iconClass: "icon-data",
          defaultPath: "/garage/home",
          subList: [],
        },
        {
          text: "车库管理",
          iconClass: "icon-fix",
          defaultPath: "/garage/governance/monitor/gate",
          subList: [
            {
              text: "出入监控",
              path: "/garage/governance/monitor/gate",
              subList: [],
            },
            {
              text: "设施管理",
              subList: [
                // {
                //     text: '设备信息',
                //     path: '/garage/entity/facility/information'
                // },
                {
                  text: "道闸远控",
                  path: "/garage/governance/facility/lifter",
                },
                {
                  text: "照明远控",
                  path: "/garage/governance/facility/light",
                },
                {
                  text: "车位查看",
                  path: "/garage/governance/facility/parkingSpace",
                },
              ],
            },
          ],
        },
        {
          text: "车辆管理",
          iconClass: "icon-car",
          defaultPath: "/garage/car/information/position",
          subList: [
            {
              text: "车辆定位",
              path: "/garage/car/information/position",
              subList: [],
            },
          ],
        },
      ],
    };
  },
  computed: {
    ...mapState("garageAbout", ["garageReady"]),
  },
  mounted() {},
  beforeDestroy() {},
};
</script>

<style lang="less" scoped>
.index_garage_panel {
  height: 100%;
  width: 100%;
}
</style>
