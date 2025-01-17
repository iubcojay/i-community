<template>
  <div id="garage_container" ref="garage_container">
    <div v-if="ready" class="garage_wrapper_container">
      <Lifter v-for="lifter of lifters" :key="lifter.id" :info="lifter" />
    </div>
  </div>
</template>

<script>
import Garage from "@/views/garage.back1/utils/Garage.js";
// import Garage from "@/assets/js/threejs/Garage.js";
import Lifter from "./Lifter/index";

import { mapState, mapActions } from "vuex";

export default {
  components: {
    Lifter,
  },
  data() {
    return {
      ready: false,
        alarmInfoList: [],
        askInterval: 2
    };
  },
  computed: {
    ...mapState("garageAbout", ["lifters"]),
  },

  methods: {
    ...mapActions("garageAbout", ["setGarageReady"]),
    initComp() {
      this.addGarage();
      this.ready = true;
    },
    destroyComp() {
      this.removeGarage();
    },

    addGarage() {
      const garage = new Garage({
        scene: window.garageScene,
      });
      garage.initModel();
      window.garage = garage;
      console.log(window.garage);
      garage.activeGarage(this.askInterval)
      this.setGarageReady(true);
    },



    removeGarage() {
      window.garage?.destroyGarage();
      this.setGarageReady(false);
    },
  },

  mounted() {
    this.initComp();
  },

  destroyed() {
    this.destroyComp();
  },
};
</script>

<style lang="less" scoped>
#garage_container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
</style>
