<template>
  <div id="index_panel">
    <div v-if="ifEarthInit" class="router_main_panel">
      <router-view></router-view>
    </div>
    <CesiumEarthComponent @earthReady="earthReady" @earthDestroy="earthDestroy"></CesiumEarthComponent>
    <loading-component v-show="loading.show" :message="loading.message"></loading-component>
  </div>
</template>

<script>
import CesiumEarthComponent from "@/views/common/cesium/CesiumEarthComponent";
import LoadingComponent from "@/views/index/frame/tip/LoadingComponent";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  name: "IndexPage",
  components: { CesiumEarthComponent, LoadingComponent },
  data() {
    return {};
  },
  methods: {
    ...mapMutations("cesiumAbout", ["setIfEarthInit"]),
    initPage() {
      document.title = "社会治理数字孪生系统";
    },

    earthReady() {
      this.setIfEarthInit(true);
    },

    earthDestroy(){
      this.setIfEarthInit(false);
    }
  },

  computed: {
    ...mapState("userAbout", ["userInfo", "areaInfo"]),
    ...mapState("menuAbout", ["ifMenuShow"]),
    ...mapState("cesiumAbout", ["ifEarthInit"]),
    ...mapState("tipAbout", ["loading"]),
  },

  mounted() {
    this.initPage();
  },

  beforeDestroy() {
    window.myEarth.destroyEarth();
  },
};
</script>

<style scoped lang="less">
#index_panel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: default;

  .router_main_panel {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>
