<template>
  <div class="controller_panel">
    <SideBarComponent style="z-index: 1;">
      <GarageCommonLeftComponent
        v-show="ifSideBarShow.ifLeftPanelShow"
        :sup-methods="leftMethods"
        :sup-data="leftData"
        slot="leftPanel"
      ></GarageCommonLeftComponent>
      <GarageCommonRightComponent
        v-show="ifSideBarShow.ifRightPanelShow"
        :sup-methods="rightMethods"
        :sup-data="rightData"
        slot="rightPanel"
      ></GarageCommonRightComponent>
    </SideBarComponent>

    <garage-common-model-mask-component
      v-if="ifModelMaskShow"
      :mergeTime="5"
      :setModelMarkShow="setModelMarkShow"
    ></garage-common-model-mask-component>
  </div>
</template>

<script>
import SideBarComponent from "@/views/index/frame/controller/side/SideBarComponent";

import { mapState, mapMutations } from "vuex";
import GarageCommonLeftComponent from "@/views/index/community/internet/garage/common/side/GarageCommonLeftComponent";
import GarageCommonRightComponent from "@/views/index/community/internet/garage/common/side/GarageCommonRightComponent";
import GarageCommonModelMaskComponent from "@/views/index/community/internet/garage/common/model/GarageCommonModelMaskComponent";
const uuid = require("uuid");

export default {
  name: "GarageCommonControllerComponent",

  components: {
    GarageCommonRightComponent,
    GarageCommonLeftComponent,
    SideBarComponent,
    GarageCommonModelMaskComponent,
  },

  data() {
    return {
      ifSideBarShow: {
        ifLeftPanelShow: false,
        ifRightPanelShow: false,
      },
      mergeTime: 5,
      ifModelMaskShow: false,
    };
  },

  methods: {
    initComp() {
      this.flyToGarage();
      this.setSideBarShowStatus(false, false);
    },

    setSideBarShowStatus(ifLeftPanelShow, ifRightPanelShow) {
      this.ifSideBarShow.ifLeftPanelShow = ifLeftPanelShow;
      this.ifSideBarShow.ifRightPanelShow = ifRightPanelShow;
    },

    flyToGarage() {
      window.myEarth.flyToPosition(
        [2.0427920420815937, 0.6398831253325514, 6.02491229021964],
        -20,
        [(-30 * Math.PI) / 180, (-90 * Math.PI) / 180, 0],
        5
      );

      this.setModelMarkShow(true);
    },

    setModelMarkShow(val) {
      this.ifModelMaskShow = val;
      if (val) {
        setTimeout(() => {
          document.getElementById("earth_container").style.visibility =
            "hidden";
        }, (this.mergeTime + 2) * 1000);
      } else {
        document.getElementById("earth_container").style.visibility = "visible";
        window.myEarth.initPosition();
      }
    },
  },

  computed: {
    ...mapState("userAbout", ["areaInfo"]),
    leftData() {
      return {};
    },
    leftMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus,
      };
    },

    rightData() {
      return {};
    },

    rightMethods() {
      return {
        setSideBarShowStatus: this.setSideBarShowStatus,
      };
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

<style scoped>
.controller_panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
