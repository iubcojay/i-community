<template>
  <SideBarComponent>
    <HomeLeftControllerComponent
      v-show="ifSideBarShow.ifLeftPanelShow"
      slot="leftPanel"
    ></HomeLeftControllerComponent>
    <HomeRightControllerComponent
      v-show="ifSideBarShow.ifRightPanelShow"
      slot="rightPanel"
    >
    </HomeRightControllerComponent>
  </SideBarComponent>
</template>

<script>
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";
import HomeLeftControllerComponent from "@/views/index/community/home/side/HomeLeftComponent";
import HomeRightControllerComponent from "@/views/index/community/home/side/HomeRightComponent";

import { mapState } from "vuex";

export default {
  name: "HomeControllerComponent",
  components: {
    HomeRightControllerComponent,
    HomeLeftControllerComponent,
    SideBarComponent,
  },
  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false,
      },
    };
  },

  methods: {
    initComp() {
      this.setSideBarShowStatus(true, true);
      console.log("home");
      window.myEarth.initCommunityPosition(this.areaInfo);
      window.myEarth.setMinMaxZoomDistance(10, 700);
    },

    setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
      this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow;
      this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow;
    },
  },

  computed: {
    ...mapState("userAbout", ["areaInfo"]),
  },

  mounted() {
    this.initComp();
  },

  beforeDestroy() {
    window.myEarth.clearEntities();
  },
};
</script>

<style scoped></style>
