<template>
  <Conflict v-if="type === 1" :info="info" :position="positionStyle" />
</template>

<script>
import Conflict from "./Conflict.vue";
import { Vector3 } from "three";

export default {
  components: {
    Conflict,
  },
  props: ["info"],
  data() {
    return {
      screenPosition: { left: 0, bottom: 0 },
    };
  },
  computed: {
    positionArray() {
      return this.info.positionArray;
    },
    type() {
      return this.info.type;
    },
    positionStyle() {
      return {
        left: this.screenPosition.left + "px",
        bottom: this.screenPosition.bottom + "px",
      };
    },
  },
  methods: {
    initComp() {
      this.addPositionListener();
    },
    destroyComp() {
      this.removePositionListener();
    },

    addPositionListener() {
      if (!window.garageScene) {
        return;
      }

      window.garageScene.addRenderFunc(this.vectorPosition2ScreenPosition);
    },

    removePositionListener() {
      window.garageScene.removeRenderFunc(this.vectorPosition2ScreenPosition);
    },

    vectorPosition2ScreenPosition() {
      const vector = new Vector3(...this.positionArray);
      vector.y += 2;
      this.screenPosition = window.garageScene.vector32Screen(vector);
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

<style lang="less" scoped></style>
