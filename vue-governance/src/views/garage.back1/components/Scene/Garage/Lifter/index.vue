<template>
  <div class="lifter_container">
    <Alarm v-if="alarmShow" :position="positionStyle" />
  </div>
</template>

<script>
import Lifter from "@/views/garage.back1/utils/Lifter.js";
import Alarm from "./Panel/Alarm";
import { Vector3 } from "three";

export default {
  components: {
    Alarm,
  },
  props: ["info"],
  data() {
    return {
      screenPosition: { left: 0, bottom: 0 },
    };
  },
  computed: {
    isRaised() {
      return this.info.isRaised;
    },

    status() {
      return this.info.status;
    },

    positionStyle() {
      return {
        left: this.screenPosition.left + "px",
        bottom: this.screenPosition.bottom + "px",
      };
    },

    alarmShow() {
      return this.info.status === Lifter.LIFTER_STATUS_ANOMALY;
    },
  },
  methods: {
    initComp() {
      this.initLifter();
    },
    destroyComp() {
      this.destroyLifter();
    },

    initLifter() {
      const lifter = new Lifter({
        id: this.info.id,
        cameraPosition: this.info.cameraPosition,
        isRaised: this.info.isRaised,
        name: this.info.name,
        status: this.info.status,
        targetPosition: this.info.targetPosition,
        garage: window.garage,
      });
      if (!window.lifters) {
        window.lifters = [];
      }
      this._lifter = lifter;
      window.lifters.push(lifter);
      this.addPositionListener();
    },

    destroyLifter() {
      this._lifter.destroy();
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
      const vector = new Vector3(...Object.values(this.info.targetPosition));
      vector.y += 1;
      this.screenPosition = window.garageScene.vector32Screen(vector);
    },
  },
  mounted() {
    this.initComp();
  },
  destroyed() {
    this.destroyComp();
  },
  watch: {
    isRaised(value) {
      if (this._lifter) {
        if (value) {
          this._lifter.upLifter();
        } else {
          this._lifter.downLifter();
        }
      }
    },

    // status() {},
  },
};
</script>

<style lang="less" scoped>
.lifter_container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
