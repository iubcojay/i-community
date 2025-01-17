<template>
  <SideBarComponent>
    <ModelInfoLeftComponent
        v-show="ifSideBarShow.ifLeftPanelShow"
        slot="leftPanel"
    ></ModelInfoLeftComponent>
    <ModelInfoRightComponent
        v-show="ifSideBarShow.ifRightPanelShow"
        slot="rightPanel"
    >
    </ModelInfoRightComponent>
  </SideBarComponent>
</template>

<script>
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent.vue";


import {mapState} from "vuex";
import ModelInfoLeftComponent from "@/views/index/community/other/model-info/side/ModelInfoLeftComponent.vue";
import ModelInfoRightComponent from "@/views/index/community/other/model-info/side/ModelInfoRightComponent.vue";

export default {
  name: "ModelInfoControllerComponent",
  components: {
    ModelInfoRightComponent,
    ModelInfoLeftComponent,
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
