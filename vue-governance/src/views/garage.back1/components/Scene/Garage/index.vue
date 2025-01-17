<template>
  <div id="garage_container" ref="garage_container">
    <div v-if="ready" class="garage_wrapper_container">
      <div class="lifter_wrapper">
        <Lifter v-for="lifter of lifters" :key="lifter.id" :info="lifter" />
      </div>
      <div class="light_wrapper">
        <Light v-for="light of lights" :key="light.id" :info="light" />
      </div>
    </div>
  </div>
</template>

<script>
import Garage from "@/views/garage.back1/utils/Garage.js";
import Lifter from "./Lifter/index";
import Light from "./Light/index";

import { mapState, mapActions } from "vuex";

export default {
  components: {
    Lifter,
    Light,
  },
  data() {
    return {
      ready: false,
    };
  },
  computed: {
    ...mapState("garageAbout", ["lifters", "lights", "lightMode"]),
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

  watch: {
    lightMode(value) {
      if (window.garage) {
        window.garage.modelObj.traverse((child) => {
          if (child.name.includes("light")) {
            return;
          }
          const material = child.material;
          if (material) {
            if (value) {
              material.transparent = true;
              material.opacity = 0.05;
            } else {
              material.transparent = true;
              material.opacity = 1;
            }
          }
        });
      }
    },
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

  .garage_wrapper_container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    .lifter_wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .light_wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
